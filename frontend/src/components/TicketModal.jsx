import React, { useState, useEffect } from 'react';
import { X, Ticket as TicketIcon } from 'lucide-react';

export default function TicketModal({ isOpen, onClose, onSave, ticket }) {
  const [eventName, setEventName] = useState('');
  const [ticketType, setTicketType] = useState('GENERAL');
  const [price, setPrice] = useState('49.99');
  const [seatNumber, setSeatNumber] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [status, setStatus] = useState('AVAILABLE');

  useEffect(() => {
    if (ticket) {
      setEventName(ticket.eventName || '');
      setTicketType(ticket.ticketType || 'GENERAL');
      setPrice(ticket.price !== undefined ? String(ticket.price) : '49.99');
      setSeatNumber(ticket.seatNumber || '');
      setBuyerName(ticket.buyerName || '');
      setStatus(ticket.status || 'AVAILABLE');
    } else {
      setEventName('');
      setTicketType('GENERAL');
      setPrice('49.99');
      setSeatNumber('');
      setBuyerName('');
      setStatus('AVAILABLE');
    }
  }, [ticket, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;
    onSave({
      id: ticket ? ticket.id : null,
      eventName: eventName.trim(),
      ticketType,
      price: parseFloat(price) || 0.0,
      seatNumber: seatNumber.trim() || 'General Admission',
      buyerName: buyerName.trim() || null,
      status,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TicketIcon size={20} color="var(--accent-primary)" />
            <h3>{ticket ? 'Edit Ticket' : 'Issue New Ticket'}</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Coldplay Music of the Spheres"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Ticket Tier / Type</label>
              <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
                <option value="GENERAL">General Admission</option>
                <option value="VIP">VIP Lounge</option>
                <option value="BALCONY">Balcony Tier</option>
                <option value="EARLY_BIRD">Early Bird</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="49.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Seat / Section</label>
              <input
                type="text"
                placeholder="e.g. Sec 102 - Row A"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Buyer / Customer Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {ticket ? 'Save Changes' : 'Issue Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
