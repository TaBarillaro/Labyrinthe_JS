// stocker les données de json labyrinthes
let labyrinthes = [];

// fonction pour charger les données du fichier JSON
function loadLabyrinthes() {
    fetch('labyrinthes.json')
        .then(response => response.json())
        .then(data => {
            labyrinthes = data;
            console.log('Labyrinthes chargés :', labyrinthes);
        })
        .catch(error => console.error('Erreur lors du chargement des labyrinthes :', error));
}
// appeler la fonction pour charger les données au démarrage
loadLabyrinthes();