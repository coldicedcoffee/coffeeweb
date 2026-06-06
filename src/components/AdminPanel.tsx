import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogEditor } from './BlogEditor';
import { PortfolioEditor } from './PortfolioEditor';
import { AboutEditor } from './AboutEditor';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PenLine,
  FolderOpen,
  Eye,
  Lock,
  Save,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface AdminPanelProps {
  onLogout: () => void;
}

type AdminSection = 'dashboard' | 'blog' | 'portfolio' | 'about' | 'settings';

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState({
    posts: 0,
    portfolioItems: 0,
    lastUpdated: '',
  });

  useEffect(() => {
    loadStats();
  }, [activeSection]);

  const loadStats = () => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const portfolio = JSON.parse(localStorage.getItem('portfolioItems') || '[]');
    const aboutData = localStorage.getItem('aboutData');

    setStats({
      posts: posts.length,
      portfolioItems: portfolio.length,
      lastUpdated: aboutData ? 'Configured' : 'Default',
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    onLogout();
  };

  const navItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blog' as AdminSection, label: 'Insights', icon: FileText },
    { id: 'portfolio' as AdminSection, label: 'Work', icon: Briefcase },
    { id: 'about' as AdminSection, label: 'About', icon: User },
    { id: 'settings' as AdminSection, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: AdminSection) => {
    setActiveSection(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-sidebar-overlay"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? '' : 'admin-sidebar-collapsed'} ${
          mobileSidebarOpen ? 'admin-sidebar-mobile-open' : ''
        }`}
      >
        {/* Logo section */}
        <div className="admin-sidebar-header">
          <div className="flex items-center gap-3">
            <div className="admin-sidebar-logo">
              <PenLine className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <h3 className="text-foreground text-[15px] font-medium truncate">Admin Panel</h3>
                <p className="text-muted-foreground text-[12px] truncate">Content Management</p>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                sidebarOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`admin-nav-item ${
                activeSection === item.id ? 'admin-nav-item-active' : ''
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
              window.location.reload();
            }}
            className="admin-nav-item"
            title={!sidebarOpen ? 'View Site' : undefined}
          >
            <Eye className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>View Site</span>}
          </a>
          <button onClick={handleLogout} className="admin-nav-item admin-nav-item-danger">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-foreground text-[1.5rem] leading-tight">
                {navItems.find((n) => n.id === activeSection)?.label}
              </h1>
              <p className="text-muted-foreground text-[13px]">
                {activeSection === 'dashboard' && 'Overview of your content'}
                {activeSection === 'blog' && 'Manage your insights and blog posts'}
                {activeSection === 'portfolio' && 'Manage your work and projects'}
                {activeSection === 'about' && 'Edit your profile information'}
                {activeSection === 'settings' && 'Admin preferences and security'}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === 'dashboard' && <DashboardView stats={stats} onNavigate={setActiveSection} />}
              {activeSection === 'blog' && <BlogEditor />}
              {activeSection === 'portfolio' && <PortfolioEditor />}
              {activeSection === 'about' && <AboutEditor />}
              {activeSection === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Dashboard View
function DashboardView({
  stats,
  onNavigate,
}: {
  stats: { posts: number; portfolioItems: number; lastUpdated: string };
  onNavigate: (section: AdminSection) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <button onClick={() => onNavigate('blog')} className="admin-stat-card group">
          <div className="admin-stat-icon admin-stat-icon-blue">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-[13px] mb-1">Blog Posts</p>
            <p className="text-foreground text-[2rem] leading-none font-medium">{stats.posts}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <button onClick={() => onNavigate('portfolio')} className="admin-stat-card group">
          <div className="admin-stat-icon admin-stat-icon-emerald">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-[13px] mb-1">Portfolio Items</p>
            <p className="text-foreground text-[2rem] leading-none font-medium">
              {stats.portfolioItems}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <button onClick={() => onNavigate('about')} className="admin-stat-card group">
          <div className="admin-stat-icon admin-stat-icon-violet">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-[13px] mb-1">About Profile</p>
            <p className="text-foreground text-[1.125rem] leading-tight font-medium">
              {stats.lastUpdated}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-foreground mb-4 text-[1.125rem]">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('blog')}
            className="admin-quick-action"
          >
            <PenLine className="w-5 h-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-foreground text-[15px]">New Insight</p>
              <p className="text-muted-foreground text-[13px]">Write a new blog post</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('portfolio')}
            className="admin-quick-action"
          >
            <FolderOpen className="w-5 h-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-foreground text-[15px]">Add Work</p>
              <p className="text-muted-foreground text-[13px]">Add a new portfolio item</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings View
function SettingsView() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    const storedPw = getStoredPassword();

    if (currentPassword !== storedPw) {
      toast.error('Current password is incorrect');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('New password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    localStorage.setItem('adminPasswordHash', btoa(newPassword));
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL content data? This cannot be undone.')) {
      localStorage.removeItem('blogPosts');
      localStorage.removeItem('portfolioItems');
      localStorage.removeItem('aboutData');
      toast.success('All content data has been cleared');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Change Password */}
      <div className="admin-settings-section">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-foreground text-[1.125rem]">Change Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="current-pw" className="block text-foreground mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="current-pw"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="new-pw" className="block text-foreground mb-2">
              New Password
            </label>
            <input
              type="password"
              id="new-pw"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-pw" className="block text-foreground mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-pw"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-all"
          >
            <Save className="w-4 h-4" />
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="admin-settings-section admin-settings-danger">
        <h3 className="text-destructive text-[1.125rem] mb-2">Danger Zone</h3>
        <p className="text-muted-foreground text-[14px] mb-4">
          This action will permanently delete all blog posts, portfolio items, and about data from localStorage.
        </p>
        <button
          onClick={handleClearAllData}
          className="px-6 py-3 bg-destructive text-destructive-foreground rounded-xl hover:opacity-90 transition-all"
        >
          Clear All Content Data
        </button>
      </div>
    </div>
  );
}
