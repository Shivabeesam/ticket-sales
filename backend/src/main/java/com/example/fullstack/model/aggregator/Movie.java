package com.example.fullstack.model.aggregator;

import java.util.List;

public class Movie {
    private String id;
    private String title;
    private String slug;
    private int durationMins;
    private String posterUrl;
    private String backdropUrl;
    private String synopsis;
    private double rating;
    private int votesCount;
    private String releaseDate;
    private List<String> genres;
    private List<String> languages;
    private List<String> formats;
    private Double lowestPrice;

    public Movie() {}

    public Movie(String id, String title, String slug, int durationMins, String posterUrl, 
                 String backdropUrl, String synopsis, double rating, int votesCount, 
                 String releaseDate, List<String> genres, List<String> languages, 
                 List<String> formats, Double lowestPrice) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.durationMins = durationMins;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
        this.synopsis = synopsis;
        this.rating = rating;
        this.votesCount = votesCount;
        this.releaseDate = releaseDate;
        this.genres = genres;
        this.languages = languages;
        this.formats = formats;
        this.lowestPrice = lowestPrice;
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

    public int getDurationMins() {
        return durationMins;
    }

    public void setDurationMins(int durationMins) {
        this.durationMins = durationMins;
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

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getVotesCount() {
        return votesCount;
    }

    public void setVotesCount(int votesCount) {
        this.votesCount = votesCount;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public List<String> getFormats() {
        return formats;
    }

    public void setFormats(List<String> formats) {
        this.formats = formats;
    }

    public Double getLowestPrice() {
        return lowestPrice;
    }

    public void setLowestPrice(Double lowestPrice) {
        this.lowestPrice = lowestPrice;
    }
}
