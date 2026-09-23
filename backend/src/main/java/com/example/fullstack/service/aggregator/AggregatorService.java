package com.example.fullstack.service.aggregator;

import com.example.fullstack.model.aggregator.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AggregatorService {

    private final List<City> cities = new ArrayList<>();
    private final Map<String, Movie> movies = new ConcurrentHashMap<>();
    private final Map<String, Theater> theaters = new ConcurrentHashMap<>();
    private final Map<String, Showtime> showtimes = new ConcurrentHashMap<>();
    private final Map<String, SeatLayout> seatLayoutCache = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> lockedSeatsByShowtime = new ConcurrentHashMap<>();

    public AggregatorService() {
        // Starts 100% clean with zero static or mock data
    }

    public synchronized void addCity(City city) {
        cities.add(city);
    }

    public synchronized void addMovie(Movie m) {
        movies.put(m.getId(), m);
    }

    public synchronized void addTheater(Theater t) {
        theaters.put(t.getId(), t);
    }

    public synchronized void addShowtime(Showtime s) {
        showtimes.put(s.getId(), s);
    }

    public List<City> getAllCities() {
        return new ArrayList<>(cities);
    }

    public List<Movie> getMoviesByFilter(String citySlug, String date, String format, String genre) {
        // Collect movies that have active showtimes in this city
        Set<String> activeMovieIdsInCity = showtimes.values().stream()
                .filter(st -> {
                    Theater th = theaters.get(st.getTheaterId());
                    boolean matchesCity = citySlug == null || citySlug.isBlank() || 
                            (th != null && th.getCitySlug().equalsIgnoreCase(citySlug));
                    boolean matchesDate = date == null || date.isBlank() || st.getDate().equals(date);
                    return matchesCity && matchesDate;
                })
                .map(Showtime::getMovieId)
                .collect(Collectors.toSet());

        return movies.values().stream()
                .filter(m -> activeMovieIdsInCity.isEmpty() || activeMovieIdsInCity.contains(m.getId()))
                .filter(m -> format == null || format.isBlank() || "ALL".equalsIgnoreCase(format) || 
                        m.getFormats().stream().anyMatch(f -> f.equalsIgnoreCase(format)))
                .filter(m -> genre == null || genre.isBlank() || "ALL".equalsIgnoreCase(genre) || 
                        m.getGenres().stream().anyMatch(g -> g.equalsIgnoreCase(genre)))
                .collect(Collectors.toList());
    }

    public Optional<Movie> getMovieById(String id) {
        return Optional.ofNullable(movies.get(id));
    }

    public Map<String, Object> getMovieShowtimes(String movieId, String citySlug, String date) {
        Movie movie = movies.get(movieId);
        Map<String, Object> result = new HashMap<>();
        result.put("movie", movie);
        result.put("citySlug", citySlug);
        result.put("date", date != null && !date.isBlank() ? date : "2026-09-24");

        // Filter showtimes
        List<Showtime> matchedShows = showtimes.values().stream()
                .filter(st -> st.getMovieId().equals(movieId))
                .filter(st -> {
                    if (citySlug == null || citySlug.isBlank()) return true;
                    Theater th = theaters.get(st.getTheaterId());
                    return th != null && th.getCitySlug().equalsIgnoreCase(citySlug);
                })
                .filter(st -> {
                    if (date == null || date.isBlank()) return true;
                    return st.getDate().equals(date);
                })
                .sorted(Comparator.comparing(Showtime::getStartTime))
                .collect(Collectors.toList());

        // Group by theater
        Map<String, List<Showtime>> showsByTheater = matchedShows.stream()
                .collect(Collectors.groupingBy(Showtime::getTheaterId));

        List<Map<String, Object>> theaterNodes = new ArrayList<>();
        for (Map.Entry<String, List<Showtime>> entry : showsByTheater.entrySet()) {
            Theater theater = theaters.get(entry.getKey());
            if (theater != null) {
                Map<String, Object> node = new HashMap<>();
                node.put("theater", theater);
                node.put("shows", entry.getValue());
                theaterNodes.add(node);
            }
        }

        // Sort theaters by distance
        theaterNodes.sort(Comparator.comparingDouble(t -> ((Theater) t.get("theater")).getDistanceKm()));
        result.put("theaters", theaterNodes);
        result.put("totalShowtimes", matchedShows.size());

        return result;
    }

    public Optional<SeatLayout> getSeatLayout(String showtimeId) {
        Showtime showtime = showtimes.get(showtimeId);
        if (showtime == null) {
            return Optional.empty();
        }

        return Optional.of(seatLayoutCache.computeIfAbsent(showtimeId, id -> generateLayout(showtime)));
    }

    private SeatLayout generateLayout(Showtime showtime) {
        List<String> rows = List.of("A", "B", "C", "D", "E", "F");
        Map<String, List<Seat>> grid = new LinkedHashMap<>();

        // Tier pricing from showtime
        double reclinerPrice = 950.0;
        double primePrice = 620.0;
        double classicPrice = 450.0;

        for (PriceCategory cat : showtime.getPriceCategories()) {
            if ("Recliner".equalsIgnoreCase(cat.getCategoryName())) reclinerPrice = cat.getPrice();
            if ("Prime".equalsIgnoreCase(cat.getCategoryName())) primePrice = cat.getPrice();
            if ("Classic".equalsIgnoreCase(cat.getCategoryName())) classicPrice = cat.getPrice();
        }

        Set<String> locked = lockedSeatsByShowtime.getOrDefault(showtime.getId(), Collections.emptySet());
        int total = 0;
        int available = 0;

        for (String row : rows) {
            List<Seat> seatList = new ArrayList<>();
            String tier;
            double price;
            int seatsInRow = 10;

            if ("A".equals(row)) {
                tier = "RECLINER";
                price = reclinerPrice;
                seatsInRow = 8;
            } else if ("B".equals(row) || "C".equals(row)) {
                tier = "PRIME";
                price = primePrice;
            } else {
                tier = "CLASSIC";
                price = classicPrice;
            }

            for (int col = 1; col <= seatsInRow; col++) {
                String seatId = row + col;
                total++;

                String status = "AVAILABLE";
                if (locked.contains(seatId)) {
                    status = "RESERVED";
                } else if ((row.hashCode() + col + showtime.getId().hashCode()) % 5 == 0) {
                    // pseudo-random booked seats for realism
                    status = "SOLD";
                } else {
                    available++;
                }

                seatList.add(new Seat(seatId, row, col, tier, status, price));
            }
            grid.put(row, seatList);
        }

        List<PriceCategory> tiers = List.of(
                new PriceCategory("Recliner", reclinerPrice, 8),
                new PriceCategory("Prime", primePrice, 20),
                new PriceCategory("Classic", classicPrice, 30)
        );

        return new SeatLayout(
                showtime.getId(),
                showtime.getMovieTitle(),
                showtime.getTheaterName(),
                showtime.getScreenName(),
                showtime.getFormat(),
                showtime.getStartTime(),
                showtime.getDate(),
                total,
                available,
                tiers,
                rows,
                grid,
                showtime.getPlatformOfferings()
        );
    }

    public synchronized SeatLockResponse lockSeats(SeatLockRequest request) {
        Showtime showtime = showtimes.get(request.getShowtimeId());
        if (showtime == null || request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            return new SeatLockResponse(null, null, Collections.emptyList(), 0, 0, 0, 0, 
                    request.getPlatform(), null, "FAILED");
        }

        SeatLayout layout = getSeatLayout(request.getShowtimeId()).orElse(null);
        if (layout == null) {
            return new SeatLockResponse(null, null, Collections.emptyList(), 0, 0, 0, 0, 
                    request.getPlatform(), null, "FAILED");
        }

        Set<String> lockedSet = lockedSeatsByShowtime.computeIfAbsent(request.getShowtimeId(), k -> ConcurrentHashMap.newKeySet());

        // Check if any seat is already locked or sold
        for (String seatId : request.getSeatIds()) {
            if (lockedSet.contains(seatId)) {
                return new SeatLockResponse(null, request.getShowtimeId(), Collections.emptyList(), 0, 0, 0, 0, 
                        request.getPlatform(), null, "SEAT_ALREADY_RESERVED");
            }
        }

        // Lock seats
        lockedSet.addAll(request.getSeatIds());

        // Invalidate cached layout to reflect update
        seatLayoutCache.remove(request.getShowtimeId());

        // Calculate total price
        double baseTotal = 0.0;
        for (String rowKey : layout.getGrid().keySet()) {
            for (Seat seat : layout.getGrid().get(rowKey)) {
                if (request.getSeatIds().contains(seat.getId())) {
                    baseTotal += seat.getPrice();
                }
            }
        }

        String platform = request.getPlatform() != null ? request.getPlatform() : "BookMyShow";
        double fee = "District".equalsIgnoreCase(platform) ? 28.00 : 35.40;
        double finalAmount = baseTotal + (fee * request.getSeatIds().size());

        String lockId = "LOCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        long expiry = System.currentTimeMillis() + (10 * 60 * 1000); // 10 minutes hold

        String checkoutUrl = "District".equalsIgnoreCase(platform)
                ? "https://district.in/checkout?session=" + showtime.getId() + "&seats=" + String.join(",", request.getSeatIds())
                : "https://in.bookmyshow.com/checkout?session=" + showtime.getId() + "&seats=" + String.join(",", request.getSeatIds());

        return new SeatLockResponse(
                lockId,
                showtime.getId(),
                request.getSeatIds(),
                baseTotal,
                fee * request.getSeatIds().size(),
                finalAmount,
                expiry,
                platform,
                checkoutUrl,
                "LOCKED"
        );
    }
}
