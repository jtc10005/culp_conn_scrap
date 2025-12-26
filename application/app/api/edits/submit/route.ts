import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getEditPersonRecordEnabled } from '@/lib';
import type { PersonChanges } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Check if feature is enabled
    const editEnabled = await getEditPersonRecordEnabled();
    if (!editEnabled) {
      return NextResponse.json(
        { error: 'Edit submission feature is currently disabled' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { person_id, submitted_by, changes, submitter_notes } = body;

    // Validate required fields
    if (!person_id || !submitted_by || !changes) {
      return NextResponse.json(
        { error: 'Missing required fields: person_id, submitted_by, changes' },
        { status: 400 }
      );
    }

    // Validate submitted_by is an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submitted_by)) {
      return NextResponse.json(
        { error: 'submitted_by must be a valid email address' },
        { status: 400 }
      );
    }

    // Validate changes object is not empty
    if (Object.keys(changes).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Insert the pending edit
    const { data, error } = await supabase
      .from('pending_edits')
      .insert([
        {
          person_id,
          submitted_by,
          changes: changes as PersonChanges,
          submitter_notes: submitter_notes || null,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting pending edit:', error);
      return NextResponse.json(
        { error: 'Failed to submit edit', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Edit submitted successfully',
        edit: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in submit edit API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
