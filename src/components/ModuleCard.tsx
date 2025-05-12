
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type ModuleCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
  className?: string;
}

export function ModuleCard({
  title,
  description,
  icon,
  color = "bg-gradient-hr-primary",
  onClick,
  className,
}: ModuleCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group rounded-xl overflow-hidden shadow-sm border border-border hr-card-hover cursor-pointer animate-scale-in",
        className
      )}
    >
      <div className={cn("w-full h-20 flex items-center justify-center text-white", color)}>
        <div className="transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          <Sparkles className="w-4 h-4 ml-2 text-hr-accent opacity-70" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
    </div>
  );
}
