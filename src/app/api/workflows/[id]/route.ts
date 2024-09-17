import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(req: NextRequest) {
  const { id } = req.query;

  const client = await pool.connect();
  try {
    const workflowResult = await client.query('SELECT * FROM workflows WHERE id = $1', [id]);
    const nodesResult = await client.query('SELECT * FROM nodes WHERE workflow_id = $1', [id]);
    const connectionsResult = await client.query('SELECT * FROM connections WHERE workflow_id = $1', [id]);

    return NextResponse.json({
      workflow: workflowResult.rows[0],
      nodes: nodesResult.rows,
      connections: connectionsResult.rows,
    }, { status: 200 });
  } catch (err) {
    console.error('Error querying data:', err);
    return NextResponse.error();
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const { name, nodes, connections } = await req.json();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const workflowResult = await client.query(
      'INSERT INTO workflows (name) VALUES ($1) RETURNING id',
      [name]
    );
    const workflowId = workflowResult.rows[0].id;

    for (const node of nodes) {
      await client.query(
        'INSERT INTO nodes (workflow_id, type, position, config) VALUES ($1, $2, $3, $4)',
        [workflowId, node.type, node.position, node.config]
      );
    }

    for (const connection of connections) {
      await client.query(
        'INSERT INTO connections (workflow_id, from_node_id, to_node_id) VALUES ($1, $2, $3)',
        [workflowId, connection.from, connection.to]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Workflow saved successfully', id: workflowId }, { status: 200 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving data:', err);
    return NextResponse.error();
  } finally {
    client.release();
  }
}