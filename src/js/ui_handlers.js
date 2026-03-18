import { brushTool } from './tools/brush.js';
import { cropTool } from './tools/crop.js';

let currentTool = 'select';

export function initHandlers() {
    const mainCanvas = document.getElementById('imageCanvas');

    // 1. Tool Switching (Left Toolbar)
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentTool = btn.dataset.tool;

            // Clear previous tool state
            cropTool.clear();

            // Toggle Top Contextual Bar
            document.querySelectorAll('.tool-context').forEach(c => c.classList.add('hidden'));
            const contextId = `tool-context-${btn.dataset.tool}`;
            document.getElementById(contextId)?.classList.remove('hidden');
            
            console.log(`Tool changed to: ${currentTool}`);
        });
    });

    // 2. Panel Switching (Right Sidebar)
    // ...
    
    // Canvas Interaction (Tools)
    if (mainCanvas) {
        mainCanvas.addEventListener('mousedown', (e) => {
            if (currentTool === 'brush') {
                brushTool.start(e, mainCanvas);
            } else if (currentTool === 'crop') {
                cropTool.start(e, mainCanvas);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (currentTool === 'brush') {
                brushTool.draw(e, mainCanvas);
            } else if (currentTool === 'crop') {
                cropTool.move(e, mainCanvas);
            }
        });

        window.addEventListener('mouseup', () => {
            if (currentTool === 'brush') {
                brushTool.stop();
            } else if (currentTool === 'crop') {
                cropTool.stop();
            }
        });
    }

    // Top Bar Actions
    document.getElementById('confirmCrop')?.addEventListener('click', () => cropTool.apply());
    document.getElementById('cancelCrop')?.addEventListener('click', () => cropTool.clear());

    document.getElementById('aiSelectSubject')?.addEventListener('click', async () => {
        const btn = document.getElementById('aiSelectSubject');
        const originalText = btn.textContent;
        btn.textContent = 'Analyzing...';
        btn.classList.add('animate-pulse');

        // This triggers the segmentation on the base layer
        await updateSettings({ removeBackground: true });
        await redraw();

        btn.textContent = originalText;
        btn.classList.remove('animate-pulse');
        console.log('AI Subject Isolation Complete');
    });
    // ...

    // 2. Panel Switching (Right Sidebar)
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            
            tab.classList.add('active');
            const panelId = `panel-${tab.dataset.tab}`;
            document.getElementById(panelId)?.classList.remove('hidden');
        });
    });

    // Canvas Interaction (Tools)
    if (mainCanvas) {
        mainCanvas.addEventListener('mousedown', (e) => {
            if (currentTool === 'brush') {
                brushTool.start(e, mainCanvas);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (currentTool === 'brush') {
                brushTool.draw(e, mainCanvas);
            }
        });

        window.addEventListener('mouseup', () => {
            if (currentTool === 'brush') {
                brushTool.stop();
            }
        });
    }

    // Top Bar Brush Settings
    const brushSizeInput = document.querySelector('#tool-context-brush .brush-size-input');
    if (brushSizeInput) {
        brushSizeInput.addEventListener('input', (e) => {
            brushTool.size = parseInt(e.target.value);
            const valDisplay = document.getElementById('brushSizeValue');
            if (valDisplay) {
                valDisplay.textContent = e.target.value;
            }
        });
    }

    const brushOpacityInput = document.querySelector('#tool-context-brush .brush-opacity-input');
    if (brushOpacityInput) {
        brushOpacityInput.addEventListener('input', (e) => {
            brushTool.opacity = parseFloat(e.target.value);
            const valDisplay = document.getElementById('brushOpacityValue');
            if (valDisplay) {
                valDisplay.textContent = e.target.value;
            }
        });
    }

    // Curves Interaction Stub
    const curvesContainer = document.getElementById('curves-container');
    if (curvesContainer) {
        curvesContainer.addEventListener('mousedown', (e) => {
            console.log('Curves interaction started');
        });
    }

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
