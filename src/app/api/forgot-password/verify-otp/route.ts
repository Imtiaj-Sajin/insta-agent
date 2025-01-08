import { NextRequest, NextResponse } from 'next/server';
import {pool} from '@/database/dbc'; // Adjust this path if necessary

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const [otpRecord]: any = await pool.query('SELECT * FROM otp WHERE email = ?', [email]);

    if (otpRecord.length === 0) {
      return NextResponse.json({ error: 'OTP not found' }, { status: 404 });
    }

    const otpData = otpRecord[0];

    if (otpData.code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > new Date(otpData.expiresAt)) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    // Delete the OTP record after verification
    await pool.query('DELETE FROM otp WHERE email = ?', [email]);

    return NextResponse.json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
