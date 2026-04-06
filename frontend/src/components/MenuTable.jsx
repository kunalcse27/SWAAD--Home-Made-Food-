import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' };

export default function MenuTable({ menu = {} }) {
  const [activeDay, setActiveDay] = useState('Monday');
  const dayMenu = menu[activeDay] || {};

  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {DAYS.map((day, i) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${activeDay === day
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-section text-ink-secondary hover:bg-primary/10 hover:text-primary'}`}
          >
            {DAY_SHORT[i]}
          </button>
        ))}
      </div>

      {/* Meal cards */}
      <div className="grid md:grid-cols-3 gap-4 animate-fade-in">
        {Object.entries(dayMenu).map(([meal, items]) => (
          <div key={meal} className="card-flat rounded-2xl p-4 border border-surface-muted">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{mealIcons[meal]}</span>
              <h4 className="font-semibold text-ink capitalize text-sm">{meal}</h4>
            </div>
            <ul className="space-y-1.5">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-ink-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
