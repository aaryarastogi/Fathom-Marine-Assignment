export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Crew';
}

export interface Ship {
  _id: string;
  name: string;
  imoNumber: string;
  type: string;
}

export interface MaintenanceTask {
  _id: string;
  title: string;
  description: string;
  shipId: Ship;
  assignedTo?: User;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  completedDate?: string;
  notes?: string;
}

export interface SafetyDrill {
  _id: string;
  title: string;
  description: string;
  shipId: Ship;
  scheduledDate: string;
  completedDate?: string;
  status: 'Scheduled' | 'Completed' | 'Missed';
  attendance: (User | string)[];
}
