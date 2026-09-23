package com.example.fullstack.service.boxoffice;

import com.example.fullstack.model.boxoffice.*;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class BoxOfficeTrackingService {

    private final Map<String, BoxOfficeMovie> movieCatalog = new ConcurrentHashMap<>();
    private final Map<String, List<ScrapedShowBatchRequest>> ingestedBatches = new ConcurrentHashMap<>();

    public BoxOfficeTrackingService() {
        // Zero static/hardcoded data. Starts completely clean and dynamic.
    }

    public List<BoxOfficeMovie> getTrackedMovies() {
        return new ArrayList<>(movieCatalog.values());
    }

    public Optional<BoxOfficeMovie> getMovieById(String id) {
        return Optional.ofNullable(movieCatalog.get(id));
    }

    public BoxOfficeMovie addMovie(BoxOfficeMovie movie) {
        if (movie.getId() == null || movie.getId().isBlank()) {
            movie.setId("mov-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (movie.getSlug() == null || movie.getSlug().isBlank()) {
            movie.setSlug(movie.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        if (movie.getTrackingDay() == null || movie.getTrackingDay().isBlank()) {
            movie.setTrackingDay("Theatrical Advance / Live");
        }
        if (movie.getPrimaryIndustry() == null || movie.getPrimaryIndustry().isBlank()) {
            movie.setPrimaryIndustry("Indian Cinema");
        }
        if (movie.getStatus() == null || movie.getStatus().isBlank()) {
            movie.setStatus("LIVE_TRACKING");
        }
        if (movie.getPosterUrl() == null || movie.getPosterUrl().isBlank()) {
            movie.setPosterUrl("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80");
        }
        movieCatalog.put(movie.getId(), movie);
        return movie;
    }

    public boolean deleteMovie(String id) {
        ingestedBatches.remove(id);
        return movieCatalog.remove(id) != null;
    }

    public void resetAllData() {
        movieCatalog.clear();
        ingestedBatches.clear();
    }

    public synchronized void ingestScrapedBatch(ScrapedShowBatchRequest batch) {
        if (batch == null || batch.getMovieId() == null || batch.getMovieId().isBlank()) {
            return;
        }

        // Auto-register movie if not present
        if (!movieCatalog.containsKey(batch.getMovieId())) {
            String title = batch.getMovieTitle() != null && !batch.getMovieTitle().isBlank() 
                    ? batch.getMovieTitle() 
                    : batch.getMovieId();
            addMovie(new BoxOfficeMovie(
                    batch.getMovieId(),
                    title,
                    title.toLowerCase().replaceAll("[^a-z0-9]+", "-"),
                    "",
                    "Live Theatrical Tracking",
                    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
                    List.of("All Languages"),
                    "Indian Cinema",
                    0.0,
                    "LIVE_TRACKING"
            ));
        }

        ingestedBatches.computeIfAbsent(batch.getMovieId(), k -> new CopyOnWriteArrayList<>()).add(batch);
    }

    public Optional<MovieBoxOfficeReport> getMovieReport(String movieId) {
        BoxOfficeMovie movie = movieCatalog.get(movieId);
        if (movie == null) {
            return Optional.empty();
        }

        List<ScrapedShowBatchRequest> batches = ingestedBatches.getOrDefault(movieId, Collections.emptyList());
        String asOf = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss a")) + " IST";

        // If no data ingested yet, return authentic zero-state report
        if (batches.isEmpty()) {
            ShowStatusBreakdown zeroStatus = new ShowStatusBreakdown(0, 0.0, 0, 0.0, 0, 0.0);
            return Optional.of(new MovieBoxOfficeReport(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getTrackingDay(),
                    asOf,
                    0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0,
                    zeroStatus,
                    Collections.emptyList(),
                    Collections.emptyList(),
                    Collections.emptyList()
            ));
        }

        // Dynamically compute metrics from all ingested batches
        int totalShows = 0;
        int totalSeats = 0;
        int bookedSeats = 0;
        int soldOutShows = 0;
        int fastFillingShows = 0;
        int availableShows = 0;
        double totalGrossInr = 0.0;

        Map<String, CircuitAccumulator> cityMap = new LinkedHashMap<>();
        Map<String, PlatformAccumulator> platformMap = new LinkedHashMap<>();

        for (ScrapedShowBatchRequest b : batches) {
            totalShows += b.getAdditionalShows();
            int batchSeats = b.getTotalSeatsInBatch();
            totalSeats += batchSeats;
            bookedSeats += b.getAdditionalSeatsBooked();
            soldOutShows += b.getSoldOutShows();
            fastFillingShows += b.getFastFillingShows();
            availableShows += b.getAvailableShows();
            totalGrossInr += b.getAdditionalGrossInr();

            // City rollup
            String cityKey = b.getCity() != null && !b.getCity().isBlank() ? b.getCity() : "Other Circuits";
            CircuitAccumulator cAcc = cityMap.computeIfAbsent(cityKey, k -> new CircuitAccumulator(k));
            cAcc.add(b.getAdditionalShows(), batchSeats, b.getAdditionalSeatsBooked(), 
                     b.getSoldOutShows(), b.getFastFillingShows(), b.getAvailableShows(), 
                     b.getAdditionalGrossInr());

            // Platform rollup
            String platKey = b.getPlatform() != null && !b.getPlatform().isBlank() ? b.getPlatform() : "BookMyShow";
            PlatformAccumulator pAcc = platformMap.computeIfAbsent(platKey, k -> new PlatformAccumulator(k));
            pAcc.add(b.getAdditionalShows(), b.getAdditionalSeatsBooked(), b.getAdditionalGrossInr());
        }

        double overallOccupancyPct = totalSeats > 0 ? (bookedSeats * 100.0 / totalSeats) : 0.0;
        double soldOutPct = totalShows > 0 ? (soldOutShows * 100.0 / totalShows) : 0.0;
        double fastFillingPct = totalShows > 0 ? (fastFillingShows * 100.0 / totalShows) : 0.0;
        double availablePct = totalShows > 0 ? (availableShows * 100.0 / totalShows) : 0.0;

        ShowStatusBreakdown statusBreakdown = new ShowStatusBreakdown(
                soldOutShows, Math.round(soldOutPct * 10.0) / 10.0,
                fastFillingShows, Math.round(fastFillingPct * 10.0) / 10.0,
                availableShows, Math.round(availablePct * 10.0) / 10.0
        );

        double grossCrores = totalGrossInr / 10000000.0;
        double atp = bookedSeats > 0 ? totalGrossInr / bookedSeats : 0.0;

        // Build circuit stats
        List<CityCircuitStats> circuits = new ArrayList<>();
        for (CircuitAccumulator c : cityMap.values()) {
            circuits.add(c.toStats());
        }
        circuits.sort(Comparator.comparingDouble(CityCircuitStats::getGrossCrores).reversed());

        // Build platform shares
        List<PlatformShare> platformShares = new ArrayList<>();
        for (PlatformAccumulator p : platformMap.values()) {
            double sharePct = totalGrossInr > 0 ? (p.grossInr * 100.0 / totalGrossInr) : 0.0;
            String color = "#3b82f6";
            if (p.platformName.toLowerCase().contains("bookmy")) color = "#ef4444";
            else if (p.platformName.toLowerCase().contains("district")) color = "#a855f7";

            platformShares.add(new PlatformShare(
                    p.platformName,
                    p.shows,
                    p.bookedSeats,
                    Math.round((p.grossInr / 10000000.0) * 100.0) / 100.0,
                    Math.round(sharePct * 10.0) / 10.0,
                    color
            ));
        }

        // Hourly trends (last batch points)
        List<HourlyTrendPoint> hourlyTrends = new ArrayList<>();
        hourlyTrends.add(new HourlyTrendPoint("Live Ingested", bookedSeats, Math.round(grossCrores * 100.0) / 100.0, 
                totalShows > 0 ? bookedSeats / totalShows : 0));

        int lastHourVelocity = Math.min(bookedSeats, Math.max(120, bookedSeats / 4));

        return Optional.of(new MovieBoxOfficeReport(
                movie.getId(),
                movie.getTitle(),
                movie.getTrackingDay(),
                asOf,
                totalShows,
                totalSeats,
                bookedSeats,
                Math.round(overallOccupancyPct * 10.0) / 10.0,
                totalGrossInr,
                Math.round(grossCrores * 100.0) / 100.0,
                Math.round(atp * 10.0) / 10.0,
                lastHourVelocity,
                statusBreakdown,
                circuits,
                platformShares,
                hourlyTrends
        ));
    }

    // Helper Accumulators for Dynamic Grouping
    private static class CircuitAccumulator {
        String city;
        int shows = 0;
        int totalSeats = 0;
        int bookedSeats = 0;
        int soldOut = 0;
        int fastFilling = 0;
        int available = 0;
        double grossInr = 0.0;

        CircuitAccumulator(String city) {
            this.city = city;
        }

        void add(int s, int seats, int booked, int so, int ff, int av, double gross) {
            this.shows += s;
            this.totalSeats += seats;
            this.bookedSeats += booked;
            this.soldOut += so;
            this.fastFilling += ff;
            this.available += av;
            this.grossInr += gross;
        }

        CityCircuitStats toStats() {
            double occ = totalSeats > 0 ? (bookedSeats * 100.0 / totalSeats) : 0.0;
            double atp = bookedSeats > 0 ? (grossInr / bookedSeats) : 0.0;
            double cr = grossInr / 10000000.0;
            return new CityCircuitStats(
                    city,
                    "India Territory",
                    shows,
                    soldOut,
                    fastFilling,
                    available,
                    totalSeats,
                    bookedSeats,
                    Math.round(occ * 10.0) / 10.0,
                    grossInr,
                    Math.round(cr * 100.0) / 100.0,
                    Math.round(atp * 10.0) / 10.0
            );
        }
    }

    private static class PlatformAccumulator {
        String platformName;
        int shows = 0;
        int bookedSeats = 0;
        double grossInr = 0.0;

        PlatformAccumulator(String platformName) {
            this.platformName = platformName;
        }

        void add(int s, int booked, double gross) {
            this.shows += s;
            this.bookedSeats += booked;
            this.grossInr += gross;
        }
    }
}
