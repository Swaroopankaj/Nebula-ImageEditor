/**
 * Represents a single layer in the editor.
 */
export class Layer {
    constructor(name, width, height) {
        this.name = name;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        
        this.visible = true;
        this.opacity = 1.0;
        this.blendMode = 'normal';
        this.locked = false;
    }

    /**
     * Clears the layer canvas.
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

/**
 * Manages the stack of layers and their compositing.
 */
export class LayerManager {
    constructor() {
        this.layers = [];
        this.activeLayerIndex = -1;
    }

    /**
     * Adds a new layer to the stack.
     */
    addLayer(name, width, height) {
        const layer = new Layer(name, width, height);
        this.layers.push(layer);
        this.activeLayerIndex = this.layers.length - 1;
        this.updateUI();
        return layer;
    }

    /**
     * Synchronizes the Layer Panel UI with the internal layer stack.
     */
    updateUI() {
        const stack = document.getElementById('layers-stack');
        if (!stack) return;

        stack.innerHTML = '';
        this.layers.slice().reverse().forEach((layer, index) => {
            const actualIndex = this.layers.length - 1 - index;
            const item = document.createElement('div');
            item.className = `flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${actualIndex === this.activeLayerIndex ? 'bg-indigo-500 bg-opacity-20 border-indigo-500 border-opacity-30' : 'bg-white bg-opacity-5 border-white border-opacity-5'}`;
            
            item.innerHTML = `
                <div class="w-10 h-10 bg-black rounded-lg border border-white border-opacity-10 overflow-hidden">
                    <canvas class="layer-thumb w-full h-full object-cover"></canvas>
                </div>
                <div class="flex-1">
                    <p class="text-xs font-bold text-white">${layer.name}</p>
                    <p class="text-[10px] text-white text-opacity-40">${layer.locked ? 'Locked' : 'Standard Layer'}</p>
                </div>
                <button class="layer-vis-toggle p-1 ${layer.visible ? 'opacity-100' : 'opacity-20'}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
            `;

            // Draw thumbnail
            const thumbCanvas = item.querySelector('.layer-thumb');
            const thumbCtx = thumbCanvas.getContext('2d');
            thumbCanvas.width = 40;
            thumbCanvas.height = 40;
            thumbCtx.drawImage(layer.canvas, 0, 0, 40, 40);

            // Selection
            item.addEventListener('click', () => {
                this.activeLayerIndex = actualIndex;
                this.updateUI();
            });

            // Visibility Toggle
            item.querySelector('.layer-vis-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                layer.visible = !layer.visible;
                this.updateUI();
                redraw();
            });

            stack.appendChild(item);
        });
    }

    /**
     * Returns the currently active layer.
     */
    getActiveLayer() {
        return this.layers[this.activeLayerIndex] || null;
    }

    /**
     * Composites all visible layers onto a target context.
     */
    composite(targetCtx) {
        targetCtx.clearRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height);
        
        this.layers.forEach(layer => {
            if (layer.visible) {
                targetCtx.globalAlpha = layer.opacity;
                targetCtx.globalCompositeOperation = layer.blendMode === 'normal' ? 'source-over' : layer.blendMode;
                targetCtx.drawImage(layer.canvas, 0, 0);
            }
        });
        
        // Reset context
        targetCtx.globalAlpha = 1.0;
        targetCtx.globalCompositeOperation = 'source-over';
    }
}

export const layerManager = new LayerManager();
