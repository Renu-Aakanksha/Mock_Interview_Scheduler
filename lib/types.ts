export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'candidate';
  company?: string;
  title?: string;
  avatar?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface TimeSlot {
  id: string;
  employee_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_booked: boolean;
}

export interface Interview {
  id: string;
  employee_id: string;
  candidate_id: string;
  company_name: string;
  date: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  employee_name: string;
  candidate_name: string;
  candidate_email: string;
  employee_email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'available' | 'booked' | 'interview';
  data?: any;
}