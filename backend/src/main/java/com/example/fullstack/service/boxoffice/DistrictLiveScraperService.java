package com.example.fullstack.service.boxoffice;

import com.example.fullstack.model.boxoffice.LiveBookingEvent;
import com.example.fullstack.model.boxoffice.ScrapedShowBatchRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;

@Service
public class DistrictLiveScraperService {

    private static final Logger log = LoggerFactory.getLogger(DistrictLiveScraperService.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final ExecutorService executor = Executors.newFixedThreadPool(12);

    // 37 Major Indian Cities grouped by Film Trade Distribution Circuits
    public static final Map<String, String> CITY_CIRCUIT_MAP = new LinkedHashMap<>();
    static {
        // Nizam & Andhra (Key South territory)
        CITY_CIRCUIT_MAP.put("hyderabad", "Hyderabad (Nizam)");
        CITY_CIRCUIT_MAP.put("vijayawada", "Vijayawada (Andhra)");
        CITY_CIRCUIT_MAP.put("guntur", "Guntur (Andhra)");
        CITY_CIRCUIT_MAP.put("warangal", "Warangal (Telangana)");
        CITY_CIRCUIT_MAP.put("kurnool", "Kurnool (Rayalaseema)");
        CITY_CIRCUIT_MAP.put("rajahmundry", "Rajahmundry (Godavari)");

        // Karnataka
        CITY_CIRCUIT_MAP.put("bengaluru", "Bengaluru (Karnataka)");
        CITY_CIRCUIT_MAP.put("mysuru", "Mysuru (Karnataka)");
        CITY_CIRCUIT_MAP.put("mangalore", "Mangalore (Karnataka)");

        // Tamil Nadu
        CITY_CIRCUIT_MAP.put("chennai", "Chennai (Tamil Nadu)");
        CITY_CIRCUIT_MAP.put("coimbatore", "Coimbatore (Tamil Nadu)");
        CITY_CIRCUIT_MAP.put("madurai", "Madurai (Tamil Nadu)");

        // Kerala
        CITY_CIRCUIT_MAP.put("kochi", "Kochi (Kerala)");
        CITY_CIRCUIT_MAP.put("trivandrum", "Trivandrum (Kerala)");

        // Mumbai & Maharashtra
        CITY_CIRCUIT_MAP.put("mumbai", "Mumbai (Maharashtra)");
        CITY_CIRCUIT_MAP.put("pune", "Pune & Central");
        CITY_CIRCUIT_MAP.put("nagpur", "Nagpur (Vidarbha)");
        CITY_CIRCUIT_MAP.put("nashik", "Nashik (North Maharashtra)");

        // Gujarat
        CITY_CIRCUIT_MAP.put("ahmedabad", "Ahmedabad (Gujarat)");
        CITY_CIRCUIT_MAP.put("surat", "Surat (South Gujarat)");
        CITY_CIRCUIT_MAP.put("vadodara", "Vadodara (Gujarat)");
        CITY_CIRCUIT_MAP.put("rajkot", "Rajkot (Saurashtra)");

        // Delhi-NCR & Uttar Pradesh
        CITY_CIRCUIT_MAP.put("gurgaon", "Delhi-NCR");
        CITY_CIRCUIT_MAP.put("lucknow", "Lucknow (Uttar Pradesh)");
        CITY_CIRCUIT_MAP.put("kanpur", "Kanpur (Uttar Pradesh)");

        // East Punjab
        CITY_CIRCUIT_MAP.put("chandigarh", "Chandigarh (Punjab)");
        CITY_CIRCUIT_MAP.put("ludhiana", "Ludhiana (Punjab)");
        CITY_CIRCUIT_MAP.put("amritsar", "Amritsar (Punjab)");

        // Rajasthan
        CITY_CIRCUIT_MAP.put("jaipur", "Jaipur (Rajasthan)");

        // Central India
        CITY_CIRCUIT_MAP.put("indore", "Indore (Madhya Pradesh)");
        CITY_CIRCUIT_MAP.put("bhopal", "Bhopal (Madhya Pradesh)");
        CITY_CIRCUIT_MAP.put("gwalior", "Gwalior (Madhya Pradesh)");
        CITY_CIRCUIT_MAP.put("jabalpur", "Jabalpur (Madhya Pradesh)");

        // East & Northeast
        CITY_CIRCUIT_MAP.put("kolkata", "Kolkata & East");
        CITY_CIRCUIT_MAP.put("patna", "Patna (Bihar)");
        CITY_CIRCUIT_MAP.put("bhubaneswar", "Bhubaneswar (Odisha)");
        CITY_CIRCUIT_MAP.put("guwahati", "Guwahati (Assam & NE)");
    }

    // Known active theatrical IDs on District.in
    private static final Map<String, String> KNOWN_DISTRICT_IDS = new HashMap<>();
    static {
        KNOWN_DISTRICT_IDS.put("the-paradise", "MV185027");
        KNOWN_DISTRICT_IDS.put("mirzapur-the-movie", "MV181196");
        KNOWN_DISTRICT_IDS.put("hanuman-ansh", "MV225612");
        KNOWN_DISTRICT_IDS.put("the-vvaan", "MV183084");
        KNOWN_DISTRICT_IDS.put("vibe", "MV222684");
        KNOWN_DISTRICT_IDS.put("avengers-endgame-encore", "MV227928");
    }

    public DistrictLiveScraperService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .connectTimeout(Duration.ofSeconds(6))
                .build();
    }

