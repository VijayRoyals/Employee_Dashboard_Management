import { Employee } from '../types/employee';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    department: 'Engineering',
    role: 'Senior Developer',
    salary: 95000,
    status: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    department: 'Marketing',
    role: 'Marketing Manager',
    salary: 85000,
    status: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    department: 'Sales',
    role: 'Sales Representative',
    salary: 65000,
    status: false,
  },
  // Add more mock data as needed
];