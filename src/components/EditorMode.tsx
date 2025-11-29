import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogEditor } from './BlogEditor';
import { PortfolioEditor } from './PortfolioEditor';
import { AboutEditor } from './AboutEditor';
import { X } from 'lucide-react';

interface EditorModeProps {
  onClose: () => void;
}

export function EditorMode({ onClose }: EditorModeProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeEditor, setActiveEditor] = useState<'blog' | 'portfolio' | 'about'>('blog');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'firebolt') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-border"
        >
          {!isAuthenticated ? (
            <div className="p-8 sm:p-12">
              <h2 className="text-foreground mb-6">Enter Editor Mode</h2>
              <form onSubmit={handleLogin} className="max-w-sm">
                <div className="mb-6">
                  <label htmlFor="password" className="block text-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                    placeholder="Enter password"
                    autoFocus
                  />
                  {error && (
                    <p className="text-destructive mt-2">{error}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-all"
                  >
                    Enter
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="border-b border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground">Content Editor</h2>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveEditor('blog')}
                    className={`px-5 py-2.5 rounded-xl transition-all ${
                      activeEditor === 'blog'
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Insights
                  </button>
                  <button
                    onClick={() => setActiveEditor('portfolio')}
                    className={`px-5 py-2.5 rounded-xl transition-all ${
                      activeEditor === 'portfolio'
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Work
                  </button>
                  <button
                    onClick={() => setActiveEditor('about')}
                    className={`px-5 py-2.5 rounded-xl transition-all ${
                      activeEditor === 'about'
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    About
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeEditor === 'blog' && <BlogEditor />}
                {activeEditor === 'portfolio' && <PortfolioEditor />}
                {activeEditor === 'about' && <AboutEditor />}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
