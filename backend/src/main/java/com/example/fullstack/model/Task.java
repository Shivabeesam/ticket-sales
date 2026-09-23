package com.example.fullstack.model;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class Task {
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String status; // "PENDING", "IN_PROGRESS", "COMPLETED"
    private String priority; // "LOW", "MEDIUM", "HIGH"
    private LocalDateTime createdAt;

    public Task() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
        this.priority = "MEDIUM";
    }

    public Task(String id, String title, String description, String status, String priority) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status != null ? status : "PENDING";
        this.priority = priority != null ? priority : "MEDIUM";
        this.createdAt = LocalDateTime.now();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
