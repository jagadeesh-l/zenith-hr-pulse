import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  reporting_to?: string;
}

interface HierarchyNode {
  employee: Employee;
  children: HierarchyNode[];
  isExpanded: boolean;
  isLoading: boolean;
  hasLoaded: boolean;
  directReportsCount: number;
  level: number;
}

interface EmployeeHierarchyFlowchartProps {
  employees: Employee[];
}

export function EmployeeHierarchyFlowchart({ employees }: EmployeeHierarchyFlowchartProps) {
  const [hierarchy, setHierarchy] = useState<HierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loadedChildren, setLoadedChildren] = useState<Map<string, HierarchyNode[]>>(new Map());

  // Build hierarchy structure
  const buildHierarchy = useCallback(() => {
    try {
      // Find root employees (those who don't report to anyone or report to someone not in the list)
      const rootEmployees = employees.filter(emp => 
        !emp.reporting_to || !employees.find(e => e.id === emp.reporting_to)
      );

      // Calculate direct reports count for each employee
      const directReportsCount = new Map<string, number>();
      employees.forEach(emp => {
        if (emp.reporting_to) {
          directReportsCount.set(emp.reporting_to, (directReportsCount.get(emp.reporting_to) || 0) + 1);
        }
      });

      // Create initial hierarchy nodes
      const createNode = (employee: Employee, level: number = 0): HierarchyNode => ({
        employee,
        children: [],
        isExpanded: false,
        isLoading: false,
        hasLoaded: false,
        directReportsCount: directReportsCount.get(employee.id) || 0,
        level
      });

      const rootNodes = rootEmployees.map(emp => createNode(emp, 0));
      setHierarchy(rootNodes);
      setError(null);
    } catch (err) {
      setError('Failed to build hierarchy structure');
      console.error('Error building hierarchy:', err);
    } finally {
      setLoading(false);
    }
  }, [employees]);

  // Load children for a specific node
  const loadChildren = useCallback(async (nodeId: string) => {
    try {
      setHierarchy(prev => 
        prev.map(updateNodeLoading(nodeId, true))
      );

      // Find direct reports
      const directReports = employees.filter(emp => emp.reporting_to === nodeId);
      
      // Calculate direct reports count for each child
      const directReportsCount = new Map<string, number>();
      employees.forEach(emp => {
        if (emp.reporting_to) {
          directReportsCount.set(emp.reporting_to, (directReportsCount.get(emp.reporting_to) || 0) + 1);
        }
      });

      // Create child nodes
      const childNodes: HierarchyNode[] = directReports.map(emp => ({
        employee: emp,
        children: [],
        isExpanded: false,
        isLoading: false,
        hasLoaded: false,
        directReportsCount: directReportsCount.get(emp.id) || 0,
        level: (employees.find(e => e.id === nodeId)?.reporting_to ? 
          employees.find(e => e.id === nodeId)!.reporting_to!.split('.').length : 0) + 1
      }));

      // Cache the children
      setLoadedChildren(prev => new Map(prev).set(nodeId, childNodes));

      // Update hierarchy
      setHierarchy(prev => 
        prev.map(updateNodeChildren(nodeId, childNodes, true))
      );

    } catch (err) {
      setError('Failed to load children');
      console.error('Error loading children:', err);
    } finally {
      setHierarchy(prev => 
        prev.map(updateNodeLoading(nodeId, false))
      );
    }
  }, [employees]);

  // Helper function to update node loading state
  const updateNodeLoading = (nodeId: string, isLoading: boolean) => (node: HierarchyNode): HierarchyNode => {
    if (node.employee.id === nodeId) {
      return { ...node, isLoading };
    }
    return {
      ...node,
      children: node.children.map(updateNodeLoading(nodeId, isLoading))
    };
  };

  // Helper function to update node children
  const updateNodeChildren = (nodeId: string, children: HierarchyNode[], hasLoaded: boolean) => (node: HierarchyNode): HierarchyNode => {
    if (node.employee.id === nodeId) {
      return { ...node, children, hasLoaded };
    }
    return {
      ...node,
      children: node.children.map(updateNodeChildren(nodeId, children, hasLoaded))
    };
  };

  // Toggle node expansion
  const toggleNode = useCallback(async (nodeId: string) => {
    const node = findNodeById(hierarchy, nodeId);
    if (!node) return;

    if (!node.isExpanded && !node.hasLoaded) {
      // Load children if not already loaded
      await loadChildren(nodeId);
    }

    setHierarchy(prev => 
      prev.map(toggleNodeExpansion(nodeId))
    );
  }, [hierarchy, loadChildren]);

  // Helper function to toggle node expansion
  const toggleNodeExpansion = (nodeId: string) => (node: HierarchyNode): HierarchyNode => {
    if (node.employee.id === nodeId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    return {
      ...node,
      children: node.children.map(toggleNodeExpansion(nodeId))
    };
  };

  // Find node by ID
  const findNodeById = (nodes: HierarchyNode[], id: string): HierarchyNode | null => {
    for (const node of nodes) {
      if (node.employee.id === id) return node;
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
    return null;
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, nodeId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleNode(nodeId);
    }
  }, [toggleNode]);

  // Render a single node
  const renderNode = (node: HierarchyNode, depth: number = 0) => {
    const hasChildren = node.directReportsCount > 0;
    const canExpand = hasChildren && !node.hasLoaded;
    const isExpanded = node.isExpanded;

    return (
      <div key={node.employee.id} className="relative">
        <div 
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
            "hover:bg-accent/50 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            depth > 0 && "ml-6 border-l-2 border-l-primary/20"
          )}
          style={{ marginLeft: `${depth * 24}px` }}
          onClick={() => toggleNode(node.employee.id)}
          onKeyDown={(e) => handleKeyDown(e, node.employee.id)}
          tabIndex={0}
          role="button"
          aria-expanded={isExpanded}
          aria-label={`${node.employee.name}, ${node.position}, ${node.directReportsCount} direct reports`}
        >
          {/* Expand/Collapse Button */}
          <div className="flex items-center justify-center w-6 h-6">
            {node.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.employee.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>

          {/* Employee Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={node.employee.photoUrl} alt={node.employee.name} />
            <AvatarFallback className="text-sm">
              {node.employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Employee Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{node.employee.name}</h3>
              {node.directReportsCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {node.directReportsCount}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{node.employee.position}</p>
            <p className="text-xs text-muted-foreground truncate">{node.employee.department}</p>
          </div>
        </div>

        {/* Children */}
        {isExpanded && node.children.length > 0 && (
          <div className="mt-2">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Initialize hierarchy on mount
  useEffect(() => {
    buildHierarchy();
  }, [buildHierarchy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Building hierarchy...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="font-semibold text-lg">Error Loading Hierarchy</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={buildHierarchy} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (hierarchy.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Users className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="font-semibold text-lg">No Hierarchy Data</h3>
          <p className="text-muted-foreground">
            No reporting relationships found. Set up reporting_to relationships to see the hierarchy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Organization Hierarchy</h2>
          <p className="text-muted-foreground">
            Click on any employee to see their direct reports
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{employees.length} employees</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            {hierarchy.map(node => renderNode(node))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
