"""
Real-Time All-India Box Office Tracker - Python Ingestion & Bridge CLI
Accepts live scraped show counts, booked ticket quantities, status,
and gross metrics and pushes them dynamically to the Spring Boot backend.

Usage:
  python bms_district_tracker.py --movie "Devara: Part 1" --city "Hyderabad (Nizam)" --platform "BookMyShow" --shows 24 --booked 3800 --total 4200 --soldout 14 --fastfilling 7 --gross 1520000
"""

import sys
import argparse
import requests
from typing import Dict, Any, List

BACKEND_INGEST_URL = "http://localhost:8080/api/boxoffice/ingest"

class BoxOfficeScraper:
    def __init__(self, backend_url: str = BACKEND_INGEST_URL):
        self.backend_url = backend_url
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36",
            "Content-Type": "application/json"
        }

    def push_batch_to_backend(self, movie_id: str, movie_title: str, city: str, platform: str, 
                              additional_shows: int, total_seats: int, additional_booked_seats: int, 
                              sold_out_shows: int, fast_filling_shows: int, available_shows: int,
                              gross_inr: float):
        """
        Pushes verified scraped metrics to the Spring Boot Box Office backend.
        """
        payload = {
            "movieId": movie_id,
            "movieTitle": movie_title,
            "city": city,
            "platform": platform,
            "additionalShows": additional_shows,
            "totalSeatsInBatch": total_seats,
            "additionalSeatsBooked": additional_booked_seats,
            "soldOutShows": sold_out_shows,
            "fastFillingShows": fast_filling_shows,
            "availableShows": available_shows,
            "additionalGrossInr": gross_inr
        }

        try:
            res = requests.post(self.backend_url, json=payload, headers=self.headers, timeout=5)
            if res.status_code == 200:
                print(f"[OK] Successfully ingested {additional_shows} show(s) for '{movie_title or movie_id}' in {city} via {platform}")
            else:
                print(f"[Error] Backend returned {res.status_code}: {res.text}")
        except Exception as e:
            print(f"[Connection Error] Could not reach backend at {self.backend_url}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest live scraped box office show data into the BoxOfficePulse backend.")
    parser.add_argument("--movie", type=str, help="Movie Title (e.g., 'Devara: Part 1', 'Stree 2', 'Tumbbad')")
    parser.add_argument("--movieId", type=str, help="Unique Movie ID slug", default=None)
    parser.add_argument("--city", type=str, help="City or circuit name", default="National Circuit")
    parser.add_argument("--platform", type=str, help="Ticketing platform (BookMyShow, District, PVR)", default="BookMyShow")
    parser.add_argument("--shows", type=int, help="Total number of shows in this batch", default=1)
    parser.add_argument("--total", type=int, help="Total seating capacity across these shows", default=200)
    parser.add_argument("--booked", type=int, help="Total seats booked across these shows", default=0)
    parser.add_argument("--soldout", type=int, help="Count of 100% housefull shows", default=0)
    parser.add_argument("--fastfilling", type=int, help="Count of fast-filling shows (>60% occupancy)", default=0)
    parser.add_argument("--available", type=int, help="Count of shows with ample availability", default=0)
    parser.add_argument("--gross", type=float, help="Gross ticket collection in ₹ INR", default=0.0)

    args = parser.parse_args()

    if not args.movie and not args.movieId:
        parser.print_help()
        sys.exit(0)

    movie_title = args.movie or args.movieId
    movie_id = args.movieId or ("mov-" + movie_title.lower().replace(" ", "-").replace(":", ""))

    scraper = BoxOfficeScraper()
    scraper.push_batch_to_backend(
        movie_id=movie_id,
        movie_title=movie_title,
        city=args.city,
        platform=args.platform,
        additional_shows=args.shows,
        total_seats=args.total,
        additional_booked_seats=args.booked,
        sold_out_shows=args.soldout,
        fast_filling_shows=args.fastfilling,
        available_shows=args.available,
        gross_inr=args.gross
    )
