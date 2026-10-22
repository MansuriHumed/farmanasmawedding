/**
 * FARMAN & ASMA — ROYAL SHAHI FARMAN (HAUTE COUTURE SUITE)
 * Interactions, 3D Wax Seal Opening, ScrollSpy, Audio Engine, Petals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stageGate = document.getElementById('stage-gate');
  const envelopePod = document.getElementById('envelope-pod');
  const waxSeal = document.getElementById('wax-seal');
  const royalSuite = document.getElementById('royal-suite');
  const audioDock = document.getElementById('audio-dock');
  const audioDiscBtn = document.getElementById('audio-disc-btn');
  const discVinyl = document.getElementById('disc-vinyl');
  const audioStateTag = document.getElementById('audio-state-tag');
  const weddingAudio = document.getElementById('wedding-instrumental');
  const copyAddressAction = document.getElementById('copy-address-action');
  const copyStatusText = document.getElementById('copy-status-text');
  const addCalendarBtn = document.getElementById('add-calendar-btn');
  const showerPetalsAction = document.getElementById('shower-petals-action');
  const royalToast = document.getElementById('royal-toast');
  const navChips = document.querySelectorAll('.nav-chip');

  let isEnvelopeOpened = false;
  let isPlayingMusic = false;
  let audioContext = null;
  let synthGainNode = null;
  let synthOscs = [];

  /* ==========================================================================
     1. AMBIENT GOLD DUST CANVAS PARTICLES
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 40;

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
      this.speedY = -(Math.random() * 0.35 + 0.12);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.6 + 0.15;
      this.sway = Math.random() * Math.PI * 2;
    }
    update() {
      this.y += this.speedY;
      this.sway += 0.015;
      this.x += Math.sin(this.sway) * 0.3 + this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 230, 138, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldParticle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(renderParticles);
  }
  renderParticles();

  /* ==========================================================================
     2. TRADITIONAL WEDDING MUSIC & WEB AUDIO HARMONY ENGINE
     ========================================================================== */
  function startWebAudioDrone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      if (synthOscs.length > 0) return;

      synthGainNode = audioContext.createGain();
      synthGainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
      synthGainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 3);
      synthGainNode.connect(audioContext.destination);

      // Acoustic Tanpura & Sitar chord tones (Sa-Pa drone in C# / D)
      const droneNotes = [138.59, 207.65, 277.18, 415.30];
      droneNotes.forEach(freq => {
        const osc = audioContext.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);

        const vibrato = audioContext.createOscillator();
        const vibratoGain = audioContext.createGain();
        vibrato.frequency.value = 0.25;
        vibratoGain.gain.value = 1.2;
        vibrato.connect(osc.frequency);
        vibrato.start();

        osc.connect(synthGainNode);
        osc.start();
        synthOscs.push(osc);
      });
    } catch (e) {
      console.warn('Audio synthesis fallback notice:', e);
    }
  }

  function stopWebAudioDrone() {
    if (synthGainNode && audioContext) {
      synthGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      setTimeout(() => {
        synthOscs.forEach(o => o.stop());
        synthOscs = [];
      }, 1000);
    }
  }

  function playMusic() {
    weddingAudio.play().then(() => {
      isPlayingMusic = true;
      discVinyl.classList.add('spinning');
      audioStateTag.textContent = 'Playing';
    }).catch(() => {
      // If external mp3 is blocked, use Web Audio Drone
      startWebAudioDrone();
      isPlayingMusic = true;
      discVinyl.classList.add('spinning');
      audioStateTag.textContent = 'Playing';
    });
  }

  function pauseMusic() {
    weddingAudio.pause();
    stopWebAudioDrone();
    isPlayingMusic = false;
    discVinyl.classList.remove('spinning');
    audioStateTag.textContent = 'Paused';
  }

  audioDiscBtn.addEventListener('click', () => {
    if (isPlayingMusic) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  /* ==========================================================================
     3. TACTILE WAX SEAL BREAK & ENVELOPE OPENING
     ========================================================================== */
  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Haptic feedback if supported on mobile
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }

    // Trigger physical wax crack animation
    waxSeal.style.transform = 'translate(-50%, -50%) scale(1.3) rotate(8deg)';
    envelopePod.classList.add('unfolded');

    // Shower initial celebratory gold sparks
    showerPetals(16);

    // Start background wedding instrumental
    playMusic();

    // Smooth transition to the royal folio suite
    setTimeout(() => {
      stageGate.classList.add('dismissed');
      royalSuite.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Welcome to the wedding invitation of Farman & Asma');
    }, 1150);
  }

  waxSeal.addEventListener('click', openEnvelope);
  envelopePod.addEventListener('click', openEnvelope);

  /* ==========================================================================
     4. SCROLLSPY NAVIGATION CHIPS
     ========================================================================== */
  const sections = document.querySelectorAll('.folio-section');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navChips.forEach(chip => {
          if (chip.getAttribute('href') === `#${id}`) {
            chip.classList.add('active');
          } else {
            chip.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  /* ==========================================================================
     5. LIVE COUNTDOWN CLOCKS (Saturday, 21 Nov 2026, 10:30 AM IST)
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
     6. COPY VENUE ADDRESS & TOAST POPUP
     ========================================================================== */
  function showToast(message) {
    if (!royalToast) return;
    royalToast.textContent = message;
    royalToast.classList.add('active');
    setTimeout(() => {
      royalToast.classList.remove('active');
    }, 3200);
  }

  if (copyAddressAction) {
    copyAddressAction.addEventListener('click', () => {
      const address = "The Grand Imperial Palace & Heritage Lawns, Royal Heritage Enclave, Palace Road, Ahmedabad, Gujarat — 380001";
      navigator.clipboard.writeText(address).then(() => {
        copyStatusText.textContent = "Copied!";
        showToast("✓ Palace address copied to clipboard!");
        setTimeout(() => {
          copyStatusText.textContent = "Copy Address";
        }, 2500);
      }).catch(() => {
        showToast("Address: Ahmedabad, Gujarat — 380001");
      });
    });
  }

  /* ==========================================================================
     7. REALISTIC ROSE PETAL SHOWER EFFECT
     ========================================================================== */
  function showerPetals(count = 35) {
    const petals = ['🌸', '🌺', '🌹', '✨', '🤍', '🍃'];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.classList.add('rose-petal-speck');
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

  if (showerPetalsAction) {
    showerPetalsAction.addEventListener('click', () => {
      showerPetals(45);
      showToast("✨ May Allah shower His blessings upon Farman & Asma!");
    });
  }

  /* ==========================================================================
     8. ADD TO GOOGLE CALENDAR
     ========================================================================== */
  if (addCalendarBtn) {
    addCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent("Farman & Asma's Royal Wedding Celebrations");
      const details = encodeURIComponent("Join us in celebrating the holy Nikah and wedding ceremonies of Farman & Asma. Venue: The Grand Imperial Palace, Ahmedabad.");
      const location = encodeURIComponent("The Grand Imperial Palace & Heritage Lawns, Ahmedabad, Gujarat");
      const dates = "20261121T050000Z/20261122T140000Z";
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
      showToast("Opening Google Calendar...");
    });
  }
});
