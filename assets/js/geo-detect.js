
(function () {
    const GEO_KEY = 'et_geo_v1';
    const GEO_TTL_MS = 24 * 60 * 60 * 1000;

    function fromCache() {
        try {
            const raw = localStorage.getItem(GEO_KEY);
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (!obj || !obj.cc || !obj.ts) return null;
            if (Date.now() - obj.ts > GEO_TTL_MS) return null;
            return obj.cc;
        } catch { return null; }
    }

    function toCache(cc) {
        try {
            localStorage.setItem(GEO_KEY, JSON.stringify({ cc, ts: Date.now() }));
        } catch { }
    }

    function withTimeout(promise, ms) {
        return new Promise((resolve, reject) => {
            const t = setTimeout(() => reject(new Error('timeout')), ms);
            promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
        });
    }

    async function detectCountry() {
        const cached = fromCache();
        if (cached) return cached;

        try {
            const res = await withTimeout(fetch('https://ipapi.co/json/', { credentials: 'omit' }), 1500);
            if (!res.ok) throw new Error('bad status');
            const data = await res.json();
            const cc = (data && data.country_code) ? String(data.country_code).toUpperCase() : 'ZZ';
            toCache(cc);
            return cc;
        } catch {
            return 'ZZ';
        }
    }

    detectCountry().then(cc => {
        window.USER_COUNTRY = cc;
        console.log('[geo] country:', cc);
        window.dispatchEvent(new Event('user-country-ready'));
    });
})();
