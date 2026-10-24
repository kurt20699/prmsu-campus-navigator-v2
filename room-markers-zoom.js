// ══════════════════════════════════════════
// 🚪 ROOM ICONS THAT STAY PUT WHEN ZOOMING
// ══════════════════════════════════════════
// Each room icon can have an `iconOffset` in campus-data.js — a small nudge
// in screen pixels that spreads rooms sharing almost the same spot. Those
// pixels were tuned at zoom 19 (where "Show Rooms" opens), but a pixel
// offset stays the same size at every zoom while the map itself shrinks or
// grows, so on zoom-out the icons drifted away from their building
// ("spreading out") and on zoom-in they bunched up.
//
// This file scales (and rotates) every room's nudge together with the map,
// so each icon stays pinned to the same spot on the building at any zoom or
// rotation. The icons themselves keep one fixed size. Below MIN_ZOOM, where
// the icons would pile up into one blob over the building, they are hidden
// and come back as you zoom in again.
//
// Uses script.js globals (state, RoomMarkerManager). script.js needs no
// changes for this file — just load it after script.js in index.html.

(function () {
    'use strict';

    const REFERENCE_ZOOM = 19;    // zoom the iconOffset values were designed at
    const MIN_ZOOM = 17;          // hide room icons when zoomed out further than this

    let attachedMap = null;

    const getMap = () => (typeof state !== 'undefined' && state.map) || null;
    const roomMarkers = () => (typeof state !== 'undefined' && state.rooms?.markers) || [];

    // Places one marker's icon: scaled + rotated nudge, or hidden when too far out.
    function placeMarker(marker, map) {
        const el = marker.getElement();
        const inner = el && el.querySelector('.room-marker-wrapper');
        if (!inner) return;

        const zoom = map.getZoom();
        el.style.visibility = zoom < MIN_ZOOM ? 'hidden' : '';

        const [ox, oy] = marker._roomIconOffset || [0, 0];
        const scale = Math.pow(2, zoom - REFERENCE_ZOOM);
        const b = -map.getBearing() * Math.PI / 180;       // turn the nudge with the map
        const x = (ox * Math.cos(b) - oy * Math.sin(b)) * scale;
        const y = (ox * Math.sin(b) + oy * Math.cos(b)) * scale;
        inner.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }

    function placeAll() {
        const map = getMap();
        if (!map) return;
        roomMarkers().forEach(m => placeMarker(m, map));
    }

    // Remember each room's original nudge on its marker as it is created.
    function hookRoomMarkers() {
        const mgr = typeof RoomMarkerManager !== 'undefined' ? RoomMarkerManager : null;
        if (!mgr || mgr._createRoomMarker._zoomAware) return;
        const original = mgr._createRoomMarker;
        mgr._createRoomMarker = function (room, ...rest) {
            const marker = original.call(this, room, ...rest);
            if (marker) {
                marker._roomIconOffset = Array.isArray(room.iconOffset) ? room.iconOffset : [0, 0];
                const map = getMap();
                if (map) placeMarker(marker, map);
            }
            return marker;
        };
        mgr._createRoomMarker._zoomAware = true;
    }

    // Follow every zoom/rotate frame of the 2D map (re-attaches if it's rebuilt).
    function attach() {
        const map = getMap();
        if (!map || map === attachedMap) return;
        attachedMap = map;
        map.on('zoom', placeAll);
        map.on('rotate', placeAll);
        placeAll();
    }

    hookRoomMarkers();
    attach();
    setInterval(attach, 1000);
})();