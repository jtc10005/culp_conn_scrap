import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getNeo4jDriver } from '@/lib';
import type { EditStatus, PersonChanges } from '@/lib/types';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reviewed_by, reviewer_notes } = body as {
      action: 'approve' | 'reject';
      reviewed_by: string;
      reviewer_notes?: string;
    };

    // Validate required fields
    if (!action || !reviewed_by) {
      return NextResponse.json(
        { error: 'Missing required fields: action, reviewed_by' },
        { status: 400 }
      );
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get the pending edit
    const { data: edit, error: fetchError } = await supabase
      .from('pending_edits')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !edit) {
      return NextResponse.json({ error: 'Edit not found' }, { status: 404 });
    }

    if (edit.status !== 'pending') {
      return NextResponse.json({ error: `Edit has already been ${edit.status}` }, { status: 400 });
    }

    const newStatus: EditStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update the edit status
    const { error: updateError } = await supabase
      .from('pending_edits')
      .update({
        status: newStatus,
        reviewed_by,
        reviewed_at: new Date().toISOString(),
        reviewer_notes: reviewer_notes || null,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating edit status:', updateError);
      return NextResponse.json({ error: 'Failed to update edit status' }, { status: 500 });
    }

    // If approved, apply changes to Neo4j
    if (action === 'approve') {
      try {
        const driver = getNeo4jDriver();
        const session = driver.session({ database: process.env.NEO4J_DATABASE });

        try {
          const changes = edit.changes as PersonChanges;

          // Build SET clause dynamically based on changes
          const setClauses: string[] = [];
          const parameters: Record<string, string | number | boolean | string[] | null> = {
            personId: edit.person_id,
          };

          Object.entries(changes).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              setClauses.push(`p.${key} = $${key}`);
              parameters[key] = value;
            }
          });

          if (setClauses.length > 0) {
            const query = `
              MATCH (p:Person {id: $personId})
              SET ${setClauses.join(', ')}
              RETURN p
            `;

            await session.run(query, parameters);
          }

          // Record in edit history
          await supabase.from('edit_history').insert([
            {
              person_id: edit.person_id,
              applied_by: reviewed_by,
              changes: edit.changes,
              edit_id: id,
            },
          ]);
        } finally {
          await session.close();
        }

        return NextResponse.json({
          message: 'Edit approved and applied successfully',
          edit: { ...edit, status: newStatus },
        });
      } catch (neo4jError) {
        console.error('Error applying changes to Neo4j:', neo4jError);

        // Rollback the approval
        await supabase
          .from('pending_edits')
          .update({
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            reviewer_notes: `Failed to apply to Neo4j: ${neo4jError}`,
          })
          .eq('id', id);

        return NextResponse.json({ error: 'Failed to apply changes to database' }, { status: 500 });
      }
    }

    return NextResponse.json({
      message: `Edit ${action}ed successfully`,
      edit: { ...edit, status: newStatus },
    });
  } catch (error) {
    console.error('Error in review edit API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
