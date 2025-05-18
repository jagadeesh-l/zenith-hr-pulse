
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
}

interface EmployeeListProps {
  employees: Employee[];
}

export function EmployeeList({ employees }: EmployeeListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
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
                <button className="text-primary hover:underline">View</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
