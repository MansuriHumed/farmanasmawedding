/**
 * FARMAN & ASMA ROYAL WEDDING INVITATION — LOGIC & INTERACTIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope3D = document.getElementById('envelope-3d');
  const waxSeal = document.getElementById('wax-seal');
  const cardSuite = document.getElementById('card-suite');
  const pagesTrack = document.getElementById('pages-track');
  const pages = document.querySelectorAll('.invitation-page');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const navPrevBtn = document.getElementById('nav-prev-btn');
  const navNextBtn = document.getElementById('nav-next-btn');
  const musicToggle = document.getElementById('music-toggle');
  const musicStatusText = document.getElementById('music-status-text');
  const weddingAudio = document.getElementById('wedding-audio');
  const copyAddressBtn = document.getElementById('copy-address-btn');
  const copyText = document.getElementById('copy-text');
  const shareBtn = document.getElementById('share-btn');
  const calendarBtn = document.getElementById('calendar-btn');
  const blessingShowerBtn = document.getElementById('blessing-shower-btn');
  const restartTourBtn = document.getElementById('restart-tour-btn');
  const toastPopup = document.getElementById('toast-popup');

  let currentPageIndex = 0;
  const totalPages = pages.length;
  let isEnvelopeOpened = false;
  let isMusicPlaying = false;
  let audioContext = null;
  let synthGainNode = null;
  let synthOscillators = [];

  /* ==========================================================================
     1. AMBIENT GOLD DUST CANVAS PARTICLES
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class GoldParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = -(Math.random() * 0.45 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.fadeSpeed = Math.random() * 0.008 + 0.003;
      this.sway = Math.random() * Math.PI * 2;
    }
    update() {
      this.y += this.speedY;
      this.sway += 0.02;
      this.x += Math.sin(this.sway) * 0.3 + this.speedX;
      this.opacity += Math.sin(this.sway * 2) * 0.005;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 229, 171, ${Math.max(0.1, Math.min(1, this.opacity))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ==========================================================================
     2. AUDIO SYSTEM (Rich Audio Element + Harmonious Ambient Synthesizer Fallback)
     ========================================================================== */
  function startSynthesizerDrone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (synthOscillators.length > 0) return; // Already running

      synthGainNode = audioContext.createGain();
      synthGainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
      synthGainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 3);
      synthGainNode.connect(audioContext.destination);

      // Traditional Indian Wedding Harmony Frequencies (Tanpura D# / Sa-Pa drone)
      const freqs = [155.56, 233.08, 311.13, 466.16];
      freqs.forEach(freq => {
        const osc = audioContext.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        // Gentle vibrato
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 1.2;
        lfo.connect(osc.frequency);
        lfo.start();

        osc.connect(synthGainNode);
        osc.start();
        synthOscillators.push(osc);
      });
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  function stopSynthesizerDrone() {
    if (synthGainNode && audioContext) {
      synthGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      setTimeout(() => {
        synthOscillators.forEach(osc => osc.stop());
        synthOscillators = [];
      }, 1000);
    }
  }

  function playWeddingMusic() {
    weddingAudio.play().then(() => {
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
      musicStatusText.textContent = 'Music On';
    }).catch(() => {
      // If external mp3 cannot load or is blocked, use Web Audio Drone
      startSynthesizerDrone();
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
      musicStatusText.textContent = 'Music On';
    });
  }

  function pauseWeddingMusic() {
    weddingAudio.pause();
    stopSynthesizerDrone();
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
    musicStatusText.textContent = 'Music Off';
  }

  musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
      pauseWeddingMusic();
    } else {
      playWeddingMusic();
    }
  });

  /* ==========================================================================
     3. 3D ENVELOPE OPENING & WAX SEAL CRACKLE
     ========================================================================== */
  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Trigger seal crack effect
    waxSeal.style.transform = 'translate(-50%, -50%) scale(1.25) rotate(10deg)';
    envelope3D.classList.add('opened');

    // Shower initial subtle gold sparks
    showerPetalsAndGems(15);

    // Start background music
    playWeddingMusic();

    // After flap lifts & card peaks, switch to full card suite
    setTimeout(() => {
      envelopeWrapper.classList.add('hidden');
      cardSuite.classList.add('visible');
      cardSuite.setAttribute('aria-hidden', 'false');
      goToPage(0);
      showToast('Welcome to the wedding invitation of Farman & Asma');
    }, 1200);
  }

  waxSeal.addEventListener('click', openEnvelope);
  envelope3D.addEventListener('click', openEnvelope);

  /* ==========================================================================
     4. PAGE NAVIGATION & TABS SLIDER
     ========================================================================== */
  function goToPage(index) {
    if (index < 0 || index >= totalPages) return;
    currentPageIndex = index;

    // Slide track
    pagesTrack.style.transform = `translateX(-${index * 100}%)`;

    // Update active page
    pages.forEach((page, i) => {
      if (i === index) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Update Tab state
    tabBtns.forEach(btn => {
      const pageNum = parseInt(btn.getAttribute('data-page'), 10);
      if (pageNum === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Arrow controls visibility
    if (navPrevBtn && navNextBtn) {
      navPrevBtn.style.opacity = index === 0 ? '0.3' : '1';
      navPrevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
      navNextBtn.style.opacity = index === totalPages - 1 ? '0.3' : '1';
      navNextBtn.style.pointerEvents = index === totalPages - 1 ? 'none' : 'auto';
    }

    // Scroll smoothly to top of arch frame
    cardSuite.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = parseInt(btn.getAttribute('data-page'), 10);
      goToPage(targetPage);
    });
  });

  // Next / Prev button triggers inside pages
  document.querySelectorAll('.next-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target'), 10);
      goToPage(target);
    });
  });

  document.querySelectorAll('.prev-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target'), 10);
      goToPage(target);
    });
  });

  if (restartTourBtn) {
    restartTourBtn.addEventListener('click', () => {
      goToPage(0);
    });
  }

  if (navPrevBtn) navPrevBtn.addEventListener('click', () => goToPage(currentPageIndex - 1));
  if (navNextBtn) navNextBtn.addEventListener('click', () => goToPage(currentPageIndex + 1));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!isEnvelopeOpened) return;
    if (e.key === 'ArrowRight') goToPage(currentPageIndex + 1);
    if (e.key === 'ArrowLeft') goToPage(currentPageIndex - 1);
  });

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchEndX = 0;
  const viewport = document.querySelector('.pages-viewport');

  if (viewport) {
    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      goToPage(currentPageIndex + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      goToPage(currentPageIndex - 1);
    }
  }

  /* ==========================================================================
     5. LIVE COUNTDOWN TIMER
     ========================================================================== */
  // Target: Saturday, 21 November 2026, 10:30 AM IST
  const targetWeddingDate = new Date('2026-11-21T10:30:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;

    if (distance < 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     6. COPY VENUE ADDRESS & TOAST POPUP
     ========================================================================== */
  function showToast(message) {
    if (!toastPopup) return;
    toastPopup.textContent = message;
    toastPopup.classList.add('show');
    setTimeout(() => {
      toastPopup.classList.remove('show');
    }, 3200);
  }

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = "The Grand Imperial Palace & Gardens, Royal Heritage Enclave, Palace Road, Ahmedabad, Gujarat - 380001";
      navigator.clipboard.writeText(addressText).then(() => {
        copyText.textContent = "Copied!";
        showToast("✓ Venue address copied to clipboard!");
        setTimeout(() => {
          copyText.textContent = "Copy Address";
        }, 2500);
      }).catch(() => {
        showToast("Address: Ahmedabad, Gujarat - 380001");
      });
    });
  }

  /* ==========================================================================
     7. SHOWER ROSE PETALS & DUAS EFFECT
     ========================================================================== */
  function showerPetalsAndGems(count = 35) {
    const petals = ['🌸', '🌺', '🌹', '✨', '🤍', '🍃'];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.classList.add('falling-petal');
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = `${Math.random() * 96}%`;
      petal.style.animationDuration = `${Math.random() * 2.5 + 2.5}s`;
      petal.style.animationDelay = `${Math.random() * 1.5}s`;
      petal.style.fontSize = `${Math.random() * 14 + 18}px`;
      document.body.appendChild(petal);

      // Clean up after animation
      setTimeout(() => {
        petal.remove();
      }, 5000);
    }
  }

  if (blessingShowerBtn) {
    blessingShowerBtn.addEventListener('click', () => {
      showerPetalsAndGems(45);
      showToast("✨ May Allah shower His bountiful blessings upon Farman & Asma!");
    });
  }

  /* ==========================================================================
     8. ADD TO GOOGLE CALENDAR
     ========================================================================== */
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent("Farman & Asma's Royal Wedding Celebrations");
      const details = encodeURIComponent("Join us in celebrating the auspicious wedding ceremonies (Mehndi, Nikah & Walima) of Farman & Asma. Venue: The Grand Imperial Palace, Ahmedabad.");
      const location = encodeURIComponent("The Grand Imperial Palace & Gardens, Ahmedabad, Gujarat");
      // 21 Nov 2026 to 22 Nov 2026 UTC format
      const dates = "20261121T050000Z/20261122T140000Z";
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
      showToast("Opening Google Calendar...");
    });
  }

  /* ==========================================================================
     9. SHARE INVITATION
     ========================================================================== */
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareData = {
        title: "Farman & Asma Wedding Invitation",
        text: "You are warmly invited to the wedding celebrations of Farman & Asma. Tap to open the royal invitation card!",
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("✓ Invitation link copied to clipboard!");
        });
      }
    });
  }
});
