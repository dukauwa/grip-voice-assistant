/**
 * GSAP Animations Module
 * 
 * Handles all GSAP-powered animations and micro-interactions.
 */

import { gsap } from 'gsap';

class AnimationController {
  constructor() {
    this.timeline = null;
    this.setupDefaults();
  }

  setupDefaults() {
    // Set GSAP defaults
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.6
    });
  }

  // ==================== PAGE LOAD ANIMATIONS ====================
  
  animatePageLoad() {
    const tl = gsap.timeline({ delay: 0.2 });

    // Fade in background gradient orbs
    tl.from('.gradient-orb', {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'elastic.out(1, 0.5)'
    }, 0)

    // Slide in header
    .from('.app-header', {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.3)

    // Fade in transcription card
    .from('.transcription-card', {
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'back.out(1.4)'
    }, 0.5)

    // Scale in voice button
    .from('.voice-button', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    }, 0.7)

    // Fade in waveform
    .from('.waveform-container', {
      opacity: 0,
      y: 30,
      duration: 0.6
    }, 0.9);

    return tl;
  }

  // ==================== BUTTON ANIMATIONS ====================
  
  animateButtonClick(button) {
    const tl = gsap.timeline();

    tl.to(button, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.in'
    })
    .to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: 'elastic.out(1, 0.3)'
    })
    .to(button, {
      scale: 1,
      duration: 0.2
    });

    return tl;
  }

  animateButtonActivate(button) {
    // Pulsating animation when recording
    gsap.to(button, {
      scale: 1.1,
      duration: 0.6,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  animateButtonDeactivate(button) {
    // Kill all animations and reset
    gsap.killTweensOf(button);
    gsap.to(button, {
      scale: 1,
      duration: 0.3,
      ease: 'back.out(1.4)'
    });
  }

  // ==================== TRANSCRIPTION ANIMATIONS ====================
  
  animateTranscriptionUpdate(element, newText) {
    const tl = gsap.timeline();

    tl.to(element, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        element.textContent = newText;
      }
    })
    .to(element, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    });

    return tl;
  }

  animateTranscriptionGlow(card) {
    gsap.to(card, {
      boxShadow: '0 8px 32px rgba(90, 79, 234, 0.3), 0 0 30px rgba(90, 79, 234, 0.2)',
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  removeTranscriptionGlow(card) {
    gsap.to(card, {
      boxShadow: 'var(--shadow-lg)',
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  // ==================== WAVEFORM ANIMATIONS ====================
  
  animateWaveformActivate(container) {
    const tl = gsap.timeline();

    tl.to(container, {
      scale: 1.05,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
    .to(container, {
      scale: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)'
    });

    return tl;
  }

  animateWaveformDeactivate(container) {
    gsap.to(container, {
      scale: 0.95,
      opacity: 0.8,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  // ==================== STATUS BADGE ANIMATIONS ====================
  
  animateStatusChange(badge, state) {
    const tl = gsap.timeline();

    // Pulse effect
    tl.to(badge, {
      scale: 1.1,
      duration: 0.2,
      ease: 'power2.out'
    })
    .to(badge, {
      scale: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)'
    });

    // Color transition is handled by CSS
    return tl;
  }

  // ==================== THEME TOGGLE ANIMATIONS ====================
  
  animateThemeToggle(thumb) {
    gsap.to(thumb, {
      scale: 1.2,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  }

  // ==================== HOVER ANIMATIONS ====================
  
  setupHoverAnimations() {
    // Voice button hover
    const voiceButton = document.querySelector('.voice-button');
    if (voiceButton) {
      voiceButton.addEventListener('mouseenter', () => {
        gsap.to(voiceButton, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      voiceButton.addEventListener('mouseleave', () => {
        gsap.to(voiceButton, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }

    // Transcription card hover
    const transcriptionCard = document.querySelector('.transcription-card');
    if (transcriptionCard) {
      transcriptionCard.addEventListener('mouseenter', () => {
        gsap.to(transcriptionCard, {
          y: -4,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      transcriptionCard.addEventListener('mouseleave', () => {
        gsap.to(transcriptionCard, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  }

  // ==================== MICRO-INTERACTIONS ====================
  
  animateRipple(button, x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      pointer-events: none;
    `;
    button.appendChild(ripple);

    gsap.to(ripple, {
      width: 200,
      height: 200,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
  }

  animateParticles(container, count = 5) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--color-primary);
        left: 50%;
        top: 50%;
        pointer-events: none;
      `;
      container.appendChild(particle);

      const angle = (360 / count) * i;
      const distance = 100;
      const x = Math.cos(angle * Math.PI / 180) * distance;
      const y = Math.sin(angle * Math.PI / 180) * distance;

      gsap.to(particle, {
        x,
        y,
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }

  // ==================== UTILITY METHODS ====================
  
  killAll() {
    gsap.killTweensOf('*');
  }

  pause() {
    gsap.globalTimeline.pause();
  }

  resume() {
    gsap.globalTimeline.resume();
  }
}

// Export singleton instance
export const animator = new AnimationController();
export default animator;