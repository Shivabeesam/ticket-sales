package com.example.fullstack.model.boxoffice;

public class ScrapedShowBatchRequest {
    private String movieId;
    private String movieTitle;
    private String city;
    private String platform; // "BookMyShow", "District", "PVR"
    private int additionalShows;
    private int totalSeatsInBatch;
    private int additionalSeatsBooked;
    private int soldOutShows;
    private int fastFillingShows;
    private int availableShows;
    private double additionalGrossInr;

    public ScrapedShowBatchRequest() {}

    public ScrapedShowBatchRequest(String movieId, String movieTitle, String city, String platform, 
                                  int additionalShows, int totalSeatsInBatch, 
                                  int additionalSeatsBooked, int soldOutShows, 
                                  int fastFillingShows, int availableShows, 
                                  double additionalGrossInr) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.city = city;
        this.platform = platform;
        this.additionalShows = additionalShows;
        this.totalSeatsInBatch = totalSeatsInBatch;
        this.additionalSeatsBooked = additionalSeatsBooked;
        this.soldOutShows = soldOutShows;
        this.fastFillingShows = fastFillingShows;
        this.availableShows = availableShows;
        this.additionalGrossInr = additionalGrossInr;
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

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public int getAdditionalShows() {
        return additionalShows;
    }

    public void setAdditionalShows(int additionalShows) {
        this.additionalShows = additionalShows;
    }

    public int getTotalSeatsInBatch() {
        if (totalSeatsInBatch <= 0 && additionalShows > 0) {
            return additionalShows * 180; // Standard 180-seater audi default
        }
        return totalSeatsInBatch;
    }

    public void setTotalSeatsInBatch(int totalSeatsInBatch) {
        this.totalSeatsInBatch = totalSeatsInBatch;
    }

    public int getAdditionalSeatsBooked() {
        return additionalSeatsBooked;
    }

    public void setAdditionalSeatsBooked(int additionalSeatsBooked) {
        this.additionalSeatsBooked = additionalSeatsBooked;
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
        if (availableShows <= 0 && additionalShows > 0) {
            return Math.max(0, additionalShows - soldOutShows - fastFillingShows);
        }
        return availableShows;
    }

    public void setAvailableShows(int availableShows) {
        this.availableShows = availableShows;
    }

    public double getAdditionalGrossInr() {
        return additionalGrossInr;
    }

    public void setAdditionalGrossInr(double additionalGrossInr) {
        this.additionalGrossInr = additionalGrossInr;
    }
}
