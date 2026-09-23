import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  Filter, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  Info,
  ChevronRight
} from 'lucide-react';

export default function ShowtimeExplorer({ 
  movie, 
  city, 
  onBack, 
  onSelectShowtime 
}) {
  const [selectedDate, setSelectedDate] = useState('2026-09-24');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [data, setData] = useState({ theaters: [], totalShowtimes: 0 });
  const [loading, setLoading] = useState(true);

  // Dates for the ribbon carousel
  const dates = [
    { label: 'Today', day: 'Wed', dateNum: '24', full: '2026-09-24' },
    { label: 'Tomorrow', day: 'Thu', dateNum: '25', full: '2026-09-25' },
    { label: 'Fri', day: 'Fri', dateNum: '26', full: '2026-09-26' },
    { label: 'Sat', day: 'Sat', dateNum: '27', full: '2026-09-27' },
    { label: 'Sun', day: 'Sun', dateNum: '28', full: '2026-09-28' },
  ];

  useEffect(() => {
    fetchShowtimes();
  }, [movie.id, city?.slug, selectedDate]);

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const citySlug = city?.slug || 'mumbai';
      const res = await fetch(`/api/aggregator/movies/${movie.id}/showtimes?city=${citySlug}&date=${selectedDate}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load showtimes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter shows by format & language
  const filteredTheaters = data.theaters
    .map((thNode) => {
      const matchingShows = thNode.shows.filter((show) => {
        const matchesFmt = selectedFormat === 'ALL' || show.format.toLowerCase() === selectedFormat.toLowerCase();
        const matchesLang = selectedLanguage === 'ALL' || show.language.toLowerCase() === selectedLanguage.toLowerCase();
        return matchesFmt && matchesLang;
      });
      return { ...thNode, shows: matchingShows };
    })
    .filter((thNode) => thNode.shows.length > 0);

  return (
    <div className="showtime-explorer" style={{ paddingBottom: '3rem' }}>
      {/* Back button & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Movies</span>
        </button>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>/</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{city?.name}</span>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>/</span>
        <span style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>{movie.title}</span>
      </div>

      {/* Hero Movie Banner */}
      <div 
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--bg-card) 5%, rgba(10, 13, 20, 0.4) 60%, transparent 100%)'
            }}
          />
        </div>

        <div 
          style={{ 
            padding: '1.25rem 1.75rem', 
            marginTop: '-70px', 
            position: 'relative', 
            display: 'flex', 
            gap: '1.5rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
          }}
        >
          {/* Small Floating Poster */}
          <div 
            style={{ 
              width: '110px', 
              height: '150px', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden', 
              border: '2px solid rgba(255, 255, 255, 0.15)',
              boxShadow: 'var(--shadow-card)',
              flexShrink: 0
            }}
          >
            <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                {movie.title}
              </h2>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.35rem', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: 'var(--radius-full)', 
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <Star size={14} fill="#fbbf24" />
                <span>{movie.rating}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({(movie.votesCount / 1000).toFixed(0)}k reviews)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {movie.durationMins} mins</span>
              <span>•</span>
              <span>{movie.genres?.join(', ')}</span>
              <span>•</span>
              <span>Languages: {movie.languages?.join(', ')}</span>
            </div>

            {/* Formats badges */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {movie.formats?.map((fmt) => (
                <span key={fmt} className="badge badge-general" style={{ fontSize: '0.72rem' }}>
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Date Strip Ribbon Carousel */}
      <div 
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {dates.map((d) => {
          const isSelected = selectedDate === d.full;
          return (
            <button
              key={d.full}
              onClick={() => setSelectedDate(d.full)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.65rem 1.25rem',
                minWidth: '85px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isSelected ? '#fff' : 'var(--text-main)', margin: '0.15rem 0' }}>
                {d.dateNum}
              </span>
              <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                {d.day}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Tabs (Format & Language) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Format Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Format:</span>
          {['ALL', 'IMAX 2D', '4DX', '2D', '3D'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: selectedFormat === fmt ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: selectedFormat === fmt ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                color: selectedFormat === fmt ? '#a5b4fc' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-success)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-warning)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Filling Fast</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-danger)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Almost Full</span>
          </div>
        </div>
      </div>

      {/* Cross-Platform Comparison Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles size={20} style={{ color: '#c084fc' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              Live Price Comparison Active
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Comparing seat tier prices and convenience fees between <strong style={{ color: '#ef4444' }}>BookMyShow</strong> and <strong style={{ color: '#a855f7' }}>District (Zomato)</strong>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            BookMyShow: BOGO Card Offers
          </span>
          <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            District: Lower Convenience Fee (₹28)
          </span>
        </div>
      </div>

      {/* Theaters List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fetching live theater schedules...</p>
        </div>
      ) : filteredTheaters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <Clock size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No showtimes found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Try selecting a different date or clearing the format filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredTheaters.map((thNode) => {
            const { theater, shows } = thNode;
            return (
              <div
                key={theater.id}
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
                {/* Theater Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="badge badge-vip" style={{ fontSize: '0.68rem' }}>
                        {theater.chainName}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {theater.name}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      <MapPin size={13} style={{ color: 'var(--accent-primary)' }} />
                      <span>{theater.address}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--accent-success)' }}>{theater.distanceKm} km away</span>
                    </div>
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {shows.map((show) => {
                    const bmsOffering = show.platformOfferings?.find((p) => p.platform === 'BookMyShow');
                    const distOffering = show.platformOfferings?.find((p) => p.platform === 'District');
                    const lowestPrice = Math.min(
                      bmsOffering?.lowestPrice || 9999,
                      distOffering?.lowestPrice || 9999
                    );

                    let statusBorder = 'var(--border-subtle)';
                    let statusColor = 'var(--accent-success)';
                    if (show.status === 'FAST_FILLING') statusColor = 'var(--accent-warning)';
                    if (show.status === 'ALMOST_FULL') statusColor = 'var(--accent-danger)';

                    return (
                      <div
                        key={show.id}
                        onClick={() => onSelectShowtime(show)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        className="showtime-card"
                      >
                        {/* Top: Start Time & Format */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                                {show.startTime}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {show.language}
                              </span>
                            </div>

                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.45rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#e2e8f0'
                              }}
                            >
                              {show.format}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                            {show.screenName}
                          </div>
                        </div>

                        {/* Middle: Platform Comparison Mini-Bar */}
                        <div 
                          style={{ 
                            padding: '0.5rem 0.65rem', 
                            borderRadius: 'var(--radius-sm)', 
                            background: 'rgba(0, 0, 0, 0.25)', 
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.25rem' }}>
                            <span style={{ color: '#f87171', fontWeight: 600 }}>BookMyShow</span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>₹{bmsOffering?.lowestPrice?.toFixed(0)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                            <span style={{ color: '#c084fc', fontWeight: 600 }}>District</span>
                            <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>₹{distOffering?.lowestPrice?.toFixed(0)}</span>
                          </div>
                        </div>

                        {/* Bottom: Status & Action CTA */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.35rem', 
                              fontSize: '0.72rem', 
                              fontWeight: 600,
                              color: statusColor
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                            {show.status.replace('_', ' ')}
                          </span>

                          <button 
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectShowtime(show);
                            }}
                          >
                            <span>Select Seats</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
