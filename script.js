/**
 * FARMAN & ASMA — 3D ROYAL WEDDING EXPERIENCE (LOGIC & 3D PARALLAX ENGINE)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const gateAssembly = document.getElementById('gate-assembly');
  const unlockSeal = document.getElementById('unlock-seal');
  const bookContainer = document.getElementById('book-container');
  const cardMesh = document.getElementById('card-mesh');
  const deckReel = document.getElementById('deck-reel');
  const deckPages = document.querySelectorAll('.deck-page');
  const bookTabs = document.querySelectorAll('.book-tab');
  const prevArrow = document.getElementById('prev-arrow');
  const nextArrow = document.getElementById('next-arrow');
  const musicPill = document.getElementById('music-pill');
  const musicLabel = document.getElementById('music-pill-label');
  const weddingAudio = document.getElementById('wedding-audio');
  const copyAddressBtn = document.getElementById('copy-address-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const addCalendarAction = document.getElementById('add-calendar-action');
  const showerPetalsBtn = document.getElementById('shower-petals-btn');
  const hudToast = document.getElementById('hud-toast');

  let currentPage = 0;
  const totalPages = deckPages.length;
  let isGatesOpened = false;
  let isPlayingAudio = false;

  // Web Audio Synthesizer Fallback
  let audioCtx = null;
  let synthGain = null;
  let synthTones = [];

  /* ==========================================================================
     1. 3D CELESTIAL STARDUST CANVAS WITH PARALLAX DEPTH
     ========================================================================== */
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const starCount = 65;
  let mouseParallaxX = 0;
  let mouseParallaxY = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class StardustParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = (Math.random() - 0.5) * canvas.width * 1.5;
      this.y = (Math.random() - 0.5) * canvas.height * 1.5;
      this.z = Math.random() * 800 + 100;
      this.size = Math.random() * 2 + 0.8;
      this.speed = Math.random() * 0.4 + 0.15;
      this.alpha = Math.random() * 0.7 + 0.2;
    }
    update() {
      this.z -= this.speed;
      if (this.z <= 10) {
        this.reset();
        this.z = 800;
      }
    }
    draw() {
      const fov = 400;
      const scale = fov / (fov + this.z);
      const px = (this.x + mouseParallaxX * 40) * scale + canvas.width / 2;
      const py = (this.y + mouseParallaxY * 40) * scale + canvas.height / 2;

      if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) return;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, this.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 230, 138, ${this.alpha * scale})`;
      ctx.shadowBlur = 8 * scale;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < starCount; i++) {
    stars.push(new StardustParticle());
  }

  function renderStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(renderStars);
  }
  renderStars();

  /* ==========================================================================
     2. REAL-TIME 3D PARALLAX & DYNAMIC SPECULAR GLARE
     ========================================================================== */
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  function update3DTilt(e) {
    if (!isGatesOpened || !cardMesh) return;
    const rect = cardMesh.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    targetRotY = normX * 12; // rotate around Y (left/right)
    targetRotX = -normY * 10; // rotate around X (up/down)

    mouseParallaxX = normX;
    mouseParallaxY = normY;

    // Calculate light glare position
    const glareX = ((normX + 1) / 2) * 100;
    const glareY = ((normY + 1) / 2) * 100;
    cardMesh.style.setProperty('--glare-x', `${glareX}%`);
    cardMesh.style.setProperty('--glare-y', `${glareY}%`);
  }

  window.addEventListener('mousemove', update3DTilt);

  // Device orientation support for mobile devices
  window.addEventListener('deviceorientation', (e) => {
    if (!isGatesOpened || !cardMesh) return;
    if (e.gamma !== null && e.beta !== null) {
      targetRotY = Math.max(-14, Math.min(14, e.gamma * 0.45));
      targetRotX = Math.max(-12, Math.min(12, (e.beta - 45) * 0.4));
      mouseParallaxX = targetRotY / 14;
      mouseParallaxY = targetRotX / 12;
    }
  });

  // Smooth Interpolation Loop
  function animateMesh3D() {
    if (isGatesOpened && cardMesh) {
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;
      cardMesh.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
    }
    requestAnimationFrame(animateMesh3D);
  }
  animateMesh3D();

  /* ==========================================================================
     3. 3D PALACE GATES UNLOCK SEQUENCE
     ========================================================================== */
  function unlockPalaceGates() {
    if (isGatesOpened) return;
    isGatesOpened = true;

    // Haptic buzz if supported
    if (navigator.vibrate) {
      navigator.vibrate([40, 80, 40]);
    }

    // 3D Door swing open
    gateAssembly.classList.add('doors-opened');

    // Shower celebratory golden sparks
    showerPetals(18);

    // Play wedding music
    playWeddingSound();

    // Transition into 3D Floating Book
    setTimeout(() => {
      gateAssembly.classList.add('unlocked');
      bookContainer.classList.remove('hidden');
      goToPage(0);
      showToast('Welcome to the 3D Wedding Experience of Farman & Asma');
    }, 1250);
  }

  unlockSeal.addEventListener('click', unlockPalaceGates);

  /* ==========================================================================
     4. WEDDING AUDIO ENGINE (Rich Audio Element + Harmonious Tanpura Synthesizer)
     ========================================================================== */
  function startWebAudioTanpura() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      if (synthTones.length > 0) return;

      synthGain = audioCtx.createGain();
      synthGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      synthGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);
      synthGain.connect(audioCtx.destination);

      // Acoustic Tanpura & Sitar chord tones (Sa-Pa drone in C# / D)
      const freqs = [138.59, 207.65, 277.18, 415.30];
      freqs.forEach(freq => {
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const vibrato = audioCtx.createOscillator();
        const vibratoGain = audioCtx.createGain();
        vibrato.frequency.value = 0.25;
        vibratoGain.gain.value = 1.2;
        vibrato.connect(osc.frequency);
        vibrato.start();

        osc.connect(synthGain);
        osc.start();
        synthTones.push(osc);
      });
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  function stopWebAudioTanpura() {
    if (synthGain && audioCtx) {
      synthGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      setTimeout(() => {
        synthTones.forEach(o => o.stop());
        synthTones = [];
      }, 1000);
    }
  }

  function playWeddingSound() {
    weddingAudio.play().then(() => {
      isPlayingAudio = true;
      musicPill.classList.add('playing');
      musicLabel.textContent = 'Music On';
    }).catch(() => {
      startWebAudioTanpura();
      isPlayingAudio = true;
      musicPill.classList.add('playing');
      musicLabel.textContent = 'Music On';
    });
  }

  function pauseWeddingSound() {
    weddingAudio.pause();
    stopWebAudioTanpura();
    isPlayingAudio = false;
    musicPill.classList.remove('playing');
    musicLabel.textContent = 'Music Off';
  }

  musicPill.addEventListener('click', () => {
    if (isPlayingAudio) {
      pauseWeddingSound();
    } else {
      playWeddingSound();
    }
  });

  /* ==========================================================================
     5. 3D DECK REEL PAGE NAVIGATION
     ========================================================================== */
  function goToPage(index) {
    if (index < 0 || index >= totalPages) return;
    currentPage = index;

    // Slide track in 3D
    deckReel.style.transform = `translateX(-${index * 100}%)`;

    // Active page state
    deckPages.forEach((pg, i) => {
      if (i === index) {
        pg.classList.add('active');
      } else {
        pg.classList.remove('active');
      }
    });

    // Update Tabs
    bookTabs.forEach(tb => {
      const pNum = parseInt(tb.getAttribute('data-page'), 10);
      if (pNum === index) {
        tb.classList.add('active');
      } else {
        tb.classList.remove('active');
      }
    });

    // Arrow states
    if (prevArrow && nextArrow) {
      prevArrow.style.opacity = index === 0 ? '0.3' : '1';
      prevArrow.style.pointerEvents = index === 0 ? 'none' : 'auto';
      nextArrow.style.opacity = index === totalPages - 1 ? '0.3' : '1';
      nextArrow.style.pointerEvents = index === totalPages - 1 ? 'none' : 'auto';
    }

    // Reset 3D tilt momentum to center gently
    targetRotX = 0;
    targetRotY = 0;
  }

  bookTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = parseInt(tab.getAttribute('data-page'), 10);
      goToPage(target);
    });
  });

  // Action Buttons
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-nav'), 10);
      goToPage(target);
    });
  });

  if (prevArrow) prevArrow.addEventListener('click', () => goToPage(currentPage - 1));
  if (nextArrow) nextArrow.addEventListener('click', () => goToPage(currentPage + 1));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!isGatesOpened) return;
    if (e.key === 'ArrowRight') goToPage(currentPage + 1);
    if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
  });

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchEndX = 0;
  const viewport = document.querySelector('.deck-viewport');

  if (viewport) {
    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) goToPage(currentPage + 1);
      if (touchEndX > touchStartX + 50) goToPage(currentPage - 1);
    }, { passive: true });
  }

  /* ==========================================================================
     6. REAL-TIME COUNTDOWN (Saturday, 21 Nov 2026, 10:30 AM IST)
     ========================================================================== */
  const nikahDate = new Date('2026-11-21T10:30:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = nikahDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').innerText = '00';
      document.getElementById('cd-hours').innerText = '00';
      document.getElementById('cd-minutes').innerText = '00';
      document.getElementById('cd-seconds').innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     7. VENUE ADDRESS COPY & TOAST
     ========================================================================== */
  function showToast(message) {
    if (!hudToast) return;
    hudToast.textContent = message;
    hudToast.classList.add('active');
    setTimeout(() => {
      hudToast.classList.remove('active');
    }, 3200);
  }

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "The Grand Imperial Palace & Gardens, Royal Heritage Enclave, Palace Road, Ahmedabad, Gujarat — 380001";
      navigator.clipboard.writeText(address).then(() => {
        copyBtnText.textContent = "Copied!";
        showToast("✓ Palace address copied to clipboard!");
        setTimeout(() => {
          copyBtnText.textContent = "Copy Address";
        }, 2500);
      }).catch(() => {
        showToast("Address: Ahmedabad, Gujarat — 380001");
      });
    });
  }

  /* ==========================================================================
     8. 3D ROSE PETAL CANNON SHOWER
     ========================================================================== */
  function showerPetals(count = 35) {
    const petals = ['🌸', '🌺', '🌹', '✨', '🤍', '🍃'];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.classList.add('speck-petal');
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = `${Math.random() * 95}%`;
      petal.style.animationDuration = `${Math.random() * 2.2 + 2.8}s`;
      petal.style.animationDelay = `${Math.random() * 1.4}s`;
      petal.style.fontSize = `${Math.random() * 14 + 18}px`;
      document.body.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, 5500);
    }
  }

  if (showerPetalsBtn) {
    showerPetalsBtn.addEventListener('click', () => {
      showerPetals(45);
      showToast("✨ May Allah shower eternal blessings upon Farman & Asma!");
    });
  }

  /* ==========================================================================
     9. ADD TO GOOGLE CALENDAR
     ========================================================================== */
  if (addCalendarAction) {
    addCalendarAction.addEventListener('click', () => {
      const title = encodeURIComponent("Farman & Asma's Royal Wedding Celebrations");
      const details = encodeURIComponent("Join us in celebrating the holy Nikah and wedding ceremonies of Farman & Asma. Venue: The Grand Imperial Palace, Ahmedabad.");
      const location = encodeURIComponent("The Grand Imperial Palace & Gardens, Ahmedabad, Gujarat");
      const dates = "20261121T050000Z/20261122T140000Z";
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
      showToast("Opening Google Calendar...");
    });
  }
});
