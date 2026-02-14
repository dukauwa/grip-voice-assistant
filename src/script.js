/**
 * Grip Voice Assistant - Main Application
 * 
 * A premium, modern voice assistant interface powered by Vapi AI,
 * with GSAP animations and comprehensive state management.
 */

import Vapi from '@vapi-ai/web';
import { gsap } from 'gsap';
import { animator } from './js/animations.js';
import { state } from './js/state.js';
import { ui } from './js/ui.js';

// =================================================================================
// CONFIGURATION
// =================================================================================
const CONFIG = {
  VAPI_PUBLIC_KEY: 'dbd5184b-2e2a-417a-b7c6-b6f090ca2706',
  VAPI_ASSISTANT_ID: 'cf4e3f62-dba3-4198-b5f1-d2f5fb349994',
  
  // Waveform Configuration
  WAVEFORM: {
    style: 'ios9',
    height: 120,
    amplitude: 2,
    speed: 0.15,
    color: {
      idle: '#888888',
      user: '#FF9900',
      assistant: '#A259FF'
    }
  },
  
  // Animation Configuration
  ANIMATION: {
    amplitudeMultiplier: 5,
    breathingBase: 1,
    breathingRange: 1.5,
    breathingSpeed: 1.5,
    volumeTimeout: 300
  }
};

// =================================================================================
// APPLICATION CLASS
// =================================================================================
class VoiceAssistantApp {
  constructor() {
    this.vapi = null;
    this.siriWave = null;
    this.animationFrame = null;
    this.targetAmplitude = 1;
    this.currentAmplitude = 1;
    this.isBreathing = true;
    this.lastVolumeTimestamp = 0;
  }

  // ==================== INITIALIZATION ====================
  
  async init() {
    try {
      console.log('🚀 Initializing Grip Voice Assistant...');
      
      // Initialize modules
      this.initializeVapi();
      this.initializeUI();
      this.initializeWaveform();
      this.setupEventListeners();
      
      // Start animations
      this.startAmplitudeAnimation();
      animator.setupHoverAnimations();
      
      // Animate page load
      await animator.animatePageLoad();
      
      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Initialization error:', error);
      state.setError(error);
    }
  }

  initializeVapi() {
    this.vapi = new Vapi(CONFIG.VAPI_PUBLIC_KEY);
    this.setupVapiEventHandlers();
    console.log('✓ Vapi initialized');
  }

  initializeUI() {
    ui.init();
    console.log('✓ UI initialized');
  }

  initializeWaveform() {
    const waveformElement = document.getElementById('waveform');
    if (!waveformElement) {
      console.warn('Waveform container not found');
      return;
    }

    this.siriWave = new SiriWave({
      container: waveformElement,
      width: window.innerWidth,
      height: CONFIG.WAVEFORM.height,
      style: CONFIG.WAVEFORM.style,
      autostart: false,
      amplitude: CONFIG.WAVEFORM.amplitude,
      speed: CONFIG.WAVEFORM.speed,
      color: CONFIG.WAVEFORM.color.idle
    });

    console.log('✓ Waveform initialized');
  }

  // ==================== EVENT LISTENERS ====================
  
  setupEventListeners() {
    const voiceButton = ui.getElement('voiceButton');
    if (!voiceButton) return;

    // Voice button click
    voiceButton.addEventListener('click', (e) => this.handleVoiceButtonClick(e));

    // Window resize
    window.addEventListener('resize', () => this.handleResize());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    console.log('✓ Event listeners attached');
  }

  handleVoiceButtonClick(event) {
    const voiceButton = ui.getElement('voiceButton');
    
    // Trigger ripple effect
    ui.triggerRippleEffect(event);
    
    // Animate button click
    animator.animateButtonClick(voiceButton);

    // Toggle voice assistant
    if (!state.get('isActive')) {
      this.startCall();
    } else {
      this.stopCall();
    }
  }

  handleResize() {
    if (this.siriWave) {
      this.siriWave.width = window.innerWidth;
      this.siriWave.height = window.innerHeight < 600 ? 80 : CONFIG.WAVEFORM.height;
    }
  }

  handleKeydown(event) {
    // Space bar to toggle voice assistant
    if (event.code === 'Space' && event.target === document.body) {
      event.preventDefault();
      ui.getElement('voiceButton')?.click();
    }
    
    // Escape to stop
    if (event.code === 'Escape' && state.get('isActive')) {
      this.stopCall();
    }
  }

  // ==================== VAPI EVENT HANDLERS ====================
  
