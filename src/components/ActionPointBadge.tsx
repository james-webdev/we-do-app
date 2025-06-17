import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getRatingBadgeColor } from '@/utils/taskUtils';

interface ActionPointBadgeProps {
  points: number;
  size?: 'sm' | 'md';
}

const ActionPointBadge = ({ points, size = 'md' }: ActionPointBadgeProps) => {
  const badgeColor = getRatingBadgeColor(points);
  const imageSize = size === 'sm' ? 12 : 14; // Slightly larger to prevent squashing
  
  return (
    <Badge variant="outline" className={`font-semibold flex items-center gap-1 ${badgeColor}`}>
      <span className="flex-shrink-0">{points}</span>
      <div className="flex-shrink-0 flex items-center justify-center" style={{ minWidth: `${imageSize}px`, minHeight: `${imageSize}px` }}>
        <img 
          src="/action-icon.png" 
          alt="Action Points" 
          width={imageSize} 
          height={imageSize} 
          className="object-contain"
		  style={{ mixBlendMode: 'multiply' }}
        />
      </div>
    </Badge>
  );
};

export default ActionPointBadge;
