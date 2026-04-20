import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Moon, Sun, Shield, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

const Header = ({ totalDays = 0, onDownload }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const canDownload = totalDays > 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold tracking-tight hidden xs:block">
              Tax<span className="text-primary">Nomad</span>
            </span>
          </div>

          {/* Acciones Centrales/Derecha */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={onDownload}
              disabled={!canDownload}
              className={`rounded-full h-9 transition-all gap-2 shadow-lg ${
                canDownload 
                ? 'bg-primary hover:bg-primary/90 shadow-primary/20 px-4 sm:px-6' 
                : 'bg-muted text-muted-foreground opacity-50 px-3'
              }`}
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">
                {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
              </span>
            </Button>

            <div className="h-6 w-[1px] bg-border mx-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
            >
              <Globe className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;