import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { pool } from '../../../../database/dbc';  // Import the MySQL pool

// Create a nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if user already exists in the admins table
    const [existingUserRows]: [any[]] = await pool.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );

    if (existingUserRows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to the database
    await pool.execute(
      `INSERT INTO otp (email, code, expiresAt) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE code = ?, expiresAt = ?`,
      [email, otp, expiresAt, otp, expiresAt]
    );

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
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
