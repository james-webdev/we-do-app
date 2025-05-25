
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ConnectPartner = () => {
  const { connectPartner } = useApp();
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail.trim()) {
      toast.error('Please enter your partner\'s email address');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await connectPartner(partnerEmail);
      if (success) {
        setPartnerEmail('');
        toast.success('Successfully connected with partner!');
      }
    } catch (error) {
      console.error('Error connecting partner:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <UserPlus size={20} />
          Connect with Partner
        </CardTitle>
        <CardDescription>
          To start using We-Do, connect with your partner using their email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner-email">Partner's Email</Label>
            <Input 
              id="partner-email"
              type="email"
              placeholder="partner@example.com"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Partner'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConnectPartner;
