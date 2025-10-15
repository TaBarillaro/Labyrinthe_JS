// déplacement du joueur avec les touches fléchées
document.addEventListener('keydown', (event) => {
    const player = document.querySelector('.player');
    const currentCell = player.parentElement;
    const cellId = currentCell.id;
    const currentIndex = parseInt(cellId.replace('cell', ''));
    // initialiser la cellule vers laquelle on veut se déplacer
    let targetIndex = currentIndex;
// définir les mouvements possibles (switch case)
    switch (event.key) {
    // aller à la cellule au-dessus
        case 'ArrowUp':
            targetIndex = currentIndex - 3; // une rangée au-dessus (3 colonnes)
            break;
    // aller à la cellule en dessous
        case 'ArrowDown':
            targetIndex = currentIndex + 3; // une rangée en dessous (3 colonnes)
            break;
    // aller à la cellule à gauche
        case 'ArrowLeft':
            targetIndex = currentIndex - 1; // une colonne à gauche
            break;
    // aller à la cellule à droite
        case 'ArrowRight':
            targetIndex = currentIndex + 1; // une colonne à droite
            break;
        default:
            return; // ignorer les autres touches
    }
    // verifier si la cellule cible est valide
    const targetCell = document.getElementById(`cell${targetIndex}`);
    if (!targetCell) {
        return; // cellule hors de la grille
    }
    // verifier si les murs bloquent le déplacement
    if (event.key === 'ArrowUp') {
        if (currentCell.classList.contains('wall-top') || targetCell.classList.contains('wall-bottom')) {
            return; // mur en haut de la cellule actuelle ou en bas de la cellule cible
        }
    }
    if (event.key === 'ArrowDown') {
        if (currentCell.classList.contains('wall-bottom') || targetCell.classList.contains('wall-top')) {
            return; // mur en bas de la cellule actuelle ou en haut de la cellule cible
        }
    }
    if (event.key === 'ArrowLeft') {
        if (currentCell.classList.contains('wall-left') || targetCell.classList.contains('wall-right')) {
            return; // mur à gauche de la cellule actuelle ou à droite de la cellule cible
        }
    }
    if (event.key === 'ArrowRight') {
        if (currentCell.classList.contains('wall-right') || targetCell.classList.contains('wall-left')) {
            return; // mur à droite de la cellule actuelle ou à gauche de la cellule cible
        }
    }

// déplacer le joueur si la cellule cible est valide
    targetCell.appendChild(player);

// vérifier si le joueur a atteint la cellule de fin
    if (targetCell.classList.contains('end')) {
        console.log('Félicitations ! Vous avez atteint la fin du labyrinthe.');
    }
});

// Pseudo code pour labyrinthe dynamique à partir du JSON

// Fonction buildLabyrinthFromJson(json, sizeKey, exampleKey):
//   je sélectionne le conteneur ".grid"
//   je vide le contenu existant
//   - Déterminer la taille du labyrinthe (par ex. sizeKey = "3" = 3x3)
//   - Définir le nombre de colonnes et lignes dans le style CSS
//   - Parcourir chaque cellule
//        Créer une div avec la classe "cell"
//        Ajouter les classes de murs
//        Si "entrance" est true
//          j'ajoute la classe "start" et j'y insére le joueur
//        Si "exit" est true
//          j'ajoute la classe "end"
//   - Ajouter chaque cellule au conteneur ".grid"

// Gérer le déplacement du joueur avec les flèches

//  Ajouter un addEeventListener sur "keydown"
//  Identifier la cellule actuelle du joueur et sa position (posX, posY)
//  Calculer la cellule cible selon la flèche pressée
//  Vérifier que la cellule cible existe
//  Vérifier les murs:
//      * Si le mur dans la direction souhaitée est présent
//          je bloque le mouvement
//      * Sinon
//          je déplace le joueur
//      * Si la nouvelle cellule est la sortie (classe "end"), afficher un message de victoire


