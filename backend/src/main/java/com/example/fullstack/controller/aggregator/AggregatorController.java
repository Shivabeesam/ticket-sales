package com.example.fullstack.controller.aggregator;

import com.example.fullstack.model.aggregator.*;
import com.example.fullstack.service.aggregator.AggregatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aggregator")
public class AggregatorController {

    private final AggregatorService aggregatorService;

    public AggregatorController(AggregatorService aggregatorService) {
        this.aggregatorService = aggregatorService;
    }

    @GetMapping("/cities")
    public ResponseEntity<List<City>> getCities() {
        return ResponseEntity.ok(aggregatorService.getAllCities());
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> getMovies(
            @RequestParam(required = false, defaultValue = "mumbai") String city,
            @RequestParam(required = false, defaultValue = "2026-09-24") String date,
            @RequestParam(required = false, defaultValue = "ALL") String format,
            @RequestParam(required = false, defaultValue = "ALL") String genre
    ) {
        return ResponseEntity.ok(aggregatorService.getMoviesByFilter(city, date, format, genre));
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        return aggregatorService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/movies/{id}/showtimes")
    public ResponseEntity<Map<String, Object>> getMovieShowtimes(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "mumbai") String city,
            @RequestParam(required = false, defaultValue = "2026-09-24") String date
    ) {
        return ResponseEntity.ok(aggregatorService.getMovieShowtimes(id, city, date));
    }

    @GetMapping("/showtimes/{id}/seats")
    public ResponseEntity<SeatLayout> getSeatLayout(@PathVariable String id) {
        return aggregatorService.getSeatLayout(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/showtimes/{id}/lock")
    public ResponseEntity<SeatLockResponse> lockSeats(
            @PathVariable String id,
            @RequestBody SeatLockRequest request
    ) {
        request.setShowtimeId(id);
        SeatLockResponse response = aggregatorService.lockSeats(request);
        if ("FAILED".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
