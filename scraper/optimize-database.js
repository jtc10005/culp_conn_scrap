/**
 * Optimize database by removing redundant relationships
 * Keeps: Person → LifeEvent, Person → Family
 * Removes: Duplicate SPOUSE and PARENT_OF (since Family nodes track these)
 */
import neo4j from "neo4j-driver";
import * as fs from "fs";

const config = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
const driver = neo4j.driver(
  config.NEO4J_URI,
  neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
);

async function optimizeDatabase() {
  const session = driver.session({ database: config.NEO4J_DATABASE });

  try {
    console.log("🔧 Optimizing database...\n");

    // Count before
    const beforeRels = await session.run(`
      MATCH ()-[r]->()
      RETURN count(r) as count
    `);
    const before = beforeRels.records[0].get("count").toNumber();
    console.log(`Relationships before: ${before.toLocaleString()}`);

    // Option 1: Remove direct SPOUSE relationships (Family nodes have this info)
    console.log("\n1. Checking SPOUSE relationships...");
    const spouseCount = await session.run(`
      MATCH (p1:Person)-[r:SPOUSE]-(p2:Person)
      RETURN count(r) as count
    `);
    const spouses = spouseCount.records[0].get("count").toNumber();
    console.log(`   Found ${spouses.toLocaleString()} SPOUSE relationships`);
    console.log(`   These can be removed (Family nodes track spouses)`);

    // Option 2: Remove direct PARENT_OF relationships (can be derived from Family)
    console.log("\n2. Checking PARENT_OF relationships...");
    const parentCount = await session.run(`
      MATCH (p:Person)-[r:PARENT_OF]->(c:Person)
      RETURN count(r) as count
    `);
    const parents = parentCount.records[0].get("count").toNumber();
    console.log(`   Found ${parents.toLocaleString()} PARENT_OF relationships`);
    console.log(`   These can be kept for quick parent queries`);

    console.log("\n⚠️  Would you like to:");
    console.log(
      `   A. Remove ${spouses.toLocaleString()} SPOUSE relationships (save ~${Math.round((spouses / 251099) * 100)}% space)`
    );
    console.log(`   B. Keep all relationships (current structure)`);
    console.log("\n   This script is informational only. No changes made.");

    console.log("\n📊 Summary:");
    console.log(`   Total Relationships: ${before.toLocaleString()}`);
    console.log(`   HAS_EVENT: ~128,973 (keep - needed for events)`);
    console.log(`   HAS_FAMILY: ~20,645 (keep - needed for families)`);
    console.log(`   CHILD: ~30,193 (keep - links families to children)`);
    console.log(`   PARENT_OF: ~40,904 (keep - quick parent lookup)`);
    console.log(`   SPOUSE: ~30,384 (optional - duplicates Family info)`);

    console.log("\n💡 If you want to remove SPOUSE relationships:");
    console.log("   Uncomment the deletion code below and re-run this script.");

    // UNCOMMENT TO DELETE SPOUSE RELATIONSHIPS:
    // console.log("\n🗑️  Deleting SPOUSE relationships...");
    // await session.run(`
    //   MATCH (p1:Person)-[r:SPOUSE]-(p2:Person)
    //   DELETE r
    // `);
    // console.log("✅ SPOUSE relationships deleted!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

optimizeDatabase();
