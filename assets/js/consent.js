(function () {
    let pvSent = false;
    window.sendPageViewOnce = function () {
        if (pvSent || !window.gtag) return;
        pvSent = true;
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: location.href
        });
    };
})();

(function () {
    const KEY = 'et_consent_v1';
    const EU_REGION = new Set([
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK',
        'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
        'IE', 'IT', 'LV', 'LT', 'LU', 'MT',
        'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
        'SE', 'IS', 'LI', 'NO', 'GB', 'CH']);

    const saved = localStorage.getItem(KEY);

    function applyConsent(granted) {
        gtag('consent', 'update', {
            ad_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied'
        });
        if (granted) sendPageViewOnce();
    }

    function runBannerLogic() {
        const raw = (window.USER_COUNTRY || '').toUpperCase();
        const unknown = !raw || raw === 'ZZ' || raw.includes('{');
        const inEu = EU_REGION.has(raw);

        if (saved === 'granted') applyConsent(true);
        if (saved === 'denied') applyConsent(false);

        if ((inEu || unknown) && saved !== 'granted' && saved !== 'denied') {
            document.getElementById('consent-banner').style.display = 'block';
        }

        if (!inEu && !unknown && saved !== 'granted' && saved !== 'denied') {
            localStorage.setItem(KEY, 'granted');
            applyConsent(true);
        }

        document.getElementById('consent-accept').addEventListener('click', () => {
            localStorage.setItem(KEY, 'granted');
            applyConsent(true);
            document.getElementById('consent-banner').style.display = 'none';
            if (window.gtag) gtag('event', 'consent_granted', { source: 'banner' });
        });

        document.getElementById('consent-decline').addEventListener('click', () => {
            localStorage.setItem(KEY, 'denied');
            applyConsent(false);
            document.getElementById('consent-banner').style.display = 'none';
        });
    }

    if (window.USER_COUNTRY) {
        runBannerLogic();
    } else {
        const t = setTimeout(runBannerLogic, 2000);
        window.addEventListener('user-country-ready', () => {
            clearTimeout(t);
            runBannerLogic();
        }, { once: true });
    }
})();