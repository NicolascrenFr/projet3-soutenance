// Gestion de l'aperçu de l'image dans la modale 2
const fileInput = document.getElementById('photo-file');
const previewImage = document.getElementById('preview-image');

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    
    if (file) {
        // Vérifie si le fichier est bien une image
        const fileReader = new FileReader();

        fileReader.onload = function (e) {
            // Affiche l'image dans l'aperçu
            previewImage.src = e.target.result;
            previewImage.style.display = 'block'; // Rendre visible l'aperçu
        };

        fileReader.readAsDataURL(file); // Lit le fichier et génère un lien DataURL
    } else {
        // Si aucun fichier sélectionné, cacher l'aperçu
        previewImage.style.display = 'none';
        previewImage.src = '#';
    }
});

function setFigure(data) {
  const gallery = document.querySelector(".gallery");
  const galleryModal = document.querySelector(".gallery-modal");

  // Crée la figure principale pour la galerie
  const figure = document.createElement("figure");
  figure.setAttribute("data-work-id", data.id); // Ajouter un attribut unique
  figure.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.title}">
      <figcaption>${data.title}</figcaption>
  `;

  // Ajoute la figure principale à la galerie
  gallery.appendChild(figure);

  // Crée une figure distincte pour la galerie modale avec l'icône de suppression
  const figureClone = document.createElement("figure");
  figureClone.id = `work-${data.id}`; // Ajout de l'ID unique
  figureClone.innerHTML = `
      <div class="image-container">
          <img src="${data.imageUrl}" alt="${data.title}">
          <i class="fa-solid fa-trash-can overlay-icon" data-work-id="${data.id}"></i>
      </div>
  `;

  // Ajoute la figure clone à la galerie modale
  galleryModal.appendChild(figureClone);

  // Retourner les deux éléments pour des modifications indépendantes
  return { figure, figureClone };
}
  
  document.addEventListener("DOMContentLoaded", () => {
    //   const modal1 = document.getElementById("modal1");
      const modal2 = document.getElementById("modal2");
      const returnButton = document.querySelector(".js-modal-return");
      const closeModalButtons = document.querySelectorAll(".js-modal-close");
      const categorySelect = document.getElementById("photo-categorie");
      const photoForm = document.getElementById("add-photo-form");
      const photoInput = document.getElementById("photo-file");
      const titleInput = document.getElementById("photo-title");
      const addFile = document.querySelector(".add-file");

      // Gestion de l'envoi du formulaire pour ajouter une photo
      photoForm.addEventListener("submit", submitPhoto);
    ;

    //   // Fonction pour ouvrir une modal
      function openModal(modal) {
        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
      }
    
    //   // Fonction pour fermer une modal
      function closeModal(modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
      }
    
    // Ouvrir la seconde modal et charger les catégories
    addPhotoButton.addEventListener("click", () => {
    closeModal(modal1); // Fermer la première modal
    openModal(modal2);  // Ouvrir la seconde modal

    // Fonction pour vérifier si tous les champs sont remplis
    function checkFields() {
        const isFileFilled = fileInput.files.length > 0;
        const isTitleFilled = document.getElementById('photo-title').value.trim() !== "";
        const isCategorySelected = document.getElementById('photo-categorie').value !== "";
    
        const addFileButton = document.querySelector(".add-file");
        if (isFileFilled && isTitleFilled && isCategorySelected) {
            addFileButton.style.backgroundColor = "#1D6154"; // Bouton vert
            addFileButton.disabled = false; // Activer le bouton
        } else {
            addFileButton.style.backgroundColor = "#B3B3B3"; // Bouton gris
            addFileButton.disabled = true; // Désactiver le bouton
        }
    }
    
    // Écouteurs pour vérifier les champs
    fileInput.addEventListener("change", checkFields);
    document.getElementById('photo-title').addEventListener("input", checkFields);
    document.getElementById('photo-categorie').addEventListener("change", checkFields);
// Charger les projets au démarrage
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    checkFields();
});
});
    
      // Fonction pour charger les catégories depuis l'API
      async function loadCategories() {
        try {
          const response = await fetch("http://localhost:5678/api/categories");
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des catégories");
          }
          const categories = await response.json();
    
          // Effacer les options existantes
          categorySelect.innerHTML = "";

          // Ajouter les nouvelles catégories
          categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des catégories :", error);
        }
      }
    
      // Fonction pour envoyer une photo via l'API
      async function submitPhoto(event) {
        event.preventDefault();
    
        const token = sessionStorage.getItem("authToken"); // Récupérer le token d'authentification
      if (!token) {
        console.error("Utilisateur non authentifié");
        return;
      }
    
        const formData = new FormData();
        formData.append("image", photoInput.files[0]); // Fichier de la photo
        formData.append("title", titleInput.value); // Titre de la photo
        formData.append("category", categorySelect.value); // Catégorie sélectionnée
    
        try {
          const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
              "Authorization": `Bearer ${token}`, // Ajouter le token dans le header
              "Accept": "application/json"
          },
          });
    
          if (!response.ok) {
            throw new Error("Erreur lors de l'envoi de la photo");
          }
    
          const result = await response.json();
          console.log("Photo envoyée avec succès :", result);
    
          // Réinitialiser le formulaire après succès
          photoForm.reset();

        // Ajouter le nouveau projet à la galerie principale et à la modal 1
        setFigure(result);

        // Réinitialiser le formulaire
        document.getElementById('add-photo-form').reset();
        previewImage.style.display = 'none';
        previewImage.src = '#';
    
          // Fermer la modal 2
          closeModal(modal2);
          openModal(modal1); // Retourner à la première modal si nécessaire
        } catch (error) {
          console.error("Erreur lors de l'envoi de la photo :", error);
        }
      }
    
    loadCategories().then(() => {
      // Ajouter une option vide si elle n'existe pas déjà
      if (!categorySelect.querySelector('option[value=""]')) {
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.disabled = true; // Désactiver pour forcer un choix actif
        emptyOption.selected = true; // La définir comme sélectionnée par défaut
        categorySelect.prepend(emptyOption);
      }
  
      // Forcer la sélection de l'option vide
      categorySelect.value = "";
    });
  });
  
    document.addEventListener("DOMContentLoaded", () => {
        // Sélection des éléments HTML
        const modal1 = document.getElementById("modal1");
        const modal2 = document.getElementById("modal2");
        // const addPhotoButton = document.querySelector(".add-photo");
        const returnButton = document.querySelector(".js-modal-return");
        const closeModalButtons = document.querySelectorAll(".js-modal-close");
      
        // Fonction pour ouvrir une modale
        function openModal(modal) {
          modal.style.display = "block";
          modal.setAttribute("aria-hidden", "false");
        }
      
        // Fonction pour fermer une modale
        function closeModal(modal) {
          modal.style.display = "none";
          modal.setAttribute("aria-hidden", "true");
        }
      
        // Revenir à la première modale au clic sur le bouton de retour
        returnButton.addEventListener("click", () => {
          closeModal(modal2); // Fermer la seconde modale
          openModal(modal1);  // Ouvrir la première modale
        });
      
        // Fermer les modales au clic sur les boutons de fermeture
        closeModalButtons.forEach((button) => {
          button.addEventListener("click", () => {
            closeModal(modal1);
            closeModal(modal2);
          });
        });
      
        // Fermer les modales au clic en dehors de leur contenu
        document.querySelectorAll(".modal").forEach((modal) => {
          modal.addEventListener("click", (event) => {
            // Si le clic est directement sur la modale mais pas dans .modal-wrapper (contenu)
            if (event.target === modal) {
              closeModal(modal);
            }
          });
        });
      });
      
      // Gérer les actions nécessitant une connexion
      function protectAdminActions() {
        const editButton = document.querySelector(".js-modal-trigger"); // Bouton "modifier"
        editButton.addEventListener("click", (e) => {
          if (!isUserLoggedIn()) {
            e.preventDefault(); // Bloque l'action si non connecté
            alert("Vous devez être connecté pour modifier.");
            window.location.href = "login.html"; // Redirige vers la page de login
          }
        });
      }

// Appel des fonctions au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    displayAdminMode();
    protectAdminActions();
  });
  
  // Appel de la fonction
  displayAdminMode();

  async function deleteWork(workId) {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
        console.error("Utilisateur non authentifié");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'élément");
        }

        console.log(`Élément ${workId} supprimé avec succès`);

        // Supprimer la figure de la galerie modale
        const figureToRemoveModal = document.querySelector(`#work-${workId}`);
        if (figureToRemoveModal) {
            figureToRemoveModal.remove();
        }

        // Supprimer la figure correspondante de la galerie principale
        const gallery = document.querySelector(".gallery");
        const figureToRemoveGallery = gallery.querySelector(`figure[data-work-id="${workId}"]`);
        if (figureToRemoveGallery) {
            figureToRemoveGallery.remove();
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'élément :", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
        const galleryModal = document.querySelector(".gallery-modal");
      
        // Écouter les clics dans la galerie modale
        galleryModal.addEventListener("click", (event) => {
          const icon = event.target;
      
          // Vérifiez si l'élément cliqué est une icône de poubelle
          if (icon.classList.contains("overlay-icon") && icon.dataset.workId) {
            const workId = icon.dataset.workId; // Récupérer l'ID du travail
      
            if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
              deleteWork(workId); // Appeler la fonction de suppression

               // Supprimer l'élément du DOM
               const photoElement = icon.closest(".photo-container"); // Ajustez le sélecteur selon votre structure HTML
               if (photoElement) {
                   photoElement.remove(); // Supprime l'élément de la page
               }
            }
        }
        });
    });

    document.querySelector('.js-modal-close').addEventListener('click', () => {
        document.querySelector('.modal-wrapper').classList.remove('active'); // Cache la modale
      });
      
        document.querySelector('.js-modal-return').addEventListener('click', () => {
        // Action pour retourner ou fermer
        document.querySelector('.modal-wrapper').classList.remove('active');
      });

  // Fonction pour ajouter des écouteurs d'événements aux icônes de suppression
function addDeleteListeners() {
  const deleteIcons = document.querySelectorAll(".overlay-icon");
  deleteIcons.forEach(icon => {
      icon.addEventListener("click", (event) => {
          const workId = event.target.closest(".overlay-icon").getAttribute("data-work-id");
          if (workId) {
              deleteWork(workId);
          }
      });
  });
}

// Appeler cette fonction après avoir chargé les éléments dans la modal
addDeleteListeners();

// Charger le contenu de la modal
async function loadModalContent() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  const gallery = document.querySelector(".gallery");
  const galleryModal = document.querySelector(".gallery-modal");

  // Vider les galeries avant d'ajouter de nouveaux éléments
  gallery.innerHTML = "";
  galleryModal.innerHTML = "";

  // Ajouter chaque œuvre à la galerie et à la modal
  works.forEach(work => {
    //   setFigure(work);
  });
}