
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/LoadBadge';
import { getRatingBadgeColor } from '@/utils/taskUtils';

interface TaskHeaderProps {
  title: string;
  type: string;
  rating: number;
  userName?: string;
}

const TaskHeader = ({ title, type, rating, userName }: TaskHeaderProps) => {
  const ratingBadgeColor = getRatingBadgeColor(rating);
  
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <TypeBadge type={type} />
          <Badge variant="outline" className={`font-semibold ${ratingBadgeColor}`}>
            {rating} ★
          </Badge>
        </div>
      </div>
      {userName && (
        <p className="text-sm text-gray-500 mb-2">By {userName}</p>
      )}
    </>
  );
};

export default TaskHeader;
