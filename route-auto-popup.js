// ══════════════════════════════════════════
// 🧭 ROUTE DETAILS AUTO-POPUP
// ══════════════════════════════════════════
// While navigating with the Route Details panel minimized, this reopens it:
//   • once when you get within 50 m of the destination, so the
//     "✅ Arrived" button is visible without having to open the panel.
// Minimizing it again simply starts a new 50 m count.
//
// Uses script.js globals (state, setNavigationMode, evaluateArrival,
// calculateDistance). script.js needs no changes — just load this file
// after it in index.html.

(function () {
    'use strict';

    const POPUP_EVERY_M = Infinity;   // no popups while walking — only when the Arrived button is ready
    const POPUP_NEAR_DESTINATION = true;
    const CHECK_EVERY_MS = 2000;
    const MIN_STEP_M = 3;             // ignore GPS jitter smaller than this

    const st = {
        wasHidden: false,
        walked: 0,                    // meters walked since the panel was minimized
        lastPos: null,
        nearShownFor: null            // destination already popped for "near"
    };

    const appState = () => (typeof state !== 'undefined' ? state : null);
    const panel = () => document.getElementById('routeInfo');

    function meters(a, b) {
        return calculateDistance([a.lat, a.lng], [b.lat, b.lng]);
    }

    // Don't pop up over something the user is busy with.
    function somethingElseOpen() {
        if (typeof map3dState !== 'undefined' && map3dState.active) return true;
        if (document.getElementById('profilePanel')?.classList.contains('open')) return true;
        if (document.getElementById('locationModal')?.classList.contains('active')) return true;
        const addStop = document.getElementById('msAddStopModal');
        if (addStop && addStop.style.display && addStop.style.display !== 'none') return true;
        return false;
    }

    function destinationKey(dest) {
        return dest ? (dest.id || `${dest.name}@${dest.coords}`) : null;
    }

    function open(reason) {
        if (typeof setNavigationMode === 'function') setNavigationMode('route');
        else panel()?.classList.remove('hidden');
        st.walked = 0;
        st.lastPos = null;
        st.wasHidden = false;
        console.log('🧭 Route Details reopened:', reason);
    }

    function tick() {
        const s = appState();
        const p = panel();
        if (!s || !p || !s.currentRoute) {        // not navigating
            st.wasHidden = false;
            st.walked = 0;
            st.lastPos = null;
            if (!s?.currentRoute) st.nearShownFor = null;
            return;
        }

        const loc = s.userLocation;
        if (!loc) return;

        // ── How close are we? (same rule as the Arrived button in script.js:
        // 50 m left ALONG the route, or the straight-line rule when off it.)
        const dest = s.currentRoute.destination || s.selectedLocation;
        const key = destinationKey(dest);
        const left = window.RouteProgress?.remainingMeters(loc.lat, loc.lng, s.currentRoute.coordinates);
        const near = left && !left.offRoute
            ? left.remaining <= ARRIVAL_NEAR_RADIUS_M
            : (dest && typeof evaluateArrival === 'function'
                ? evaluateArrival(loc.lat, loc.lng, loc.accuracy, dest).near
                : false);

        // Keep the Arrived button in step with the panel. script.js only
        // re-checks it every 3 seconds, which made it lag behind the popup.
        const arrived = document.getElementById('msArrivedSection');
        if (arrived && near) arrived.style.display = 'block';

        const hidden = p.classList.contains('hidden');
        if (!hidden) {                            // panel is open — the user can already see it
            st.wasHidden = false;
            if (near) st.nearShownFor = key;      // no need to pop up again for this destination
            return;
        }

        // Panel was just minimized → start counting from here.
        if (!st.wasHidden) {
            st.wasHidden = true;
            st.walked = 0;
            st.lastPos = { lat: loc.lat, lng: loc.lng };
        }

        // Count real movement only (small GPS wobble is ignored).
        const step = meters(st.lastPos, loc);
        if (step >= MIN_STEP_M) {
            st.walked += step;
            st.lastPos = { lat: loc.lat, lng: loc.lng };
        }

        if (somethingElseOpen()) return;

        // Close to the destination → pop up once, with the Arrived button showing.
        if (POPUP_NEAR_DESTINATION && near && key !== st.nearShownFor) {
            st.nearShownFor = key;
            open('near destination');
            return;
        }

        // Walking popups stop in the last stretch before the destination, so
        // the next popup there is the one WITH the Arrived button.
        const finalStretch = POPUP_NEAR_DESTINATION && left && !left.offRoute
            && left.remaining <= ARRIVAL_NEAR_RADIUS_M + POPUP_EVERY_M;
        if (!finalStretch && st.walked >= POPUP_EVERY_M) open(`walked ${Math.round(st.walked)} m`);
    }

    setInterval(tick, CHECK_EVERY_MS);
})();