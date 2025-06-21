import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { useForm } from 'react-hook-form';
import { User, Users, UserX, RefreshCw } from 'lucide-react';
import BackToMainMenu from '@/components/BackToMainMenu';


import { supabase } from '@/integrations/supabase/client';
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
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { currentUser, partner, hasPartner, refreshData } = useApp();
  const { signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUncoupling, setIsUncoupling] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  

  
  const form = useForm({
    defaultValues: {
      name: currentUser?.name || '',
    },
  });
  
  const handleUpdateProfile = async (data: { name: string }) => {
    try {
      setIsUpdating(true);
      
      if (!currentUser) {
        toast.error('You need to be logged in to update your profile');
        return;
      }
      
      // Use our RPC function to update the profile name
      const { error } = await supabase.rpc('update_profile_name', { 
        user_id_param: currentUser.id,
        name_param: data.name 
      });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      refreshData(); // Refresh the user data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUncouplePartner = async () => {
    try {
      if (!currentUser) {
        toast.error('You need to be logged in');
        return;
      }
      
      setIsUncoupling(true);
      
      // Update current user's partner_id to null
      const { error: currentUserError } = await supabase.rpc('update_user_partner', {
        user_id_param: currentUser.id,
        partner_id_param: null
      });
      
      if (currentUserError) throw currentUserError;
      
      // If partner exists, update their partner_id to null as well
      if (partner) {
        const { error: partnerError } = await supabase.rpc('update_user_partner', {
          user_id_param: partner.id,
          partner_id_param: null
        });
        
        if (partnerError) throw partnerError;
      }
      
      toast.success('Partner connection removed');
      refreshData(); // Refresh to update the UI
    } catch (error: any) {
      console.error('Error uncoupling partner:', error);
      toast.error(error.message || 'Failed to uncouple partner');
    } finally {
      setIsUncoupling(false);
    }
  };

  const handleResetData = async () => {
    try {
      if (!currentUser) {
        toast.error('You need to be logged in');
        return;
      }

      setIsResetting(true);

      // Delete all tasks created by the user
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', currentUser.id);

      if (tasksError) throw tasksError;

      // Delete all brownie points sent by the user
      const { error: sentPointsError } = await supabase
        .from('brownie_points')
        .delete()
        .eq('from_user_id', currentUser.id);

      if (sentPointsError) throw sentPointsError;

      // Delete all brownie points received by the user
      const { error: receivedPointsError } = await supabase
        .from('brownie_points')
        .delete()
        .eq('to_user_id', currentUser.id);

      if (receivedPointsError) throw receivedPointsError;

      toast.success('All your tasks and brownie points have been deleted');
      refreshData(); // Refresh to update the UI
    } catch (error: any) {
      console.error('Error resetting data:', error);
      toast.error(error.message || 'Failed to reset data');
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="container py-8">
      <div className="mb-4">
        <BackToMainMenu />
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-500">Manage your profile and application settings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => signOut()} 
          className="border-gray-300 hover:bg-gray-100"
        >
          Sign Out
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="partner">Partner</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your display name within the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input value={currentUser?.email || ''} disabled />
                    </FormControl>
                    <FormDescription>
                      Your email address (cannot be changed)
                    </FormDescription>
                  </FormItem>
                  
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Connection</CardTitle>
              <CardDescription>
                Manage your partner connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasPartner && partner ? (
                <>
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Connected with {partner.name}</h4>
                      <p className="text-sm text-muted-foreground">{partner.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Remove Connection</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Removing the partner connection will allow you to connect with 
                      a different partner. This action cannot be undone.
                    </p>
                    
                    <Button 
                      variant="destructive" 
                      onClick={handleUncouplePartner}
                      disabled={isUncoupling}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      {isUncoupling ? 'Removing Connection...' : 'Remove Partner Connection'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">No Partner Connected</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    You are not currently connected with a partner. Go to the Dashboard to connect with a partner.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                
                <div>
                  <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Actions here can't be undone
                  </p>
                  
                  <div className="space-y-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="text-destructive border-destructive hover:bg-destructive/10 w-full sm:w-auto flex items-center"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset All Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset All Data</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete all your tasks and brownie points. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleResetData} 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isResetting}
                          >
                            {isResetting ? 'Resetting...' : 'Reset Data'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
