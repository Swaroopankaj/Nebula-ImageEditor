import { drawImage as canvasDrawImage, redraw as canvasRedraw } from './canvas.js';
import { editorSettings, PRESETS, resetSettings } from './settings.js';

// State variables
let elements = null;
let originalImage = null;
let currentImage = null;

function getElements() {
    if (!elements) {
        elements = {
            loadingDiv: document.getElementById('loading'),
            loadingMessage: document.getElementById('loadingMessage'),
            loadingDetail: document.getElementById('loadingDetail'),
            placeholderText: document.getElementById('placeholderText'),
            imageCanvas: document.getElementById('imageCanvas')
        };
    }
    return elements;
}

function getOriginalImage() {
    if (!originalImage) originalImage = new Image();
    return originalImage;
}

function getCurrentImage() {
    if (!currentImage) currentImage = new Image();
    return currentImage;
}

// Core Redraw Trigger
export function redraw() {
    canvasRedraw();
}

// Global Image Processing Handler
export async function processNewImage(src) {
    const el = getElements();
    const orig = getOriginalImage();
    const curr = getCurrentImage();

    console.log('processNewImage started with src:', src ? src.substring(0, 50) + '...' : 'null');
    if (el.loadingDiv) {
        el.loadingDiv.classList.remove('hidden');
        el.loadingMessage.textContent = 'Preparing workspace...';
    } else {
        console.warn('loadingDiv not found in DOM');
        alert('Critical: loadingDiv not found!');
    }
    
    return new Promise((resolve, reject) => {
        orig.onload = async () => {
            console.log('Original image loaded successfully');
            try {
                resetSettings();
                
                curr.onload = async () => {
                    try {
                        await canvasDrawImage(curr);
                        if (el.placeholderText) el.placeholderText.classList.add('hidden');
                        if (el.loadingDiv) el.loadingDiv.classList.add('hidden');
                        resolve();
                    } catch (err) {
                        console.error('Canvas draw error:', err);
                        reject(err);
                    }
                };
                
                curr.onerror = (err) => {
                    console.error('Current image load error:', err);
                    reject(err);
                };
                
                curr.src = orig.src;
            } catch (err) {
                console.error('Processing error:', err);
                reject(err);
            }
        };

        orig.onerror = (err) => {
            console.error('Original image load error:', err);
            if (el.loadingDiv) el.loadingDiv.classList.add('hidden');
            reject(err);
        };

        orig.src = src;
    });
}

export function applyPreset(presetName) {
    const preset = PRESETS[presetName];
    if (!preset) return;

    Object.assign(editorSettings, preset);
    
    // Update UI Sliders
    Object.keys(preset).forEach(key => {
        const input = document.getElementById(key);
        const valDisplay = document.getElementById(`${key}Value`);
        if (input) input.value = preset[key];
        if (valDisplay) valDisplay.textContent = `${preset[key]}${key === 'hue' ? '°' : (key === 'globalBlur' ? 'px' : '%')}`;
    });

    redraw();
}

export function handleReset() {
    const orig = getOriginalImage();
    const curr = getCurrentImage();
    if (!orig.src) return;
    resetSettings();
    curr.src = orig.src;
    
    // Reset UI Sliders
    ['brightness', 'contrast', 'saturation', 'hue', 'globalBlur', 'opacity'].forEach(id => {
        const input = document.getElementById(id);
        const valDisplay = document.getElementById(`${id}Value`);
        if (input) input.value = editorSettings[id];
        if (valDisplay) valDisplay.textContent = `${editorSettings[id]}${id === 'hue' ? '°' : (id === 'globalBlur' ? 'px' : '%')}`;
    });

    // Reset Buttons
    document.querySelectorAll('.preset-btn, #grayscaleButton, #invertButton, #sepiaButton, #glowButton').forEach(btn => {
        btn.classList.remove('active');
    });

    redraw();
}

export function handleDownload() {
    const curr = getCurrentImage();
    const el = getElements();
    if (!curr.src) return;
    const link = document.createElement('a');
    link.download = `nebula-${Date.now()}.png`;
    link.href = el.imageCanvas.toDataURL('image/png', 1.0);
    link.click();
}
