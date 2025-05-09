import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">About Profile App</h1>
      
      <Card>
        <CardContent className="p-8">
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            ProfileApp is a platform where professionals can create and share their portfolios with the world. Our mission is to connect talented 
            individuals with opportunities by showcasing their skills and experience in an elegant, accessible format.
          </p>
          
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Features</h2>
          <ul className="list-disc pl-6 mb-6 text-neutral-600 dark:text-neutral-300 space-y-2">
            <li>Create a professional profile with your photo, contact information, and bio</li>
            <li>Browse profiles of other professionals</li>
            <li>Responsive design works on desktop and mobile devices</li>
            <li>Dark mode support for comfortable viewing in any environment</li>
            <li>Secure user authentication system</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Our Team</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Our team is passionate about creating tools that help professionals connect and grow. We're constantly working to improve the platform
            with new features and enhancements based on user feedback.
          </p>
          
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Contact Us</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Have questions or suggestions? Reach out to us at <a href="mailto:support@profileapp.com" className="text-primary hover:underline">support@profileapp.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}