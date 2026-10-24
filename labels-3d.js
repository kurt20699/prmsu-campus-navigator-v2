// ══════════════════════════════════════════
// 🏷️ 3D LABELS ON TOP OF BUILDINGS
// ══════════════════════════════════════════
// In 3D View the building labels are map markers, which MapLibre always
// pins to the GROUND — so on a tilted map they float at the foot of each
// building instead of above it. This lifts every label by the on-screen
// height of the building it sits on, recalculated whenever the camera
// moves, so it stays on the roof at any tilt, zoom or rotation.
//
// Uses script.js globals (map3dState). script.js needs no changes —
// just load this file after it in index.html.

(function () {
    'use strict';

    // Must match 'fill-extrusion-height' in script.js: ['*', ['get', 'height'], 2]
    const HEIGHT_MULTIPLIER = 2;
    const DEFAULT_HEIGHT = 4;          // used when a footprint has no height
    const GAP_PX = 10;                 // space between the roof and the label

    let attachedMap = null;
    const heights = new Map();         // marker -> building height in meters (0 = not on a building)

    const getMap = () => (typeof map3dState !== 'undefined' && map3dState.map) || null;
    const getMarkers = () => (typeof map3dState !== 'undefined' && map3dState.markers) || [];

    // Every 3D building currently shown: hard-coded outlines + admin-drawn ones.
    function buildingFeatures(map) {
        const list = [];
        for (const id of ['building-footprints', 'dynamic-building-footprints']) {
            try {
                const src = map.getSource(id);
                if (src) list.push(...(src.serialize().data.features || []));
            } catch { /* source not ready yet */ }
        }
        return list;
    }

    // Ray-casting point-in-polygon on [lng, lat] rings.
    function inside(lng, lat, ring) {
        let hit = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const [xi, yi] = ring[i], [xj, yj] = ring[j];
            if ((yi > lat) !== (yj > lat) && lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) hit = !hit;
        }
        return hit;
    }

    function heightAt(lng, lat, features) {
        let best = 0;
        for (const f of features) {
            if (f?.geometry?.type !== 'Polygon') continue;
            if (!inside(lng, lat, f.geometry.coordinates[0])) continue;
            const h = (Number(f.properties?.height) || DEFAULT_HEIGHT) * HEIGHT_MULTIPLIER;
            if (h > best) best = h;
        }
        return best;
    }

    // Works out which building each label stands on (cheap — runs every 2 s
    // so new/edited buildings and re-created labels are picked up).
    function refreshHeights() {
        const map = getMap();
        if (!map) return;
        const features = buildingFeatures(map);
        heights.clear();
        for (const marker of getMarkers()) {
            const ll = marker.getLngLat();
            heights.set(marker, heightAt(ll.lng, ll.lat, features));
        }
        updateOffsets();
    }

    // How many screen pixels one meter is at a given spot, measured sideways
    // to the camera so tilt doesn't squash it (nearer = bigger, farther = smaller).
    function pixelsPerMeter(map, ll) {
        const d = 10;                                          // meters
        const theta = (map.getBearing() + 90) * Math.PI / 180;
        const other = {
            lng: ll.lng + (d * Math.sin(theta)) / (111320 * Math.cos(ll.lat * Math.PI / 180)),
            lat: ll.lat + (d * Math.cos(theta)) / 111320
        };
        const a = map.project(ll), b = map.project(other);
        return Math.hypot(b.x - a.x, b.y - a.y) / d;
    }

    function updateOffsets() {
        const map = getMap();
        if (!map) return;
        const tilt = Math.sin(map.getPitch() * Math.PI / 180);
        for (const marker of getMarkers()) {
            const h = heights.get(marker) || 0;
            let lift = 0;
            if (h > 0 && tilt > 0.02) {
                lift = h * pixelsPerMeter(map, marker.getLngLat()) * tilt + GAP_PX;
            }
            marker.setOffset([0, -Math.round(lift)]);
        }
    }

    // script.js rebuilds all 3D labels every 15 s (database resync) and when
    // you change category or re-enter 3D View. New labels start on the ground,
    // so lift them in the same step — otherwise they'd drop and jump back up.
    function hookLabelRebuilds() {
        if (typeof window.add3DMarkers !== 'function' || window.add3DMarkers._lifts3dLabels) return;
        const original = window.add3DMarkers;
        const wrapped = function (...args) {
            const result = original.apply(this, args);
            refreshHeights();
            return result;
        };
        wrapped._lifts3dLabels = true;
        window.add3DMarkers = wrapped;
    }
    hookLabelRebuilds();

    // Attach to the 3D map once it exists (and again if it is ever rebuilt).
    setInterval(() => {
        const map = getMap();
        if (!map) return;
        if (map !== attachedMap) {
            attachedMap = map;
            map.on('move', updateOffsets);
        }
        refreshHeights();
    }, 2000);
})();