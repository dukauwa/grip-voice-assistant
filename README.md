# 🎤 Grip Voice Assistant

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

A **premium, modern voice assistant interface** powered by Vapi AI with stunning GSAP animations and a world-class design system.

[Demo](#) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎨 Design & UI
- **Modern, Minimal Aesthetic** - Clean, professional interface with premium feel
- **Dark Mode Support** - Seamless theme switching with smooth transitions
- **Responsive Design** - Mobile-first approach, works on all devices
- **Glassmorphism Effects** - Beautiful backdrop blur and gradient overlays
- **Animated Background** - Floating gradient orbs for visual depth

### 🚀 Animations (GSAP)
- **Page Load Animations** - Elegant entrance animations
- **Micro-interactions** - Button clicks, hover effects, ripples
- **Smooth Transitions** - All state changes are animated
- **Waveform Visualization** - Real-time audio wave visualization
- **Particle Effects** - Celebratory particle bursts

### 🏛️ Architecture
- **Modular Design** - Separated concerns (UI, State, Animations)
- **State Management** - Centralized state with pub/sub pattern
- **Design Tokens** - CSS variables for consistent theming
- **Component-Based CSS** - Reusable, maintainable styles
- **Accessibility First** - ARIA labels, keyboard navigation, screen reader support

### 🧠 Voice Features
- **Vapi AI Integration** - Powered by advanced voice AI
- **Real-time Transcription** - Live speech-to-text display
- **Speaker Recognition** - Distinguishes user vs assistant speech
- **Volume Visualization** - Dynamic waveform responds to audio levels
- **Status Indicators** - Clear visual feedback for all states

---

## 📸 Screenshots

### Light Mode
```
[☀️ Clean, minimal interface with subtle gradients]
```

### Dark Mode
```
[🌙 Elegant dark theme with enhanced glows]
```

### Active State
```
[🎙️ Beautiful waveform visualization during conversation]
```

---

## 🛠️ Installation

### Prerequisites
- Node.js >= 18.0.0
- npm, yarn, or pnpm
- Vapi AI account ([Get started](https://vapi.ai))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/dukauwa/grip-voice-assistant.git
cd grip-voice-assistant

# Install dependencies
npm install

# Configure your Vapi credentials
cp .env.example .env
# Edit .env and add your VAPI_PUBLIC_KEY and VAPI_ASSISTANT_ID

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## ⚙️ Configuration

### Vapi Setup

1. Create an account at [vapi.ai](https://vapi.ai)
2. Create a new assistant or use an existing one
3. Get your Public Key and Assistant ID
4. Update the configuration in `src/script.js`:

```javascript
const CONFIG = {
  VAPI_PUBLIC_KEY: 'your_public_key_here',
  VAPI_ASSISTANT_ID: 'your_assistant_id_here',
  // ...
};
```

### Customization

#### Design Tokens
Edit `src/styles/tokens.css` to customize:
- Colors
- Spacing
- Typography
- Shadows
- Animations

#### Waveform Appearance
Modify waveform settings in `src/script.js`:

```javascript
WAVEFORM: {
  style: 'ios9', // or 'ios'
  height: 120,
  amplitude: 2,
  speed: 0.15,
  color: {
    idle: '#888888',
    user: '#FF9900',
    assistant: '#A259FF'
  }
}
```

#### Animation Speed
Adjust animation timings in `src/styles/tokens.css`:

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 📚 Documentation

### Project Structure

```
grip-voice-assistant/
├── src/
│   ├── index.html          # Main HTML file
│   ├── script.js           # Main application logic
│   ├── js/
│   │   ├── animations.js   # GSAP animation controller
│   │   ├── state.js        # State management
│   │   └── ui.js           # UI controller
│   └── styles/
│       ├── tokens.css      # Design system tokens
│       ├── base.css        # Base styles & reset
│       └── components.css  # Component styles
├── public/             # Static assets
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

### Key Modules

#### State Management (`state.js`)
Centralized state management with pub/sub pattern:
```javascript
import { state } from './js/state.js';

// Get state
const isActive = state.get('isActive');

// Set state
state.setActive(true);

// Subscribe to changes
state.subscribe('isActive', (isActive) => {
  console.log('Active state changed:', isActive);
});
```

#### Animation Controller (`animations.js`)
GSAP-powered animations:
```javascript
import { animator } from './js/animations.js';

// Trigger animations
animator.animateButtonClick(button);
animator.animateTranscriptionUpdate(element, 'New text');
```

#### UI Controller (`ui.js`)
DOM manipulation and UI updates:
```javascript
import { ui } from './js/ui.js';

// Initialize UI
ui.init();

// Update UI
ui.updateTranscript('Hello world');
ui.showError('Something went wrong');
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Development Tips

1. **Hot Module Replacement** - Changes are reflected instantly
2. **Debug Mode** - Access `window.__app`, `window.__state`, `window.__ui` in console
3. **State History** - Call `state.debug()` to see state changes
4. **Animation Testing** - Use `animator.killAll()` to stop all animations

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

### Environment Variables

For production, set these environment variables:
- `VAPI_PUBLIC_KEY`
- `VAPI_ASSISTANT_ID`
- `NODE_ENV=production`

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Vapi connection fails**
```
Solution: Check your API keys and ensure they're correct.
Verify your assistant is active in the Vapi dashboard.
```

**Issue: Animations not working**
```
Solution: Ensure GSAP is installed: npm install gsap
Check browser console for errors.
```

**Issue: Microphone not working**
```
Solution: Grant microphone permissions in your browser.
Ensure you're using HTTPS (required for microphone access).
```

**Issue: Waveform not displaying**
```
Solution: Check if SiriWave script is loaded.
Verify the waveform container exists in the DOM.
```

### Debug Mode

Enable debug mode in development:
```javascript
// In browser console
window.__state.debug();
window.__app;
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- [Vapi AI](https://vapi.ai) - Voice AI platform
- [GSAP](https://greensock.com/gsap/) - Animation library
- [SiriWave](https://github.com/kopiro/siriwave) - Waveform visualization
- [Vite](https://vitejs.dev) - Build tool

---

## 📞 Support

For support, email dukauwa.du@gmail.com or open an issue on GitHub.

---

<div align="center">

**Made with ❤️ by [Ukauwa David](https://commissioner.design)**

[Website](https://commissioner.design) • [Twitter](https://twitter.com/ukauwa_david) • [GitHub](https://github.com/dukauwa)

</div>