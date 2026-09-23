package com.example.fullstack.model.boxoffice;

public class PlatformShare {
    private String platformName; // "BookMyShow", "District (Zomato)", "PVR INOX Direct"
    private int trackedShows;
    private int bookedTickets;
    private double grossCrores;
    private double marketSharePercentage;
    private String color;

    public PlatformShare() {}

    public PlatformShare(String platformName, int trackedShows, int bookedTickets, 
                         double grossCrores, double marketSharePercentage, String color) {
        this.platformName = platformName;
        this.trackedShows = trackedShows;
        this.bookedTickets = bookedTickets;
        this.grossCrores = grossCrores;
        this.marketSharePercentage = marketSharePercentage;
        this.color = color;
    }

    public String getPlatformName() {
        return platformName;
    }

    public void setPlatformName(String platformName) {
        this.platformName = platformName;
    }

    public int getTrackedShows() {
        return trackedShows;
    }

    public void setTrackedShows(int trackedShows) {
        this.trackedShows = trackedShows;
    }

    public int getBookedTickets() {
        return bookedTickets;
    }

    public void setBookedTickets(int bookedTickets) {
        this.bookedTickets = bookedTickets;
    }

    public double getGrossCrores() {
        return grossCrores;
    }

    public void setGrossCrores(double grossCrores) {
        this.grossCrores = grossCrores;
    }

    public double getMarketSharePercentage() {
        return marketSharePercentage;
    }

    public void setMarketSharePercentage(double marketSharePercentage) {
        this.marketSharePercentage = marketSharePercentage;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
