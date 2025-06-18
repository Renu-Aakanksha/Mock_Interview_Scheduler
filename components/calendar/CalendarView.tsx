'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'available' | 'booked' | 'interview';
  time?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  canAddEvents?: boolean;
}

export function CalendarView({ events, onDateClick, onEventClick, canAddEvents = false }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[80px] p-1 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isDayToday ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onDateClick?.(day)}
              >
                <div className={`text-sm ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isDayToday ? 'font-bold' : ''}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <Badge
                      key={event.id}
                      variant="outline"
                      className={`text-xs px-1 py-0 ${getEventTypeColor(event.type)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      {event.time || event.title}
                    </Badge>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
                
                {canAddEvents && dayEvents.length === 0 && (
                  <div className="mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-6 p-0 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDateClick?.(day);
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}