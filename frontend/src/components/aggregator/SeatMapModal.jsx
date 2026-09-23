import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Tag, 
  AlertCircle 
} from 'lucide-react';

export default function SeatMapModal({ isOpen, onClose, showtime }) {
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [preferredPlatform, setPreferredPlatform] = useState('District');
  const [lockStatus, setLockStatus] = useState(null); // null | 'LOCKED' | 'FAILED'
  const [lockData, setLockData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes hold in seconds

  useEffect(() => {
    if (isOpen && showtime?.id) {
      fetchSeatLayout();
      setSelectedSeats([]);
      setLockStatus(null);
      setLockData(null);
      setTimeLeft(600);
    }
  }, [isOpen, showtime?.id]);

  // Countdown timer for held seats
  useEffect(() => {
    if (lockStatus === 'LOCKED' && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockStatus, timeLeft]);

  const fetchSeatLayout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/aggregator/showtimes/${showtime.id}/seats`);
      if (res.ok) {
        const json = await res.json();
        setLayout(json);
      }
    } catch (err) {
      console.error('Failed to load seat layout:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.status !== 'AVAILABLE') return;

    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleLockSeats = async (platformName) => {
    if (selectedSeats.length === 0) return;

    try {
      const res = await fetch(`/api/aggregator/showtimes/${showtime.id}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtimeId: showtime.id,
          seatIds: selectedSeats.map((s) => s.id),
          platform: platformName,
          userEmail: 'guest@example.com',
          userPhone: '+919876543210'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setLockData(data);
        setLockStatus('LOCKED');
      } else {
        alert('Some of the selected seats were just taken. Refreshing layout...');
        fetchSeatLayout();
      }
    } catch (err) {
      console.error('Failed to lock seats:', err);
    }
  };

  if (!isOpen) return null;

  const basePrice = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const bmsFee = 35.40 * selectedSeats.length;
  const distFee = 28.00 * selectedSeats.length;
  const bmsTotal = basePrice + bmsFee;
  const distTotal = basePrice + distFee;

  const bmsOffering = showtime?.platformOfferings?.find((p) => p.platform === 'BookMyShow');
  const distOffering = showtime?.platformOfferings?.find((p) => p.platform === 'District');

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '920px', 
          width: '95vw',
          maxHeight: '94vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              {showtime?.format}
            </span>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                {showtime?.movieTitle}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {showtime?.theaterName} • {showtime?.screenName} • {showtime?.startTime}
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Legend Ribbon */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.75rem',
            flexWrap: 'wrap',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-subtle)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--accent-success)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>✓</div>
            <span style={{ color: '#fff', fontWeight: 600 }}>Selected ({selectedSeats.length})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', opacity: 0.4 }} />
            <span style={{ color: 'var(--text-dim)' }}>Sold Out</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)' }} />
            <span style={{ color: '#fbbf24' }}>Locked / In Cart</span>
          </div>
        </div>

        {/* Seating Grid Viewport */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Constructing theater seat matrix...</p>
            </div>
          ) : layout ? (
            <div style={{ width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Curved Cinema Screen */}
              <div style={{ width: '85%', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    borderRadius: '50% 50% 0 0',
                    background: 'linear-gradient(90deg, transparent 0%, #38bdf8 50%, transparent 100%)',
                    boxShadow: '0 -4px 18px rgba(56, 189, 248, 0.7)'
                  }}
                />
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)', marginTop: '0.65rem' }}>
                  All Eyes This Way • Cinema Screen
                </span>
              </div>

              {/* Rows */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {layout.rows?.map((row) => {
                  const seatsInRow = layout.grid[row] || [];
                  const sampleSeat = seatsInRow[0];
                  let tierColor = '#94a3b8';
                  let tierName = 'Classic';
                  if (sampleSeat?.tier === 'RECLINER') {
                    tierColor = '#fbbf24';
                    tierName = 'Recliner';
                  } else if (sampleSeat?.tier === 'PRIME') {
                    tierColor = '#818cf8';
                    tierName = 'Prime';
                  }

                  return (
                    <div key={row} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: tierColor, fontWeight: 600, padding: '0 0.5rem' }}>
                        <span>Row {row} • {tierName}</span>
                        <span>₹{sampleSeat?.price?.toFixed(0)}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textAlign: 'center' }}>
                          {row}
                        </span>

                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'nowrap' }}>
                          {seatsInRow.map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            const isSold = seat.status === 'SOLD';
                            const isReserved = seat.status === 'RESERVED';

                            let bg = 'rgba(255, 255, 255, 0.06)';
                            let border = '1px solid var(--border-subtle)';
                            let color = 'var(--text-main)';
                            let cursor = 'pointer';

                            if (isSold) {
                              bg = 'rgba(255, 255, 255, 0.02)';
                              border = '1px solid rgba(255, 255, 255, 0.04)';
                              color = 'rgba(255, 255, 255, 0.15)';
                              cursor = 'not-allowed';
                            } else if (isReserved) {
                              bg = 'rgba(245, 158, 11, 0.2)';
                              border = '1px solid rgba(245, 158, 11, 0.4)';
                              color = '#fbbf24';
                              cursor = 'not-allowed';
                            } else if (isSelected) {
                              bg = 'var(--accent-success)';
                              border = '1px solid var(--accent-success)';
                              color = '#000';
                            }

                            return (
                              <button
                                key={seat.id}
                                disabled={isSold || isReserved}
                                onClick={() => toggleSeat(seat)}
                                title={`${seat.id} - ${seat.tier} (₹${seat.price})`}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: bg,
                                  border: border,
                                  color: color,
                                  cursor: cursor,
                                  fontSize: '0.75rem',
                                  fontWeight: isSelected ? 800 : 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                                  boxShadow: isSelected ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
                                }}
                              >
                                {isSelected ? '✓' : seat.col}
                              </button>
                            );
                          })}
                        </div>

                        <span style={{ width: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textAlign: 'center' }}>
                          {row}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Lock Hold Notification Banner */}
        {lockStatus === 'LOCKED' && lockData && (
          <div
            style={{
              padding: '0.85rem 1.5rem',
              background: 'rgba(16, 185, 129, 0.15)',
              borderTop: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-success)' }} />
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                  Seats Temporarily Reserved! ({lockData.lockId})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  Held for your booking on {lockData.platform}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
                <Clock size={15} />
                <span>Expires in: {formatTimer(timeLeft)}</span>
              </div>

              <a
                href={lockData.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', background: 'var(--accent-success)' }}
              >
                <span>Proceed to {lockData.platform}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Bottom Booking Summary Tray */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Selected Seats:{' '}
              <strong style={{ color: '#fff' }}>
                {selectedSeats.map((s) => s.id).join(', ') || 'None'}
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ₹{basePrice.toFixed(0)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                + convenience fee on platform
              </span>
            </div>
          </div>

          {/* Platform Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Book via BookMyShow */}
            <button
              disabled={selectedSeats.length === 0}
              onClick={() => handleLockSeats('BookMyShow')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#fff',
                border: 'none',
                cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
                opacity: selectedSeats.length === 0 ? 0.4 : 1,
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800 }}>
                <span>Book on BookMyShow</span>
                <ExternalLink size={13} />
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                Total: ₹{bmsTotal.toFixed(0)} (fee ₹{bmsFee.toFixed(0)})
              </div>
            </button>

            {/* Book via District */}
            <button
              disabled={selectedSeats.length === 0}
              onClick={() => handleLockSeats('District')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                color: '#fff',
                border: 'none',
                cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
                opacity: selectedSeats.length === 0 ? 0.4 : 1,
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800 }}>
                <span>Book on District</span>
                <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: 4, background: 'rgba(255, 255, 255, 0.25)' }}>
                  Save ₹{(bmsTotal - distTotal).toFixed(0)}
                </span>
                <ExternalLink size={13} />
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                Total: ₹{distTotal.toFixed(0)} (fee ₹{distFee.toFixed(0)})
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
