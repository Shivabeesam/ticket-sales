import React, { useState, useEffect } from 'react';
import { 
  Ticket as TicketIcon, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  RefreshCw,
  ShoppingBag,
  User,
  Sparkles
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import TicketModal from './components/TicketModal';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, reserved: 0, sold: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Fetch backend data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, ticketsRes, statsRes] = await Promise.allSettled([
        fetch('/api/health'),
        fetch('/api/tickets'),
        fetch('/api/tickets/stats'),
      ]);

      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }

      if (ticketsRes.status === 'fulfilled' && ticketsRes.value.ok) {
        const ticketsData = await ticketsRes.value.json();
        setTickets(ticketsData);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const statsData = await statsRes.value.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to communicate with API:', err);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTicket = async (ticketData) => {
    try {
      if (ticketData.id) {
        // Update
        const res = await fetch(`/api/tickets/${ticketData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketData),
        });
        if (res.ok) {
          fetchData();
          setIsModalOpen(false);
        }
      } else {
        // Create
        const res = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketData),
        });
        if (res.ok) {
          fetchData();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Error saving ticket:', err);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to remove this ticket listing?')) return;
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting ticket:', err);
    }
  };

  const handleQuickStatus = async (ticket, nextStatus, buyer = null) => {
    try {
      const payload = { ...ticket, status: nextStatus };
      if (buyer) payload.buyerName = buyer;
      if (nextStatus === 'AVAILABLE') payload.buyerName = null;

      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.eventName.toLowerCase().includes(search.toLowerCase()) ||
      (t.buyerName && t.buyerName.toLowerCase().includes(search.toLowerCase())) ||
      (t.seatNumber && t.seatNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesType = filterType === 'ALL' || t.ticketType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <TicketIcon color="#fff" size={24} />
          </div>
          <div className="title-wrap">
            <h1>Ticket Sales Hub</h1>
            <p>Live Event Inventory & Booking System</p>
          </div>
        </div>

        <div className="header-status">
          <span 
            className="badge-server"
            style={{
              color: serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)',
              background: serverOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              borderColor: serverOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <span 
              className="badge-dot" 
              style={{
                backgroundColor: serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)',
                boxShadow: `0 0 8px ${serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
              }}
            />
            {serverOnline ? 'Spring Boot API Online (:8080)' : 'API Offline / Reconnecting...'}
          </span>
          <button className="btn btn-secondary" onClick={fetchData} title="Refresh Inventory">
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatsCard 
          label="Total Inventory" 
          value={stats.total} 
          icon={TicketIcon} 
          accentColor="#6366f1" 
        />
        <StatsCard 
          label="Tickets Available" 
          value={stats.available} 
          icon={Sparkles} 
          accentColor="#10b981" 
        />
        <StatsCard 
          label="Reserved" 
          value={stats.reserved} 
          icon={Clock} 
          accentColor="#f59e0b" 
        />
        <StatsCard 
          label="Sold" 
          value={stats.sold} 
          icon={CheckCircle} 
          accentColor="#ec4899" 
        />
        <StatsCard 
          label="Total Revenue" 
          value={`$${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}`} 
          icon={DollarSign} 
          accentColor="#38bdf8" 
        />
      </div>

      {/* Action / Search Bar */}
      <div className="action-bar">
        <div className="search-filter-group">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by event, seat, or buyer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Tiers</option>
            <option value="GENERAL">General</option>
            <option value="VIP">VIP</option>
            <option value="BALCONY">Balcony</option>
            <option value="EARLY_BIRD">Early Bird</option>
          </select>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingTicket(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          Issue Ticket
        </button>
      </div>

      {/* Tickets Grid */}
      {loading && tickets.length === 0 ? (
        <div className="empty-state">
          <p>Connecting to Ticket Sales Spring Boot backend...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="empty-state">
          <h3>No tickets found</h3>
          <p>
            {search || filterStatus !== 'ALL' || filterType !== 'ALL'
              ? 'Try adjusting your search criteria or filters.'
              : 'Click "Issue Ticket" to add your first event ticket!'}
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTickets.map((t) => (
            <div key={t.id} className="task-card">
              <div>
                <div className="task-header">
                  <h3 className="task-title">{t.eventName}</h3>
                  <span className={`priority-badge priority-${t.ticketType === 'VIP' ? 'high' : t.ticketType === 'EARLY_BIRD' ? 'low' : 'medium'}`}>
                    {t.ticketType}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>
                    ${Number(t.price).toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    • {t.seatNumber || 'GA'}
                  </span>
                </div>

                {t.buyerName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <User size={14} color="var(--accent-primary)" />
                    <span>Buyer: <strong style={{ color: '#fff' }}>{t.buyerName}</strong></span>
                  </div>
                ) : (
                  <p className="task-desc" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                    Unassigned — Ready for purchase
                  </p>
                )}
              </div>

              <div className="task-footer">
                <span 
                  className={`status-badge status-${t.status === 'AVAILABLE' ? 'COMPLETED' : t.status === 'RESERVED' ? 'IN_PROGRESS' : 'PENDING'}`}
                  style={{
                    backgroundColor: t.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.15)' : t.status === 'RESERVED' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                    color: t.status === 'AVAILABLE' ? 'var(--accent-success)' : t.status === 'RESERVED' ? 'var(--accent-warning)' : '#f472b6',
                    border: `1px solid ${t.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.3)' : t.status === 'RESERVED' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`
                  }}
                  title="Ticket Status"
                >
                  {t.status === 'AVAILABLE' ? '● Available' : t.status === 'RESERVED' ? '◐ Reserved' : '✓ Sold'}
                </span>

                <div className="card-actions">
                  {t.status === 'AVAILABLE' && (
                    <button 
                      className="btn-icon" 
                      style={{ color: 'var(--accent-success)' }}
                      title="Quick Sell to Guest"
                      onClick={() => handleQuickStatus(t, 'SOLD', 'Walk-in Customer')}
                    >
                      <ShoppingBag size={16} />
                    </button>
                  )}
                  {t.status === 'SOLD' && (
                    <button 
                      className="btn-icon" 
                      style={{ color: 'var(--accent-warning)' }}
                      title="Refund / Return to Available"
                      onClick={() => handleQuickStatus(t, 'AVAILABLE')}
                    >
                      <RefreshCw size={16} />
                    </button>
                  )}
                  <button 
                    className="btn-icon" 
                    title="Edit ticket"
                    onClick={() => {
                      setEditingTicket(t);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className="btn-icon delete" 
                    title="Delete ticket"
                    onClick={() => handleDeleteTicket(t.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <TicketModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTicket}
        ticket={editingTicket}
      />
    </div>
  );
}
