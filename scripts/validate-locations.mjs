#!/usr/bin/env node
/**
 * Location Validator Script
 * 
 * Run: node scripts/validate-locations.js
 * 
 * This script validates that all trip coordinates are reasonable
 * and shows a preview of where each location should appear.
 */

import { trips } from '../src/data/trips.js';

console.log('\n📍 LOCATION VALIDATOR\n');
console.log('='.repeat(60));

const KNOWN_LOCATIONS = {
    'san-francisco': { lat: 37.7749, lng: -122.4194, region: 'North America' },
    'san-diego': { lat: 32.7157, lng: -117.1611, region: 'North America' },
    'durham': { lat: 35.9940, lng: -78.8986, region: 'North America' },
    'iceland': { lat: 64.9631, lng: -19.0208, region: 'Europe' },
    'morocco': { lat: 31.7917, lng: -7.0926, region: 'Africa' },
    'cairo': { lat: 30.0444, lng: 31.2357, region: 'Africa/Middle East' },
    'japan': { lat: 36.2048, lng: 138.2529, region: 'Asia' },
    'new-zealand': { lat: -40.9006, lng: 174.8860, region: 'Oceania' },
    'patagonia': { lat: -50.9346, lng: -73.0275, region: 'South America' },
};

trips.forEach((trip, index) => {
    const known = KNOWN_LOCATIONS[trip.id];

    console.log(`\n${index + 1}. ${trip.name} (${trip.country})`);
    console.log(`   Coordinates: lat=${trip.coordinates.lat}, lng=${trip.coordinates.lng}`);

    // Basic validation
    if (trip.coordinates.lat < -90 || trip.coordinates.lat > 90) {
        console.log('   ❌ ERROR: Latitude must be between -90 and 90');
    }
    if (trip.coordinates.lng < -180 || trip.coordinates.lng > 180) {
        console.log('   ❌ ERROR: Longitude must be between -180 and 180');
    }

    // Hemisphere check
    const latHemi = trip.coordinates.lat >= 0 ? 'Northern' : 'Southern';
    const lngHemi = trip.coordinates.lng >= 0 ? 'Eastern' : 'Western';
    console.log(`   📍 ${latHemi} Hemisphere, ${lngHemi} Hemisphere`);

    // Compare with known location if available
    if (known) {
        const latDiff = Math.abs(trip.coordinates.lat - known.lat);
        const lngDiff = Math.abs(trip.coordinates.lng - known.lng);

        if (latDiff < 1 && lngDiff < 1) {
            console.log(`   ✅ Matches expected location in ${known.region}`);
        } else {
            console.log(`   ⚠️  Differs from expected: lat=${known.lat}, lng=${known.lng}`);
        }
    }

    // Album count
    console.log(`   📷 ${trip.albums.length} album(s), ${trip.albums.reduce((sum, a) => sum + a.photos.length, 0)} photo(s)`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ Validation complete!\n');

// Preview travel order
console.log('🌍 TRAVEL ORDER (camera will follow this path):\n');
trips.forEach((trip, index) => {
    const arrow = index < trips.length - 1 ? ' →' : '';
    console.log(`   ${index + 1}. ${trip.name}${arrow}`);
});
console.log('\n');
