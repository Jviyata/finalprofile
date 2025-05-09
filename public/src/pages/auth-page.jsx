import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Redirect } from "wouter";
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Card className="p-8 dark:bg-neutral-700">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <h1 className="text-2xl font-bold mb-6 text-center">Create a New Account</h1>
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="auth-hero bg-primary/10 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Welcome to ProfileApp</h2>
        <p className="text-lg mb-6">
          Create and share your professional profile with the world. Connect with
          other professionals and showcase your skills and experience.
        </p>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Key Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create a professional profile with your photo and bio</li>
            <li>Browse profiles of other professionals</li>
            <li>Responsive design for desktop and mobile</li>
            <li>Dark mode for comfortable viewing</li>
            <li>Secure user authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}