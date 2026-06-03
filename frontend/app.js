const NODE_W = 160, NODE_H = 75, LEAF_W = 110, LEAF_H = 50;
const H_GAP = 50, V_GAP = 95;

// FUNCIÓN PRINCIPAL: Conecta con Java y calcula el centrado respecto al contenedor
async function cargarArbol() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/tree');
        if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");
        const dataJson = await respuesta.json();

        const container = document.getElementById('canvas-container');
        const containerW = Math.max(1050, container.clientWidth);

        // 1. Calcular el ancho estructural del árbol partiendo desde 0
        const totalTreeWidth = layoutTree(dataJson, 0, 0);

        // 2. Centrar todo el bloque en la pantalla
        const startX = (containerW - totalTreeWidth) / 2;
        layoutTree(dataJson, startX, 30);

        // 3. Renderizar el árbol con líneas estructurales perfectas
        renderTree(dataJson, containerW);
    } catch (error) {
        alert("No se pudo conectar con el servidor Java. Verifica que esté corriendo en el puerto 8080.");
    }
}

// POSICIONAMIENTO MATEMÁTICO CORREGIDO: Fuerza la alineación de rejilla para 3 hijos
function layoutTree(node, x, y) {
    if (node.type === 'leaf') {
        node._x = x;
        node._y = y;
        return LEAF_W;
    }

    const keys = Object.keys(node.children);
    const childWidths = [];
    let totalChildrenW = 0;

    // Medir cuánto espacio requiere cada hijo originalmente
    keys.forEach((key) => {
        const w = layoutTree(node.children[key], 0, y + NODE_H + V_GAP);
        childWidths.push(w);
        totalChildrenW += w;
    });
    totalChildrenW += H_GAP * (keys.length - 1);

    const myW = Math.max(NODE_W, totalChildrenW);
    let cx = x + (myW - totalChildrenW) / 2;
    const childCenters = [];

    // Ubicar los hijos en la escena
    keys.forEach((key, i) => {
        const child = node.children[key];
        let childW = childWidths[i];

        // CONTROL DE REJILLA CUADRADA: Si son 3 hijos (Alto, Medio, Bajo), 
        // les asignamos celdas simétricas idénticas para que no se desplace el bloque.
        if (keys.length === 3) {
            childW = Math.max(NODE_W, childWidths[1]) + 40;
        }

        const actualW = child.type === 'leaf' ? LEAF_W : NODE_W;

        child._x = cx + (childW - actualW) / 2;
        child._y = y + NODE_H + V_GAP;
        childCenters.push(child._x + actualW / 2);

        cx += childW + (keys.length === 3 ? 20 : H_GAP);
    });

    // ALINEACIÓN RECTA ABSOLUTA (Garantiza que el padre quede arriba de sus hijos directos)
    if (childCenters.length > 0) {
        if (childCenters.length === 3) {
            // El nodo "Ingreso" se acopla al 100% en el eje del hijo "Medio"
            node._x = childCenters[1] - NODE_W / 2;
        } else {
            node._x = ((childCenters[0] + childCenters[childCenters.length - 1]) / 2) - NODE_W / 2;
        }
    } else {
        node._x = x + (myW - NODE_W) / 2;
    }

    node._y = y;
    return myW;
}

// GENERADOR DE ELEMENTOS VISUALES CON LÍNEAS RECTAS EN 90 GRADOS (Estilo Weka/Organigrama)
function generateSVG(node, els = [], edges = []) {
    if (node.type === 'leaf') {
        const isSi = node.label.toLowerCase() === 'si';
        const color = isSi ? '#4af79a' : '#f74a6a';
        const bg = isSi ? '#143022' : '#30141c';
        els.push(`
            <g>
                <rect x="${node._x}" y="${node._y}" width="${LEAF_W}" height="${LEAF_H}" rx="8" fill="${bg}" stroke="${color}" stroke-width="2"/>
                <text x="${node._x + LEAF_W / 2}" y="${node._y + 24}" text-anchor="middle" fill="${color}" font-weight="bold" font-size="13">Préstamo: ${node.label.toUpperCase()}</text>
                <text x="${node._x + LEAF_W / 2}" y="${node._y + 40}" text-anchor="middle" fill="#6c6c8c" font-size="10">n = ${node.count}</text>
            </g>
        `);
    } else {
        els.push(`
            <g>
                <rect x="${node._x}" y="${node._y}" width="${NODE_W}" height="${NODE_H}" rx="6" fill="#1e1e2e" stroke="#3a3a5c" stroke-width="1.5"/>
                <text x="${node._x + NODE_W / 2}" y="${node._y + 22}" text-anchor="middle" fill="#e8e8f0" font-weight="bold" font-size="13">${node.attr}</text>
                <text x="${node._x + NODE_W / 2}" y="${node._y + 42}" text-anchor="middle" fill="#7c6af7" font-size="11">H = ${node.entropy.toFixed(4)}</text>
                <text x="${node._x + NODE_W / 2}" y="${node._y + 58}" text-anchor="middle" fill="#6af7c8" font-size="11">IG = ${node.gain.toFixed(4)}</text>
            </g>
        `);

        Object.entries(node.children).forEach(([value, child]) => {
            const startX = node._x + NODE_W / 2;
            const startY = node._y + NODE_H;
            const childW = child.type === 'leaf' ? LEAF_W : NODE_W;
            const endX = child._x + childW / 2;
            const endY = child._y;

            // Riel de quiebre común para las escuadras
            const splitY = startY + 25;

            edges.push(`
                <path d="M${startX},${startY} L${startX},${splitY} L${endX},${splitY} L${endX},${endY}" stroke="#3a3a5c" stroke-width="2" fill="none" stroke-linejoin="round"/>
                
                <g>
                    <rect x="${endX - 32}" y="${splitY + 15}" width="64" height="16" rx="4" fill="#11111b"/>
                    <text x="${endX}" y="${splitY + 27}" text-anchor="middle" fill="#8c8ca8" font-size="10" font-weight="bold">${value}</text>
                </g>
            `);
            generateSVG(child, els, edges);
        });
    }
    return { els, edges };
}

// PINTAR EN PANTALLA
function renderTree(tree, canvasWidth) {
    const { els, edges } = generateSVG(tree);

    const svgHTML = `
        <svg width="${canvasWidth}" height="650" xmlns="http://www.w3.org/2000/svg" style="font-family: monospace; padding: 20px;">
            ${edges.join('\n')}
            ${els.join('\n')}
        </svg>
    `;
    document.getElementById('canvas-container').innerHTML = svgHTML;
}