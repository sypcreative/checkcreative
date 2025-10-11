/**
 *  Slider con animación de texto — GSAP + SplitType
 *  -------------------------------------------------------------
 *
 *  ⚠️  Cada slide debe llevar la clase .swiper-slide (o cámbiala en
 *      slideSelector) y los elementos que animan texto el data-anim "swiper-anim"
 */

import { gsap } from 'gsap';
import SplitType from 'split-type';
import { preloadModels, showModel } from './model.js';

const sliderSelector = '.section-product-swiper';
const slideSelector = '.swiper-slide';
const nextBtnSelector = '.section-product-swiper_nav--next';
const prevBtnSelector = '.section-product-swiper_nav--prev';
const paginationSelector = '.swiper-pagination';

const TRANSITION_TIME = 0.8;   // letras + fade
const DELAY_BETWEEN_SLIDES = 0.6;   // espera entre out e in

export function initSlider() {
    preloadModels()
        .then(startSlider)
        .catch(console.error);
}

/* ---------------------------- Helpers GSAP / Split ------------------------- */
function prepare(el) {
    if (!el.split) {
        el.split = new SplitType(el, {             // 👈 types: 'lines'
            types: 'lines',                        // «lines» en vez de «chars»
            lineClass: 'line',                    //   (opcional: clase a cada línea)
            lineThreshold: 0.1                    //   (para cortar bien en <br>)
        });
    }
    // 2 ▸ colocamos las líneas fuera de vista
    gsap.set(el.split.lines, { yPercent: 100, opacity: 0 });
}

function animateOut(slide) {
    const tl = gsap.timeline({
        defaults: { duration: TRANSITION_TIME, ease: 'power3.in' },
        onStart() { gsap.set(slide, { pointerEvents: 'none', zIndex: 1 }); },
        onComplete() { gsap.set(slide, { opacity: 0, zIndex: 0 }); }
    });

    slide.querySelectorAll('[data-anim="swiper-anim"]').forEach(el => {
        const lines = el.split?.lines;
        if (!lines) return;
        tl.killTweensOf(lines);
        // 3 ▸ animamos cada LÍNEA hacia arriba con pequeño stagger inverso
        tl.to(lines, {
            yPercent: -100,
            opacity: 0,
            stagger: { each: 0.1, from: 'end' }   // 👈 leve separación
        }, 0);
    });

    tl.to(slide, { opacity: 0 }, 0.6);
    return tl;
}

function animateIn(slide) {
    const tl = gsap.timeline({
        defaults: { duration: TRANSITION_TIME, ease: 'power3.out' },
        onStart() { gsap.set(slide, { opacity: 1, pointerEvents: 'auto', zIndex: 2 }); }
    });

    slide.querySelectorAll('[data-anim="swiper-anim"]').forEach(el => {
        prepare(el);                               // asegura split & reset
        const lines = el.split.lines;
        tl.fromTo(lines,
            { yPercent: 100, opacity: 0 },
            {
                yPercent: 0,
                opacity: 1,
                stagger: { each: 0.1, from: 'start' } // 👈 mismo stagger suave
            },
            0.8                                     // igual que antes
        );
    });

    return tl;
}
/* ------------------------------- Slider core ------------------------------- */
function startSlider() {
    const slider = document.querySelector(sliderSelector);
    const slides = Array.from(slider?.querySelectorAll(slideSelector) || []);
    const buyButton = document.getElementById('buy-button');

    if (!slider || !slides.length) return;

    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);
    const pagination = document.querySelector(paginationSelector);

    let activeIndex = 0;

    /* --- preparar slides en el DOM --- */
    slides.forEach((s, i) => {
        gsap.set(s, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: i === activeIndex ? 1 : 0,
            zIndex: i === activeIndex ? 2 : 0
        });
        s.querySelectorAll('[data-anim="swiper-anim"]').forEach(prepare);
    });

    buildPagination();
    updateNavState();
    animateIn(slides[activeIndex]);
    updateBackground(slides[activeIndex].dataset.bg);
    showModel(activeIndex);

    // ✅ ACTUALIZAR ENLACE DEL BOTÓN EN LA CARGA INICIAL
    if (buyButton && slides[activeIndex].dataset.permalink) {
        buyButton.setAttribute('href', slides[activeIndex].dataset.permalink);
    }

    function updateBackground(color) {
        const bgOverlay = document.createElement('div');
        bgOverlay.className = 'swiper-bg-transition';
        bgOverlay.style.position = 'absolute';
        bgOverlay.style.inset = 0;
        bgOverlay.style.background = color;
        bgOverlay.style.zIndex = 0;
        bgOverlay.style.transform = 'translateY(100%)';
        bgOverlay.style.transition = 'transform 0.6s ease';

        slider.appendChild(bgOverlay);
        // Trigger animation (sube hacia arriba)
        setTimeout(() => {
            bgOverlay.style.transform = 'translateY(0%)';
        }, 800); // mismo que TRANSITION_TIME (0.8s)

        setTimeout(() => {
            const overlays = slider.querySelectorAll('.swiper-bg-transition');
            overlays.forEach((el, i) => { if (i < overlays.length - 1) el.remove(); });
        }, 1600);
    }
    /* --------------------------- Navegación -------------------------------- */

    function goTo(index) {
        if (index === activeIndex || index < 0 || index >= slides.length) return;
        const current = slides[activeIndex];
        const next = slides[index];
        const color = next.dataset.bg || '#000'; // fallback por si falta

        animateOut(current);
        gsap.delayedCall(DELAY_BETWEEN_SLIDES, () => animateIn(next));

        activeIndex = index;
        updateNavState();
        showModel(index);
        updateBackground(color);

        // 🔁 Actualizar href del botón "Comprar"
        if (buyButton && next.dataset.permalink) {
            buyButton.setAttribute('href', next.dataset.permalink);
        }
    }

    function nextSlide() { goTo(activeIndex + 1); }
    function prevSlide() { goTo(activeIndex - 1); }

    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);
    /* --- paginación --- */
    function buildPagination() {
        if (!pagination) return;
        pagination.innerHTML = slides.map((_, i) =>
            `<button class="swiper-pagination-bullet${i === activeIndex ? ' is-active' : ''}" data-index="${i}"></button>`
        ).join('');
        pagination.addEventListener('click', e => {
            if (e.target.matches('.swiper-pagination-bullet')) {
                goTo(+e.target.dataset.index);
            }
        });
    }

    /* --- estado botones + bullets + altura --- */
    function updateNavState() {
        if (pagination) {
            pagination.querySelectorAll('.swiper-pagination-bullet').forEach((b, i) =>
                b.classList.toggle('is-active', i === activeIndex));
        }
        prevBtn && (prevBtn.disabled = activeIndex === 0);
        nextBtn && (nextBtn.disabled = activeIndex === slides.length - 1);
        autoHeight();
    }

    /* --- ajusta automáticamente la altura del contenedor --- */
    function autoHeight() {
        const h = slides[activeIndex].offsetHeight;
        gsap.to(slider, { height: h, duration: 0.4, ease: 'power2.out' });
    }

    /* ------------------ Soporte touch & teclado (opcional) ----------------- */
    let startX = 0;
    slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) (dx < 0 ? nextSlide() : prevSlide());
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
}