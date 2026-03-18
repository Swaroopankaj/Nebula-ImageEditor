import { redraw } from '../canvas.js';

export class CurvesPanel {
    constructor() {
        this.svg = document.getElementById('curves-svg');
        this.path = document.getElementById('curves-path');
        
        // Initial points for the linear curve [x, y] where 0,0 is bottom-left
        this.points = [{x: 0, y: 0}, {x: 255, y: 255}];
        this.activePoint = null;
        
        this.lut = new Uint8Array(256);
        this.updateLUT();
        
        if (this.svg) this.initEvents();
    }

    initEvents() {
        this.svg.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
    }

    onMouseDown(e) {
        const rect = this.svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 255;
        const y = 255 - (((e.clientY - rect.top) / rect.height) * 255);

        // Find if we clicked an existing point
        const threshold = 15;
        this.activePoint = this.points.find(p => 
            Math.abs(p.x - x) < threshold && Math.abs(p.y - y) < threshold
        );

        // If no point found, add one (if not at ends)
        if (!this.activePoint) {
            const newPoint = {x, y};
            this.points.push(newPoint);
            this.points.sort((a, b) => a.x - b.x);
            this.activePoint = newPoint;
        }

        this.render();
    }

    onMouseMove(e) {
        if (!this.activePoint) return;

        const rect = this.svg.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 255;
        let y = 255 - (((e.clientY - rect.top) / rect.height) * 255);

        // Constrain
        x = Math.max(0, Math.min(255, x));
        y = Math.max(0, Math.min(255, y));

        // Start/End points can only move vertically
        if (this.activePoint === this.points[0]) x = 0;
        if (this.activePoint === this.points[this.points.length - 1]) x = 255;

        this.activePoint.x = x;
        this.activePoint.y = y;
        
        this.points.sort((a, b) => a.x - b.x);
        
        this.render();
        this.updateLUT();
        redraw();
    }

    onMouseUp() {
        this.activePoint = null;
    }

    /**
     * Renders the SVG path based on points.
     */
    render() {
        if (!this.path) return;

        let d = `M ${this.points[0].x} ${255 - this.points[0].y}`;
        for (let i = 1; i < this.points.length; i++) {
            // Linear for now, could use Catmull-Rom or Bezier for smooth curves
            d += ` L ${this.points[i].x} ${255 - this.points[i].y}`;
        }
        this.path.setAttribute('d', d);

        // Render handles
        const handlesId = 'curves-handles';
        let handlesGroup = document.getElementById(handlesId);
        if (!handlesGroup) {
            handlesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            handlesGroup.id = handlesId;
            this.svg.appendChild(handlesGroup);
        }
        
        handlesGroup.innerHTML = '';
        this.points.forEach(p => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', p.x);
            circle.setAttribute('cy', 255 - p.y);
            circle.setAttribute('r', '6');
            circle.setAttribute('class', 'curves-point');
            handlesGroup.appendChild(circle);
        });
    }

    /**
     * Generates a 256-value Look-Up Table from the points.
     */
    updateLUT() {
        for (let i = 0; i < 256; i++) {
            // Find segments
            let p1, p2;
            for (let j = 0; j < this.points.length - 1; j++) {
                if (i >= this.points[j].x && i <= this.points[j+1].x) {
                    p1 = this.points[j];
                    p2 = this.points[j+1];
                    break;
                }
            }
            if (p1 && p2) {
                const t = (i - p1.x) / (p2.x - p1.x || 1);
                this.lut[i] = p1.y + t * (p2.y - p1.y);
            }
        }
    }
}

export const curvesPanel = new CurvesPanel();
