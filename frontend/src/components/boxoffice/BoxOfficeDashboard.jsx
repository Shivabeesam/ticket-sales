import React, { useState, useEffect } from 'react';
import { 
  Film, 
  TrendingUp, 
  DollarSign, 
  Flame, 
  Clock, 
  RefreshCw, 
  Zap, 
  Play, 
  Pause, 
  Plus, 
  Code2, 
  Copy, 
  X, 
  Layers, 
  CheckCircle,
  Database,
  Trash2
} from 'lucide-react';
import ShowStatusGauge from './ShowStatusGauge';
import CircuitTable from './CircuitTable';
import HourlyVelocityChart from './HourlyVelocityChart';

export default function BoxOfficeDashboard() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Modals
  const [isNewMovieModalOpen, setIsNewMovieModalOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // New Movie Form State
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieIndustry, setNewMovieIndustry] = useState('Tollywood');
  const [newMovieTrackingDay, setNewMovieTrackingDay] = useState('Day 1 (Advance Booking)');
  const [newMovieLanguages, setNewMovieLanguages] = useState('Telugu, Hindi, Tamil');

  // Ingest Form State
  const [ingestCity, setIngestCity] = useState('');
  const [ingestPlatform, setIngestPlatform] = useState('BookMyShow');
  const [ingestShows, setIngestShows] = useState('');
  const [ingestSeatsBooked, setIngestSeatsBooked] = useState('');
  const [ingestTotalSeats, setIngestTotalSeats] = useState('');
  const [ingestSoldOut, setIngestSoldOut] = useState('');
  const [ingestFastFilling, setIngestFastFilling] = useState('');
  const [ingestGrossInr, setIngestGrossInr] = useState('');

  // Initial load
  useEffect(() => {
    fetchMovies();
  }, []);

  // Fetch report whenever selectedMovieId changes
  useEffect(() => {
    if (selectedMovieId) {
      fetchReport(selectedMovieId);
    } else {
      setReport(null);
      setLoading(false);
    }
  }, [selectedMovieId]);

  // Live Auto-Refresh polling (every 4 seconds)
  useEffect(() => {
    let interval = null;
    if (autoRefresh && selectedMovieId) {
      interval = setInterval(() => {
        fetchReportSilent(selectedMovieId);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, selectedMovieId]);

  const fetchMovies = async () => {
    try {
      const res = await fetch('/api/boxoffice/movies');
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
        if (data.length > 0 && !selectedMovieId) {
          setSelectedMovieId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (movieId) => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/boxoffice/movies/${movieId}/report`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to load box office report:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchReportSilent = async (movieId) => {
    try {
      const res = await fetch(`/api/boxoffice/movies/${movieId}/report`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      // silent background tick
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    if (!newMovieTitle.trim()) return;

    try {
      const res = await fetch('/api/boxoffice/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newMovieTitle.trim(),
          primaryIndustry: newMovieIndustry,
          trackingDay: newMovieTrackingDay,
          languages: newMovieLanguages.split(',').map((s) => s.trim()),
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setIsNewMovieModalOpen(false);
        setNewMovieTitle('');
        await fetchMovies();
        setSelectedMovieId(created.id);
      }
    } catch (err) {
      console.error('Failed to create movie:', err);
    }
  };

  const handleIngestBatch = async (e) => {
    e.preventDefault();
    if (!selectedMovieId) return;

    try {
      const res = await fetch('/api/boxoffice/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: selectedMovieId,
          city: ingestCity,
          platform: ingestPlatform,
          additionalShows: parseInt(ingestShows) || 1,
          totalSeatsInBatch: parseInt(ingestTotalSeats) || 180,
          additionalSeatsBooked: parseInt(ingestSeatsBooked) || 0,
          soldOutShows: parseInt(ingestSoldOut) || 0,
          fastFillingShows: parseInt(ingestFastFilling) || 0,
          additionalGrossInr: parseFloat(ingestGrossInr) || 0,
        }),
      });

      if (res.ok) {
        setIsIngestModalOpen(false);
        await fetchReport(selectedMovieId);
      }
    } catch (err) {
      console.error('Failed to ingest batch:', err);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Remove this movie from tracking?')) return;
    try {
      const res = await fetch(`/api/boxoffice/movies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedMovieId(null);
        await fetchMovies();
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  const liveBookmarkletCode = `(async function extractAndSync() {
  const seats = document.querySelectorAll('._available, ._blocked, ._sold, [data-seat-status]');
  const booked = document.querySelectorAll('._blocked, ._sold, [data-seat-status="booked"]').length;
  const total = seats.length || 180;
  
  await fetch('http://localhost:8080/api/boxoffice/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      movieId: '${selectedMovieId || "mov-sample"}',
      city: 'Live Browser Tab',
      platform: 'BookMyShow',
      additionalShows: 1,
      totalSeatsInBatch: total,
      additionalSeatsBooked: booked,
      soldOutShows: (booked / total >= 0.95) ? 1 : 0,
      fastFillingShows: (booked / total >= 0.60 && booked / total < 0.95) ? 1 : 0,
      additionalGrossInr: booked * 350
    })
  });
  alert('Successfully synced live show data to your BoxOfficePulse dashboard!');
})();`;

  const copyScript = () => {
    navigator.clipboard.writeText(liveBookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMovie = movies.find((m) => m.id === selectedMovieId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. MOVIE SELECTOR BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
              Tracked Films ({movies.length})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {/* Add Movie Button */}
            <button
              onClick={() => setIsNewMovieModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={14} />
              <span>Track New Movie</span>
            </button>

            {/* Ingest Show Batch Button */}
            <button
              disabled={!selectedMovieId}
              onClick={() => setIsIngestModalOpen(true)}
              className="btn btn-primary"
              style={{ 
                padding: '0.45rem 0.85rem', 
                fontSize: '0.78rem', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                opacity: selectedMovieId ? 1 : 0.5 
              }}
            >
              <Database size={14} />
              <span>+ Ingest Show Data</span>
            </button>

            {/* Live Scraper Bridge Button */}
            <button
              onClick={() => setIsScriptModalOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Code2 size={14} style={{ color: '#818cf8' }} />
              <span>Live Scraper Bridge</span>
            </button>

            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: autoRefresh ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                background: autoRefresh ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                color: autoRefresh ? 'var(--accent-success)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {autoRefresh ? <Play size={13} fill="currentColor" /> : <Pause size={13} />}
              <span>{autoRefresh ? 'Live Ticker ON' : 'Paused'}</span>
            </button>
          </div>
        </div>

        {/* Movie Cards Carousel or Empty State */}
        {movies.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.85rem'
            }}
          >
            <Film size={36} color="var(--text-dim)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              No Movies in Tracking Database
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px' }}>
              All static and hardcoded data has been removed. Add a movie to start live tracking its shows and box office.
            </p>
            <button
              onClick={() => setIsNewMovieModalOpen(true)}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              <span>Track Your First Movie</span>
            </button>
          </div>
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              paddingBottom: '0.75rem' 
            }}
          >
            {movies.map((m) => {
              const isSelected = m.id === selectedMovieId;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMovieId(m.id)}
                  style={{
                    minWidth: '260px',
                    background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'var(--bg-card)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                    position: 'relative'
                  }}
                >
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    style={{
                      width: '50px',
                      height: '68px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#fff' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isSelected ? '#a5b4fc' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {m.trackingDay}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.4rem' }}>
                      <span 
                        style={{ 
                          fontSize: '0.65rem', 
                          padding: '0.15rem 0.45rem', 
                          borderRadius: 'var(--radius-sm)', 
                          background: isSelected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          fontWeight: 600
                        }}
                      >
                        {m.primaryIndustry}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMovie(m.id);
                    }}
                    title="Remove movie"
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading live data...</p>
        </div>
      ) : report ? (
        <>
          {/* ───────────────────────────────────────────────────────────── */}
          {/* 2. MASTER KPI HERO CARDS */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* Gross Box Office */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(22, 30, 46, 0.8) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px -6px rgba(16, 185, 129, 0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Gross Collection
                </span>
                <DollarSign size={20} color="var(--accent-success)" />
              </div>

              <div style={{ margin: '0.85rem 0' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  ₹{report.totalGrossCrores?.toFixed(2)} <span style={{ fontSize: '1.2rem', color: 'var(--accent-success)' }}>Cr</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  ₹{(report.totalGrossInr / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Lakhs Realized
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--accent-success)', fontWeight: 600 }}>
                • As of {report.asOfTime}
              </div>
            </div>

            {/* Total Shows Tracked */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Shows Tracked
                </span>
                <Layers size={20} color="var(--accent-primary)" />
              </div>

              <div style={{ margin: '0.85rem 0' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {report.totalShows?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Across {report.circuits?.length || 0} Territory Circuits
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 600 }}>
                {report.totalShows > 0 ? 'Live Ingested Feed' : 'Awaiting First Show Batch'}
              </div>
            </div>

            {/* Tickets Sold & Occupancy */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tickets Booked (Occupancy)
                </span>
                <Flame size={20} color="#f59e0b" />
              </div>

              <div style={{ margin: '0.85rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {report.overallOccupancyPct}%
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>Occupancy</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  <strong>{report.bookedSeats.toLocaleString()}</strong> of {report.totalSeats.toLocaleString()} Seats
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#fde68a', fontWeight: 600 }}>
                Avg Ticket Price: ₹{report.averageTicketPrice?.toFixed(0)}
              </div>
            </div>

            {/* 1-Hour Velocity */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(22, 30, 46, 0.8) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Booking Velocity
                </span>
                <Zap size={20} color="#ef4444" />
              </div>

              <div style={{ margin: '0.85rem 0' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {report.ticketsBookedLastHour?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: '0.35rem' }}>
                  Active Speed Rate
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700 }}>
                ~{Math.round(report.ticketsBookedLastHour / 60)} tickets/min
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 3. SHOW STATUS GAUGE */}
          {/* ───────────────────────────────────────────────────────────── */}
          {report.totalShows > 0 ? (
            <ShowStatusGauge
              statusBreakdown={report.statusBreakdown}
              totalShows={report.totalShows}
            />
          ) : (
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No shows ingested yet for <strong>{report.movieTitle}</strong>. Click <strong>"+ Ingest Show Data"</strong> above or run the Live Scraper to push live show metrics.
              </p>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 4. PLATFORM SHARES */}
          {/* ───────────────────────────────────────────────────────────── */}
          {report.platformShares && report.platformShares.length > 0 && (
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Platform & Ticketing Channel Share
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {report.platformShares.map((p) => (
                  <div
                    key={p.platformName}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{p.platformName}</span>
                      </div>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: p.color }}>
                        {p.marketSharePercentage}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Tracked Shows: <strong>{p.trackedShows.toLocaleString()}</strong></span>
                      <span>Gross: <strong style={{ color: 'var(--accent-success)' }}>₹{p.grossCrores.toFixed(2)} Cr</strong></span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {p.bookedTickets.toLocaleString()} Tickets Sold
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 5. CIRCUIT BREAKDOWN TABLE */}
          {/* ───────────────────────────────────────────────────────────── */}
          {report.circuits && report.circuits.length > 0 && (
            <CircuitTable circuits={report.circuits} />
          )}
        </>
      ) : null}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: TRACK NEW MOVIE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isNewMovieModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNewMovieModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Track Any New Movie</h3>
              <button className="btn-close" onClick={() => setIsNewMovieModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMovie} className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Movie Title</label>
                <input
                  type="text"
                  placeholder="e.g., Devara: Part 1, Tumbbad, GOAT, Joker 2..."
                  value={newMovieTitle}
                  onChange={(e) => setNewMovieTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Primary Industry</label>
                <select value={newMovieIndustry} onChange={(e) => setNewMovieIndustry(e.target.value)}>
                  <option value="Tollywood / Pan-India">Tollywood / Pan-India</option>
                  <option value="Bollywood">Bollywood</option>
                  <option value="Kollywood">Kollywood</option>
                  <option value="Mollywood">Mollywood</option>
                  <option value="Hollywood">Hollywood</option>
                  <option value="Sandalwood">Sandalwood</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tracking Phase</label>
                <input
                  type="text"
                  placeholder="e.g., Day 1 Advance Booking, Day 1 Live, Weekend 1"
                  value={newMovieTrackingDay}
                  onChange={(e) => setNewMovieTrackingDay(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Languages (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Telugu, Hindi, Tamil, Kannada"
                  value={newMovieLanguages}
                  onChange={(e) => setNewMovieLanguages(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewMovieModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Start Tracking Film
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: INGEST LIVE SHOW BATCH */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isIngestModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsIngestModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ingest Live Show Batch for {currentMovie?.title}</h3>
              <button className="btn-close" onClick={() => setIsIngestModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIngestBatch} className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group">
                  <label>City / Circuit</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad (Nizam), Mumbai, Bengaluru"
                    value={ingestCity}
                    onChange={(e) => setIngestCity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Platform</label>
                  <select value={ingestPlatform} onChange={(e) => setIngestPlatform(e.target.value)}>
                    <option value="BookMyShow">BookMyShow</option>
                    <option value="District">District (by Zomato)</option>
                    <option value="PVR INOX Direct">PVR INOX Direct</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group">
                  <label>Shows Count</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 15"
                    value={ingestShows}
                    onChange={(e) => setIngestShows(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Booked Seats</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2400"
                    value={ingestSeatsBooked}
                    onChange={(e) => setIngestSeatsBooked(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Seats</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3000"
                    value={ingestTotalSeats}
                    onChange={(e) => setIngestTotalSeats(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group">
                  <label>Housefull (Sold Out) Shows</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={ingestSoldOut}
                    onChange={(e) => setIngestSoldOut(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Fast Filling Shows</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={ingestFastFilling}
                    onChange={(e) => setIngestFastFilling(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Gross Amount (in ₹ INR)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 840000"
                  value={ingestGrossInr}
                  onChange={(e) => setIngestGrossInr(e.target.value)}
                  required
                />
                {ingestGrossInr ? (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    ₹{(Number(ingestGrossInr) / 100000).toFixed(2)} Lakhs (₹{(Number(ingestGrossInr) / 10000000).toFixed(3)} Cr)
                  </span>
                ) : null}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsIngestModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--accent-success)' }}>
                  Ingest & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: LIVE SCRAPER BRIDGE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isScriptModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsScriptModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Code2 size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Live Browser Scraper Bridge (BMS & District)
                </h3>
              </div>
              <button className="btn-close" onClick={() => setIsScriptModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Run this 1-line script inside your browser's DevTools console on any active BookMyShow or District theatre page to extract the real-time seat numbers and status:
              </p>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    JavaScript Console Snippet for {currentMovie?.title || 'Selected Movie'}
                  </span>
                  <button
                    onClick={copyScript}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Copy size={13} />
                    <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>

                <pre
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    color: '#a5b4fc',
                    fontSize: '0.75rem',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                  }}
                >
                  {liveBookmarkletCode}
                </pre>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>How it works:</strong>
                <ol style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Open BookMyShow or District in another browser tab and click on any theatre showtime.</li>
                  <li>Press <kbd style={{ background: '#334155', padding: '1px 5px', borderRadius: 3 }}>F12</kbd> &gt; open <strong>Console</strong>.</li>
                  <li>Paste the script above and hit <kbd style={{ background: '#334155', padding: '1px 5px', borderRadius: 3 }}>Enter</kbd>. It pushes the live seat counts directly to your dashboard.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
