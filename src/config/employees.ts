export interface EmployeeConfig {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  profileColor?: string;
}

export const employeesConfig: Record<string, EmployeeConfig> = {
  alexJohnson: {
    id: "alex1",
    name: "Alex Johnson",
    role: "Product Manager",
    department: "Product",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    profileColor: "bg-blue-500"
  },
  emmaWilson: {
    id: "emma1",
    name: "Emma Wilson",
    role: "Senior Developer",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    profileColor: "bg-purple-500"
  },
  michaelChen: {
    id: "michael1",
    name: "Michael Chen",
    role: "UI/UX Designer",
    department: "Design",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    profileColor: "bg-green-500"
  }
  // Add more employees as needed
}; 