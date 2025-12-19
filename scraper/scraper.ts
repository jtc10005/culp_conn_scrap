import axios from "axios";
import neo4j from "neo4j-driver";
import * as fs from "fs";
import { parsePersonFromPage, type Person, type QueueItem } from "./utils.js";

const BASE_URL = "https://www.culpepperconnections.com/ss/g0/";

// Load Neo4j configuration
const config = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
const driver = neo4j.driver(
  config.NEO4J_URI,
  neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
);

// Scraper configuration from env.json
const BATCH_SIZE = config.BATCH_SIZE || 300;
const SKIP_NEO4J_SAVE =
  config.SKIP_NEO4J_SAVE !== undefined ? config.SKIP_NEO4J_SAVE : false;
const MAX_RECORDS = config.MAX_RECORDS || null; // null = no limit
const SAVE_HTML = config.SAVE_HTML !== undefined ? config.SAVE_HTML : true; // Save HTML files by default

// Create data directory if it doesn't exist
const DATA_DIR = "./data";
if (SAVE_HTML && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Created data directory: ${DATA_DIR}`);
}

// COMMENTED OUT FOR TESTING - Uncomment when ready to save to Neo4j
// Now controlled by SKIP_NEO4J_SAVE in env.json
async function saveBatchToNeo4j(session: neo4j.Session, people: Person[]) {
  // Save all person nodes in the batch
  for (const person of people) {
    await session.run(
      `MERGE (p:Person {id: $id})
       SET p.name = $name,
           p.firstName = $firstName,
           p.middleName = $middleName,
           p.lastName = $lastName,
           p.gender = $gender,
           p.birth = $birth,
           p.birthPlace = $birthPlace,
           p.death = $death,
           p.deathPlace = $deathPlace,
           p.burial = $burial,
           p.burialPlace = $burialPlace,
           p.marriageDate = $marriageDate,
           p.father = $father,
           p.mother = $mother`,
      {
        id: person.id,
        name: person.name,
        firstName: person.firstName || null,
        middleName: person.middleName || null,
        lastName: person.lastName || null,
        gender: person.gender || null,
        birth: person.birth || null,
        birthPlace: person.birthPlace || null,
        death: person.death || null,
        deathPlace: person.deathPlace || null,
        burial: person.burial || null,
        burialPlace: person.burialPlace || null,
        marriageDate: person.marriageDate || null,
        father: person.father || null,
        mother: person.mother || null,
      }
    );
  }

  // Save all relationships in the batch
  for (const person of people) {
    // MERGE spouse relationships (bidirectional, no duplicates)
    for (const spouseId of person.spouses) {
      await session.run(
        `MERGE (p1:Person {id: $id1})
         MERGE (p2:Person {id: $id2})
         MERGE (p1)-[:SPOUSE]-(p2)`,
        { id1: person.id, id2: spouseId }
      );
    }

    // MERGE parent-child relationships from children array (avoids duplicates)
    for (const childId of person.children) {
      await session.run(
        `MERGE (parent:Person {id: $parentId})
         MERGE (child:Person {id: $childId})
         MERGE (parent)-[:PARENT_OF]->(child)`,
        { parentId: person.id, childId }
      );
    }

    // MERGE parent relationships from father/mother fields
    if (person.father) {
      await session.run(
        `MERGE (parent:Person {id: $parentId})
         MERGE (child:Person {id: $childId})
         MERGE (parent)-[:PARENT_OF]->(child)`,
        { parentId: person.father, childId: person.id }
      );
    }

    if (person.mother) {
      await session.run(
        `MERGE (parent:Person {id: $parentId})
         MERGE (child:Person {id: $childId})
         MERGE (parent)-[:PARENT_OF]->(child)`,
        { parentId: person.mother, childId: person.id }
      );
    }
  }
}

/**
 * Crawl all people starting from a root person, saving in batches
 */
async function crawl() {
  console.log("Starting crawl with batch saving...");
  console.log(
    `📊 Configuration: BATCH_SIZE=${BATCH_SIZE}, SKIP_NEO4J=${SKIP_NEO4J_SAVE}, MAX_RECORDS=${MAX_RECORDS || "unlimited"}, SAVE_HTML=${SAVE_HTML}\n`
  );

  const session = driver.session({ database: config.NEO4J_DATABASE });
  const visited = new Set<string>();
  const queue: QueueItem[] = [{ page: "p1.htm", anchor: "i1" }];
  const pageCache = new Map<string, string>();

  const batch: Person[] = [];
  let processed = 0;

  try {
    while (
      queue.length > 0 &&
      (MAX_RECORDS === null || processed < MAX_RECORDS)
    ) {
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

          // Save HTML file if enabled
          if (SAVE_HTML) {
            const filePath = `${DATA_DIR}/${item.page}`;
            fs.writeFileSync(filePath, html, "utf-8");
            console.log(`  💾 Saved ${filePath}`);
          }

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

      // Add to batch
      batch.push(person);
      processed++;

      const nameInfo =
        person.firstName && person.lastName
          ? ` [${person.firstName}${person.middleName ? " " + person.middleName : ""} ${person.lastName}]`
          : "";
      const genderInfo = person.gender ? ` ${person.gender}` : "";
      const birthInfo = person.birth ? ` b:${person.birth}` : "";
      const birthPlaceInfo = person.birthPlace ? ` @${person.birthPlace}` : "";
      const deathInfo = person.death ? ` d:${person.death}` : "";
      const deathPlaceInfo = person.deathPlace ? ` @${person.deathPlace}` : "";
      const burialInfo = person.burial ? ` buried:${person.burial}` : "";
      const marriageInfo = person.marriageDate
        ? ` m:${person.marriageDate}`
        : "";
      const parentsInfo =
        person.father || person.mother
          ? ` parents:${person.father || "?"}+${person.mother || "?"}`
          : "";

      console.log(
        `[${processed}] ${person.name}${nameInfo}${genderInfo} (ID: ${person.id})${birthInfo}${birthPlaceInfo}${deathInfo}${deathPlaceInfo}${burialInfo}${marriageInfo}${parentsInfo} | spouses=${person.spouses.length} children=${person.children.length} | queue=${queue.length} | batch=${batch.length}`
      );

      // Save batch when it reaches BATCH_SIZE
      if (batch.length >= BATCH_SIZE) {
        if (SKIP_NEO4J_SAVE) {
          console.log(
            `\n💾 Skipping save of ${batch.length} people (SKIP_NEO4J_SAVE=true)\n`
          );
        } else {
          console.log(
            `\n💾 Saving batch of ${batch.length} people to Neo4j...`
          );
          await saveBatchToNeo4j(session, batch);
          console.log("✓ Batch saved\n");
        }
        batch.length = 0; // Clear batch
      }

      // Add discovered people to queue
      for (const disc of discovered) {
        const discKey = `${disc.page}#${disc.anchor}`;
        if (!visited.has(discKey)) {
          queue.push(disc);
        }
      }
    }

    // Save any remaining people in the final batch
    if (batch.length > 0) {
      if (SKIP_NEO4J_SAVE) {
        console.log(
          `\n💾 Skipping final batch of ${batch.length} people (SKIP_NEO4J_SAVE=true)`
        );
      } else {
        console.log(
          `\n💾 Saving final batch of ${batch.length} people to Neo4j...`
        );
        await saveBatchToNeo4j(session, batch);
        console.log("✓ Final batch saved");
      }
    }

    console.log("\n=== Crawl Complete ===");
    console.log(
      `Total people processed: ${processed}${MAX_RECORDS ? ` (limited to ${MAX_RECORDS})` : ""}`
    );
    console.log(`Total pages fetched: ${pageCache.size}`);
  } finally {
    await session.close();
  }
}

async function main() {
  try {
    await crawl();
    if (SKIP_NEO4J_SAVE) {
      console.log("\n✓ Crawl complete (Neo4j saving was skipped)");
    } else {
      console.log("\n✓ All data saved to Neo4j");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.close();
  }
}

main();
