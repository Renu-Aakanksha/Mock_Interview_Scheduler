'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/lib/types';

interface CompanyPageProps {
  params: { name: string };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const companyName = decodeURIComponent(params.name);

  useEffect(() => {
    fetchEmployees();
  }, [params.name]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/companies/${encodeURIComponent(companyName)}/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/companies" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white text-2xl font-bold">
                {companyName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
              <p className="text-gray-600">Available Interviewers</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(employee => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>{employee.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {employee.company}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Available
                    </Badge>
                    <Link href={`/book/${employee.id}`}>
                      <Button size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Interview
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviewers available</h3>
            <p className="text-gray-600">Check back later for available interviewers at {companyName}.</p>
          </div>
        )}
      </div>
    </div>
  );
}