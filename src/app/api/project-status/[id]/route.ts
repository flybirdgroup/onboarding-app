import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const PUT = async (request: NextRequest) => {
  const { pathname, searchParams } = new URL(request.url);
  const id = pathname.split("/").pop();
  
  console.log("Request URL:", request.url);
  console.log("Extracted ID:", id);
  
  if (!id) {
    console.log("Invalid request: missing ID");
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  let data;
  try {
    data = await request.json();
    console.log("Received data:", data);
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return NextResponse.json({ message: "Failed to parse request body" }, { status: 400 });
  }

  const { pr, projectid, cr, github, cyberflow, sonartypeiqscan, ice } = data;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE project_statuses 
       SET pr = $1, projectid = $2, cr = $3, github = $4, cyberflow = $5, sonartypeiqscan = $6, ice = $7 
       WHERE eim = $8 RETURNING *;`,
      [pr, projectid, cr, github, cyberflow, sonartypeiqscan, ice, id]
    );
    console.log('Updated entry:', result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating project status:', error);
    return NextResponse.json({ message: 'Error updating project status' }, { status: 500 });
  } finally {
    client.release();
  }
};

export const DELETE = async (request: NextRequest) => {
  const { pathname } = new URL(request.url);
  const id = pathname.split("/").pop();
  
  console.log("Request URL:", request.url);
  console.log("Extracted ID:", id);

  if (!id) {
    console.log("Invalid request: missing ID");
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('DELETE FROM project_statuses WHERE eim = $1;', [id]);
    console.log('Deleted entry with eim:', id);
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project status:', error);
    return NextResponse.json({ message: 'Error deleting project status' }, { status: 500 });
  } finally {
    client.release();
  }
};