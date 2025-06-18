'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { setStoredAuth } from '@/lib/auth';

const companies = ['Google', 'Meta', 'Apple', 'Amazon', 'Netflix', 'Microsoft'];

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, role: 'employee' | 'candidate') => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const userData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      role,
      ...(role === 'employee' && {
        company: formData.get('company') as string,
        title: formData.get('title') as string
      })
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStoredAuth(data.user, data.token);
      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join the interview platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="candidate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="employee">Employee</TabsTrigger>
            </TabsList>
            
            <TabsContent value="candidate">
              <form onSubmit={(e) => handleSubmit(e, 'candidate')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate-name">Full Name</Label>
                  <Input
                    id="candidate-name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-email">Email</Label>
                  <Input
                    id="candidate-email"
                    name="email"
                    type="email"
                    placeholder="candidate@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-password">Password</Label>
                  <Input
                    id="candidate-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign Up as Candidate'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="employee">
              <form onSubmit={(e) => handleSubmit(e, 'employee')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-name">Full Name</Label>
                  <Input
                    id="employee-name"
                    name="name"
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-email">Email</Label>
                  <Input
                    id="employee-email"
                    name="email"
                    type="email"
                    placeholder="interviewer@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-password">Password</Label>
                  <Input
                    id="employee-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select name="company" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Senior Software Engineer"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign Up as Employee'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}