package com.example.fullstack.model.aggregator;

public class City {
    private String id;
    private String name;
    private String slug;
    private String state;
    private boolean popular;

    public City() {}

    public City(String id, String name, String slug, String state, boolean popular) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.state = state;
        this.popular = popular;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public boolean isPopular() {
        return popular;
    }

    public void setPopular(boolean popular) {
        this.popular = popular;
    }
}
