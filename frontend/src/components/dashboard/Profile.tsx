import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Calendar,
  CheckCircle2,
  Shield,
  Clock,
  RefreshCw,
  Edit2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { useAuth } from '@/auth/useAuth';
import { getLocalUser } from '@/utils/getLocalUser';
import { updateProfileApi } from '@/api/userApi';
import { mapApiUserToUser } from '@/utils/mapApiUserToUser';
import formatDate from '@/utils/formatdate';

const Profile = () => {
  const { user, setUser } = useAuth() || { user: getLocalUser(), setUser: () => {} };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setFormData({ name: value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProfileApi(formData.name.trim());

      if (response.success) {
        // Update the user in context
        if (response.data) {
          const updatedUser = mapApiUserToUser(response.data);
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          setIsDialogOpen(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(response.msg || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error)
      setError('Something went wrong. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      // Reset form data when opening dialog
      setFormData({ name: user?.name || '' });
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <section>
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
        

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="container max-w-4xl mx-auto p-6">
      
      <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View your account details</CardDescription>
            </div>
            <Dialog  open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Update Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information. Currently, you can only update your name.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Enter your full name"
                      disabled={isUpdating}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-500 text-green-600 bg-green-50">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4" />
                        Update
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-2xl font-semibold">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{user?.name || 'Unknown User'}</h3>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user?.email || 'No email provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(user?.createdAt || "")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Two-Factor Authentication</p>
                <Badge variant={user?.isTwoFactorEnabled ? "default" : "secondary"} className="gap-1 mt-1">
                  {user?.isTwoFactorEnabled && <CheckCircle2 className="h-3 w-3" />}
                  {user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">{formatDate(user?.lastLoginAt || "")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(user?.updatedAt || "")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <Badge variant={user?.isAccountVerified ? "default" : "secondary"} className="gap-1 mt-1">
                  {user?.isAccountVerified && <CheckCircle2 className="h-3 w-3" />}
                  {user?.isAccountVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
    </section>
    
  );
};

export default Profile;