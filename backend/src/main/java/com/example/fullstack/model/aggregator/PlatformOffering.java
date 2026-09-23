package com.example.fullstack.model.aggregator;

public class PlatformOffering {
    private String platform; // "BookMyShow" or "District"
    private double lowestPrice;
    private double highestPrice;
    private double convenienceFee;
    private String discountOffer;
    private String deepLink;
    private int availableSeats;

    public PlatformOffering() {}

    public PlatformOffering(String platform, double lowestPrice, double highestPrice, 
                            double convenienceFee, String discountOffer, String deepLink, 
                            int availableSeats) {
        this.platform = platform;
        this.lowestPrice = lowestPrice;
        this.highestPrice = highestPrice;
        this.convenienceFee = convenienceFee;
        this.discountOffer = discountOffer;
        this.deepLink = deepLink;
        this.availableSeats = availableSeats;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public double getLowestPrice() {
        return lowestPrice;
    }

    public void setLowestPrice(double lowestPrice) {
        this.lowestPrice = lowestPrice;
    }

    public double getHighestPrice() {
        return highestPrice;
    }

    public void setHighestPrice(double highestPrice) {
        this.highestPrice = highestPrice;
    }

    public double getConvenienceFee() {
        return convenienceFee;
    }

    public void setConvenienceFee(double convenienceFee) {
        this.convenienceFee = convenienceFee;
    }

    public String getDiscountOffer() {
        return discountOffer;
    }

    public void setDiscountOffer(String discountOffer) {
        this.discountOffer = discountOffer;
    }

    public String getDeepLink() {
        return deepLink;
    }

    public void setDeepLink(String deepLink) {
        this.deepLink = deepLink;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
}
