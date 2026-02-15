import Vapi from '@vapi-ai/web';

// =================================================================================
// IMPORTANT: Paste your Vapi Public Key and Assistant ID here.
// =================================================================================
const VAPI_PUBLIC_KEY = 'dbd5184b-2e2a-417a-b7c6-b6f090ca2706';
const VAPI_ASSISTANT_ID = 'cf4e3f62-dba3-4198-b5f1-d2f5fb349994';
// =================================================================================

const vapi = new Vapi(VAPI_PUBLIC_KEY);

const recordButton = document.getElementById('record-button');
const transcriptionContainer = document.getElementById('transcription-container');
const waveformContainer = document.getElementById('waveform');

let isSessionActive = false;

// Color constants
const COLOR_AI = '#A259FF'; // Purple
const COLOR_USER = '#FF9900'; // Orange
const COLOR_IDLE = '#888888'; // Neutral gray

// Initialize SiriWave
const siriWave = new SiriWave({
    container: waveformContainer,
    width: window.innerWidth,
    height: 80,
    style: 'ios9',
    autostart: false,
    amplitude: 2,
    color: COLOR_IDLE,
});

let targetAmplitude = 1;
let currentAmplitude = 1;
let breathing = true;
let lastVolumeTimestamp = 0;
const AMPLITUDE_MULTIPLIER = 5;
const BREATHING_BASE = 1;
const BREATHING_RANGE = 1.5;
const BREATHING_SPEED = 1.5; // lower is slower

function animateAmplitude() {
    // If no volume event for 300ms, switch to breathing
    if (Date.now() - lastVolumeTimestamp > 300) {
        breathing = true;
    }
    if (breathing) {
        // Breathing effect: oscillate amplitude
        const t = Date.now() / 1000;
        targetAmplitude = BREATHING_BASE + Math.sin(t * BREATHING_SPEED) * BREATHING_RANGE;
    }
    // Smoothly interpolate amplitude
    currentAmplitude += (targetAmplitude - currentAmplitude) * 0.1;
    siriWave.setAmplitude(currentAmplitude);
    requestAnimationFrame(animateAmplitude);
}

animateAmplitude();

const getWaveformCanvas = () => waveformContainer.querySelector('canvas');

const setup = () => {
    transcriptionContainer.textContent = 'Click the orb to start.';
    recordButton.classList.remove('recording');
    siriWave.stop();
    siriWave.setAmplitude(BREATHING_BASE);
    breathing = true;
    const canvas = getWaveformCanvas();
    if (canvas) {
        canvas.style.height = '80px';
        canvas.style.opacity = '0.7';
    }
    siriWave.color = COLOR_IDLE;
};

setup();

const startCall = () => {
    vapi.start(VAPI_ASSISTANT_ID);
};

recordButton.addEventListener('click', () => {
    if (!isSessionActive) {
        startCall();
    } else {
        vapi.stop();
    }
});

vapi.on('call-start', () => {
    isSessionActive = true;
    recordButton.classList.add('recording');
    siriWave.start();
    transcriptionContainer.textContent = 'Listening...';
    breathing = false;
});

vapi.on('call-end', () => {
    isSessionActive = false;
    setup();
});

// Color logic for speaking
vapi.on('speech-start', (e) => {
    if (e.speaker === 'user') {
        siriWave.color = COLOR_USER;
    } else if (e.speaker === 'assistant') {
        siriWave.color = COLOR_AI;
    }
});

vapi.on('speech-end', (e) => {
    // Optionally, revert to idle or keep last color
    siriWave.color = COLOR_IDLE;
});

vapi.on('transcript', (data) => {
    if (data.transcript) {
        transcriptionContainer.textContent = data.transcript;
    }
});

vapi.on('volume-level-change', (volume) => {
    // Pulse amplitude to match volume
    targetAmplitude = Math.max(BREATHING_BASE, volume * AMPLITUDE_MULTIPLIER);
    lastVolumeTimestamp = Date.now();
    breathing = false;
});

vapi.on('error', (err) => {
    isSessionActive = false;
    setup();
    transcriptionContainer.textContent = 'Error: ' + err.message;
});

// Handle window resizing
window.addEventListener('resize', () => {
    siriWave.height = window.innerHeight / 2;
    siriWave.width = window.innerWidth;
}); 