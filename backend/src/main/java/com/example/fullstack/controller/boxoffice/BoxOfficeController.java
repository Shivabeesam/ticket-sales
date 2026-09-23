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
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "All data reset and running movies re-seeded"));
    }

    @GetMapping("/movies/{id}/report")
    public ResponseEntity<MovieBoxOfficeReport> getMovieReport(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "ALL") String date,
            @RequestParam(required = false, defaultValue = "ALL") String platform) {
        return trackingService.getMovieReport(id, date, platform)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/movies/{id}/circuits")
    public ResponseEntity<List<CityCircuitStats>> getMovieCircuits(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "ALL") String date,
            @RequestParam(required = false, defaultValue = "ALL") String platform) {
        return trackingService.getMovieReport(id, date, platform)
                .map(r -> ResponseEntity.ok(r.getCircuits()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/movies/{id}/live-events")
    public ResponseEntity<List<LiveBookingEvent>> getLiveEvents(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "ALL") String date,
            @RequestParam(required = false, defaultValue = "ALL") String platform) {
        return ResponseEntity.ok(trackingService.getLiveEvents(id, date, platform));
    }

    @PostMapping("/movies/{id}/sync-live")
    public ResponseEntity<Map<String, Object>> syncLiveShows(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "ALL") String date,
            @RequestParam(required = false, defaultValue = "ALL") String platform) {
        Map<String, Object> result = trackingService.syncLiveCircuitScrape(id, date, platform);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/discover-running")
    public ResponseEntity<List<BoxOfficeMovie>> discoverRunningMovies() {
        trackingService.discoverRunningMovies();
        return ResponseEntity.ok(trackingService.getTrackedMovies());
    }

    @GetMapping("/engine/status")
    public ResponseEntity<Map<String, Object>> getEngineStatus() {
        return ResponseEntity.ok(Map.of("active", trackingService.isEngineActive()));
    }

    @PostMapping("/engine/toggle")
    public ResponseEntity<Map<String, Object>> toggleEngine() {
        boolean active = trackingService.toggleEngine();
        return ResponseEntity.ok(Map.of(
                "active", active,
                "message", active ? "Live streaming engine resumed" : "Live streaming engine paused"
        ));
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
