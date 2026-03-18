let segmentationModel = null;

export async function loadSegmentationModel(loadingDiv, loadingMessage, loadingDetail, onResults) {
    if (segmentationModel) {
        segmentationModel.onResults(onResults);
        return segmentationModel;
    }

    loadingDiv.classList.remove('hidden');
    loadingMessage.textContent = 'Loading Segmentation Model...';
    loadingDetail.textContent = 'This model is used for subject/background effects.';

    try {
        segmentationModel = new SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });

        segmentationModel.setOptions({
            modelSelection: 1,
            selfieMode: false,
        });

        segmentationModel.onResults(onResults);
        console.log('Selfie Segmentation model loaded successfully!');
        loadingDiv.classList.add('hidden');
        return segmentationModel;
    } catch (error) {
        console.error('Failed to load segmentation model:', error);
        loadingMessage.textContent = 'Error Loading Model!';
        loadingDetail.textContent = 'Could not load the segmentation model. ' + error.message;
        loadingDiv.classList.add('bg-red-700');
        return null;
    }
}

/**
 * Applies AI segmentation to the given canvas.
 * @param {HTMLCanvasElement} canvas 
 */
export async function applyAISegmentation(canvas) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Create a temporary canvas for the original image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    return new Promise(async (resolve) => {
        const model = await loadSegmentationModel(
            document.getElementById('loading'),
            document.getElementById('loadingMessage'),
            document.getElementById('loadingDetail'),
            (results) => {
                // Clear the main canvas
                ctx.clearRect(0, 0, width, height);

                // Draw the mask
                ctx.drawImage(results.segmentationMask, 0, 0, width, height);

                // Use the mask to clip the original image
                ctx.globalCompositeOperation = 'source-in';
                ctx.drawImage(tempCanvas, 0, 0, width, height);

                // Reset composite operation
                ctx.globalCompositeOperation = 'source-over';
                resolve();
            }
        );

        if (model) {
            await model.send({ image: tempCanvas });
        } else {
            resolve(); // Fallback if model fails to load
        }
    });
}
