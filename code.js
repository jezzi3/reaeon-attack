// Main plugin code (compile to code.js)
// Resize temp to bounds and rebase children to (0,0)
temp.resizeWithoutConstraints(maxX - minX, maxY - minY);
for (const child of temp.children) {
if ('x' in child) child.x -= minX;
if ('y' in child) child.y -= minY;
if ('strokes' in child) child.strokes = [];
}


const bytes = await temp.exportAsync({
format: 'SVG',
contentsOnly: true,
svgOutlineText: true
});
temp.remove();


// send to UI for download
figma.ui.postMessage({ type: 'svg-bytes', bytes: Array.from(bytes) });
figma.notify('SVG exported');
return;
}
};


function createGridFrame(n: number, cell: number, gap: number, showAnchor: boolean) {
const frame = figma.createFrame();
frame.name = `ReAeon Grid ${n}x${n}`;
frame.fills = [];
frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 0;


const size = n * cell + (n - 1) * gap;
frame.resizeWithoutConstraints(size, size);


for (let r = 0; r < n; r++) {
for (let c = 0; c < n; c++) {
const rect = figma.createRectangle();
rect.name = `cell:${r}:${c}`;
rect.x = c * (cell + gap);
rect.y = r * (cell + gap);
rect.resize(cell, cell);
rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.1 }];
rect.strokes = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
rect.strokeAlign = 'INSIDE';
rect.strokeWeight = 0.5;
frame.appendChild(rect);
}
}


if (showAnchor) {
const center = Math.floor(n / 2);
const anchor = figma.createEllipse();
anchor.name = 'anchor';
anchor.resize(cell * 0.4, cell * 0.4);
anchor.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.15, b: 0.15 } }];
anchor.strokes = [];
anchor.x = center * (cell + gap) + cell * 0.3;
anchor.y = center * (cell + gap) + cell * 0.3;
frame.appendChild(anchor);
}


return frame;
}


async function getLastGridFrame(): Promise<FrameNode | null> {
const id = await figma.clientStorage.getAsync(STORAGE_KEY);
if (!id) return null;
const node = figma.getNodeById(id);
if (node && node.type === 'FRAME') return node;
return null;
}


function hexToRgb(hex: string): RGB {
const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
if (!m) return { r: 1, g: 1, b: 1 };
const r = parseInt(m[1], 16) / 255;
const g = parseInt(m[2], 16) / 255;
const b = parseInt(m[3], 16) / 255;
return { r, g, b };
}
