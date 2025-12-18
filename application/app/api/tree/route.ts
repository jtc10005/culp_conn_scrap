import { NextRequest, NextResponse } from 'next/server';
import { getNeo4jDriver } from '@/lib/neo4j';

export async function GET() {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session({ database: process.env.NEO4J_DATABASE });

    try {
      // Get root person (ID: 1 - Henry Culpeper)
      const result = await session.run(
        `MATCH path = (root:Person {id: "1"})-[:PARENT_OF*0..3]->(descendant:Person)
         RETURN descendant.id as id, 
                descendant.name as name,
                descendant.birth as birth,
                descendant.gender as gender,
                [(descendant)-[:PARENT_OF]->(child:Person) | child.id] as children
         LIMIT 500`
      );

      const nodes = result.records.map((record) => ({
        id: record.get('id'),
        name: record.get('name'),
        birth: record.get('birth') || undefined,
        gender: record.get('gender') || undefined,
        children: record.get('children'),
      }));

      return NextResponse.json({ nodes });
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('Error fetching tree:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tree' },
      { status: 500 }
    );
  }
}
