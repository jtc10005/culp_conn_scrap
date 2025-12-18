import { NextRequest, NextResponse } from 'next/server';
import { getNeo4jDriver } from '@/lib/neo4j';
import { Person } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '100');
  const search = searchParams.get('search') || '';

  try {
    const driver = getNeo4jDriver();
    const session = driver.session({ database: process.env.NEO4J_DATABASE });

    try {
      const query = search
        ? `MATCH (p:Person)
           WHERE p.name CONTAINS $search 
              OR p.firstName CONTAINS $search 
              OR p.lastName CONTAINS $search
           RETURN p
           LIMIT $limit`
        : `MATCH (p:Person)
           RETURN p
           LIMIT $limit`;

      const result = await session.run(query, { search, limit });

      const people: Person[] = result.records.map((record) => {
        const node = record.get('p');
        return {
          id: node.properties.id,
          name: node.properties.name,
          firstName: node.properties.firstName || undefined,
          middleName: node.properties.middleName || undefined,
          lastName: node.properties.lastName || undefined,
          gender: node.properties.gender || undefined,
          birth: node.properties.birth || undefined,
          birthPlace: node.properties.birthPlace || undefined,
          death: node.properties.death || undefined,
          deathPlace: node.properties.deathPlace || undefined,
          burial: node.properties.burial || undefined,
          burialPlace: node.properties.burialPlace || undefined,
          marriageDate: node.properties.marriageDate || undefined,
          father: node.properties.father || undefined,
          mother: node.properties.mother || undefined,
          spouses: [],
          children: [],
        };
      });

      return NextResponse.json({ people, count: people.length });
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}
