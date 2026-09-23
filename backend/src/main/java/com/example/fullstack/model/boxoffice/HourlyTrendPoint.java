package com.example.fullstack.model.boxoffice;

public class HourlyTrendPoint {
    private String timeLabel; // "10 AM", "11 AM", etc.
    private int ticketsBooked;
    private double cumulativeGrossCrores;
    private int velocityPerMinute;

    public HourlyTrendPoint() {}

    public HourlyTrendPoint(String timeLabel, int ticketsBooked, double cumulativeGrossCrores, int velocityPerMinute) {
        this.timeLabel = timeLabel;
        this.ticketsBooked = ticketsBooked;
        this.cumulativeGrossCrores = cumulativeGrossCrores;
        this.velocityPerMinute = velocityPerMinute;
    }

    public String getTimeLabel() {
        return timeLabel;
    }

    public void setTimeLabel(String timeLabel) {
        this.timeLabel = timeLabel;
    }

    public int getTicketsBooked() {
        return ticketsBooked;
    }

    public void setTicketsBooked(int ticketsBooked) {
        this.ticketsBooked = ticketsBooked;
    }

    public double getCumulativeGrossCrores() {
        return cumulativeGrossCrores;
    }

    public void setCumulativeGrossCrores(double cumulativeGrossCrores) {
        this.cumulativeGrossCrores = cumulativeGrossCrores;
    }

    public int getVelocityPerMinute() {
        return velocityPerMinute;
    }

    public void setVelocityPerMinute(int velocityPerMinute) {
        this.velocityPerMinute = velocityPerMinute;
    }
}
