/* =============================================
   PORTOFOLIO, SHIRO / EMHA WIRA
   Bilingual Sync & Core Site Logic
   ============================================= */

// Global Bilingual Switcher
window.applySiteLanguage = function (lang) {
    var currentLang = lang || localStorage.getItem('lang') || 'en';
    localStorage.setItem('lang', currentLang);
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
        var textEn = el.getAttribute('data-i18n-en');
        var textId = el.getAttribute('data-i18n-id');
        if (currentLang === 'id' && textId) {
            el.innerHTML = textId;
        } else if (textEn) {
            el.innerHTML = textEn;
        }
    });

    var langEnSpans = document.querySelectorAll('.lang-en-span');
    var langIdSpans = document.querySelectorAll('.lang-id-span');

    if (currentLang === 'id') {
        langEnSpans.forEach(function (s) { s.className = 'lang-en-span text-gray-500 font-normal hover:text-gray-300'; });
        langIdSpans.forEach(function (s) { s.className = 'lang-id-span text-white font-bold'; });
    } else {
        langEnSpans.forEach(function (s) { s.className = 'lang-en-span text-white font-bold'; });
        langIdSpans.forEach(function (s) { s.className = 'lang-id-span text-gray-500 font-normal hover:text-gray-300'; });
    }
};

// Global Event Delegation for Language Toggle Buttons
document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('.lang-toggle-btn');
    if (toggleBtn) {
        var curr = localStorage.getItem('lang') || 'en';
        var newLang = (curr === 'en') ? 'id' : 'en';
        window.applySiteLanguage(newLang);
    }
});

// Run language application on DOM ready & DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    // Initial sync
    window.applySiteLanguage(localStorage.getItem('lang') || 'en');

    /* =============================================
       1. LUCIDE ICONS
       ============================================= */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* =============================================
       2. MOBILE MENU TOGGLE
       ============================================= */
    var menuBtn = document.getElementById('menu-toggle');
    var mobilePanel = document.getElementById('mobile-nav-panel');

    if (menuBtn && mobilePanel) {
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            mobilePanel.classList.toggle('open');
        });

        mobilePanel.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobilePanel.classList.remove('open');
            });
        });

        document.addEventListener('click', function (e) {
            if (!mobilePanel.contains(e.target) && !menuBtn.contains(e.target)) {
                mobilePanel.classList.remove('open');
            }
        });
    }

    /* =============================================
       3. SCROLL REVEAL , IntersectionObserver
       ============================================= */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* =============================================
       4. STICKY HEADER , border on scroll
       ============================================= */
    var header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

});
