// ══════════════════════════════════════════
// 📏 ROUTE PROGRESS — how much of the route is left to walk
// ══════════════════════════════════════════
// Measures the remaining distance ALONG the route line (not a straight line
// to the destination): from the point on the route nearest to you, following
// every bend, to the end of the route.
//
//   RouteProgress.remainingMeters(lat, lng, routeCoordinates)
//     → { remaining, offRoute, fromRoute }   (or null if there's no route)
//        remaining  — meters left along the route
//        fromRoute  — how far you are from the route line
//        offRoute   — true when you're more than OFF_ROUTE_M away from it,
//                     so "remaining" isn't trustworthy
//
//   RouteProgress.routeEndFor(destination) → [lat, lng] of the end of the
//     current route if it leads to that destination, otherwise null
//
// Used by script.js (Arrived button) and route-auto-popup.js.

(function () {
    'use strict';

    const OFF_ROUTE_M = 30;

    const R = 6371000;
    const rad = d => d * Math.PI / 180;
    const toLatLng = c => Array.isArray(c) ? { lat: c[0], lng: c[1] } : { lat: c.lat, lng: c.lng };

    function meters(a, b) {
        const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    }

    function remainingMeters(lat, lng, routeCoordinates) {
        if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) return null;
        const pts = routeCoordinates.map(toLatLng);
        const me = { lat, lng };

        // Flat x/y in meters around the user — accurate enough at campus scale.
        const mLat = 111320, mLng = 111320 * Math.cos(rad(lat));

        // Find the route segment closest to the user, and where on it they are.
        let best = null;
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i], b = pts[i + 1];
            const bx = (b.lng - a.lng) * mLng, by = (b.lat - a.lat) * mLat;
            const px = (lng - a.lng) * mLng, py = (lat - a.lat) * mLat;
            const len2 = bx * bx + by * by;
            const t = len2 ? Math.max(0, Math.min(1, (px * bx + py * by) / len2)) : 0;
            const proj = { lat: a.lat + t * (b.lat - a.lat), lng: a.lng + t * (b.lng - a.lng) };
            const d = meters(me, proj);
            if (!best || d < best.fromRoute) best = { i, proj, fromRoute: d };
        }

        // From the projected point to the end of its segment, then every
        // remaining segment to the end of the route.
        let remaining = meters(best.proj, pts[best.i + 1]);
        for (let j = best.i + 1; j < pts.length - 1; j++) remaining += meters(pts[j], pts[j + 1]);

        return {
            remaining,
            fromRoute: best.fromRoute,
            offRoute: best.fromRoute > OFF_ROUTE_M
        };
    }

    // The last point of the current route, if that route goes to `destination`.
    // Routes to a building end at its door (campus-router.js), which can be
    // 20+ m from the building's center point in campus-data.js — so the
    // arrival check in script.js also accepts "standing at the end of the route".
    function routeEndFor(destination) {
        const route = typeof state !== 'undefined' ? state.currentRoute : null;
        if (!route || !destination || !route.destination || !Array.isArray(route.coordinates) || route.coordinates.length < 2) return null;
        const a = toLatLng(route.destination.coords || []);
        const b = toLatLng(destination.coords || []);
        if (!Number.isFinite(a.lat) || !Number.isFinite(b.lat) || meters(a, b) > 1) return null;   // a different destination
        const end = toLatLng(route.coordinates[route.coordinates.length - 1]);
        return [end.lat, end.lng];
    }

    window.RouteProgress = { remainingMeters, routeEndFor, OFF_ROUTE_M };
})();