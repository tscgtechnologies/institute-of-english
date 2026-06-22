/* -------------------------------------------------------------
   INSTITUTE OF ENGLISH - SCRIPTS (PURE VANILLA JAVASCRIPT)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Mobile Navigation Toggle & Drawer
    // ==========================================
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }


    // ==========================================
    // 2. Sticky Header scroll state
    // ==========================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active link highlighting on scroll
        highlightNavLink();
    });

    function highlightNavLink() {
        let scrollPosition = window.scrollY + 150;
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    // ==========================================
    // 3. Mouse Following Glowing Orb
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    
    // Check if device is touch-based
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (cursorGlow && !isTouchDevice) {
        cursorGlow.style.display = 'block';
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let orbX = mouseX;
        let orbY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Linear Interpolation (lerp) for smooth trailing
        const updateOrb = () => {
            const ease = 0.08;
            orbX += (mouseX - orbX) * ease;
            orbY += (mouseY - orbY) * ease;
            
            cursorGlow.style.left = `${orbX}px`;
            cursorGlow.style.top = `${orbY}px`;
            
            requestAnimationFrame(updateOrb);
        };
        updateOrb();
    }


    // ==========================================
    // 4. HTML5 Canvas Particles Engine (Hero Section)
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let canvasWidth = canvas.parentElement.offsetWidth;
        let canvasHeight = canvas.parentElement.offsetHeight;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Track mouse in canvas coordinate space
        let canvasMouse = {
            x: null,
            y: null,
            radius: 120
        };
        
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            canvasMouse.x = e.clientX - rect.left;
            canvasMouse.y = e.clientY - rect.top;
        });
        
        window.addEventListener('mouseleave', () => {
            canvasMouse.x = null;
            canvasMouse.y = null;
        });
        
        // Handle canvas resize
        window.addEventListener('resize', () => {
            if (canvas.parentElement) {
                canvasWidth = canvas.parentElement.offsetWidth;
                canvasHeight = canvas.parentElement.offsetHeight;
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                initParticles();
            }
        });
        
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
                this.baseSize = size;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            
            update() {
                // Keep inside canvas bounds
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                
                // Mouse interaction (Repulsion effect)
                if (canvasMouse.x !== null && canvasMouse.y !== null) {
                    let dx = this.x - canvasMouse.x;
                    let dy = this.y - canvasMouse.y;
                    let distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if (distance < canvasMouse.radius) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        
                        // Push force strength
                        let force = (canvasMouse.radius - distance) / canvasMouse.radius;
                        let directionX = forceDirectionX * force * 3;
                        let directionY = forceDirectionY * force * 3;
                        
                        this.x += directionX;
                        this.y += directionY;
                        this.size = this.baseSize * 1.5;
                    } else {
                        if (this.size > this.baseSize) {
                            this.size -= 0.1;
                        }
                    }
                }
                
                this.x += this.directionX;
                this.y += this.directionY;
                
                this.draw();
            }
        }
        
        function initParticles() {
            particlesArray = [];
            let numberOfParticles = Math.floor((canvas.width * canvas.height) / 16000);
            // Cap particles count to prevent lags
            numberOfParticles = Math.min(numberOfParticles, 80);
            numberOfParticles = Math.max(numberOfParticles, 30);
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                
                // Slow speeds for smooth aesthetic
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(245, 158, 11, 0.4)';
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }
        
        // Connect nearby particles with lines
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if (distance < 110) {
                        opacityValue = 1 - (distance/110);
                        ctx.strokeStyle = `rgba(245, 158, 11, ${opacityValue * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
    }


    // ==========================================
    // 5. Scroll Reveal Animations (Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                
                // Trigger specific sub-animations if needed
                if (entry.target.classList.contains('stats-section') || entry.target.querySelector('.counter')) {
                    startCounters(entry.target);
                }
                
                // Trigger progress bar animations inside Success Cards
                const progressBars = entry.target.querySelectorAll('.progress-bar-fill');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth) {
                        bar.style.width = targetWidth;
                    }
                });
                
                // Once shown, we stop observing this node to preserve layout
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 6. Statistics Counter Animation
    // ==========================================
    function startCounters(container) {
        const counters = container.querySelectorAll('.counter:not(.started)');
        
        counters.forEach(counter => {
            counter.classList.add('started');
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                let increment = Math.ceil(target / (duration / stepTime));
                current += increment;
                
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = current;
                }
            }, stepTime);
        });
    }


    // ==========================================
    // 7. Testimonials Auto-sliding Carousel
    // ==========================================
    const carousel = document.getElementById('testimonialCarousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('#carouselIndicators .indicator');
    let currentIndex = 0;
    let slideInterval;
    
    if (carousel && slides.length > 0) {
        
        function goToSlide(index) {
            currentIndex = index;
            // Translate the carousel track
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active states of indicator bubbles
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });
        }
        
        function nextSlide() {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }
        
        function startSlideTimer() {
            slideInterval = setInterval(nextSlide, 4500);
        }
        
        function stopSlideTimer() {
            clearInterval(slideInterval);
        }
        
        // Manual bubble navigation click handlers
        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                goToSlide(i);
                stopSlideTimer();
                startSlideTimer(); // reset interval after manual override
            });
        });
        
        // Pause slide changes on hover
        const wrapper = carousel.parentElement;
        wrapper.addEventListener('mouseenter', stopSlideTimer);
        wrapper.addEventListener('mouseleave', startSlideTimer);
        
        // Start sliding loop
        startSlideTimer();
    }


    // ==========================================
    // 8. Gallery Masonry Filters
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        // Trigger a small entry scale animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        // Wait for transition before hiding display fully
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }


    // ==========================================
    // 9. About Section Tabs
    // ==========================================
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabTriggers.length > 0) {
        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetTab = trigger.getAttribute('data-tab');
                
                tabTriggers.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                trigger.classList.add('active');
                const targetContentEl = document.getElementById(targetTab);
                if (targetContentEl) {
                    targetContentEl.classList.add('active');
                }
            });
        });
    }


    // ==========================================
    // 10. Contact Form Submission & WhatsApp Link
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    
    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const courseInterest = document.getElementById('courseInterest').value;
            const userMessage = document.getElementById('userMessage').value.trim();
            
            if (!fullName || !phoneNumber || !courseInterest) {
                showFeedback('Please fill out all mandatory fields.', 'error');
                return;
            }
            
            // Simulate API Call / submission processing
            showFeedback('Processing your registration...', 'info');
            
            setTimeout(() => {
                // Success feedback
                showFeedback('Success! Your free demo seat is registered. We will contact you shortly.', 'success');
                
                // Optionally open a pre-filled WhatsApp link to complete registration instantly
                const messageText = `Hi, I am ${fullName}. I just registered for a Demo Class of *${courseInterest}* on your website. My Mobile: ${phoneNumber}. Let me know the upcoming slot.`;
                const whatsappUrl = `https://wa.me/919494665208?text=${encodeURIComponent(messageText)}`;
                
                // Clear Form
                contactForm.reset();
                
                // Open WhatsApp link in new tab to prompt instant connection
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 1000);
                
            }, 1200);
        });
        
        function showFeedback(msg, type) {
            formFeedback.textContent = msg;
            formFeedback.className = 'form-feedback'; // reset
            
            if (type === 'success') {
                formFeedback.classList.add('success');
            } else if (type === 'error') {
                formFeedback.classList.add('error');
            } else if (type === 'info') {
                formFeedback.style.color = '#00D4FF';
            }
        }
    }
});
