import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const timeSlots = await db.getTimeSlotsByEmployee(employeeId);
    return NextResponse.json(timeSlots);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const slotData = await request.json();
    const { employee_id, date, start_time, end_time } = slotData;

    if (!employee_id || !date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const slot = await db.createTimeSlot({
      employee_id,
      date,
      start_time,
      end_time,
      is_available: true,
      is_booked: false
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create time slot' },
      { status: 500 }
    );
  }
}