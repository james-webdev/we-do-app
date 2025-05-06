
import { BrowniePoint } from '@/types';
import { format } from 'date-fns';
import { BrowniePointBadge } from './LoadBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Award } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BrowniePointCardProps {
  browniePoint: BrowniePoint;
}

const BrowniePointCard = ({ browniePoint }: BrowniePointCardProps) => {
  const { currentUser, partner, deleteBrowniePoint } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isSender = browniePoint.fromUserId === currentUser?.id;
  const isReceiver = browniePoint.toUserId === currentUser?.id;
  
  const senderName = isSender ? currentUser?.name : partner?.name;
  const receiverName = isReceiver ? currentUser?.name : partner?.name;
  
  // Only allow the sender to delete their own brownie points
  const canDelete = isSender;
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteBrowniePoint(browniePoint.id);
    setIsDeleting(false);
  };
  
  return (
    <Card className={`w-full ${browniePoint.redeemed ? 'opacity-70' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg text-gray-900">Brownie Point</h3>
            <BrowniePointBadge type={browniePoint.type} />
            {browniePoint.redeemed && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Redeemed
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
            <Award size={16} className="mr-1" />
            {browniePoint.points} {browniePoint.points === 1 ? 'point' : 'points'}
          </div>
        </div>
        <p className="text-sm text-gray-700 my-2">"{browniePoint.message}"</p>
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-600">
            From: <span className="font-medium">{senderName}</span>
          </span>
          <span className="text-gray-600">
            To: <span className="font-medium">{receiverName}</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-gray-500">
        <span>{format(new Date(browniePoint.createdAt), 'MMM d, yyyy • h:mm a')}</span>
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Brownie Point</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this Brownie Point? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default BrowniePointCard;
