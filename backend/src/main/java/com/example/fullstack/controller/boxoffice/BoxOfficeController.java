package com.example.fullstack.controller.boxoffice;

import com.example.fullstack.model.boxoffice.*;
import com.example.fullstack.service.boxoffice.BoxOfficeTrackingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boxoffice")
public class BoxOfficeController {

    private final BoxOfficeTrackingService trackingService;

    public BoxOfficeController(BoxOfficeTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/movies")
    public ResponseEntity<List<BoxOfficeMovie>> getTrackedMovies() {
        return ResponseEntity.ok(trackingService.getTrackedMovies());
    }

    @PostMapping("/movies")
    public ResponseEntity<BoxOfficeMovie> createMovie(@RequestBody BoxOfficeMovie movie) {
        BoxOfficeMovie created = trackingService.addMovie(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        boolean deleted = trackingService.deleteMovie(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/reset")
    public ResponseEntity<Map<String, String>> resetAll() {
        trackingService.resetAllData();
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "All data reset"));
    }

    @GetMapping("/movies/{id}/report")
    public ResponseEntity<MovieBoxOfficeReport> getMovieReport(@PathVariable String id) {
        return trackingService.getMovieReport(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/movies/{id}/circuits")
    public ResponseEntity<List<CityCircuitStats>> getMovieCircuits(@PathVariable String id) {
        return trackingService.getMovieReport(id)
                .map(r -> ResponseEntity.ok(r.getCircuits()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, Object>> ingestScrapedBatch(@RequestBody ScrapedShowBatchRequest batch) {
        trackingService.ingestScrapedBatch(batch);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Scraped batch ingested dynamically for " + batch.getMovieId(),
                "timestamp", System.currentTimeMillis()
        ));
    }
}
