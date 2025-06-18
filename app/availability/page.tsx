'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { TimeSlot } from '@/lib/types';

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00'
  });

  useEffect(() => {
    if (user) {
      fetchTimeSlots();
    }
  }, [user]);

  const fetchTimeSlots = async () => {
    if (!user) return;

    try {
      // For demo purposes, create some mock time slots
      const mockSlots: TimeSlot[] = [];
      for (let i = 1; i <= 7; i++) {
        const date = addDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        mockSlots.push({
          id: `${i}-1`,
          employee_id: user.id,
          date: dateStr,
          start_time: '09:00',
          end_time: '10:00',
          is_available: true,
          is_booked: false
        });
        
        mockSlots.push({
          id: `${i}-2`,
          employee_id: user.id,
          date: dateStr,
          start_time: '14:00',
          end_time: '15:00',
          is_available: true,
          is_booked: false
        });
      }
      
      setTimeSlots(mockSlots);
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!user) return;

    setIsAdding(true);
    try {
      const response = await fetch('/api/time-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: user.id,
          ...newSlot
        })
      });

      if (response.ok) {
        const slot = await response.json();
        setTimeSlots([...timeSlots, slot]);
        setNewSlot({
          date: format(new Date(), 'yyyy-MM-dd'),
          start_time: '09:00',
          end_time: '10:00'
        });
      }
    } catch (error) {
      console.error('Failed to add time slot:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSlot = (slotId: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
  };

  const groupedSlots = timeSlots.reduce((groups, slot) => {
    const date = slot.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {} as Record<string, TimeSlot[]>);

  if (!user || user.role !== 'employee') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only available to employees.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Availability</h1>
          <p className="text-gray-600">Set your interview availability schedule</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add New Slot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Time Slot
              </CardTitle>
              <CardDescription>Create a new available time slot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                />
              </div>
              
              <Button
                onClick={handleAddSlot}
                disabled={isAdding}
                className="w-full"
              >
                {isAdding ? 'Adding...' : 'Add Slot'}
              </Button>
            </CardContent>
          </Card>

          {/* Current Availability */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Current Availability
                </CardTitle>
                <CardDescription>Your scheduled interview slots</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(groupedSlots).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupedSlots)
                      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                      .map(([date, slots]) => (
                        <div key={date}>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3">
                            {slots.map(slot => (
                              <div
                                key={slot.id}
                                className="flex items-center justify-between p-3 bg-white border rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">
                                    {slot.start_time} - {slot.end_time}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      slot.is_booked
                                        ? 'text-red-600 border-red-200'
                                        : 'text-green-600 border-green-200'
                                    }
                                  >
                                    {slot.is_booked ? 'Booked' : 'Available'}
                                  </Badge>
                                </div>
                                {!slot.is_booked && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveSlot(slot.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No availability set</h3>
                    <p className="text-gray-600">Add your first time slot to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}