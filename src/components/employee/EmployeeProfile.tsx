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
import { Edit2, X, Upload } from "lucide-react";
import { useEmployees } from '@/hooks/use-employees';

interface EmployeeProfileProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    position: string;
    department: string;
    photoUrl: string;
    email?: string;
    phone?: string;
    bio?: string;
    startDate?: string;
    skills?: string[];
    manager?: string;
  };
}

export function EmployeeProfile({ isOpen, onClose, employee }: EmployeeProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(employee);
  const [photo, setPhoto] = useState<File | null>(null);
  const { toast } = useToast();
  const isAdmin = true; // For demo purposes, assume admin
  const { updateEmployee } = useEmployees();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      // Create a preview URL
      setProfileData(prev => ({
        ...prev,
        photoUrl: URL.createObjectURL(e.target.files[0])
      }));
    }
  };

  const handleSubmit = async () => {
    const updatedEmployee = await updateEmployee(employee.id, {
      name: profileData.name,
      position: profileData.position,
      department: profileData.department,
      email: profileData.email,
      phone: profileData.phone,
      bio: profileData.bio,
      startDate: profileData.startDate,
      photoUrl: profileData.photoUrl,
      skills: profileData.skills
    });
    
    if (updatedEmployee) {
      setIsEditing(false);
    }
  };

  // Generate avatar from name if no photo
  const getInitialsAvatar = (name: string) => {
    const initials = name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
    
    // Hero-themed background colors
    const colors = [
      'bg-red-500', 'bg-blue-600', 'bg-green-500', 
      'bg-purple-600', 'bg-yellow-500', 'bg-pink-500'
    ];
    
    // Use name to deterministically pick a color
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    
    return (
      <div className={`${colors[colorIndex]} w-full h-full flex items-center justify-center text-white text-4xl font-bold`}>
        {initials}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setIsEditing(false);
      onClose();
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Employee Profile</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-[1fr_2fr] gap-6 my-4">
          {/* Left column - Photo and basic info */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-primary/20">
              {profileData.photoUrl ? (
                <img 
                  src={profileData.photoUrl} 
                  alt={profileData.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitialsAvatar(profileData.name)
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <label className="cursor-pointer p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <Upload className="h-6 w-6 text-white" />
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold">{profileData.name}</h2>
            <p className="text-muted-foreground">{profileData.position}</p>
            <p className="text-sm text-muted-foreground mb-4">{profileData.department}</p>
            
            {isAdmin && !isEditing && (
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
          
          {/* Right column - Details */}
          <div className="space-y-4">
            {isEditing ? (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={profileData.name} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={profileData.email || ''} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input 
                      id="position" 
                      name="position"
                      value={profileData.position} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      name="department"
                      value={profileData.department} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={profileData.phone || ''} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input 
                      id="startDate" 
                      name="startDate"
                      type="date"
                      value={profileData.startDate || ''} 
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    value={profileData.bio || ''} 
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditing(false);
                    setProfileData(employee); // Reset form
                  }}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p>{profileData.email || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                    <p>{profileData.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                    <p>{profileData.startDate || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Manager</h3>
                    <p>{profileData.manager || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                  <p className="mt-1">{profileData.bio || 'No bio provided'}</p>
                </div>
                
                {profileData.skills && profileData.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-muted rounded-md text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 