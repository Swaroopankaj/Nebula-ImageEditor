import { editorSettings, PRESETS, resetSettings } from './settings.js';
import { updateCanvasBackground } from './utils.js';
import { loadSegmentationModel } from './ai.js';
import { setupCanvas } from './canvas.js';

// DOM Elements
const elements = {
    imageUpload: document.getElementById('imageUpload'),
    canvasContainer: document.getElementById('canvasContainer'),
    dragDropOverlay: document.getElementById('dragDropOverlay'),
    imageCanvas: document.getElementById('imageCanvas'),
    placeholderText: document.getElementById('placeholderText'),
    loadingDiv: document.getElementById('loading'),
    loadingMessage: document.getElementById('loadingMessage'),
    loadingDetail: document.getElementById('loadingDetail'),
    infoModal: document.getElementById('infoModal'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    resetButton: document.getElementById('resetButton'),
    downloadButton: document.getElementById('downloadButton')
};

// Application State
let originalImage = new Image();
let currentImage = new Image();
let currentSegmentationMask = null;
let segmentation = null;

const { drawImage } = setupCanvas(elements.imageCanvas, elements.canvasContainer);

// Core Redraw Trigger
export function redraw() {
    drawImage(currentImage, editorSettings, currentSegmentationMask);
}

// Global Image Processing Handler
export async function processNewImage(src) {
    elements.loadingDiv.classList.remove('hidden');
    elements.loadingMessage.textContent = 'Preparing workspace...';
    
    return new Promise((resolve) => {
        originalImage.onload = async () => {
            // resetSettings(); // Don't reset if we want to keep current adjustments on new image? 
            // Actually, keep it for now for a fresh start.
            resetSettings();
            currentImage.src = originalImage.src;
            
            elements.imageCanvas.width = currentImage.naturalWidth;
            elements.imageCanvas.height = currentImage.naturalHeight;

            if (!segmentation) {
                segmentation = await loadSegmentationModel(
                    elements.loadingDiv, 
                    elements.loadingMessage, 
                    elements.loadingDetail,
                    (results) => {
                        currentSegmentationMask = results.segmentationMask;
                        redraw();
                    }
                );
            }

            if (segmentation) {
                elements.loadingMessage.textContent = 'AI Segmentation...';
                await segmentation.send({ image: originalImage });
            }
            
            elements.placeholderText.classList.add('hidden');
            elements.loadingDiv.classList.add('hidden');
            redraw();
            resolve();
        };
        originalImage.src = src;
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
    if (!originalImage.src) return;
    resetSettings();
    currentImage.src = originalImage.src;
    
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
    if (!currentImage.src) return;
    const link = document.createElement('a');
    link.download = `nebula-${Date.now()}.png`;
    link.href = elements.imageCanvas.toDataURL('image/png', 1.0);
    link.click();
}
