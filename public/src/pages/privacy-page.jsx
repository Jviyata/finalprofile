import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-olive-50 dark:bg-olive-900/20 border-b-2 border-olive-200 dark:border-olive-800 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to ProfileApp. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2>2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul>
              <li>Identity Data: includes username, name, title</li>
              <li>Contact Data: includes email address and website</li>
              <li>Profile Data: includes your bio, profile pictures, and professional details</li>
              <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting</li>
            </ul>
            
            <h2>3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
              <li>To register you as a new user</li>
              <li>To manage your profile and provide our services</li>
              <li>To improve our website and services</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
              used or accessed in an unauthorized way, altered or disclosed.
            </p>
            
            <h2>5. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
            </p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to request correction of your personal data</li>
              <li>The right to request erasure of your personal data</li>
              <li>The right to withdraw consent</li>
            </ul>
            
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@profileapp.example.com
            </p>
          </div>
          
          <div className="mt-8">
            <Button 
              variant="outline" 
              className="flex items-center border-olive-300 text-olive-700 hover:bg-olive-50" 
              asChild
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}