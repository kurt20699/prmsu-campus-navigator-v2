// ══════════════════════════════════════════
    // 👥 FRIENDS — server routes
    // ══════════════════════════════════════════
    // Loaded from server.js with:
    //   require("./server/friends-routes.js")(app, { pool, Permissions, activeUserConnections });
    //
    // Every route reads the user from the verified login token (req.authUserId),
    // never from the request body. Only approved Student and Employee accounts can
    // use Friends; Visitors and Admins get a "not available" error.

    const FRIENDS_ALLOWED_ROLES = ["STUDENT", "EMPLOYEE"];
    const MAX_PENDING_OUTGOING = 30;   // stops one account from spamming requests
    const MAX_FRIENDS = 200;

    module.exports = function registerFriendRoutes(app, { pool, Permissions, activeUserConnections }) {

    // ── Helpers ────────────────────────────────

    // Loads a user and says whether they are allowed to use Friends.
    // idOnly: match the User ID only (used for the logged-in user's own token).
    async function loadUser(identifier, idOnly = false) {
        const result = await pool.query(
        `SELECT user_id, full_name, role, email_verified, verification_status,
                (photo IS NOT NULL AND photo <> '') AS has_photo,
                LEFT(md5(COALESCE(photo, '')), 10) AS photo_version
        FROM users
        WHERE LOWER(user_id) = LOWER($1) ${idOnly ? "" : "OR LOWER(email) = LOWER($1)"}
        LIMIT 1`,
        [String(identifier).trim()]
        );
        const u = result.rows[0];
        if (!u) return null;
        const role = Permissions.normalizeRole(u.role);
        u.canUseFriends = FRIENDS_ALLOWED_ROLES.includes(role)
        && u.email_verified === true
        && u.verification_status !== "pending"
        && u.verification_status !== "rejected";
        return u;
    }

    // Route guard: only logged-in, approved students and employees get through.
    async function requireFriendsUser(req, res, next) {
        if (!req.authUserId) return res.status(401).json({ ok: false, error: "Please log in again." });
        try {
        const me = await loadUser(req.authUserId, true);
        if (!me) {
            return res.status(401).json({ ok: false, error: "Please log in again." });
        }
        if (!me.canUseFriends) {
            return res.status(403).json({ ok: false, error: "Friends is only available for student and employee accounts." });
        }
        req.friendsUser = me;
        next();
        } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
        }
    }

    // Sends a realtime event to every open tab of one user (via /api/realtime/stream).
    function sendToUser(userId, data) {
        const entry = activeUserConnections.get(String(userId));
        if (!entry) return;
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        for (const conn of entry.conns) {
        try { conn.write(payload); } catch { /* connection closing — ignore */ }
        }
    }

    // Other server modules (friend-locations.js) can react when two people
    // become friends or stop being friends.
    const pairListeners = [];
    const photoListeners = [];
    function notifyFriendsChanged(...userIds) {
        for (const id of userIds) sendToUser(id, { type: "friendsChanged", at: Date.now() });
        if (userIds.length === 2) {
        for (const fn of pairListeners) {
            Promise.resolve().then(() => fn(userIds[0], userIds[1])).catch(err => console.warn("Friends listener failed:", err.message));
        }
        }
    }

    // The friendship row between two users, whichever of them sent the request.
    async function findPair(a, b) {
        const result = await pool.query(
        `SELECT * FROM friendships
        WHERE (requester_id = $1 AND addressee_id = $2)
            OR (requester_id = $2 AND addressee_id = $1)
        LIMIT 1`,
        [a, b]
        );
        return result.rows[0] || null;
    }

    function personFromRow(row) {
        return {
        userId: row.user_id,
        name: row.full_name,
        role: Permissions.normalizeRole(row.role),
        hasPhoto: row.has_photo === true,
        photoVersion: row.photo_version || ""   // changes whenever the photo changes
        };
    }

    // ── GET /api/friends — friends list + pending requests ──
    app.get("/api/friends", requireFriendsUser, async (req, res) => {
        const me = req.friendsUser.user_id;
        try {
        const result = await pool.query(
            `SELECT f.id, f.status, f.created_at, f.responded_at,
                    (f.requester_id = $1) AS sent_by_me,
                    u.user_id, u.full_name, u.role,
                    (u.photo IS NOT NULL AND u.photo <> '') AS has_photo,
                    LEFT(md5(COALESCE(u.photo, '')), 10) AS photo_version
            FROM friendships f
            JOIN users u ON u.user_id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
            WHERE f.requester_id = $1 OR f.addressee_id = $1
            ORDER BY u.full_name ASC`,
            [me]
        );
        const friends = [], incoming = [], outgoing = [];
        for (const row of result.rows) {
            const person = personFromRow(row);
            if (row.status === "accepted") {
            friends.push({ ...person, since: row.responded_at || row.created_at });
            } else if (row.sent_by_me) {
            outgoing.push({ ...person, requestId: String(row.id), sentAt: row.created_at });
            } else {
            incoming.push({ ...person, requestId: String(row.id), sentAt: row.created_at });
            }
        }
        return res.json({ ok: true, friends, incoming, outgoing });
        } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
        }
    });

    // ── POST /api/friends/request — { identifier: "<User ID or email>" } ──
    app.post("/api/friends/request", requireFriendsUser, async (req, res) => {
        const me = req.friendsUser;
        const identifier = String(req.body?.identifier || "").trim();
        if (!identifier) return res.status(400).json({ ok: false, error: "Enter your friend's User ID or email." });

        try {
        const target = await loadUser(identifier);
        if (!target || !target.canUseFriends) {
            return res.status(404).json({ ok: false, error: "No student or employee account found with that User ID or email." });
        }
        if (target.user_id === me.user_id) {
            return res.status(400).json({ ok: false, error: "You can't add yourself as a friend." });
        }

        const existing = await findPair(me.user_id, target.user_id);
        if (existing) {
            if (existing.status === "accepted") {
            return res.status(409).json({ ok: false, error: `You and ${target.full_name} are already friends.` });
            }
            if (existing.requester_id === me.user_id) {
            return res.status(409).json({ ok: false, error: "You already sent a request to this person." });
            }
            // They already asked me — sending a request back counts as accepting it.
            await pool.query(
            `UPDATE friendships SET status = 'accepted', responded_at = now()
            WHERE id = $1 AND status = 'pending'
            RETURNING id`,
            [existing.id]
            );
            notifyFriendsChanged(me.user_id, target.user_id);
            return res.json({ ok: true, accepted: true, message: `You and ${target.full_name} are now friends.` });
        }

        const counts = await pool.query(
            `SELECT
            COUNT(*) FILTER (WHERE status = 'pending' AND requester_id = $1) AS pending_out,
            COUNT(*) FILTER (WHERE status = 'accepted') AS friends
            FROM friendships WHERE requester_id = $1 OR addressee_id = $1`,
            [me.user_id]
        );
        if (Number(counts.rows[0].pending_out) >= MAX_PENDING_OUTGOING) {
            return res.status(429).json({ ok: false, error: "You have too many unanswered requests. Wait for some replies first." });
        }
        if (Number(counts.rows[0].friends) >= MAX_FRIENDS) {
            return res.status(409).json({ ok: false, error: `You've reached the limit of ${MAX_FRIENDS} friends.` });
        }

        await pool.query(
            `INSERT INTO friendships (requester_id, addressee_id) VALUES ($1, $2) RETURNING id`,
            [me.user_id, target.user_id]
        );
        notifyFriendsChanged(me.user_id, target.user_id);
        return res.json({ ok: true, accepted: false, message: `Friend request sent to ${target.full_name}.` });
        } catch (err) {
        if (err.code === "23505") {  // both clicked at the same moment
            return res.status(409).json({ ok: false, error: "A request between you two already exists. Refresh and try again." });
        }
        return res.status(500).json({ ok: false, error: err.message });
        }
    });

    // ── POST /api/friends/respond — { requestId, accept: true | false } ──
    app.post("/api/friends/respond", requireFriendsUser, async (req, res) => {
        const me = req.friendsUser.user_id;
        const requestId = String(req.body?.requestId || "");
        const accept = req.body?.accept === true;
        if (!/^\d+$/.test(requestId)) return res.status(400).json({ ok: false, error: "Invalid request." });

        try {
        const result = accept
            ? await pool.query(
                `UPDATE friendships SET status = 'accepted', responded_at = now()
                WHERE id = $1 AND addressee_id = $2 AND status = 'pending'
                RETURNING requester_id`,
                [requestId, me]
            )
            : await pool.query(
                `DELETE FROM friendships
                WHERE id = $1 AND addressee_id = $2 AND status = 'pending'
                RETURNING requester_id`,
                [requestId, me]
            );
        if (!result.rows.length) {
            return res.status(404).json({ ok: false, error: "This request no longer exists." });
        }
        notifyFriendsChanged(me, result.rows[0].requester_id);
        return res.json({ ok: true, accepted: accept });
        } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
        }
    });

    // ── DELETE /api/friends/:friendId — remove a friend, or cancel a sent request ──
    app.delete("/api/friends/:friendId", requireFriendsUser, async (req, res) => {
        const me = req.friendsUser.user_id;
        try {
        const result = await pool.query(
            `DELETE FROM friendships
            WHERE (status = 'accepted' AND ((requester_id = $1 AND LOWER(addressee_id) = LOWER($2))
                                        OR (addressee_id = $1 AND LOWER(requester_id) = LOWER($2))))
                OR (status = 'pending' AND requester_id = $1 AND LOWER(addressee_id) = LOWER($2))
            RETURNING requester_id, addressee_id`,
            [me, req.params.friendId]
        );
        if (!result.rows.length) {
            return res.status(404).json({ ok: false, error: "Not found in your friends or sent requests." });
        }
        const row = result.rows[0];
        notifyFriendsChanged(row.requester_id, row.addressee_id);
        return res.json({ ok: true });
        } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
        }
    });

    // ── GET /api/friends/photo/:userId?token=... — a friend's profile photo ──
    // Served as a real image so the list and map markers can use <img src>,
    // instead of sending every friend's full photo inside the list response.
    // Allowed for friends and for anyone with a pending request either way.
    app.get("/api/friends/photo/:userId", requireFriendsUser, async (req, res) => {
        const me = req.friendsUser.user_id;
        try {
        const result = await pool.query(
            `SELECT u.photo
            FROM friendships f
            JOIN users u ON u.user_id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
            WHERE (f.requester_id = $1 OR f.addressee_id = $1)
            AND LOWER(u.user_id) = LOWER($2)
            LIMIT 1`,
            [me, req.params.userId]
        );
        const photo = result.rows[0]?.photo;
        const match = typeof photo === "string" && photo.match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/);
        if (!match) return res.status(404).end();
        res.set("Content-Type", match[1]);
        res.set("Cache-Control", "private, max-age=86400"); // the URL has ?v=<photo version>, so a new photo gets a new URL
        return res.send(Buffer.from(match[2], "base64"));
        } catch (err) {
        return res.status(500).end();
        }
    });

    // Called by server.js right after a user changes their profile photo.
    // Everyone who can see that photo (friends + pending requests) gets a
    // 'friendPhotoChanged' event, so the list and map marker update instantly.
    async function notifyPhotoChanged(userId) {
        try {
        const result = await pool.query(
            `SELECT u.user_id,
                    (u.photo IS NOT NULL AND u.photo <> '') AS has_photo,
                    LEFT(md5(COALESCE(u.photo, '')), 10) AS photo_version,
                    ARRAY(SELECT CASE WHEN f.requester_id = u.user_id THEN f.addressee_id ELSE f.requester_id END
                        FROM friendships f
                        WHERE f.requester_id = u.user_id OR f.addressee_id = u.user_id) AS others
            FROM users u WHERE LOWER(u.user_id) = LOWER($1)`,
            [userId]
        );
        const row = result.rows[0];
        if (!row) return;
        const event = {
            type: "friendPhotoChanged",
            userId: row.user_id,
            hasPhoto: row.has_photo === true,
            photoVersion: row.photo_version
        };
        for (const id of row.others) sendToUser(id, event);
        for (const fn of photoListeners) fn(event);
        } catch (err) {
        console.warn("Friends photo update failed:", err.message);
        }
    }

    // Used by the location-sharing part (Step 4): the accepted friends of a user.
    async function getFriendIds(userId) {
        const result = await pool.query(
        `SELECT CASE WHEN requester_id = $1 THEN addressee_id ELSE requester_id END AS friend_id
        FROM friendships
        WHERE status = 'accepted' AND (requester_id = $1 OR addressee_id = $1)`,
        [userId]
        );
        return result.rows.map(r => r.friend_id);
    }

    return {
    sendToUser, getFriendIds, requireFriendsUser, loadUser,
    onPairChanged: (fn) => pairListeners.push(fn),
    onPhotoChanged: (fn) => photoListeners.push(fn),
    notifyPhotoChanged
    };
};