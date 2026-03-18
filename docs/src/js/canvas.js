import { editorSettings } from './settings.js';
import { applyAISegmentation } from './ai.js';
import { layerManager } from './layers.js';

let mainCanvas, mainCtx;

/**
 * Initializes the main canvas and its context.
 */
export function initCanvas() {
    mainCanvas = document.getElementById('imageCanvas');
    if (mainCanvas) {
        mainCtx = mainCanvas.getContext('2d');
    }
}

/**
 * Sets up the canvas dimensions and adds the initial base layer.
 * @param {HTMLImageElement} img 
 */
export async function drawImage(img) {
    if (!mainCanvas) initCanvas();

    // Set dimensions based on viewport
    const maxWidth = window.innerWidth * 0.7;
    const maxHeight = window.innerHeight * 0.7;
    let width = img.naturalWidth;
    let height = img.naturalHeight;

    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width *= ratio;
    height *= ratio;

    mainCanvas.width = width;
    mainCanvas.height = height;

    // Reset Layer Manager with Base Layer
    layerManager.layers = [];
    const baseLayer = layerManager.addLayer('Base Image', width, height);
    baseLayer.ctx.drawImage(img, 0, 0, width, height);

    await redraw();
}

import { curvesPanel } from './panels/curves.js';

/**
 * Composites all layers and applies global effects.
 */
export async function redraw() {
    if (!mainCanvas || layerManager.layers.length === 0) return;

    // 1. Clear main canvas
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // 2. Process AI Effects on the base layer if enabled
    const baseLayer = layerManager.layers[0];
    if (editorSettings.removeBackground && baseLayer) {
        // AI Segment will modify the base layer canvas
        await applyAISegmentation(baseLayer.canvas);
    }

    // 3. Composite all layers
    layerManager.composite(mainCtx);

    // 4. Apply Curves (LUT)
    applyCurves(mainCtx);

    // 5. Apply Global Filters (Legacy Support)
    applyGlobalFilters(mainCtx);
}

/**
 * Applies the Curves LUT to the canvas pixels.
 */
function applyCurves(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const lut = curvesPanel.lut;

    for (let i = 0; i < data.length; i += 4) {
        data[i]     = lut[data[i]];     // Red
        data[i + 1] = lut[data[i + 1]]; // Green
        data[i + 2] = lut[data[i + 2]]; // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Applies global CSS-like filters for backwards compatibility.
 */
function applyGlobalFilters(ctx) {
    const { brightness, contrast, saturation, hue, grayscale, invert, sepia, glow, opacity } = editorSettings;
    
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) opacity(${opacity}%)`;
    if (grayscale) filterString += ' grayscale(100%)';
    if (invert) filterString += ' invert(100%)';
    if (sepia) filterString += ' sepia(100%)';
    
    // Use a temp canvas to avoid cumulative filter application
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = ctx.canvas.width;
    tempCanvas.height = ctx.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.filter = filterString;
    tempCtx.drawImage(ctx.canvas, 0, 0);
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    
    if (glow) {
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(10px) brightness(1.5)';
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
    }
    
    ctx.filter = 'none';
}

export function getCanvas() {
    return mainCanvas;
}
