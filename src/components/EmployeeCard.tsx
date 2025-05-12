
import { cn } from "@/lib/utils";

type EmployeeCardProps = {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl: string;
  className?: string;
}

export function EmployeeCard({ id, name, position, department, photoUrl, className }: EmployeeCardProps) {
  return (
    <div 
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-border hr-card-hover animate-fade-in",
        className
      )}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={photoUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{position}</p>
      </div>
      
      {/* Hover Content */}
      <div className="absolute inset-0 bg-gradient-hr-primary text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm opacity-90">{position}</p>
        <p className="text-sm opacity-90">{department}</p>
        <button className="mt-3 px-4 py-1 bg-white/20 rounded-full text-xs">View Profile</button>
      </div>
    </div>
  );
}
