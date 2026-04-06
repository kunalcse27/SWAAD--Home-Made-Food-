import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { RatingStars, RatingBadge } from '../components/RatingStars';
import { chefsAPI, reviewsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chef, setChef] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [chefRes, reviewsRes] = await Promise.all([
          chefsAPI.getById(id),
          chefsAPI.getReviews(id)
        ]);
        setChef(chefRes.data);
        setAllReviews(reviewsRes.data);
      } catch (error) {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filtered = filterRating ? allReviews.filter(r => r.rating === filterRating) : allReviews;

  // Calculate generic distribution from loaded reviews
  const ratingDist = [5, 4, 3, 2, 1].map(stars => {
    const count = allReviews.filter(r => r.rating === stars).length;
    const percent = allReviews.length > 0 ? Math.round((count / allReviews.length) * 100) : 0;
    return { stars, count, percent };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRating || !newText.trim()) return;
    try {
      const res = await reviewsAPI.create({ chefId: id, rating: newRating, text: newText });
      toast.success('Review submitted!');
      setSubmitted(true);
      setAllReviews([
        {
          id: res.data._id || Date.now(),
          name: 'You',
          avatar: "https://i.pravatar.cc/150",
          rating: newRating,
          date: new Date().toLocaleDateString(),
          text: newText
        },
        ...allReviews
      ]);
      setTimeout(() => setSubmitted(false), 3000);
      setNewRating(0);
      setNewText('');
      
      // Update local chef rating naive average
      setChef(prev => ({
        ...prev,
        reviews: prev.reviews + 1,
      }));

    } catch (error) {
      toast.error('Failed to submit review. You must be logged in.');
    }
  };

  if (loading) return <div className="min-h-screen bg-surface pt-16 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="container-app px-4 py-10">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to {chef.kitchen}
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card-flat rounded-2xl p-6 border border-surface-muted sticky top-24">
              <div className="text-center mb-6">
                <div className="text-6xl font-extrabold text-ink font-display">{chef.rating}</div>
                <RatingStars rating={chef.rating} size={20} />
                <p className="text-ink-secondary text-sm mt-2">{chef.reviews} total ratings</p>
              </div>

              {/* Distribution bars */}
              <div className="space-y-2 mb-6">
                {ratingDist.map(d => (
                  <button key={d.stars} onClick={() => setFilterRating(filterRating === d.stars ? 0 : d.stars)}
                    className={`w-full flex items-center gap-3 text-xs transition-all rounded-lg p-1 hover:bg-surface-section
                      ${filterRating === d.stars ? 'bg-primary/10' : ''}`}>
                    <span className="w-4 text-ink-secondary text-right">{d.stars}★</span>
                    <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${d.percent}%` }} />
                    </div>
                    <span className="w-8 text-ink-secondary text-right">{d.count}</span>
                  </button>
                ))}
              </div>

              {filterRating > 0 && (
                <button onClick={() => setFilterRating(0)}
                  className="w-full text-xs text-primary hover:underline">Clear filter</button>
              )}
            </div>
          </div>

          {/* Reviews list + add review */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add review form */}
            <div className="card-flat rounded-2xl p-6 border border-surface-muted">
              <h3 className="font-bold text-ink mb-4">✍️ Write a Review</h3>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-semibold text-ink">Thank you for your review!</p>
                  <p className="text-sm text-ink-secondary mt-1">Your feedback helps other customers.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="input-label mb-2">Your Rating</label>
                    <RatingStars rating={newRating} size={28} interactive onChange={setNewRating} />
                  </div>
                  <div>
                    <label className="input-label">Your Review</label>
                    <textarea value={newText} onChange={e => setNewText(e.target.value)}
                      placeholder="Share your experience with the food, delivery, taste..."
                      rows={4} className="input-field resize-none" />
                  </div>
                  <button type="submit"
                    className="btn-primary btn-sm flex items-center gap-2">
                    <Send size={14} /> Submit Review
                  </button>
                </form>
              )}
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink">{filterRating ? `${filterRating}★ Reviews` : 'All Reviews'}</h3>
                <span className="text-sm text-ink-secondary">{filtered.length} reviews</span>
              </div>

              {filtered.map(review => (
                <div key={review.id} className="card p-5 space-y-3 animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={review.avatar} alt={review.name}
                        className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-ink text-sm">{review.name}</p>
                        <p className="text-ink-muted text-xs">{review.date}</p>
                      </div>
                    </div>
                    <RatingBadge rating={review.rating} />
                  </div>
                  <p className="text-ink-secondary text-sm leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-3 text-xs text-ink-muted">
                    <button className="hover:text-primary transition-colors">👍 Helpful</button>
                    <button className="hover:text-primary transition-colors">💬 Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
