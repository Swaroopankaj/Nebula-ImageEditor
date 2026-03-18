import { redraw } from '../canvas.js';
import { layerManager } from '../layers.js';

export class MarqueeTool {
    constructor() {
        this.isSelecting = false;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.selection = null; // {x, y, w, h}
        
        this.overlay = document.getElementById('interactionOverlay');
    }

    start(e, canvas) {
        this.isSelecting = true;
        const rect = canvas.getBoundingClientRect();
        this.startX = (e.clientX - rect.left) * (canvas.width / rect.width);
        this.startY = (e.clientY - rect.top) * (canvas.height / rect.height);
        this.updateOverlay(canvas);
    }

    move(e, canvas) {
        if (!this.isSelecting) return;
        const rect = canvas.getBoundingClientRect();
        this.endX = (e.clientX - rect.left) * (canvas.width / rect.width);
        this.endY = (e.clientY - rect.top) * (canvas.height / rect.height);
        this.updateOverlay(canvas);
    }

    stop() {
        this.isSelecting = false;
        this.selection = {
            x: Math.min(this.startX, this.endX),
            y: Math.min(this.startY, this.endY),
            w: Math.abs(this.startX - this.endX),
            h: Math.abs(this.startY - this.endY)
        };
        
        if (this.selection.w < 2 || this.selection.h < 2) {
            this.clear();
        }
    }

    updateOverlay(canvas) {
        if (!this.overlay) return;
        
        const x = Math.min(this.startX, this.endX || this.startX);
        const y = Math.min(this.startY, this.endY || this.startY);
        const w = Math.abs(this.startX - (this.endX || this.startX));
        const h = Math.abs(this.startY - (this.endY || this.startY));

        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;

        this.overlay.innerHTML = `
            <div style="
                position: absolute;
                left: ${x * scaleX}px;
                top: ${y * scaleY}px;
                width: ${w * scaleX}px;
                height: ${h * scaleY}px;
                border: 1px dashed white;
                outline: 1px dashed black;
                background: rgba(255,255,255,0.1);
                pointer-events: none;
                animation: marquee-ants 0.5s infinite linear;
            "></div>
            <style>
                @keyframes marquee-ants {
                    from { stroke-dashoffset: 0; }
                    to { stroke-dashoffset: -4; }
                }
            </style>
        `;
    }

    clear() {
        if (this.overlay) this.overlay.innerHTML = '';
        this.selection = null;
    }

    /**
     * Creates a new layer from the selected area of the active layer.
     */
    copyToNewLayer() {
        if (!this.selection) return;
        const activeLayer = layerManager.getActiveLayer();
        if (!activeLayer) return;

        const { x, y, w, h } = this.selection;
        const newLayer = layerManager.addLayer(`Selection Layer`, activeLayer.canvas.width, activeLayer.canvas.height);
        
        // Draw only the selected area onto the new layer at the same position
        newLayer.ctx.drawImage(activeLayer.canvas, x, y, w, h, x, y, w, h);
        
        this.clear();
        redraw();
    }
}

export const marqueeTool = new MarqueeTool();
