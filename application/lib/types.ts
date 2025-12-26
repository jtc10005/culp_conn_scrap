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

// Edit submission types
export type EditStatus = 'pending' | 'approved' | 'rejected';

export type PersonChanges = Partial<Omit<Person, 'id' | 'spouses' | 'children'>>;

export type PendingEdit = {
  id: string;
  person_id: string;
  submitted_by: string;
  submitted_at: string;
  status: EditStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  changes: PersonChanges;
  submitter_notes?: string;
  reviewer_notes?: string;
  created_at: string;
  updated_at: string;
};

export type EditHistory = {
  id: string;
  person_id: string;
  applied_at: string;
  applied_by: string;
  changes: PersonChanges;
  edit_id?: string;
  created_at: string;
};
