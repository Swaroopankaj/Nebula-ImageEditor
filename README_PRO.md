# Nebula Pro: Running Locally

Because Nebula uses professional **ES Modules**, opening the `index.html` file directly in your browser (`file://` protocol) will trigger security blocks (CORS).

To run the editor properly, you must use a local web server:

### Option 1: Using Node.js (Recommended)
If you have Node.js installed, simply run:
```bash
npm start
```
This will start a server at `http://localhost:3000` (or similar).

### Option 2: Using Python
If you have Python installed, run:
```bash
python -m http.server 5500
```
Then visit `http://localhost:5500` in your browser.

### Option 3: VS Code "Live Server"
If you use VS Code, right-click `index.html` and select **"Open with Live Server"**.

---
**Enjoy the Pro Experience!**
🌠 Interactive Curves
🎨 Precision Brush
📍 Pro Crop
📑 Layer Management
AI Subject Isolation
