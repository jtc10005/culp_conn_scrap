import { NextRequest, NextResponse } from 'next/server';
import { getNeo4jDriver, PersonWithRelations, RelatedPerson } from '@/lib';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const driver = getNeo4jDriver();
    const session = driver.session({ database: process.env.NEO4J_DATABASE });

    try {
      // Get person with relationships and full related person data
      const result = await session.run(
        `MATCH (p:Person {id: $id})
         OPTIONAL MATCH (father:Person)
           WHERE father.id = p.father
         OPTIONAL MATCH (mother:Person)
           WHERE mother.id = p.mother
         OPTIONAL MATCH (p)-[:SPOUSE]-(spouse:Person)
         OPTIONAL MATCH (p)-[:PARENT_OF]->(child:Person)
         RETURN p, 
                father,
                mother,
                collect(DISTINCT spouse {.id, .name, .firstName, .middleName, .lastName}) as spouses,
                collect(DISTINCT child {.id, .name, .firstName, .middleName, .lastName}) as children`,
        { id }
      );

      if (result.records.length === 0) {
        return NextResponse.json({ error: 'Person not found' }, { status: 404 });
      }

      const record = result.records[0];
      const node = record.get('p');
      const fatherNode = record.get('father');
      const motherNode = record.get('mother');
      const spouses = record.get('spouses').filter((s: RelatedPerson) => s.id);
      const children = record.get('children').filter((c: RelatedPerson) => c.id);

      // Debug logging
      console.log('Person ID:', node.properties.id);
      console.log('Person father property:', node.properties.father);
      console.log('Person mother property:', node.properties.mother);
      console.log('Father node:', fatherNode);
      console.log('Mother node:', motherNode);

      const person: PersonWithRelations = {
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
        father: fatherNode
          ? {
              id: fatherNode.properties.id,
              name: fatherNode.properties.name,
              firstName: fatherNode.properties.firstName || undefined,
              middleName: fatherNode.properties.middleName || undefined,
              lastName: fatherNode.properties.lastName || undefined,
            }
          : undefined,
        mother: motherNode
          ? {
              id: motherNode.properties.id,
              name: motherNode.properties.name,
              firstName: motherNode.properties.firstName || undefined,
              middleName: motherNode.properties.middleName || undefined,
              lastName: motherNode.properties.lastName || undefined,
            }
          : undefined,
        spouses: spouses,
        children: children,
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
