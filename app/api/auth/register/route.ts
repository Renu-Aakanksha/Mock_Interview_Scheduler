import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { generateToken, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const { email, password, name, role, company, title } = userData;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create user
    const user = await db.createUser({
      email,
      name,
      role,
      ...(role === 'employee' && { company, title })
    });

    const token = generateToken();

    return NextResponse.json({
      user,
      token
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}