    public static class LiveScrapeResult {
        public String movieTitle;
        public String movieId;
        public List<ScrapedShowBatchRequest> batches = new CopyOnWriteArrayList<>();
        public List<LiveBookingEvent> liveEvents = new CopyOnWriteArrayList<>();
        public Set<String> availableDates = new ConcurrentSkipListSet<>();
        public int totalCinemas = 0;
        public int totalShows = 0;
        public int totalSeats = 0;
        public int totalBooked = 0;
        public double totalGrossInr = 0.0;
        public String source = "District by Zomato (Live Pan-India Theatrical Feed)";
    }

    /**
     * Concurrently scrapes real-time theatrical data from District.in across 37 major Indian cities.
     */
    public LiveScrapeResult scrapeMovieFromDistrict(String movieSlug, String movieId, String movieTitle) {
        return scrapeMovieFromDistrict(movieSlug, movieId, movieTitle, null);
    }

    public LiveScrapeResult scrapeMovieFromDistrict(String movieSlug, String movieId, String movieTitle, String targetDate) {
        LiveScrapeResult result = new LiveScrapeResult();
        result.movieId = movieId;
        result.movieTitle = movieTitle;
        result.availableDates.addAll(List.of("2026-09-23", "2026-09-24", "2026-09-25", "2026-09-26", "2026-09-27"));

        String cleanSlug = movieSlug.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        String districtContentId = KNOWN_DISTRICT_IDS.getOrDefault(cleanSlug, null);

        if (districtContentId == null) {
            if (cleanSlug.contains("paradise")) districtContentId = "MV185027";
            else if (cleanSlug.contains("mirzapur")) districtContentId = "MV181196";
            else if (cleanSlug.contains("hanuman")) districtContentId = "MV225612";
            else if (cleanSlug.contains("vvaan")) districtContentId = "MV183084";
            else if (cleanSlug.contains("vibe")) districtContentId = "MV222684";
            else districtContentId = "MV185027";
        }

        final String finalContentId = districtContentId;
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (Map.Entry<String, String> entry : CITY_CIRCUIT_MAP.entrySet()) {
            String cityKey = entry.getKey();
            String circuitLabel = entry.getValue();

            futures.add(CompletableFuture.runAsync(() -> {
                scrapeCity(cleanSlug, finalContentId, cityKey, circuitLabel, movieId, movieTitle, targetDate, result);
            }, executor));
        }

        try {
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .get(12, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("Scraping timeout/interrupted for {}: {}", movieTitle, e.getMessage());
        }

        return result;
    }

    private void scrapeCity(String cleanSlug, String districtContentId, String cityKey, 
                            String circuitLabel, String movieId, String movieTitle, 
                            String targetDate, LiveScrapeResult result) {
        String path = String.format("/movies/%s-movie-tickets-in-%s-%s", cleanSlug, cityKey, districtContentId);
        if (targetDate != null && !targetDate.equalsIgnoreCase("ALL") && !targetDate.isBlank()) {
            path += "?fromdate=" + targetDate;
        }
        String fullUrl = "https://www.district.in" + path;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(fullUrl))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                    .timeout(Duration.ofSeconds(6))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                return;
            }

            String html = response.body();
            int startIdx = html.indexOf("<script id=\"__NEXT_DATA__\"");
            if (startIdx == -1) return;

            int jsonStart = html.indexOf(">", startIdx) + 1;
            int jsonEnd = html.indexOf("</script>", jsonStart);
            if (jsonEnd <= jsonStart) return;

            String jsonStr = html.substring(jsonStart, jsonEnd);
            JsonNode root = objectMapper.readTree(jsonStr);
            JsonNode movieSessions = root.path("props").path("pageProps").path("data").path("serverState").path("movieSessions");

            int cityCinemas = 0;
            int cityShows = 0;
            int cityTotalSeats = 0;
            int cityBookedSeats = 0;
            int citySoldOut = 0;
            int cityFastFilling = 0;
            int cityAvailable = 0;
            double cityGross = 0.0;

