
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        if (name.trim().length < 2) {
          throw new Error('Please enter a valid name');
        }
        await signup(name, email, password);
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset form state
    setName('');
    setEmail('');
    setPassword('');
  };
  
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-card shadow-lg rounded-xl">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <Calendar className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-muted-foreground">
          {isLogin 
            ? 'Enter your details to access your account' 
            : 'Sign up to get started with StudyAI'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading 
            ? 'Processing...' 
            : isLogin 
              ? 'Sign In' 
              : 'Create Account'
          }
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Button 
            variant="link" 
            onClick={toggleForm} 
            className="p-0 h-auto font-normal"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Button>
        </p>
      </div>
    </div>
  );
}
