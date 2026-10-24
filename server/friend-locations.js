// ══════════════════════════════════════════
// 📍 FRIEND LOCATIONS — live location sharing between friends
// ══════════════════════════════════════════
// Loaded from server.js (after friends-routes.js) with:
//   require("./server/friend-locations.js")(app, { friendsApi, activeUserConnections });
//
// How it works:
//   • While Find My Location is on (and sharing isn't paused), the browser
//     sends its position to POST /api/location every few seconds.
//   • The server keeps ONLY the latest position per user, in memory.
//     Nothing is written to the database, so there is no location history.
//   • Each update is pushed (as a 'friendLocation' event on the realtime
//     stream) to accepted friends who are ALSO sharing right now — you only
//     see friends while they can see you too.
//   • A position is dropped when the user stops sharing, closes the app,
//     logs out, stops being friends, or sends nothing for 2 minutes.

// Rough box around the Iba campus (with a margin). Positions outside it are
// refused, so a home address can never be shared by mistake. The browser
// already checks the exact campus boundary before sending.
const CAMPUS_BOX = { south: 15.3135, west: 119.9785, north: 15.3230, east: 119.9890 };

const STALE_AFTER_MS = 2 * 60 * 1000;   // forget a position after 2 minutes of silence
const MIN_UPDATE_GAP_MS = 2000;         // ignore updates sent faster than this
const PROFILE_CACHE_MS = 60 * 1000;     // how long a user's friends list is cached
const SWEEP_EVERY_MS = 15 * 1000;

module.exports = function registerFriendLocations(app, { friendsApi, activeUserConnections }) {
  const { sendToUser, getFriendIds, loadUser, onPairChanged, onPhotoChanged } = friendsApi;

  const live = new Map();       // userId -> { lat, lng, accuracy, at, name, hasPhoto }
  const profiles = new Map();   // userId -> { ok, name, hasPhoto, friendIds: Set, until }

  // ── Who may share, and with whom (cached so a GPS update doesn't hit the DB every time) ──
  async function getProfile(userId) {
    const cached = profiles.get(userId);
    if (cached && cached.until > Date.now()) return cached;
    const user = await loadUser(userId, true);
    const profile = user && user.canUseFriends
      ? { ok: true, userId: user.user_id, name: user.full_name, hasPhoto: user.has_photo === true,
          photoVersion: user.photo_version || "",
          friendIds: new Set(await getFriendIds(user.user_id)), until: Date.now() + PROFILE_CACHE_MS }
      : { ok: false, until: Date.now() + PROFILE_CACHE_MS };
    profiles.set(userId, profile);
    return profile;
  }

  function publicLocation(userId, entry) {
    return {
      type: "friendLocation",
      userId,
      name: entry.name,
      hasPhoto: entry.hasPhoto,
      photoVersion: entry.photoVersion,
      lat: entry.lat,
      lng: entry.lng,
      accuracy: entry.accuracy,
      at: entry.at
    };
  }

  // Friends of userId who are sharing right now.
  function sharingFriends(profile) {
    return [...profile.friendIds].filter(id => live.has(id));
  }

  function stopSharing(userId, friendIds) {
    if (!live.delete(userId)) return;
    for (const id of friendIds) sendToUser(id, { type: "friendLocationStop", userId });
  }

  async function requireSharer(req, res, next) {
    if (!req.authUserId) return res.status(401).json({ ok: false, error: "Please log in again." });
    try {
      const profile = await getProfile(req.authUserId);
      if (!profile.ok) {
        return res.status(403).json({ ok: false, error: "Friends is only available for student and employee accounts." });
      }
      req.sharer = profile;
      next();
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ── POST /api/location — { lat, lng, accuracy } ──
  // Answers with the current positions of friends who are sharing, so the
  // map can show them right away instead of waiting for their next update.
  app.post("/api/location", requireSharer, (req, res) => {
    const me = req.sharer;
    const lat = Number(req.body?.lat), lng = Number(req.body?.lng);
    const accuracy = Math.max(0, Math.min(500, Number(req.body?.accuracy) || 0));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ ok: false, error: "Invalid location." });
    }
    const friendsNow = () => sharingFriends(me).map(id => publicLocation(id, live.get(id)));

    if (lat < CAMPUS_BOX.south || lat > CAMPUS_BOX.north || lng < CAMPUS_BOX.west || lng > CAMPUS_BOX.east) {
      stopSharing(me.userId, me.friendIds);
      return res.status(422).json({ ok: false, code: "OUTSIDE_CAMPUS", error: "Location is only shared inside the campus." });
    }

    const previous = live.get(me.userId);
    const now = Date.now();
    if (previous && now - previous.at < MIN_UPDATE_GAP_MS) {
      return res.json({ ok: true, friends: friendsNow() });   // too soon — keep the last one
    }

    const entry = {
      lat: Math.round(lat * 1e6) / 1e6,
      lng: Math.round(lng * 1e6) / 1e6,
      accuracy: Math.round(accuracy),
      at: now,
      name: me.name,
      hasPhoto: me.hasPhoto,
      photoVersion: me.photoVersion
    };
    live.set(me.userId, entry);

    const event = publicLocation(me.userId, entry);
    for (const id of sharingFriends(me)) sendToUser(id, event);

    return res.json({ ok: true, friends: friendsNow() });
  });

  // ── POST /api/location/stop — stop sharing now ──
  // Also accepts ?token=... so it can be sent with navigator.sendBeacon() when
  // the page closes (the login middleware reads the token from the URL).
  app.post("/api/location/stop", requireSharer, (req, res) => {
    stopSharing(req.sharer.userId, req.sharer.friendIds);
    return res.json({ ok: true });
  });

  // ── Became friends / stopped being friends → update both sides at once ──
  onPairChanged(async (a, b) => {
    profiles.delete(a);
    profiles.delete(b);
    const pa = await getProfile(a);
    const areFriends = pa.ok && pa.friendIds.has(b);
    const la = live.get(a), lb = live.get(b);
    if (areFriends && la && lb) {
      sendToUser(a, publicLocation(b, lb));
      sendToUser(b, publicLocation(a, la));
    } else if (!areFriends) {
      sendToUser(a, { type: "friendLocationStop", userId: b });
      sendToUser(b, { type: "friendLocationStop", userId: a });
    }
  });

  // ── Profile photo changed → use the new photo in future location updates ──
  // (friends-routes.js already sent friends a 'friendPhotoChanged' event.)
  onPhotoChanged(({ userId, hasPhoto, photoVersion }) => {
    profiles.delete(userId);
    const entry = live.get(userId);
    if (entry) { entry.hasPhoto = hasPhoto; entry.photoVersion = photoVersion; }
  });

  // ── Cleanup: silent for 2 minutes, or no app tab open anymore ──
  setInterval(async () => {
    const now = Date.now();
    for (const [userId, entry] of live) {
      const gone = !activeUserConnections.has(userId);
      if (gone || now - entry.at > STALE_AFTER_MS) {
        try {
          const profile = await getProfile(userId);
          stopSharing(userId, profile.ok ? profile.friendIds : []);
        } catch {
          live.delete(userId);
        }
      }
    }
    for (const [userId, p] of profiles) if (p.until < now) profiles.delete(userId);
  }, SWEEP_EVERY_MS).unref();

  return { isSharing: (userId) => live.has(userId) };
};