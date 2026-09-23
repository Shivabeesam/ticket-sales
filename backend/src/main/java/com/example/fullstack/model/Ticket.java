package com.example.fullstack.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class Ticket {
    private String id;

    @NotBlank(message = "Event name is required")
    private String eventName;

    private String ticketType; // "VIP", "GENERAL", "BALCONY", "EARLY_BIRD"

    @NotNull(message = "Price is required")
    private Double price;

    private String seatNumber; // e.g. "Section A - Seat 14"
    private String status;     // "AVAILABLE", "RESERVED", "SOLD"
    private String buyerName;  // e.g. "Alex Morgan"
    private LocalDateTime createdAt;

    public Ticket() {
        this.createdAt = LocalDateTime.now();
        this.status = "AVAILABLE";
        this.ticketType = "GENERAL";
        this.price = 49.99;
    }

    public Ticket(String id, String eventName, String ticketType, Double price, String seatNumber, String status, String buyerName) {
        this.id = id;
        this.eventName = eventName;
        this.ticketType = ticketType != null ? ticketType : "GENERAL";
        this.price = price != null ? price : 49.99;
        this.seatNumber = seatNumber != null ? seatNumber : "General Admission";
        this.status = status != null ? status : "AVAILABLE";
        this.buyerName = buyerName;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getTicketType() {
        return ticketType;
    }

    public void setTicketType(String ticketType) {
        this.ticketType = ticketType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
