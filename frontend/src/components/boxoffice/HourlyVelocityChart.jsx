import React from 'react';
import { TrendingUp, Clock, Zap } from 'lucide-react';

export default function HourlyVelocityChart({ hourlyTrends, lastHourVelocity }) {
  if (!hourlyTrends || hourlyTrends.length === 0) return null;

  const maxTickets = Math.max(...hourlyTrends.map((h) => h.ticketsBooked));

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Booking Velocity & Hourly Surge
            </h3>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Zap size={11} fill="#ef4444" />
              <span>LIVE PULSE</span>
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time tickets booked per hour across India
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
            {lastHourVelocity?.toLocaleString()} <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>tickets/hr</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Peak Velocity Rate
          </div>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${hourlyTrends.length}, 1fr)`,
          gap: '0.85rem',
          alignItems: 'flex-end',
          height: '140px',
          paddingTop: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem'
        }}
      >
        {hourlyTrends.map((point) => {
          const heightPct = Math.round((point.ticketsBooked / maxTickets) * 100);
          return (
            <div
              key={point.timeLabel}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                {(point.ticketsBooked / 1000).toFixed(1)}k
              </span>

              <div
                title={`${point.timeLabel}: ${point.ticketsBooked.toLocaleString()} tickets`}
                style={{
                  width: '100%',
                  maxWidth: '48px',
                  height: `${Math.max(heightPct, 15)}%`,
                  borderRadius: '6px 6px 0 0',
                  background: 'linear-gradient(180deg, #6366f1 0%, #4338ca 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  transition: 'height 0.4s ease'
                }}
              />

              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {point.timeLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={13} /> Showing past 6 hours of tracking data
        </span>
        <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>
          Trending: Rapid All-India Evening Surge
        </span>
      </div>
    </div>
  );
}
