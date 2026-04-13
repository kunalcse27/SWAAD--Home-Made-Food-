import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import TiffinCard, { TiffinCardSkeleton } from '../components/TiffinCard';
import useStore from '../hooks/useStore';
import { chefsAPI } from '../services/api';
import toast from 'react-hot-toast';

const FILTERS = [
  { id: 'all', label: 'All Tiffins' },
  { id: 'veg', label: 'Pure Veg' },
  { id: 'non-veg', label: 'Non-Veg' },
  { id: 'heavy', label: 'Heavy Meals' },
  { id: 'light', label: 'Light/Sattvic' },
  { id: 'budget', label: 'Budget Pick' },
];

export default function CustomerHome() {
  const { location, activeFilter, searchQuery, setFilter, setSearchQuery } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chefsList, setChefsList] = useState([]);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      try {
        const response = await chefsAPI.getAll({ filter: activeFilter === 'all' ? undefined : activeFilter, q: searchQuery || undefined });
        setChefsList(response.data);
      } catch (error) {
        toast.error('Failed to load chefs');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // Real-time refresh listener
    const handleRefresh = () => fetchChefs();
    window.addEventListener('REFRESH_CHEFS_LIST', handleRefresh);
    
    // We debounce slightly to avoid blasting the API while sorting/typing
    const timeout = setTimeout(() => {
      fetchChefs();
    }, 300);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('REFRESH_CHEFS_LIST', handleRefresh);
    };
  }, [activeFilter, searchQuery]);

  const filtered = chefsList;

  return (
    <div className="min-h-screen bg-surface pt-16">
      {/* Sticky top bar */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-muted shadow-sm">
        <div className="container-app px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-ink-secondary shrink-0">
              <MapPin size={14} className="text-primary" />
              <span className="font-medium text-ink max-w-[120px] truncate">{location}</span>
            </div>
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chefs, cuisines..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-surface-section text-sm text-ink outline-none focus:bg-white focus:ring-1 focus:ring-primary/30 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition-colors ${showFilters ? 'bg-primary text-white' : 'bg-surface-section text-ink-secondary hover:bg-primary/10'}`}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`chip ${activeFilter === f.id ? 'chip-active' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-ink-secondary text-sm">
            {filtered.length > 0
              ? <><span className="font-semibold text-ink">{filtered.length}</span> tiffin services found</>
              : 'No services found'}
          </p>
          {activeFilter !== 'all' && (
            <button onClick={() => setFilter('all')}
              className="flex items-center gap-1 text-xs text-primary hover:underline">
              <X size={12} /> Clear filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(6).fill(0).map((_, i) => <TiffinCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="font-bold text-ink text-xl mb-2">No tiffins found</h3>
            <p className="text-ink-secondary text-sm mb-6">Try adjusting your location or filters</p>
            <button onClick={() => { setFilter('all'); setSearchQuery(''); }}
              className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filtered.map(chef => <TiffinCard key={chef.id} chef={chef} />)}
          </div>
        )}
      </div>
    </div>
  );
}
