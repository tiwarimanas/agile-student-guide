
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForms } from '../components/Auth/AuthForms';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, BarChart, Clock, BookOpen, Brain } from 'lucide-react';

const features = [
  {
    title: 'AI-Based Study Suggestions',
    description: 'Get personalized study plans based on your syllabus, exams, and availability.',
    icon: Brain,
  },
  {
    title: 'Dynamic Timetable Generator',
    description: 'Automatically create weekly schedules optimized for your learning style.',
    icon: Calendar,
  },
  {
    title: 'Smart Task Manager',
    description: 'Add, edit, and organize tasks with AI-powered prioritization.',
    icon: CheckSquare,
  },
  {
    title: 'Visual Progress Tracking',
    description: 'Monitor your progress with intuitive charts and statistics.',
    icon: BarChart,
  },
  {
    title: 'Complete Study Records',
    description: 'Keep a comprehensive log of all your study activities and achievements.',
    icon: BookOpen,
  },
  {
    title: 'Time Optimization',
    description: 'Make the most of your study time with intelligent scheduling.',
    icon: Clock,
  },
];

export default function Index() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary/5"></div>
        
        <div className="relative pt-6 pb-16 sm:pb-24">
          <header className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <span className="text-primary font-heading font-bold text-xl flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>StudyAI</span>
                </span>
              </div>
            </div>
          </header>
          
          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-4xl font-extrabold font-heading tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  <span className="block">Smart AI-Powered</span>
                  <span className="block text-primary">Study Planner</span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Maximize your academic potential with our intelligent study planning tool. 
                  Get personalized schedules, smart task management, and insightful progress tracking.
                </p>
                <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium">
                      Get Started
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                <div className="bg-card shadow-xl sm:rounded-xl sm:overflow-hidden">
                  <div className="px-4 py-8 sm:px-10">
                    <div>
                      <h2 className="text-center text-2xl font-bold font-heading mb-4">
                        Start Studying Smarter
                      </h2>
                    </div>
                    <div className="mt-6">
                      <AuthForms />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-16 bg-background sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight text-foreground sm:text-4xl">
              Features designed for students
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground sm:mt-4">
              Everything you need to excel in your studies, all in one place.
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="pt-6 relative"
                >
                  <div className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="ml-16 text-lg font-medium font-heading text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="mt-2 ml-16 text-base text-muted-foreground">
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to boost your grades?</span>
            <span className="block text-primary-foreground">Start your free account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button variant="secondary" className="text-primary">
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-card">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center justify-center md:justify-start">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold text-foreground">StudyAI</span>
            </div>
            <div className="mt-8 md:mt-0 flex items-center justify-center md:justify-end">
              <p className="text-center text-base text-muted-foreground">
                &copy; 2025 StudyAI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
