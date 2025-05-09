import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Menu, X, User, LogOut } from "lucide-react";

export default function Navbar({ toggleDarkMode, darkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-bold text-xl">ProfileApp</Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
              {user && (
                <Link href="/add-profile" className="hover:text-accent transition-colors">
                  Add Profile
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User is logged in */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm font-medium">{user.username}</span>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="text-primary-foreground bg-secondary hover:bg-secondary/90"
                >
                  Logout
                </Button>
              </div>
            ) : (
              /* User is not logged in */
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/auth" className="hover:text-accent transition-colors">
                  Login / Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden flex items-center" 
              aria-label="Toggle menu"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            {/* Theme toggle button */}
            <button 
              className="p-2 rounded-full hover:bg-secondary/80 transition-colors" 
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-primary text-primary-foreground ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto py-3 px-4 flex flex-col space-y-3">
          <Link href="/" className="block py-2 hover:bg-secondary/20 px-3 rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="block py-2 hover:bg-secondary/20 px-3 rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          
          {user ? (
            <>
              <Link href="/add-profile" className="block py-2 hover:bg-secondary/20 px-3 rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Add Profile
              </Link>
              <button 
                className="text-left block py-2 hover:bg-secondary/20 px-3 rounded-md transition-colors w-full"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout ({user.username})
              </button>
            </>
          ) : (
            <Link href="/auth" className="block py-2 hover:bg-secondary/20 px-3 rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </>
  );
}