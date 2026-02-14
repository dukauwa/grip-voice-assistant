/**
 * UI Module
 * 
 * Handles all DOM manipulations and UI updates.
 */

import { animator } from './animations.js';
import { state } from './state.js';

class UIController {
  constructor() {
    this.elements = {};
    this.initialized = false;
  }

  // ==================== INITIALIZATION ====================
  
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.setupStateSubscriptions();
    this.applyInitialTheme();
    this.initialized = true;
  }

  cacheElements() {
    this.elements = {
      voiceButton: document.querySelector('.voice-button'),
      buttonIcon: document.querySelector('.button-icon'),
      transcriptionText: document.querySelector('.transcription-text'),
      transcriptionCard: document.querySelector('.transcription-card'),
      speakerLabel: document.querySelector('.speaker-label'),
      statusBadge: document.querySelector('.status-badge'),
      statusText: document.querySelector('.status-text'),
      statusIndicator: document.querySelector('.status-indicator'),
      waveformContainer: document.querySelector('.waveform-container'),
      themeToggle: document.querySelector('.theme-toggle'),
      themeToggleThumb: document.querySelector('.theme-toggle-thumb')
    };
  }

  setupEventListeners() {
    // Theme toggle
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener('click', () => {
        state.toggleTheme();
        if (this.elements.themeToggleThumb) {
          animator.animateThemeToggle(this.elements.themeToggleThumb);
        }
      });
    }
  }

  setupStateSubscriptions() {
    // Subscribe to state changes
    state.subscribe('isActive', (isActive) => {
      this.updateActiveState(isActive);
    });

    state.subscribe('isSpeaking', (isSpeaking) => {
      this.updateSpeakingState(isSpeaking);
    });

    state.subscribe('isListening', (isListening) => {
      this.updateListeningState(isListening);
    });

    state.subscribe('currentTranscript', (transcript) => {
      this.updateTranscript(transcript);
    });

    state.subscribe('error', (error) => {
      if (error) this.showError(error);
    });

    // Subscribe to all state changes for status badge
    state.subscribeAll(() => {
      this.updateStatusBadge();
    });
  }

  applyInitialTheme() {
    const theme = state.get('theme');
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ==================== UI UPDATE METHODS ====================
  
  updateActiveState(isActive) {
    const { voiceButton, waveformContainer } = this.elements;

    if (isActive) {
      voiceButton?.classList.add('recording');
      waveformContainer?.classList.add('active');
      this.updateButtonIcon('stop');
      if (waveformContainer) {
        animator.animateWaveformActivate(waveformContainer);
      }
    } else {
      voiceButton?.classList.remove('recording');
      waveformContainer?.classList.remove('active');
      this.updateButtonIcon('mic');
      if (voiceButton) {
        animator.animateButtonDeactivate(voiceButton);
      }
      if (waveformContainer) {
        animator.animateWaveformDeactivate(waveformContainer);
      }
    }
  }

  updateSpeakingState(isSpeaking) {
    const { transcriptionCard } = this.elements;
    
    if (isSpeaking && transcriptionCard) {
      animator.animateTranscriptionGlow(transcriptionCard);
    } else if (transcriptionCard) {
      animator.removeTranscriptionGlow(transcriptionCard);
    }
  }

  updateListeningState(isListening) {
    // Visual feedback for listening state
    // This could trigger additional animations if needed
  }

  updateTranscript(transcript) {
    const { transcriptionText } = this.elements;
    if (!transcriptionText) return;

    if (!transcript) {
      transcriptionText.textContent = 'Click the button to start';
      transcriptionText.classList.add('placeholder');
    } else {
      animator.animateTranscriptionUpdate(transcriptionText, transcript);
      transcriptionText.classList.remove('placeholder');
    }
  }

  updateStatusBadge() {
    const { statusText, statusBadge, statusIndicator } = this.elements;
    if (!statusText || !statusBadge) return;

    const text = state.getStatusText();
    const statusClass = state.getStatusClass();

    // Update text
    if (statusText.textContent !== text) {
      statusText.textContent = text;
    }

    // Update classes
    statusBadge.className = `status-badge ${statusClass}`;

    // Animate status change
    animator.animateStatusChange(statusBadge, statusClass);
  }

  updateSpeakerLabel(speaker) {
    const { speakerLabel } = this.elements;
    if (!speakerLabel) return;

    if (speaker) {
      speakerLabel.textContent = speaker === 'user' ? 'You' : 'Assistant';
      speakerLabel.className = `speaker-label ${speaker}`;
      speakerLabel.style.display = 'block';
    } else {
      speakerLabel.style.display = 'none';
    }
  }

  updateButtonIcon(type) {
    const { buttonIcon } = this.elements;
    if (!buttonIcon) return;

    if (type === 'mic') {
      buttonIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      `;
    } else if (type === 'stop') {
      buttonIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2"></rect>
        </svg>
      `;
    }
  }

  // ==================== ERROR HANDLING ====================
  
  showError(error) {
    const { transcriptionText } = this.elements;
    if (!transcriptionText) return;

    const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';
    
    transcriptionText.textContent = `Error: ${errorMessage}`;
    transcriptionText.style.color = 'var(--color-error)';

    // Reset after 5 seconds
    setTimeout(() => {
      transcriptionText.style.color = '';
      state.clearError();
      this.updateTranscript('');
    }, 5000);
  }

  // ==================== VISUAL EFFECTS ====================
  
  triggerRippleEffect(event) {
    const { voiceButton } = this.elements;
    if (!voiceButton) return;

    const rect = voiceButton.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    animator.animateRipple(voiceButton, x, y);
  }

  triggerParticleEffect() {
    const { voiceButton } = this.elements;
    if (!voiceButton) return;

    animator.animateParticles(voiceButton.parentElement, 8);
  }

  // ==================== UTILITY METHODS ====================
  
  showLoading() {
    const { transcriptionText } = this.elements;
    if (!transcriptionText) return;

    transcriptionText.textContent = 'Loading...';
    transcriptionText.classList.add('placeholder');
  }

  hideLoading() {
    const { transcriptionText } = this.elements;
    if (!transcriptionText) return;

    transcriptionText.classList.remove('placeholder');
  }

  // ==================== PUBLIC API ====================
  
  getElement(key) {
    return this.elements[key];
  }

  isInitialized() {
    return this.initialized;
  }
}

// Export singleton instance
export const ui = new UIController();
export default ui;