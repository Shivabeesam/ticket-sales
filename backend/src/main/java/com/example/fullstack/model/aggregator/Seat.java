package com.example.fullstack.model.aggregator;

public class Seat {
    private String id; // "A1", "B4", etc.
    private String row; // "A", "B", etc.
    private int col; // 1, 2, 3...
    private String tier; // "RECLINER", "PRIME", "CLASSIC"
    private String status; // "AVAILABLE", "SOLD", "RESERVED", "SELECTED"
    private double price;

    public Seat() {}

    public Seat(String id, String row, int col, String tier, String status, double price) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.tier = tier;
        this.status = status;
        this.price = price;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRow() {
        return row;
    }

    public void setRow(String row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
