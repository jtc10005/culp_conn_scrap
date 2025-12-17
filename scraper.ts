import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import neo4j from 'neo4j-driver';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

interface Person {
  id: string;          // e.g., "8512"
  name: string;
  birth?: string | undefined;
  death?: string | undefined;
  notes?: string;
  parents: string[];   // person IDs
  spouses: string[];   // person IDs
  children: string[];  // person IDs
  page?: number;       // pXXXX number
}

const NEO4J_URI='neo4j+s://547733c6.databases.neo4j.io';
const NEO4J_USER='neo4j';
const NEO4J_PASSWORD='J1HoqaoP4DUAXoKFsfD-OwHG1ParaecsmLPZd1knilw';
const NEO4J_DATABASE='neo4j';
const AURA_INSTANCEID='547733c6';
const AURA_INSTANCENAME='Free instance';

const BASE_URL = 'https://www.culpepperconnections.com/ss/';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

// Track visited pages and persons to avoid re-processing
const visitedPages = new Set<string>();
const visitedPersons = new Set<string>();

// Crawl queue: { page number, anchor like "i8512" }
const queue: { page: number; anchor: string }[] = [];

// Strong starting points focused on the main Virginia/American Culpepper lines
const STARTING_POINTS = [
  { page: 1,    anchor: 'i1' },     // Henry Culpepper of Lower Norfolk (key progenitor)
  { page: 678,  anchor: 'i678' },   // Robert Culpepper Jr.
  { page: 831,  anchor: 'i831' },   // Henry Culpepper Jr.
  { page: 8395, anchor: 'i8395' },  // John Culpeper the Merchant (English roots)
  { page: 4867, anchor: 'i4867' },  // William of Warren Co., GA
  { page: 1413, anchor: 'i1413' },  // James of Nash Co., NC
  { page: 2253, anchor: 'i2253' },  // Joseph of Morgan Co., GA
  // Add your own known ancestor here if you have the page/anchor!
];

async function fetchPage(pageNum: number): Promise<string> {
  const url = `${BASE_URL}g0/p${pageNum}.htm`;
  const localPath = path.join(DATA_DIR, `p${pageNum}.htm`);

  if (visitedPages.has(url) && fs.existsSync(localPath)) {
    return fs.readFileSync(localPath, 'utf-8');
  }

  console.log(`Fetching: ${url}`);
  try {
    const response = await axios.get(url, { timeout: 30000 });
    fs.writeFileSync(localPath, response.data);
    visitedPages.add(url);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch p${pageNum}.htm:`, (err as Error).message);
    throw err;
  }
}

async function parseAndSavePerson(pageNum: number, anchor: string) {
  // anchor includes the 'i', e.g., "i8512"
  const personId = anchor.replace(/^i/, '');

  if (visitedPersons.has(personId)) return;
  visitedPersons.add(personId);

  const html = await fetchPage(pageNum);
  const $ = cheerio.load(html);

  const personBlock = $(`a[name="${anchor}"]`).closest('tr');
  if (personBlock.length === 0) {
    console.warn(`Anchor ${anchor} not found on page ${pageNum}`);
    return;
  }

  const name = personBlock.find('b').first().text().trim().replace(/^\d+\.\s*/, '');
  const fullText = personBlock.text();

  const relations = { parents: [] as string[], spouses: [] as string[], children: [] as string[] };

  personBlock.find('a[href^="p"]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;

    const match = href.match(/p(\d+)\.htm#i(\d+)/);
    if (!match) return;

    const targetPage = parseInt(match[1]!, 10);
    const targetId = match[2];

    const surrounding = $(el).parent().text().toLowerCase();

    if (surrounding.includes('son of') || surrounding.includes('dau of') || surrounding.includes('child of')) {
      relations.parents.push(targetId!);
    } else if (surrounding.includes('m.') || surrounding.includes('married') || surrounding.includes('spouse')) {
      relations.spouses.push(targetId!);
    } else if (surrounding.includes('children') || $(el).parent().is('ol, ul')) {
      relations.children.push(targetId!);
    } else {
      // fallback: treat as child
      relations.children.push(targetId!);
    }

    // Add to queue for crawling
    queue.push({ page: targetPage, anchor: `i${targetId}` });
  });

  const person: Person = {
    id: personId,
    name,
    birth: extractEvent(fullText, /born/i),
    death: extractEvent(fullText, /died/i),
    notes: fullText.trim(),
    parents: relations.parents,
    spouses: relations.spouses,
    children: relations.children,
    page: pageNum,
  };

  await saveToNeo4j(person);
  console.log(`Saved: ${person.name} (ID: ${person.id})`);
}

function extractEvent(text: string, keyword: RegExp): string | undefined {
  const match = text.match(keyword);
  if (!match) return undefined;

  // Extract the sentence or line containing the keyword
  const sentences = text.split('.');
  const target = sentences.find(s => keyword.test(s));
  return target ? target.trim() + '.' : undefined;
}

async function saveToNeo4j(person: Person) {
  const session = driver.session();

  try {
    // Create or update the Person node
    await session.run(
      `
      MERGE (p:Person {id: $id})
      SET p.name = $name,
          p.birth = $birth,
          p.death = $death,
          p.notes = $notes,
          p.page = $page
      `,
      {
        id: person.id,
        name: person.name,
        birth: person.birth,
        death: person.death,
        notes: person.notes,
        page: person.page,
      }
    );

    // Parents → bidirectional PARENT_OF / CHILD_OF
    for (const parentId of person.parents) {
      await session.run(
        `
        MATCH (child:Person {id: $childId})
        MATCH (parent:Person {id: $parentId})
        MERGE (parent)-[:PARENT_OF]->(child)
        MERGE (child)-[:CHILD_OF]->(parent)
        `,
        { childId: person.id, parentId }
      );
    }

    // Spouses → undirected SPOUSE_OF
    for (const spouseId of person.spouses) {
      await session.run(
        `
        MATCH (p1:Person {id: $id1})
        MATCH (p2:Person {id: $id2})
        MERGE (p1)-[:SPOUSE_OF]-(p2)
        `,
        { id1: person.id, id2: spouseId }
      );
    }

    // Children → same as parents but reversed
    for (const childId of person.children) {
      await session.run(
        `
        MATCH (parent:Person {id: $parentId})
        MATCH (child:Person {id: $childId})
        MERGE (parent)-[:PARENT_OF]->(child)
        MERGE (child)-[:CHILD_OF]->(parent)
        `,
        { parentId: person.id, childId }
      );
    }
  } catch (err) {
    console.error(`Error saving person ${person.id}:`, err);
  } finally {
    await session.close();
  }
}

async function crawl() {
  console.log('Starting Culpepper Connections crawl...');
  queue.push(...STARTING_POINTS);

  while (queue.length > 0) {
    const { page, anchor } = queue.shift()!;

    try {
      await parseAndSavePerson(page, anchor);
    } catch (err) {
      console.error(`Failed processing ${anchor} on page ${page}:`, err);
    }

    // Be polite to the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Crawl complete!');
  await driver.close();
}

// Run the crawler
crawl().catch(err => {
  console.error('Fatal error:', err);
  driver.close();
});