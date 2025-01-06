import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const otpRecord = await prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'OTP not found' }, { status: 404 });
    }

    if (otpRecord.code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    await prisma.otp.delete({
      where: { email },
    });

    return NextResponse.json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
