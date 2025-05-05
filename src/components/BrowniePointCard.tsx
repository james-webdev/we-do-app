
import { BrowniePoint } from '@/types';
import { format } from 'date-fns';
import { BrowniePointBadge } from './LoadBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

interface BrowniePointCardProps {
  browniePoint: BrowniePoint;
}

const BrowniePointCard = ({ browniePoint }: BrowniePointCardProps) => {
  const { currentUser, partner } = useApp();
  
  const isSender = browniePoint.fromUserId === currentUser?.id;
  const isReceiver = browniePoint.toUserId === currentUser?.id;
  
  const senderName = isSender ? currentUser?.name : partner?.name;
  const receiverName = isReceiver ? currentUser?.name : partner?.name;
  
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
      <CardFooter className="text-xs text-gray-500">
        {format(new Date(browniePoint.createdAt), 'MMM d, yyyy • h:mm a')}
      </CardFooter>
    </Card>
  );
};

export default BrowniePointCard;
