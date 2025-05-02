
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user, profile } = useAuth();
  
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || user?.email?.split('@')[0] || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.user_metadata?.avatar_url || profile?.avatar_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const newAvatarUrl = urlData.publicUrl;
      setAvatarUrl(newAvatarUrl);

      // Update the user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: newAvatarUrl }
      });

      if (updateError) throw updateError;

      // Update profiles table if it exists
      if (profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', user.id);
          
        if (profileError) throw profileError;
      }
      
      toast("Avatar updated", {
        description: "Your profile picture has been updated successfully.",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast("Upload failed", {
        description: "There was a problem uploading your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    try {
      // This would typically update the profile in the database
      if (user && profile) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            username: username,
          })
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      toast("Profile updated", {
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Update failed", {
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">Profile Settings</h1>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4 sm:items-start sm:space-y-6">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={avatarUrl} 
                        alt={user?.email || "User"} 
                      />
                      <AvatarFallback className="text-2xl">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="mt-2" onClick={() => setIsDialogOpen(true)}>
                        Change Avatar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Username
                      </label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        readOnly
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <Button onClick={handleSave} className="mt-4">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Avatar Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. The image will be visible to other users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-5">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {isUploading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p>Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt="Preview" />
                  <AvatarFallback className="text-2xl">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button onClick={handleFileSelect} variant="default">
                  Select Image
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
