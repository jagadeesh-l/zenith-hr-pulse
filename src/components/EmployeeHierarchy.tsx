import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

// Position hierarchy levels
const POSITION_LEVELS = {
  level1: ['CEO', 'CTO', 'CFO', 'CSO'],
  level2: ['VP', 'Vice President'],
  level3: ['Senior Director'],
  level4: ['Director'],
  level5: ['Senior Architect', 'Senior QA Architect', 'Senior Manager'],
  level6: ['Architect', 'QA Architect', 'Manager'],
  level7: ['Senior Engineer'],
  level8: ['Engineer']
};

// Function to determine employee level based on position
const getEmployeeLevel = (position: string): number => {
  const pos = position.toLowerCase();
  
  for (const [level, positions] of Object.entries(POSITION_LEVELS)) {
    if (positions.some(p => pos.includes(p.toLowerCase()))) {
      return parseInt(level.replace('level', ''));
    }
  }
  
  // Default to level 8 if position doesn't match any hierarchy
  return 8;
};

// Function to get level name
const getLevelName = (level: number): string => {
  const levelNames = {
    1: 'Executive Leadership',
    2: 'Vice Presidents',
    3: 'Senior Directors',
    4: 'Directors',
    5: 'Senior Leadership',
    6: 'Leadership',
    7: 'Senior Engineers',
    8: 'Engineers'
  };
  return levelNames[level as keyof typeof levelNames] || 'Other';
};

// Function to get level color
const getLevelColor = (level: number): string => {
  const colors = {
    1: 'bg-red-100 text-red-800 border-red-200',
    2: 'bg-orange-100 text-orange-800 border-orange-200',
    3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    4: 'bg-green-100 text-green-800 border-green-200',
    5: 'bg-blue-100 text-blue-800 border-blue-200',
    6: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    7: 'bg-purple-100 text-purple-800 border-purple-200',
    8: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export function EmployeeHierarchy({ employees }: EmployeeHierarchyProps) {
  // Group employees by hierarchy level
  const employeesByLevel = employees.reduce((acc, employee) => {
    const level = getEmployeeLevel(employee.position);
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(employee);
    return acc;
  }, {} as Record<number, Employee[]>);

  // Sort levels from highest to lowest
  const sortedLevels = Object.keys(employeesByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Organization Chart</h2>
        <p className="text-muted-foreground">Hierarchical view based on position levels</p>
      </div>

      {sortedLevels.map((level) => (
        <Card key={level} className="w-full overflow-hidden">
          <div className="bg-muted px-6 py-4 font-medium flex items-center justify-between">
            <span className="text-lg">{getLevelName(level)}</span>
            <Badge variant="outline" className={getLevelColor(level)}>
              Level {level}
            </Badge>
          </div>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {employeesByLevel[level].map((employee) => (
                <div key={employee.id} className="flex flex-col items-center group">
                  <div className="relative">
                    <Avatar className="h-16 w-16 mb-3 group-hover:scale-105 transition-transform duration-200">
                      <AvatarImage src={employee.photoUrl} alt={employee.name} />
                      <AvatarFallback className="text-lg">{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Level indicator dot */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getLevelColor(level).split(' ')[0]}`}></div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-sm mb-1">{employee.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{employee.position}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sortedLevels.map((level) => (
              <div key={level} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(level)}`}>
                  Level {level}
                </div>
                <p className="text-2xl font-bold mt-2">{employeesByLevel[level].length}</p>
                <p className="text-xs text-muted-foreground">{getLevelName(level)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
