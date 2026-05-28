'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, Brain, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeHash, setActiveHash] = useState('#features');

  useEffect(() => {
    const updateHash = () => {
      if (window.location.hash) {
        setActiveHash(window.location.hash);
      }
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleGetStarted = () => {
    router.push('/register');
  };

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Benefits', href: '#resume-benefits' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="fixed w-full top-0 z-50 glass-nav">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground block leading-none">AI Learning OS</span>
                <span className="text-xs text-foreground-secondary">NeuroLearn</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-6 xl:ml-10 flex items-baseline space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveHash(item.href)}
                  className={`nav-link text-foreground-secondary hover:text-foreground text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    activeHash === item.href ? 'nav-link-active text-foreground' : ''
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-white/5 transition-colors duration-200 min-w-touch min-h-touch"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleSignIn}
              className="text-foreground-secondary hover:text-foreground font-medium text-sm px-3 py-2 min-h-touch transition-colors duration-200"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="btn-primary text-sm px-5 py-2"
            >
              Start Building
            </button>
            <div className="relative">
              <button
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
                <ChevronDown className="w-4 h-4 text-foreground-secondary" />
              </button>
              {isAvatarOpen && (
                <div className="absolute right-0 mt-3 w-44 rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full text-left px-4 py-2 text-sm text-foreground-secondary hover:text-foreground hover:bg-white/5"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/profile')}
                    className="w-full text-left px-4 py-2 text-sm text-foreground-secondary hover:text-foreground hover:bg-white/5"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignIn}
                    className="w-full text-left px-4 py-2 text-sm text-foreground-secondary hover:text-foreground hover:bg-white/5"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-white/5 transition-colors duration-200 min-w-touch min-h-touch"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-white/5 transition-colors duration-200 min-w-touch min-h-touch"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 border-t border-white/10 shadow-lg">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground-secondary hover:text-foreground hover:bg-white/5 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 min-h-touch"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 pb-3 border-t border-white/10 space-y-2">
                <button
                  onClick={handleSignIn}
                  className="w-full text-left text-foreground-secondary hover:text-foreground hover:bg-white/5 block px-3 py-3 rounded-md text-base font-medium min-h-touch transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="w-full btn-primary py-3 text-base"
                >
                  Start Building
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
