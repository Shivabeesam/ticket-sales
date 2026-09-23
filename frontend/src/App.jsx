import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import BoxOfficeDashboard from './components/boxoffice/BoxOfficeDashboard';

export default function App() {
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      setServerOnline(res.ok);
    } catch {
      setServerOnline(false);
    }
  };

  return (
    <div className="app-container">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP NAVBAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="header" style={{ paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <TrendingUp size={24} color="#fff" />
          </div>
          <div className="title-wrap">
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              BoxOfficePulse India
            </h1>
            <p style={{ fontSize: '0.78rem' }}>
              Real-Time Advance Booking, All-India Showtimes, Tickets Booked & Gross Collections
            </p>
          </div>
        </div>

        {/* Live Engine Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.78rem',
              color: serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: serverOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: serverOnline ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)',
                boxShadow: serverOnline ? '0 0 8px #10b981' : 'none'
              }}
            />
            <span style={{ fontWeight: 700 }}>
              {serverOnline ? 'Live Tracking Engine Connected' : 'Connecting to Backend...'}
            </span>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* REAL-TIME BOX OFFICE TRACKING DASHBOARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main>
        <BoxOfficeDashboard />
      </main>
    </div>
  );
}
