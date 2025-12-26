import * as cheerio from "cheerio";
import type { Element } from "domhandler";

export type QueueItem = {
  page: string;
  anchor: string;
};

export type Person = {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  birth?: string;
  birthPlace?: string;
  death?: string;
  deathPlace?: string;
  burial?: string;
  burialPlace?: string;
  marriageDate?: string;
  father?: string;
  mother?: string;
  spouses: string[];
  children: string[];
};

/**
 * Extract person links from any element
 */
export function extractPersonLinks(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<Element>
) {
  const links: { page: string; id: string }[] = [];

  root.find("a[href]").each((_index: number, element: Element) => {
    const href = $(element).attr("href");
    if (!href) return;

    const match = href.match(/(p\d+\.htm)#i(\d+)/);
    if (!match) return;

    links.push({
      page: match[1]!,
      id: match[2]!,
    });
  });

  return links;
}

/**
 * Clean date strings by removing special characters and extra whitespace
 */
export function cleanDateString(dateStr: string): string {
  return dateStr
    .replace(/\u00A0/g, " ") // Replace non-breaking spaces
    .replace(/�/g, "") // Remove � characters
    .replace(/á/g, "") // Remove á characters
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();
}

/**
 * Extract first, middle, and last name from full name, removing titles and suffixes
 */
export function extractNames(fullName: string): {
  firstName?: string;
  middleName?: string;
  lastName?: string;
} {
  // Handle unknown markers
  const hasUnknownFirst = /^\(?\?\)/i.test(fullName);
  const hasUnknownLast = /\(?\?\)$/i.test(fullName);

  // Remove common titles, suffixes, and descriptive text
  const cleaned = fullName
    .replace(/\([^)]*\)/g, "") // Remove anything in parentheses (including (?))
    .replace(/\?/g, "") // Remove remaining question marks
    // Remove geographic/descriptive suffixes
    .replace(/\bof\s+[A-Z][^,]+(?:,\s*[A-Z]{2})?$/i, "") // "of Place, ST" at end
    .replace(/\bof\s+[A-Z][^,]+$/i, "") // "of Place" at end
    .replace(/\bson of\s+.+$/i, "") // "son of ..." at end
    .replace(/\bthe\s+\w+$/i, "") // "the Merchant" etc at end
    .replace(/\b(Jr\.?|Sr\.?|III?|IV|V)\b/gi, "") // Remove suffixes
    .replace(/\b(Dr\.?|Rev\.?|Col\.?|Capt\.?|Sir|Lady|Lord)\b/gi, "") // Remove titles
    .replace(/,\s*$/, "") // Remove trailing comma
    .replace(/\s+/g, " ")
    .trim();

  // Split by comma (Last, First format) or by spaces
  const parts = cleaned
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (parts.length >= 2 && parts[0] && parts[1]) {
    // "Last, First Middle" format
    const firstParts = parts[1].split(/\s+/);
    const firstName = firstParts[0];
    const middleName =
      firstParts.length > 1 ? firstParts.slice(1).join(" ") : undefined;

    return {
      ...(firstName && { firstName }),
      ...(middleName && { middleName }),
      lastName: parts[0],
    };
  }

  // Try space-separated format
  const words = cleaned.split(/\s+/).filter((w) => w.length > 0);

  if (words.length === 0) {
    return {};
  } else if (words.length === 1) {
    // Single word - could be first or last name depending on unknown marker
    const name = words[0];
    if (name) {
      if (hasUnknownLast) {
        return { firstName: name, lastName: "Unknown" };
      } else if (hasUnknownFirst) {
        return { firstName: "Unknown", lastName: name };
      } else {
        return { lastName: name };
      }
    }
    return {};
  } else if (words.length === 2) {
    // Two words: First Last
    const first = words[0];
    const last = words[1];

    // If last word is just punctuation, use first word as last name
    if (last && (last.length <= 1 || last === ".")) {
      return first ? { lastName: first } : {};
    }

    return {
      ...(first && { firstName: first }),
      ...(last && { lastName: last }),
    };
  } else {
    // Three or more words: First Middle(s) Last
    const first = words[0];
    const middle = words.slice(1, -1).join(" ");
    let last = words[words.length - 1];

    // If last word is just punctuation, use second-to-last
    if (last && (last.length <= 1 || last === ".") && words.length > 2) {
      last = words[words.length - 2];
      const newMiddle =
        words.length > 3 ? words.slice(1, -2).join(" ") : undefined;
      return {
        ...(first && { firstName: first }),
        ...(newMiddle && { middleName: newMiddle }),
        ...(last && { lastName: last }),
      };
    }

    return {
      ...(first && { firstName: first }),
      ...(middle && { middleName: middle }),
      ...(last && { lastName: last }),
    };
  }
}

/**
 * Parse a single person from a page
 */
