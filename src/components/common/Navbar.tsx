
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  BarChart, 
  Settings, 
  Moon, 
  Sun, 
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Timetable', path: '/timetable', icon: Calendar },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Progress', path: '/progress', icon: BarChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-primary font-heading font-bold text-xl flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                <span>StudyAI</span>
              </Link>
            </div>
            
            {/* Desktop navbar */}
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="nav-link flex items-center gap-1.5"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 overflow-hidden">
                  <Avatar>
                    <AvatarImage src={user?.profileImage} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-in">
          <div className="p-4 space-y-3 bg-card shadow-lg rounded-b-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex items-center gap-2">
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={logout} className="text-destructive">
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
