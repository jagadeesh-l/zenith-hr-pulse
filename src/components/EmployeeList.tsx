import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { EmployeeProfile } from "./employee/EmployeeProfile";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl: string;
  email?: string;
  phone?: string;
  bio?: string;
  startDate?: string;
  manager?: string;
  skills?: string[];
}

interface EmployeeListProps {
  employees: Employee[];
}

export function EmployeeList({ employees }: EmployeeListProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead className="">Position</TableHead>
              <TableHead className="">Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.photoUrl} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Employee Profile Dialog */}
      {selectedEmployee && (
        <EmployeeProfile 
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
        />
      )}
    </>
  );
}
