/* =========================================
   Happy Place - script.js (Part 3)
   Features: dynamic products + search/filter/sort, lightbox,
   accordion, Leaflet map, form validation, AJAX, animations
   ========================================= */

(function () {
    'use strict';

    /* ---------- PRODUCT DATA ---------- */
    // leadDays = days of notice needed before an order is ready
    const PRODUCTS = [
        {
            id: 'scones', name: 'Scones', price: 35, category: 'Bakery', leadDays: 1,
            img: 'images/homemade-scones.jpg', w: 320, h: 180, alt: 'Fresh homemade scones',
            desc: 'Freshly baked homemade scones, perfect for breakfast or an afternoon treat.'
        },
        {
            id: 'fried-chicken', name: 'Fried Chicken', price: 60, category: 'Mains', leadDays: 0,
            img: 'images/crispy-fried-chicken.jpg', w: 1024, h: 1024, alt: 'Crispy fried chicken on a patterned plate',
            desc: 'Crispy fried chicken with delicious seasoning and a golden coating.'
        },
        {
            id: 'loaded-fries', name: 'Loaded Fries', price: 55, category: 'Snacks', leadDays: 0,
            img: 'images/loaded-fries-cheese-bacon.jpg', w: 640, h: 640, alt: 'Loaded fries with cheese, bacon and spring onion',
            desc: 'Crispy fries topped with cheese, sauce and tasty toppings.'
        },
        {
            id: 'sloppy-sliders', name: 'Sloppy Sliders', price: 65, category: 'Snacks', leadDays: 1,
            img: 'images/sloppy-joe-sliders.jpg', w: 640, h: 888, alt: 'Sloppy Joe sliders on soft rolls',
            desc: 'Soft slider rolls filled with a tasty and satisfying savoury filling.'
        },
        {
            id: 'malva-pudding', name: 'Malva Pudding & Custard', price: 45, category: 'Desserts', leadDays: 1,
            img: 'images/malva-pudding-custard.jpg', w: 320, h: 289, alt: 'Malva pudding with custard poured over it',
            desc: 'A warm South African dessert served with smooth and creamy custard.'
        },
        {
            id: 'burgers', name: 'Burgers', price: 70, category: 'Mains', leadDays: 0,
            img: 'images/homemade-burger.jpg', w: 1024, h: 1024, alt: 'Homemade double cheeseburger',
            desc: 'Delicious homemade burgers prepared with fresh ingredients and tasty toppings.'
        },
        {
            id: 'full-plates', name: 'Full Plates', price: 85, category: 'Mains', leadDays: 0,
            img: 'images/full-plate-grilled-chicken-pap.jpg', w: 640, h: 433, alt: 'Full plate of grilled chicken, pap, tomato relish and corn',
            desc: 'A filling homemade meal with a choice of protein and delicious sides.'
        }
    ];

    const BUSINESS = { lat: -28.6715, lng: 25.4097 }; // approximate - adjust on openstreetmap.org
    const AJAX_FALLBACK = 'https://jsonplaceholder.typicode.com/posts'; // free test API

    /* ---------- HELPERS ---------- */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    // Small DOM builder: el('div', {class: 'x', text: 'hi'}, child1, child2)
    function el(tag, attrs = {}, ...kids) {
        const node = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'class') node.className = value;
            else if (key === 'text') node.textContent = value;
            else node.setAttribute(key, value);
        }
        kids.flat().forEach(kid => node.append(kid));
        return node;
    }

    const money = n => 'R' + n.toFixed(2).replace('.00', '');
    const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
    const isoDate = d => {
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${m}-${day}`;
    };
    const longDate = d => d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });

    /* ---------- 1. DYNAMIC PRODUCT LISTING + SEARCH / FILTER / SORT ---------- */
    function initProducts() {
        const grid = $('#product-grid');
        if (!grid) return;

        const search = $('#product-search');
        const category = $('#product-category');
        const sort = $('#product-sort');
        const count = $('#product-count');
        const empty = $('#no-results');

        // Fill the category dropdown from the data
        [...new Set(PRODUCTS.map(p => p.category))].sort().forEach(c =>
            category.append(el('option', { value: c, text: c })));

        function card(p) {
            const img = el('img', {
                src: p.img, alt: p.alt, width: p.w, height: p.h,
                loading: 'lazy', 'data-lightbox': '', title: 'Click to enlarge'
            });
            return el('article', { class: 'product-card' },
                img,
                el('h2', { text: p.name }),
                el('p', { text: p.desc }),
                el('p', { class: 'meta', text: p.category }),
                el('p', { class: 'price', text: money(p.price) }));
        }

        function render() {
            const q = search.value.trim().toLowerCase();
            let list = PRODUCTS.filter(p =>
                (category.value === 'all' || p.category === category.value) &&
                (`${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q)));

            const sorters = {
                'price-asc': (a, b) => a.price - b.price,
                'price-desc': (a, b) => b.price - a.price,
                'name-asc': (a, b) => a.name.localeCompare(b.name)
            };
            if (sorters[sort.value]) list = list.sort(sorters[sort.value]);

            grid.replaceChildren(...list.map(card));
            makeLightboxFocusable();
            empty.hidden = list.length > 0;
            count.textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
        }

        [search, category, sort].forEach(c => c.addEventListener('input', render));
        render();
    }

    /* ---------- 2. LIGHTBOX (image gallery modal) ---------- */
    let lightbox, lightboxImg, lightboxCaption, lastFocus;

    function makeLightboxFocusable() {
        $$('img[data-lightbox]').forEach(img => {
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
        });
    }

    function initLightbox() {
        if (!$('img[data-lightbox]') && !$('#product-grid')) return;

        lightboxImg = el('img', { alt: '' });
        lightboxCaption = el('p', { class: 'lightbox-caption' });
        const close = el('button', { type: 'button', class: 'lightbox-close', 'aria-label': 'Close image' }, '\u00D7');
        lightbox = el('div', {
            class: 'lightbox', role: 'dialog', 'aria-modal': 'true',
            'aria-label': 'Image preview', hidden: ''
        }, close, lightboxImg, lightboxCaption);
        document.body.append(lightbox);

        const open = img => {
            lastFocus = img;
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = img.alt;
            lightbox.hidden = false;
            document.body.classList.add('no-scroll');
            close.focus();
        };
        const shut = () => {
            lightbox.hidden = true;
            document.body.classList.remove('no-scroll');
            if (lastFocus) lastFocus.focus();
        };

        document.addEventListener('click', e => {
            const img = e.target.closest('img[data-lightbox]');
            if (img) open(img);
            else if (!lightbox.hidden && (e.target === lightbox || e.target === close)) shut();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !lightbox.hidden) shut();
            if (e.key === 'Enter' && e.target.matches && e.target.matches('img[data-lightbox]')) open(e.target);
        });
        makeLightboxFocusable();
    }

    /* ---------- 3. ACCORDION (About page FAQ) ---------- */
    function initAccordion() {
        $$('.accordion-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = document.getElementById(btn.getAttribute('aria-controls'));
                const open = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', String(!open));
                panel.hidden = open;
            });
        });
    }

    /* ---------- 4. INTERACTIVE MAP (Leaflet + OpenStreetMap) ---------- */
    function initMap() {
        const box = $('#map');
        if (!box) return;
        if (!window.L) { box.textContent = 'The map could not load. Use the directions link below.'; return; }

        const map = L.map(box, { scrollWheelZoom: false }).setView([BUSINESS.lat, BUSINESS.lng], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const popup = el('div', {},
            el('strong', { text: 'Happy Place' }), el('br'),
            document.createTextNode('227 Potlaki Street, Tswaraganang, Dealesville'));
        L.marker([BUSINESS.lat, BUSINESS.lng]).addTo(map).bindPopup(popup).openPopup();
    }

    /* ---------- 5. FORM VALIDATION HELPERS ---------- */
    const RULES = {
        name: v => /^[\p{L}][\p{L}' -]{1,59}$/u.test(v.trim()) || 'Enter your full name (letters only, 2 to 60 characters).',
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address, for example name@example.com.',
        phoneRequired: v => /^(?:\+27|0)[1-9]\d{8}$/.test(v.replace(/[\s-]/g, '')) || 'Enter a valid South African number, for example 083 348 6381.',
        phoneOptional: v => v.trim() === '' || RULES.phoneRequired(v),
        select: v => v !== '' || 'Please choose an option from the list.',
        message: v => (v.trim().length >= 10 && v.trim().length <= 500) || 'Your message must be between 10 and 500 characters.'
    };

    function setError(input, msg) {
        let err = document.getElementById(input.id + '-error');
        if (!err) {
            err = el('p', { id: input.id + '-error', class: 'form-error', role: 'alert' });
            input.insertAdjacentElement('afterend', err);
        }
        err.textContent = msg || '';
        if (msg) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', err.id); }
        else input.removeAttribute('aria-invalid');
    }

    function checkField(form, id, rules) {
        const input = form.elements[id];
        const result = rules[id](input.value);
        setError(input, result === true ? '' : result);
        return result === true;
    }

    function validateForm(form, rules) {
        let firstBad = null;
        Object.keys(rules).forEach(id => {
            if (!checkField(form, id, rules) && !firstBad) firstBad = form.elements[id];
        });
        if (firstBad) firstBad.focus();
        return !firstBad;
    }

    function liveValidate(form, rules) {
        form.addEventListener('focusout', e => { if (rules[e.target.id]) checkField(form, e.target.id, rules); });
        form.addEventListener('input', e => {
            if (rules[e.target.id] && e.target.getAttribute('aria-invalid')) checkField(form, e.target.id, rules);
        });
    }

    function charCounter(form) {
        const box = form.elements.message;
        const out = $('#message-count');
        if (!box || !out) return;
        const update = () => { out.textContent = `${box.value.length} / 500 characters`; };
        box.addEventListener('input', update);
        update();
    }

    /* ---------- AJAX SUBMISSION ---------- */
    async function sendAjax(form, data) {
        const response = await fetch(form.dataset.endpoint || AJAX_FALLBACK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Request failed: ' + response.status);
        return response.json();
    }

    function setStatus(form, text, type) {
        const box = $('.form-status', form.parentElement);
        box.textContent = text;
        box.className = 'form-status' + (type ? ' ' + type : '');
    }

    /* ---------- 6. ENQUIRY FORM ---------- */
    function initEnquiry() {
        const form = $('#enquiry-form');
        if (!form) return;

        PRODUCTS.forEach(p => form.elements.product.append(el('option', { value: p.id, text: `${p.name} (${money(p.price)})` })));
        form.elements.date.min = isoDate(today());

        const max = today(); max.setDate(max.getDate() + 90);
        form.elements.date.max = isoDate(max);

        const rules = {
            fullName: RULES.name,
            email: RULES.email,
            phone: RULES.phoneOptional,
            product: RULES.select,
            quantity: v => (Number.isInteger(Number(v)) && v >= 1 && v <= 50) || 'Enter a whole number between 1 and 50.',
            date: v => {
                if (!v) return 'Choose the date you need your order.';
                const d = new Date(v + 'T00:00:00');
                if (d < today()) return 'The date cannot be in the past.';
                if (d > max) return 'Please choose a date within the next 90 days.';
                return true;
            },
            message: RULES.message
        };
        liveValidate(form, rules);
        charCounter(form);

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (!validateForm(form, rules)) {
                setStatus(form, 'Please fix the highlighted fields and try again.', 'error');
                return;
            }
            const data = Object.fromEntries(new FormData(form));
            setStatus(form, 'Sending your enquiry...', '');
            let saved = true;
            try { await sendAjax(form, data); } catch (err) { saved = false; }

            showQuote(data);
            setStatus(form, saved
                ? 'Thank you! Your enquiry was sent without reloading the page.'
                : 'We could not send your enquiry online. Your quote is below. Please call 083 348 6381 to confirm.',
                saved ? 'success' : 'error');
            form.reset();
            $$('.form-error', form).forEach(p => { p.textContent = ''; });
            charCounter(form);
        });
    }

    function showQuote(data) {
        const p = PRODUCTS.find(x => x.id === data.product);
        const qty = Number(data.quantity);
        const wanted = new Date(data.date + 'T00:00:00');
        const notice = p.leadDays + (qty > 10 ? 1 : 0); // big orders need an extra day
        const earliest = today(); earliest.setDate(earliest.getDate() + notice);
        const available = wanted >= earliest;

        const result = $('#enquiry-result');
        result.replaceChildren(
            el('h3', { text: `Quote for ${data.fullName.trim()}` }),
            el('ul', {},
                el('li', { text: `${qty} x ${p.name} at ${money(p.price)} each` }),
                el('li', { text: `Estimated total: ${money(p.price * qty)}` }),
                el('li', {
                    text: available
                        ? `Availability: we can have this ready for ${longDate(wanted)}.`
                        : `Availability: we need ${notice} day(s) notice. The earliest date is ${longDate(earliest)}.`
                })),
            el('p', { text: `We will confirm by email at ${data.email.trim()}.` }));
        result.className = 'result-card ' + (available ? 'ok' : 'warn');
        result.hidden = false;
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ---------- 7. CONTACT FORM (compiles an email) ---------- */
    function initContact() {
        const form = $('#contact-form');
        if (!form) return;

        const rules = {
            fullName: RULES.name,
            email: RULES.email,
            phone: RULES.phoneRequired,
            messageType: RULES.select,
            message: RULES.message
        };
        liveValidate(form, rules);
        charCounter(form);

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (!validateForm(form, rules)) {
                setStatus(form, 'Please fix the highlighted fields and try again.', 'error');
                return;
            }
            const d = Object.fromEntries(new FormData(form));
            const body = `Name: ${d.fullName.trim()}\nEmail: ${d.email.trim()}\nPhone: ${d.phone.trim()}\nMessage type: ${d.messageType}\n\n${d.message.trim()}`;
            const subject = `Happy Place - ${d.messageType} from ${d.fullName.trim()}`;
            const href = `mailto:${form.dataset.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            try { await sendAjax(form, d); } catch (err) { /* email link still works */ }

            const result = $('#contact-result');
            result.replaceChildren(
                el('h3', { text: 'Your email is ready' }),
                el('p', { text: `Check the details below, then send it to ${form.dataset.recipient}.` }),
                el('pre', { class: 'email-preview', text: `Subject: ${subject}\n\n${body}` }),
                el('a', { class: 'button-link', href, text: 'Open in my email app' }));
            result.hidden = false;
            setStatus(form, 'Details checked. Use the button below to send your email.', 'success');
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    /* ---------- 8. ANIMATION + DOM EXTRAS ---------- */
    function initReveal() {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
        }), { threshold: 0.12 });
        $$('main .section-card, main .contact-container, main .map-container').forEach(s => {
            s.classList.add('reveal');
            io.observe(s);
        });
    }

    function initBackToTop() {
        const btn = el('button', { type: 'button', class: 'back-to-top', 'aria-label': 'Back to top', hidden: '' }, '\u2191');
        document.body.append(btn);
        window.addEventListener('scroll', () => { btn.hidden = window.scrollY < 400; }, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- START ---------- */
    document.addEventListener('DOMContentLoaded', () => {
        initProducts();
        initLightbox();
        initAccordion();
        initMap();
        initEnquiry();
        initContact();
        initReveal();
        initBackToTop();
    });
})();