export function parsePersonFromPage(
  html: string,
  anchor: string
): { person: Person; discovered: QueueItem[] } | null {
  const $ = cheerio.load(html);
  const discovered: QueueItem[] = [];

  const personDiv = $(`div.itp#${anchor}`);
  if (!personDiv.length) return null;

  // Get the h2 element and remove any sup (superscript) elements before getting text
  const nameElement = personDiv.find("h2").first();
  nameElement.find("sup").remove(); // Remove citation superscripts
  const name = nameElement.text().trim();

  const id = anchor.replace("i", "");
  const { firstName, middleName, lastName } = extractNames(name);

  // Extract gender from the info line: "Male, #1, (say 1633 - after 1675)"
  let gender: string | undefined;
  const infoLine = personDiv.find("div.sinfo.sect-ls").text().trim();
  if (infoLine.toLowerCase().startsWith("male")) {
    gender = "Male";
  } else if (infoLine.toLowerCase().startsWith("female")) {
    gender = "Female";
  }

  let birth: string | undefined;
  let birthPlace: string | undefined;
  let death: string | undefined;
  let deathPlace: string | undefined;
  let burial: string | undefined;
  let burialPlace: string | undefined;
  let marriageDate: string | undefined;
  let father: string | undefined;
  let mother: string | undefined;
  const spouses: string[] = [];
  const children: string[] = [];

  // Extract parents from ss-parents table (appears before main info table)
  const parentsTable = personDiv.find("table.grid.ss-parents");
  if (parentsTable.length > 0) {
    parentsTable.find("tr").each((_: number, row: Element) => {
      const cells = $(row).find("td");
      if (cells.length < 2) return;

      const label = $(cells[0]).text().toLowerCase().trim();
      const parentCell = $(cells[1]);

      if (label.includes("father")) {
        const parentLinks = extractPersonLinks($, parentCell);
        if (parentLinks.length > 0 && parentLinks[0]) {
          father = parentLinks[0].id;
          discovered.push({
            page: parentLinks[0].page,
            anchor: `i${parentLinks[0].id}`,
          });
        }
      } else if (label.includes("mother")) {
        const parentLinks = extractPersonLinks($, parentCell);
        if (parentLinks.length > 0 && parentLinks[0]) {
          mother = parentLinks[0].id;
          discovered.push({
            page: parentLinks[0].page,
            anchor: `i${parentLinks[0].id}`,
          });
        }
      }
    });
  }

  // Extract birth, death, burial, and marriage dates from the main info table
  personDiv
    .find("table.grid")
    .first()
    .find("tr")
    .each((_: number, row: Element) => {
      const cells = $(row).find("td");
      if (cells.length < 2) return;

      const label = $(cells[0]).text().toLowerCase().trim();
      const date = cleanDateString($(cells[1]).text());
      const fullText = cells.length > 2 ? $(cells[2]).text().trim() : "";

      if (label.startsWith("birth")) {
        birth = date;
        // Extract place from the full text (usually mentions "at [place]")
        const placeMatch = fullText.match(
          /\bat\s+([^,]+(?:,\s*[A-Z][a-z\s]+)?)\s*[,.]?/i
        );
        if (placeMatch && placeMatch[1]) {
          birthPlace = placeMatch[1].trim().replace(/[,.;]+$/, "");
        }
      } else if (label.startsWith("death")) {
        death = date;
        // Extract place from the full text
        const placeMatch = fullText.match(
          /\bat\s+([^,]+(?:,\s*[A-Z][a-z\s]+)?)\s*[,.]?/i
        );
        if (placeMatch && placeMatch[1]) {
          deathPlace = placeMatch[1].trim().replace(/[,.;]+$/, "");
        }
      } else if (label.startsWith("burial")) {
        burial = date;
        // Extract place from the full text
        const placeMatch = fullText.match(
          /\bat\s+([^,]+(?:,\s*[A-Z][a-z\s]+)?)\s*[,.]?/i
        );
        if (placeMatch && placeMatch[1]) {
          burialPlace = placeMatch[1].trim().replace(/[,.;]+$/, "");
        }
      } else if (label.startsWith("marriage") && !marriageDate) {
        // Only capture the first marriage date (primary spouse)
        marriageDate = date;
      }
    });

  // Find ALL family tables (handles remarriages)
  personDiv
    .find("table.grid.ss-family")
    .each((_tableIndex: number, table: Element) => {
      // First row typically contains spouse info with <h3 class="family">Family</h3>
      const firstRow = $(table).find("tr").first();
      const firstCell = firstRow.find("td").first();

      // Check if this is a family table (has "Family" header)
      if (firstCell.find("h3.family").length > 0) {
        // The spouse link is in the third column of the first row
        const spouseCell = firstRow.find("td").eq(1);
        const spouseLinks = extractPersonLinks($, spouseCell);

        for (const link of spouseLinks) {
          spouses.push(link.id);
          discovered.push({ page: link.page, anchor: `i${link.id}` });
        }
      }

      // Process all rows for children and other relationships
      $(table)
        .find("tr")
        .each((_rowIndex: number, row: Element) => {
          const cells = $(row).find("td");
          if (cells.length < 2) return;

          const label = $(cells[0]).text().toLowerCase().trim();

          // Look for children
          if (label.startsWith("child")) {
            const links = extractPersonLinks($, $(cells[1]));
            for (const link of links) {
              children.push(link.id);
              discovered.push({ page: link.page, anchor: `i${link.id}` });
            }
          }
        });
    });

  return {
    person: {
      id,
      name,
      ...(firstName && { firstName }),
      ...(middleName && { middleName }),
      ...(lastName && { lastName }),
      ...(gender && { gender }),
      ...(birth && { birth }),
      ...(birthPlace && { birthPlace }),
      ...(death && { death }),
      ...(deathPlace && { deathPlace }),
      ...(burial && { burial }),
      ...(burialPlace && { burialPlace }),
      ...(marriageDate && { marriageDate }),
      ...(father && { father }),
      ...(mother && { mother }),
      spouses,
      children,
    },
    discovered,
  };
}
