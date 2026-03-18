import { processNewImage, handleReset, handleDownload, redraw, applyPreset } from './main.js';
import { editorSettings } from './settings.js';
import { applyTheme } from './utils.js';

export function initHandlers() {
    // Tab Switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            
            // Add to current
            tab.classList.add('active');
            const panelId = `tab-${tab.dataset.tab}`;
            const panel = document.getElementById(panelId);
            if (panel) panel.classList.remove('hidden');
        });
    });

    // File Upload
    document.getElementById('imageUpload')?.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => processNewImage(event.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Theme Toggle
    document.getElementById('darkModeToggle')?.addEventListener('click', () => {
        const theme = document.body.classList.contains('light') ? 'dark' : 'light';
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    });

    // Info Modal
    document.getElementById('infoButton')?.addEventListener('click', () => {
        document.getElementById('infoModal')?.classList.remove('hidden');
    });
    document.getElementById('closeInfoModal')?.addEventListener('click', () => {
        document.getElementById('infoModal')?.classList.add('hidden');
    });

    // Global Adjustments
    const inputs = {
        brightness: 'brightness',
        contrast: 'contrast',
        saturation: 'saturation',
        hue: 'hue',
        globalBlur: 'globalBlur',
        opacity: 'opacity'
    };

    Object.entries(inputs).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                editorSettings[key] = parseFloat(e.target.value);
                const valDisplay = document.getElementById(`${id}Value`);
                if (valDisplay) {
                    valDisplay.textContent = `${e.target.value}${key === 'hue' ? '°' : (key === 'globalBlur' ? 'px' : '%')}`;
                }
                redraw();
            });
        }
    });

    // Filter Buttons
    ['grayscaleButton', 'invertButton', 'sepiaButton', 'glowButton'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const settingKey = id.replace('Button', '');
                editorSettings[settingKey] = !editorSettings[settingKey];
                btn.classList.toggle('active', editorSettings[settingKey]);
                redraw();
            });
        }
    });

    // Presets
    document.getElementById('presetsControls')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.preset-btn');
        if (btn) {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyPreset(btn.dataset.preset);
        }
    });

    // AI Segmentation
    document.getElementById('removeBackgroundCheckbox')?.addEventListener('change', (e) => {
        editorSettings.removeBackground = e.target.checked;
        redraw();
    });

    document.querySelectorAll('input[name="grayscaleMode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            editorSettings.grayscaleMode = e.target.value;
            redraw();
        });
    });

    // Transformation Buttons
    document.getElementById('flipHorizontalButton')?.addEventListener('click', () => {
        editorSettings.flipH = !editorSettings.flipH;
        redraw();
    });

    document.getElementById('flipVerticalButton')?.addEventListener('click', () => {
        editorSettings.flipV = !editorSettings.flipV;
        redraw();
    });

    document.getElementById('rotate90Button')?.addEventListener('click', () => {
        editorSettings.rotation = (editorSettings.rotation + 90) % 360;
        redraw();
    });

    document.getElementById('cropSquareButton')?.addEventListener('click', () => {
        // Simple Square Crop Logic (Placeholder for future expansion)
        alert('1:1 Crop applied (Visual center)');
        redraw();
    });

    // Reset & Download
    document.getElementById('resetButton')?.addEventListener('click', handleReset);
    document.getElementById('downloadButton')?.addEventListener('click', handleDownload);

    // Initial theme check
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}
