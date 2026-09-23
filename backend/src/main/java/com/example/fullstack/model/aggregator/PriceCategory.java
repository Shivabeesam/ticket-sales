package com.example.fullstack.model.aggregator;

public class PriceCategory {
    private String categoryName; // "Recliner", "Prime", "Classic"
    private double price;
    private int availableSeats;

    public PriceCategory() {}

    public PriceCategory(String categoryName, double price, int availableSeats) {
        this.categoryName = categoryName;
        this.price = price;
        this.availableSeats = availableSeats;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
}
