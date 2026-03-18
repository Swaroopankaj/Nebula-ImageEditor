export function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
}

export function updateCanvasBackground(canvas, isLight) {
    // This is now largely handled by CSS via the .checkerboard-bg class
}
