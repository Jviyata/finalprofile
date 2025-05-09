import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Add a type declaration for the Express Request to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
      };
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Get the user from session or auth header
  const user = req.headers.authorization ? getUserFromToken(req.headers.authorization) : null;
  
  if (user) {
    req.user = user;
    return next();
  }
  
  return res.status(401).json({ error: "Unauthorized" });
};

// Helper function to extract user from token (replace with your actual auth logic)
const getUserFromToken = (token: string) => {
  // Simple implementation for demonstration
  // In a real app, you would validate the token properly
  try {
    if (token.startsWith('Bearer ')) {
      const actualToken = token.slice(7);
      // Implement your token validation logic here
      // Return the user if token is valid
      return { id: 1, username: "testuser" };
    }
    return null;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
};

// Export auth routes setup
export const setupAuthRoutes = (app: Express) => {
  // Register endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Create the user
      const user = await storage.createUser({ username, password, email });
      
      // Return user data (excluding password)
      return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) { // In a real app, you'd use proper password hashing
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Return user data (excluding password)
      return res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response) => {
    // Clear session/cookies or invalidate token
    return res.json({ message: "Logged out successfully" });
  });
  
  // Get current user endpoint
  app.get("/api/user", isAuthenticated, (req: Request, res: Response) => {
    // Return the user from the request
    return res.json(req.user);
  });
};
