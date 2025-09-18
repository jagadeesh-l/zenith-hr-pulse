import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

// Employee type definition
export interface Employee {
  id: string;
  employeeId?: string;
  name: string;
  position: string;
  department: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  bio?: string;
  startDate?: string;
  manager?: string;
  reporting_to?: string;
  skills?: string[];
  expertise?: string;
  experienceYears?: number;
  location?: string;
  dateOfBirth?: string;
  dateOfJoining?: string;
  gender?: string;
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
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle empty data case
      if (!data || !Array.isArray(data)) {
        console.warn("API returned non-array data:", data);
        setEmployees([]);
        return;
      }
      
      // Transform data to match our frontend model
      const transformedData = data.map((emp: any) => ({
        id: emp.id || "temp-" + Math.random().toString(36).substr(2, 9),
        employeeId: emp.employee_id || "",
        name: emp.name || "Unknown",
        position: emp.position || "Not specified",
        department: emp.department || "Not specified",
        photoUrl: emp.photo_url || "",
        email: emp.email || "",
        phone: emp.phone || "",
        mobile: emp.mobile || "",
        bio: emp.bio || "",
        startDate: emp.start_date || "",
        manager: emp.reporting_to || "", // Map manager to reporting_to field
        reporting_to: emp.reporting_to || "",
        skills: emp.skills || [],
        expertise: emp.expertise || "",
        experienceYears: emp.experience_years || 0,
        location: emp.location || "",
        dateOfBirth: emp.date_of_birth || "",
        dateOfJoining: emp.date_of_joining || "",
        gender: emp.gender || ""
      }));
      
      setEmployees(transformedData);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      
      // Use mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock data for development");
        const mockEmployees = [
          { 
            id: "1", 
            name: "Alex Johnson", 
            position: "Developer", 
            department: "Engineering", 
            photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
            email: "alex.johnson@example.com"
          },
          { 
            id: "2", 
            name: "Emma Wilson", 
            position: "Designer", 
            department: "Product", 
            photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
          }
        ];
        setEmployees(mockEmployees);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load employees. Please try again.',
          variant: 'destructive',
        });
      }
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
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      // Append all employee data to FormData
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'photoUrl' && value instanceof File) {
            formData.append('photo', value); // Change to 'photo' to match backend
          } else if (key !== 'photoUrl') { // Skip photoUrl if it's not a File
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/employees/`, {  // Use main endpoint
        method: 'POST',
        body: formData, // Use FormData instead of JSON
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
      // Format the date to ISO string format if it exists
      const formattedData = {
        ...employeeData,
        start_date: employeeData.startDate ? new Date(employeeData.startDate).toISOString().split('T')[0] : undefined,
      };

      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formattedData.name,
          position: formattedData.position,
          department: formattedData.department,
          email: formattedData.email,
          phone: formattedData.phone,
          bio: formattedData.bio,
          start_date: formattedData.start_date,
          photo_url: formattedData.photoUrl,
          reporting_to: formattedData.reporting_to,
          skills: formattedData.skills,
          expertise: formattedData.expertise,
          experience_years: formattedData.experienceYears
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
        reporting_to: data.reporting_to,
        skills: data.skills,
        expertise: data.expertise,
        experienceYears: data.experience_years
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
      
      const response = await fetch(`${API_BASE_URL}/employees/import-csv`, {  // Use the new CSV import endpoint
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Refresh employee list
      await fetchEmployees();  // Added await
      
      toast({
        title: 'Import successful',
        description: `${result.inserted || result.successful_imports} employees have been imported.`,  // Handle both response formats
      });
      
      return true;
    } catch (err) {
      console.error('Import error:', err);  // Added error logging
      toast({
        title: 'Import failed',
        description: 'Failed to import employees. Please check the file format.',
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
