'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, Users, BookOpen } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InterviewLink</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user.role === 'employee' ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/availability">
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Availability
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/companies">
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Companies
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Interviews
                  </Button>
                </Link>
              </>
            )}

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}