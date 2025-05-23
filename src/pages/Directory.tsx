
import { useState } from "react";
import { Header } from "@/components/Header";
import { SidebarContent } from "@/components/SidebarContent";
import { RightSidebar } from "@/components/RightSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Grid3x3, 
  List, 
  Network, 
  Search, 
  Filter, 
  X, 
  Upload, 
  Plus 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmployeeCard, EmployeeCardProps } from "@/components/EmployeeCard";
import { EmployeeList } from "@/components/EmployeeList";
import { EmployeeHierarchy } from "@/components/EmployeeHierarchy";
import { AddEmployeeForm } from "@/components/employee/AddEmployeeForm";
import { ImportEmployees } from "@/components/employee/ImportEmployees";
import { useAuth } from "@/hooks/use-auth"; // Assuming you have this
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmployees, Employee as ApiEmployee } from '@/hooks/use-employees';

type ViewMode = "grid" | "list" | "hierarchy";

export default function Directory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string>("Directory");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const isAdmin = true; // For demo purposes, assume admin
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);
  
  const { 
    employees, 
    isLoading, 
    error,
    createEmployee,
    importEmployeesFromCsv 
  } = useEmployees();
  
  // Available departments for filters and forms
  const departments = ["Engineering", "Product", "Operations", "HR", "Finance", "Marketing", "Sales"];
  
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  const clearFilters = () => setActiveFilters([]);
  
  // Filter employees based on search query and active filters
  const filteredEmployees = employees.filter(employee => {
    // Search filter
    if (searchQuery && !employee.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Department filters
    if (activeFilters.some(filter => filter.startsWith("Department:")) && 
        !activeFilters.includes(`Department: ${employee.department}`)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuToggle={toggleSidebar} />
      
      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}>
          <SidebarContent 
            activeModule={activeModule} 
            onModuleChange={setActiveModule} 
          />
        </aside>
        
        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-10 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          rightSidebarOpen ? 'lg:mr-72' : ''
        }`}>
          <div className="container px-4 py-6">
            {/* Page Header */}
            <section className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Employees</h1>
              <p className="text-muted-foreground">View all of your team members, and colleagues.</p>
              <div className="h-px w-full bg-border mt-4"></div>
            </section>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by employee name, ID" className="pl-10 pr-4" />
              </div>
              
              <div className="flex gap-2 ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toggleFilter("Department: Engineering")}>Department: Engineering</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleFilter("Department: Product")}>Department: Product</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleFilter("Department: HR")}>Department: HR</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleFilter("Status: Active")}>Status: Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleFilter("Status: On Leave")}>Status: On Leave</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex border border-border rounded-md overflow-hidden">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-none ${viewMode === "grid" ? "bg-accent" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-none ${viewMode === "list" ? "bg-accent" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-none ${viewMode === "hierarchy" ? "bg-accent" : ""}`}
                    onClick={() => setViewMode("hierarchy")}
                  >
                    <Network className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="default" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
            
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <div 
                    key={index} 
                    className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{filter}</span>
                    <button onClick={() => toggleFilter(filter)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button 
                  className="text-primary text-sm hover:underline"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}
            
            {/* Employee Directory */}
            <div className="mb-8">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      {...employee}
                    />
                  ))}
                </div>
              )}
              
              {viewMode === "list" && (
                <EmployeeList employees={filteredEmployees as any} />
              )}
              
              {viewMode === "hierarchy" && (
                <EmployeeHierarchy employees={filteredEmployees as any} />
              )}
            </div>
          </div>
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar isOpen={rightSidebarOpen} onToggle={toggleRightSidebar} />
      </div>
    </div>
  );
}
