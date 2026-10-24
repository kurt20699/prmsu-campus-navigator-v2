// ══════════════════════════════════════════
// 👥 FRIENDS — profile panel section (browser side)
// ══════════════════════════════════════════
// Adds a "Friends" card to the profile panel:
//   • share-location switch (pause sharing)  • add a friend by User ID / email
//   • friend requests (accept / decline)      • sent requests (cancel)
//   • friends list (remove)
// Also shows a red badge on the profile chip when requests are waiting.
//
// Talks to the routes in server/friends-routes.js. script.js only calls:
//   FriendsWidget.refresh()        — after login / on a 'friendsChanged' event
//   FriendsWidget.onProfileOpen()  — when the profile panel opens
//   FriendsWidget.reset()          — on logout
//   FriendsWidget.onPhotoChanged() — on a 'friendPhotoChanged' event
// friends-map.js uses FriendsWidget.isSharingPaused() and FriendsWidget.getFriends().

(function () {
    'use strict';

    const SESSION_KEY = 'campusNavigatorSession';
    const ALLOWED_ROLES = ['STUDENT', 'EMPLOYEE'];

    const state = {
        data: { friends: [], incoming: [], outgoing: [] },
        loaded: false,
        loading: null,
        seenIncoming: null,        // request IDs already known (for "new request" toasts)
        section: null
    };

    // ── Session helpers ───────────────────────
    function getSession() {
        try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
    }
    function canUseFriends(session = getSession()) {
        return !!session?.token && ALLOWED_ROLES.includes(String(session.role || '').toUpperCase());
    }
    function pauseKey() {
        return 'friendsSharingPaused:' + (getSession()?.userId || '');
    }
    function isSharingPaused() {
        try { return localStorage.getItem(pauseKey()) === '1'; } catch { return false; }
    }
    function setSharingPaused(paused) {
        try { localStorage.setItem(pauseKey(), paused ? '1' : '0'); } catch { /* not fatal */ }
        window.dispatchEvent(new CustomEvent('friends:sharing-changed', { detail: { paused } }));
    }

    function notify(message, type = 'info') {
        if (typeof window.showNotification === 'function') window.showNotification(message, type);
    }

    // ── DOM helpers (no innerHTML with user data) ──
    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function initials(name) {
        return String(name || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0] || '').join('').toUpperCase() || '?';
    }

    // Round avatar: the friend's photo (served by /api/friends/photo/:id), or initials.
    function avatar(person) {
        const box = el('div', 'friends-avatar');
        const showInitials = () => { box.replaceChildren(); box.textContent = initials(person.name); };
        if (person.hasPhoto) {
            const img = document.createElement('img');
            img.alt = '';
            img.src = photoUrl(person.userId, person.photoVersion);
            img.onerror = showInitials;
            box.appendChild(img);
        } else {
            showInitials();
        }
        return box;
    }

    // version changes whenever the friend changes their photo, so the browser
    // fetches the new picture instead of showing a cached old one.
    function photoUrl(userId, version) {
        const token = getSession()?.token || '';
        return `/api/friends/photo/${encodeURIComponent(userId)}?v=${encodeURIComponent(version || '')}&token=${encodeURIComponent(token)}`;
    }

    // A friend changed their profile photo ('friendPhotoChanged' event).
    function onPhotoChanged(data) {
        if (!data || !data.userId) return;
        const { friends, incoming, outgoing } = state.data;
        for (const person of [...friends, ...incoming, ...outgoing]) {
            if (person.userId === data.userId) {
                person.hasPhoto = data.hasPhoto;
                person.photoVersion = data.photoVersion;
            }
        }
        if (state.section) render();
        window.dispatchEvent(new CustomEvent('friends:photo-changed', { detail: data }));
    }

    // ── API ───────────────────────────────────
    async function api(method, url, body) {
        const res = await fetch(url, {
            method,
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined
        });
        let data = {};
        try { data = await res.json(); } catch { /* empty body */ }
        if (!res.ok || !data.ok) {
            const err = new Error(data.error || 'Something went wrong. Please try again.');
            err.status = res.status;
            throw err;
        }
        return data;
    }

    // Loads the lists from the server. Several calls at once share one request.
    function refresh() {
        if (!canUseFriends()) { reset(); return Promise.resolve(); }
        if (state.loading) return state.loading;
        state.loading = (async () => {
            try {
                const data = await api('GET', '/api/friends');
                announceNewRequests(data.incoming);
                state.data = { friends: data.friends, incoming: data.incoming, outgoing: data.outgoing };
                state.loaded = true;
                render();
                window.dispatchEvent(new CustomEvent('friends:list-changed', { detail: state.data }));
            } catch (err) {
                if (err.status === 401 || err.status === 403) reset();
                else console.warn('Friends: could not load list —', err.message);
            } finally {
                state.loading = null;
            }
        })();
        return state.loading;
    }

    // Toast for requests that arrived since the last refresh (not on first load).
    function announceNewRequests(incoming) {
        const ids = new Set(incoming.map(r => r.requestId));
        if (state.seenIncoming) {
            const fresh = incoming.filter(r => !state.seenIncoming.has(r.requestId));
            if (fresh.length === 1) notify(`${fresh[0].name} sent you a friend request.`, 'info');
            else if (fresh.length > 1) notify(`You have ${fresh.length} new friend requests.`, 'info');
        }
        state.seenIncoming = ids;
    }

    function reset() {
        state.data = { friends: [], incoming: [], outgoing: [] };
        state.loaded = false;
        state.seenIncoming = null;
        updateChipBadge();
        if (state.section) state.section.style.display = 'none';
        window.dispatchEvent(new CustomEvent('friends:list-changed', { detail: state.data }));
    }

    // ── Profile chip badge ────────────────────
    function updateChipBadge() {
        const chip = document.getElementById('profileChipBtn');
        if (!chip) return;
        let badge = chip.querySelector('.friends-chip-badge');
        const count = state.data.incoming.length;
        if (!count) { badge?.remove(); return; }
        if (!badge) {
            badge = el('span', 'friends-chip-badge');
            chip.appendChild(badge);
        }
        badge.textContent = count > 9 ? '9+' : String(count);
        badge.title = `${count} friend request${count === 1 ? '' : 's'}`;
    }

    // ── Section in the profile panel ──────────
    function buildSection() {
        if (state.section) return state.section;
        const host = document.getElementById('profileSectionInfo');
        if (!host) return null;

        const card = el('div', 'friends-card');
        card.id = 'friendsSection';

        const header = el('div', 'friends-card-header', 'Friends');
        card.appendChild(header);

        const body = el('div', 'friends-body');

        // Share-location switch
        const shareRow = el('label', 'friends-share-row');
        const shareText = el('div', 'friends-share-text');
        shareText.append(el('span', 'friends-share-title', 'Share my location with friends'),
                         el('span', 'friends-share-hint', 'Only while Find My Location is on and you are on campus'));
        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.className = 'friends-switch';
        toggle.id = 'friendsShareToggle';
        toggle.addEventListener('change', () => {
            setSharingPaused(!toggle.checked);
            notify(toggle.checked ? 'Friends can now see your location while Find My Location is on.'
                                  : 'Location sharing paused. Friends can\'t see you.', 'info');
        });
        shareRow.append(shareText, toggle);
        body.appendChild(shareRow);

        // Add-friend form
        const form = el('form', 'friends-add');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'friends-add-input';
        input.placeholder = "Friend's User ID or email";
        input.autocomplete = 'off';
        input.maxLength = 120;
        const addBtn = el('button', 'friends-btn friends-btn-primary', 'Add');
        addBtn.type = 'submit';
        form.append(input, addBtn);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const identifier = input.value.trim();
            if (!identifier) { input.focus(); return; }
            addBtn.disabled = true;
            try {
                const data = await api('POST', '/api/friends/request', { identifier });
                input.value = '';
                notify(data.message, 'success');
                await refresh();
            } catch (err) {
                notify(err.message, 'error');
            } finally {
                addBtn.disabled = false;
            }
        });
        body.appendChild(form);

        body.appendChild(group('friendsIncoming', 'Friend requests'));
        body.appendChild(group('friendsOutgoing', 'Sent requests'));
        body.appendChild(group('friendsList', 'My friends'));

        card.appendChild(body);

        // Place it after "Account Details" / "Activity", before the Sign Out button.
        const signOut = host.querySelector('button[onclick="confirmLogout()"]');
        host.insertBefore(card, signOut || null);

        state.section = card;
        return card;
    }

    function group(id, title) {
        const wrap = el('div', 'friends-group');
        wrap.id = id;
        const head = el('div', 'friends-group-title');
        head.append(el('span', '', title), el('span', 'friends-count'));
        wrap.append(head, el('div', 'friends-rows'));
        return wrap;
    }

    function row(person, subtitle, actions) {
        const r = el('div', 'friends-row');
        const info = el('div', 'friends-row-info');
        info.append(el('span', 'friends-row-name', person.name || person.userId),
                    el('span', 'friends-row-sub', subtitle));
        const btns = el('div', 'friends-row-actions');
        actions.forEach(a => btns.appendChild(a));
        r.append(avatar(person), info, btns);
        return r;
    }

    function actionButton(label, kind, onClick) {
        const b = el('button', `friends-btn ${kind}`, label);
        b.type = 'button';
        b.addEventListener('click', async () => {
            b.disabled = true;
            try { await onClick(b); }
            catch (err) { notify(err.message, 'error'); }
            finally { b.disabled = false; }
        });
        return b;
    }

    // Two-tap confirm for destructive actions (no browser confirm() pop-ups).
    function confirmButton(label, confirmLabel, onConfirm) {
        let armed = false, timer = null;
        return actionButton(label, 'friends-btn-ghost', async (b) => {
            if (!armed) {
                armed = true;
                b.textContent = confirmLabel;
                b.classList.add('friends-btn-danger');
                timer = setTimeout(() => { armed = false; b.textContent = label; b.classList.remove('friends-btn-danger'); }, 3000);
                return;
            }
            clearTimeout(timer);
            await onConfirm();
        });
    }

    function roleLabel(role) {
        return role === 'EMPLOYEE' ? 'Employee' : role === 'STUDENT' ? 'Student' : '';
    }

    function render() {
        updateChipBadge();
        const card = buildSection();
        if (!card) return;
        card.style.display = canUseFriends() ? '' : 'none';

        card.querySelector('#friendsShareToggle').checked = !isSharingPaused();

        const { friends, incoming, outgoing } = state.data;

        fillGroup('friendsIncoming', incoming, r => row(r, `${roleLabel(r.role)} · New request`, [
            actionButton('Accept', 'friends-btn-primary', async () => {
                await api('POST', '/api/friends/respond', { requestId: r.requestId, accept: true });
                notify(`You and ${r.name} are now friends.`, 'success');
                await refresh();
            }),
            actionButton('Decline', 'friends-btn-ghost', async () => {
                await api('POST', '/api/friends/respond', { requestId: r.requestId, accept: false });
                await refresh();
            })
        ]), true);

        fillGroup('friendsOutgoing', outgoing, r => row(r, 'Waiting for reply', [
            actionButton('Cancel', 'friends-btn-ghost', async () => {
                await api('DELETE', `/api/friends/${encodeURIComponent(r.userId)}`);
                await refresh();
            })
        ]), true);

        fillGroup('friendsList', friends, f => row(f, roleLabel(f.role), [
            confirmButton('Remove', 'Sure?', async () => {
                await api('DELETE', `/api/friends/${encodeURIComponent(f.userId)}`);
                notify(`${f.name} was removed from your friends.`, 'info');
                await refresh();
            })
        ]), false, 'No friends yet. Add one using their User ID or email.');
    }

    // hideWhenEmpty: the requests groups disappear when there's nothing in them.
    function fillGroup(id, items, makeRow, hideWhenEmpty, emptyText) {
        const wrap = state.section.querySelector('#' + id);
        wrap.style.display = hideWhenEmpty && !items.length ? 'none' : '';
        wrap.querySelector('.friends-count').textContent = items.length ? `(${items.length})` : '';
        const rows = wrap.querySelector('.friends-rows');
        rows.replaceChildren(...(items.length ? items.map(makeRow) : [el('p', 'friends-empty', emptyText || '')]));
    }

    // Called by script.js each time the profile panel opens.
    function onProfileOpen() {
        if (!canUseFriends()) {
            if (state.section) state.section.style.display = 'none';
            return;
        }
        render();          // show what we have right away
        refresh();         // then bring it up to date
    }

    window.FriendsWidget = {
        refresh,
        reset,
        onProfileOpen,
        onPhotoChanged,
        isSharingPaused,
        canUseFriends: () => canUseFriends(),
        getFriends: () => state.data.friends.slice(),
        photoUrl,
        initials
    };

    // Already logged in when the page loads → load the badge count.
    if (canUseFriends()) refresh();
})();