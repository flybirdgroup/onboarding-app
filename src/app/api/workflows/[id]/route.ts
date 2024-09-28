import { NextRequest, NextResponse } from 'next/server';
import { getSession, createNode, createRelationship, getNodes, getRelationships } from '../../../../lib/neo4j';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const session = getSession();
  try {
    // Fetch nodes and relationships for the given workflow ID
    const workflowResult = await session.run(
      'MATCH (n) WHERE n.workflowId = $id RETURN n',
      { id }
    );
    const relationshipResult = await session.run(
      'MATCH (a)-[r]->(b) WHERE a.workflowId = $id AND b.workflowId = $id RETURN r',
      { id }
    );

    const nodes = workflowResult.records.map(record => record.get('n').properties);
    const relationships = relationshipResult.records.map(record => record.get('r').properties);

    return NextResponse.json({ nodes, relationships }, { status: 200 });
  } catch (error) {
    console.error('Error querying data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    session.close();
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { type, properties, fromId, toId, relationshipType } = await req.json();

  const session = getSession();
  try {
    if (type && properties) {
      // Add workflowId to node properties
      properties.workflowId = id;
      const node = await createNode(type, properties);
      return NextResponse.json(node, { status: 200 });
    } else if (fromId && toId && relationshipType) {
      const relationship = await createRelationship(fromId, toId, relationshipType);
      return NextResponse.json(relationship, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error saving data:', error);