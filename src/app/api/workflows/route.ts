import { NextRequest, NextResponse } from 'next/server';
import { createNode, createRelationship, getNodes, getRelationships } from '../../../lib/neo4j';

export async function GET(req: NextRequest) {
  const nodes = await getNodes();
  const relationships = await getRelationships();
  return NextResponse.json({ nodes, relationships });
}

export async function POST(req: NextRequest) {
  const { type, properties, fromId, toId, relationshipType } = await req.json();
  if (type && properties) {
    const node = await createNode(type, properties);
    return NextResponse.json(node);
  } else if (fromId && toId && relationshipType) {
    const relationship = await createRelationship(fromId, toId, relationshipType);
    return NextResponse.json(relationship);
  } else {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}