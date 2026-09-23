package com.example.fullstack.model.aggregator;

import java.util.List;
import java.util.Map;

public class SeatLayout {
    private String showtimeId;
    private String movieTitle;
    private String theaterName;
    private String screenName;
    private String format;
    private String startTime;
    private String date;
    private int totalSeats;
    private int availableSeats;
    private List<PriceCategory> tiers;
    private List<String> rows;
    private Map<String, List<Seat>> grid; // Row -> list of seats
    private List<PlatformOffering> platformOfferings;

    public SeatLayout() {}

    public SeatLayout(String showtimeId, String movieTitle, String theaterName, 
                      String screenName, String format, String startTime, String date, 
                      int totalSeats, int availableSeats, List<PriceCategory> tiers, 
                      List<String> rows, Map<String, List<Seat>> grid, 
                      List<PlatformOffering> platformOfferings) {
        this.showtimeId = showtimeId;
        this.movieTitle = movieTitle;
        this.theaterName = theaterName;
        this.screenName = screenName;
        this.format = format;
        this.startTime = startTime;
        this.date = date;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.tiers = tiers;
        this.rows = rows;
        this.grid = grid;
        this.platformOfferings = platformOfferings;
    }

    public String getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(String showtimeId) {
        this.showtimeId = showtimeId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getTheaterName() {
        return theaterName;
    }

    public void setTheaterName(String theaterName) {
        this.theaterName = theaterName;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public List<PriceCategory> getTiers() {
        return tiers;
    }

    public void setTiers(List<PriceCategory> tiers) {
        this.tiers = tiers;
    }

    public List<String> getRows() {
        return rows;
    }

    public void setRows(List<String> rows) {
        this.rows = rows;
    }

    public Map<String, List<Seat>> getGrid() {
        return grid;
    }

    public void setGrid(Map<String, List<Seat>> grid) {
        this.grid = grid;
    }

    public List<PlatformOffering> getPlatformOfferings() {
        return platformOfferings;
    }

    public void setPlatformOfferings(List<PlatformOffering> platformOfferings) {
        this.platformOfferings = platformOfferings;
    }
}
