package com.example.fullstack.model.boxoffice;

public class LiveBookingEvent {
    private String id;
    private String movieId;
    private String movieTitle;
    private String city;
    private String theaterName;
    private String platform; // BookMyShow, District, PVR INOX
    private String showDate = "2026-09-23";
    private String showTime;
    private int ticketsBooked;
    private double grossInr;
    private String statusChange; // SEATS_BOOKED, FAST_FILLING, SOLD_OUT, NEW_SHOW
    private long timestamp;
    private String timeAgo;

    public LiveBookingEvent() {
    }

    public LiveBookingEvent(String id, String movieId, String movieTitle, String city, 
                            String theaterName, String platform, String showTime, 
                            int ticketsBooked, double grossInr, String statusChange, 
                            long timestamp, String timeAgo) {
        this(id, movieId, movieTitle, city, theaterName, platform, "2026-09-23", showTime, 
             ticketsBooked, grossInr, statusChange, timestamp, timeAgo);
    }

    public LiveBookingEvent(String id, String movieId, String movieTitle, String city, 
                            String theaterName, String platform, String showDate, String showTime, 
                            int ticketsBooked, double grossInr, String statusChange, 
                            long timestamp, String timeAgo) {
        this.id = id;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.city = city;
        this.theaterName = theaterName;
        this.platform = platform;
        this.showDate = showDate != null && !showDate.isBlank() ? showDate : "2026-09-23";
        this.showTime = showTime;
        this.ticketsBooked = ticketsBooked;
        this.grossInr = grossInr;
        this.statusChange = statusChange;
        this.timestamp = timestamp;
        this.timeAgo = timeAgo;
    }

    public String getShowDate() {
        return showDate;
    }

    public void setShowDate(String showDate) {
        this.showDate = showDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getTheaterName() {
        return theaterName;
    }

    public void setTheaterName(String theaterName) {
        this.theaterName = theaterName;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getShowTime() {
        return showTime;
    }

    public void setShowTime(String showTime) {
        this.showTime = showTime;
    }

    public int getTicketsBooked() {
        return ticketsBooked;
    }

    public void setTicketsBooked(int ticketsBooked) {
        this.ticketsBooked = ticketsBooked;
    }

    public double getGrossInr() {
        return grossInr;
    }

    public void setGrossInr(double grossInr) {
        this.grossInr = grossInr;
    }

    public String getStatusChange() {
        return statusChange;
    }

    public void setStatusChange(String statusChange) {
        this.statusChange = statusChange;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getTimeAgo() {
        return timeAgo;
    }

    public void setTimeAgo(String timeAgo) {
        this.timeAgo = timeAgo;
    }
}
