// A simple auth hook - expand as needed
import { useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

export function useAuth() {
  // For demo purposes, this is a mock implementation
  // Replace with your actual auth logic
  const [user] = useState<User>({
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  });

  const [isLoading, setIsLoading] = useState(false);

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'admin'
  };
} 