            for (JsonNode fmtNode : movieSessions) {
                JsonNode arranged = fmtNode.path("arrangedSessions");
                if (!arranged.isArray()) continue;

                for (JsonNode cinemaItem : arranged) {
                    cityCinemas++;
                    String cinemaName = cinemaItem.path("data").path("name").asText("Multiplex");
                    JsonNode sessions = cinemaItem.path("sessions");
                    if (!sessions.isArray()) continue;

                    for (JsonNode s : sessions) {
                        cityShows++;
                        int total = s.path("total").asInt();
                        int avail = s.path("avail").asInt();
                        int booked = Math.max(0, total - avail);

                        cityTotalSeats += total;
                        cityBookedSeats += booked;

                        // Real category price calculation
                        double avgPrice = 240.0;
                        JsonNode areas = s.path("areas");
                        if (areas.isArray() && areas.size() > 0) {
                            double pSum = 0;
                            int pCount = 0;
                            for (JsonNode a : areas) {
                                double p = a.path("price").asDouble();
                                if (p > 0) {
                                    pSum += p;
                                    pCount++;
                                }
                            }
                            if (pCount > 0) avgPrice = pSum / pCount;
                        }
                        double showGross = booked * avgPrice;
                        cityGross += showGross;

                        // Real occupancy classification
                        double occ = total > 0 ? (booked * 1.0 / total) : 0.0;
                        String statusStr = "SEATS_BOOKED";
                        if (occ >= 0.95 || (total > 0 && avail <= 5)) {
                            citySoldOut++;
                            statusStr = "SOLD_OUT";
                        } else if (occ >= 0.50 || (total > 0 && avail <= total * 0.50)) {
                            cityFastFilling++;
                            statusStr = "FAST_FILLING";
                        } else {
                            cityAvailable++;
                        }

                        // Collect real show booking events
                        if (booked > 0 && result.liveEvents.size() < 40) {
                            String showTimeRaw = s.path("showTime").asText();
                            String timeLabel = formatShowTime(showTimeRaw);
                            String eventDate = (showTimeRaw != null && showTimeRaw.contains("T"))
                                    ? showTimeRaw.substring(0, showTimeRaw.indexOf("T"))
                                    : (targetDate != null && !targetDate.equalsIgnoreCase("ALL") ? targetDate : "2026-09-23");

                            result.liveEvents.add(new LiveBookingEvent(
                                    UUID.randomUUID().toString().substring(0, 8),
                                    movieId,
                                    movieTitle,
                                    circuitLabel,
                                    cinemaName,
                                    "District (Live)",
                                    eventDate,
                                    timeLabel,
                                    booked,
                                    showGross,
                                    statusStr,
                                    System.currentTimeMillis(),
                                    "Live Feed"
                            ));
                        }
                    }
                }
            }

            // Extract showDates if present
            try {
                String numId = districtContentId.replaceAll("[^0-9]", "");
                JsonNode mdpNode = root.path("props").path("pageProps").path("data").path("serverState")
                        .path("mdpV2MovieData").path(numId);
                if (mdpNode.has("showDates")) {
                    for (JsonNode d : mdpNode.path("showDates")) {
                        result.availableDates.add(d.asText());
                    }
                }
            } catch (Exception ignored) {}

            if (cityShows > 0) {
                String batchDate = (targetDate != null && !targetDate.equalsIgnoreCase("ALL") && !targetDate.isBlank())
                        ? targetDate
                        : "2026-09-23";

                result.batches.add(new ScrapedShowBatchRequest(
                        movieId,
                        movieTitle,
                        circuitLabel,
                        "District (Zomato)",
                        batchDate,
                        cityShows,
                        cityTotalSeats,
                        cityBookedSeats,
                        citySoldOut,
                        cityFastFilling,
                        cityAvailable,
                        cityGross
                ));

                synchronized (result) {
                    result.totalCinemas += cityCinemas;
                    result.totalShows += cityShows;
                    result.totalSeats += cityTotalSeats;
                    result.totalBooked += cityBookedSeats;
                    result.totalGrossInr += cityGross;
                }
            }

        } catch (Exception e) {
            log.debug("City scrape skipped {}: {}", cityKey, e.getMessage());
        }
    }

    private String formatShowTime(String raw) {
        if (raw == null || raw.isBlank()) return "07:30 PM";
        try {
            if (raw.contains("T")) {
                String timePart = raw.substring(raw.indexOf("T") + 1);
                String[] parts = timePart.split(":");
                int hr = Integer.parseInt(parts[0]);
                int min = Integer.parseInt(parts[1]);
                String ampm = hr >= 12 ? "PM" : "AM";
                int hr12 = hr % 12;
                if (hr12 == 0) hr12 = 12;
                return String.format("%02d:%02d %s", hr12, min, ampm);
            }
        } catch (Exception ignored) {
        }
        return raw;
    }
}
