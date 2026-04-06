import { Heart, Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../hooks/useStore';

function StarRating({ rating, count, size = 14 }) {
  return (
    <span className="flex items-center gap-1">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="font-semibold text-ink text-xs">{rating}</span>
      {count && <span className="text-ink-light text-xs">({count})</span>}
    </span>
  );
}

export default function TiffinCard({ chef, className = '' }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(chef.id);

  return (
    <div className={`card group cursor-pointer ${className}`}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={chef.image}
          alt={chef.kitchen}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-card-overlay opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Veg/Non-veg badge */}
        <div className="absolute top-3 left-3">
          {chef.isVeg
            ? <span className="badge-veg">🟢 Veg</span>
            : <span className="badge-nonveg">🔴 Non-Veg</span>}
        </div>

        {/* Promo badge */}
        {chef.badge && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <span className="badge-primary text-xs font-bold px-3 py-1 shadow">{chef.badge}</span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(chef.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
            ${saved ? 'bg-primary text-white' : 'bg-white/80 text-ink'} transition-all hover:scale-110`}
        >
          <Heart size={14} className={saved ? 'fill-white' : ''} />
        </button>

        {/* Chef bottom-left on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <img src={chef.avatar} alt={chef.name}
            className="w-8 h-8 rounded-full border-2 border-white object-cover" />
          <div>
            <p className="text-white text-xs font-semibold leading-none flex items-center gap-1">
              {chef.name}
              {chef.verified && <CheckCircle size={11} className="text-primary fill-primary" />}
            </p>
            <p className="text-white/70 text-[10px]">{chef.kitchen}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-ink text-sm leading-snug">{chef.kitchen}</h3>
            <p className="text-ink-muted text-xs mt-0.5">{chef.cuisines.join(' · ')}</p>
          </div>
          <StarRating rating={chef.rating} count={chef.reviews} />
        </div>

        <p className="text-xs text-ink-secondary mb-3 italic">"{chef.specialty}"</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-ink-muted mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-primary" /> {chef.distance}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-primary" /> {chef.meals}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-ink">₹{chef.price.toLocaleString()}</span>
            <span className="text-xs text-ink-muted">/month</span>
          </div>
          <Link
            to={`/tiffin/${chef.id}`}
            className="btn-primary btn-sm text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader
export function TiffinCardSkeleton() {
  return (
    <div className="card-flat overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
