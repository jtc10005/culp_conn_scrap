/**
 * JSON to Neo4j Uploader
 *
 * Reads the genealogy JSON file and uploads all data to Neo4j,
 * REPLACING all existing data in the database.
 */

import * as fs from "fs";
import neo4j from "neo4j-driver";
import type { Person } from "./utils.js";

const JSON_INPUT_FILE = "./data/genealogy-data.json";

interface JsonData {
  metadata: {
    exportDate: string;
    totalPeople: number;
    totalFiles: number;
    source: string;
    sourceLocation: string;
  };
  people: Person[];
}

/**
 * Load and validate the JSON file
 */
function loadJsonData(): JsonData {
  if (!fs.existsSync(JSON_INPUT_FILE)) {
    console.error(`❌ JSON file not found: ${JSON_INPUT_FILE}`);
    console.error(`\nPlease run: npm run html-to-json first\n`);
    process.exit(1);
  }

  console.log(`Reading JSON from: ${JSON_INPUT_FILE}`);
  const fileContent = fs.readFileSync(JSON_INPUT_FILE, "utf-8");
  const data: JsonData = JSON.parse(fileContent);

  console.log(`✓ Loaded ${data.people.length} people`);
  console.log(`  Export date: ${data.metadata.exportDate}`);
  console.log(`  Source: ${data.metadata.source}\n`);

  return data;
}

/**
 * Clear all existing data from Neo4j
 */
async function clearDatabase(session: neo4j.Session) {
  console.log("⚠️  CLEARING ALL EXISTING DATA FROM NEO4J...");

  // Delete all relationships first
  await session.run("MATCH ()-[r]->() DELETE r");

  // Then delete all nodes
  await session.run("MATCH (n) DELETE n");

  console.log("✓ Database cleared\n");
}

/**
 * Upload a batch of people to Neo4j
 */
async function uploadBatch(session: neo4j.Session, people: Person[]) {
  // Create all person nodes in the batch
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

  // Create all relationships in the batch
  for (const person of people) {
    // Create spouse relationships (bidirectional)
    for (const spouseId of person.spouses) {
      await session.run(
        `MERGE (p1:Person {id: $id1})
         MERGE (p2:Person {id: $id2})
         MERGE (p1)-[:SPOUSE]-(p2)`,
        { id1: person.id, id2: spouseId }
      );
    }

    // Create parent-child relationships from children array
    for (const childId of person.children) {
      await session.run(
        `MERGE (parent:Person {id: $parentId})
         MERGE (child:Person {id: $childId})
         MERGE (parent)-[:PARENT_OF]->(child)`,
        { parentId: person.id, childId }
      );
    }

    // Create parent relationships from father/mother fields
    if (person.father) {
      await session.run(
        `MERGE (father:Person {id: $fatherId})
         MERGE (child:Person {id: $childId})
         MERGE (father)-[:PARENT_OF]->(child)`,
        { fatherId: person.father, childId: person.id }
      );
    }

    if (person.mother) {
      await session.run(
        `MERGE (mother:Person {id: $motherId})
         MERGE (child:Person {id: $childId})
         MERGE (mother)-[:PARENT_OF]->(child)`,
        { motherId: person.mother, childId: person.id }
      );
    }
  }
}

/**
 * Main upload function
 */
async function uploadToNeo4j() {
  console.log("=== JSON to Neo4j Uploader ===\n");

  // Load configuration
  const config = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
  const driver = neo4j.driver(
    config.NEO4J_URI,
    neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
  );

  const session = driver.session({
    database: config.NEO4J_DATABASE || "neo4j",
  });

  try {
    // Test connection
    console.log("Testing Neo4j connection...");
    await session.run("RETURN 1");
    console.log("✓ Connected to Neo4j\n");

    // Load JSON data
    const data = loadJsonData();

    // Ask for confirmation
    console.log("⚠️  WARNING: This will DELETE ALL EXISTING DATA in Neo4j!");
    console.log(`⚠️  You are about to upload ${data.people.length} people.\n`);
    console.log(
      "Press Ctrl+C now to cancel, or wait 5 seconds to continue...\n"
    );

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Clear existing data
    await clearDatabase(session);

    // Upload in batches
    const BATCH_SIZE = 100;
    const totalBatches = Math.ceil(data.people.length / BATCH_SIZE);
    let uploaded = 0;

    console.log(
      `Uploading ${data.people.length} people in ${totalBatches} batches...\n`
    );

    for (let i = 0; i < data.people.length; i += BATCH_SIZE) {
      const batch = data.people.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;

      process.stdout.write(
        `\rBatch ${batchNum}/${totalBatches} - Uploading ${batch.length} people... `
      );

      await uploadBatch(session, batch);
      uploaded += batch.length;

      const percentage = ((uploaded / data.people.length) * 100).toFixed(1);
      process.stdout.write(
        `✓ (${uploaded}/${data.people.length} - ${percentage}%)`
      );
    }

    console.log("\n\n✓ Upload complete!");
    console.log(`✓ Successfully uploaded ${uploaded} people to Neo4j\n`);

    // Verify data
    const result = await session.run(
      "MATCH (p:Person) RETURN count(p) as count"
    );
    const recordCount = result.records[0]?.get("count").toNumber() || 0;
    console.log(`Verification: ${recordCount} Person nodes in database`);

    const relResult = await session.run(
      "MATCH ()-[r]->() RETURN count(r) as count"
    );
    const relCount = relResult.records[0]?.get("count").toNumber() || 0;
    console.log(`Verification: ${relCount} relationships in database\n`);
  } catch (error) {
    console.error("\n❌ Error during upload:", error);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the uploader
uploadToNeo4j().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
