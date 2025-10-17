// Fonction buildLabyrinthFromJson labyrinthe dynamique à partir du JSON
function buildLabyrinthFromJson(json, sizeKey = "3", exampleKey = "ex-0") {
    const cells = json[sizeKey][exampleKey];
    
    // je déterminer la taille du labyrinthe
    let lab = {
        size: parseInt(sizeKey),
        cells: {},
        start: null,
        end: null
    };
    console.table(lab.cells);

    // Pour chaque cellule je crée une div avec la classe "cell"
    cells.forEach((cell) => {
        const { posX, posY, walls, entrance, exit } = cell;
        const cellKey = `${posX}-${posY}`;

        lab.cells[cellKey] = {
            posX: Number(posX),
            posY: Number(posY),
            walls: walls,
            entrance: entrance,
            exit: exit
        };

        if (entrance) {
            lab.start = { x: Number(posX), y: Number(posY) };
        }
        if (exit) {
            lab.end = { x: Number(posX), y: Number(posY) };
        }
        
    });
    return lab;
}

function renderLabyrinth(lab) {
    const gridContainer = document.querySelector('.grid');
    gridContainer.innerHTML = '';
    gridContainer.classList.add('grid');

    for (const key in lab.cells) {
        const cell = lab.cells[key];
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.id = `cell-${cell.posX}-${cell.posY}`;

        // Ajouter les classes de murs
        if (cell.walls[0]) cellDiv.classList.add('wall-top');
        if (cell.walls[1]) cellDiv.classList.add('wall-right');
        if (cell.walls[2]) cellDiv.classList.add('wall-bottom');
        if (cell.walls[3]) cellDiv.classList.add('wall-left');
        // Si "entrance" est true
        if (cell.entrance) {
            // j'ajoute la classe "start" et j'y insére le joueur
            cellDiv.classList.add('start');
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');
            cellDiv.appendChild(playerDiv);
            console.log("entrée du joueur en :" + cell.posX + "-" + cell.posY);
        }
        // Si "exit" est true
        if (cell.exit) {
            // j'ajoute la classe "end"
            cellDiv.classList.add('end');
            console.log("sortie en :" + cell.posX + "-" + cell.posY);
        }
        // Ajouter chaque cellule au conteneur ".grid"
        gridContainer.appendChild(cellDiv);
    }
}

// Initialisation du labyrinthe au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Construire le labyrinthe de la dimension qu'on veut
    let lab = buildLabyrinthFromJson(labyrinthes, "3", "ex-0");
    renderLabyrinth(lab);
    document.getElementById('solveDFS').onclick = () => autoSolveLabyrinth(lab);
});

// Gérer le déplacement du joueur avec les flèches
// Ajouter un addEeventListener sur "keydown"
// document.addEventListener('keydown', (event) => {
//     console.log(" touche pressée : " + event.key);
//     const player = document.querySelector('.player');
//     if (!player) return; 
//     console.log(player);
// // Identifier la cellule actuelle du joueur et sa position (posX, posY)
//     const currentCell = player.parentElement;
// //  Calculer la cellule cible selon la flèche pressée
// const [_, row, col] = currentCell.id.split('-').map(Number);
// // Vérifier que la cellule cible existe
//     let targetRow = row;
//     let targetCol = col;

//     switch(event.key) {
//         case 'ArrowUp':
//             targetRow--;
//             break;
//         case 'ArrowDown':
//             targetRow++;
//             break;
//         case 'ArrowLeft':
//             targetCol--;
//             break;
//         case 'ArrowRight':
//             targetCol++;
//             break;
//         default:
//             return; // quitter si ce n'est pas une touche fléchée
//     }
//     const targetCell = document.getElementById(`cell-${targetRow}-${targetCol}`);
//     if (!targetCell) {return}; // cellule cible hors de la grille

