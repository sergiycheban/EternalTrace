// analytics-events.js
// Console logs are for dev only, remove in production

function trackEvent(name, params) {
    console.log('[GA] event:', name, params);
    window.gtag && gtag('event', name, params || {});
}

document.addEventListener('DOMContentLoaded', function () {
    // Header "Get Started"
    document.querySelectorAll('a.btn.btn-primary[href="#contact"]').forEach(el => {
        el.addEventListener('click', () => trackEvent('cta_click', { cta: 'get_started_header' }));
    });

    // Hero "Get Started"
    document.querySelectorAll('.cta a.btn[href="#contact"]').forEach(el => {
        el.addEventListener('click', () => trackEvent('cta_click', { cta: 'get_started_hero' }));
    });

    // "Memorial Demo"
    document.querySelectorAll('a[href="/memorial"]').forEach(el => {
        el.addEventListener('click', () => trackEvent('demo_open', { link: '/memorial' }));
    });

    // Video (YouTube or glightbox)
    document.querySelectorAll('a[href^="https://youtu"], a.glightbox').forEach(el => {
        el.addEventListener('click', () => trackEvent('video_open', { placement: 'features_block' }));
    });

    // Anchor navigation (#about, #pricing, etc.)
    document.querySelectorAll('a.scroll-link[href^="#"]').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.getAttribute('href').replace('#', '');
            trackEvent('section_visit', { section_id: id });
        });
    });

    // Outbound links
    document.querySelectorAll('a[href^="http"]').forEach(el => {
        try {
            const url = new URL(el.href);
            if (url.host !== location.host) {
                el.addEventListener('click', () => trackEvent('click_outbound', { destination: url.hostname }));
            }
        } catch (e) { }
    });

    // Form submit
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function () {
            console.log('[GA] event: register_submit');
            if (window.gtag) {
                gtag('event', 'register_submit', {
                    event_callback: function () { },
                    event_timeout: 500
                });
            }
        });
    }
});
