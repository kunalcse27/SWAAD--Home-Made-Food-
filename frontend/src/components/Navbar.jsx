import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import useStore from '../hooks/useStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useStore();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navlinks = [
    { label: 'Explore', to: '/home' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Our Chefs', to: '/home' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#F9F8F6]/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl font-bold text-[#2D2D2D] tracking-wider uppercase font-display">
            SWAAD
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navlinks.map((l, index) => (
            <Link key={l.label} to={l.to}
              className={`text-[13px] uppercase tracking-wider font-medium hover:text-[#AD4924] transition-colors ${index === 0 ? 'text-[#AD4924] border-b border-[#AD4924]' : 'text-[#2D2D2D]'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {isAuthenticated && user?.role === 'customer' && (
            <Link to="/customer/dashboard" className="text-[13px] uppercase tracking-wider font-medium text-[#2D2D2D] hover:text-[#AD4924] hidden md:block">
              Dashboard
            </Link>
          )}

          <button className="p-1 hover:text-[#AD4924] transition-colors text-[#2D2D2D]">
            <ShoppingCart size={18} strokeWidth={2} />
          </button>
          
          {isAuthenticated ? (
            <button onClick={() => { logout(); navigate('/'); }} className="p-1 hover:text-[#AD4924] transition-colors text-[#2D2D2D]" title="Logout">
              <User size={18} strokeWidth={2} fill="currentColor" />
            </button>
          ) : (
            <Link to="/login" className="p-1 hover:text-[#AD4924] transition-colors text-[#2D2D2D]" title="Login">
              <User size={18} strokeWidth={2} />
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-1 text-[#2D2D2D]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F9F8F6] border-t border-[#e2dfd9]">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navlinks.map(l => (
              <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}
                className="py-2 text-sm uppercase tracking-wider font-medium text-[#2D2D2D] hover:text-[#AD4924]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
