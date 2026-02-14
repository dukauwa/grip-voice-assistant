/**
 * State Management Module
 * 
 * Centralized state management for the voice assistant application.
 */

class StateManager {
  constructor() {
    this.state = {
      isActive: false,
      isSpeaking: false,
      isListening: false,
      currentTranscript: '',
      currentSpeaker: null, // 'user' or 'assistant'
      theme: this.getInitialTheme(),
      volume: 0,
      error: null
    };

    this.listeners = new Map();
    this.history = [];
  }

  // ==================== STATE GETTERS ====================
  
  getState() {
    return { ...this.state };
  }

  get(key) {
    return this.state[key];
  }

  // ==================== STATE SETTERS ====================
  
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Add to history
    this.history.push({
      timestamp: Date.now(),
      prevState,
      newState: { ...this.state }
    });

    // Notify listeners
    this.notifyListeners(updates, prevState);
  }

  set(key, value) {
    this.setState({ [key]: value });
  }

  // ==================== SPECIFIC STATE UPDATES ====================
  
  setActive(isActive) {
    this.setState({ isActive });
  }

  setSpeaking(isSpeaking, speaker = null) {
    this.setState({ 
      isSpeaking,
      currentSpeaker: isSpeaking ? speaker : null
    });
  }

  setListening(isListening) {
    this.setState({ isListening });
  }

  setTranscript(transcript, speaker = null) {
    this.setState({ 
      currentTranscript: transcript,
      currentSpeaker: speaker
    });
  }

  setTheme(theme) {
    this.setState({ theme });
    this.persistTheme(theme);
    this.applyTheme(theme);
  }

  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setVolume(volume) {
    this.setState({ volume });
  }

  setError(error) {
    this.setState({ error });
  }

  clearError() {
    this.setState({ error: null });
  }

  // ==================== RESET METHODS ====================
  
  reset() {
    this.setState({
      isActive: false,
      isSpeaking: false,
      isListening: false,
      currentTranscript: '',
      currentSpeaker: null,
      volume: 0,
      error: null
    });
  }

  // ==================== LISTENER MANAGEMENT ====================
  
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  subscribeAll(callback) {
    return this.subscribe('*', callback);
  }

  notifyListeners(updates, prevState) {
    // Notify specific key listeners
    Object.keys(updates).forEach(key => {
      const callbacks = this.listeners.get(key) || [];
      callbacks.forEach(callback => {
        callback(updates[key], prevState[key]);
      });
    });

    // Notify global listeners
    const globalCallbacks = this.listeners.get('*') || [];
    globalCallbacks.forEach(callback => {
      callback(this.state, prevState);
    });
  }

  // ==================== THEME MANAGEMENT ====================
  
  getInitialTheme() {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  persistTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ==================== HISTORY MANAGEMENT ====================
  
  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }

  // ==================== UTILITY METHODS ====================
  
  getStatusText() {
    if (!this.state.isActive) return 'Ready';
    if (this.state.isSpeaking) {
      return this.state.currentSpeaker === 'user' ? 'You are speaking' : 'Assistant is speaking';
    }
    if (this.state.isListening) return 'Listening';
    return 'Active';
  }

  getStatusClass() {
    if (!this.state.isActive) return '';
    if (this.state.isSpeaking) return this.state.currentSpeaker === 'user' ? 'user' : 'assistant';
    if (this.state.isListening) return 'listening';
    return 'active';
  }

  // ==================== DEBUG ====================
  
  debug() {
    console.log('Current State:', this.state);
    console.log('Listeners:', this.listeners);
    console.log('History:', this.history);
  }
}

// Export singleton instance
export const state = new StateManager();
export default state;