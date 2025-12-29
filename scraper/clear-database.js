/**
 * Clear all data from Neo4j database
 * USE WITH CAUTION - This deletes everything!
 */
import neo4j from "neo4j-driver";
import * as fs from "fs";

const config = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
const driver = neo4j.driver(
  config.NEO4J_URI,
  neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
);

async function clearDatabase() {
  const session = driver.session({ database: config.NEO4J_DATABASE });

  try {
    console.log("⚠️  WARNING: This will delete ALL data from the database!");
    console.log("Database:", config.NEO4J_DATABASE);
    console.log("\nClearing all nodes and relationships...\n");

    // Delete in batches to avoid memory issues
    let deletedCount = 0;
    let batchSize = 10000;

    while (true) {
      const result = await session.run(
        `MATCH (n)
         WITH n LIMIT ${batchSize}
         DETACH DELETE n
         RETURN count(n) as deleted`
      );

      const deleted = result.records[0].get("deleted").toNumber();
      deletedCount += deleted;

      console.log(`Deleted ${deleted} nodes (total: ${deletedCount})`);

      if (deleted < batchSize) {
        break; // No more nodes to delete
      }
    }

    console.log(`\n✅ Database cleared! Total nodes deleted: ${deletedCount}`);
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

clearDatabase();
