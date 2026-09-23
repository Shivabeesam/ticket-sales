package com.example.fullstack.model.aggregator;

import java.util.List;

public class SeatLockResponse {
    private String lockId;
    private String showtimeId;
    private List<String> lockedSeats;
    private double totalBasePrice;
    private double convenienceFee;
    private double finalAmount;
    private long expiryTimestamp; // Unix millis
    private String platform;
    private String checkoutUrl;
    private String status; // "LOCKED", "FAILED"

    public SeatLockResponse() {}

    public SeatLockResponse(String lockId, String showtimeId, List<String> lockedSeats, 
                            double totalBasePrice, double convenienceFee, double finalAmount, 
                            long expiryTimestamp, String platform, String checkoutUrl, 
                            String status) {
        this.lockId = lockId;
        this.showtimeId = showtimeId;
        this.lockedSeats = lockedSeats;
        this.totalBasePrice = totalBasePrice;
        this.convenienceFee = convenienceFee;
        this.finalAmount = finalAmount;
        this.expiryTimestamp = expiryTimestamp;
        this.platform = platform;
        this.checkoutUrl = checkoutUrl;
        this.status = status;
    }

    public String getLockId() {
        return lockId;
    }

    public void setLockId(String lockId) {
        this.lockId = lockId;
    }

    public String getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(String showtimeId) {
        this.showtimeId = showtimeId;
    }

    public List<String> getLockedSeats() {
        return lockedSeats;
    }

    public void setLockedSeats(List<String> lockedSeats) {
        this.lockedSeats = lockedSeats;
    }

    public double getTotalBasePrice() {
        return totalBasePrice;
    }

    public void setTotalBasePrice(double totalBasePrice) {
        this.totalBasePrice = totalBasePrice;
    }

    public double getConvenienceFee() {
        return convenienceFee;
    }

    public void setConvenienceFee(double convenienceFee) {
        this.convenienceFee = convenienceFee;
    }

    public double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
    }

    public long getExpiryTimestamp() {
        return expiryTimestamp;
    }

    public void setExpiryTimestamp(long expiryTimestamp) {
        this.expiryTimestamp = expiryTimestamp;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public void setCheckoutUrl(String checkoutUrl) {
        this.checkoutUrl = checkoutUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
