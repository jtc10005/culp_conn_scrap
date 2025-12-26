// Related person type - minimal info for relationships
export type RelatedPerson = {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
};

// Shared Person type - matches the scraper schema
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

// Person with full related person details (for detail page)
export type PersonWithRelations = Omit<Person, 'father' | 'mother' | 'spouses' | 'children'> & {
  father?: RelatedPerson;
  mother?: RelatedPerson;
  spouses: RelatedPerson[];
  children: RelatedPerson[];
};

export type TreeNode = {
  id: string;
  name: string;
  person: Person;
  children?: TreeNode[];
};
