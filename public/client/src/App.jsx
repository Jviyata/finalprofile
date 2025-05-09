import { Route, Router as WouterRouter, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import EditProfilePage from "@/pages/edit-profile-page";
import AboutPage from "@/pages/about-page";
import AddProfilePage from "@/pages/add-profile-page";
import PrivacyPage from "@/pages/privacy-page";
import TermsPage from "@/pages/terms-page";
import { ProtectedRoute } from "./lib/protected-route";
import { ProtectedRouteRedux } from "./lib/protected-route-redux";
import Navbar from "./components/navbar";
import Chatbot from "./components/chatbot";
import { useEffect } from "react";
import { AuthProvider } from "./hooks/use-auth";
import { useDarkMode } from "./hooks/use-dark-mode";
import { useAuthRedux } from "./hooks/use-auth-redux";
import { cn } from "./lib/utils";

// Custom router with hash support and strict path matching
const hashRouter = () => {
  // Get the current location from the window
  const getLocation = () => {
    // Get path without leading/trailing slashes
    const path = window.location.pathname
      .replace(/\/$/, '')
      .replace(/^\//, '');
    
    // Combine path and hash (if exists)
    return path === '' ? '/' : '/' + path;
  };

  // Listen for location changes
  const hookRouter = (callback) => {
    const handler = () => callback(getLocation());
    
    window.addEventListener('popstate', handler);
    window.addEventListener('pushstate', handler);
    window.addEventListener('replacestate', handler);
    
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('pushstate', handler);
      window.removeEventListener('replacestate', handler);
    };
  };

  return { hook: hookRouter, location: getLocation() };
};

// Standard router using Context API for auth
function AppRouter() {
  return (
    <WouterRouter router={hashRouter}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/profile/:id">
          {params => <ProfilePage id={params.id} />}
        </Route>
        <ProtectedRoute path="/profile/:id/edit">
          {params => <EditProfilePage id={params.id} />}
        </ProtectedRoute>
        <ProtectedRoute path="/add-profile" component={AddProfilePage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

// Alternative router using Redux for auth
// This is ready to be used as a replacement for AppRouter when the app is fully
// migrated to Redux for authentication
function AppRouterRedux() {
  return (
    <WouterRouter router={hashRouter}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/profile/:id">
          {params => <ProfilePage id={params.id} />}
        </Route>
        <ProtectedRouteRedux path="/profile/:id/edit">
          {params => <EditProfilePage id={params.id} />}
        </ProtectedRouteRedux>
        <ProtectedRouteRedux path="/add-profile" component={AddProfilePage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  // Use our custom Redux hook for dark mode
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <main className="flex-grow container mx-auto p-6">
            <AppRouter />
          </main>
          <footer className="bg-neutral-100 dark:bg-neutral-800 py-8 mt-12">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    &copy; {new Date().getFullYear()} ProfileApp. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a href="/about" className="text-neutral-600 dark:text-neutral-400 text-sm hover:text-primary">About</a>
                  <a href="/privacy" className="text-neutral-600 dark:text-neutral-400 text-sm hover:text-primary">Privacy</a>
                  <a href="/terms" className="text-neutral-600 dark:text-neutral-400 text-sm hover:text-primary">Terms</a>
                </div>
              </div>
            </div>
          </footer>
          
          {/* Chatbot component */}
          <Chatbot />
        </AuthProvider>
      </TooltipProvider>
    </div>
  );
}

export default App;