document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const gallery = document.getElementById('background-gallery');
    const header = document.querySelector('header');
    
    if (!gallery || !header) {
        return;
    }

    // Daftar semua gambar yang akan ditampilkan di latar belakang
    // Pastikan path ini sesuai dengan struktur folder Anda (images/nama-file.jpg)
const imageSources = [
    // 1-16: images/Gambar
    'images/Gambar/karya-1.jpg', 'images/Gambar/karya-2.jpg', 'images/Gambar/karya-3.jpg',
    'images/Gambar/karya-4.jpg', 'images/Gambar/karya-5.jpg', 'images/Gambar/karya-6.jpg',
    'images/Gambar/karya-7.jpg', 'images/Gambar/karya-8.jpg', 'images/Gambar/karya-9.jpg',
    'images/Gambar/karya-10.jpg', 'images/Gambar/karya-11.jpg', 'images/Gambar/karya-12.jpg',
    'images/Gambar/karya-13.jpg', 'images/Gambar/karya-14.jpg', 'images/Gambar/karya-15.jpg',
    'images/Gambar/karya-16.jpg',
    
    // 17-59: images/3D
    'images/3D/karya-17.jpg', 'images/3D/karya-18.jpg', 'images/3D/karya-19.jpg',
    'images/3D/karya-20.jpg', 'images/3D/karya-21.jpg', 'images/3D/karya-22.jpg',
    'images/3D/karya-23.jpg', 'images/3D/karya-24.jpg', 'images/3D/karya-25.jpg',
    'images/3D/karya-26.jpg', 'images/3D/karya-27.jpg', 'images/3D/karya-28.jpg',
    'images/3D/karya-29.jpg', 'images/3D/karya-30.jpg', 'images/3D/karya-31.jpg',
    'images/3D/karya-32.jpg', 'images/3D/karya-33.jpg', 'images/3D/karya-34.jpg',
    'images/3D/karya-35.jpg', 'images/3D/karya-36.jpg', 'images/3D/karya-37.jpg',
    'images/3D/karya-38.jpg', 'images/3D/karya-39.jpg', 'images/3D/karya-40.jpg',
    'images/3D/karya-41.jpg', 'images/3D/karya-42.jpg', 'images/3D/karya-43.jpg',
    'images/3D/karya-44.jpg', 'images/3D/karya-45.jpg', 'images/3D/karya-46.jpg',
    'images/3D/karya-47.jpg', 'images/3D/karya-48.jpg', 'images/3D/karya-49.jpg',
    'images/3D/karya-50.jpg', 'images/3D/karya-51.jpg', 'images/3D/karya-52.jpg',
    'images/3D/karya-53.jpg', 'images/3D/karya-54.jpg', 'images/3D/karya-55.jpg',
    'images/3D/karya-56.jpg', 'images/3D/karya-57.jpg', 'images/3D/karya-58.jpg',
    'images/3D/karya-59.jpg',

];

/** cadangan
    // 60-100: images/karya (original)
    'images/karya-60.jpg', 'images/karya-61.jpg', 'images/karya-62.jpg',
    'images/karya-63.jpg', 'images/karya-64.jpg', 'images/karya-65.jpg',
    'images/karya-66.jpg', 'images/karya-67.jpg', 'images/karya-68.jpg',
    'images/karya-69.jpg', 'images/karya-70.jpg', 'images/karya-71.jpg',
    'images/karya-72.jpg', 'images/karya-73.jpg', 'images/karya-74.jpg',
    'images/karya-75.jpg', 'images/karya-76.jpg', 'images/karya-77.jpg',
    'images/karya-78.jpg', 'images/karya-79.jpg', 'images/karya-80.jpg',
    'images/karya-81.jpg', 'images/karya-82.jpg', 'images/karya-83.jpg',
    'images/karya-84.jpg', 'images/karya-85.jpg', 'images/karya-86.jpg',
    'images/karya-87.jpg', 'images/karya-88.jpg', 'images/karya-89.jpg',
    'images/karya-90.jpg', 'images/karya-91.jpg', 'images/karya-92.jpg',
    'images/karya-93.jpg', 'images/karya-94.jpg', 'images/karya-95.jpg',
    'images/karya-96.jpg', 'images/karya-97.jpg', 'images/karya-98.jpg',
    'images/karya-99.jpg', 'images/karya-100.jpg'
     */


    // Pengaturan untuk tata letak galeri
    const settings = {
        columns: 5, // Jumlah kolom untuk tata letak masonry
        gap: 16     // Jarak antar gambar dalam piksel
    };

    /**
     * Fungsi utama untuk membuat dan menampilkan galeri masonry.
     */
    function setupGallery() {
        gallery.innerHTML = '';
        const shuffledImages = [...imageSources].sort(() => 0.5 - Math.random());
        const headerHeight = header.offsetHeight;
        const colWidth = (window.innerWidth - (settings.gap * (settings.columns + 1))) / settings.columns;
        const columnHeights = Array(settings.columns).fill(settings.gap); // Mulai dari atas

        shuffledImages.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            img.onerror = () => { img.src = `https://placehold.co/400x500?text=Error`; };

            img.onload = () => {
                if (img.naturalHeight === 0) return;
                let minHeight = Math.min(...columnHeights);
                let targetColumnIndex = columnHeights.indexOf(minHeight);
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.appendChild(img);
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const itemHeight = colWidth / aspectRatio;
                const top = columnHeights[targetColumnIndex];
                const left = settings.gap + targetColumnIndex * (colWidth + settings.gap);
                item.style.width = `${colWidth}px`;
                item.style.height = `${itemHeight}px`;
                item.style.top = `${top}px`;
                item.style.left = `${left}px`;
                gallery.appendChild(item);
                columnHeights[targetColumnIndex] += itemHeight + settings.gap;
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100 + (index * 50));
            };
        });
    }

    setupGallery();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setupGallery, 500);
    });
});
