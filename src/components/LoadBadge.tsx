
import { TaskLoad, TaskType, BrowniePointType } from '@/types';
import { cn } from '@/lib/utils';

interface LoadBadgeProps {
  load: TaskLoad;
  className?: string;
}

export const LoadBadge = ({ load, className }: LoadBadgeProps) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const loadClasses = {
    light: "bg-blue-100 text-blue-800",
    medium: "bg-indigo-100 text-indigo-800",
    heavy: "bg-purple-200 text-purple-800"
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
    mental: "bg-blue-100 text-blue-800",
    physical: "bg-indigo-100 text-indigo-800",
    both: "bg-purple-100 text-purple-800"
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
    time: "bg-blue-100 text-blue-800",
    effort: "bg-indigo-100 text-indigo-800",
    fun: "bg-purple-100 text-purple-800",
    custom: "bg-violet-100 text-violet-800"
  };
  
  return (
    <span className={cn(baseClasses, typeClasses[type], className)}>
      {type}
    </span>
  );
};