// // Vérifier les murs:
// // Si le mur dans la direction souhaitée est présent
//     if ((event.key === 'ArrowUp' && (currentCell.classList.contains('wall-top') || targetCell.classList.contains('wall-bottom'))) ||
//         (event.key === 'ArrowDown' && (currentCell.classList.contains('wall-bottom') || targetCell.classList.contains('wall-top'))) ||
//         (event.key === 'ArrowLeft' && (currentCell.classList.contains('wall-left') || targetCell.classList.contains('wall-right'))) ||
//         (event.key === 'ArrowRight' && (currentCell.classList.contains('wall-right') || targetCell.classList.contains('wall-left')))) {
//         // je bloque le mouvement
//         return; 
//     }
// // Sinon je déplace le joueur
//     targetCell.appendChild(player);
// // Si la nouvelle cellule est la sortie (classe "end"), afficher un message de victoire
//     if (targetCell.classList.contains('end')) {
//         console.log('Félicitations! Vous avez atteint la fin du labyrinthe');
//     }
// });

function getNeighbors(lab, cellKey) {
    const neighbors = [];
    const [x, y] = cellKey.split('-').map(Number);
    const directions = [
        { dx: -1, dy: 0, wallIndex: 0 }, // up
        { dx: 0, dy: 1, wallIndex: 1 },  // right
        { dx: 1, dy: 0, wallIndex: 2 },  // down
        { dx: 0, dy: -1, wallIndex: 3 }  // left
    ];
    for (const dir of directions) {
        const neighborX = x + dir.dx;
        const neighborY = y + dir.dy;
        const neighborKey = `${neighborX}-${neighborY}`;
        if (!lab.cells[neighborKey]) continue; 
        const currentCell = lab.cells[cellKey];
        const neighborCell = lab.cells[neighborKey];

        if (!neighborCell) continue;

        // Vérifie l'absence de murs dans les deux cellules (dans la direction correspondante)
        const hasWallHere = currentCell.walls[dir.wallIndex];
        const hasWallThere = neighborCell.walls[(dir.wallIndex + 2) % 4]; // direction opposée

        if (!hasWallHere && !hasWallThere) {
            neighbors.push(neighborKey);
        }
    }
    return neighbors;
}

// DFS version itérative 
function autoSolveLabyrinth(lab) {
    const startKey = `${lab.start.x}-${lab.start.y}`;
    const endKey = `${lab.end.x}-${lab.end.y}`;
    const visited = new Set();
    const parent = {};
    let found = false;
    const stack = [startKey];
    visited.add(startKey);

    while (stack.length > 0) {
        const currentKey = stack.pop();
        if (currentKey === endKey) {
           found = true;
           break;
        }
        const neighbors = getNeighbors(lab, currentKey);
        for (const neighborKey of neighbors) {
            if (visited.has(neighborKey)) {
                console.log(`Voisin déjà visité ${neighborKey}`);
                continue;
            }
            visited.add(neighborKey);
            parent[neighborKey] = currentKey;
            stack.push(neighborKey);
            console.log(`On pousse ${currentKey} depuis ${neighborKey}`);
        }
    }
    if (!found) {
        console.log("No path found");
        return;
    }
    // Reconstruct path
    const path = [];
    let current = endKey;
    while (current !== startKey) {
        const [x, y] = current.split('-').map(Number);
        path.push({ x, y });
        current = parent[current];
    }
    path.push(lab.start);
    path.reverse();
    console.log("Chemin trouvé :", path);
    animatePath(path);
}

// Fonction pour animer le déplacement du joueur le long du chemin trouvé
async function animatePath(path, delay = 300) {
    const player = document.querySelector('.player');
    for (let i = 1; i < path.length; i++) {
        console.warn("Chemin trop court ou vide");
        const step = path[i];
        const targetCell = document.getElementById(`cell-${step.x}-${step.y}`);
        if (!targetCell) continue;
        await new Promise(resolve => setTimeout(resolve, delay));
        targetCell.appendChild(player);
    }
}