
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

// Form schema for proposed rewards with expanded icon options
const proposedRewardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  pointsCost: z.coerce.number().min(1, "Points must be at least 1").max(100, "Points cannot exceed 100"),
  imageIcon: z.enum([
    'gift', 
    'award', 
    'star', 
    'circle-dollar-sign', 
    'trophy',
    'gem',
    'medal',
    'diamond',
    'wallet',
    'coins'
  ])
});

export type ProposedRewardFormValues = z.infer<typeof proposedRewardSchema>;

interface ProposeRewardFormProps {
  onSubmit: (data: ProposedRewardFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ProposeRewardForm = ({ onSubmit, onCancel, isSubmitting = false }: ProposeRewardFormProps) => {
  const form = useForm<ProposedRewardFormValues>({
    resolver: zodResolver(proposedRewardSchema),
    defaultValues: {
      title: '',
      description: '',
      pointsCost: 10,
      imageIcon: 'gift'
    }
  });

  const handleSubmit = async (data: ProposedRewardFormValues) => {
    console.log("Form submitted with data:", data);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Movie Night" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Your choice of movie plus snacks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pointsCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Point Cost</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageIcon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <select
                  className="w-full border rounded p-2"
                  {...field}
                >
                  <option value="gift">Gift</option>
                  <option value="award">Award</option>
                  <option value="star">Star</option>
                  <option value="circle-dollar-sign">Money</option>
                  <option value="trophy">Trophy</option>
                  <option value="gem">Gem</option>
                  <option value="medal">Medal</option>
                  <option value="diamond">Diamond</option>
                  <option value="wallet">Wallet</option>
                  <option value="coins">Coins</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Propose Reward'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
