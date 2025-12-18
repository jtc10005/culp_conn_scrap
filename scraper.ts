import axios from 'axios';
import neo4j from 'neo4j-driver';
import * as fs from 'fs';
import { parsePersonFromPage, type Person, type QueueItem } from './utils.js';

const BASE_URL = 'https://www.culpepperconnections.com/ss/g0/';

// Load Neo4j configuration
const config = JSON.parse(fs.readFileSync('./env.json', 'utf-8'));
const driver = neo4j.driver(
  config.NEO4J_URI,
  neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
);

/**
 * Crawl all people starting from a root person
 */
async function crawl() {
  console.log('Starting crawl...');

  const people = new Map<string, Person>();
  const visited = new Set<string>();
  const queue: QueueItem[] = [{ page: 'p1.htm', anchor: 'i1' }];
  const pageCache = new Map<string, string>();

  let processed = 0;

  while (queue.length > 0) {
    const item = queue.shift()!;
    const key = `${item.page}#${item.anchor}`;

    if (visited.has(key)) continue;
    visited.add(key);

    // Fetch page (with caching)
    let html: string;
    if (pageCache.has(item.page)) {
      html = pageCache.get(item.page)!;
    } else {
      try {
        console.log(`Fetching ${item.page}...`);
        const res = await axios.get(`${BASE_URL}${item.page}`);
        html = res.data;
        pageCache.set(item.page, html);
        // Small delay to be respectful to the server
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to fetch ${item.page}:`, error);
        continue;
      }
    }

    // Parse person
    const parsed = parsePersonFromPage(html, item.anchor);
    if (!parsed) {
      console.warn(`Person not found: ${key}`);
      continue;
    }

    const { person, discovered } = parsed;
    people.set(person.id, person);
    processed++;

    const nameInfo = person.firstName && person.lastName 
      ? ` [${person.firstName} ${person.lastName}]`
      : '';
    const birthInfo = person.birth ? ` b:${person.birth}` : '';
    const birthPlaceInfo = person.birthPlace ? ` @${person.birthPlace}` : '';
    const deathInfo = person.death ? ` d:${person.death}` : '';
    const deathPlaceInfo = person.deathPlace ? ` @${person.deathPlace}` : '';
    
    console.log(
      `[${processed}] ${person.name}${nameInfo} (ID: ${person.id})${birthInfo}${birthPlaceInfo}${deathInfo}${deathPlaceInfo} | spouses=${person.spouses.length} children=${person.children.length} | queue=${queue.length}`
    );

    // Add discovered people to queue
    for (const disc of discovered) {
      const discKey = `${disc.page}#${disc.anchor}`;
      if (!visited.has(discKey)) {
        queue.push(disc);
      }
    }
  }

  console.log('\n=== Crawl Complete ===');
  console.log(`Total people collected: ${people.size}`);
  console.log(`Total pages fetched: ${pageCache.size}`);

  return people;
}

/**
 * Save all people and relationships to Neo4j
 */
async function saveToNeo4j(people: Map<string, Person>) {
  const session = driver.session({ database: config.NEO4J_DATABASE });

  try {
    console.log('\n=== Saving to Neo4j ===');

    // Clear existing data
    console.log('Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');

    // Create all person nodes
    console.log(`Creating ${people.size} person nodes...`);
    for (const [id, person] of people.entries()) {
      await session.run(
        `CREATE (p:Person {
          id: $id, 
          name: $name, 
          firstName: $firstName,
          lastName: $lastName,
          birth: $birth, 
          birthPlace: $birthPlace,
          death: $death,
          deathPlace: $deathPlace
        })`,
        { 
          id, 
          name: person.name,
          firstName: person.firstName || null,
          lastName: person.lastName || null,
          birth: person.birth || null,
          birthPlace: person.birthPlace || null,
          death: person.death || null,
          deathPlace: person.deathPlace || null
        }
      );
    }

    // Create relationships
    let spouseRelCount = 0;
    let childRelCount = 0;

    console.log('Creating relationships...');
    for (const [id, person] of people.entries()) {
      // Create SPOUSE relationships
      for (const spouseId of person.spouses) {
        if (people.has(spouseId)) {
          await session.run(
            `MATCH (p1:Person {id: $id1})
             MATCH (p2:Person {id: $id2})
             MERGE (p1)-[:SPOUSE]-(p2)`,
            { id1: id, id2: spouseId }
          );
          spouseRelCount++;
        }
      }

      // Create PARENT_OF relationships
      for (const childId of person.children) {
        if (people.has(childId)) {
          await session.run(
            `MATCH (parent:Person {id: $parentId})
             MATCH (child:Person {id: $childId})
             CREATE (parent)-[:PARENT_OF]->(child)`,
            { parentId: id, childId }
          );
          childRelCount++;
        }
      }
    }

    console.log(`\n✓ Created ${people.size} person nodes`);
    console.log(`✓ Created ${spouseRelCount} spouse relationships`);
    console.log(`✓ Created ${childRelCount} parent-child relationships`);
    console.log('\n=== Neo4j Save Complete ===');
  } catch (error) {
    console.error('Error saving to Neo4j:', error);
    throw error;
  } finally {
    await session.close();
  }
}

async function main() {
  try {
    const people = await crawl();
    await saveToNeo4j(people);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await driver.close();
  }
}

main();
