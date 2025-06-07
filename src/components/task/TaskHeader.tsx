
import React from 'react';
import { TypeBadge } from '@/components/LoadBadge';
import { TaskType } from '@/types';
import BrowniePointBadge from '@/components/BrowniePointBadge';

interface TaskHeaderProps {
  title: string;
  type: TaskType;  // Now properly typed as TaskType instead of string
  rating: number;
  userName?: string;
}

const TaskHeader = ({ title, type, rating, userName }: TaskHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <TypeBadge type={type} />
          <BrowniePointBadge points={rating} />
        </div>
      </div>
      {userName && (
        <p className="text-sm text-gray-500 mb-2">By {userName}</p>
      )}
    </>
  );
};

export default TaskHeader;
