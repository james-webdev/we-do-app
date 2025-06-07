import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getRatingBadgeColor } from '@/utils/taskUtils';

interface BrowniePointBadgeProps {
  points: number;
  size?: 'sm' | 'md';
}

const BrowniePointBadge = ({ points, size = 'md' }: BrowniePointBadgeProps) => {
  const badgeColor = getRatingBadgeColor(points);
  const imageSize = size === 'sm' ? 14 : 18; // Slightly larger to prevent squashing
  // Use single brownie icon for 1 point, multiple brownie icon for more
  const iconSrc = points === 1 ? "/single-brownie-icon.png" : "/brownie-icon.png";
  
  return (
    <Badge variant="outline" className={`font-semibold flex items-center gap-1 ${badgeColor}`}>
      <span className="flex-shrink-0">{points}</span>
      <div className="flex-shrink-0 flex items-center justify-center" style={{ minWidth: `${imageSize}px`, minHeight: `${imageSize}px` }}>
        <img 
          src={iconSrc} 
          alt={points === 1 ? "Single Brownie Point" : "Brownie Points"} 
          width={imageSize} 
          height={imageSize} 
          className="inline-block object-contain" 
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
    </Badge>
  );
};

export default BrowniePointBadge;
