import React from 'react';
import { Star, Clock, Sparkles, ChevronRight, Tag } from 'lucide-react';

export default function MovieCard({ movie, onSelect }) {
  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div 
      className="movie-card"
      onClick={() => onSelect(movie)}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative'
      }}
    >
      {/* Poster Media Box */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '135%', overflow: 'hidden' }}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="movie-poster-img"
        />

        {/* Gradient Overlay for bottom text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10, 13, 20, 0.95) 0%, rgba(10, 13, 20, 0.2) 60%, transparent 100%)'
          }}
        />

        {/* Formats Floating Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'flex-end' }}>
          {movie.formats?.slice(0, 2).map((fmt) => (
            <span
              key={fmt}
              style={{
                background: 'rgba(10, 13, 20, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {fmt}
            </span>
          ))}
        </div>

        {/* Rating Floating Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(16, 22, 34, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '0.25rem 0.55rem',
            borderRadius: 'var(--radius-full)'
          }}
        >
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#f8fafc' }}>
            {movie.rating}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            ({(movie.votesCount / 1000).toFixed(0)}k)
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4 
            style={{ 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              color: 'var(--text-main)', 
              marginBottom: '0.4rem',
              lineHeight: 1.3
            }}
          >
            {movie.title}
          </h4>

          {/* Genres & Runtime */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} /> {formatDuration(movie.durationMins)}
            </span>
            <span>•</span>
            <span>{movie.genres?.join(', ')}</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.85rem' }}>
            {movie.synopsis}
          </p>
        </div>

        {/* Price Comparison & CTA footer */}
        <div>
          {/* Price Bar */}
          <div
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={13} style={{ color: 'var(--accent-success)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Best Price</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>from</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-success)' }}>
                ₹{movie.lowestPrice?.toFixed(0)}
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.65rem', fontSize: '0.82rem', justifyContent: 'center' }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
          >
            <span>View Showtimes</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
