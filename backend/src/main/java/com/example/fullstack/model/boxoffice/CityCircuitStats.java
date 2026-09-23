package com.example.fullstack.model.boxoffice;

public class CityCircuitStats {
    private String cityName;
    private String state;
    private int totalShows;
    private int soldOutShows;
    private int fastFillingShows;
    private int availableShows;
    private int totalSeats;
    private int bookedSeats;
    private double occupancyPercentage;
    private double grossInr;
    private double grossCrores;
    private double averageTicketPrice;

    public CityCircuitStats() {}

    public CityCircuitStats(String cityName, String state, int totalShows, int soldOutShows, 
                            int fastFillingShows, int availableShows, int totalSeats, 
                            int bookedSeats, double occupancyPercentage, double grossInr, 
                            double grossCrores, double averageTicketPrice) {
        this.cityName = cityName;
        this.state = state;
        this.totalShows = totalShows;
        this.soldOutShows = soldOutShows;
        this.fastFillingShows = fastFillingShows;
        this.availableShows = availableShows;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.occupancyPercentage = occupancyPercentage;
        this.grossInr = grossInr;
        this.grossCrores = grossCrores;
        this.averageTicketPrice = averageTicketPrice;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getTotalShows() {
        return totalShows;
    }

    public void setTotalShows(int totalShows) {
        this.totalShows = totalShows;
    }

    public int getSoldOutShows() {
        return soldOutShows;
    }

    public void setSoldOutShows(int soldOutShows) {
        this.soldOutShows = soldOutShows;
    }

    public int getFastFillingShows() {
        return fastFillingShows;
    }

    public void setFastFillingShows(int fastFillingShows) {
        this.fastFillingShows = fastFillingShows;
    }

    public int getAvailableShows() {
        return availableShows;
    }

    public void setAvailableShows(int availableShows) {
        this.availableShows = availableShows;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(int bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    public double getOccupancyPercentage() {
        return occupancyPercentage;
    }

    public void setOccupancyPercentage(double occupancyPercentage) {
        this.occupancyPercentage = occupancyPercentage;
    }

    public double getGrossInr() {
        return grossInr;
    }

    public void setGrossInr(double grossInr) {
        this.grossInr = grossInr;
    }

    public double getGrossCrores() {
        return grossCrores;
    }

    public void setGrossCrores(double grossCrores) {
        this.grossCrores = grossCrores;
    }

    public double getAverageTicketPrice() {
        return averageTicketPrice;
    }

    public void setAverageTicketPrice(double averageTicketPrice) {
        this.averageTicketPrice = averageTicketPrice;
    }
}
