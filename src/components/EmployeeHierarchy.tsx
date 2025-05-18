
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl: string;
}

interface EmployeeHierarchyProps {
  employees: Employee[];
}

export function EmployeeHierarchy({ employees }: EmployeeHierarchyProps) {
  // For this example, we'll mock some hierarchy data
  // In a real app, you'd have proper hierarchical data
  const departments = [...new Set(employees.map(emp => emp.department))];
  
  return (
    <div className="space-y-8">
      {departments.map((department) => (
        <Card key={department} className="overflow-hidden">
          <div className="bg-muted px-4 py-3 font-medium">
            {department} Department
          </div>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              {/* Department head - just using the first employee of that department for this example */}
              {employees.filter(emp => emp.department === department).slice(0, 1).map((head) => (
                <div key={head.id} className="flex flex-col items-center mb-8">
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarImage src={head.photoUrl} alt={head.name} />
                    <AvatarFallback className="text-lg">{head.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium">{head.name}</h3>
                    <p className="text-sm text-muted-foreground">{head.position}</p>
                  </div>
                  
                  <div className="w-px h-8 bg-border mt-4"></div>
                </div>
              ))}
              
              <div className="grid grid-cols-3 gap-8 w-full">
                {employees.filter(emp => emp.department === department).slice(1).map((employee) => (
                  <div key={employee.id} className="flex flex-col items-center">
                    <Avatar className="h-12 w-12 mb-2">
                      <AvatarImage src={employee.photoUrl} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h4 className="font-medium text-sm">{employee.name}</h4>
                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
