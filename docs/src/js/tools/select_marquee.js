import { layerManager } from '../layers.js';
import { redraw } from '../main.js';

class MarqueeTool {
    constructor() {
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.selection = null;
        this.overlay = null;
    }

    start(e, canvas) {
        this.isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.overlay = document.getElementById('interactionOverlay');
        
        if (this.overlay) {
            this.overlay.innerHTML = '';
            this.selection = document.createElement('div');
            this.selection.className = 'absolute border-2 border-dashed border-indigo-400 bg-indigo-500 bg-opacity-10 z-50';
            this.selection.style.left = `${this.startX}px`;
            this.selection.style.top = `${this.startY}px`;
            this.overlay.appendChild(this.selection);
        }
    }

    move(e, canvas) {
        if (!this.isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const left = Math.min(this.startX, currentX);
        const top = Math.min(this.startY, currentY);
        const width = Math.abs(currentX - this.startX);
        const height = Math.abs(currentY - this.startY);

        if (this.selection) {
            this.selection.style.left = `${left}px`;
            this.selection.style.top = `${top}px`;
            this.selection.style.width = `${width}px`;
            this.selection.style.height = `${height}px`;
        }
    }

    stop() {
        this.isDrawing = false;
        if (this.selection) {
            const rect = this.selection.getBoundingClientRect();
            if (rect.width < 5 || rect.height < 5) {
                this.clear();
            }
        }
    }

    clear() {
        this.isDrawing = false;
        if (this.overlay) this.overlay.innerHTML = '';
        this.selection = null;
    }

    copyToNewLayer() {
        if (!this.selection) return;

        const rect = this.selection.getBoundingClientRect();
        const canvas = document.getElementById('imageCanvas');
        const canvasRect = canvas.getBoundingClientRect();

        // Calculate relative coordinates
        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top;
        const w = rect.width;
        const h = rect.height;

        // Get content from main canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);

        // Add to Layer Manager
        const newLayer = layerManager.addLayer(`Selection ${Date.now()}`, canvas.width, canvas.height);
        newLayer.ctx.drawImage(tempCanvas, x, y);

        this.clear();
        redraw();
        
        // Switch to layers panel to show success
        document.querySelector('[data-tab="layers"]')?.click();
    }
}

export const marqueeTool = new MarqueeTool();
