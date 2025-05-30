import { useState } from "react";
import { cn } from "@/lib/utils";
import { EmployeeProfile } from "./employee/EmployeeProfile";

export type EmployeeCardProps = {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl?: string; // Optional photo URL
  email?: string;
  phone?: string;
  bio?: string;
  startDate?: string;
  manager?: string;
  skills?: string[];
  className?: string;
}

export function EmployeeCard(props: EmployeeCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  
  // Generate avatar from name if no photo
  const getInitialsAvatar = (name: string) => {
    const initials = name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
    
    // Use consistent color based on name
    const colors = [
      'bg-red-500', 'bg-blue-600', 'bg-green-500', 
      'bg-purple-600', 'bg-yellow-500', 'bg-pink-500'
    ];
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    
    return colors[colorIndex];
  };

  return (
    <>
      <div className={cn("group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden", props.className)}>
        <div className="aspect-square overflow-hidden">
          {props.photoUrl ? (
            <img 
              src={props.photoUrl} 
              alt={props.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // If image fails to load, replace with initials avatar
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  const color = getInitialsAvatar(props.name);
                  parent.innerHTML = `
                    <div class="${color} w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      ${props.name.split(' ').map(part => part[0]).join('').toUpperCase()}
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className={`${getInitialsAvatar(props.name)} w-full h-full flex items-center justify-center text-white text-4xl font-bold`}>
              {props.name.split(' ').map(part => part[0]).join('').toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-3 text-center">
          <h3 className="font-medium text-sm">{props.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{props.position}</p>
        </div>
        
        {/* Hover Content */}
        <div className="absolute inset-0 bg-gradient-hr-primary text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
          <h3 className="font-bold">{props.name}</h3>
          <p className="text-sm opacity-90">{props.position}</p>
          <p className="text-sm opacity-90">{props.department}</p>
          <button 
            className="mt-3 px-4 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs"
            onClick={() => setShowProfile(true)}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Employee Profile Dialog */}
      <EmployeeProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        employee={{
          id: props.id,
          name: props.name,
          position: props.position,
          department: props.department,
          photoUrl: props.photoUrl || '', // Provide a default empty string for photoUrl
          email: props.email,
          phone: props.phone,
          bio: props.bio,
          startDate: props.startDate,
          manager: props.manager,
          skills: props.skills
        }}
      />
    </>
  );
}
