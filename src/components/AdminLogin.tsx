import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const getStoredPassword = (): string => {
    const stored = localStorage.getItem('adminPasswordHash');
    if (stored) {
      try {
        return atob(stored);
      } catch {
        return 'firebolt';
      }
    }
    return 'firebolt';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getStoredPassword();

    if (password === correctPassword) {
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
      onLogin();
    } else {
      setError('Incorrect password');
      setPassword('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="admin-login-bg" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group text-[15px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to site
        </button>

        {/* Login card */}
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="admin-login-card"
        >
          {/* Icon */}
          <div className="admin-login-icon-wrapper">
            <div className="admin-login-icon">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-foreground text-center mb-2">Admin Access</h2>
          <p className="text-muted-foreground text-center text-[15px] mb-8">
            Enter your password to access the content management panel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-password" className="block text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-3 pr-12 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                  placeholder="Enter password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive mt-2 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-all active:scale-[0.98] font-medium"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
