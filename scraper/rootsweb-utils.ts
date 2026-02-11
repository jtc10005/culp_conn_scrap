import * as cheerio from "cheerio";

export type QueueItem = {
  page: string;
  anchor: string;
};

export type LifeEvent = {
  type:
    | "birth"
    | "death"
    | "burial"
    | "baptism"
    | "residence"
    | "occupation"
    | "immigration"
    | "military"
    | "other";
  date?: string;
  place?: string;
  description?: string;
};

export type Family = {
  spouseId?: string; // ID of spouse, undefined if unknown
  spouseName?: string; // Name of spouse if not linked
  marriageDate?: string;
  marriagePlace?: string;
  divorceDate?: string;
  childrenIds: string[]; // IDs of children from this marriage
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
  page?: string;
};

/**
 * Extract person links from any element
 * RootsWeb uses standard <a href="page.htm#anchor"> format
 */
export function extractPersonLinks(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<cheerio.Element>
) {
  const links: { page: string; id: string; anchor: string }[] = [];

  root.find("a[href]").each((_index: number, element: cheerio.Element) => {
    const href = $(element).attr("href");
    if (!href) return;

    // Match various formats: page.htm#anchor, #anchor, page.htm
    const match = href.match(/([^#]+)?#?(\w+)?/);
    if (!match) return;

    const page = match[1] || "";
    const anchor = match[2] || "";

    if (page || anchor) {
      // Generate a unique ID from page and anchor
      const id = anchor || page.replace(/\.(htm|html)/, "");
      links.push({
        page: page || "master_index.htm",
        id,
        anchor,
      });
    }
  });

  return links;
}

/**
 * Parse name into components
 */
function parseName(fullName: string): {
  firstName?: string;
  middleName?: string;
  lastName?: string;
} {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return {};

  if (parts.length === 1) {
    return { firstName: parts[0] };
  } else if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  } else {
    // 3 or more parts
    return {
      firstName: parts[0],
      middleName: parts.slice(1, -1).join(" "),
      lastName: parts[parts.length - 1],
    };
  }
}

/**
 * Parse a person's information from a RootsWeb page
 * 
 * Note: This is a generic parser that will need to be adapted based on the actual
 * HTML structure of the RootsWeb pages. The structure varies significantly between
 * different genealogy pages on RootsWeb.
 */
export function parseRootsWebPersonFromPage(
  html: string,
  anchor: string,
  page: string
): {
  person: Person;
  unlinkedChildren: Person[];
  discovered: QueueItem[];
  events: LifeEvent[];
  families: Family[];
} | null {
  const $ = cheerio.load(html);
  
  // Generate a unique ID for this person
  const personId = anchor || page.replace(/\.(htm|html)/, "");

  // Initialize person object
  const person: Person = {
    id: personId,
    name: "",
    spouses: [],
    children: [],
    page,
  };

  const events: LifeEvent[] = [];
  const families: Family[] = [];
  const unlinkedChildren: Person[] = [];
  const discovered: QueueItem[] = [];

  // Find the person's section (if anchor is provided)
  let personSection: cheerio.Cheerio<cheerio.Element>;
  if (anchor) {
    personSection = $(`#${anchor}, a[name="${anchor}"]`).parent();
  } else {
    // If no anchor, use the main content area
    personSection = $("body");
  }

  if (personSection.length === 0) {
    console.warn(`Could not find section for anchor: ${anchor}`);
    return null;
  }

  // Try to extract name from various possible locations
  // This is generic and will need adjustment based on actual HTML structure
  let name = personSection.find("h1, h2, h3, .name, b, strong").first().text().trim();
  
  // If name still not found, try the title
  if (!name) {
    name = $("title").text().trim();
  }

  // Clean up name (remove common prefixes/suffixes)
  name = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)?\s*/i, "");
  person.name = name;

  // Parse name components
  const nameParts = parseName(name);
  person.firstName = nameParts.firstName;
  person.middleName = nameParts.middleName;
  person.lastName = nameParts.lastName;

  // Extract dates and places from text content
  const text = personSection.text();

  // Look for birth information
  const birthMatch = text.match(/[Bb]orn:?\s*([^,\n]+)(?:,\s*([^\n]+))?/);
  if (birthMatch) {
    person.birth = birthMatch[1]?.trim();
    if (birthMatch[2]) {
      person.birthPlace = birthMatch[2].trim();
      events.push({
        type: "birth",
        date: person.birth,
        place: person.birthPlace,
      });
    }
  }

  // Look for death information
  const deathMatch = text.match(/[Dd]ied:?\s*([^,\n]+)(?:,\s*([^\n]+))?/);
  if (deathMatch) {
    person.death = deathMatch[1]?.trim();
    if (deathMatch[2]) {
      person.deathPlace = deathMatch[2].trim();
      events.push({
        type: "death",
        date: person.death,
        place: person.deathPlace,
      });
    }
  }

  // Look for burial information
  const burialMatch = text.match(/[Bb]uried:?\s*([^,\n]+)(?:,\s*([^\n]+))?/);
  if (burialMatch) {
    person.burial = burialMatch[1]?.trim();
    if (burialMatch[2]) {
      person.burialPlace = burialMatch[2].trim();
      events.push({
        type: "burial",
        date: person.burial,
        place: person.burialPlace,
      });
    }
  }

  // Look for marriage information
  const marriageMatch = text.match(/[Mm]arried:?\s*([^,\n]+)(?:,\s*([^\n]+))?/);
  if (marriageMatch) {
    person.marriageDate = marriageMatch[1]?.trim();
  }

  // Extract links to related people (spouses, children, parents)
  const links = extractPersonLinks($, personSection);

  // Look for spouse links by finding h2/h3 headers and their following siblings
  let spouseLinks: ReturnType<typeof extractPersonLinks> = [];
  personSection.find("h2, h3").each((_idx, el) => {
    const headerText = $(el).text().toLowerCase();
    if (headerText.includes("spouse") || headerText.includes("married")) {
      // Get the next sibling (usually a ul or p)
      const nextSibling = $(el).next();
      const elemLinks = extractPersonLinks($, nextSibling);
      spouseLinks = [...spouseLinks, ...elemLinks];
    }
  });
  
  for (const link of spouseLinks) {
    if (link.id && link.id !== personId) {
      person.spouses.push(link.id);
      if (!discovered.find(d => d.page === link.page && d.anchor === link.anchor)) {
        discovered.push({ page: link.page, anchor: link.anchor });
      }
    }
  }

  // Look for children links by finding headers and their following siblings
  let childLinks: ReturnType<typeof extractPersonLinks> = [];
  personSection.find("h2, h3").each((_idx, el) => {
    const headerText = $(el).text().toLowerCase();
    if (headerText.includes("children") || headerText.includes("child")) {
      const nextSibling = $(el).next();
      const elemLinks = extractPersonLinks($, nextSibling);
      childLinks = [...childLinks, ...elemLinks];
    }
  });
  
  for (const link of childLinks) {
    if (link.id && link.id !== personId) {
      person.children.push(link.id);
      if (!discovered.find(d => d.page === link.page && d.anchor === link.anchor)) {
        discovered.push({ page: link.page, anchor: link.anchor });
      }
    }
  }

  // Look for parent links by finding headers and their following siblings
  let parentLinks: ReturnType<typeof extractPersonLinks> = [];
  personSection.find("h2, h3").each((_idx, el) => {
    const headerText = $(el).text().toLowerCase();
    if (headerText.includes("father") || headerText.includes("mother") || headerText.includes("parents")) {
      const nextSibling = $(el).next();
      const elemLinks = extractPersonLinks($, nextSibling);
      parentLinks = [...parentLinks, ...elemLinks];
    }
  });
  
  for (const link of parentLinks) {
    if (link.id && link.id !== personId) {
      // Try to determine if it's father or mother from context
      const linkEl = personSection.find(`a[href*="${link.anchor}"]`);
      const linkContext = linkEl.closest("li, p").text().toLowerCase();
      if (linkContext.includes("father") || linkContext.includes("dad")) {
        person.father = link.id;
      } else if (linkContext.includes("mother") || linkContext.includes("mom")) {
        person.mother = link.id;
      }
      
      if (!discovered.find(d => d.page === link.page && d.anchor === link.anchor)) {
        discovered.push({ page: link.page, anchor: link.anchor });
      }
    }
  }

  // Create a basic family record if we have spouse/children info
  if (person.spouses.length > 0 || person.children.length > 0) {
    families.push({
      spouseId: person.spouses[0],
      spouseName: undefined,
      marriageDate: person.marriageDate,
      marriagePlace: undefined,
      divorceDate: undefined,
      childrenIds: person.children,
    });
  }

  return {
    person,
    unlinkedChildren,
    discovered,
    events,
    families,
  };
}

/**
 * Parse the master index page to extract all person links
 */
export function parseRootsWebMasterIndex(html: string): QueueItem[] {
  const $ = cheerio.load(html);
  const queue: QueueItem[] = [];

  // Find all links in the page
  $("a[href]").each((_index: number, element: cheerio.Element) => {
    const href = $(element).attr("href");
    if (!href) return;

    // Look for links to person pages
    const match = href.match(/([^#]+)?#?(\w+)?/);
    if (!match) return;

    const page = match[1] || "";
    const anchor = match[2] || "";

    // Skip non-HTML links
    if (page && !page.match(/\.(htm|html)$/i)) return;

    if (page || anchor) {
      queue.push({
        page: page || "master_index.htm",
        anchor,
      });
    }
  });

  return queue;
}
