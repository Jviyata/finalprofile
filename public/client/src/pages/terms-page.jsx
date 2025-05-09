import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-olive-50 dark:bg-olive-900/20 border-b-2 border-olive-200 dark:border-olive-800 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using ProfileApp, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on ProfileApp for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            
            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information at all times. 
              Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the service and for any activities 
              or actions under your password.
            </p>
            
            <h2>4. User Content</h2>
            <p>
              Our service allows you to post, link, store, share and otherwise make available certain information, text, 
              graphics, or other material ("Content"). You are responsible for the Content that you post, including its legality, 
              reliability, and appropriateness.
            </p>
            
            <h2>5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
              including without limitation if you breach the Terms.
            </p>
            
            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall ProfileApp, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or 
              inability to access or use the service.
            </p>
            
            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              It is your responsibility to check our Terms periodically for changes.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@profileapp.example.com
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