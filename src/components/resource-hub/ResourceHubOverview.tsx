
import { useState } from "react";
import { 
  Bell, 
  Search, 
  Filter,
  TrendingUp,
  Users,
  Folders,
  BarChart3,
  Lightbulb,
  Target,
  Calendar,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Plus,
  GripVertical,
  Edit2,
  X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function ResourceHubOverview() {
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [hasNewAlerts, setHasNewAlerts] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [editingMember, setEditingMember] = useState<number | null>(null);
  
  const utilizationData = [
    { project: "Project Alpha", utilization: 85, members: 6 },
    { project: "Project Beta", utilization: 92, members: 4 },
    { project: "Project Gamma", utilization: 68, members: 8 },
    { project: "Project Delta", utilization: 105, members: 5 }
  ];

  const [teamMembers, setTeamMembers] = useState([
    { 
      id: 1,
      name: "Sarah Chen", 
      role: "Frontend Developer", 
      skills: ["React", "TypeScript", "Figma"], 
      projects: ["Project Alpha"],
      utilization: 90 
    },
    { 
      id: 2,
      name: "Mike Johnson", 
      role: "Backend Developer", 
      skills: ["Node.js", "Python", "AWS"], 
      projects: ["Project Beta", "Project Gamma"],
      utilization: 85 
    },
    { 
      id: 3,
      name: "Emma Davis", 
      role: "UI/UX Designer", 
      skills: ["Design", "Prototyping", "User Research"], 
      projects: ["Project Alpha"],
      utilization: 75 
    },
    { 
      id: 4,
      name: "Alex Rodriguez", 
      role: "DevOps Engineer", 
      skills: ["Docker", "Kubernetes", "CI/CD"], 
      projects: ["Project Gamma", "Project Delta"],
      utilization: 110 
    }
  ]);

  const skillFilters = ["All", "Backend", "Frontend", "Design", "DevOps", "QA"];

  const taskCards = [
    { id: 1, title: "API Integration", effort: "3d", priority: "High", project: "Project Alpha" },
    { id: 2, title: "UI Component Library", effort: "5d", priority: "Medium", project: "Project Beta" },
    { id: 3, title: "Database Migration", effort: "2d", priority: "High", project: "Project Gamma" },
    { id: 4, title: "Performance Testing", effort: "1d", priority: "Low", project: "Project Delta" }
  ];

  const projects = ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta"];

  const addSkill = (memberId: number, skill: string) => {
    if (!skill.trim()) return;
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, skills: [...member.skills, skill.trim()] }
        : member
    ));
  };

  const removeSkill = (memberId: number, skillToRemove: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, skills: member.skills.filter(skill => skill !== skillToRemove) }
        : member
    ));
  };

  const addProject = (memberId: number, project: string) => {
    if (!project.trim()) return;
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, projects: [...member.projects, project.trim()] }
        : member
    ));
  };

  const removeProject = (memberId: number, projectToRemove: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, projects: member.projects.filter(project => project !== projectToRemove) }
        : member
    ));
  };

  return (
    <div className="space-y-8">
      {/* Utilization & Integrations */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Project & Resource Utilization</CardTitle>
                <CardDescription>Real-time capacity and allocation insights</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 font-semibold">
                87% Avg Utilization
              </Badge>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Auto-sync from Jira</span>
                <Switch 
                  checked={isAutoSync} 
                  onCheckedChange={setIsAutoSync}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className={`relative ${hasNewAlerts ? 'animate-pulse' : ''}`}
                onClick={() => setHasNewAlerts(false)}
              >
                <Bell className={`w-4 h-4 ${hasNewAlerts ? 'animate-bounce' : ''}`} />
                {hasNewAlerts && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {utilizationData.map((project, index) => (
                <div key={project.project} className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">{project.project}</h4>
                    <Badge 
                      variant={project.utilization > 100 ? "destructive" : project.utilization > 85 ? "default" : "secondary"}
                      className={project.utilization > 100 ? "" : project.utilization > 85 ? "bg-teal-500" : ""}
                    >
                      {project.utilization}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Team Size</span>
                      <span className="font-medium">{project.members} members</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                          project.utilization > 100 ? 'bg-red-500' : 
                          project.utilization > 85 ? 'bg-teal-500' : 'bg-gray-400'
                        }`}
                        style={{ 
                          width: `${Math.min(project.utilization, 100)}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Roles Directory */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Skills & Roles Directory</CardTitle>
                <CardDescription>Team capabilities and current assignments</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Search team members..." 
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skillFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={`transition-all duration-300 ${
                    selectedFilter === filter 
                      ? "bg-teal-500 hover:bg-teal-600 text-white" 
                      : "hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>
            
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{member.name}</h4>
                        <p className="text-sm text-slate-600 mb-3">{member.role}</p>
                        
                        {/* Skills Section */}
                        <div className="mb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-slate-700">Skills</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => setEditingMember(editingMember === member.id ? null : member.id)}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.map((skill) => (
                              <div key={skill} className="flex items-center">
                                <Badge variant="secondary" className="text-xs">
                                  {skill}
                                  {editingMember === member.id && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-4 w-4 p-0 ml-1"
                                      onClick={() => removeSkill(member.id, skill)}
                                    >
                                      <X className="w-2 h-2" />
                                    </Button>
                                  )}
                                </Badge>
                              </div>
                            ))}
                            {editingMember === member.id && (
                              <Input
                                placeholder="Add skill..."
                                className="h-6 text-xs w-24"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addSkill(member.id, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Projects Section */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-slate-700">Current Projects</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {member.projects.map((project) => (
                              <div key={project} className="flex items-center">
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-800 border-blue-200">
                                  {project}
                                  {editingMember === member.id && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-4 w-4 p-0 ml-1"
                                      onClick={() => removeProject(member.id, project)}
                                    >
                                      <X className="w-2 h-2" />
                                    </Button>
                                  )}
                                </Badge>
                              </div>
                            ))}
                            {editingMember === member.id && (
                              <Input
                                placeholder="Add project..."
                                className="h-6 text-xs w-28"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addProject(member.id, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600">Utilization</p>
                      <Badge 
                        variant={member.utilization > 100 ? "destructive" : member.utilization > 85 ? "default" : "secondary"}
                        className={member.utilization > 100 ? "" : member.utilization > 85 ? "bg-teal-500" : ""}
                      >
                        {member.utilization}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Load Balancer */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Team Load Balancer</CardTitle>
              <CardDescription>Drag and drop tasks to optimize team allocation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Available Tasks
              </h4>
              <div className="space-y-3">
                {taskCards.map((task) => (
                  <div 
                    key={task.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:scale-105 transition-all duration-300 cursor-grab active:cursor-grabbing group"
                    draggable
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-teal-500" />
                        <div>
                          <h5 className="font-medium text-slate-900">{task.title}</h5>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-slate-600">{task.effort} effort</p>
                            <span className="text-slate-400">•</span>
                            <Badge variant="outline" className="text-xs">
                              {task.project}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}
                        className={task.priority === 'Medium' ? 'bg-orange-500' : ''}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 flex items-center">
                  <Folders className="w-4 h-4 mr-2" />
                  Project Assignment
                </h4>
                {projects.map((project) => (
                  <div 
                    key={project}
                    className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 min-h-[80px] flex items-center"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-semibold text-sm">
                        {project.charAt(project.length - 1)}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">{project}</h5>
                        <p className="text-sm text-slate-600">
                          {teamMembers.filter(m => m.projects.includes(project)).length} members assigned
                        </p>
                      </div>
                      <div className="text-sm text-slate-500">Drop tasks here</div>
                    </div>
                  </div>
                ))}
                
                <h4 className="font-semibold text-slate-900 flex items-center mt-6">
                  <Users className="w-4 h-4 mr-2" />
                  Individual Assignment
                </h4>
                {teamMembers.slice(0, 3).map((member) => (
                  <div 
                    key={member.id}
                    className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 min-h-[80px] flex items-center"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">{member.name}</h5>
                        <p className="text-sm text-slate-600">{member.utilization}% utilized</p>
                      </div>
                      <div className="text-sm text-slate-500">Drop tasks here</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
