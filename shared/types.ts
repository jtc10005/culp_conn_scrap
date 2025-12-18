/**
 * Shared TypeScript types for Culpepper Genealogy Project
 * Used by both the scraper and the Next.js application
 */

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

export type QueueItem = {
  page: string;
  anchor: string;
};
