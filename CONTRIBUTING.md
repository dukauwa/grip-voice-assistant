# Contributing to Grip Voice Assistant

First off, thank you for considering contributing to Grip Voice Assistant! 🎉

It's people like you that make this project such a great tool.

## 👋 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🐛 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots and animated GIFs if possible**
- **Include browser and OS details**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected**
- **Explain why this enhancement would be useful**

### Pull Requests

The process described here has several goals:

- Maintain code quality
- Fix problems that are important to users
- Engage the community in working toward the best possible version
- Enable a sustainable system for maintainers to review contributions

Please follow these steps to have your contribution considered:

1. **Fork the repo and create your branch from `main`**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clear, commented code
   - Follow the existing code style
   - Add tests if applicable

3. **Test your changes**
   ```bash
   npm run dev
   npm run lint
   npm run format
   ```

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` A new feature
   - `fix:` A bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `perf:` Performance improvements
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Use a clear and descriptive title
   - Describe what changes you've made
   - Reference any related issues
   - Include screenshots if applicable

## 📝 Coding Guidelines

### JavaScript Style Guide

- Use ES6+ features
- Use `const` for variables that won't be reassigned, `let` otherwise
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring when appropriate
- Add comments for complex logic

**Example:**
```javascript
// Good
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Bad
var greet = function(name) {
  return 'Hello, ' + name + '!';
}
```

### CSS Style Guide

- Use CSS custom properties for theming
- Follow BEM naming convention for components
- Use meaningful class names
- Group related properties
- Use shorthand properties when possible
- Add comments for complex styles

**Example:**
```css
/* Good */
.voice-button {
  /* Layout */
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Size */
  width: var(--size-button-xl);
  height: var(--size-button-xl);
  
  /* Appearance */
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  
  /* Effects */
  transition: all var(--transition-base);
}
```

### File Organization

- Keep files focused and single-purpose
- Group related functionality
- Use clear, descriptive file names
- Maintain consistent directory structure

### Commits

- Write clear commit messages
- Use conventional commit format
- Keep commits atomic and focused
- Reference issues in commit messages

### Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Update CHANGELOG.md
- Include inline comments for complex logic

**Example:**
```javascript
/**
 * Animates the button click with elastic easing
 * @param {HTMLElement} button - The button element to animate
 * @returns {gsap.core.Timeline} GSAP timeline instance
 */
animateButtonClick(button) {
  // Implementation
}
```

## 🛠️ Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/grip-voice-assistant.git
   cd grip-voice-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Vapi credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Make your changes and test**

## 🧪 Testing

Before submitting a pull request:

- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test in both light and dark modes
- [ ] Test with keyboard navigation
- [ ] Test with screen readers if possible
- [ ] Run linter: `npm run lint`
- [ ] Format code: `npm run format`

## 💬 Questions?

Feel free to:
- Open an issue with the `question` label
- Reach out via email: dukauwa.du@gmail.com
- Connect on Twitter: [@ukauwa_david](https://twitter.com/ukauwa_david)

## 🙏 Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute! 🎉