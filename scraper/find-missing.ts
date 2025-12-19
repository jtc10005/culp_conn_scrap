import neo4j from "neo4j-driver";
import * as fs from "fs";
import * as cheerio from "cheerio";

// Load Neo4j configuration
const config = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
const driver = neo4j.driver(
  config.NEO4J_URI,
  neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
);

const DATA_DIR = "./data";

/**
 * Get all person IDs from Neo4j database
 */
async function getPersonIdsFromNeo4j(): Promise<Set<string>> {
  const session = driver.session({ database: config.NEO4J_DATABASE });
  const personIds = new Set<string>();

  try {
    const result = await session.run("MATCH (p:Person) RETURN p.id as id");

    for (const record of result.records) {
      const id = record.get("id");
      if (id) {
        personIds.add(id);
      }
    }

    console.log(`✓ Found ${personIds.size} people in Neo4j database`);
  } finally {
    await session.close();
  }

  return personIds;
}

/**
 * Extract all person IDs from saved HTML files
 */
function getPersonIdsFromHtmlFiles(): Set<string> {
  const personIds = new Set<string>();

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    console.log(
      "Please run the scraper with SAVE_HTML=true first to save HTML files."
    );
    return personIds;
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".htm") || f.endsWith(".html"));

  if (files.length === 0) {
    console.error(`❌ No HTML files found in ${DATA_DIR}`);
    console.log(
      "Please run the scraper with SAVE_HTML=true first to save HTML files."
    );
    return personIds;
  }

  console.log(`📁 Found ${files.length} HTML files in ${DATA_DIR}`);

  for (const file of files) {
    const filePath = `${DATA_DIR}/${file}`;
    const html = fs.readFileSync(filePath, "utf-8");
    const $ = cheerio.load(html);

    // Find all anchors with id attribute starting with 'i'
    $('[id^="i"]').each((_index, element) => {
      const id = $(element).attr("id");
      if (id && /^i\d+$/.test(id)) {
        // Extract numeric part (i123 -> 123)
        const numericId = id.substring(1);
        personIds.add(numericId);
      }
    });
  }

  console.log(`✓ Found ${personIds.size} unique person IDs in HTML files`);
  return personIds;
}

/**
 * Find person IDs that exist in HTML files but not in Neo4j
 */
async function findMissingRecords() {
  console.log("🔍 Finding missing records...\n");

  // Get IDs from both sources
  const htmlIds = getPersonIdsFromHtmlFiles();

  if (htmlIds.size === 0) {
    console.log("\n❌ No HTML files to process. Exiting.");
    return;
  }

  const neo4jIds = await getPersonIdsFromNeo4j();

  // Find missing IDs
  const missingIds: string[] = [];
  for (const id of htmlIds) {
    if (!neo4jIds.has(id)) {
      missingIds.push(id);
    }
  }

  // Sort for easier reading
  missingIds.sort((a, b) => parseInt(a) - parseInt(b));

  console.log("\n=== Results ===");
  console.log(`Total IDs in HTML files: ${htmlIds.size}`);
  console.log(`Total IDs in Neo4j: ${neo4jIds.size}`);
  console.log(`Missing IDs: ${missingIds.length}`);

  if (missingIds.length > 0) {
    console.log("\n📝 Missing Person IDs:");

    // Group by page for easier reference
    const byPage = new Map<string, string[]>();

    for (const id of missingIds) {
      // Find which HTML file contains this ID
      const files = fs
        .readdirSync(DATA_DIR)
        .filter((f) => f.endsWith(".htm") || f.endsWith(".html"));

      for (const file of files) {
        const html = fs.readFileSync(`${DATA_DIR}/${file}`, "utf-8");
        if (html.includes(`id="i${id}"`)) {
          if (!byPage.has(file)) {
            byPage.set(file, []);
          }
          byPage.get(file)!.push(id);
          break;
        }
      }
    }

    // Print grouped by page
    for (const [page, ids] of Array.from(byPage.entries()).sort()) {
      console.log(`\n  ${page}:`);
      for (const id of ids) {
        console.log(
          `    - ID: ${id} (anchor: i${id}, URL: https://www.culpepperconnections.com/ss/g0/${page}#i${id})`
        );
      }
    }

    // Save to file
    const outputFile = "./missing-records.json";
    const output = {
      timestamp: new Date().toISOString(),
      totalHtmlIds: htmlIds.size,
      totalNeo4jIds: neo4jIds.size,
      missingCount: missingIds.length,
      missingIds: missingIds,
      byPage: Object.fromEntries(byPage),
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), "utf-8");
    console.log(`\n💾 Results saved to ${outputFile}`);
  } else {
    console.log("\n✅ No missing records! All HTML IDs are in Neo4j.");
  }
}

async function main() {
  try {
    await findMissingRecords();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.close();
  }
}

main();
