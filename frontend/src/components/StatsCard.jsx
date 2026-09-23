import React from 'react';

export default function StatsCard({ label, value, icon: Icon, accentColor }) {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon" style={{ color: accentColor || 'var(--accent-primary)' }}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}
