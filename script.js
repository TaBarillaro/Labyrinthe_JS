// Pseudo code pour labyrinthe dynamique à partir du JSON
// Fonction buildLabyrinthFromJson(json, sizeKey, exampleKey):
function buildLabyrinthFromJson(json, sizeKey = "3", exampleKey = "ex-0") {
    const cells = json[sizeKey][exampleKey];
    // je sélectionne le conteneur ".grid"
    const gridContainer = document.querySelector('.grid');
    // je vide le contenu existant
    gridContainer.innerHTML = ''; // vider le contenu existant

// Déterminer la taille du labyrinthe (par ex. sizeKey = "3" = 3x3)
    const size = parseInt(sizeKey);
// Définir le nombre de colonnes et lignes dans le style CSS
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, 100px)`;
// Parcourir chaque cellule
// Créer une div avec la classe "cell"
    cells.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.id = `cell-${cell.posX}-${cell.posY}`; // ID pour chaque cellule
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
        }
        // Si "exit" est true
        if (cell.exit) {
            // j'ajoute la classe "end"
            cellDiv.classList.add('end');
        }
        // Ajouter chaque cellule au conteneur ".grid"
        gridContainer.appendChild(cellDiv);
    });
}

// Initialisation du labyrinthe au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Construire le labyrinthe de la dimension qu'on veut
    buildLabyrinthFromJson(labyrinthes, "6", "ex-0");
});

// Gérer le déplacement du joueur avec les flèches
// Ajouter un addEeventListener sur "keydown"
document.addEventListener('keydown', (event) => {
    console.log(" touche pressée : " + event.key);
    const player = document.querySelector('.player');
    if (!player) return; // Si le joueur n'existe pas, sortir
// Identifier la cellule actuelle du joueur et sa position (posX, posY)
    const currentCell = player.parentElement;
//  Calculer la cellule cible selon la flèche pressée
const [_, row, col] = currentCell.id.split('-').map(Number);
// Vérifier que la cellule cible existe
    let targetRow = row;
    let targetCol = col;

    switch(event.key) {
        case 'ArrowUp':
            targetRow--;
            break;
        case 'ArrowDown':
            targetRow++;
            break;
        case 'ArrowLeft':
            targetCol--;
            break;
        case 'ArrowRight':
            targetCol++;
            break;
        default:
            return; // quitter si ce n'est pas une touche fléchée
    }
    const targetCell = document.getElementById(`cell-${targetRow}-${targetCol}`);
    if (!targetCell) {return}; // cellule cible hors de la grille

// Vérifier les murs:
// Si le mur dans la direction souhaitée est présent
    if ((event.key === 'ArrowUp' && (currentCell.classList.contains('wall-top') || targetCell.classList.contains('wall-bottom'))) ||
        (event.key === 'ArrowDown' && (currentCell.classList.contains('wall-bottom') || targetCell.classList.contains('wall-top'))) ||
        (event.key === 'ArrowLeft' && (currentCell.classList.contains('wall-left') || targetCell.classList.contains('wall-right'))) ||
        (event.key === 'ArrowRight' && (currentCell.classList.contains('wall-right') || targetCell.classList.contains('wall-left')))) {
        // je bloque le mouvement
        return; 
    }
// Sinon je déplace le joueur
    targetCell.appendChild(player);
// Si la nouvelle cellule est la sortie (classe "end"), afficher un message de victoire
    if (targetCell.classList.contains('end')) {
        console.log('Félicitations! Vous avez atteint la fin du labyrinthe');
    }
});

