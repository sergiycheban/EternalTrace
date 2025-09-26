
// assets/js/send_email.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const successEl = document.getElementById('successMessage');
    const errorEl = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!form.checkValidity()) {
            console.warn('Form validation failed');
            form.reportValidity();
            return;
        }

        // Disable button to prevent double submit
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            const formData = new FormData(form);

            const res = await fetch(form.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });

            if (res.ok) {
                console.info('Form submitted successfully');
                successEl?.classList.remove('d-none');
                errorEl?.classList.add('d-none');
                form.reset();
            } else {
                const err = await res.json().catch(() => ({}));
                console.error('Form submission error:', err);
                errorEl?.classList.remove('d-none');
                successEl?.classList.add('d-none');
            }
        } catch (ex) {
            console.error('Network or JS error:', ex);
            errorEl?.classList.remove('d-none');
            successEl?.classList.add('d-none');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Registration';
            }
        }
    });
});
