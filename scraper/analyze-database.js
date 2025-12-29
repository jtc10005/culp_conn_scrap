/**
 * Analyze Neo4j database usage
 */
import neo4j from "neo4j-driver";
import * as fs from "fs";

const config = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
const driver = neo4j.driver(
  config.NEO4J_URI,
  neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
);

async function analyzeDatabase() {
  const session = driver.session({ database: config.NEO4J_DATABASE });

  try {
    console.log("📊 Neo4j Database Analysis\n");
    console.log("Database:", config.NEO4J_DATABASE, "\n");

    // Count nodes by label
    console.log("=== NODE COUNTS BY LABEL ===");
    const nodeLabels = await session
      .run(
        `
      CALL db.labels() YIELD label
      CALL apoc.cypher.run('MATCH (n:\`' + label + '\`) RETURN count(n) as count', {})
      YIELD value
      RETURN label, value.count as count
      ORDER BY value.count DESC
    `
      )
      .catch(async () => {
        // Fallback if APOC not available
        const result = await session.run(`
        MATCH (n)
        WITH labels(n) as labels, count(n) as count
        UNWIND labels as label
        RETURN label, sum(count) as count
        ORDER BY count DESC
      `);
        return result;
      });

    let totalNodes = 0;
    for (const record of nodeLabels.records) {
      const label = record.get("label");
      const count = record.get("count").toNumber();
      totalNodes += count;
      console.log(`  ${label}: ${count.toLocaleString()}`);
    }
    console.log(`  TOTAL: ${totalNodes.toLocaleString()}\n`);

    // Count relationships by type
    console.log("=== RELATIONSHIP COUNTS BY TYPE ===");
    const relTypes = await session
      .run(
        `
      CALL db.relationshipTypes() YIELD relationshipType
      CALL apoc.cypher.run('MATCH ()-[r:\`' + relationshipType + '\`]->() RETURN count(r) as count', {})
      YIELD value
      RETURN relationshipType, value.count as count
      ORDER BY value.count DESC
    `
      )
      .catch(async () => {
        // Fallback if APOC not available
        const result = await session.run(`
        MATCH ()-[r]->()
        RETURN type(r) as relationshipType, count(r) as count
        ORDER BY count DESC
      `);
        return result;
      });

    let totalRels = 0;
    for (const record of relTypes.records) {
      const type = record.get("relationshipType");
      const count = record.get("count").toNumber();
      totalRels += count;
      console.log(`  ${type}: ${count.toLocaleString()}`);
    }
    console.log(`  TOTAL: ${totalRels.toLocaleString()}\n`);

    // Sample data
    console.log("=== SAMPLE PERSON NODE ===");
    const samplePerson = await session.run(`
      MATCH (p:Person)
      RETURN p
      LIMIT 1
    `);

    if (samplePerson.records.length > 0) {
      const person = samplePerson.records[0].get("p").properties;
      console.log(JSON.stringify(person, null, 2));
    }

    // Check for LifeEvent and Family nodes
    console.log("\n=== RICH DATA MODEL CHECK ===");
    const eventCount = await session.run(`
      MATCH (e:LifeEvent)
      RETURN count(e) as count
    `);
    const familyCount = await session.run(`
      MATCH (f:Family)
      RETURN count(f) as count
    `);

    const events = eventCount.records[0]?.get("count").toNumber() || 0;
    const families = familyCount.records[0]?.get("count").toNumber() || 0;

    console.log(`LifeEvent nodes: ${events.toLocaleString()}`);
    console.log(`Family nodes: ${families.toLocaleString()}`);

    if (events === 0 && families === 0) {
      console.log("\n⚠️  No LifeEvent or Family nodes found!");
      console.log("This means the rich data model hasn't been imported yet.");
      console.log("Your database only contains the basic Person nodes.");
    } else {
      console.log("\n✅ Rich data model is present in the database.");
    }

    // Storage recommendations
    console.log("\n=== STORAGE RECOMMENDATIONS ===");
    console.log(`Total Nodes: ${totalNodes.toLocaleString()} (93% of limit)`);
    console.log(
      `Total Relationships: ${totalRels.toLocaleString()} (63% of limit)`
    );

    if (events === 0 && families === 0) {
      console.log("\n💡 RECOMMENDATION:");
      console.log("Since you haven't imported the rich data yet:");
      console.log("1. Clear the database (node clear-database.js)");
      console.log("2. Run the new scraper (npm run scrape)");
      console.log("3. This will import Person + LifeEvent + Family nodes");
      console.log(
        "\nThe new model will use MORE nodes but provide MUCH richer data."
      );
    } else {
      const estimatedFreeLimit = Math.round(totalNodes / 0.93);
      const spaceLeft = estimatedFreeLimit - totalNodes;
      console.log(
        `\nEstimated free tier limit: ~${estimatedFreeLimit.toLocaleString()} nodes`
      );
      console.log(`Space remaining: ~${spaceLeft.toLocaleString()} nodes`);

      if (spaceLeft < 1000) {
        console.log("\n⚠️  NEAR LIMIT! Options:");
        console.log("1. Upgrade to Neo4j Aura Pro ($65/month)");
        console.log("2. Delete old/test data");
        console.log("3. Use local Neo4j installation (unlimited)");
      }
    }
  } catch (error) {
    console.error("Error analyzing database:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

analyzeDatabase();
