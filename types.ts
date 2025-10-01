
export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  TECHNICIAN = 'Technician',
}

export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  PENDING = 'Pending',
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum TicketCategory {
    HARDWARE = 'Hardware',
    SOFTWARE = 'Software',
    NETWORK = 'Network',
    ACCESS = 'Access',
    OTHER = 'Other',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requester: User;
  assignee?: User;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  source: 'GLPI' | 'Solman' | 'Email' | 'Web';
  comments: { author: string; text: string; timestamp: string }[];
}

export interface AISuggestion {
  solutions: string[];
  keywords: string[];
}
