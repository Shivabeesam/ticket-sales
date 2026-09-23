package com.example.fullstack.model.aggregator;

import java.util.List;

public class Showtime {
    private String id;
    private String movieId;
    private String movieTitle;
    private String theaterId;
    private String theaterName;
    private String screenName;
    private String format; // "IMAX 2D", "4DX", "2D", "3D"
    private String language;
    private String startTime; // "10:30 AM", "01:45 PM", "07:15 PM"
    private String date; // "2026-09-24"
    private String status; // "AVAILABLE", "FAST_FILLING", "ALMOST_FULL", "SOLD_OUT"
    private List<PlatformOffering> platformOfferings;
    private List<PriceCategory> priceCategories;

    public Showtime() {}

    public Showtime(String id, String movieId, String movieTitle, String theaterId, 
                    String theaterName, String screenName, String format, String language, 
                    String startTime, String date, String status, 
                    List<PlatformOffering> platformOfferings, List<PriceCategory> priceCategories) {
        this.id = id;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.theaterId = theaterId;
        this.theaterName = theaterName;
        this.screenName = screenName;
        this.format = format;
        this.language = language;
        this.startTime = startTime;
        this.date = date;
        this.status = status;
        this.platformOfferings = platformOfferings;
        this.priceCategories = priceCategories;
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

    public String getTheaterId() {
        return theaterId;
    }

    public void setTheaterId(String theaterId) {
        this.theaterId = theaterId;
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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<PlatformOffering> getPlatformOfferings() {
        return platformOfferings;
    }

    public void setPlatformOfferings(List<PlatformOffering> platformOfferings) {
        this.platformOfferings = platformOfferings;
    }

    public List<PriceCategory> getPriceCategories() {
        return priceCategories;
    }

    public void setPriceCategories(List<PriceCategory> priceCategories) {
        this.priceCategories = priceCategories;
    }
}
