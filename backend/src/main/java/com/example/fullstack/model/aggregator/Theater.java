package com.example.fullstack.model.aggregator;

public class Theater {
    private String id;
    private String citySlug;
    private String name;
    private String chainName; // PVR INOX, Cinepolis, MovieMax, etc.
    private String address;
    private double latitude;
    private double longitude;
    private double distanceKm;

    public Theater() {}

    public Theater(String id, String citySlug, String name, String chainName, 
                   String address, double latitude, double longitude, double distanceKm) {
        this.id = id;
        this.citySlug = citySlug;
        this.name = name;
        this.chainName = chainName;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceKm = distanceKm;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCitySlug() {
        return citySlug;
    }

    public void setCitySlug(String citySlug) {
        this.citySlug = citySlug;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getChainName() {
        return chainName;
    }

    public void setChainName(String chainName) {
        this.chainName = chainName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }
}
