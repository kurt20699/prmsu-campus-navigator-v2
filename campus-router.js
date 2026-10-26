/* ============================================================
   campus-router.js
   Our own shortest-path routing for the PRMSU Smart Campus Navigator.

   What it contains
   ----------------
   1. A pedestrian graph of the campus (built from OpenStreetMap ways).
   2. Dijkstra's Algorithm       (our own implementation, binary min-heap)
   3. A* Algorithm               (our own implementation, Haversine heuristic)
   4. route()                    -> same result shape fetchORSRoute() returns
   5. compare() / benchmark()    -> Dijkstra vs A* (distance, nodes visited, ms)

   How the app uses it
   -------------------
   - Default mode 'graphhopper': GraphHopper stays the main router. If the
     GraphHopper request fails (quota, offline server, timeout), the app falls
     back to our Dijkstra automatically.
   - CampusRouter.setMode('dijkstra' | 'astar') makes our own algorithm the
     main router (useful for demos and for testing).
   - CampusRouter.setMode('graphhopper') goes back to the default.

   Console helpers
   ---------------
     await CampusRouter.load()
     CampusRouter.setMode('dijkstra')
     await CampusRouter.compare([15.316989,119.983176],[15.318861,119.98485])
     CampusRouter.exportGraph()      // downloads campus-graph.json
   ============================================================ */

