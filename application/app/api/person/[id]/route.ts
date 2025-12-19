import { NextRequest, NextResponse } from 'next/server';
import { getNeo4jDriver, Person } from '@/lib';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const driver = getNeo4jDriver();
    const session = driver.session({ database: process.env.NEO4J_DATABASE });

    try {
      // Get person with relationships
      const result = await session.run(
        `MATCH (p:Person {id: $id})
         OPTIONAL MATCH (p)-[:SPOUSE]-(spouse:Person)
         OPTIONAL MATCH (p)-[:PARENT_OF]->(child:Person)
         RETURN p, 
                collect(DISTINCT spouse.id) as spouseIds,
                collect(DISTINCT child.id) as childIds`,
        { id }
      );

      if (result.records.length === 0) {
        return NextResponse.json({ error: 'Person not found' }, { status: 404 });
      }

      const record = result.records[0];
      const node = record.get('p');
      const spouseIds = record.get('spouseIds').filter((id: string) => id);
      const childIds = record.get('childIds').filter((id: string) => id);

      const person: Person = {
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
        spouses: spouseIds,
        children: childIds,
      };

      return NextResponse.json({ person });
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('Error fetching person:', error);
    return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
  }
}
