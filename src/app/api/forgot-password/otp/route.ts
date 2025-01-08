import { NextRequest, NextResponse } from 'next/server';
import {pool} from '@/database/dbc'; // Adjust this path if necessary
import nodemailer from 'nodemailer';

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
console.log("process.env.EMAIL ==> ", process.env.EMAIL);
console.log("process.env.EMAIL_PASS ==> ", process.env.EMAIL_PASS);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if the email exists in the `admin` table
    const [userResult]: any = await pool.promise().execute(
      'SELECT * FROM admin WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'Email not registered' },
        { status: 404 }
      );
    }

    // Generate OTP and expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Upsert OTP
    await pool.promise().execute(
      `INSERT INTO otp (email, code, expiresAt) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE code = ?, expiresAt = ?`,
      [email, otp, expiresAt, otp, expiresAt]
    );

    // Send email with OTP
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code for Password Reset',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
