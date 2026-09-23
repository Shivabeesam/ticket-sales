/**
 * Real-Time All-India Box Office Tracker - Ingestion & Bridge Script (Node.js)
 * 
 * Extracts live show counts, booked ticket counts, fast-filling/sold-out status,
 * and gross box office metrics across BookMyShow, District (Zomato), and PVR INOX.
 *
 * Usage:
 *   node bms_district_tracker.js --movie "Devara: Part 1" --city "Hyderabad (Nizam)" --platform "BookMyShow" --shows 24 --booked 3850 --total 4200 --soldout 14 --fastfilling 8 --gross 1540000
 */

const http = require('http');

const BACKEND_INGEST_URL = process.env.INGEST_URL || 'http://localhost:8080/api/boxoffice/ingest';

// ==============================================================================
// 1. IN-BROWSER CONSOLE EXTRACTOR (DevTools F12 on BookMyShow / District / PVR)
// ==============================================================================
/*
(async function extractAndSyncLiveShow(targetMovieId) {
    const allSeats = document.querySelectorAll('._available, ._blocked, ._sold, [data-seat-status]');
    const soldSeats = document.querySelectorAll('._blocked, ._sold, [data-seat-status="booked"]');
    const total = allSeats.length || 180;
    const booked = soldSeats.length;
    const occupancyPct = total > 0 ? (booked / total) : 0;
    
    let soldOut = (occupancyPct >= 0.95) ? 1 : 0;
    let fastFilling = (occupancyPct >= 0.60 && occupancyPct < 0.95) ? 1 : 0;
    let available = (occupancyPct < 0.60) ? 1 : 0;
    
    // Average price estimation based on visible seat tiers
    let estGross = booked * 300; 

    const payload = {
        movieId: targetMovieId,
        city: window.location.hostname.includes('bookmyshow') ? 'Live City (BMS)' : 'Live City (District)',
        platform: window.location.hostname.includes('bookmyshow') ? 'BookMyShow' : 'District',
        additionalShows: 1,
        totalSeatsInBatch: total,
        additionalSeatsBooked: booked,
        soldOutShows: soldOut,
        fastFillingShows: fastFilling,
        availableShows: available,
        additionalGrossInr: estGross
    };

    const res = await fetch('http://localhost:8080/api/boxoffice/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        console.log('%c[BoxOfficePulse] Live show successfully ingested!', 'color:#10b981;font-weight:bold;', payload);
    }
})();
*/

// ==============================================================================
// 2. CLI BATCH PUSHER
// ==============================================================================
async function pushBatch(batchData) {
  const payload = JSON.stringify(batchData);
  const url = new URL(BACKEND_INGEST_URL);
  
  const options = {
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log(`[HTTP ${res.statusCode}] Ingested ${batchData.additionalShows} show(s) in "${batchData.city}" via ${batchData.platform} for ${batchData.movieTitle || batchData.movieId}`);
        resolve(data);
      });
    });

    req.on('error', (err) => {
      console.error(`[Connection Error] Could not connect to backend at ${BACKEND_INGEST_URL}: ${err.message}`);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
      params[key] = val;
    }
  }
  return params;
}

async function main() {
  const params = parseArgs();

  if (!params.movie && !params.movieId) {
    console.log(`
--- Real-Time Box Office Ingestion CLI ---
Usage:
  node bms_district_tracker.js --movie "<Title>" --city "<City>" --platform "<BMS/District/PVR>" --shows <N> --booked <N> --total <N> --gross <INR>

Example:
  node bms_district_tracker.js --movie "Devara: Part 1" --city "Hyderabad (Nizam)" --platform "BookMyShow" --shows 20 --booked 3200 --total 3600 --gross 1280000
    `);
    process.exit(0);
  }

  const movieTitle = params.movie || params.movieId;
  const movieId = params.movieId || ('mov-' + movieTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

  await pushBatch({
    movieId,
    movieTitle,
    city: params.city || 'National Circuit',
    platform: params.platform || 'BookMyShow',
    additionalShows: parseInt(params.shows) || 1,
    totalSeatsInBatch: parseInt(params.total) || 200,
    additionalSeatsBooked: parseInt(params.booked) || 0,
    soldOutShows: parseInt(params.soldout) || 0,
    fastFillingShows: parseInt(params.fastfilling) || 0,
    additionalGrossInr: parseFloat(params.gross) || 0.0,
  });
}

main().catch(console.error);
