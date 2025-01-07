import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../database/dbc'; // Import your MySQL pool

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    // Retrieve the OTP record from the database
    const [rows]: any = await pool.promise().execute(
      'SELECT * FROM otp WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'OTP not found' }, { status: 404 });
    }

    const otpRecord = rows[0];
    if (otpRecord.code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    // OTP verified, delete the OTP record
    await pool.promise().execute('DELETE FROM otp WHERE email = ?', [email]);

    return NextResponse.json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
