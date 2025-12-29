-- Hybrid Architecture: Store rich data in Supabase, relationships in Neo4j
-- This reduces Neo4j usage from 93% to ~18%

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

-- Indexes for fast lookups
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

-- Indexes for families
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

-- Enable Row Level Security
ALTER TABLE life_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_children ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view genealogy data)
CREATE POLICY "Public read access" ON life_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON families FOR SELECT USING (true);
CREATE POLICY "Public read access" ON family_children FOR SELECT USING (true);

-- View for easy family querying with children
CREATE VIEW families_with_children AS
SELECT 
  f.*,
  COALESCE(
    json_agg(
      json_build_object('childId', fc.child_id, 'orderIndex', fc.order_index)
      ORDER BY fc.order_index
    ) FILTER (WHERE fc.child_id IS NOT NULL),
    '[]'::json
  ) as children_json
FROM families f
LEFT JOIN family_children fc ON f.id = fc.family_id
GROUP BY f.id, f.person_id, f.spouse_id, f.spouse_name, f.marriage_date, 
         f.marriage_place, f.divorce_date, f.order_index, f.created_at, f.updated_at;

COMMENT ON TABLE life_events IS 'Biographical events (birth, death, occupation, etc.) - offloaded from Neo4j';
COMMENT ON TABLE families IS 'Marriage/family units - offloaded from Neo4j';
COMMENT ON TABLE family_children IS 'Junction table linking families to children';
COMMENT ON VIEW families_with_children IS 'Convenience view for querying families with their children';
