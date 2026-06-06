import { useState, useEffect } from 'react';
import { Blog } from './components/Blog';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X, Github, Linkedin, Mail } from 'lucide-react';

type AppView = 'site' | 'admin-login' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<'blog' | 'portfolio' | 'about'>('blog');
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [view, setView] = useState<AppView>('site');

  // Hash-based routing for admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        const isAuth = sessionStorage.getItem('adminAuth') === 'true';
        setView(isAuth ? 'admin' : 'admin-login');
      } else {
        setView('site');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      const isDarkMode = JSON.parse(saved);
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    } else {
      // Default to dark mode
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', JSON.stringify(true));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load about data for footer social links
  const [aboutData, setAboutData] = useState<{
    email?: string;
    social?: { github?: string; linkedin?: string };
  }>({});

  useEffect(() => {
    const saved = localStorage.getItem('aboutData');
    if (saved) {
      try {
        setAboutData(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Admin views
  if (view === 'admin-login') {
    return (
      <AdminLogin
        onLogin={() => setView('admin')}
        onBack={() => {
          window.location.hash = '';
          setView('site');
        }}
      />
    );
  }

  if (view === 'admin') {
    return (
      <AdminPanel
        onLogout={() => {
          window.location.hash = '';
          setView('site');
        }}
      />
    );
  }

  // Main site view
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-foreground mb-1">Param Pabari</h1>
              <p className="text-muted-foreground text-[15px]">Strategy · Analysis · Value Creation</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>

              {/* Desktop Tab Navigation */}
              <nav className="hidden md:flex gap-1 bg-secondary/80 rounded-xl p-1.5">
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-200 ${
                    activeTab === 'blog'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Insights
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-200 ${
                    activeTab === 'portfolio'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Work
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-200 ${
                    activeTab === 'about'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  About
                </button>
              </nav>

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/50 overflow-hidden"
            >
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveTab('blog');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-5 py-3 rounded-xl transition-all duration-200 text-left ${
                    activeTab === 'blog'
                      ? 'bg-foreground text-background'
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Insights
                </button>
                <button
                  onClick={() => {
                    setActiveTab('portfolio');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-5 py-3 rounded-xl transition-all duration-200 text-left ${
                    activeTab === 'portfolio'
                      ? 'bg-foreground text-background'
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Work
                </button>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-5 py-3 rounded-xl transition-all duration-200 text-left ${
                    activeTab === 'about'
                      ? 'bg-foreground text-background'
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  About
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'blog' && <Blog />}
            {activeTab === 'portfolio' && <Portfolio />}
            {activeTab === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-[14px]">
                © {new Date().getFullYear()} Param Pabari
              </p>
              <span className="text-border hidden sm:inline">·</span>
              <div className="hidden sm:flex items-center gap-3">
                {aboutData?.email && (
                  <a
                    href={`mailto:${aboutData.email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {aboutData?.social?.linkedin && (
                  <a
                    href={aboutData.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {aboutData?.social?.github && (
                  <a
                    href={aboutData.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <a
              href="#admin"
              className="text-muted-foreground/50 hover:text-muted-foreground text-[12px] transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
