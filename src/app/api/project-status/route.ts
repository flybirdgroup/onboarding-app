import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM project_statuses;');
    console.log('Fetched records:', result.rows); // Log fetched records
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error querying data:', err);
    return NextResponse.error();
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { EIM, PR, ProjectID, CR, Github, Cyberflow, SonartypeIQScan, ICE } = data;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO project_statuses (EIM, PR, ProjectID, CR, Github, Cyberflow, SonartypeIQScan, ICE) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [EIM, PR, ProjectID, CR, Github, Cyberflow, SonartypeIQScan, ICE]
    );
    console.log('Saved entry:', result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error saving project status:', error);
    return NextResponse.json({ message: 'Error saving project status' }, { status: 500 });
  } finally {
    client.release();
  }
}