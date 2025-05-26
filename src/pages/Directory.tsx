import { useState } from "react";
import { Header } from "@/components/Header";
import { SidebarContent } from "@/components/SidebarContent";
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
  Plus,
} from "lucide-react";
import { EmployeeCard } from "@/components/EmployeeCard";
import { EmployeeList } from "@/components/EmployeeList";
import { EmployeeHierarchy } from "@/components/EmployeeHierarchy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmployees } from "@/hooks/use-employees";

type ViewMode = "grid" | "list" | "hierarchy";

export default function Directory() {
  const [activeModule, setActiveModule] = useState<string>("Directory");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { employees, isLoading, error } = useEmployees();

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  // Filter employees based on search query and active filters
  const filteredEmployees = employees.filter((employee) => {
    // Search filter
    if (
      searchQuery &&
      !employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Department filters
    if (
      activeFilters.some((filter) => filter.startsWith("Department:")) &&
      !activeFilters.includes(`Department: ${employee.department}`)
    ) {
      return false;
    }

    return true;
  });
  return (
    <div className="min-h-screen bg-background flex w-full">
      <div className="hidden md:block">
        <SidebarContent
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="container px-6 py-8">
            {/* Header Section */}
            <section className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Directory
              </h1>
              <p className="text-muted-foreground">
                Manage your organization's employee directory
              </p>
            </section>

            {/* Controls Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-border mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee name, ID"
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 ml-auto">
                  {/* View Controls */}
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Filter className="h-4 w-4" />
                          Filters
                          {activeFilters.length > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-1">
                              {activeFilters.length}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleFilter("Department: Engineering")}
                        >
                          Department: Engineering
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleFilter("Department: Product")}
                        >
                          Department: Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFilter("Department: HR")}>
                          Department: HR
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFilter("Status: Active")}>
                          Status: Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFilter("Status: On Leave")}>
                          Status: On Leave
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex border border-border rounded-lg overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-none ${
                          viewMode === "grid" ? "bg-accent" : ""
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-none ${
                          viewMode === "list" ? "bg-accent" : ""
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-none ${
                          viewMode === "hierarchy" ? "bg-accent" : ""
                        }`}
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
                  <div className="mt-4 flex flex-wrap gap-2">
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
                    <>
                      {viewMode === "grid" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {filteredEmployees.map((employee) => (
                            <EmployeeCard key={employee.id} {...employee} />
                          ))}
                        </div>
                      )}
                      {viewMode === "list" && (
                        <EmployeeList employees={filteredEmployees as any} />
                      )}
                      {viewMode === "hierarchy" && (
                        <EmployeeHierarchy employees={filteredEmployees as any} />
                      )}
                    </>
                  )}
                </div>
              </div> {/* End of bg-white ... controls section */}
            </div> {/* End of container px-6 py-8 */}
          </div>
        </main>
      </div>
    </div>
  );
}
