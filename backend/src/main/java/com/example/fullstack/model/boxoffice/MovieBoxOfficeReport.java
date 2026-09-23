package com.example.fullstack.model.boxoffice;

import java.util.List;

public class MovieBoxOfficeReport {
    private String movieId;
    private String movieTitle;
    private String trackingDay;
    private String asOfTime;

    // All-India Totals
    private int totalShows;
    private int totalSeats;
    private int bookedSeats;
    private double overallOccupancyPct;
    private double totalGrossInr;
    private double totalGrossCrores;
    private double averageTicketPrice;
    private int ticketsBookedLastHour;

    // Show Status Breakdown
    private ShowStatusBreakdown statusBreakdown;

    // City & Circuit breakdowns
    private List<CityCircuitStats> circuits;

    // Platform share breakdown (BMS, District, PVR)
    private List<PlatformShare> platformShares;

    // Hourly tracking trend
    private List<HourlyTrendPoint> hourlyTrends;

    // Multi-Date & Platform Filtering metadata
    private List<String> availableDates;
    private String selectedDate;
    private String selectedPlatform;

    public MovieBoxOfficeReport() {}

    public MovieBoxOfficeReport(String movieId, String movieTitle, String trackingDay, 
                                String asOfTime, int totalShows, int totalSeats, 
                                int bookedSeats, double overallOccupancyPct, 
                                double totalGrossInr, double totalGrossCrores, 
                                double averageTicketPrice, int ticketsBookedLastHour, 
                                ShowStatusBreakdown statusBreakdown, 
                                List<CityCircuitStats> circuits, 
                                List<PlatformShare> platformShares, 
                                List<HourlyTrendPoint> hourlyTrends) {
        this(movieId, movieTitle, trackingDay, asOfTime, totalShows, totalSeats, bookedSeats, 
             overallOccupancyPct, totalGrossInr, totalGrossCrores, averageTicketPrice, 
             ticketsBookedLastHour, statusBreakdown, circuits, platformShares, hourlyTrends, 
             List.of("2026-09-23", "2026-09-24", "2026-09-25", "2026-09-26", "2026-09-27"), 
             "ALL", "ALL");
    }

    public MovieBoxOfficeReport(String movieId, String movieTitle, String trackingDay, 
                                String asOfTime, int totalShows, int totalSeats, 
                                int bookedSeats, double overallOccupancyPct, 
                                double totalGrossInr, double totalGrossCrores, 
                                double averageTicketPrice, int ticketsBookedLastHour, 
                                ShowStatusBreakdown statusBreakdown, 
                                List<CityCircuitStats> circuits, 
                                List<PlatformShare> platformShares, 
                                List<HourlyTrendPoint> hourlyTrends,
                                List<String> availableDates,
                                String selectedDate,
                                String selectedPlatform) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.trackingDay = trackingDay;
        this.asOfTime = asOfTime;
        this.totalShows = totalShows;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.overallOccupancyPct = overallOccupancyPct;
        this.totalGrossInr = totalGrossInr;
        this.totalGrossCrores = totalGrossCrores;
        this.averageTicketPrice = averageTicketPrice;
        this.ticketsBookedLastHour = ticketsBookedLastHour;
        this.statusBreakdown = statusBreakdown;
        this.circuits = circuits;
        this.platformShares = platformShares;
        this.hourlyTrends = hourlyTrends;
        this.availableDates = availableDates;
        this.selectedDate = selectedDate;
        this.selectedPlatform = selectedPlatform;
    }

    public List<String> getAvailableDates() {
        return availableDates;
    }

    public void setAvailableDates(List<String> availableDates) {
        this.availableDates = availableDates;
    }

    public String getSelectedDate() {
        return selectedDate;
    }

    public void setSelectedDate(String selectedDate) {
        this.selectedDate = selectedDate;
    }

    public String getSelectedPlatform() {
        return selectedPlatform;
    }

    public void setSelectedPlatform(String selectedPlatform) {
        this.selectedPlatform = selectedPlatform;
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

    public String getTrackingDay() {
        return trackingDay;
    }

    public void setTrackingDay(String trackingDay) {
        this.trackingDay = trackingDay;
    }

    public String getAsOfTime() {
        return asOfTime;
    }

    public void setAsOfTime(String asOfTime) {
        this.asOfTime = asOfTime;
    }

    public int getTotalShows() {
        return totalShows;
    }

    public void setTotalShows(int totalShows) {
        this.totalShows = totalShows;
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

    public double getOverallOccupancyPct() {
        return overallOccupancyPct;
    }

    public void setOverallOccupancyPct(double overallOccupancyPct) {
        this.overallOccupancyPct = overallOccupancyPct;
    }

    public double getTotalGrossInr() {
        return totalGrossInr;
    }

    public void setTotalGrossInr(double totalGrossInr) {
        this.totalGrossInr = totalGrossInr;
    }

    public double getTotalGrossCrores() {
        return totalGrossCrores;
    }

    public void setTotalGrossCrores(double totalGrossCrores) {
        this.totalGrossCrores = totalGrossCrores;
    }

    public double getAverageTicketPrice() {
        return averageTicketPrice;
    }

    public void setAverageTicketPrice(double averageTicketPrice) {
        this.averageTicketPrice = averageTicketPrice;
    }

    public int getTicketsBookedLastHour() {
        return ticketsBookedLastHour;
    }

    public void setTicketsBookedLastHour(int ticketsBookedLastHour) {
        this.ticketsBookedLastHour = ticketsBookedLastHour;
    }

    public ShowStatusBreakdown getStatusBreakdown() {
        return statusBreakdown;
    }

    public void setStatusBreakdown(ShowStatusBreakdown statusBreakdown) {
        this.statusBreakdown = statusBreakdown;
    }

    public List<CityCircuitStats> getCircuits() {
        return circuits;
    }

    public void setCircuits(List<CityCircuitStats> circuits) {
        this.circuits = circuits;
    }

    public List<PlatformShare> getPlatformShares() {
        return platformShares;
    }

    public void setPlatformShares(List<PlatformShare> platformShares) {
        this.platformShares = platformShares;
    }

    public List<HourlyTrendPoint> getHourlyTrends() {
        return hourlyTrends;
    }

    public void setHourlyTrends(List<HourlyTrendPoint> hourlyTrends) {
        this.hourlyTrends = hourlyTrends;
    }
}
