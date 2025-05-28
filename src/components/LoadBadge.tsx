
import { TaskLoad, TaskType, BrowniePointType } from '@/types';
import { cn } from '@/lib/utils';

interface LoadBadgeProps {
  load: TaskLoad;
  className?: string;
}

export const LoadBadge = ({ load, className }: LoadBadgeProps) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const loadClasses = {
    light: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    heavy: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={cn(baseClasses, loadClasses[load], className)}>
      {load}
    </span>
  );
};

interface TypeBadgeProps {
  type: TaskType;
  className?: string;
}

export const TypeBadge = ({ type, className }: TypeBadgeProps) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const typeClasses = {
    mental: "bg-mental text-mental-foreground",
    physical: "bg-physical text-physical-foreground",
    both: "bg-both text-both-foreground"
  };
  
  return (
    <span className={cn(baseClasses, typeClasses[type], className)}>
      {type}
    </span>
  );
};

interface BrowniePointBadgeProps {
  type: BrowniePointType;
  className?: string;
}

export const BrowniePointBadge = ({ type, className }: BrowniePointBadgeProps) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const typeClasses = {
    time: "bg-time text-time-foreground",
    effort: "bg-fun text-fun-foreground",
    fun: "bg-fun text-fun-foreground",
    custom: "bg-effort text-effort-foreground"
  };
  
  return (
    <span className={cn(baseClasses, typeClasses[type], className)}>
      {type}
    </span>
  );
};
