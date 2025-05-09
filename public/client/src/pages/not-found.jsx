import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { HomeIcon, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-16">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-xl">
        <div className="bg-olive-100 dark:bg-olive-900/40 p-8 border-b-4 border-olive-500">
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-full opacity-20 animate-ping"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-olive-600 text-white rounded-full">
              <span className="text-4xl font-bold">404</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-olive-800 dark:text-olive-200 mb-2">Page Not Found</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            The page <span className="font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-sm">{location}</span> couldn't be found.
          </p>
        </div>
        
        <div className="p-6">
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              asChild
              variant="default" 
              className="flex items-center bg-olive-600 hover:bg-olive-700"
            >
              <Link href="/">
                <HomeIcon className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="flex items-center border-olive-300 text-olive-700 hover:bg-olive-50"
              onClick={() => window.history.back()}
            >
              <Link href="#">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="ghost" 
              className="flex items-center"
            >
              <Link href="/?search=true">
                <Search className="w-4 h-4 mr-2" />
                Search Profiles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}