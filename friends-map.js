// ══════════════════════════════════════════
// 📍 FRIENDS MAP — share my position + show friends on the map (browser side)
// ══════════════════════════════════════════
// Works together with friends.js (browser) and server/friend-locations.js (server).
//
// Sharing rules (all must be true):
//   • you're a student/employee (FriendsWidget.canUseFriends())
//   • Find My Location is running (state.watchId) and has a position
//   • you're inside the campus boundary
//   • "Share my location with friends" is switched on
// You see friends on the map under the same rules — only while you share too.
//
// script.js only calls:
//   FriendLocations.onEvent(data) — for 'friendLocation' / 'friendLocationStop' events
//   FriendLocations.stop()        — on logout (before the session is removed)

(function () {
    'use strict';

    const LOOP_MS = 2000;            // how often the sharing rules are checked
    const MIN_SEND_GAP_MS = 5000;    // never send faster than this
    const KEEPALIVE_MS = 20000;      // re-send even when standing still
    const MIN_MOVE_M = 4;            // or as soon as you've moved this far
    const MAX_SHARE_ACCURACY_M = 50; // fixes rougher than this aren't shared
    const FADE_AFTER_MS = 45000;     // friend marker turns faded
    const REMOVE_AFTER_MS = 120000;  // friend marker removed

    const st = {
        sharing: false,              // we've sent a position and not stopped since
        lastSent: null,              // { lat, lng, at }
        sending: false,
        blocked: false,              // server said this account can't use Friends
        markers: new Map(),          // userId -> { marker, el, data, map }
        popup: null,
        warnedLowAccuracy: false     // "turn on precise location" shown once
    };

    // ── Access to script.js globals (top-level const/functions are shared) ──
    const appState = () => (typeof state !== 'undefined' ? state : null);
    const currentMap = () => appState()?.map || null;

    function getToken() {
        try { return JSON.parse(localStorage.getItem('campusNavigatorSession') || 'null')?.token || ''; } catch { return ''; }
    }

    function insideCampus(lat, lng) {
        try {
            const campus = campusData[appState().currentCampus];
            if (!campus?.boundary) return true;
            return isPointInsideBoundary([lat, lng], campus.boundary);
        } catch { return false; }
    }

    function metersBetween(a, b) {
        if (typeof calculateDistance === 'function') return calculateDistance([a.lat, a.lng], [b.lat, b.lng]);
        const R = 6371000, toRad = x => x * Math.PI / 180;
        const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    }

    function shouldShare() {
        const fw = window.FriendsWidget;
        const s = appState();
        if (st.blocked || !fw || !fw.canUseFriends() || fw.isSharingPaused()) return false;
        if (!s || !s.watchId || !s.userLocation) return false;
        return insideCampus(s.userLocation.lat, s.userLocation.lng);
    }

    // ── Sending ───────────────────────────────
    async function sendPosition(loc) {
        st.sending = true;
        try {
            const res = await fetch('/api/location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: loc.lat, lng: loc.lng, accuracy: loc.accuracy })
            });
            const data = await res.json().catch(() => ({}));
            if (res.status === 401 || res.status === 403) { st.blocked = true; clearAll(); return; }
            if (!res.ok || !data.ok) return;          // e.g. outside campus — try again next loop
            st.sharing = true;
            st.lastSent = { lat: loc.lat, lng: loc.lng, at: Date.now() };
            (data.friends || []).forEach(upsertFriend);
        } catch {
            /* offline — the next loop retries */
        } finally {
            st.sending = false;
        }
    }

    // Stops sharing and removes friends from the map.
    function stop() {
        if (st.sharing) {
            st.sharing = false;
            fetch('/api/location/stop', { method: 'POST', keepalive: true }).catch(() => {});
        }
        st.lastSent = null;
        clearAll();
    }

    function tick() {
        if (!shouldShare()) {
            if (st.sharing || st.markers.size) stop();
            return;
        }
        refreshMarkers();
        if (st.sending) return;
        const s = appState();
        const loc = s.userDisplayLocation || s.userLocation;   // same point as your own blue dot
        if (loc.accuracy > MAX_SHARE_ACCURACY_M) {
            if (!st.warnedLowAccuracy && typeof window.showNotification === 'function') {
                st.warnedLowAccuracy = true;
                window.showNotification(`Your location is too rough to share with friends (±${Math.round(loc.accuracy)} m). Turn on Precise Location for your browser.`, 'warning');
            }
            return;                                             // wait for a better fix
        }
        const now = Date.now();
        const last = st.lastSent;
        const due = !last
            || now - last.at >= KEEPALIVE_MS
            || (now - last.at >= MIN_SEND_GAP_MS && metersBetween(last, loc) >= MIN_MOVE_M);
        if (due) sendPosition(loc);
    }

    // ── Friend markers ────────────────────────
    function firstName(name) {
        return String(name || '').trim().split(/\s+/)[0] || 'Friend';
    }

    function buildMarkerElement(data) {
        const wrap = document.createElement('div');
        wrap.className = 'friend-marker';
        wrap.setAttribute('role', 'button');
        wrap.setAttribute('aria-label', `${data.name} (friend)`);

        const avatar = document.createElement('div');
        avatar.className = 'friend-marker-avatar';
        const label = document.createElement('div');
        label.className = 'friend-marker-name';
        const pointer = document.createElement('div');
        pointer.className = 'friend-marker-pointer';   // its tip = the friend's exact position
        wrap.append(label, avatar, pointer);
        fillMarkerElement(wrap, data);

        wrap.addEventListener('click', (e) => {
            e.stopPropagation();
            const entry = st.markers.get(wrap.dataset.userId);
            if (entry) openPopup(entry);
        });
        return wrap;
    }

    function fillMarkerElement(wrap, data) {
        wrap.dataset.userId = data.userId;
        wrap.querySelector('.friend-marker-name').textContent = firstName(data.name);
        const avatar = wrap.querySelector('.friend-marker-avatar');
        const fw = window.FriendsWidget;
        const wantPhoto = data.hasPhoto ? fw.photoUrl(data.userId, data.photoVersion) : '';
        if (avatar.dataset.src === wantPhoto && avatar.childNodes.length) return;
        avatar.dataset.src = wantPhoto;
        const showInitials = () => { avatar.replaceChildren(); avatar.textContent = fw.initials(data.name); };
        if (wantPhoto) {
            const img = document.createElement('img');
            img.alt = '';
            img.src = wantPhoto;
            img.onerror = showInitials;
            avatar.replaceChildren(img);
        } else {
            showInitials();
        }
    }

    function upsertFriend(data) {
        const map = currentMap();
        if (!map || typeof maplibregl === 'undefined') return;
        let entry = st.markers.get(data.userId);
        if (!entry) {
            const el = buildMarkerElement(data);
            const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
                .setLngLat([data.lng, data.lat])
                .addTo(map);
            entry = { marker, el, data, map };
            st.markers.set(data.userId, entry);
        } else {
            entry.data = data;
            entry.marker.setLngLat([data.lng, data.lat]);
            fillMarkerElement(entry.el, data);
        }
        entry.el.classList.remove('is-stale');
        if (st.popup && st.popup._friendId === data.userId) {
            st.popup.setLngLat([data.lng, data.lat]);
            st.popup._meta.textContent = popupMeta(data);
        }
    }

    function removeFriend(userId) {
        const entry = st.markers.get(userId);
        if (!entry) return;
        entry.marker.remove();
        st.markers.delete(userId);
        if (st.popup && st.popup._friendId === userId) { st.popup.remove(); st.popup = null; }
    }

    function clearAll() {
        [...st.markers.keys()].forEach(removeFriend);
        if (st.popup) { st.popup.remove(); st.popup = null; }
    }

    // Fade / remove old positions, and move markers over if the map was rebuilt.
    function refreshMarkers() {
        const now = Date.now();
        const map = currentMap();
        const friendIds = new Set((window.FriendsWidget?.getFriends() || []).map(f => f.userId));
        for (const [userId, entry] of st.markers) {
            const age = now - entry.data.at;
            if (age > REMOVE_AFTER_MS || (friendIds.size && !friendIds.has(userId))) { removeFriend(userId); continue; }
            entry.el.classList.toggle('is-stale', age > FADE_AFTER_MS);
            if (map && entry.map !== map) { entry.marker.addTo(map); entry.map = map; }
        }
    }

    function timeAgo(at) {
        const s = Math.max(0, Math.round((Date.now() - at) / 1000));
        if (s < 10) return 'just now';
        if (s < 60) return `${s} s ago`;
        return `${Math.round(s / 60)} min ago`;
    }

    function popupMeta(data) {
        return `Updated ${timeAgo(data.at)}` + (data.accuracy ? ` · ±${data.accuracy} m` : '');
    }

    function openPopup(entry) {
        const map = currentMap();
        if (!map) return;
        if (st.popup) st.popup.remove();

        const box = document.createElement('div');
        box.className = 'friend-popup';
        const name = document.createElement('div');
        name.className = 'friend-popup-name';
        name.textContent = entry.data.name;
        const meta = document.createElement('div');
        meta.className = 'friend-popup-meta';
        meta.textContent = popupMeta(entry.data);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'friend-popup-btn';
        btn.textContent = '🧭 Navigate to friend';
        btn.addEventListener('click', () => navigateToFriend(entry.data));
        box.append(name, meta, btn);

        st.popup = new maplibregl.Popup({ offset: 76, closeButton: true, maxWidth: '240px' })
            .setLngLat([entry.data.lng, entry.data.lat])
            .setDOMContent(box)
            .addTo(map);
        st.popup._friendId = entry.data.userId;
        st.popup._meta = meta;
        st.popup.on('close', () => { if (st.popup && st.popup._friendId === entry.data.userId) st.popup = null; });
    }

    // Routes to where the friend is right now (the route doesn't follow them
    // if they keep walking — tap their marker again for a fresh route).
    function navigateToFriend(data) {
        const s = appState();
        if (!s) return;
        if (st.popup) { st.popup.remove(); st.popup = null; }
        const destination = {
            id: `friend_${data.userId}`,
            name: `${data.name} (friend)`,
            coords: [data.lat, data.lng],
            matchType: 'friend'
        };
        s.selectedLocation = destination;
        s.isRoomNavigation = false;
        s._routeRecordedThisNav = false;
        if (s.multiStop?.active && typeof msAddLocationAsStop === 'function') {
            msAddLocationAsStop(destination);
        } else if (typeof navigateToSelected === 'function') {
            navigateToSelected();
        }
    }

    // ── Realtime events (called from script.js) ──
    function onEvent(data) {
        if (!data || !data.userId) return;
        if (data.type === 'friendLocationStop') { removeFriend(data.userId); return; }
        if (data.type === 'friendLocation' && st.sharing && shouldShare()) upsertFriend(data);
    }

    // ── Wiring ────────────────────────────────
    window.addEventListener('friends:sharing-changed', () => { st.blocked = false; tick(); });
    window.addEventListener('friends:list-changed', () => refreshMarkers());

    // A friend changed their profile photo → swap the picture on their marker now.
    window.addEventListener('friends:photo-changed', (e) => {
        const { userId, hasPhoto, photoVersion } = e.detail || {};
        const entry = st.markers.get(userId);
        if (!entry) return;
        entry.data = { ...entry.data, hasPhoto, photoVersion };
        fillMarkerElement(entry.el, entry.data);
    });

    // Closing the tab/app: tell the server right away (the 2-minute timeout
    // and the closed realtime connection would also catch it).
    window.addEventListener('pagehide', () => {
        if (!st.sharing) return;
        const token = getToken();
        if (token && navigator.sendBeacon) {
            navigator.sendBeacon(`/api/location/stop?token=${encodeURIComponent(token)}`);
        }
        st.sharing = false;
        st.lastSent = null;
    });

    setInterval(tick, LOOP_MS);

    window.FriendLocations = {
        onEvent,
        stop: () => { stop(); st.blocked = false; },
        isSharing: () => st.sharing
    };
})();