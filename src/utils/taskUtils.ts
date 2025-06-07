
// Utility functions for task-related features

/**
 * Returns the appropriate CSS class for a task rating badge
 * @param rating The task rating value (1-10)
 * @returns CSS class string
 */
export const getRatingBadgeColor = (rating: number): string => {
  // Each rating gets its own distinct color
  switch(rating) {
    case 1:
      return 'bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-300';
    case 2:
      return 'bg-violet-100 text-violet-800 hover:bg-violet-200 border-violet-300';
    case 3:
      return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
    case 4:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 5:
      return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
    case 6:
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 7:
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 8:
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 9:
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 10:
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

/**
 * Calculate the points that will be earned for a task based on its rating
 * @param rating The task rating value (1-10)
 * @returns Description of points to be earned
 */
export const calculateTaskPointsDescription = (rating: number): string => {
  return `Will earn ${rating} brownie point${rating !== 1 ? 's' : ''}`;
};