(function () {
    'use strict';

    const CAMPUS_ROUTER_SETTINGS = {
        // [south, west, north, east] — campus buildings plus a small margin
        bbox: [15.3145, 119.9798, 15.3220, 119.9876],
        walkSpeed: 1.4,            // m/s, used for estimated walking time
        snapMeters: 80,            // max distance from the user/destination to the graph
        snapExtraMeters: 20,       // also try other paths up to this much farther than the closest one
        snapMaxCandidates: 4,      // how many different paths to try at each end
        snapSeparationMeters: 12,  // candidates closer than this count as the same path
        offPathPenalty: 2,         // walking off the paths counts this many times more when picking the route
        graphUrl: 'campus-graph.json',
        overpassUrls: [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter'
        ],
        cacheKey: 'campusRouterGraph.v1',
        cacheTtlMs: 7 * 24 * 60 * 60 * 1000,
        highways: [
            'footway', 'path', 'pedestrian', 'steps', 'service', 'residential',
            'living_street', 'track', 'unclassified', 'tertiary', 'secondary',
            'primary', 'cycleway', 'corridor'
        ]
    };

    const state = {
        // 'graphhopper' | 'dijkstra' | 'astar' — Dijkstra is the permanent default
        mode: 'dijkstra',
        graph: null,               // { nodes: Map, adj: Map }
        loading: null              // in-flight load() promise
    };

    // ──────────────────────────────────────────
    // Geometry helpers
    // ──────────────────────────────────────────
    const toRad = x => x * Math.PI / 180;

    // Haversine distance in meters between two [lat, lng] points
    function haversine(a, b) {
        const R = 6371000;
        const dLat = toRad(b[0] - a[0]);
        const dLng = toRad(b[1] - a[1]);
        const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
    }

    // Initial bearing in degrees (0–360) from a to b
    function bearing(a, b) {
        const y = Math.sin(toRad(b[1] - a[1])) * Math.cos(toRad(b[0]));
        const x = Math.cos(toRad(a[0])) * Math.sin(toRad(b[0])) -
            Math.sin(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.cos(toRad(b[1] - a[1]));
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

        // ──────────────────────────────────────────
    // Campus boundary (routes must never leave it)
    // ──────────────────────────────────────────
    let customBoundary = null;

    function getBoundary() {
        if (customBoundary) return customBoundary;
        try {
            if (typeof campusData !== 'undefined' && campusData) {
                for (const c of Object.values(campusData)) {
                    if (Array.isArray(c.boundary) && c.boundary.length >= 3) return c.boundary;
                }
            }
        } catch { /* campusData not available */ }
        return null;
    }

    function insideBoundary(lat, lng, poly = getBoundary()) {
        if (!poly) return true;
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const [yi, xi] = poly[i], [yj, xj] = poly[j];
            if ((yi > lat) !== (yj > lat) && lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
        }
        return inside;
    }

    function segmentInside(a, b, poly = getBoundary(), samples = 8) {
        if (!poly) return true;
        for (let s = 0; s <= samples; s++) {
            const t = s / samples;
            if (!insideBoundary(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, poly)) return false;
        }
        return true;
    }

    function pathInside(points) {
        const poly = getBoundary();
        if (!poly) return true;
        const pts = points.map(p => Array.isArray(p) ? p : [p.lat, p.lng]);
        for (let i = 0; i < pts.length; i++) {
            if (!insideBoundary(pts[i][0], pts[i][1], poly)) return false;
            if (i > 0 && !segmentInside(pts[i - 1], pts[i], poly, 4)) return false;
        }
        return true;
    }

    function setBoundary(poly) {
        customBoundary = Array.isArray(poly) && poly.length >= 3 ? poly : null;
        state.graph = null;
        return !!customBoundary;
    }

    // ──────────────────────────────────────────
    // Binary min-heap (priority queue)
    // ──────────────────────────────────────────
    class MinHeap {
        constructor() { this.keys = []; this.vals = []; }
        get size() { return this.keys.length; }
        push(key, val) {
            const k = this.keys, v = this.vals;
            let i = k.length;
            k.push(key); v.push(val);
            while (i > 0) {
                const p = (i - 1) >> 1;
                if (k[p] <= k[i]) break;
                [k[p], k[i]] = [k[i], k[p]];
                [v[p], v[i]] = [v[i], v[p]];
                i = p;
            }
        }
        pop() {
            const k = this.keys, v = this.vals;
            const topKey = k[0], topVal = v[0];
            const lastKey = k.pop(), lastVal = v.pop();
            if (k.length) {
                k[0] = lastKey; v[0] = lastVal;
                let i = 0;
                for (;;) {
                    const l = 2 * i + 1, r = l + 1;
                    let m = i;
                    if (l < k.length && k[l] < k[m]) m = l;
                    if (r < k.length && k[r] < k[m]) m = r;
                    if (m === i) break;
                    [k[m], k[i]] = [k[i], k[m]];
                    [v[m], v[i]] = [v[i], v[m]];
                    i = m;
                }
            }
            return [topKey, topVal];
        }
    }

    // ──────────────────────────────────────────
    // Graph construction
    // ──────────────────────────────────────────

    // Compact graph format (also what exportGraph() / campus-graph.json use):
    //   { nodes: { "<id>": [lat, lng] }, edges: [[idA, idB, meters, "street name"], ...] }
    function buildGraph(compact) {
        const nodes = new Map();
        const adj = new Map();
        Object.entries(compact.nodes).forEach(([id, ll]) => nodes.set(id, ll));

        const add = (a, b, w, name) => {
            if (!adj.has(a)) adj.set(a, []);
            adj.get(a).push({ to: b, w, name: name || '' });
        };
        const poly = getBoundary();
        if (!poly) console.warn('CampusRouter: no campus boundary found — routes are NOT limited to the campus.');
        compact.edges.forEach(([a, b, w, name]) => {
            if (!nodes.has(a) || !nodes.has(b) || a === b) return;
            // Drop every path segment that touches or crosses outside the campus boundary.
            if (poly && !segmentInside(nodes.get(a), nodes.get(b), poly)) return;
            add(a, b, w, name);
            add(b, a, w, name);      // pedestrians can walk both directions
        });

        // Keep only the largest connected component, so a stray isolated
        // footway fragment can never be picked as the nearest node.
        const seen = new Set();
        let best = [];
        for (const start of adj.keys()) {
            if (seen.has(start)) continue;
            const comp = [];
            const stack = [start];
            seen.add(start);
            while (stack.length) {
                const u = stack.pop();
                comp.push(u);
                for (const e of adj.get(u) || []) {
                    if (!seen.has(e.to)) { seen.add(e.to); stack.push(e.to); }
                }
            }
            if (comp.length > best.length) best = comp;
        }
        const keep = new Set(best);
        for (const id of [...adj.keys()]) if (!keep.has(id)) adj.delete(id);
        for (const id of [...nodes.keys()]) if (!keep.has(id)) nodes.delete(id);

        return { nodes, adj };
    }

    // Overpass JSON (elements: nodes + ways) -> compact graph
    function compactFromOverpass(json) {
        const nodeLL = new Map();
        const ways = [];
        (json.elements || []).forEach(el => {
            if (el.type === 'node') nodeLL.set(String(el.id), [el.lat, el.lon]);
            else if (el.type === 'way') ways.push(el);
        });

        const usedNodes = {};
        const edges = [];
        ways.forEach(w => {
            const tags = w.tags || {};
            if (tags.foot === 'no' || tags.access === 'no') return;
            if (!CAMPUS_ROUTER_SETTINGS.highways.includes(tags.highway)) return;
            const name = tags.name || '';
            const ids = (w.nodes || []).map(String);
            for (let i = 1; i < ids.length; i++) {
                const a = nodeLL.get(ids[i - 1]), b = nodeLL.get(ids[i]);
                if (!a || !b) continue;
                usedNodes[ids[i - 1]] = a;
                usedNodes[ids[i]] = b;
                edges.push([ids[i - 1], ids[i], Math.round(haversine(a, b) * 100) / 100, name]);
            }
        });
        return { nodes: usedNodes, edges };
    }

    async function fetchOverpass() {
        const [s, w, n, e] = CAMPUS_ROUTER_SETTINGS.bbox;
        const hw = CAMPUS_ROUTER_SETTINGS.highways.join('|');
        const query = `[out:json][timeout:25];(way["highway"~"^(${hw})$"](${s},${w},${n},${e}););(._;>;);out body;`;
        let lastErr;
        for (const url of CAMPUS_ROUTER_SETTINGS.overpassUrls) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'data=' + encodeURIComponent(query)
                });
                if (!res.ok) throw new Error('Overpass HTTP ' + res.status);
                return await res.json();
            } catch (err) { lastErr = err; }
        }
        throw lastErr || new Error('Overpass request failed');
    }

    // Order: static campus-graph.json (reproducible) -> browser cache -> Overpass.
    async function load(force = false) {
        if (state.graph && !force) return state.graph;
        if (state.loading && !force) return state.loading;

        state.loading = (async () => {
            let compact = null, source = '';

            if (!force) {
                try {
                    const res = await fetch(CAMPUS_ROUTER_SETTINGS.graphUrl, { cache: 'no-cache' });
                    if (res.ok) {
                        const j = await res.json();
                        if (j && j.nodes && j.edges) { compact = j; source = 'campus-graph.json'; }
                    }
                } catch { /* no static graph — try the next source */ }
            }

            if (!compact && !force) {
                try {
                    const raw = localStorage.getItem(CAMPUS_ROUTER_SETTINGS.cacheKey);
                    if (raw) {
                        const c = JSON.parse(raw);
                        if (c && Date.now() - c.savedAt < CAMPUS_ROUTER_SETTINGS.cacheTtlMs) {
                            compact = c.graph; source = 'browser cache';
                        }
                    }
                } catch { /* storage unavailable */ }
            }

            if (!compact) {
                compact = compactFromOverpass(await fetchOverpass());
                source = 'OpenStreetMap (Overpass)';
                try {
                    localStorage.setItem(CAMPUS_ROUTER_SETTINGS.cacheKey,
                        JSON.stringify({ savedAt: Date.now(), graph: compact }));
                } catch { /* storage full or blocked — not fatal */ }
            }

            const graph = buildGraph(compact);
            if (graph.nodes.size < 2) throw new Error('Campus graph is empty');
            graph.source = source;
            state.graph = graph;
            console.log(`🗺️ CampusRouter graph ready: ${graph.nodes.size} nodes (${source})`);
            return graph;
        })();

        try { return await state.loading; }
        finally { state.loading = null; }
    }

    function exportGraph() {
        const g = state.graph;
        if (!g) throw new Error('Graph not loaded yet. Run: await CampusRouter.load()');
        const nodes = {};
        g.nodes.forEach((ll, id) => { nodes[id] = ll; });
        const edges = [];
        g.adj.forEach((list, a) => {
            list.forEach(e => { if (a < e.to) edges.push([a, e.to, e.w, e.name]); });
        });
        const blob = new Blob([JSON.stringify({ nodes, edges })], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'campus-graph.json';
        a.click();
        URL.revokeObjectURL(a.href);
        return { nodes: g.nodes.size, edges: edges.length };
    }

    // ──────────────────────────────────────────
    // Shortest-path algorithms
    // ──────────────────────────────────────────
    function rebuildPath(prev, prevName, goalId) {
        const ids = [goalId], names = [];
        let cur = goalId;
        while (prev.has(cur)) {
            names.push(prevName.get(cur) || '');
            cur = prev.get(cur);
            ids.push(cur);
        }
        ids.reverse(); names.reverse();   // names[i] = street of edge ids[i] -> ids[i+1]
        return { ids, names };
    }

    // Dijkstra's Algorithm: always expand the unvisited node with the lowest
    // known distance from the start, until the goal is reached.
    function dijkstra(graph, startId, goalId) {
        const t0 = performance.now();
        const dist = new Map([[startId, 0]]);
        const prev = new Map(), prevName = new Map();
        const done = new Set();
        const heap = new MinHeap();
        heap.push(0, startId);
        let visited = 0;

        while (heap.size) {
            const [d, u] = heap.pop();
            if (done.has(u)) continue;
            done.add(u);
            visited++;
            if (u === goalId) break;
            for (const e of graph.adj.get(u) || []) {
                if (done.has(e.to)) continue;
                const nd = d + e.w;
                if (nd < (dist.get(e.to) ?? Infinity)) {
                    dist.set(e.to, nd);
                    prev.set(e.to, u);
                    prevName.set(e.to, e.name);
                    heap.push(nd, e.to);
                }
            }
        }
        const ms = performance.now() - t0;
        if (!dist.has(goalId) || !done.has(goalId)) {
            return { found: false, algorithm: 'Dijkstra', visited, ms };
        }
        const { ids, names } = rebuildPath(prev, prevName, goalId);
        return { found: true, algorithm: 'Dijkstra', distance: dist.get(goalId), ids, names, visited, ms };
    }

    // A* Algorithm: like Dijkstra, but nodes are ordered by
    // f(n) = g(n) + h(n), where h is the straight-line (Haversine) distance to
    // the goal. h never overestimates, so the shortest path is still found.
    function astar(graph, startId, goalId) {
        const t0 = performance.now();
        const goalLL = graph.nodes.get(goalId);
        const h = id => haversine(graph.nodes.get(id), goalLL);
        const g = new Map([[startId, 0]]);
        const prev = new Map(), prevName = new Map();
        const done = new Set();
        const heap = new MinHeap();
        heap.push(h(startId), startId);
        let visited = 0;

        while (heap.size) {
            const [, u] = heap.pop();
            if (done.has(u)) continue;
            done.add(u);
            visited++;
            if (u === goalId) break;
            const gu = g.get(u);
            for (const e of graph.adj.get(u) || []) {
                if (done.has(e.to)) continue;
                const ng = gu + e.w;
                if (ng < (g.get(e.to) ?? Infinity)) {
                    g.set(e.to, ng);
                    prev.set(e.to, u);
                    prevName.set(e.to, e.name);
                    heap.push(ng + h(e.to), e.to);
                }
            }
        }
        const ms = performance.now() - t0;
        if (!done.has(goalId)) return { found: false, algorithm: 'A*', visited, ms };
        const { ids, names } = rebuildPath(prev, prevName, goalId);
        return { found: true, algorithm: 'A*', distance: g.get(goalId), ids, names, visited, ms };
    }

    // ──────────────────────────────────────────
    // Snapping + turn-by-turn instructions
    // ──────────────────────────────────────────
    function nearestNode(graph, latlng) {
        let bestId = null, bestD = Infinity;
        graph.nodes.forEach((ll, id) => {
            const d = haversine(latlng, ll);
            if (d < bestD) { bestD = d; bestId = id; }
        });
        return { id: bestId, distance: bestD };
    }

    // Nearest point on any path SEGMENT (not just the nearest node), so a start
    // or destination beside a long path joins it right there instead of
    // overshooting to a far-away node and doubling back.
    function snapToEdge(graph, latlng) {
        const cosLat = Math.cos(toRad(latlng[0]));
        let best = null;
        graph.adj.forEach((list, a) => {
            const A = graph.nodes.get(a);
            for (const e of list) {
                if (a > e.to) continue;              // each edge is stored twice; test it once
                const B = graph.nodes.get(e.to);
                const ax = A[1] * cosLat, ay = A[0];
                const dx = B[1] * cosLat - ax, dy = B[0] - ay;
                const len2 = dx * dx + dy * dy;
                let t = len2 ? ((latlng[1] * cosLat - ax) * dx + (latlng[0] - ay) * dy) / len2 : 0;
                t = Math.max(0, Math.min(1, t));
                const point = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
                const distance = haversine(latlng, point);
                if (!best || distance < best.distance) best = { a, b: e.to, point, distance, name: e.name };
            }
        });
        return best;
    }

    // Several snap options on DIFFERENT paths, not just the closest one. The path
    // closest to a building's center is not always the one that gives the
    // shortest walk, so route() tries each option and keeps the best total.
    function snapCandidates(graph, latlng) {
        const cosLat = Math.cos(toRad(latlng[0]));
        const all = [];
        graph.adj.forEach((list, a) => {
            const A = graph.nodes.get(a);
            for (const e of list) {
                if (a > e.to) continue;              // each edge is stored twice; test it once
                const B = graph.nodes.get(e.to);
                const ax = A[1] * cosLat, ay = A[0];
                const dx = B[1] * cosLat - ax, dy = B[0] - ay;
                const len2 = dx * dx + dy * dy;
                let t = len2 ? ((latlng[1] * cosLat - ax) * dx + (latlng[0] - ay) * dy) / len2 : 0;
                t = Math.max(0, Math.min(1, t));
                const point = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
                all.push({ a, b: e.to, point, distance: haversine(latlng, point), name: e.name });
            }
        });
        all.sort((x, y) => x.distance - y.distance);
        const { snapExtraMeters, snapMaxCandidates, snapSeparationMeters } = CAMPUS_ROUTER_SETTINGS;
        const picked = [];
        for (const c of all) {
            if (c.distance > all[0].distance + snapExtraMeters) break;
            if (picked.some(p => haversine(p.point, c.point) < snapSeparationMeters)) continue;
            picked.push(c);
            if (picked.length >= snapMaxCandidates) break;
        }
        return picked;
    }

    // Building/room entrances are handled by script.js (routeTargetFor):
    // destCoords already IS the entrance when one is set in the Admin
    // Dashboard, so the router just walks to the point it is given.

    // Temporary copy of the graph with the snapped start/destination added as
    // extra nodes sitting on their edges. The real graph is never modified.
    function withSnapNodes(graph, snaps) {
        const nodes = new Map(graph.nodes);
        const adj = new Map();
        graph.adj.forEach((list, id) => adj.set(id, list.slice()));
        const link = (u, v, w, name) => {
            if (!adj.has(u)) adj.set(u, []);
            if (!adj.has(v)) adj.set(v, []);
            adj.get(u).push({ to: v, w, name: name || '' });
            adj.get(v).push({ to: u, w, name: name || '' });
        };
        const ids = snaps.map((sn, i) => {
            const id = '__snap' + i;
            nodes.set(id, sn.point);
            link(id, sn.a, haversine(sn.point, graph.nodes.get(sn.a)), sn.name);
            link(id, sn.b, haversine(sn.point, graph.nodes.get(sn.b)), sn.name);
            return id;
        });
        const [p, q] = snaps;
        if (p.a === q.a && p.b === q.b) link(ids[0], ids[1], haversine(p.point, q.point), p.name);
        return { graph: { nodes, adj }, ids };
    }

    function maneuverType(delta) {
        const a = Math.abs(delta);
        if (a < 35) return null;
        const right = delta > 0;
        if (a >= 165) return 'uturn';
        if (a >= 120) return right ? 'turn-sharp-right' : 'turn-sharp-left';
        if (a >= 60) return right ? 'turn-right' : 'turn-left';
        return right ? 'turn-slight-right' : 'turn-slight-left';
    }

    // pts: [[lat,lng],...]  names: street name for each segment pts[i]->pts[i+1]
    function buildInstructions(pts, names) {
        const cum = [0];
        for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + haversine(pts[i - 1], pts[i]));
        const total = cum[cum.length - 1];
        const LOOK = 12;     // meters looked at before/after a node, smooths curved paths

        const pointAt = (i, dir) => {          // first point at least LOOK m away from i
            let j = i;
            while (j + dir >= 0 && j + dir < pts.length && Math.abs(cum[j] - cum[i]) < LOOK) j += dir;
            return pts[j];
        };

        const marks = [{ idx: 0, type: 'depart', road: names[0] || '' }];
        let lastIdx = 0;
        for (let i = 1; i < pts.length - 1; i++) {
            if (cum[i] - cum[lastIdx] < LOOK) continue;
            if (total - cum[i] < 5) continue;
            const before = bearing(pointAt(i, -1), pts[i]);
            const after = bearing(pts[i], pointAt(i, 1));
            let delta = after - before;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            const type = maneuverType(delta);
            const nameChanged = names[i] && names[i] !== (names[i - 1] || '');
            if (type) {
                marks.push({ idx: i, type, road: names[i] || '' });
                lastIdx = i;
            } else if (nameChanged) {
                marks.push({ idx: i, type: 'straight', road: names[i] });
                lastIdx = i;
            }
        }
        marks.push({ idx: pts.length - 1, type: 'arrive', road: '' });

        return marks.map((m, k) => ({
            type: m.type,
            road: m.road || '',
            distance: k < marks.length - 1 ? cum[marks[k + 1].idx] - cum[m.idx] : 0,
            location: { lat: pts[m.idx][0], lng: pts[m.idx][1] }
        }));
    }

    // ──────────────────────────────────────────
    // Public: route() — same shape as fetchORSRoute()
    // ──────────────────────────────────────────
    async function route(startCoords, destCoords, algorithm = 'dijkstra') {
        const base = await load();
        const limit = CAMPUS_ROUTER_SETTINGS.snapMeters;
        if (!insideBoundary(startCoords[0], startCoords[1])) {
            const err = new Error('Start is outside the campus boundary');
            err.code = 'OUTSIDE_CAMPUS';
            throw err;
        }
        const starts = snapCandidates(base, startCoords);
        if (!insideBoundary(destCoords[0], destCoords[1])) {
            const err = new Error('Destination is outside the campus boundary');
            err.code = 'OUTSIDE_CAMPUS';
            throw err;
        }
        const dests = snapCandidates(base, destCoords);
        if (!starts.length || starts[0].distance > limit) throw new Error('Start is too far from the campus path network');
        if (!dests.length || dests[0].distance > limit) throw new Error('Destination is too far from the campus path network');

        // Try every start/destination snap combination and keep the shortest total
        // walk (path + the short straight connectors at both ends).
        const run = algorithm === 'astar' ? astar : dijkstra;
        let best = null;
        for (const cs of starts) {
            for (const cd of dests) {
                if (cs.distance > limit || cd.distance > limit) continue;
                // the short straight connectors must not cut outside the campus either
                if (!segmentInside(startCoords, cs.point) || !segmentInside(cd.point, destCoords)) continue;
                const ov = withSnapNodes(base, [cs, cd]);
                const r = run(ov.graph, ov.ids[0], ov.ids[1]);
                if (!r.found) continue;
                const cost = r.distance + CAMPUS_ROUTER_SETTINGS.offPathPenalty * (cs.distance + cd.distance);
                if (!best || cost < best.cost) best = { s: cs, d: cd, res: r, graph: ov.graph, cost };
            }
        }
        if (!best) throw new Error('No walkable route found on the campus graph');
        const { s, d, res, graph } = best;

        const pts = res.ids.map(id => graph.nodes.get(id));
        const names = res.names.slice();
        // drop near-duplicate points (a snap point that lands on a real node)
        for (let i = pts.length - 1; i > 0; i--) {
            if (haversine(pts[i - 1], pts[i]) < 0.5) { pts.splice(i, 1); names.splice(i, 1); }
        }
        let total = res.distance;

        // Short straight connectors from the real start / destination to the graph
        if (s.distance > 1) { pts.unshift(startCoords); names.unshift(names[0] || ''); } // drawn on the map, but not counted in the total
        if (d.distance > 1) { pts.push(destCoords); names.push(names[names.length - 1] || ''); } // drawn on the map, but not counted in the total

        return {
            coordinates: pts.map(([lat, lng]) => ({ lat, lng })),
            summary: {
                totalDistance: total,
                totalTime: total / CAMPUS_ROUTER_SETTINGS.walkSpeed
            },
            instructions: buildInstructions(d.distance > 1 ? pts.slice(0, -1) : pts, d.distance > 1 ? names.slice(0, -1) : names),
            meta: {
                engine: 'CampusRouter',
                algorithm: res.algorithm,
                nodesVisited: res.visited,
                computeMs: Math.round(res.ms * 1000) / 1000
            }
        };
    }

    // ──────────────────────────────────────────
    // Dijkstra vs A* comparison
    // ──────────────────────────────────────────
    function timeRun(fn, graph, a, b, repeats) {
        let res, total = 0;
        for (let i = 0; i < repeats; i++) {
            res = fn(graph, a, b);
            total += res.ms;
        }
        return { res, avgMs: total / repeats };
    }

    async function compare(startCoords, destCoords, repeats = 200) {
        const graph = await load();
        const s = nearestNode(graph, startCoords);
        const d = nearestNode(graph, destCoords);
        const dj = timeRun(dijkstra, graph, s.id, d.id, repeats);
        const as = timeRun(astar, graph, s.id, d.id, repeats);
        const row = (name, r) => ({
            algorithm: name,
            found: r.res.found,
            distance_m: r.res.found ? Math.round(r.res.distance * 100) / 100 : null,
            nodes_visited: r.res.visited,
            avg_time_ms: Math.round(r.avgMs * 10000) / 10000
        });
        const rows = [row('Dijkstra', dj), row('A*', as)];
        console.table(rows);
        return rows;
    }

    // pairs: [{ name, from:[lat,lng], to:[lat,lng] }, ...]
    async function benchmark(pairs, repeats = 200) {
        const graph = await load();
        const out = [];
        for (const p of pairs) {
            const s = nearestNode(graph, p.from), d = nearestNode(graph, p.to);
            const dj = timeRun(dijkstra, graph, s.id, d.id, repeats);
            const as = timeRun(astar, graph, s.id, d.id, repeats);
            out.push({
                route: p.name || `${p.from} -> ${p.to}`,
                straight_line_m: Math.round(haversine(p.from, p.to)),
                dijkstra_m: dj.res.found ? Math.round(dj.res.distance * 100) / 100 : null,
                astar_m: as.res.found ? Math.round(as.res.distance * 100) / 100 : null,
                same_distance: dj.res.found && as.res.found &&
                    Math.abs(dj.res.distance - as.res.distance) < 1e-6,
                dijkstra_nodes: dj.res.visited,
                astar_nodes: as.res.visited,
                dijkstra_ms: Math.round(dj.avgMs * 10000) / 10000,
                astar_ms: Math.round(as.avgMs * 10000) / 10000
            });
        }
        console.table(out);
        return out;
    }

    function setMode(mode) {
        if (!['graphhopper', 'dijkstra', 'astar'].includes(mode)) {
            throw new Error("mode must be 'graphhopper', 'dijkstra' or 'astar'");
        }
        state.mode = mode;
        try { localStorage.setItem('campusRouterMode', mode); } catch { /* not fatal */ }
        console.log('🧭 Routing mode:', mode);
        return mode;
    }

    const api = {
        settings: CAMPUS_ROUTER_SETTINGS,
        get mode() { return state.mode; },
        get graph() { return state.graph; },
        load, route, compare, benchmark, setMode, exportGraph,
        dijkstra, astar, buildGraph, compactFromOverpass, haversine,
        isInsideCampus: (lat, lng) => insideBoundary(lat, lng),
        pathInsideCampus: pathInside,
        setBoundary
    };

    if (typeof window !== 'undefined') window.CampusRouter = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();