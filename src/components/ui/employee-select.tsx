import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
}

interface EmployeeSelectProps {
  employees: Employee[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function EmployeeSelect({
  employees,
  value,
  onValueChange,
  placeholder = "Select employee...",
  className
}: EmployeeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(
        employees.filter(emp =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, employees]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedEmployee = employees.find(emp => emp.id === value);

  const handleSelect = (employeeId: string) => {
    onValueChange(employeeId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Button
        variant="outline"
        className="w-full justify-between text-left font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn(!selectedEmployee && "text-muted-foreground")}>
          {selectedEmployee ? selectedEmployee.name : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredEmployees.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No employees found
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  onClick={() => handleSelect(employee.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === employee.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {employee.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
