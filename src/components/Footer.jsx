import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Github, ShieldAlert } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/10 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span className="font-bold">Tax Nomad Utility</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Professional-grade digital utilities for global remote workers. Precision-focused and audit-ready data processing.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50">Legal</h4>
            <button onClick={() => navigate('/privacy')} className="text-sm text-muted-foreground hover:text-primary text-left">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="text-sm text-muted-foreground hover:text-primary text-left">Terms of Service</button>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50">Contact</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" /> hola@regla183.com
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          <span>© {currentYear} Tax Nomad Calculator</span>
          <a href="/llms.txt" className="hover:text-primary">AEO / LLMS Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
