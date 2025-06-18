import { User, Company, TimeSlot, Interview } from './types';

// Mock database - in production this would use Supabase
class MockDatabase {
  private users: Map<string, User> = new Map();
  private companies: Map<string, Company> = new Map();
  private timeSlots: Map<string, TimeSlot> = new Map();
  private interviews: Map<string, Interview> = new Map();
  private userEmails: Map<string, string> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed companies
    const companies = [
      { id: '1', name: 'Google', description: 'Search engine giant and tech innovator' },
      { id: '2', name: 'Meta', description: 'Social media and virtual reality company' },
      { id: '3', name: 'Apple', description: 'Consumer electronics and software company' },
      { id: '4', name: 'Amazon', description: 'E-commerce and cloud computing leader' },
      { id: '5', name: 'Netflix', description: 'Streaming entertainment platform' },
      { id: '6', name: 'Microsoft', description: 'Software and cloud services company' },
    ];

    companies.forEach(company => this.companies.set(company.id, company));

    // Seed sample employees
    const employees = [
      {
        id: '1',
        email: 'sarah.chen@google.com',
        name: 'Sarah Chen',
        role: 'employee' as const,
        company: 'Google',
        title: 'Senior Software Engineer',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        email: 'mike.johnson@meta.com',
        name: 'Mike Johnson',
        role: 'employee' as const,
        company: 'Meta',
        title: 'Product Manager',
        created_at: new Date().toISOString()
      }
    ];

    employees.forEach(employee => {
      this.users.set(employee.id, employee);
      this.userEmails.set(employee.email, employee.id);
    });
  }

  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const id = Date.now().toString();
    const user: User = {
      ...userData,
      id,
      created_at: new Date().toISOString()
    };
    this.users.set(id, user);
    this.userEmails.set(user.email, id);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const userId = this.userEmails.get(email);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompanyByName(name: string): Promise<Company | null> {
    return Array.from(this.companies.values()).find(c => c.name === name) || null;
  }

  // Employees by company
  async getEmployeesByCompany(companyName: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      user => user.role === 'employee' && user.company === companyName
    );
  }

  // Time slots
  async createTimeSlot(slotData: Omit<TimeSlot, 'id'>): Promise<TimeSlot> {
    const id = Date.now().toString();
    const slot: TimeSlot = { ...slotData, id };
    this.timeSlots.set(id, slot);
    return slot;
  }

  async getTimeSlotsByEmployee(employeeId: string): Promise<TimeSlot[]> {
    return Array.from(this.timeSlots.values()).filter(
      slot => slot.employee_id === employeeId
    );
  }

  async updateTimeSlot(id: string, updates: Partial<TimeSlot>): Promise<TimeSlot | null> {
    const slot = this.timeSlots.get(id);
    if (!slot) return null;
    
    const updated = { ...slot, ...updates };
    this.timeSlots.set(id, updated);
    return updated;
  }

  // Interviews
  async createInterview(interviewData: Omit<Interview, 'id' | 'created_at'>): Promise<Interview> {
    const id = Date.now().toString();
    const interview: Interview = {
      ...interviewData,
      id,
      created_at: new Date().toISOString()
    };
    this.interviews.set(id, interview);
    return interview;
  }

  async getInterviewsByEmployee(employeeId: string): Promise<Interview[]> {
    return Array.from(this.interviews.values()).filter(
      interview => interview.employee_id === employeeId
    );
  }

  async getInterviewsByCandidate(candidateId: string): Promise<Interview[]> {
    return Array.from(this.interviews.values()).filter(
      interview => interview.candidate_id === candidateId
    );
  }
}

export const db = new MockDatabase();