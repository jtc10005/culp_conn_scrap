/**
 * HTML to JSON Converter
 *
 * Parses all HTML files in the data folder and creates a comprehensive JSON file
 * containing all genealogy information.
 */

import * as fs from "fs";
import * as path from "path";
import { parsePersonFromPage, type Person } from "./utils.js";

const DATA_DIR = "./data";
const JSON_OUTPUT_FILE = "./data/genealogy-data.json";

interface PersonMap {
  [id: string]: Person;
}

/**
 * Get all HTML files from the data directory
 */
function getHtmlFiles(): string[] {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DATA_DIR);
  const htmlFiles = files
    .filter((f) => f.endsWith(".htm") || f.endsWith(".html"))
    .sort((a, b) => {
      // Sort by numeric value in filename (p1.htm, p2.htm, etc.)
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  return htmlFiles;
}

/**
 * Parse all people from a single HTML file
 */
function parsePeopleFromFile(filePath: string): Person[] {
  const html = fs.readFileSync(filePath, "utf-8");
  const people: Person[] = [];

  // Find all person divs with id starting with "i"
  // Pattern: <div class="itp" id="i123">
  const personDivMatches = html.matchAll(
    /<div[^>]+class="[^"]*itp[^"]*"[^>]+id="(i\d+)"/g
  );

  for (const match of personDivMatches) {
    const anchor = match[1];
    if (!anchor) continue;

    try {
      const parsed = parsePersonFromPage(html, anchor);
      if (parsed) {
        people.push(parsed.person);
      }
    } catch (error) {
      console.warn(
        `⚠️  Failed to parse ${anchor} in ${path.basename(filePath)}: ${error}`
      );
    }
  }

  return people;
}

/**
 * Main conversion function
 */
async function convertHtmlToJson() {
  console.log("=== HTML to JSON Converter ===\n");
  console.log(`Reading HTML files from: ${DATA_DIR}`);

  const htmlFiles = getHtmlFiles();
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const personMap: PersonMap = {};
  let totalPeople = 0;
  let filesProcessed = 0;

  // Process each HTML file
  for (const filename of htmlFiles) {
    const filePath = path.join(DATA_DIR, filename);
    process.stdout.write(`\rProcessing: ${filename.padEnd(20)} `);

    try {
      const people = parsePeopleFromFile(filePath);

      for (const person of people) {
        // Use person map to avoid duplicates (same person might appear in multiple files)
        if (!personMap[person.id]) {
          personMap[person.id] = person;
          totalPeople++;
        } else {
          // If person already exists, merge any additional data
          const existing = personMap[person.id];
          if (existing) {
            // Merge spouses (avoid duplicates)
            for (const spouse of person.spouses) {
              if (!existing.spouses.includes(spouse)) {
                existing.spouses.push(spouse);
              }
            }
            // Merge children (avoid duplicates)
            for (const child of person.children) {
              if (!existing.children.includes(child)) {
                existing.children.push(child);
              }
            }
            // Fill in any missing data
            if (!existing.firstName && person.firstName)
              existing.firstName = person.firstName;
            if (!existing.middleName && person.middleName)
              existing.middleName = person.middleName;
            if (!existing.lastName && person.lastName)
              existing.lastName = person.lastName;
            if (!existing.gender && person.gender)
              existing.gender = person.gender;
            if (!existing.birth && person.birth) existing.birth = person.birth;
            if (!existing.birthPlace && person.birthPlace)
              existing.birthPlace = person.birthPlace;
            if (!existing.death && person.death) existing.death = person.death;
            if (!existing.deathPlace && person.deathPlace)
              existing.deathPlace = person.deathPlace;
            if (!existing.burial && person.burial)
              existing.burial = person.burial;
            if (!existing.burialPlace && person.burialPlace)
              existing.burialPlace = person.burialPlace;
            if (!existing.marriageDate && person.marriageDate)
              existing.marriageDate = person.marriageDate;
            if (!existing.father && person.father)
              existing.father = person.father;
            if (!existing.mother && person.mother)
              existing.mother = person.mother;
          }
        }
      }

      filesProcessed++;
    } catch (error) {
      console.error(`\n❌ Error processing ${filename}:`, error);
    }
  }

  console.log(`\n\n✓ Processed ${filesProcessed} files`);
  console.log(`✓ Found ${totalPeople} unique people\n`);

  // Convert person map to array and sort by ID
  const peopleArray = Object.values(personMap).sort((a, b) => {
    return parseInt(a.id) - parseInt(b.id);
  });

  // Create output JSON structure
  const jsonData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalPeople: peopleArray.length,
      totalFiles: htmlFiles.length,
      source: "Culpepper Connections HTML Files",
      sourceLocation: DATA_DIR,
    },
    people: peopleArray,
  };

  // Write to file
  console.log(`Writing JSON to: ${JSON_OUTPUT_FILE}`);
  fs.writeFileSync(
    JSON_OUTPUT_FILE,
    JSON.stringify(jsonData, null, 2),
    "utf-8"
  );

  const fileSizeKB = (fs.statSync(JSON_OUTPUT_FILE).size / 1024).toFixed(2);
  const fileSizeMB = (fs.statSync(JSON_OUTPUT_FILE).size / 1024 / 1024).toFixed(
    2
  );

  console.log(`✓ JSON file created: ${fileSizeKB} KB (${fileSizeMB} MB)\n`);

  // Show sample records
  console.log("Sample records:");
  console.log("─".repeat(80));
  for (let i = 0; i < Math.min(3, peopleArray.length); i++) {
    const person = peopleArray[i];
    if (person) {
      console.log(`ID: ${person.id} - ${person.name}`);
      if (person.birth)
        console.log(
          `  Birth: ${person.birth}${person.birthPlace ? ` at ${person.birthPlace}` : ""}`
        );
      if (person.death)
        console.log(
          `  Death: ${person.death}${person.deathPlace ? ` at ${person.deathPlace}` : ""}`
        );
      console.log(
        `  Spouses: ${person.spouses.length}, Children: ${person.children.length}`
      );
      console.log("─".repeat(80));
    }
  }

  console.log(`\n✓ Conversion complete!`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review the JSON file: ${JSON_OUTPUT_FILE}`);
  console.log(`  2. When ready, upload to Neo4j with: npm run json-to-neo4j\n`);
}

// Run the converter
convertHtmlToJson().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