  setupVapiEventHandlers() {
    // Call start
    this.vapi.on('call-start', () => {
      console.log('📞 Call started');
      state.setActive(true);
      state.setTranscript('Listening...', null);
      
      this.siriWave?.start();
      this.isBreathing = false;
      
      const voiceButton = ui.getElement('voiceButton');
      if (voiceButton) {
        voiceButton.setAttribute('aria-pressed', 'true');
        voiceButton.setAttribute('aria-label', 'Stop voice assistant');
      }
    });

    // Call end
    this.vapi.on('call-end', () => {
      console.log('📞 Call ended');
      this.resetToIdle();
    });

    // Speech start
    this.vapi.on('speech-start', (event) => {
      console.log('🗣️ Speech started:', event.speaker);
      const speaker = event.speaker;
      
      state.setSpeaking(true, speaker);
      ui.updateSpeakerLabel(speaker);
      
      // Update waveform color
      if (this.siriWave) {
        this.siriWave.color = speaker === 'user' 
          ? CONFIG.WAVEFORM.color.user 
          : CONFIG.WAVEFORM.color.assistant;
      }
    });

    // Speech end
    this.vapi.on('speech-end', (event) => {
      console.log('🗣️ Speech ended:', event.speaker);
      state.setSpeaking(false);
      
      // Revert waveform color
      if (this.siriWave) {
        this.siriWave.color = CONFIG.WAVEFORM.color.idle;
      }
    });

    // Transcript updates
    this.vapi.on('transcript', (data) => {
      if (data.transcript) {
        console.log('📝 Transcript:', data.transcript);
        state.setTranscript(data.transcript, data.speaker || null);
      }
    });

    // Volume level changes
    this.vapi.on('volume-level-change', (volume) => {
      state.setVolume(volume);
      
      // Update amplitude based on volume
      this.targetAmplitude = Math.max(
        CONFIG.ANIMATION.breathingBase,
        volume * CONFIG.ANIMATION.amplitudeMultiplier
      );
      this.lastVolumeTimestamp = Date.now();
      this.isBreathing = false;
    });

    // Message events
    this.vapi.on('message', (message) => {
      console.log('💬 Message:', message);
    });

    // Error handling
    this.vapi.on('error', (error) => {
      console.error('❌ Vapi error:', error);
      state.setError(error);
      this.resetToIdle();
    });
  }

  // ==================== CALL MANAGEMENT ====================
  
  async startCall() {
    try {
      console.log('▶️ Starting call...');
      ui.showLoading();
      
      await this.vapi.start(CONFIG.VAPI_ASSISTANT_ID);
      
      // Trigger particle effect
      ui.triggerParticleEffect();
      
    } catch (error) {
      console.error('❌ Failed to start call:', error);
      state.setError(error);
      ui.hideLoading();
    }
  }

  stopCall() {
    try {
      console.log('⏹️ Stopping call...');
      this.vapi.stop();
    } catch (error) {
      console.error('❌ Failed to stop call:', error);
      state.setError(error);
    }
  }

  // ==================== WAVEFORM ANIMATION ====================
  
  startAmplitudeAnimation() {
    const animate = () => {
      // Switch to breathing if no volume for threshold time
      if (Date.now() - this.lastVolumeTimestamp > CONFIG.ANIMATION.volumeTimeout) {
        this.isBreathing = true;
      }

      // Calculate target amplitude
      if (this.isBreathing) {
        const t = Date.now() / 1000;
        this.targetAmplitude = CONFIG.ANIMATION.breathingBase + 
          Math.sin(t * CONFIG.ANIMATION.breathingSpeed) * CONFIG.ANIMATION.breathingRange;
      }

      // Smoothly interpolate amplitude
      this.currentAmplitude += (this.targetAmplitude - this.currentAmplitude) * 0.1;
      
      if (this.siriWave) {
        this.siriWave.setAmplitude(this.currentAmplitude);
      }

      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  // ==================== RESET ====================
  
  resetToIdle() {
    state.reset();
    state.setTranscript('', null);
    
    this.siriWave?.stop();
    this.siriWave.setAmplitude(CONFIG.ANIMATION.breathingBase);
    this.siriWave.color = CONFIG.WAVEFORM.color.idle;
    
    this.isBreathing = true;
    
    const voiceButton = ui.getElement('voiceButton');
    if (voiceButton) {
      voiceButton.setAttribute('aria-pressed', 'false');
      voiceButton.setAttribute('aria-label', 'Start voice assistant');
    }
    
    ui.updateSpeakerLabel(null);
  }

  // ==================== CLEANUP ====================
  
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    if (this.vapi) {
      this.vapi.stop();
    }
    
    animator.killAll();
    
    console.log('🧹 Application cleaned up');
  }
}

// =================================================================================
// APPLICATION BOOTSTRAP
// =================================================================================

let app;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  app = new VoiceAssistantApp();
  app.init();
  
  // Expose to window for debugging
  if (process.env.NODE_ENV === 'development') {
    window.__app = app;
    window.__state = state;
    window.__ui = ui;
    window.__animator = animator;
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  app?.destroy();
});

// Handle visibility change (pause/resume animations)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    animator.pause();
  } else {
    animator.resume();
  }
});

// Export for potential external use
export { app, state, ui, animator };