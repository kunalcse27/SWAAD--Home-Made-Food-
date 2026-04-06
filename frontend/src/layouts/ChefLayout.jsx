import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CircleDollarSign, UserCircle,
  Settings, Bell, Search, PlusCircle, Menu, X, ChefHat, LogOut,
} from 'lucide-react';
import useStore from '../hooks/useStore';

const NAV_ITEMS = [
  { name: 'Dashboard',   path: '/chef/dashboard',   icon: LayoutDashboard },
  { name: 'Subscribers', path: '/chef/subscribers', icon: Users },
  { name: 'Earnings',    path: '/chef/earnings',    icon: CircleDollarSign },
  { name: 'Profile',     path: '/chef/profile',     icon: UserCircle },
  { name: 'Settings',   path: '/chef/settings',    icon: Settings },
];

export default function ChefLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-6 pb-10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-rust flex items-center justify-center shadow-sm shrink-0">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-ink leading-none">Chef's Table</h1>
          <p className="text-[9px] text-ink-secondary tracking-widest uppercase mt-0.5">Kitchen Studio</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-rust shadow-sm'
                  : 'text-ink-secondary hover:text-ink hover:bg-black/5'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Post New Menu CTA */}
      <div className="p-4">
        <NavLink
          to="/chef/post-menu"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${
              isActive
                ? 'bg-rust-dark text-white shadow-inner'
                : 'bg-rust text-white shadow-lg hover:bg-rust-dark'
            }`
          }
        >
          <PlusCircle className="w-4 h-4" />
          Post New Menu
        </NavLink>
      </div>

      {/* Logout */}
      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-ink-secondary hover:text-error hover:bg-error/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F9F8F6] text-ink font-sans overflow-hidden">

      {/* ── Desktop Sidebar ────────────────────────────── */}
      <aside className="w-60 bg-[#F2F0EA] border-r border-[#E5E1D6] flex-col justify-between hidden md:flex">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ──────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#F2F0EA] flex flex-col shadow-2xl animate-slide-up">
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl hover:bg-black/10 text-ink-secondary hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-16 px-4 md:px-8 flex items-center justify-between shrink-0 bg-[#F9F8F6] border-b border-[#E5E1D6]">
          {/* Left: Hamburger (mobile) + Search (desktop) */}
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-black/10 text-ink-secondary hover:text-ink transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Search */}
            <div className="relative hidden lg:block w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input
                type="text"
                placeholder="Search menus or subscribers..."
                className="w-full pl-10 pr-4 py-2 bg-[#EBE9E1] rounded-full text-sm outline-none focus:ring-2 focus:ring-rust/20 transition-shadow"
              />
            </div>
          </div>

          {/* Right: Bell + Chef info */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-ink-secondary hover:text-ink transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rust rounded-full border-2 border-[#F9F8F6]" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#E5E1D6]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-ink leading-tight">
                  {user?.name || 'Chef Julian'}
                </p>
                <p className="text-[10px] text-ink-secondary uppercase tracking-widest">Executive Chef</p>
              </div>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=150&auto=format&fit=crop'}
                alt="Chef Avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
