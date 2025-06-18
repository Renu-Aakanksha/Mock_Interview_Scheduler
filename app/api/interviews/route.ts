import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const candidateId = searchParams.get('candidateId');

    if (employeeId) {
      const interviews = await db.getInterviewsByEmployee(employeeId);
      return NextResponse.json(interviews);
    } else if (candidateId) {
      const interviews = await db.getInterviewsByCandidate(candidateId);
      return NextResponse.json(interviews);
    }

    return NextResponse.json(
      { error: 'Employee ID or Candidate ID is required' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const interviewData = await request.json();
    const { 
      employee_id, 
      candidate_id, 
      company_name, 
      date, 
      start_time, 
      end_time,
      employee_name,
      candidate_name,
      candidate_email,
      employee_email
    } = interviewData;

    if (!employee_id || !candidate_id || !company_name || !date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate Jitsi meeting link
    const meetingId = `interview-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const meeting_link = `https://meet.jit.si/${meetingId}`;

    const interview = await db.createInterview({
      employee_id,
      candidate_id,
      company_name,
      date,
      start_time,
      end_time,
      meeting_link,
      status: 'scheduled',
      employee_name,
      candidate_name,
      candidate_email,
      employee_email
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}