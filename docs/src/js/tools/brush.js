import { layerManager } from '../layers.js';
import { redraw } from '../canvas.js';

export class BrushTool {
    constructor() {
        this.isDrawing = false;
        this.ctx = null;
        this.size = 20;
        this.opacity = 1.0;
        this.color = '#8b5cf6'; // Indigo-500
        
        this.lastX = 0;
        this.lastY = 0;
    }

    /**
     * Activates the brush on the current active layer.
     */
    activate() {
        const activeLayer = layerManager.getActiveLayer();
        if (activeLayer) {
            this.ctx = activeLayer.ctx;
        }
    }

    /**
     * Handles mouse down event.
     */
    start(e, canvas) {
        this.isDrawing = true;
        this.activate();
        if (!this.ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.lastX = clientX - rect.left;
        this.lastY = clientY - rect.top;
        
        // Scale coordinates to canvas resolution
        this.lastX *= (canvas.width / rect.width);
        this.lastY *= (canvas.height / rect.height);
    }

    /**
     * Handles mouse move event.
     */
    draw(e, canvas) {
        if (!this.isDrawing || !this.ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalAlpha = this.opacity;
        this.ctx.stroke();

        this.lastX = x;
        this.lastY = y;

        // Trigger a redraw of the composite canvas
        redraw();
    }

    /**
     * Handles mouse up event.
     */
    stop() {
        this.isDrawing = false;
        if (this.ctx) {
            this.ctx.globalAlpha = 1.0; // Reset for other layers if needed
        }
    }
}

export const brushTool = new BrushTool();
