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
    <div className="w-full space-y-6">
      {departments.map((department) => (
        <Card key={department} className="w-full overflow-hidden">
          <div className="bg-muted px-6 py-4 font-medium">
            {department} Department
          </div>
          <CardContent className="pt-8">
            <div className="flex flex-col items-center">
              {/* Department head - just using the first employee of that department for this example */}
              {employees.filter(emp => emp.department === department).slice(0, 1).map((head) => (
                <div key={head.id} className="flex flex-col items-center mb-12">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src={head.photoUrl} alt={head.name} />
                    <AvatarFallback className="text-xl">{head.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-lg font-medium">{head.name}</h3>
                    <p className="text-sm text-muted-foreground">{head.position}</p>
                  </div>
                  
                  <div className="w-px h-12 bg-border mt-6"></div>
                </div>
              ))}
              
              {/* Team members */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
                {employees.filter(emp => emp.department === department).slice(1).map((employee) => (
                  <div key={employee.id} className="flex flex-col items-center">
                    <Avatar className="h-16 w-16 mb-3">
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
