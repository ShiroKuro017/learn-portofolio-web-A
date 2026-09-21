/* =============================================
   PORTOFOLIO, SHIRO / EMHA WIRA
   Core Site Logic
   ============================================= */

// Clear any previous language storage and enforce English
try {
    localStorage.removeItem('lang');
} catch (e) {}
document.documentElement.lang = 'en';

document.addEventListener('DOMContentLoaded', function () {

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

    /* =============================================
       5. WORK CARDS HORIZONTAL SCROLL BUTTONS
       ============================================= */
    var workTrack = document.getElementById('work-cards-track');
    var prevBtn = document.getElementById('work-scroll-prev');
    var nextBtn = document.getElementById('work-scroll-next');
    if (workTrack && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function () {
            workTrack.scrollBy({ left: -320, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', function () {
            workTrack.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    /* =============================================
       6. AMBIENT RANDOMIZED LAVA LAMP CANVAS
       ============================================= */
    var canvas = document.getElementById('lava-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'lava-canvas';
        canvas.className = 'lava-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(canvas);
    }

    var ctx = canvas.getContext('2d');
    if (ctx) {
        var width = (canvas.width = window.innerWidth);
        var height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', function () {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, { passive: true });

        // Subtle dark pink and rose color palette (all <= 9% opacity so it is never too bright)
        var pinkColors = [
            { r: 236, g: 72, b: 153, a: 0.09 },
            { r: 244, g: 63, b: 94, a: 0.08 },
            { r: 219, g: 39, b: 119, a: 0.08 },
            { r: 244, g: 114, b: 182, a: 0.08 },
            { r: 190, g: 24, b: 93, a: 0.07 }
        ];

        // 6 randomized lava blobs
        var blobs = [];
        for (var i = 0; i < 6; i++) {
            blobs.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 190 + Math.random() * 150,
                baseRadius: 190 + Math.random() * 150,
                // Vertical speed: rising (-0.6 to -1.3) or sinking (0.6 to 1.3)
                vy: (i % 2 === 0 ? -1 : 1) * (0.6 + Math.random() * 0.7),
                // Horizontal drift
                vx: (Math.random() - 0.5) * 0.6,
                // Organic wobble
                wobbleSpeed: 0.015 + Math.random() * 0.02,
                wobbleAmp: 0.8 + Math.random() * 1.2,
                angle: Math.random() * Math.PI * 2,
                color: pinkColors[i % pinkColors.length]
            });
        }

        function animateLava() {
            ctx.fillStyle = '#0c0a09';
            ctx.fillRect(0, 0, width, height);

            for (var j = 0; j < blobs.length; j++) {
                var b = blobs[j];
                b.angle += b.wobbleSpeed;
                b.x += b.vx + Math.sin(b.angle) * b.wobbleAmp;
                b.y += b.vy;
                b.radius = b.baseRadius + Math.sin(b.angle * 1.4) * 18;

                // Lava lamp recycle: when rising above top, reappear from bottom with randomized position and speed
                if (b.y < -b.radius) {
                    b.y = height + b.radius;
                    b.x = Math.random() * width;
                    b.vx = (Math.random() - 0.5) * 0.6;
                    b.vy = -1 * (0.6 + Math.random() * 0.7);
                } else if (b.y > height + b.radius) {
                    b.y = -b.radius;
                    b.x = Math.random() * width;
                    b.vx = (Math.random() - 0.5) * 0.6;
                    b.vy = 1 * (0.6 + Math.random() * 0.7);
                }

                // Horizontal wrap
                if (b.x < -b.radius) b.x = width + b.radius;
                if (b.x > width + b.radius) b.x = -b.radius;

                // Draw soft feathered radial gradient
                var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
                var c = b.color;
                grad.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')');
                grad.addColorStop(0.45, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (c.a * 0.4) + ')');
                grad.addColorStop(0.75, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0.005)');
                grad.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animateLava);
        }

        requestAnimationFrame(animateLava);
    }

});
