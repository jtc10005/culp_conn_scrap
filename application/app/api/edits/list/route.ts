import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = getSupabaseClient();

    // Fetch pending edits
    const { data, error } = await supabase
      .from('pending_edits')
      .select('*')
      .eq('status', status)
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching pending edits:', error);
      return NextResponse.json(
        { error: 'Failed to fetch edits', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ edits: data || [] });
  } catch (error) {
    console.error('Error in list edits API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
