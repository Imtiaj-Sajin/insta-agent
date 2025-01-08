import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import {pool} from '@/database/dbc'; // Adjust the path if necessary

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('UPDATE admin SET password = ? WHERE email = ?', [hashedPassword, email]);

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
