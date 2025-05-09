import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";
import { getProfile, updateProfile, deleteProfile } from "@/lib/api";

export default function EditProfilePage({ id }) {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute("/profile/:id/edit");
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form fields state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  
  // Use the ID from props or from URL params
  const profileId = id || (params && params.id);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError("Profile ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const profileData = await getProfile(profileId);
        
        if (profileData) {
          setProfile(profileData);
          // Initialize form fields
          setName(profileData.name || "");
          setTitle(profileData.title || "");
          setEmail(profileData.email || "");
          setWebsite(profileData.website || "");
          setBio(profileData.bio || "");
          setCurrentImageUrl(profileData.image_url || "");
          setError(null);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        setError(`Failed to load profile: ${err.message}`);
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authorization required",
        description: "You must be logged in to update a profile.",
        variant: "destructive",
      });
      return;
    }

    // Ensure user can only edit their own profile
    if (profile.username !== user.username) {
      toast({
        title: "Permission denied",
        description: "You can only edit your own profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("title", title);
      formData.append("email", email);
      formData.append("website", website || "");
      formData.append("bio", bio);
      if (image) {
        formData.append("image", image);
      }
      
      const updatedProfile = await updateProfile(profileId, formData);
      
      if (updatedProfile) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        // Redirect to profile page
        setLocation(`/profile/${profileId}`);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.message || "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    
    if (!user) {
      toast({
        title: "Authorization required",
        description: "You must be logged in to delete a profile.",
        variant: "destructive",
      });
      return;
    }

    // Ensure user can only delete their own profile
    if (profile.username !== user.username) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own profile.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDeleting(true);
      const success = await deleteProfile(profile.id);
      
      if (success) {
        toast({
          title: "Profile deleted",
          description: "Your profile has been successfully deleted.",
        });
        // Redirect to home page
        setLocation("/");
      } else {
        toast({
          title: "Failed to delete",
          description: "There was a problem deleting the profile.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the profile.",
        variant: "destructive",
      });
      console.error("Error deleting profile:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setCurrentImageUrl(previewUrl);
    }
  };

  const handleCancelEdit = () => {
    setLocation(`/profile/${profileId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden my-20">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {error || "Profile data could not be loaded. Please try again."}
          </p>
          <Button 
            variant="default"
            className="bg-olive-600 hover:bg-olive-700" 
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Check if user is the owner of the profile
  const isOwner = user && user.username === profile.username;
  
  if (!isOwner) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden my-20">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 border-l-4 border-amber-500">
          <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">
            Permission Denied
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You can only edit your own profile.
          </p>
          <Button 
            variant="default"
            className="bg-olive-600 hover:bg-olive-700" 
            onClick={() => setLocation(`/profile/${profileId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-olive-50 dark:bg-olive-900/20 border-b-2 border-olive-200 dark:border-olive-800">
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Select value={title} onValueChange={setTitle} required>
                    <SelectTrigger id="title">
                      <SelectValue placeholder="Select your title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                      <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                      <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image</Label>
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-36 h-36 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden flex items-center justify-center relative bg-gray-50 dark:bg-neutral-900">
                      {currentImageUrl ? (
                        <img 
                          src={currentImageUrl} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm text-center p-2">
                          No image selected
                        </span>
                      )}
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="max-w-xs"
                      onChange={handleImageChange}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Recommended size: 300x300 pixels
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself, your experience, skills, and interests..."
                className="min-h-[150px]"
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-neutral-900">
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="destructive"
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Profile
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      profile and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <Button 
              type="submit" 
              className="bg-olive-600 hover:bg-olive-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}