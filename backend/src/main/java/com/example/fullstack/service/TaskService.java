package com.example.fullstack.service;

import com.example.fullstack.model.Task;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TaskService {

    private final Map<String, Task> taskStore = new ConcurrentHashMap<>();

    public TaskService() {
        // Seed default initial tasks
        createTask(new Task(null, "Setup Spring Boot Backend", "Initialize REST API and build configs with Maven", "COMPLETED", "HIGH"));
        createTask(new Task(null, "Build React Frontend", "Create modern dark-mode UI with Vite and CSS glassmorphism", "IN_PROGRESS", "HIGH"));
        createTask(new Task(null, "Initialize Git Repository", "Commit backend and frontend in monorepo and push to Git", "PENDING", "MEDIUM"));
    }

    public List<Task> getAllTasks() {
        List<Task> list = new ArrayList<>(taskStore.values());
        list.sort(Comparator.comparing(Task::getCreatedAt).reversed());
        return list;
    }

    public Optional<Task> getTaskById(String id) {
        return Optional.ofNullable(taskStore.get(id));
    }

    public Task createTask(Task task) {
        if (task.getId() == null || task.getId().isBlank()) {
            task.setId(UUID.randomUUID().toString());
        }
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("PENDING");
        }
        if (task.getPriority() == null || task.getPriority().isBlank()) {
            task.setPriority("MEDIUM");
        }
        taskStore.put(task.getId(), task);
        return task;
    }

    public Optional<Task> updateTask(String id, Task updated) {
        Task existing = taskStore.get(id);
        if (existing == null) {
            return Optional.empty();
        }
        if (updated.getTitle() != null && !updated.getTitle().isBlank()) {
            existing.setTitle(updated.getTitle());
        }
        if (updated.getDescription() != null) {
            existing.setDescription(updated.getDescription());
        }
        if (updated.getStatus() != null) {
            existing.setStatus(updated.getStatus());
        }
        if (updated.getPriority() != null) {
            existing.setPriority(updated.getPriority());
        }
        return Optional.of(existing);
    }

    public boolean deleteTask(String id) {
        return taskStore.remove(id) != null;
    }

    public Map<String, Object> getStats() {
        long total = taskStore.size();
        long completed = taskStore.values().stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
        long inProgress = taskStore.values().stream().filter(t -> "IN_PROGRESS".equalsIgnoreCase(t.getStatus())).count();
        long pending = taskStore.values().stream().filter(t -> "PENDING".equalsIgnoreCase(t.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("completed", completed);
        stats.put("inProgress", inProgress);
        stats.put("pending", pending);
        return stats;
    }
}
