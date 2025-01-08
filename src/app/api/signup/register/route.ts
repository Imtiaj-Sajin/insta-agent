import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { pool } from '@/database/dbc'; // Import your MySQL pool

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in the database
    const [result]: any = await pool.promise().execute(
      'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Respond with success
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: { id: result.insertId, name, email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
