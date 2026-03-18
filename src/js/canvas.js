import { updateCanvasBackground } from './utils.js';

export function setupCanvas(canvas, container) {
    const ctx = canvas.getContext('2d');
    
    function drawImage(currentImage, editorSettings, currentSegmentationMask) {
        if (!currentImage.src) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const { width, height } = canvas;

        // 1. Create a temporary canvas for filtered processing
        const offscreen = document.createElement('canvas');
        const osCtx = offscreen.getContext('2d');
        offscreen.width = width;
        offscreen.height = height;

        // 2. Build the CSS Filter String
        let filters = [];
        filters.push(`brightness(${editorSettings.brightness}%)`);
        filters.push(`contrast(${editorSettings.contrast}%)`);
        filters.push(`saturate(${editorSettings.saturation}%)`);
        filters.push(`hue-rotate(${editorSettings.hue}deg)`);
        if (editorSettings.globalBlur > 0) filters.push(`blur(${editorSettings.globalBlur}px)`);
        
        if (editorSettings.grayscale) filters.push('grayscale(100%)');
        if (editorSettings.invert) filters.push('invert(100%)');
        if (editorSettings.sepia) filters.push('sepia(100%)');
        if (editorSettings.glow) filters.push('drop-shadow(0px 0px 12px rgba(139, 92, 246, 0.8))');
        
        filters.push(`opacity(${editorSettings.opacity}%)`);

        osCtx.filter = filters.join(' ');
        
        // 3. Handle Transformations (Rotate/Flip)
        osCtx.save();
        osCtx.translate(width / 2, height / 2);
        osCtx.rotate((editorSettings.rotation * Math.PI) / 180);
        osCtx.scale(editorSettings.flipH ? -1 : 1, editorSettings.flipV ? -1 : 1);
        osCtx.drawImage(currentImage, -width / 2, -height / 2, width, height);
        osCtx.restore();

        // 4. Handle AI Segmentation Effects
        if (editorSettings.removeBackground && currentSegmentationMask) {
            // Draw only the subject
            ctx.save();
            ctx.drawImage(currentSegmentationMask, 0, 0, width, height);
            ctx.globalCompositeOperation = 'source-in';
            ctx.drawImage(offscreen, 0, 0);
            ctx.restore();
        } else if (editorSettings.grayscaleMode !== 'none' && currentSegmentationMask) {
            // Background Layer
            ctx.save();
            if (editorSettings.grayscaleMode === 'bg_grayscale') {
                const bgOffscreen = document.createElement('canvas');
                const bgCtx = bgOffscreen.getContext('2d');
                bgOffscreen.width = width;
                bgOffscreen.height = height;
                bgCtx.filter = 'grayscale(100%) brightness(70%)';
                bgCtx.drawImage(offscreen, 0, 0);
                
                ctx.drawImage(bgOffscreen, 0, 0);
                // Cut out subject from grayscale bg
                ctx.globalCompositeOperation = 'destination-out';
                ctx.drawImage(currentSegmentationMask, 0, 0, width, height);
                ctx.globalCompositeOperation = 'source-over';
                // Draw color subject on top
                const subOffscreen = document.createElement('canvas');
                const subCtx = subOffscreen.getContext('2d');
                subOffscreen.width = width;
                subOffscreen.height = height;
                subCtx.drawImage(currentSegmentationMask, 0, 0, width, height);
                subCtx.globalCompositeOperation = 'source-in';
                subCtx.drawImage(offscreen, 0, 0);
                ctx.drawImage(subOffscreen, 0, 0);
            } else if (editorSettings.grayscaleMode === 'subject_grayscale') {
                ctx.drawImage(offscreen, 0, 0);
                // Grayscale Subject
                const subOffscreen = document.createElement('canvas');
                const subCtx = subOffscreen.getContext('2d');
                subOffscreen.width = width;
                subOffscreen.height = height;
                subCtx.filter = 'grayscale(100%)';
                subCtx.drawImage(offscreen, 0, 0);
                
                const maskOffscreen = document.createElement('canvas');
                const maskCtx = maskOffscreen.getContext('2d');
                maskOffscreen.width = width;
                maskOffscreen.height = height;
                maskCtx.drawImage(currentSegmentationMask, 0, 0, width, height);
                maskCtx.globalCompositeOperation = 'source-in';
                maskCtx.drawImage(subOffscreen, 0, 0);
                
                ctx.drawImage(maskOffscreen, 0, 0);
            }
            ctx.restore();
        } else {
            // Standard render
            ctx.drawImage(offscreen, 0, 0);
        }
    }

    return { drawImage };
}
