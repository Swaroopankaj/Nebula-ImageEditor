# Nebula ✨ High-End Web Image Editor

**[🚀 Live Demo](https://swaroopankaj.github.io/Nebula-ImageEditor/)** | **[🛡️ Privacy-First](#-privacy-first)** | **[🛠️ Tech Stack](#-tech-stack)**

Nebula is a professional-grade, privacy-first web image editing powerhouse. Built with a stunning **Glassmorphism** aesthetic and powered by edge-AI, it brings high-end photo manipulation directly to your browser.

---

## 🎨 Professional Overhaul (v2.0)
The latest version of Nebula features a total redesign and architectural refactor:
- **Glassmorphism Dashboard**: A modern, sleek workspace with backdrop-blur effects and vibrant accents.
- **Modular Architecture**: Cleanly separated logic into dedicated JS modules for better performance and maintainability.
- **Tabbed Workflow**: Tool-centric navigation (Adjust, Filters, AI Effects, Transform) inspired by professional creative suites.
- **Dynamic UX**: Integrated micro-animations and smooth transitions for a premium feel.

---

## 🛡️ Privacy-First
Nebula is **100% client-side**. Your images are never uploaded to a server. All processing (including AI segmentation) happens directly on your device using MediaPipe and the hardware-accelerated Canvas API. Your data stays yours.

---

## ✨ Key Features:
- **AI-Powered Segmentation**: Intelligent human subject isolation for background removal and focus effects.
- **Professional Presets**: Instant artistic transformations (Cinematic, Cyberpunk, Lofi, Noir).
- **Global Precision**: Fine-grained control over Brightness, Contrast, Saturation, Hue, and Focus.
- **Dynamic Filters**: Real-time Grayscale, Invert, Sepia, and Glow effects.
- **Geometric Mastery**: Advanced Flip, Rotate, and 1:1 Square Cropping.
- **Hardware Acceleration**: Smooth real-time rendering via the Canvas API.

---

## 🛠️ Tech Stack:
- **Core**: HTML5, Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS (Custom Design System) + Tailwind (Layout)
- **AI Engine**: [MediaPipe](https://google.github.io/mediapipe/) (Selfie Segmentation)
- **Performance**: Edge-computing via Browser Canvas API

---

## 🏗️ Project Structure:
```text
Nebula-ImageEditor/
├── index.html          # Clean, modular entry point
├── src/
│   ├── css/
│   │   └── main.css    # Premium design system tokens
│   └── js/
│       ├── main.js     # Core application controller
│       ├── ui_handlers.js # UI event & tab management
│       ├── canvas.js   # Rendering engine
│       ├── ai.js       # MediaPipe AI bridge
│       └── settings.js # Configuration & Presets
└── docs/               # GitHub Pages deployment directory
```

---

> [!IMPORTANT]
> **Privacy Guarantee**: No image data is ever sent to any remote server. All computations are performed locally in your browser.

---

> [!TIP]
> **Contributors wanted!** Nebula is an open-source project. Feel free to submit an issue or a pull request to help build the future of web-based creative tools.
