import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const companyName = decodeURIComponent(params.name);
    const employees = await db.getEmployeesByCompany(companyName);
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}