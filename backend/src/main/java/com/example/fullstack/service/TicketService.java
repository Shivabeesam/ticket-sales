package com.example.fullstack.service;

import com.example.fullstack.model.Ticket;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TicketService {

    private final Map<String, Ticket> ticketStore = new ConcurrentHashMap<>();

    public TicketService() {
        // Starts clean with zero static/mock data
    }

    public List<Ticket> getAllTickets() {
        List<Ticket> list = new ArrayList<>(ticketStore.values());
        list.sort(Comparator.comparing(Ticket::getCreatedAt).reversed());
        return list;
    }

    public Optional<Ticket> getTicketById(String id) {
        return Optional.ofNullable(ticketStore.get(id));
    }

    public Ticket createTicket(Ticket ticket) {
        if (ticket.getId() == null || ticket.getId().isBlank()) {
            ticket.setId(UUID.randomUUID().toString());
        }
        if (ticket.getStatus() == null || ticket.getStatus().isBlank()) {
            ticket.setStatus("AVAILABLE");
        }
        if (ticket.getTicketType() == null || ticket.getTicketType().isBlank()) {
            ticket.setTicketType("GENERAL");
        }
        if (ticket.getPrice() == null) {
            ticket.setPrice(49.99);
        }
        ticketStore.put(ticket.getId(), ticket);
        return ticket;
    }

    public Optional<Ticket> updateTicket(String id, Ticket updated) {
        Ticket existing = ticketStore.get(id);
        if (existing == null) {
            return Optional.empty();
        }
        if (updated.getEventName() != null && !updated.getEventName().isBlank()) {
            existing.setEventName(updated.getEventName());
        }
        if (updated.getTicketType() != null) {
            existing.setTicketType(updated.getTicketType());
        }
        if (updated.getPrice() != null) {
            existing.setPrice(updated.getPrice());
        }
        if (updated.getSeatNumber() != null) {
            existing.setSeatNumber(updated.getSeatNumber());
        }
        if (updated.getStatus() != null) {
            existing.setStatus(updated.getStatus());
        }
        if (updated.getBuyerName() != null) {
            existing.setBuyerName(updated.getBuyerName());
        }
        return Optional.of(existing);
    }

    public boolean deleteTicket(String id) {
        return ticketStore.remove(id) != null;
    }

    public Map<String, Object> getStats() {
        long total = ticketStore.size();
        long available = ticketStore.values().stream().filter(t -> "AVAILABLE".equalsIgnoreCase(t.getStatus())).count();
        long reserved = ticketStore.values().stream().filter(t -> "RESERVED".equalsIgnoreCase(t.getStatus())).count();
        long sold = ticketStore.values().stream().filter(t -> "SOLD".equalsIgnoreCase(t.getStatus())).count();

        double totalRevenue = ticketStore.values().stream()
                .filter(t -> "SOLD".equalsIgnoreCase(t.getStatus()))
                .mapToDouble(t -> t.getPrice() != null ? t.getPrice() : 0.0)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("available", available);
        stats.put("reserved", reserved);
        stats.put("sold", sold);
        stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        return stats;
    }
}
