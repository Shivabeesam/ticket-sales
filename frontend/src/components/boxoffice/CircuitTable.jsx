import React, { useState } from 'react';
import { MapPin, ArrowUpDown, Search, Building2, Flame, ShieldAlert } from 'lucide-react';

export default function CircuitTable({ circuits }) {
  const [sortField, setSortField] = useState('grossCrores');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');

  if (!circuits || circuits.length === 0) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredCircuits = circuits.filter((c) =>
    c.cityName.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCircuits = [...filteredCircuits].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

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
      {/* Header and Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
            City & Circuit Tracking Breakdown
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time occupancy and revenue rollups across major Indian territory circuits
          </p>
        </div>

        <div className="search-wrap" style={{ maxWidth: '280px' }}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Filter circuit or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ padding: '0.5rem 0.85rem 0.5rem 2.2rem', fontSize: '0.82rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="ticket-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('cityName')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Circuit / City</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('totalShows')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Shows Tracked</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>Sold Out / Fast Filling</th>
              <th onClick={() => handleSort('occupancyPercentage')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Occupancy %</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('grossCrores')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Gross (₹ Cr)</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('averageTicketPrice')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Avg Price (ATP)</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCircuits.map((c) => {
              let occColor = '#10b981';
              if (c.occupancyPercentage >= 80) occColor = '#ef4444';
              else if (c.occupancyPercentage >= 65) occColor = '#f59e0b';

              return (
                <tr key={c.cityName}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(99, 102, 241, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#818cf8'
                        }}
                      >
                        <Building2 size={15} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                          {c.cityName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {c.state}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {c.totalShows.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '0.35rem' }}>
                      shows
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.75rem',
                          color: '#f87171',
                          fontWeight: 700
                        }}
                      >
                        <ShieldAlert size={12} /> {c.soldOutShows}
                      </span>
                      <span style={{ color: 'var(--text-dim)' }}>/</span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.75rem',
                          color: '#fbbf24',
                          fontWeight: 700
                        }}
                      >
                        <Flame size={12} /> {c.fastFillingShows}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: 60,
                          height: 6,
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.1)',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${c.occupancyPercentage}%`,
                            height: '100%',
                            background: occColor,
                            borderRadius: 3
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: occColor }}>
                        {c.occupancyPercentage}%
                      </span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-success)' }}>
                        ₹{c.grossCrores?.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        Cr
                      </span>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      ₹{c.averageTicketPrice?.toFixed(0)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
