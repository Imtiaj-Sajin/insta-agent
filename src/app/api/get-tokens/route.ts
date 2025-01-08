// src/app/api/get-tokens/route.ts
// src/app/api/get-tokens/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Import the NextAuth getToken function
import { pool } from '@/database/dbc'; // Import your MySQL connection pool

export async function GET(req: NextRequest) {
  try {
    // Extract the token using NextAuth
    const token = await getToken({ req });

    // If token doesn't exist, return 401 Unauthorized
    if (!token || !token.adminid) {
      return NextResponse.json({ error: 'Unauthorized: Token not found or invalid' }, { status: 401 });
    }

    const adminid = token.adminid; // Get admin ID from the token

    // Query the database to get the page access token
    const [rows]: any = await pool
      .promise()
      .execute('SELECT pageaccesstoken FROM Automationsettings WHERE adminid = ?', [adminid]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Page access token not found' }, { status: 404 });
    }

    // Return the page access token in the response
    const { pageaccesstoken } = rows[0];
    return NextResponse.json({
      adminid,
      pageAccessToken: pageaccesstoken,
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
