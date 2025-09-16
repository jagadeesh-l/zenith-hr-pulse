import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit2, X, Upload, User, Building, MapPin, Mail, Phone, Calendar, Award, Save } from "lucide-react";
import { useEmployees } from '@/hooks/use-employees';

interface EmployeeProfileProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    employeeId?: string;
    name: string;
    position: string;
    department: string;
    photoUrl: string;
    email?: string;
    phone?: string;
    mobile?: string;
    bio?: string;
    startDate?: string;
    skills?: string[];
    manager?: string;
    reporting_to?: string;
    location?: string;
    dateOfBirth?: string;
    dateOfJoining?: string;
    gender?: string;
  };
}

export function EmployeeProfile({ isOpen, onClose, employee }: EmployeeProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(employee);
  const [photo, setPhoto] = useState<File | null>(null);
  const [managerName, setManagerName] = useState<string>('');
  const { toast } = useToast();
  const isAdmin = true; // For demo purposes, assume admin
  const { updateEmployee, employees } = useEmployees();

  // Get unique departments and managers for dropdowns
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  const managers = employees.filter(emp => emp.id !== employee.id); // Exclude current employee
  
  // Ensure departments array is not empty and has valid values
  const validDepartments = departments.filter(dept => dept && dept.trim() !== '');

  // Find manager name from reporting_to UUID
  useEffect(() => {
    if (employee.reporting_to && employees.length > 0) {
      const manager = employees.find(emp => emp.id === employee.reporting_to);
      if (manager) {
        setManagerName(manager.name);
      } else {
        setManagerName('Manager not found');
      }
    } else {
      setManagerName('No manager assigned');
    }
  }, [employee.reporting_to, employees]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', employee.name); // Required by backend
      
      try {
        const response = await fetch(`http://localhost:8000/api/employees/upload-photo/${employee.id}`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to upload image');
        }
        
        const data = await response.json();
        // Update the photo URL with the one returned from server
        setProfileData(prev => ({
          ...prev,
          photoUrl: data.photo_url
        }));
        
        toast({
          title: "Success",
          description: "Photo uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast({
          title: "Error",
          description: `Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedEmployee = await updateEmployee(employee.id, {
        email: profileData.email,
        phone: profileData.phone,
        mobile: profileData.mobile,
        department: profileData.department,
        reporting_to: profileData.reporting_to,
        bio: profileData.bio,
        photoUrl: profileData.photoUrl,
        skills: profileData.skills,
        location: profileData.location,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        dateOfJoining: profileData.dateOfJoining
      });
      
      if (updatedEmployee) {
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setProfileData(employee); // Reset to original data
    setIsEditing(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setIsEditing(false);
      onClose();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profileData.photoUrl} alt={profileData.name} />
              <AvatarFallback className="text-lg">
                {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground">{profileData.position}</p>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button size="sm" className="gap-2" onClick={handleSubmit}>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-20 w-20 flex-shrink-0">
                    <AvatarImage src={profileData.photoUrl} alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="space-y-2">
                      <Label htmlFor="profile-picture" className="text-sm font-medium">
                        Choose Profile Picture
                      </Label>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:transition-colors"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload a new profile picture (JPG, PNG, GIF). Maximum file size: 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Employee ID - Read Only */}
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input 
                    id="employeeId"
                    value={profileData.employeeId || ''} 
                    disabled
                    className="bg-muted"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email || ''} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={profileData.phone || profileData.mobile || ''} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={profileData.location || ''} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Select 
                      value={profileData.department || 'none'} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, department: value === 'none' ? '' : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {validDepartments.length > 0 ? (
                          validDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No departments available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      value={profileData.department || 'Not provided'} 
                      disabled
                      className="bg-muted"
                    />
                  )}
                </div>

                {/* Manager */}
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  {isEditing ? (
                    <Select 
                      value={profileData.reporting_to || 'none'} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, reporting_to: value === 'none' ? '' : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Manager</SelectItem>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name} ({manager.position})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      value={managerName || 'Not provided'} 
                      disabled
                      className="bg-muted"
                    />
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input 
                    id="gender"
                    name="gender"
                    value={profileData.gender || ''} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : ''} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Date of Joining */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfJoining">Date of Joining</Label>
                  <Input 
                    id="dateOfJoining"
                    name="dateOfJoining"
                    type="date"
                    value={profileData.dateOfJoining ? new Date(profileData.dateOfJoining).toISOString().split('T')[0] : ''} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Bio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    value={profileData.bio || ''} 
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter employee biography..."
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{profileData.bio || 'No bio provided'}</p>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input 
                    id="skills" 
                    name="skills"
                    value={profileData.skills ? profileData.skills.join(', ') : ''} 
                    onChange={(e) => {
                      const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                      setProfileData(prev => ({ ...prev, skills: skillsArray }));
                    }}
                    placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple skills with commas. Spaces within skill names are allowed.
                  </p>
                </div>
              ) : (
                <>
                  {profileData.skills && profileData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-muted rounded-md text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills provided</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}