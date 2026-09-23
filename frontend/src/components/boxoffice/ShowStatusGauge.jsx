import React from 'react';
import { AlertCircle, Flame, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ShowStatusGauge({ statusBreakdown, totalShows }) {
  if (!statusBreakdown) return null;

  const {
    soldOutShows,
    soldOutPercentage,
    fastFillingShows,
    fastFillingPercentage,
    availableShows,
    availablePercentage
  } = statusBreakdown;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
            All-India Show Status Distribution
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time tracking across {totalShows?.toLocaleString()} scheduled screenings
          </p>
        </div>
      </div>

      {/* Segmented Multi-Color Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '24px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {/* Sold Out */}
        <div
          title={`Sold Out: ${soldOutShows} (${soldOutPercentage}%)`}
          style={{
            width: `${soldOutPercentage}%`,
            background: 'linear-gradient(90deg, #ef4444, #dc2626)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
          }}
        />

        {/* Fast Filling */}
        <div
          title={`Fast Filling: ${fastFillingShows} (${fastFillingPercentage}%)`}
          style={{
            width: `${fastFillingPercentage}%`,
            background: 'linear-gradient(90deg, #f59e0b, #d97706)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
          }}
        />

        {/* Available */}
        <div
          title={`Available: ${availableShows} (${availablePercentage}%)`}
          style={{
            width: `${availablePercentage}%`,
            background: 'linear-gradient(90deg, #10b981, #059669)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
          }}
        />
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* Sold Out Card */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' }}>
              Sold Out (Housefull)
            </span>
            <ShieldAlert size={16} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
            {soldOutShows?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
            <strong>{soldOutPercentage}%</strong> of total shows
          </div>
        </div>

        {/* Fast Filling Card */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
              Fast Filling (&gt;60%)
            </span>
            <Flame size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
            {fastFillingShows?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fde68a' }}>
            <strong>{fastFillingPercentage}%</strong> of total shows
          </div>
        </div>

        {/* Available Card */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
              Available Shows
            </span>
            <CheckCircle size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
            {availableShows?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>
            <strong>{availablePercentage}%</strong> of total shows
          </div>
        </div>
      </div>
    </div>
  );
}
