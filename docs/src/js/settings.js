export const editorSettings = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    globalBlur: 0,
    opacity: 100,
    
    // Filters
    grayscale: false,
    invert: false,
    sepia: false,
    glow: false,
    
    // AI / Segmentation
    removeBackground: false,
    grayscaleMode: 'none', // 'none', 'bg_grayscale', 'subject_grayscale'
    
    // Transformation
    rotation: 0,
    flipH: false,
    flipV: false
};

export const PRESETS = {
    original: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        globalBlur: 0
    },
    cyberpunk: {
        brightness: 110,
        contrast: 140,
        saturation: 180,
        hue: 300,
        globalBlur: 0
    },
    vintage: {
        brightness: 90,
        contrast: 90,
        saturation: 50,
        hue: 40,
        globalBlur: 0.5
    },
    lofi: {
        brightness: 105,
        contrast: 110,
        saturation: 70,
        hue: 0,
        globalBlur: 1
    },
    warm: {
        brightness: 100,
        contrast: 100,
        saturation: 120,
        hue: 20,
        globalBlur: 0
    },
    cold: {
        brightness: 100,
        contrast: 100,
        saturation: 110,
        hue: 200,
        globalBlur: 0
    },
    cinematic: {
        brightness: 80,
        contrast: 150,
        saturation: 20,
        hue: 0,
        globalBlur: 0.5
    }
};

export function resetSettings() {
    Object.assign(editorSettings, PRESETS.original);
    editorSettings.grayscale = false;
    editorSettings.invert = false;
    editorSettings.sepia = false;
    editorSettings.glow = false;
    editorSettings.removeBackground = false;
    editorSettings.grayscaleMode = 'none';
    editorSettings.rotation = 0;
    editorSettings.flipH = false;
    editorSettings.flipV = false;
}

export async function updateSettings(newSettings) {
    Object.assign(editorSettings, newSettings);
}
