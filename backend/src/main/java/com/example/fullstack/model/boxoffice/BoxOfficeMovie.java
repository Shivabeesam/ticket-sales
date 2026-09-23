package com.example.fullstack.model.boxoffice;

import java.util.List;

public class BoxOfficeMovie {
    private String id;
    private String title;
    private String slug;
    private String releaseDate;
    private String trackingDay; // e.g. "Day 1 (Advance)", "Day 2", "Weekend 1"
    private String posterUrl;
    private String backdropUrl;
    private List<String> languages;
    private String primaryIndustry; // "Bollywood", "Tollywood", "Hollywood", "Kollywood"
    private double budgetCrores;
    private String status; // "ADVANCE_OPEN", "RUNNING", "PRE_RELEASE"

    public BoxOfficeMovie() {}

    public BoxOfficeMovie(String id, String title, String slug, String releaseDate, 
                          String trackingDay, String posterUrl, String backdropUrl, 
                          List<String> languages, String primaryIndustry, 
                          double budgetCrores, String status) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.releaseDate = releaseDate;
        this.trackingDay = trackingDay;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
        this.languages = languages;
        this.primaryIndustry = primaryIndustry;
        this.budgetCrores = budgetCrores;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getTrackingDay() {
        return trackingDay;
    }

    public void setTrackingDay(String trackingDay) {
        this.trackingDay = trackingDay;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getBackdropUrl() {
        return backdropUrl;
    }

    public void setBackdropUrl(String backdropUrl) {
        this.backdropUrl = backdropUrl;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public String getPrimaryIndustry() {
        return primaryIndustry;
    }

    public void setPrimaryIndustry(String primaryIndustry) {
        this.primaryIndustry = primaryIndustry;
    }

    public double getBudgetCrores() {
        return budgetCrores;
    }

    public void setBudgetCrores(double budgetCrores) {
        this.budgetCrores = budgetCrores;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
