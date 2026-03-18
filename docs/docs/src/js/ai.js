let segmentationModel = null;
let resolveSegmentation = null;

export async function loadSegmentationModel(loadingDiv, loadingMessage, loadingDetail) {
    if (segmentationModel) return segmentationModel;

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

        segmentationModel.onResults((results) => {
            if (resolveSegmentation) {
                resolveSegmentation(results);
                resolveSegmentation = null;
            }
        });

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
 * Applies AI segmentation to the provided canvas.
 * @param {HTMLCanvasElement} canvas 
 */
export async function applyAISegmentation(canvas) {
    if (!segmentationModel) {
        await loadSegmentationModel(
            document.getElementById('loading'),
            document.getElementById('loadingMessage'),
            document.getElementById('loadingDetail')
        );
    }

    if (!segmentationModel) return;

    return new Promise(async (resolve) => {
        resolveSegmentation = (results) => {
            const ctx = canvas.getContext('2d');
            const { width, height } = canvas;

            ctx.save();
            ctx.clearRect(0, 0, width, height);
            
            // Draw the mask
            ctx.drawImage(results.segmentationMask, 0, 0, width, height);

            // Use the mask to clip the original image
            ctx.globalCompositeOperation = 'source-in';
            ctx.drawImage(results.image, 0, 0, width, height);
            
            ctx.restore();
            resolve();
        };

        await segmentationModel.send({ image: canvas });
    });
}
