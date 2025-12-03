import { NavLink } from '@/components/NavLink';
import { Home, LineChart, BarChart3, Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Time Series', url: '/timeseries', icon: LineChart },
  { title: 'Statistics', url: '/stats', icon: BarChart3 },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-sidebar text-sidebar-foreground
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-sidebar-foreground">
                CropAdvisor
              </h1>
              <p className="text-xs text-sidebar-foreground/70">Smart Farming</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg p-4">
            <p className="text-xs text-sidebar-foreground/70 mb-2">
              Need help with your crops?
            </p>
            <p className="text-sm text-sidebar-foreground">
              Use our smart analytics to make better farming decisions.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
