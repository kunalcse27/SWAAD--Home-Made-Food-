// Subscription plan selector with 3 tiers
export default function SubscriptionSelector({ selected, onChange }) {
  const plans = [
    {
      key: 'weekly',
      label: 'Weekly',
      emoji: '🗓️',
      per: 'week',
      savings: null,
      badge: 'Trial',
      badgeColor: 'bg-surface-muted text-ink-secondary',
      features: ['7 days', 'Cancel anytime', 'Delivery included', 'Basic customization'],
    },
    {
      key: 'monthly',
      label: 'Monthly',
      emoji: '⭐',
      per: 'month',
      savings: 'Save ₹300',
      badge: 'Most Popular',
      badgeColor: 'bg-primary text-white',
      features: ['30 days', 'Cancel anytime', 'Free delivery', 'Full customization', 'Priority support'],
      highlight: true,
    },
    {
      key: 'quarterly',
      label: 'Quarterly',
      emoji: '🏆',
      per: '3 months',
      savings: 'Save ₹1000',
      badge: 'Best Value',
      badgeColor: 'bg-amber-500 text-white',
      features: ['90 days', 'Cancel anytime', 'Free delivery', 'Full customization', 'Priority support', 'Free month on renewal'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <button
          key={plan.key}
          type="button"
          onClick={() => onChange(plan.key)}
          className={`relative text-left rounded-2xl p-5 border-2 transition-all duration-200 group
            ${selected === plan.key
              ? 'border-primary bg-primary/5 shadow-card-hover scale-[1.02]'
              : 'border-surface-muted bg-white hover:border-primary/40 hover:shadow-card'
            } ${plan.highlight ? 'ring-2 ring-primary/20' : ''}`}
        >
          {/* Badge */}
          <span className={`absolute -top-3 left-4 text-xs font-bold px-3 py-0.5 rounded-full ${plan.badgeColor}`}>
            {plan.badge}
          </span>

          <div className="mt-2">
            <span className="text-2xl mb-2 block">{plan.emoji}</span>
            <p className="font-bold text-ink text-base">{plan.label} Plan</p>
            {plan.savings && (
              <span className="badge-primary text-[10px] font-bold mt-1 inline-block">{plan.savings}</span>
            )}
          </div>

          <ul className="mt-4 space-y-1.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-xs text-ink-secondary">
                <span className="text-success text-sm">✓</span> {f}
              </li>
            ))}
          </ul>

          {selected === plan.key && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
