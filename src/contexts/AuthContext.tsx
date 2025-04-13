
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  grade?: string;
  institution?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // Mock authentication for now - would be replaced with real auth
  const login = async (email: string, password: string) => {
    // Simulate API call
    console.log('Logging in with:', email, password);
    
    // Simulate successful login after 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set mock user
    setUser({
      id: '1',
      name: 'Alex Johnson',
      email: email,
      grade: 'Grade 11',
      institution: 'Lincoln High School',
    });
  };
  
  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    console.log('Signing up with:', name, email, password);
    
    // Simulate successful signup after 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set mock user
    setUser({
      id: '1',
      name: name,
      email: email,
    });
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
