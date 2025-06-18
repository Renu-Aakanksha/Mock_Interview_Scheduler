'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, User, Building2, Video } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, addDays, isSameDay } from 'date-fns';
import { User as UserType, TimeSlot } from '@/lib/types';

interface BookingPageProps {
  params: { employeeId: string };
}

export default function BookingPage({ params }: BookingPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [employee, setEmployee] = useState<UserType | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployeeData();
    fetchTimeSlots();
  }, [params.employeeId]);

  const fetchEmployeeData = async () => {
    try {
      // For demo purposes, we'll create mock employee data
      // In a real app, this would fetch from an API
      const mockEmployee: UserType = {
        id: params.employeeId,
        name: 'Sarah Chen',
        email: 'sarah.chen@google.com',
        role: 'employee',
        company: 'Google',
        title: 'Senior Software Engineer',
        created_at: new Date().toISOString()
      };
      setEmployee(mockEmployee);
    } catch (error) {
      console.error('Failed to fetch employee:', error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      // Create mock available time slots for the next 7 days
      const slots: TimeSlot[] = [];
      for (let i = 1; i <= 7; i++) {
        const date = addDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Add morning slots
        slots.push({
          id: `${i}-1`,
          employee_id: params.employeeId,
          date: dateStr,
          start_time: '09:00',
          end_time: '10:00',
          is_available: true,
          is_booked: false
        });
        
        slots.push({
          id: `${i}-2`,
          employee_id: params.employeeId,
          date: dateStr,
          start_time: '11:00',
          end_time: '12:00',
          is_available: true,
          is_booked: false
        });
        
        // Add afternoon slots
        slots.push({
          id: `${i}-3`,
          employee_id: params.employeeId,
          date: dateStr,
          start_time: '14:00',
          end_time: '15:00',
          is_available: true,
          is_booked: false
        });
        
        slots.push({
          id: `${i}-4`,
          employee_id: params.employeeId,
          date: dateStr,
          start_time: '16:00',
          end_time: '17:00',
          is_available: true,
          is_booked: false
        });
      }
      
      setTimeSlots(slots);
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookInterview = async () => {
    if (!selectedSlot || !user || !employee) return;

    setIsBooking(true);
    setError('');

    try {
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employee.id,
          candidate_id: user.id,
          company_name: employee.company,
          date: selectedSlot.date,
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          employee_name: employee.name,
          candidate_name: user.name,
          candidate_email: user.email,
          employee_email: employee.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book interview');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  const availableDates = Array.from(new Set(timeSlots.map(slot => slot.date)))
    .map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime());

  const slotsForSelectedDate = timeSlots.filter(slot => 
    isSameDay(new Date(slot.date), selectedDate) && slot.is_available && !slot.is_booked
  );

  if (!user || user.role !== 'candidate') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only available to candidates.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <p className="text-gray-600">The requested interviewer could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/companies/${encodeURIComponent(employee.company || '')}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {employee.company}
          </Link>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                  <p className="text-gray-600">{employee.title}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-1" />
                    {employee.company}
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Select Date
              </CardTitle>
              <CardDescription>Choose an available date for your interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {availableDates.map(date => (
                  <Button
                    key={date.toISOString()}
                    variant={isSameDay(date, selectedDate) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                  >
                    {format(date, 'EEEE, MMMM d, yyyy')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Slot Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Select Time
              </CardTitle>
              <CardDescription>
                Available slots for {format(selectedDate, 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {slotsForSelectedDate.length > 0 ? (
                  slotsForSelectedDate.map(slot => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start_time} - {slot.end_time}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No available slots for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        {selectedSlot && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Interview Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Interviewer: {employee.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span>Company: {employee.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Date: {format(new Date(selectedSlot.date), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Time: {selectedSlot.start_time} - {selectedSlot.end_time}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-green-600">
                  <Video className="w-4 h-4" />
                  <span>Video call link will be provided after booking</span>
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleBookInterview}
                    disabled={isBooking}
                    className="flex-1"
                  >
                    {isBooking ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}