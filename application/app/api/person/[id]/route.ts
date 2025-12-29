import { NextRequest, NextResponse } from 'next/server';
import {
  getNeo4jDriver,
  PersonWithRelations,
  RelatedPerson,
  LifeEvent,
  Family,
  getSupabaseAdmin,
} from '@/lib';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const driver = getNeo4jDriver();
    const session = driver.session({ database: process.env.NEO4J_DATABASE });
    const supabase = getSupabaseAdmin();

    try {
      // Get person with relationships from Neo4j (NO events/families from Neo4j anymore)
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

      // Fetch events from Supabase
      const { data: eventsData, error: eventsError } = await supabase
        .from('life_events')
        .select('*')
        .eq('person_id', id)
        .order('order_index', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events from Supabase:', eventsError);
      }

      const events: LifeEvent[] = (eventsData || []).map((e) => ({
        id: e.id,
        type: e.type as LifeEvent['type'],
        date: e.date || undefined,
        place: e.place || undefined,
        description: e.description || undefined,
        orderIndex: e.order_index || 0,
      }));

      // Fetch families from Supabase (using the view that includes children)
      const { data: familiesData, error: familiesError } = await supabase
        .from('families_with_children')
        .select('*')
        .eq('person_id', id)
        .order('order_index', { ascending: true });

      if (familiesError) {
        console.error('Error fetching families from Supabase:', familiesError);
      }

      // Process families and fetch spouse details from Neo4j if needed
      const families: Family[] = await Promise.all(
        (familiesData || []).map(async (f) => {
          let spouse: RelatedPerson | undefined = undefined;

          // If there's a spouse_id, fetch their details from Neo4j
          if (f.spouse_id) {
            const spouseResult = await session.run(
              `MATCH (s:Person {id: $spouseId})
               RETURN s`,
              { spouseId: f.spouse_id }
            );

            if (spouseResult.records.length > 0) {
              const spouseNode = spouseResult.records[0].get('s');
              spouse = {
                id: spouseNode.properties.id,
                name: spouseNode.properties.name,
                firstName: spouseNode.properties.firstName || undefined,
                middleName: spouseNode.properties.middleName || undefined,
                lastName: spouseNode.properties.lastName || undefined,
              };
            }
          }

          // Parse children from JSON array
          const childrenIds: string[] = f.children ? JSON.parse(f.children) : [];

          // Fetch child details from Neo4j
          const childrenDetails: RelatedPerson[] = [];
          for (const childId of childrenIds) {
            const childResult = await session.run(
              `MATCH (c:Person {id: $childId})
               RETURN c`,
              { childId }
            );

            if (childResult.records.length > 0) {
              const childNode = childResult.records[0].get('c');
              childrenDetails.push({
                id: childNode.properties.id,
                name: childNode.properties.name,
                firstName: childNode.properties.firstName || undefined,
                middleName: childNode.properties.middleName || undefined,
                lastName: childNode.properties.lastName || undefined,
              });
            }
          }

          return {
            id: f.id,
            spouseId: f.spouse_id || undefined,
            spouseName: f.spouse_name || undefined,
            spouse,
            marriageDate: f.marriage_date || undefined,
            marriagePlace: f.marriage_place || undefined,
            divorceDate: f.divorce_date || undefined,
            children: childrenDetails,
            orderIndex: f.order_index || 0,
          };
        })
      );

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
        dnaProven: node.properties.dnaProven || undefined,
        hasPicture: node.properties.hasPicture || undefined,
        hasFamilyBible: node.properties.hasFamilyBible || undefined,
        militaryService: node.properties.militaryService || undefined,
        page: node.properties.page || undefined,
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
        events: events,
        families: families,
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
