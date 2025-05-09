import { useState, useEffect, useMemo } from "react";
import { getProfiles } from "@/lib/api";
import { Link } from "wouter";
import { Loader2, Search, Filter, RefreshCw, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const { toast } = useToast();
  
  const fetchProfiles = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const fetchedProfiles = await getProfiles();
      setProfiles(fetchedProfiles);
      setError(null);
      
      if (!showLoading) {
        toast({
          title: "Profiles refreshed",
          description: "The latest profiles have been loaded.",
        });
      }
    } catch (err) {
      setError("Failed to load profiles. Please try again later.");
      console.error("Error fetching profiles:", err);
      
      if (!showLoading) {
        toast({
          title: "Error refreshing profiles",
          description: "There was a problem loading the latest profiles.",
          variant: "destructive",
        });
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchProfiles();
    
    // Set up visibility change listener to refresh profiles when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProfiles(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Extract all unique job titles for filtering
  const jobTypes = useMemo(() => {
    if (!profiles.length) return [];
    
    const titles = profiles.map(profile => profile.title);
    return [...new Set(titles)];
  }, [profiles]);

  // Filter profiles based on search term and job type
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = searchTerm === "" || 
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesJobType = selectedJobType === "" || profile.title === selectedJobType;
      
      return matchesSearch && matchesJobType;
    });
  }, [profiles, searchTerm, selectedJobType]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-4">Profile Gallery</h1>
      
      <p className="text-center mb-6 text-lg">Browse the profiles below:</p>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Field */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="w-full sm:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="w-full h-10 pl-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filter by job type"
            >
              <option value="">All Job Types</option>
              {jobTypes.map(jobType => (
                <option key={jobType} value={jobType}>
                  {jobType}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Active Filter Display */}
        {selectedJobType && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filter:</span>
            <Badge 
              variant="default"
              className="flex items-center gap-1"
            >
              {selectedJobType}
              <button 
                onClick={() => setSelectedJobType("")} 
                className="ml-1 hover:text-primary-foreground/80"
                aria-label="Clear filter"
              >
                ×
              </button>
            </Badge>
          </div>
        )}
      </div>
      
      {/* Profile Cards */}
      {filteredProfiles.length === 0 ? (
        <div className="p-6 text-center bg-white dark:bg-neutral-800 rounded-lg shadow">
          <p className="text-lg text-muted-foreground">No profiles found matching your criteria.</p>
          <Button 
            variant="link" 
            onClick={() => {
              setSearchTerm("");
              setSelectedJobType("");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              Showing {filteredProfiles.length} {filteredProfiles.length === 1 ? "profile" : "profiles"}
              {selectedJobType && ` in ${selectedJobType}`}
              {searchTerm && ` matching "${searchTerm}"`}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full ml-2" 
                onClick={() => fetchProfiles(false)}
                disabled={isRefreshing}
                title="Refresh profiles"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh profiles</span>
              </Button>
            </span>
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredProfiles.map((profile) => (
              <Link key={profile.id} href={`/profile/${profile.id}`} className="group">
                <div className="p-4 border rounded-lg bg-white dark:bg-neutral-800 hover:shadow-md transition-shadow flex flex-col items-center text-center">
                  <div className="mb-3 overflow-hidden rounded-full w-24 h-24 mx-auto">
                    <img 
                      src={profile.image_url} 
                      alt={profile.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-primary text-lg mb-1">{profile.name.split(' ')[0]}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">{profile.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}