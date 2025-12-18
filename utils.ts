import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

export type QueueItem = {
  page: string;
  anchor: string;
};

export type Person = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  birth?: string;
  birthPlace?: string;
  death?: string;
  deathPlace?: string;
  spouses: string[];
  children: string[];
};

/**
 * Extract person links from any element
 */
export function extractPersonLinks($: cheerio.CheerioAPI, root: cheerio.Cheerio<Element>) {
  const links: { page: string; id: string }[] = [];

  root.find('a[href]').each((_index: number, element: Element) => {
    const href = $(element).attr('href');
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
    .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
    .replace(/�/g, '')         // Remove � characters
    .replace(/á/g, '')         // Remove á characters  
    .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
    .trim();
}

/**
 * Extract first and last name from full name, removing titles and suffixes
 */
export function extractNames(fullName: string): { firstName?: string; lastName?: string } {
  // Remove common titles, suffixes, and descriptive text
  const cleaned = fullName
    .replace(/\([^)]*\)/g, '') // Remove anything in parentheses
    .replace(/\d+/g, '')        // Remove numbers (like superscript references)
    .replace(/\b(Jr\.?|Sr\.?|II|III|IV|I)\b/gi, '') // Remove suffixes
    .replace(/\b(Dr\.?|Rev\.?|Col\.?|Capt\.?|Sir|Lady|Lord)\b/gi, '') // Remove titles
    .replace(/\s+/g, ' ')
    .trim();

  // Split by comma (Last, First format) or by spaces
  const parts = cleaned.split(',').map(p => p.trim());
  
  if (parts.length >= 2 && parts[0] && parts[1]) {
    // "Last, First" format
    const firstWord = parts[1].split(/\s+/)[0];
    return {
      lastName: parts[0],
      ...(firstWord && { firstName: firstWord })
    };
  }
  
  // Try space-separated format
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 0) {
    return {};
  } else if (words.length === 1) {
    const last = words[0];
    return last ? { lastName: last } : {};
  } else {
    // First word is first name, last word is last name
    const first = words[0];
    const last = words[words.length - 1];
    return {
      ...(first && { firstName: first }),
      ...(last && { lastName: last })
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

  const name = personDiv.find('h2').first().text().trim();
  const id = anchor.replace('i', '');
  const { firstName, lastName } = extractNames(name);

  let birth: string | undefined;
  let birthPlace: string | undefined;
  let death: string | undefined;
  let deathPlace: string | undefined;
  const spouses: string[] = [];
  const children: string[] = [];

  // Extract birth and death dates from the main info table
  personDiv.find('table.grid').first().find('tr').each((_: number, row: Element) => {
    const cells = $(row).find('td');
    if (cells.length < 2) return;

    const label = $(cells[0]).text().toLowerCase().trim();
    const date = cleanDateString($(cells[1]).text());
    const fullText = $(cells[2]).text().trim();

    if (label.startsWith('birth')) {
      birth = date;
      // Extract place from the full text (usually mentions "at [place]")
      const placeMatch = fullText.match(/\bat\s+([^,]+(?:,\s*[^.]+)?)/i);
      if (placeMatch && placeMatch[1]) {
        birthPlace = placeMatch[1].trim();
      }
    } else if (label.startsWith('death')) {
      death = date;
      // Extract place from the full text
      const placeMatch = fullText.match(/\bat\s+([^,]+(?:,\s*[^.]+)?)/i);
      if (placeMatch && placeMatch[1]) {
        deathPlace = placeMatch[1].trim();
      }
    }
  });

  // Find ALL family tables (handles remarriages)
  personDiv.find('table.grid.ss-family').each((_tableIndex: number, table: Element) => {
    // First row typically contains spouse info with <h3 class="family">Family</h3>
    const firstRow = $(table).find('tr').first();
    const firstCell = firstRow.find('td').first();
    
    // Check if this is a family table (has "Family" header)
    if (firstCell.find('h3.family').length > 0) {
      // The spouse link is in the third column of the first row
      const spouseCell = firstRow.find('td').eq(1);
      const spouseLinks = extractPersonLinks($, spouseCell);
      
      for (const link of spouseLinks) {
        spouses.push(link.id);
        discovered.push({ page: link.page, anchor: `i${link.id}` });
      }
    }

    // Process all rows for children and other relationships
    $(table)
      .find('tr')
      .each((_rowIndex: number, row: Element) => {
        const cells = $(row).find('td');
        if (cells.length < 2) return;

        const label = $(cells[0]).text().toLowerCase().trim();
        
        // Look for children
        if (label.startsWith('child')) {
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
      ...(lastName && { lastName }),
      ...(birth && { birth }),
      ...(birthPlace && { birthPlace }),
      ...(death && { death }),
      ...(deathPlace && { deathPlace }),
      spouses,
      children,
    },
    discovered,
  };
}
