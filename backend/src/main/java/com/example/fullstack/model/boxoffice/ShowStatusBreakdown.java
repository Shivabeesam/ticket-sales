package com.example.fullstack.model.boxoffice;

public class ShowStatusBreakdown {
    private int soldOutShows;
    private double soldOutPercentage;
    private int fastFillingShows;
    private double fastFillingPercentage;
    private int availableShows;
    private double availablePercentage;

    public ShowStatusBreakdown() {}

    public ShowStatusBreakdown(int soldOutShows, double soldOutPercentage, 
                               int fastFillingShows, double fastFillingPercentage, 
                               int availableShows, double availablePercentage) {
        this.soldOutShows = soldOutShows;
        this.soldOutPercentage = soldOutPercentage;
        this.fastFillingShows = fastFillingShows;
        this.fastFillingPercentage = fastFillingPercentage;
        this.availableShows = availableShows;
        this.availablePercentage = availablePercentage;
    }

    public int getSoldOutShows() {
        return soldOutShows;
    }

    public void setSoldOutShows(int soldOutShows) {
        this.soldOutShows = soldOutShows;
    }

    public double getSoldOutPercentage() {
        return soldOutPercentage;
    }

    public void setSoldOutPercentage(double soldOutPercentage) {
        this.soldOutPercentage = soldOutPercentage;
    }

    public int getFastFillingShows() {
        return fastFillingShows;
    }

    public void setFastFillingShows(int fastFillingShows) {
        this.fastFillingShows = fastFillingShows;
    }

    public double getFastFillingPercentage() {
        return fastFillingPercentage;
    }

    public void setFastFillingPercentage(double fastFillingPercentage) {
        this.fastFillingPercentage = fastFillingPercentage;
    }

    public int getAvailableShows() {
        return availableShows;
    }

    public void setAvailableShows(int availableShows) {
        this.availableShows = availableShows;
    }

    public double getAvailablePercentage() {
        return availablePercentage;
    }

    public void setAvailablePercentage(double availablePercentage) {
        this.availablePercentage = availablePercentage;
    }
}
