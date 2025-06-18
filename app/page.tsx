'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Users, Video } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              InterviewLink
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect talented candidates with top tech companies for seamless video interviews. 
              Book, schedule, and conduct interviews all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Easy Scheduling</CardTitle>
                <CardDescription>
                  Simple calendar interface for setting availability and booking interviews
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Video Interviews</CardTitle>
                <CardDescription>
                  Built-in video calling with automatic meeting link generation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Top Companies</CardTitle>
                <CardDescription>
                  Connect with interviewers from FAANG and other leading tech companies
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  For Candidates
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Browse companies and available interviewers
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Book interviews at your convenience
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Get instant meeting links and confirmations
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  For Employees
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Set your availability with flexible scheduling
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Manage all your interviews in one dashboard
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Automatic notifications and reminders
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  if (user.role === 'employee') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-600 mt-2">{user.title} at {user.company}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Interview Dashboard</CardTitle>
                  <CardDescription>
                    View and manage your upcoming interviews
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/availability">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Set Availability</CardTitle>
                  <CardDescription>
                    Configure your interview availability schedule
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600 mt-2">Find your next opportunity</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/companies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Browse Companies</CardTitle>
                <CardDescription>
                  Explore available companies and interviewers
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>My Interviews</CardTitle>
                <CardDescription>
                  View your scheduled interviews and history
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}