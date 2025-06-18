import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { generateToken, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
        { error: 'Invalid role for this account' },
        { status: 401 }
      );
    }

    // In a real app, verify hashed password
    // For demo purposes, we'll accept any password
    const token = generateToken();

    return NextResponse.json({
      user,
      token
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}