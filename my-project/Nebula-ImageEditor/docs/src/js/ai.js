export async function loadSegmentationModel(loadingDiv, loadingMessage, loadingDetail, onResults) {
    loadingDiv.classList.remove('hidden');
    loadingMessage.textContent = 'Loading Segmentation Model...';
    loadingDetail.textContent = 'This model is used for subject/background effects.';

    try {
        const segmentation = new SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });

        segmentation.setOptions({
            modelSelection: 1,
            selfieMode: false,
        });

        segmentation.onResults(onResults);
        console.log('Selfie Segmentation model loaded successfully!');
        loadingDiv.classList.add('hidden');
        return segmentation;
    } catch (error) {
        console.error('Failed to load segmentation model:', error);
        loadingMessage.textContent = 'Error Loading Model!';
        loadingDetail.textContent = 'Could not load the segmentation model. ' + error.message;
        loadingDiv.classList.add('bg-red-700');
        return null;
    }
}
