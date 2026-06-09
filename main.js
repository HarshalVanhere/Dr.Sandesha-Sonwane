/* ==========================================================================
   INITIALIZE ICONS & CORE SETUP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. STICKY HEADER, SCROLL PROGRESS & ACTIVE HIGHLIGHT
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgress = document.getElementById('scroll-progress');
  const whatsappFab = document.getElementById('whatsapp-fab');

  function handleScroll() {
    // Scroll progress bar
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';
    }

    // WhatsApp FAB visibility toggle
    if (whatsappFab) {
      if (window.scrollY > 400) {
        whatsappFab.classList.add('show');
      } else {
        whatsappFab.classList.remove('show');
      }
    }

    // Toggle header scrolled class
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Link Highlight
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial scroll check

  // 2. MOBILE NAVIGATION DRAWER
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      
      // Update icon using lucide
      if (isOpen) {
        menuIcon.setAttribute('data-lucide', 'x');
      } else {
        menuIcon.setAttribute('data-lucide', 'menu');
      }
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuIcon.setAttribute('data-lucide', 'menu');
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuIcon.setAttribute('data-lucide', 'menu');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      }
    });
  }

  // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 4. TESTIMONIAL SLIDER CAROUSEL
  const slider = document.getElementById('testimonial-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-review');
  const nextBtn = document.getElementById('next-review');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlide = 0;
  let autoplayInterval;

  function updateSlider() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active');
      if (index === currentSlide) {
        slide.classList.add('active');
      }
    });

    // Update dots
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (index === currentSlide) {
        dot.classList.add('active');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
  }

  if (slider && slides.length > 0) {
    // Next/Prev Buttons
    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Dots Click Interaction
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          currentSlide = parseInt(e.target.getAttribute('data-slide'));
          updateSlider();
          resetAutoplay();
        });
      });
    }

    // Autoplay function
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 7000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    startAutoplay();
  }

  // 5. FAQ ACCORDION WITH HEIGHT TRANSITION
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-answer');
      const isActive = faqItem.classList.contains('active');

      // Close all open FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Toggle current FAQ
      if (!isActive) {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      }
    });
  });

  // 6. BOOKING FORM & WHATSAPP INTEGRATION
  const bookingForm = document.getElementById('booking-form');
  const confirmButton = document.getElementById('submit-form');
  const whatsappButton = document.getElementById('whatsapp-form');

  const doctorWhatsAppNumber = '917218759043'; // Doctor's WhatsApp number with country code (+91)

  function buildWhatsAppMessage(formData) {
    const date = document.getElementById('visit-date').value || 'Not Specified';
    const details = document.getElementById('patient-details').value.trim() || 'None';

    return `Hello Dr. Sandesha Sonawane,\n\nI would like to book a home physiotherapy visit.\n\n*Patient Details:*\n- *Name:* ${formData.name}\n- *Phone:* ${formData.phone}\n- *Condition:* ${formData.condition}\n- *Locality:* ${formData.locality}\n- *Preferred Date:* ${date}\n- *Details:* ${details}\n\nPlease confirm availability. Thanks!`;
  }

  function openWhatsAppForBooking(formData) {
    const messageText = buildWhatsAppMessage(formData);
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${doctorWhatsAppNumber}?text=${encodedText}`;

    showToast('Redirecting...', 'Opening WhatsApp so you can send the booking details.', 'success');

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 800);
  }

  // Validation function
  function validateForm() {
    const name = document.getElementById('patient-name').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    const condition = document.getElementById('condition-select').value;
    const locality = document.getElementById('locality-select').value;

    if (!name) {
      showToast('Validation Error', 'Please enter the patient name.', 'error');
      document.getElementById('patient-name').focus();
      return false;
    }

    // Basic 10-digit Indian phone validation
    const phoneRegex = /^[6789]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Validation Error', 'Please enter a valid 10-digit mobile number.', 'error');
      document.getElementById('patient-phone').focus();
      return false;
    }

    if (!condition) {
      showToast('Validation Error', 'Please select a health condition.', 'error');
      document.getElementById('condition-select').focus();
      return false;
    }

    if (!locality) {
      showToast('Validation Error', 'Please select your locality in Nashik.', 'error');
      document.getElementById('locality-select').focus();
      return false;
    }

    return { name, phone, condition, locality };
  }

  // Handle standard form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = validateForm();
      if (!formData) return;

      confirmButton.disabled = true;
      confirmButton.innerHTML = '<span>Opening WhatsApp...</span>';

      openWhatsAppForBooking(formData);

      setTimeout(() => {
        confirmButton.disabled = false;
        confirmButton.innerHTML = '<i data-lucide="check-circle"></i><span>Confirm Booking</span>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 900);
    });

    // Handle WhatsApp Submission button
    if (whatsappButton) {
      whatsappButton.addEventListener('click', () => {
        const formData = validateForm();
        if (!formData) return;
        openWhatsAppForBooking(formData);
      });
    }
  }

  // 7. TOAST NOTIFICATION SYSTEM
  const toastContainer = document.getElementById('toast-container');

  function showToast(title, message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass`;
    
    // Choose icon based on type
    let iconName = 'check-circle';
    let iconClass = 'text-emerald';
    if (type === 'error') {
      iconName = 'alert-triangle';
      iconClass = 'text-red';
    } else if (type === 'info') {
      iconName = 'info';
      iconClass = 'text-blue';
    }

    toast.innerHTML = `
      <div class="toast-icon flex-center">
        <i data-lucide="${iconName}" class="${iconClass}"></i>
      </div>
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Auto remove after 4.5 seconds
    setTimeout(() => {
      toast.style.animation = 'toast-out 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 4500);
  }

  // Add toast out animation keyframes dynamically if not present
  if (!document.getElementById('toast-keyframes')) {
    const style = document.createElement('style');
    style.id = 'toast-keyframes';
    style.innerHTML = `
      @keyframes toast-out {
        to {
          transform: translateY(-20px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================================================
  // STATS COUNTER ANIMATION
  // ==========================================================================
  const statsSection = document.querySelector('.about-stats');
  const statsElements = document.querySelectorAll('.stat-num');
  let animatedStats = false;

  function animateStats() {
    statsElements.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const format = stat.getAttribute('data-format');
      let count = 0;
      const duration = 1500; // 1.5 seconds
      const stepTime = Math.max(Math.floor(duration / (target > 100 ? 50 : target)), 15);
      const increment = Math.ceil(target / (duration / stepTime));
      
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        
        if (format === 'k') {
          stat.textContent = (count / 1000).toFixed(0) + 'k';
        } else {
          stat.textContent = count;
        }
      }, stepTime);
    });
  }

  if (statsSection && statsElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // CONDITIONS CATEGORY FILTERING
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const conditionCards = document.querySelectorAll('.condition-card');

  if (filterBtns.length > 0 && conditionCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        conditionCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hide');
            // Re-trigger visual entry reveals
            setTimeout(() => {
              card.classList.add('active');
            }, 50);
          } else {
            card.classList.add('hide');
          }
        });
      });
    });
  }

  // ==========================================================================
  // STETHOSCOPE & MEDICAL BACKGROUND PARTICLES EFFECT
  // ==========================================================================
  const canvas = document.getElementById('particles-canvas');
  const heroSection = document.getElementById('hero');

  if (canvas && heroSection) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let width = (canvas.width = heroSection.offsetWidth);
    let height = (canvas.height = heroSection.offsetHeight);

    const mouse = {
      x: null,
      y: null,
      radius: 120, // Distance within which particles react to cursor
    };

    // Tracks cursor inside Hero
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Handle screen resize
    window.addEventListener('resize', () => {
      width = canvas.width = heroSection.offsetWidth;
      height = canvas.height = heroSection.offsetHeight;
      initParticles();
    });

    // Particle construction class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 8 + 6; // Scale of elements
        this.speedX = Math.random() * 0.4 - 0.2; // drift speed
        this.speedY = Math.random() * -0.5 - 0.1; // rise speed
        this.density = Math.random() * 10 + 5; // reaction physics weight
        
        // Choose shape type
        const shapes = ['dot', 'plus', 'heartbeat', 'sparkle', 'stethoscope'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Color variance: soft teals, light blues, white
        const colors = [
          'rgba(13, 148, 136, 0.15)', // light teal alpha
          'rgba(2, 132, 199, 0.12)',  // light blue alpha
          'rgba(16, 185, 129, 0.15)', // light green alpha
          'rgba(255, 255, 255, 0.25)', // soft white alpha
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        ctx.save();
        
        // Custom draw shapes
        if (this.shape === 'dot') {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } 
        else if (this.shape === 'plus') {
          ctx.beginPath();
          ctx.moveTo(this.x - this.size * 0.6, this.y);
          ctx.lineTo(this.x + this.size * 0.6, this.y);
          ctx.moveTo(this.x, this.y - this.size * 0.6);
          ctx.lineTo(this.x, this.y + this.size * 0.6);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        } 
        else if (this.shape === 'heartbeat') {
          ctx.beginPath();
          ctx.moveTo(this.x - this.size * 1.2, this.y);
          ctx.lineTo(this.x - this.size * 0.6, this.y);
          ctx.lineTo(this.x - this.size * 0.3, this.y - this.size * 0.8);
          ctx.lineTo(this.x, this.y + this.size * 1.0);
          ctx.lineTo(this.x + this.size * 0.3, this.y - this.size * 0.5);
          ctx.lineTo(this.x + this.size * 0.6, this.y);
          ctx.lineTo(this.x + this.size * 1.2, this.y);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } 
        else if (this.shape === 'sparkle') {
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(this.x + Math.cos(i * Math.PI / 2) * this.size, this.y + Math.sin(i * Math.PI / 2) * this.size);
            ctx.lineTo(this.x + Math.cos(i * Math.PI / 2 + Math.PI / 4) * this.size * 0.3, this.y + Math.sin(i * Math.PI / 2 + Math.PI / 4) * this.size * 0.3);
          }
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        } 
        else if (this.shape === 'stethoscope') {
          // Stethoscope Bell
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          
          // Tube Loop
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.bezierCurveTo(this.x - this.size * 0.8, this.y + this.size * 1.5, this.x + this.size * 0.8, this.y + this.size * 2.0, this.x, this.y + this.size * 2.8);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          
          // Ear arches
          ctx.beginPath();
          ctx.arc(this.x, this.y + this.size * 2.8, this.size * 0.6, -Math.PI * 0.75, -Math.PI * 0.25);
          ctx.stroke();
        }
        
        ctx.restore();
      }

      update() {
        // Drift upwards and slightly horizontally
        this.y += this.speedY;
        this.x += this.speedX;

        // Reset if floating out of bounds (top/left/right)
        if (this.y < -15) {
          this.y = height + 15;
          this.x = Math.random() * width;
        }
        if (this.x < -15 || this.x > width + 15) {
          this.x = Math.random() * width;
        }

        // Mouse collision/reaction mechanics
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.hypot(dx, dy);
          
          if (distance < mouse.radius) {
            // Push away
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    function initParticles() {
      particlesArray = [];
      // Quantify particle density based on screen dimensions
      const numberOfParticles = Math.min(Math.floor((width * height) / 18000), 55);
      
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        particlesArray.push(new Particle(x, y));
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animateParticles);
    }

    // Trigger initial generation
    initParticles();
    animateParticles();
  }
});
