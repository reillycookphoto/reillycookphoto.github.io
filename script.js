document.addEventListener('DOMContentLoaded', () => {
    // Shared Elements
    const loader = document.getElementById('loader');
    const header = document.getElementById('main-header');

    // Dynamic copyright year and experience years
    document.querySelectorAll('.copyright-year').forEach(el => el.textContent = new Date().getFullYear());
    
    const expYears = document.getElementById('experience-years');
    if (expYears) {
        const currentYear = new Date().getFullYear();
        expYears.textContent = (currentYear - 2019) + '+';
    }

    // Loader logic - Show only once per session
    const loaderShown = sessionStorage.getItem('loaderShown');

    if (!loaderShown) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('fade-out');
                    sessionStorage.setItem('loaderShown', 'true');
                }
            }, 800);
        });
    } else {
        if (loader) loader.style.display = 'none';
    }

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (!header) return;
        // If it's a subpage (already has scrolled class), don't remove it
        const isSubpage = document.querySelector('.subpage-main');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (!isSubpage) {
            header.classList.remove('scrolled');
        }
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Intersection Observer for reveal animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeIn');
            }
        });
    }, observerOptions);

    // --- GALLERY LOGIC (index.html) ---
    const grid = document.getElementById('photo-grid');
    if (grid) {
        initGallery(grid, observer);
    }

    // --- SPECIALTIES LOGIC (index.html) ---
    const specialtiesContainer = document.getElementById('specialties-container');
    if (specialtiesContainer) {
        loadSpecialties(specialtiesContainer);
    }

    // --- PRESS LOGIC (press.html) ---
    const pressList = document.getElementById('press-list');
    if (pressList) {
        loadPress(pressList, observer);
    }

    // --- PRESS TEASER LOGIC (index.html) ---
    const pressTeaserList = document.getElementById('press-teaser-list');
    if (pressTeaserList) {
        loadPressTeaser(pressTeaserList);
    }

    // --- PACKAGES LOGIC (index.html) ---
    const pricingContainer = document.getElementById('pricing-container');
    if (pricingContainer) {
        loadPackages(pricingContainer, observer);
    }

    // --- ABOUT LOGIC (about.html) ---
    const aboutReveal = document.querySelectorAll('.about-text, .about-image, .contact-card');
    if (aboutReveal.length > 0) {
        aboutReveal.forEach(el => observer.observe(el));
    }
    const aboutContent = document.getElementById('about-content');
    if (aboutContent) {
        loadAbout(aboutContent);
    }

    // GALLERY / CAROUSEL FUNCTIONS
    function initGallery(carouselEl, observer) {
        const photos = [
            "BYU-Idaho_vs_BYU_Provo_Basketball_game.jpg",
            "Christmas_show_with_Laura_Osnes.jpg",
            "Commencement_BYU-Idaho.jpg",
            "Devotional_with_Jennie_Pardoe.jpg",
            "Elder_Anderson.jpg",
            "Elder_Ulisses Soares.jpg",
            "Honor_code_temple_example.jpg",
            "Mud_fest.jpg",
            "Mud_fest_2.jpg",
            "Mud_fest_3.jpg",
            "Mud_fest_4.jpg",
            "Outdoor_recreation_at_Yellowstone.jpg",
            "ROTC_Black Hawk.jpg",
            "Temple_color_run.jpg",
            "Temple_color_run_3.jpg",
            "DJI_0023-HDR.JPG",
            "DJI_0195-Pano.JPG",
            "DSC_0114.JPG",
            "DSC_0307-Pano.JPG",
            "DSC_0351.JPG",
            "DSC_0432-Edit.JPG",
            "DSC_0904.JPG",
            "DSC_1306.jpg",
            "DSC_1362-Edit-2.jpg",
            "DSC_2706-HDR.JPG",
            "DSC_3643.JPG",
            "DSC_5010-HDR.JPG",
            "DSC_7506.JPG",
            "DSC_8772_merged-Pano.JPG"
        ];

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        const closeLightbox = document.querySelector('.close-lightbox');
        const lbPrev = document.querySelector('.prev');
        const lbNext = document.querySelector('.next');
        let currentPhotoIndex = 0;

        function formatCaption(filename) {
            let caption = filename.split('.')[0];
            caption = caption.replace(/^\d+_/, '').replace(/_/g, ' ').replace(/-/g, ' ');
            return caption.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }

        // ── Build carousel DOM (CSS scroll-snap) ─────────────
        // The carousel itself IS the scroll container (no inner track needed)
        carouselEl.classList.add('carousel-snap');

        const slides = photos.map((photo, i) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            const img = document.createElement('img');
            img.alt = formatCaption(photo);
            img.dataset.src = `photos/${photo}`;
            img.className = 'carousel-img';

            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            caption.textContent = formatCaption(photo);

            slide.appendChild(img);
            slide.appendChild(caption);
            slide.addEventListener('click', () => openLightbox(i));
            carouselEl.appendChild(slide);
            return { slide, img };
        });

        // counter + buttons appended to a dedicated wrapper around the carousel
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';
        carouselEl.parentNode.insertBefore(wrapper, carouselEl);
        wrapper.appendChild(carouselEl);

        const counter = document.createElement('div');
        counter.className = 'carousel-counter';
        counter.textContent = `1 / ${photos.length}`;
        wrapper.appendChild(counter);

        const btnPrev = document.createElement('button');
        const btnNext = document.createElement('button');
        btnPrev.className = 'carousel-btn carousel-btn-prev';
        btnNext.className = 'carousel-btn carousel-btn-next';
        btnPrev.innerHTML = '&larr;';
        btnNext.innerHTML = '&rarr;';
        wrapper.appendChild(btnPrev);
        wrapper.appendChild(btnNext);

        // ── Lazy load via IntersectionObserver ───────────────
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('.carousel-img');
                    if (img && img.dataset.src && !img.src) {
                        img.src = img.dataset.src;
                    }
                    imgObserver.unobserve(entry.target);
                }
            });
        }, { root: carouselEl, threshold: 0.1 });

        slides.forEach(s => imgObserver.observe(s.slide));

        // ── Navigate ─────────────────────────────────────────
        let current = 0;

        function goTo(index) {
            current = Math.max(0, Math.min(index, photos.length - 1));
            carouselEl.scrollTo({ left: current * carouselEl.clientWidth, behavior: 'smooth' });
        }

        btnPrev.addEventListener('click', () => goTo(current - 1));
        btnNext.addEventListener('click', () => goTo(current + 1));

        // Update counter as user scrolls/swipes natively
        carouselEl.addEventListener('scroll', () => {
            const idx = Math.round(carouselEl.scrollLeft / carouselEl.clientWidth);
            if (idx !== current) {
                current = idx;
                counter.textContent = `${current + 1} / ${photos.length}`;
            }
        }, { passive: true });

        // ── Lightbox ─────────────────────────────────────────
        function openLightbox(index) {
            currentPhotoIndex = index;
            lightboxImg.src = `photos/${photos[index]}`;
            lightboxCaption.textContent = formatCaption(photos[index]);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeLightboxModal() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeLightbox.addEventListener('click', closeLightboxModal);
        lbNext.addEventListener('click', e => { e.stopPropagation(); currentPhotoIndex = (currentPhotoIndex + 1) % photos.length; openLightbox(currentPhotoIndex); });
        lbPrev.addEventListener('click', e => { e.stopPropagation(); currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length; openLightbox(currentPhotoIndex); });
        lightbox.addEventListener('click', closeLightboxModal);
        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightboxModal();
                if (e.key === 'ArrowRight') lbNext.click();
                if (e.key === 'ArrowLeft') lbPrev.click();
                return;
            }
            if (e.key === 'ArrowRight') goTo(current + 1);
            if (e.key === 'ArrowLeft') goTo(current - 1);
        });

        // ── Init ─────────────────────────────────────────────
        goTo(0, false);
    }

    // PRESS FUNCTIONS
    function formatPressDate(dateString) {
        if (!dateString) return "Unknown";
        if (dateString === "Unsplash") return "Unsplash";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Unknown";
        const options = { year: 'numeric', month: 'long', timeZone: 'UTC' };
        return date.toLocaleDateString('en-US', options);
    }

    async function loadPress(container, observer) {
        try {
            const response = await fetch('content/press.json');
            const data = await response.json();
            data.sort((a, b) => {
                // Pin logic - Pinned items always go first
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;

                // Then sort by date (descending)
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                if (a.date === "Unsplash" || !a.date) return 1;
                if (b.date === "Unsplash" || !b.date) return -1;
                return dateB - dateA;
            });

            data.forEach(item => {
                const article = document.createElement('article');
                article.classList.add('press-item');
                if (item.pinned) article.classList.add('pinned-item');
                
                const dateText = formatPressDate(item.date);
                
                // Simplified color generation for institutions
                const getInstitutionColor = (name) => {
                    const colors = [
                        '#9c8162', // Even Darker Gold
                        '#567a91', // Even Darker Blue
                        '#7a5a91', // Even Darker Purple
                        '#5a917a', // Even Darker Green
                        '#915a5a', // Even Darker Red
                        '#7a915a'  // Even Darker Lime
                    ];
                    let hash = 0;
                    for (let i = 0; i < name.length; i++) {
                        hash = name.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    return colors[Math.abs(hash) % colors.length];
                };

                const instColor = item.institution ? getInstitutionColor(item.institution) : '#c4a47c';
                const instHtml = item.institution ? `<span class="press-institution" style="background-color: ${instColor}; color: #fff; border: none;">${item.institution}</span>` : '';

                article.innerHTML = `
                    <div class="press-date">${dateText}</div>
                    <div class="press-content">
                        <h3>${item.title}</h3>
                        ${instHtml}
                        <p>${item.description}</p>
                        <a href="${item.url}" target="_blank" class="press-link">${item.label} &rarr;</a>
                    </div>
                `;
                container.appendChild(article);
                observer.observe(article);
            });
        } catch (error) {
            console.error('Error loading press data:', error);
        }
    }

    // PRESS TEASER FUNCTION (index.html — shows top 3)
    async function loadPressTeaser(container) {
        try {
            const response = await fetch('content/press.json');
            const data = await response.json();
            data.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
            });

            const getInstitutionColor = (name) => {
                const colors = ['#9c8162','#567a91','#7a5a91','#5a917a','#915a5a','#7a915a'];
                let hash = 0;
                for (let i = 0; i < name.length; i++) {
                    hash = name.charCodeAt(i) + ((hash << 5) - hash);
                }
                return colors[Math.abs(hash) % colors.length];
            };

            const pinned = data.filter(item => item.pinned);
            const teaser = pinned.length > 0 ? pinned : data.slice(0, 3);
            teaser.forEach(item => {
                const dateText = formatPressDate(item.date);
                const instColor = item.institution ? getInstitutionColor(item.institution) : '#9c8162';
                const instHtml = item.institution ? `<span class="press-institution" style="background-color: ${instColor}; color: #fff; border: none;">${item.institution}</span>` : '';
                const div = document.createElement('div');
                div.classList.add('press-teaser-item');
                div.innerHTML = `
                    <div class="press-teaser-date">${dateText}</div>
                    <div class="press-teaser-content">
                        <h3><a href="${item.url}" target="_blank" style="text-decoration:none;color:inherit;">${item.title}</a></h3>
                        ${instHtml}
                    </div>
                `;
                container.appendChild(div);
            });
        } catch (error) {
            console.error('Error loading press teaser:', error);
        }
    }
    // PACKAGES FUNCTIONS
    async function loadPackages(container, observer) {
        try {
            const response = await fetch('content/packages.txt');
            const text = await response.text();
            
            // Split by double newlines or similar to get blocks
            const blocks = text.split(/\n\s*\n/).filter(block => block.trim() !== "");
            
            blocks.forEach((block, index) => {
                const lines = block.split('\n').map(l => l.trim()).filter(l => l !== "");
                const pkg = {
                    price: "",
                    title: "",
                    description: "",
                    features: [],
                    image: { src: "", alt: "" }
                };

                lines.forEach(line => {
                    if (line.startsWith('$')) {
                        pkg.price = line.replace('$', '').trim();
                    } else if (line.startsWith('#')) {
                        pkg.title = line.replace('#', '').trim();
                    } else if (line.startsWith('-')) {
                        pkg.description = line.replace('-', '').trim();
                    } else if (line.startsWith('*')) {
                        pkg.features.push(line.replace('*', '').trim());
                    } else if (line.startsWith('![')) {
                        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                        if (match) {
                            pkg.image.alt = match[1];
                            pkg.image.src = match[2];
                        }
                    }
                });

                if (pkg.title) {
                    const row = document.createElement('div');
                    row.className = `pricing-row ${index % 2 !== 0 ? 'row-reverse' : ''}`;
                    
                    const featuresHtml = pkg.features.map(f => `<li>${f}</li>`).join('');
                    
                    row.innerHTML = `
                        <div class="pricing-img-wrap">
                            <img src="${pkg.image.src}" alt="${pkg.image.alt}">
                        </div>
                        <div class="pricing-content">
                            <span class="pricing-label">${pkg.price}</span>
                            <h3>${pkg.title}</h3>
                            <p>${pkg.description}</p>
                            <ul class="pricing-features">
                                ${featuresHtml}
                            </ul>
                        </div>
                    `;
                    container.appendChild(row);
                    observer.observe(row);
                }
            });
        } catch (error) {
            console.error('Error loading packages:', error);
        }
    }

    // ABOUT FUNCTIONS
    async function loadAbout(container) {
        try {
            const response = await fetch('content/about.txt');
            const text = await response.text();
            
            const lines = text.split('\n').map(l => l.trim()).filter(l => l !== "");
            let html = "";
            
            lines.forEach(line => {
                if (line.startsWith('#')) {
                    html += `<h2>${line.replace('#', '').trim()}</h2>`;
                } else if (line.startsWith('-')) {
                    html += `<p>${line.replace('-', '').trim()}</p>`;
                }
            });
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error loading about content:', error);
        }
    }

    // SPECIALTIES FUNCTIONS
    async function loadSpecialties(container) {
        try {
            const response = await fetch('content/specialties.txt');
            const text = await response.text();
            
            const blocks = text.split(/\n\s*\n/).filter(block => block.trim() !== "");
            
            blocks.forEach(block => {
                const lines = block.split('\n').map(l => l.trim()).filter(l => l !== "");
                const spec = { title: "", description: "", image: { src: "", alt: "" } };

                lines.forEach(line => {
                    if (line.startsWith('#')) {
                        spec.title = line.replace('#', '').trim();
                    } else if (line.startsWith('-')) {
                        spec.description = line.replace('-', '').trim();
                    } else if (line.startsWith('![')) {
                        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                        if (match) {
                            spec.image.alt = match[1];
                            spec.image.src = match[2];
                        }
                    }
                });

                if (spec.title) {
                    const card = document.createElement('div');
                    card.className = 'service-card';
                    card.innerHTML = `
                        <div class="service-img-wrap">
                            <img src="${spec.image.src}" alt="${spec.image.alt}">
                            <div class="service-overlay"></div>
                        </div>
                        <div class="service-text">
                            <h3>${spec.title}</h3>
                            <p>${spec.description}</p>
                        </div>
                    `;
                    container.appendChild(card);
                }
            });
        } catch (error) {
            console.error('Error loading specialties:', error);
        }
    }
});
