import { useState } from "react";
import { useLocation } from "wouter";
import { createProfile } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserPlus } from "lucide-react";

export default function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    bio: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.match('image.*')) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select an image file (PNG, JPG, JPEG)",
      }));
      return;
    }
    
    // Clear error
    if (errors.image) {
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
    
    // Set file and preview
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }
    
    if (!formData.title) {
      newErrors.title = "Please select a professional title";
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 50) {
      newErrors.bio = "Bio should be at least 50 characters";
    }
    
    if (!formData.image && !imagePreview) {
      newErrors.image = "Profile image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      
      const result = await createProfile({
        ...formData,
        username: user.username,
      });
      
      if (result.success) {
        toast({
          title: "Profile created successfully",
          description: "Your profile has been created and is now visible to others.",
        });
        
        // Navigate to the profile page or home
        if (result.url) {
          setLocation(result.url);
        } else {
          setLocation("/");
        }
      } else {
        toast({
          title: "Error creating profile",
          description: result.message || "There was a problem creating your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Professional Title</Label>
        <select
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full h-10 px-3 rounded-md border ${errors.title ? "border-destructive" : "border-input"} bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary`}
        >
          <option value="" disabled>Select a professional title</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="UX/UI Designer">UX/UI Designer</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="Product Manager">Product Manager</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Database Administrator">Database Administrator</option>
          <option value="Systems Architect">Systems Architect</option>
          <option value="QA Engineer">QA Engineer</option>
          <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
          <option value="Machine Learning Engineer">Machine Learning Engineer</option>
        </select>
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about your professional background, skills, and experience..."
          className={`w-full min-h-[120px] p-3 rounded-md border ${errors.bio ? "border-destructive" : "border-input"} bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary`}
        />
        {errors.bio && (
          <p className="text-destructive text-sm">{errors.bio}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Minimum 50 characters. Describe your professional background, skills, and experience.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Profile Image</Label>
        <div className="flex items-start space-x-4">
          <div>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`${errors.image ? "border-destructive" : ""}`}
            />
            {errors.image && (
              <p className="text-destructive text-sm mt-1">{errors.image}</p>
            )}
          </div>
          
          {imagePreview && (
            <div className="w-20 h-20 overflow-hidden rounded-md border">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Profile...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Profile
          </>
        )}
      </Button>
    </form>
  );
}