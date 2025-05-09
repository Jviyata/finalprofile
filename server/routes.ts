import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuthRoutes, isAuthenticated } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = "./uploads";

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure file filter to only accept images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: fileFilter
});

// Fake profiles with Unsplash images
const fakeProfiles = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex@example.com",
    title: "Full Stack Developer",
    bio: "Passionate developer with 5+ years of experience building web applications. Skilled in React, Node.js, and cloud infrastructure. Love to contribute to open source projects and mentor junior developers.",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop",
    username: "alexdev"
  },
  {
    id: "2",
    name: "Samantha Chen",
    email: "samantha@example.com",
    title: "UX/UI Designer",
    bio: "Creative designer specializing in user-centered design processes. I blend aesthetic appeal with functional design to create engaging digital experiences. Strong background in accessibility and inclusive design.",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
    username: "samdesign"
  },
  {
    id: "3",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    title: "Data Scientist",
    bio: "Data scientist with expertise in machine learning and AI. I help organizations make sense of their data and derive meaningful insights. Experienced in Python, TensorFlow, and data visualization.",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop",
    username: "marcusdata"
  },
  {
    id: "4",
    name: "Olivia Rodriguez",
    email: "olivia@example.com",
    title: "Product Manager",
    bio: "Product manager with a background in both technology and business. I bridge the gap between user needs and technical solutions. Skilled in agile methodologies, roadmap planning, and stakeholder communication.",
    image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop",
    username: "oliviapm"
  },
  {
    id: "5",
    name: "Daniel Kim",
    email: "daniel@example.com",
    title: "DevOps Engineer",
    bio: "DevOps engineer focused on automation and infrastructure as code. I build robust CI/CD pipelines and ensure scalable, secure deployments. Experienced with AWS, Docker, Kubernetes, and Terraform.",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    username: "danielops"
  },
  {
    id: "6",
    name: "Elena Martinez",
    email: "elena@example.com",
    title: "Frontend Developer",
    bio: "Frontend developer with an eye for design. I create responsive, accessible, and performant user interfaces that delight users. Skilled in React, Vue, and modern CSS techniques.",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    username: "elenafront"
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james@example.com",
    title: "Full Stack Developer",
    bio: "Full stack developer with expertise in JavaScript ecosystem. I build robust applications from front to back. Strong knowledge of React, Node.js, Express, and MongoDB. Passionate about clean code and testing.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    username: "jamesweb"
  },
  {
    id: "8",
    name: "Priya Patel",
    email: "priya@example.com",
    title: "UX/UI Designer",
    bio: "UX/UI designer focusing on creating intuitive and accessible user interfaces. I follow a user-centered design approach to create products that meet both user needs and business goals. Skilled in Figma and Adobe XD.",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop",
    username: "priyauxui"
  },
  {
    id: "9",
    name: "David Wang",
    email: "david@example.com",
    title: "Data Scientist",
    bio: "Data scientist with strong mathematical background. I specialize in predictive modeling and natural language processing. Proficient in Python, scikit-learn, and deep learning frameworks. I enjoy solving complex problems with data.",
    image_url: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&h=500&fit=crop",
    username: "daviddata"
  },
  {
    id: "10",
    name: "Rachel Morrison",
    email: "rachel@example.com",
    title: "Product Manager",
    bio: "Product manager passionate about building great products that solve real problems. Experienced in market research, user interviews, and product strategy. I excel at coordinating cross-functional teams to deliver impactful features.",
    image_url: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=500&h=500&fit=crop",
    username: "rachelpm"
  },
  {
    id: "11",
    name: "Michael Lee",
    email: "michael@example.com",
    title: "DevOps Engineer",
    bio: "DevOps engineer with a passion for automating everything. I specialize in CI/CD pipelines, infrastructure as code, and cloud architecture. Experienced with AWS, Terraform, and Kubernetes. I enjoy making deployment processes smoother and more reliable.",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
    username: "mikedevops"
  },
  {
    id: "12",
    name: "Sofia Garcia",
    email: "sofia@example.com",
    title: "Frontend Developer",
    bio: "Frontend developer focused on creating beautiful and performant user interfaces. Experienced in React, TypeScript, and modern CSS. I'm passionate about animation, accessibility, and responsive design. Always learning new technologies to improve my craft.",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
    username: "sofiadev"
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuthRoutes(app);

  // Get all profiles
  app.get("/api/profiles", async (req, res) => {
    try {
      res.json({ profiles: fakeProfiles });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  });

  // Get a specific profile
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const profile = fakeProfiles.find(p => p.id === id);
      
      if (profile) {
        res.json({ profile });
      } else {
        res.status(404).json({ error: "Profile not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Create a new profile (protected route)
  app.post("/api/profiles", isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      // Generate a new profile ID
      const newId = (parseInt(fakeProfiles[fakeProfiles.length - 1].id) + 1).toString();
      
      // Get the uploaded file path or use a default image
      let image_url = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop";
      
      // If a file was uploaded, use its path
      if (req.file) {
        // Get server base URL (protocol + host)
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;
        
        // Create a URL for the uploaded file
        image_url = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
      }
      
      // Access the user from the request (added by isAuthenticated middleware)
      const { user } = req;
      
      const newProfile = {
        id: newId,
        name: req.body.name || "",
        email: req.body.email || "",
        title: req.body.title || "",
        bio: req.body.bio || "",
        image_url,
        username: req.body.username || (user ? user.username : "anonymous")
      };
      
      // In a real app, we would add this to a database
      // For this demo, we'll add it to our in-memory array
      // Add to the beginning of the array so it shows up first on the home page
      fakeProfiles.unshift(newProfile);
      
      res.status(201).json({ 
        success: true, 
        url: `/profile/${newId}`,
        profile: newProfile
      });
    } catch (error) {
      console.error('Profile creation error:', error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Update a profile (protected route)
  app.put("/api/profiles/:id", isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      const profile = fakeProfiles.find(p => p.id === id);

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Get the user from request
      const { user } = req;

      // Check if the user is the owner
      if (user && user.username !== profile.username) {
        return res.status(403).json({ error: "You can only edit your own profile" });
      }

      // Update profile data
      const updatedProfile = {
        ...profile,
        name: req.body.name || profile.name,
        email: req.body.email || profile.email,
        title: req.body.title || profile.title,
        bio: req.body.bio || profile.bio,
        website: req.body.website || (profile as any).website || ""
      };

      // Update image if provided
      if (req.file) {
        // Get server base URL (protocol + host)
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;
        
        // Create a URL for the uploaded file
        updatedProfile.image_url = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
      }

      // Update the profile in our fake database
      const index = fakeProfiles.findIndex(p => p.id === id);
      if (index !== -1) {
        fakeProfiles[index] = updatedProfile;
      }

      res.json({ 
        success: true, 
        profile: updatedProfile 
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Delete a profile (protected route)
  app.delete("/api/profiles/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const profile = fakeProfiles.find(p => p.id === id);

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Get the user from request
      const { user } = req;

      // Check if the user is the owner
      if (user && user.username !== profile.username) {
        return res.status(403).json({ error: "You can only delete your own profile" });
      }

      // In a real app, this would delete from the database
      // Here we just return success
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
