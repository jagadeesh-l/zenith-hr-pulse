import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from '@/hooks/use-employees';

interface AddEmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
}

export function AddEmployeeForm({ isOpen, onClose, departments }: AddEmployeeFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    position: '',
    department: '',
    phone: '',
    mobile: '',
    employmentCategory: '',
    gender: '',
    employeeStatus: '',
    account: '',
    isLeader: '',
    location: '',
    dateOfBirth: '',
    dateOfJoining: '',
    bio: '',
    startDate: '',
    manager: 'none',
    skills: '',
    expertise: '',
    experienceYears: ''
  });

  const { createEmployee, employees } = useEmployees();
  
  // Get available managers for dropdown
  const managers = employees.filter(emp => emp.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.position || !formData.department) {
      toast({
        title: "Missing required fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert skills string to array
    const skillsArray = formData.skills ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [];
    
    const newEmployee = await createEmployee({
      employeeId: formData.employeeId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : formData.name,
      position: formData.position,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      mobile: formData.mobile,
      employmentCategory: formData.employmentCategory,
      gender: formData.gender,
      employeeStatus: formData.employeeStatus,
      account: formData.account,
      isLeader: formData.isLeader,
      location: formData.location,
      dateOfBirth: formData.dateOfBirth,
      dateOfJoining: formData.dateOfJoining,
      bio: formData.bio,
      startDate: formData.startDate,
      skills: skillsArray,
      expertise: formData.expertise,
      experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : 0,
      reporting_to: formData.manager === 'none' ? '' : formData.manager,
      photoUrl: photo || undefined
    });
    
    if (newEmployee) {
      // Reset form and close dialog
      setFormData({
        employeeId: '',
        firstName: '',
        lastName: '',
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        mobile: '',
        employmentCategory: '',
        gender: '',
        employeeStatus: '',
        account: '',
        isLeader: '',
        location: '',
        dateOfBirth: '',
        dateOfJoining: '',
        bio: '',
        startDate: '',
        manager: 'none',
        skills: '',
        expertise: '',
        experienceYears: ''
      });
      setPhoto(null);
      setPhotoPreview(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-1">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Photo upload */}
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border border-border bg-muted">
                  {photoPreview ? (
                    <>
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={clearPhoto}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-xs text-center text-muted-foreground">Upload photo</p>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    id="photo-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  <label 
                    htmlFor="photo-upload"
                    className="absolute inset-0 cursor-pointer"
                  ></label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Recommended: Square image, 300x300px or larger</p>
              </div>
            </div>
            
            {/* Right column - Form fields */}
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input 
                  id="employeeId" 
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position <span className="text-red-500">*</span></Label>
                <Input 
                  id="position" 
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('department', value)}
                  value={formData.department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input 
                  id="gender" 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input 
                  id="dateOfJoining" 
                  name="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('manager', value)}
                  value={formData.manager}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Manager</SelectItem>
                    {managers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} ({manager.position})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input 
                  id="skills" 
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="expertise">Expertise</Label>
                <Input 
                  id="expertise" 
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="Enter area of expertise (e.g., Frontend Development, Data Science)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Experience Years</Label>
                <Input 
                  id="experienceYears" 
                  name="experienceYears"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </div>
          
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Add Employee</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 