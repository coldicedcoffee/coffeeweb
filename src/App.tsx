import { useState, useEffect } from 'react';
import { Blog } from './components/Blog';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { EditorMode } from './components/EditorMode';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'blog' | 'portfolio' | 'about'>('blog');
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'blog' && <Blog isEditorMode={isEditorMode} />}
          {activeTab === 'portfolio' && <Portfolio isEditorMode={isEditorMode} />}
          {activeTab === 'about' && <About isEditorMode={isEditorMode} />}
        </motion.div>
      </main>

      {/* Editor Mode Toggle */}
      <button
        onClick={() => setIsEditorMode(!isEditorMode)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-foreground text-background rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group"
        title={isEditorMode ? 'Exit Editor Mode' : 'Enter Editor Mode'}
      >
        {isEditorMode ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )}
      </button>

      {/* Editor Mode Modal */}
      {isEditorMode && (
        <EditorMode onClose={() => setIsEditorMode(false)} />
      )}
    </div>
  );
}
