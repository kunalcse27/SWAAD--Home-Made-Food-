import { Star } from 'lucide-react';

// Filled / empty star rating display
export function RatingStars({ rating, max = 5, size = 16, interactive = false, onChange }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s) => (
        <button
          key={s}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange?.(s) : undefined}
          className={interactive ? 'hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <Star
            size={size}
            className={s <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-surface-muted fill-surface-muted'}
          />
        </button>
      ))}
    </div>
  );
}

// Rating badge chip
export function RatingBadge({ rating, count }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
      <Star size={11} className="fill-amber-400 text-amber-400" />
      <span className="text-xs font-bold text-amber-700">{rating}</span>
      {count && <span className="text-xs text-amber-600">({count})</span>}
    </span>
  );
}
