
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import { useAuth } from '../../contexts/AuthContext';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // If not authenticated, the Auth component will be rendered by the router
    return <Outlet />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="py-4 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-muted-foreground">
            © 2025 StudyAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
