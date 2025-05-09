import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, MoreHorizontal } from "lucide-react";
import { useLocation } from "wouter";

export default function ProfileCard({ profile }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [, setLocation] = useLocation();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleViewProfile = () => {
    setLocation(`/profile/${profile.id}`);
  };

  return (
    <div className="flip-card h-[380px]">
      <div className={`flip-card-inner rounded-lg shadow-md overflow-hidden h-full ${isFlipped ? 'flipped' : ''}`}>
        {/* Card Front */}
        <div className="flip-card-front bg-white dark:bg-neutral-700 h-full">
          <div className="relative">
            <img 
              src={profile.image_url} 
              alt={profile.name} 
              className="w-full h-64 object-cover"
            />
            
            <button 
              className="absolute top-3 right-3 bg-white/70 dark:bg-neutral-800/70 p-1.5 rounded-full shadow-sm hover:bg-white/90 dark:hover:bg-neutral-700/90 transition"
              aria-label="Flip card"
              onClick={handleFlip}
            >
              <MoreHorizontal className="h-5 w-5 text-neutral-700 dark:text-white" />
            </button>
          </div>
          
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="text-neutral-600 dark:text-neutral-300">{profile.title}</p>
            <Button 
              variant="link" 
              className="mt-2 p-0 text-primary" 
              onClick={handleViewProfile}
            >
              View Profile
            </Button>
          </CardContent>
        </div>
        
        {/* Card Back */}
        <div className="flip-card-back bg-white dark:bg-neutral-700 h-full p-6 flex flex-col justify-center">
          <p className="text-neutral-600 dark:text-neutral-300 text-center mb-4">
            {profile.bio.length > 150 
              ? `${profile.bio.substring(0, 150)}...` 
              : profile.bio}
          </p>
          <div className="flex justify-center">
            <Button onClick={handleViewProfile}>
              Full Profile
            </Button>
          </div>
          <button 
            className="absolute top-3 right-3 bg-white/70 dark:bg-neutral-800/70 p-1.5 rounded-full shadow-sm hover:bg-white/90 dark:hover:bg-neutral-700/90 transition"
            aria-label="Flip card back"
            onClick={handleFlip}
          >
            <ChevronUp className="h-5 w-5 text-neutral-700 dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}