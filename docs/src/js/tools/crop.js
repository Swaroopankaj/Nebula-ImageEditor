import { redraw } from '../canvas.js';
import { layerManager } from '../layers.js';

export class CropTool {
    constructor() {
        this.isSelecting = false;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        
        this.overlay = document.getElementById('interactionOverlay');
    }

    /**
     * Starts the selection process.
     */
    start(e, canvas) {
        this.isSelecting = true;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.startX = (clientX - rect.left) * (canvas.width / rect.width);
        this.startY = (clientY - rect.top) * (canvas.height / rect.height);
        
        this.endX = this.startX;
        this.endY = this.startY;
        
        this.updateOverlay(canvas);
    }

    /**
     * Updates the selection rectangle as the mouse moves.
     */
    move(e, canvas) {
        if (!this.isSelecting) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.endX = (clientX - rect.left) * (canvas.width / rect.width);
        this.endY = (clientY - rect.top) * (canvas.height / rect.height);
        
        this.updateOverlay(canvas);
    }

    /**
     * Stops the selection process.
     */
    stop() {
        this.isSelecting = false;
    }

    /**
     * Draws the selection box on the interaction overlay.
     */
    updateOverlay(canvas) {
        if (!this.overlay) return;
        
        const x = Math.min(this.startX, this.endX);
        const y = Math.min(this.startY, this.endY);
        const w = Math.abs(this.startX - this.endX);
        const h = Math.abs(this.startY - this.endY);

        // Convert canvas coords to display coords for the overlay div
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
                border: 2px dashed #8b5cf6;
                box-shadow: 0 0 0 9999px rgba(0,0,0,0.5);
                pointer-events: none;
            ">
                <span style="position: absolute; top: -20px; right: 0; background: #8b5cf6; color: white; font-size: 10px; padding: 2px 6px; font-weight: bold; border-radius: 4px;">
                    ${Math.round(w)} x ${Math.round(h)}
                </span>
            </div>
        `;
    }

    /**
     * Clears the crop selection.
     */
    clear() {
        if (this.overlay) this.overlay.innerHTML = '';
        this.isSelecting = false;
    }

    /**
     * Applies the crop to all layers in the layer manager.
     */
    apply() {
        const x = Math.round(Math.min(this.startX, this.endX));
        const y = Math.round(Math.min(this.startY, this.endY));
        const w = Math.round(Math.abs(this.startX - this.endX));
        const h = Math.round(Math.abs(this.startY - this.endY));

        if (w < 5 || h < 5) return; // Prevent tiny crops

        layerManager.layers.forEach(layer => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d');
            
            tempCtx.drawImage(layer.canvas, x, y, w, h, 0, 0, w, h);
            
            layer.canvas.width = w;
            layer.canvas.height = h;
            layer.clear();
            layer.ctx.drawImage(tempCanvas, 0, 0);
        });

        // Update main canvas size is handled by redraw calling composite on resized layers
        const mainCanvas = document.getElementById('imageCanvas');
        mainCanvas.width = w;
        mainCanvas.height = h;

        this.clear();
        redraw();
    }
}

export const cropTool = new CropTool();
