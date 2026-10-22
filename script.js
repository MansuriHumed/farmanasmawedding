/**
 * ==============================================================================
 * FARMAN & ASMA — ROYAL 3D WEDDING SUITE JAVASCRIPT
 * Botanical Sage Green & 24K Gold Interactive Experience
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. DOM SELECTORS
     -------------------------------------------------------------------------- */
  const velvetBox = document.getElementById('velvet-box');
  const boxWrapper = document.getElementById('box-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const silkRibbon = document.getElementById('silk-ribbon');
  const suiteDeck = document.getElementById('suite-deck');
  const parchmentCard = document.getElementById('parchment-card');
  const cardGlare = document.getElementById('card-glare');
  const chaptersTrack = document.getElementById('chapters-track');
  const chapterTabs = document.querySelectorAll('.chapter-tab');
  const chapterPages = document.querySelectorAll('.chapter-page');
  const prevArrow = document.getElementById('deck-prev-arrow');
  const nextArrow = document.getElementById('deck-next-arrow');
  const copyVenueBtn = document.getElementById('copy-venue-btn');
  const copyBtnLabel = document.getElementById('copy-btn-label');
  const blessingShowerBtn = document.getElementById('blessing-shower-btn');
  const tapCounterVal = document.getElementById('tap-counter-val');
  const luxuryToast = document.getElementById('luxury-toast');
  const ambientCanvas = document.getElementById('ambient-canvas');
  const musicDock = document.getElementById('music-dock');
  const dockDisc = document.getElementById('dock-disc');
  const dockPlayBtn = document.getElementById('dock-play-btn');
  const playBtnIcon = document.getElementById('play-btn-icon');
  const weddingSoundtrack = document.getElementById('wedding-soundtrack');

  let currentChapter = 0;
  const totalChapters = chapterPages.length;
  let isBoxOpened = false;
  let isAudioPlaying = false;
  let toastTimer = null;

  /* --------------------------------------------------------------------------
     2. LUXURY TOAST NOTIFIER
     -------------------------------------------------------------------------- */
  function showToast(message, duration = 3000) {
    if (!luxuryToast) return;
    luxuryToast.innerHTML = message;
    luxuryToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      luxuryToast.classList.remove('show');
    }, duration);
  }

  /* --------------------------------------------------------------------------
     3. AMBIENT AUDIO SYSTEM (HTML5 Audio + Web Audio Synth Fallback)
     -------------------------------------------------------------------------- */
  let audioContext = null;
  let synthGain = null;
  let synthOscillators = [];

  function initSynthChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (e) {
      console.warn('AudioContext not allowed yet', e);
    }
  }

  // Play a soft bell/chime on interaction
  function playSacredChime() {
    try {
      if (!audioContext) initSynthChime();
      if (!audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.85);
    } catch (e) {}
  }

  // Start Indian Classical Drone / Ambient Soundtrack
  function playIndianAmbientDrone() {
    try {
      if (!audioContext) initSynthChime();
      if (!audioContext) return;
      if (synthGain) return; // already active

      synthGain = audioContext.createGain();
      synthGain.gain.setValueAtTime(0.001, audioContext.currentTime);
      synthGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 2.0);
      synthGain.connect(audioContext.destination);

      // Tanpura frequencies: C#3 (138.59Hz), G#3 (207.65Hz), C#4 (277.18Hz)
      const freqs = [138.59, 207.65, 277.18];
      synthOscillators = freqs.map((freq, i) => {
        const osc = audioContext.createOscillator();
        osc.type = i === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        osc.connect(synthGain);
        osc.start();
        return osc;
      });
    } catch (e) {}
  }

  function stopIndianAmbientDrone() {
    if (synthGain && audioContext) {
      try {
        synthGain.gain.linearRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
        setTimeout(() => {
          synthOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
          });
          synthOscillators = [];
          synthGain = null;
        }, 550);
      } catch (e) {
        synthGain = null;
      }
    }
  }

  function toggleSoundtrack() {
    initSynthChime();
    if (!isAudioPlaying) {
      if (weddingSoundtrack) {
        weddingSoundtrack.play().then(() => {
          isAudioPlaying = true;
          updateAudioUi(true);
        }).catch(() => {
          // Fallback to Web Audio Ambient Drone
          playIndianAmbientDrone();
          isAudioPlaying = true;
          updateAudioUi(true);
        });
      } else {
        playIndianAmbientDrone();
        isAudioPlaying = true;
        updateAudioUi(true);
      }
    } else {
      if (weddingSoundtrack) weddingSoundtrack.pause();
      stopIndianAmbientDrone();
      isAudioPlaying = false;
      updateAudioUi(false);
    }
  }

  function updateAudioUi(playing) {
    if (dockDisc) {
      if (playing) {
        dockDisc.classList.add('playing');
      } else {
        dockDisc.classList.remove('playing');
      }
    }
    if (playBtnIcon) {
      playBtnIcon.textContent = playing ? '❚❚' : '▶';
    }
  }

  if (dockPlayBtn) {
    dockPlayBtn.addEventListener('click', toggleSoundtrack);
  }
  if (dockDisc) {
    dockDisc.addEventListener('click', toggleSoundtrack);
  }

  /* --------------------------------------------------------------------------
     4. UNTIE SILK RIBBON & UNLOCK 3D FOLIO BOX
     -------------------------------------------------------------------------- */
  function openRoyalFolioBox() {
    if (isBoxOpened) return;
    isBoxOpened = true;

    playSacredChime();

    // Trigger unfolding animation on 3D velvet box
    if (velvetBox) {
      velvetBox.classList.add('unfolding');
    }

    // Attempt auto-starting background music on user gesture
    toggleSoundtrack();

    showToast('✦ Mubarak! Opening Farman & Asma’s Dawat-Nama... ✦', 2500);

    // After gates finish swinging open, transition to unfolded 3D suite deck
    setTimeout(() => {
      if (boxWrapper) {
        boxWrapper.classList.add('opened');
      }
      if (suiteDeck) {
        suiteDeck.classList.remove('hidden');
        suiteDeck.classList.add('unfolded');
      }
      burstPetalsShower(30);
    }, 950);
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', openRoyalFolioBox);
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRoyalFolioBox();
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. 3D GYROSCOPE & MOUSE TILT WITH SPECULAR 24K LIGHT GLARE
     -------------------------------------------------------------------------- */
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  function update3DTilt() {
    currentTiltX += (targetTiltX - currentTiltX) * 0.1;
    currentTiltY += (targetTiltY - currentTiltY) * 0.1;

    if (parchmentCard && isBoxOpened) {
      parchmentCard.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
    }

    // Move specular glare position
    if (cardGlare) {
      const glareX = 50 + currentTiltY * 2.5;
      const glareY = 50 - currentTiltX * 2.5;
      cardGlare.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
      cardGlare.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
    }

    requestAnimationFrame(update3DTilt);
  }
  requestAnimationFrame(update3DTilt);

  // Desktop Mouse Parallax
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    targetTiltY = dx * 8; // -8 to +8 deg
    targetTiltX = -dy * 8;
  });

  // Mobile Device Orientation Gyroscope
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const gamma = Math.max(-25, Math.min(25, e.gamma));
        const beta = Math.max(-25, Math.min(25, e.beta - 45)); // assume holding at 45deg
        targetTiltY = (gamma / 25) * 8;
        targetTiltX = -(beta / 25) * 8;
      }
    }, true);
  }

  /* --------------------------------------------------------------------------
     6. CHAPTER NAVIGATION & SLIDER REEL
     -------------------------------------------------------------------------- */
  function switchChapter(idx) {
    if (idx < 0) idx = 0;
    if (idx >= totalChapters) idx = totalChapters - 1;
    currentChapter = idx;

    // Update track position
    if (chaptersTrack) {
      chaptersTrack.style.transform = `translateX(-${currentChapter * 100}%)`;
    }

    // Update chapter tabs
    chapterTabs.forEach((tab, i) => {
      if (i === currentChapter) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Update pages active class
    chapterPages.forEach((page, i) => {
      if (i === currentChapter) {
        page.classList.add('active');
        // Trigger henna animation if switching to ceremonies
        if (i === 1) {
          const hennaPath = page.querySelector('.henna-path');
          if (hennaPath) {
            hennaPath.style.animation = 'none';
            hennaPath.offsetHeight; // trigger reflow
            hennaPath.style.animation = 'drawHenna 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
          }
        }
      } else {
        page.classList.remove('active');
      }
    });

    // Scroll card to top if inner page was scrolled
    const currentActivePage = chapterPages[currentChapter];
    if (currentActivePage) {
      currentActivePage.scrollTop = 0;
    }

    playSacredChime();
  }

  chapterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetIdx = parseInt(tab.getAttribute('data-chapter'), 10);
      switchChapter(targetIdx);
    });
  });

  // Delegated buttons with data-go
  document.addEventListener('click', (e) => {
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) {
      const targetChapter = parseInt(goBtn.getAttribute('data-go'), 10);
      switchChapter(targetChapter);
    }
  });

  // Desktop Prev / Next Arrows
  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      switchChapter(currentChapter - 1);
    });
  }
  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      switchChapter(currentChapter + 1);
    });
  }

  // Keyboard navigation (Left / Right keys)
  window.addEventListener('keydown', (e) => {
    if (!isBoxOpened) return;
    if (e.key === 'ArrowRight') switchChapter(currentChapter + 1);
    if (e.key === 'ArrowLeft') switchChapter(currentChapter - 1);
  });

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchStartY = 0;
  const chaptersViewport = document.querySelector('.chapters-viewport');

  if (chaptersViewport) {
    chaptersViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    chaptersViewport.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Only horizontal swipe if larger than vertical movement
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
        if (diffX < 0) {
          switchChapter(currentChapter + 1);
        } else {
          switchChapter(currentChapter - 1);
        }
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     7. LIVE COUNTDOWN TIMER TO NIKAH (05 NOV 2026, 09:00 AM IST)
     -------------------------------------------------------------------------- */
  const daysVal = document.getElementById('days-val');
  const hoursVal = document.getElementById('hours-val');
  const minsVal = document.getElementById('mins-val');
  const secsVal = document.getElementById('secs-val');

  // 05 Nov 2026, 09:00 AM Indian Standard Time (UTC+05:30)
  const targetNikahDate = new Date('2026-11-05T09:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetNikahDate - now;

    if (distance <= 0) {
      if (daysVal) daysVal.textContent = '00';
      if (hoursVal) hoursVal.textContent = '00';
      if (minsVal) minsVal.textContent = '00';
      if (secsVal) secsVal.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
    if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
    if (minsVal) minsVal.textContent = String(minutes).padStart(2, '0');
    if (secsVal) secsVal.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* --------------------------------------------------------------------------
     8. 1-CLICK GOOGLE CALENDAR BUTTONS
     -------------------------------------------------------------------------- */
  const calButtons = document.querySelectorAll('.cal-single-btn');
  const venueLocation = 'Prajapati Vas, Tokariya Road, Basu, Ta. Vadgam, Banaskantha, Gujarat — 385520';

  calButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-cal-title') || 'Farman & Asma Wedding Ceremony';
      const start = btn.getAttribute('data-cal-start') || '20261105T033000Z';
      const end = btn.getAttribute('data-cal-end') || '20261105T060000Z';
      const details = 'Heartiest wedding invitation of Farman Sunasara & Asma Ghogha at Basu, Gujarat. We seek your presence and holy blessings.';

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(venueLocation)}`;

      window.open(gcalUrl, '_blank', 'noopener,noreferrer');
      showToast('📅 Opening Google Calendar to save date...', 2500);
    });
  });

  /* --------------------------------------------------------------------------
     9. VENUE ADDRESS COPY TO CLIPBOARD
     -------------------------------------------------------------------------- */
  if (copyVenueBtn) {
    copyVenueBtn.addEventListener('click', async () => {
      const addressText = 'Prajapati Vas, Tokariya Road, Basu, Ta. Vadgam, Banaskantha, Gujarat — 385520';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(addressText);
        } else {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = addressText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        if (copyBtnLabel) {
          const originalText = copyBtnLabel.textContent;
          copyBtnLabel.textContent = 'Copied!';
          setTimeout(() => {
            copyBtnLabel.textContent = originalText;
          }, 2000);
        }

        showToast('✓ Venue address copied to clipboard!', 2500);
      } catch (err) {
        showToast('📍 Address: Prajapati Vas, Tokariya Road, Basu, Gujarat', 3500);
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. INTERACTIVE "SHOWER BLESSINGS" LIVE TAP COUNTER
     -------------------------------------------------------------------------- */
  let blessingsCount = 128;
  const storedCount = localStorage.getItem('farman_asma_blessings');
  if (storedCount) {
    blessingsCount = parseInt(storedCount, 10);
  }
  if (tapCounterVal) {
    tapCounterVal.textContent = `${blessingsCount} Showered`;
  }

  if (blessingShowerBtn) {
    blessingShowerBtn.addEventListener('click', () => {
      blessingsCount += 1;
      localStorage.setItem('farman_asma_blessings', blessingsCount);
      if (tapCounterVal) {
        tapCounterVal.textContent = `${blessingsCount} Showered`;
      }

      // Button bounce effect
      blessingShowerBtn.style.transform = 'scale(0.96)';
      setTimeout(() => {
        blessingShowerBtn.style.transform = '';
      }, 150);

      // Play sacred chime & shower 25 energetic petals
      playSacredChime();
      burstPetalsShower(25);

      showToast('🌸 Duas & blessings received! JazakAllah Khair! 🌸', 2500);
    });
  }

  /* --------------------------------------------------------------------------
     11. REAL-TIME 3D FALLING ROSE & JASMINE PETALS CANVAS
     -------------------------------------------------------------------------- */
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 38;

    class PetalParticle {
      constructor(isBurst = false) {
        this.reset(isBurst);
      }

      reset(isBurst = false) {
        this.type = Math.random() > 0.4 ? 'rose' : (Math.random() > 0.5 ? 'jasmine' : 'gold');
        this.x = isBurst ? width * 0.5 + (Math.random() - 0.5) * 200 : Math.random() * width;
        this.y = isBurst ? height * 0.7 + (Math.random() - 0.5) * 100 : Math.random() * -height;
        this.size = Math.random() * 8 + 8;
        this.speedY = isBurst ? -(Math.random() * 6 + 4) : Math.random() * 1.4 + 0.8;
        this.speedX = (Math.random() - 0.5) * (isBurst ? 6 : 1.2);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.04;
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.oscillationPhase = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.4 + 0.5;
        this.isBurst = isBurst;
      }

      update() {
        this.oscillationPhase += this.oscillationSpeed;
        this.x += this.speedX + Math.sin(this.oscillationPhase) * 0.8;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.isBurst) {
          this.speedY += 0.18; // gravity for burst
          if (this.speedY > 2.0) this.isBurst = false;
        }

        // Wrap around bottom
        if (this.y > height + 20) {
          this.reset(false);
          this.y = -15;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'rose') {
          // Romantic velvet rose petal (Curved organic shape)
          ctx.fillStyle = '#b7415e';
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.6, this.size * 0.8, this.size * 0.6, 0, this.size);
          ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.6, -this.size * 0.8, -this.size * 0.6, 0, -this.size);
          ctx.fill();

          // Soft highlight
          ctx.fillStyle = 'rgba(255, 182, 193, 0.35)';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === 'jasmine') {
          // Sacred White / Ivory Jasmine Bud
          ctx.fillStyle = '#fbf7ee';
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 0.5, this.size * 0.85, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#c5a059';
          ctx.beginPath();
          ctx.arc(0, this.size * 0.7, 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 24K Gold Stardust Shimmer Flake
          ctx.fillStyle = '#d4af37';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Populate initial ambient particles
    for (let i = 0; i < maxParticles; i++) {
      const p = new PetalParticle();
      p.y = Math.random() * height; // spread across screen
      particles.push(p);
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animatePetals);
    }
    animatePetals();

    // Burst of petals function
    window.burstPetalsShower = function(count = 20) {
      for (let i = 0; i < count; i++) {
        particles.push(new PetalParticle(true));
      }
      // Trim if too many
      if (particles.length > 90) {
        particles.splice(0, particles.length - 90);
      }
    };
  } else {
    window.burstPetalsShower = function() {};
  }

});
