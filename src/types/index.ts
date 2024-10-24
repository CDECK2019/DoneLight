export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  starred: boolean;
  dueDate?: string;
  notes?: string;
  subtasks: SubTask[];
  listId: string;
  order: number;
  userId: string;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface List {
  id: string;
  name: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  subscription?: {
    status: 'free' | 'pro' | 'premium';
    validUntil: number;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  stripePriceId: string;
}