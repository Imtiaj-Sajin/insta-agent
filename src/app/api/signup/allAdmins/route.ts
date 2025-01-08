import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/database/dbc';  // Import the MySQL pool

export async function GET(req: NextRequest) {
  try {
    // Query to get all admins
    const [rows]: any = await pool.promise().query('SELECT * FROM admin');
    
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No admins found' }, { status: 404 });
    }

    return NextResponse.json({ admins: rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}
