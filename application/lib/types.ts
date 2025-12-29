// Related person type - minimal info for relationships
export type RelatedPerson = {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
};

// Life event types
export type LifeEvent = {
  id: string;
  type:
    | 'birth'
    | 'death'
    | 'burial'
    | 'baptism'
    | 'residence'
    | 'occupation'
    | 'immigration'
    | 'military'
    | 'other';
  date?: string;
  place?: string;
  description?: string;
  orderIndex: number;
};

// Family (marriage) type
export type Family = {
  id: string;
  spouseId?: string;
  spouseName?: string;
  spouse?: RelatedPerson; // Populated when fetching with relationships
  marriageDate?: string;
  marriagePlace?: string;
  divorceDate?: string;
  children: RelatedPerson[]; // Children from this specific marriage
  orderIndex: number;
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
  dnaProven?: boolean;
  hasPicture?: boolean;
  hasFamilyBible?: boolean;
  militaryService?: string[];
  page?: string;
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
  events: LifeEvent[]; // All life events
  families: Family[]; // All marriages/families
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
