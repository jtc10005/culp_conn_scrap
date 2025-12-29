-- Supabase schema for storing rich genealogical data
-- This offloads LifeEvent and Family nodes from Neo4j to save space

-- Life Events table
CREATE TABLE life_events (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('birth', 'death', 'burial', 'baptism', 'residence', 'occupation', 'immigration', 'military', 'other')),
  date TEXT,
  place TEXT,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups by person
CREATE INDEX idx_life_events_person_id ON life_events(person_id);
CREATE INDEX idx_life_events_type ON life_events(type);
CREATE INDEX idx_life_events_date ON life_events(date);
CREATE INDEX idx_life_events_place ON life_events(place);

-- Families table (marriages)
CREATE TABLE families (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  spouse_id TEXT,
  spouse_name TEXT,
  marriage_date TEXT,
  marriage_place TEXT,
  divorce_date TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_families_person_id ON families(person_id);
CREATE INDEX idx_families_spouse_id ON families(spouse_id);

-- Family children junction table
CREATE TABLE family_children (
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL,
  order_index INTEGER,
  PRIMARY KEY (family_id, child_id)
);

CREATE INDEX idx_family_children_family_id ON family_children(family_id);
CREATE INDEX idx_family_children_child_id ON family_children(child_id);

-- Enable Row Level Security (RLS)
ALTER TABLE life_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_children ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view)
CREATE POLICY "Enable read access for all users" ON life_events FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON families FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON family_children FOR SELECT USING (true);

-- Optional: Add policies for authenticated users to suggest edits
-- CREATE POLICY "Authenticated users can insert" ON life_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create view for easy family querying with children
CREATE VIEW families_with_children AS
SELECT 
  f.*,
  COALESCE(
    json_agg(
      json_build_object('childId', fc.child_id, 'orderIndex', fc.order_index)
      ORDER BY fc.order_index
    ) FILTER (WHERE fc.child_id IS NOT NULL),
    '[]'::json
  ) as children
FROM families f
LEFT JOIN family_children fc ON f.id = fc.family_id
GROUP BY f.id;

COMMENT ON TABLE life_events IS 'Biographical events for each person (birth, death, occupation, etc.)';
COMMENT ON TABLE families IS 'Marriage/family units for each person';
COMMENT ON TABLE family_children IS 'Junction table linking families to their children';
