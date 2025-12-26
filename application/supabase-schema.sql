-- =====================================================
-- GENEALOGY EDIT SUBMISSION SYSTEM - DATABASE SCHEMA
-- =====================================================
-- Run this SQL in Supabase SQL Editor to create tables

-- Table: pending_edits
-- Stores user-submitted edits awaiting review
CREATE TABLE IF NOT EXISTS pending_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  changes JSONB NOT NULL,
  submitter_notes TEXT,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: edit_history
-- Audit trail of all applied edits
CREATE TABLE IF NOT EXISTS edit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_by TEXT NOT NULL,
  changes JSONB NOT NULL,
  edit_id UUID REFERENCES pending_edits(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pending_edits_status ON pending_edits(status);
CREATE INDEX IF NOT EXISTS idx_pending_edits_person_id ON pending_edits(person_id);
CREATE INDEX IF NOT EXISTS idx_pending_edits_submitted_at ON pending_edits(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_edit_history_person_id ON edit_history(person_id);
CREATE INDEX IF NOT EXISTS idx_edit_history_applied_at ON edit_history(applied_at DESC);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on pending_edits
CREATE TRIGGER update_pending_edits_updated_at
  BEFORE UPDATE ON pending_edits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for safety
ALTER TABLE pending_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_history ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert pending edits (public submissions)
CREATE POLICY "Anyone can submit edits"
  ON pending_edits
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can read their own submissions or all pending edits
CREATE POLICY "Anyone can read pending edits"
  ON pending_edits
  FOR SELECT
  USING (true);

-- Policy: Only service role can update/delete (admin only)
CREATE POLICY "Only admins can update edits"
  ON pending_edits
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Policy: Only service role can delete
CREATE POLICY "Only admins can delete edits"
  ON pending_edits
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Policy: Anyone can read edit history
CREATE POLICY "Anyone can read history"
  ON edit_history
  FOR SELECT
  USING (true);

-- Policy: Only service role can insert history (when applying edits)
CREATE POLICY "Only admins can insert history"
  ON edit_history
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- SAMPLE QUERIES FOR TESTING
-- =====================================================

-- View all pending edits
-- SELECT * FROM pending_edits WHERE status = 'pending' ORDER BY submitted_at DESC;

-- View edit history for a person
-- SELECT * FROM edit_history WHERE person_id = '123' ORDER BY applied_at DESC;

-- Count pending edits by status
-- SELECT status, COUNT(*) FROM pending_edits GROUP BY status;
