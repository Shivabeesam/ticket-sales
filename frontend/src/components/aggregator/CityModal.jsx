import React, { useState } from 'react';
import { MapPin, Search, X, Check, Building2 } from 'lucide-react';

export default function CityModal({ isOpen, onClose, cities, selectedCity, onSelectCity }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '580px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3>Select Your City</h3>
              <p>Showtimes and theater prices will update for your region</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem 1.5rem' }}>
          {/* Search Bar */}
          <div className="search-wrap" style={{ width: '100%', marginBottom: '1.25rem' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by city or state (e.g., Mumbai, Delhi, Bengaluru)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>

          {/* Popular Cities */}
          {!search && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                Major Metropolitan Hubs
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                {cities
                  .filter((c) => c.popular)
                  .map((city) => {
                    const isSelected = selectedCity?.slug === city.slug;
                    return (
                      <button
                        key={city.id}
                        onClick={() => {
                          onSelectCity(city);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          color: isSelected ? '#a5b4fc' : 'var(--text-main)',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Building2 size={16} style={{ color: isSelected ? '#a5b4fc' : 'var(--text-muted)' }} />
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {city.name}
                        </span>
                        {isSelected && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* All Filtered Cities */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', margin: '1rem 0 0.5rem 0' }}>
              All Cities ({filteredCities.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredCities.map((city) => {
                const isSelected = selectedCity?.slug === city.slug;
                return (
                  <div
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      cursor: 'pointer',
                      border: '1px solid transparent',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#a5b4fc' : 'var(--text-main)' }}>
                        {city.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {city.state}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="badge badge-available" style={{ fontSize: '0.7rem' }}>
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
              {filteredCities.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No cities found matching "{search}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
