'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Interview } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    if (!user) return;

    try {
      const queryParam = user.role === 'employee' ? 'employeeId' : 'candidateId';
      const response = await fetch(`/api/interviews?${queryParam}=${user.id}`);
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' && new Date(`${interview.date} ${interview.start_time}`) > new Date()
  );

  const pastInterviews = interviews.filter(interview => 
    interview.status === 'completed' || new Date(`${interview.date} ${interview.start_time}`) < new Date()
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.role === 'employee' ? 'Interview Dashboard' : 'My Interviews'}
          </h1>
          <p className="text-gray-600">
            {user.role === 'employee' 
              ? 'Manage your upcoming interviews and availability'
              : 'Track your interview schedule and history'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{interviews.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{upcomingInterviews.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{pastInterviews.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        {upcomingInterviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
            <div className="space-y-4">
              {upcomingInterviews.map(interview => (
                <Card key={interview.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{interview.company_name}</span>
                          </div>
                          <Badge variant="outline" className={getStatusColor(interview.status)}>
                            {interview.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>
                              {user.role === 'employee' 
                                ? `Candidate: ${interview.candidate_name}`
                                : `Interviewer: ${interview.employee_name}`
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(interview.date), 'MMM d, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{interview.start_time} - {interview.end_time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Video className="w-4 h-4" />
                            <span>Video Call Ready</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => window.open(interview.meeting_link, '_blank')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Interviews */}
        {pastInterviews.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview History</h2>
            <div className="space-y-4">
              {pastInterviews.map(interview => (
                <Card key={interview.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{interview.company_name}</span>
                          </div>
                          <Badge variant="outline" className={getStatusColor(interview.status)}>
                            {interview.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>
                              {user.role === 'employee' 
                                ? `Candidate: ${interview.candidate_name}`
                                : `Interviewer: ${interview.employee_name}`
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(interview.date), 'MMM d, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{interview.start_time} - {interview.end_time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {interviews.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-600 mb-4">
              {user.role === 'employee' 
                ? 'Your scheduled interviews will appear here.'
                : 'Book your first interview to get started.'
              }
            </p>
            {user.role === 'candidate' && (
              <Button asChild>
                <a href="/companies">Browse Companies</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}