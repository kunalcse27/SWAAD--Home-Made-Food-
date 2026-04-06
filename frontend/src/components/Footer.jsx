import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const footerLinks = {
  Explore: [
    { label: 'Chef Sign Up', href: '/chef-signup' },
    { label: 'Partner Login', href: '/delivery-signup' },
    { label: 'Corporate Plans', href: '#' },
    { label: 'Gift a Tiffin', href: '#' }
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-[#F9F8F6] pt-20 pb-8 border-t border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          
          {/* Logo & Description */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-6 text-xl md:text-2xl font-bold text-[#2D2D2D] tracking-wider uppercase font-display">
              SWAAD
            </Link>
            <p className="text-[#8D8D8D] text-sm leading-relaxed max-w-xs">
              Cultivating home-cooked rituals through technology and a shared delivery.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4 flex flex-row gap-16 md:justify-center">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-[13px] font-bold text-[#AD4924] mb-4 uppercase tracking-wider">{title}</h4>
                <ul className="space-y-3">
                  {links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-[13px] text-[#5A5A5A] hover:text-[#AD4924] transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h4 className="text-[13px] font-bold text-[#AD4924] mb-4 uppercase tracking-wider">Newsletter</h4>
            <p className="text-[#5A5A5A] text-[13px] mb-4">Recipes and stories delivered monthly.</p>
            <form className="relative flex items-center max-w-xs" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-white border border-[#E5E0D8] text-sm text-[#2D2D2D] rounded-full px-5 py-3 outline-none placeholder:text-[#8D8D8D] focus:border-[#AD4924] transition-colors"
              />
              <button type="submit" className="absolute right-1 w-9 h-9 bg-[#AD4924] hover:bg-[#C87E4B] flex items-center justify-center rounded-full text-white transition-colors">
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="text-center pt-8 border-t border-[#E5E0D8]">
          <p className="text-[#8D8D8D] text-[11px] uppercase tracking-wider">
            © {new Date().getFullYear()} SWAAD. Cultivating home-cooked rituals.
          </p>
        </div>
      </div>
    </footer>
  );
}
