import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(req: NextRequest) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM workflows');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error('Error querying data:', err);
    return NextResponse.error();
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO workflows (name) VALUES ($1) RETURNING id',
      [name]
    );
    return NextResponse.json({ id: result.rows[0].id }, { status: 200 });
  } catch (err) {
    console.error('Error saving data:', err);
    return NextResponse.error();
  } finally {
    client.release();
  }
}