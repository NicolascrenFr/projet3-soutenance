  // Fonction pour récupérer et afficher les projets
  async function getWorks(categoryId = null) {
	const url = "http://localhost:5678/api/works";
	try {
	  const response = await fetch(url);
  
	  if (!response.ok) {
		throw new Error(`Erreur lors de la récupération des projets : ${response.status}`);
	  }
  
	  const works = await response.json();
	  // console.log("Projets récupérés :", works);
  
	  // Filtrer les projets si une catégorie est sélectionnée
	  const filteredWorks = categoryId
		? works.filter((work) => work.categoryId === categoryId)
		: works;
  
	  // Nettoyer la galerie avant d'ajouter les nouveaux éléments
	  const gallery = document.querySelector(".gallery");
	  gallery.innerHTML = "";
  
	  // Ajouter les projets dans la galerie
	  filteredWorks.forEach((work) => setFigure(work));
	} catch (error) {
	  console.error("Erreur lors de la récupération des projets :", error.message);
	}
  }
  
  // Fonction pour gérer l'état actif des filtres
  function setActiveFilter(selectedFilter) {
	// Retirer la classe 'active' de tous les filtres
	const filters = document.querySelectorAll(".filter");
	filters.forEach((filter) => filter.classList.remove("active"));
  
	// Ajouter la classe 'active' au filtre sélectionné
	selectedFilter.classList.add("active");
  }
  
  // Charger les filtres et les projets au chargement de la page
  document.addEventListener("DOMContentLoaded", () => {
	getCategories(); // Charger les catégories et les filtres
	getWorks(); // Charger tous les projets
  });
  
  async function getCategories() {
	const url = "http://localhost:5678/api/categories"; // API pour les catégories
	try {
	  const response = await fetch(url);
  
	  if (!response.ok) {
		throw new Error(`Erreur lors de la récupération des catégories : ${response.status}`);
	  }
  
	  const categories = await response.json();
	  console.log("Catégories récupérées :", categories);
  
	  // Conteneur pour les filtres
	  const filterContainer = document.querySelector(".div-container");
  
	  // Supprimer les filtres existants pour éviter les doublons
	  filterContainer.innerHTML = "";
  
	  // Ajouter le filtre "Tous" avec la classe active par défaut
	  const allFilter = document.createElement("div");
	  allFilter.classList.add("filter", "active"); // "Tous" est actif par défaut
	  allFilter.textContent = "Tous";
	  allFilter.addEventListener("click", () => {
		getWorks(); // Affiche tous les projets
		setActiveFilter(allFilter); // Définit "Tous" comme actif
	  });
	  filterContainer.append(allFilter);
  
	  // Ajouter les autres catégories dynamiquement
	  categories.forEach((category) => {
		const filter = document.createElement("div");
		filter.classList.add("filter");
		filter.textContent = category.name; // Nom de la catégorie
		filter.addEventListener("click", () => {
		  getWorks(category.id); // Filtrer par catégorie
		  setActiveFilter(filter); // Définit la catégorie sélectionnée comme active
		});
		filterContainer.append(filter);
	  });
	} catch (error) {
	  console.error("Erreur lors de la récupération des catégories :", error.message);
	}
  }
    
// Fonction pour réinitialiser le formulaire de la modal 2
function resetModal2Form() {
    // Réinitialiser le champ de fichier
    const fileInput = document.getElementById("photo-file");
    fileInput.value = "";

    // Réinitialiser le champ de titre
    const titleInput = document.getElementById("photo-title");
    titleInput.value = "";

    // Réinitialiser le menu déroulant des catégories
    const categorySelect = document.getElementById("photo-categorie");
    categorySelect.value = ""; // Réinitialiser à l'option vide

    // Réinitialiser l'aperçu de l'image
    const previewContainer = document.querySelector(".file-upload-container");
    const oldPreview = previewContainer.querySelector(".image-preview");
    if (oldPreview) {
        oldPreview.remove();
    }
    previewContainer.querySelector(".image-bouton").style.display = "block";
    previewContainer.querySelector(".js-add-photo-file").style.display = "block";
    previewContainer.querySelector("p").style.display = "block";

     // Réinitialiser le bouton "Ajouter"
     const addFileButton = document.querySelector(".add-file");
     addFileButton.style.backgroundColor = "#B3B3B3"; // Couleur grise
     addFileButton.disabled = true; // Désactiver le bouton
}

// Réinitialiser le formulaire lorsque la modal 2 est ouverte
const addPhotoButton = document.querySelector(".add-photo");
addPhotoButton.addEventListener("click", () => {
    resetModal2Form(); // Réinitialiser le formulaire de la modal 2
    checkFields(); // Vérifier les champs pour mettre à jour l'état du bouton
});

// Écouteur d'événement pour le changement de fichier
document.getElementById("photo-file").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewContainer = document.querySelector(".file-upload-container");

            // Supprimer les anciens aperçus (si nécessaire)
            const oldPreview = previewContainer.querySelector(".image-preview");
            if (oldPreview) {
                oldPreview.remove();
            }

            // Masquer les autres éléments dans le conteneur
            previewContainer.querySelector(".image-bouton").style.display = "none";
            previewContainer.querySelector(".js-add-photo-file").style.display = "none";
            previewContainer.querySelector("p").style.display = "none";

            // Ajouter l'aperçu de l'image
            const imgPreview = document.createElement("img");
            imgPreview.src = e.target.result;
            imgPreview.alt = "Aperçu de la photo";
            imgPreview.classList.add("image-preview");
            previewContainer.appendChild(imgPreview);
        };
        reader.readAsDataURL(file);
    }
});