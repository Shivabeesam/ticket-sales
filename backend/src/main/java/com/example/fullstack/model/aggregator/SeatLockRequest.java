package com.example.fullstack.model.aggregator;

import java.util.List;

public class SeatLockRequest {
    private String showtimeId;
    private List<String> seatIds;
    private String platform; // "BookMyShow" or "District"
    private String userEmail;
    private String userPhone;

    public SeatLockRequest() {}

    public SeatLockRequest(String showtimeId, List<String> seatIds, String platform, 
                           String userEmail, String userPhone) {
        this.showtimeId = showtimeId;
        this.seatIds = seatIds;
        this.platform = platform;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
    }

    public String getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(String showtimeId) {
        this.showtimeId = showtimeId;
    }

    public List<String> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<String> seatIds) {
        this.seatIds = seatIds;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }
}
