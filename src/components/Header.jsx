import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calculator, Globe, Moon, Sun, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const isSelected = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-all">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">Tax<span className="text-primary">Nomad</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className={`text-sm font-medium transition-colors hover:text-primary ${isSelected('/') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/calculator')}
              className={`text-sm font-medium transition-colors hover:text-primary ${isSelected('/calculator') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Calculator
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="rounded-full h-9 w-9"
            >
              <Globe className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full h-9 w-9"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button 
              onClick={() => navigate('/calculator')}
              className="rounded-full bg-primary hover:bg-primary/90 text-sm font-bold px-5 h-9"
            >
              Launch
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;