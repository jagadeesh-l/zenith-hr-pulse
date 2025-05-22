import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

// Employee type definition
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  bio?: string;
  startDate?: string;
  manager?: string;
  skills?: string[];
}

// API base URL - could be moved to environment config
const API_BASE_URL = 'http://localhost:8000/api';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform data to match our frontend model
      const transformedData = data.map((emp: any) => ({
        id: emp.id,
        name: emp.name,
        position: emp.position,
        department: emp.department,
        photoUrl: emp.photo_url,
        email: emp.email,
        phone: emp.phone,
        bio: emp.bio,
        startDate: emp.start_date,
        manager: emp.manager_name,
        skills: emp.skills
      }));
      
      setEmployees(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      toast({
        title: 'Error',
        description: 'Failed to load employees. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get employee by ID
  const getEmployee = async (id: string): Promise<Employee | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        position: data.position,
        department: data.department,
        photoUrl: data.photo_url,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        startDate: data.start_date,
        manager: data.manager_name,
        skills: data.skills
      };
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load employee details.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Create a new employee
  const createEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<Employee | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: employeeData.name,
          position: employeeData.position,
          department: employeeData.department,
          email: employeeData.email,
          phone: employeeData.phone,
          bio: employeeData.bio,
          start_date: employeeData.startDate,
          photo_url: employeeData.photoUrl,
          skills: employeeData.skills || []
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update local state
      const newEmployee = {
        id: data.id,
        name: data.name,
        position: data.position,
        department: data.department,
        photoUrl: data.photo_url,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        startDate: data.start_date,
        manager: data.manager_name,
        skills: data.skills
      };
      
      setEmployees([...employees, newEmployee]);
      
      toast({
        title: 'Success',
        description: `${employeeData.name} has been added successfully.`,
      });
      
      return newEmployee;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create employee.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update an existing employee
  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: employeeData.name,
          position: employeeData.position,
          department: employeeData.department,
          email: employeeData.email,
          phone: employeeData.phone,
          bio: employeeData.bio,
          start_date: employeeData.startDate,
          photo_url: employeeData.photoUrl,
          skills: employeeData.skills
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update local state
      const updatedEmployee = {
        id: data.id,
        name: data.name,
        position: data.position,
        department: data.department,
        photoUrl: data.photo_url,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        startDate: data.start_date,
        manager: data.manager_name,
        skills: data.skills
      };
      
      setEmployees(employees.map(emp => 
        emp.id === id ? updatedEmployee : emp
      ));
      
      toast({
        title: 'Success',
        description: 'Employee profile has been updated successfully.',
      });
      
      return updatedEmployee;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update employee.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Delete an employee
  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Update local state
      setEmployees(employees.filter(emp => emp.id !== id));
      
      toast({
        title: 'Success',
        description: 'Employee has been removed successfully.',
      });
      
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete employee.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Import employees from CSV
  const importEmployeesFromCsv = async (file: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/employees/import-csv`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Refresh employee list
      fetchEmployees();
      
      toast({
        title: 'Import successful',
        description: `${result.inserted} employees have been imported.`,
      });
      
      return true;
    } catch (err) {
      toast({
        title: 'Import failed',
        description: 'Failed to import employees from CSV.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading,
    error,
    fetchEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployeesFromCsv
  };
} 