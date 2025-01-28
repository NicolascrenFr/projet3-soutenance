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

/// Fonction pour ajouter une figure dans la galerie
function setFigure(data) {
    const gallery = document.querySelector(".gallery");
    const galleryModal = document.querySelector(".gallery-modal");
  
    // Crée la figure principale pour la galerie
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.title}">
      <figcaption>${data.title}</figcaption>
    `;
  
    // Ajoute la figure principale à la galerie
    gallery.appendChild(figure);
  
    // Crée une figure distincte pour la galerie modale avec l'icône directement dans innerHTML
  const figureClone = document.createElement("figure");
  figureClone.id = `work-${data.id}`; // Ajout de l'ID unique
  figureClone.innerHTML = `<div class="image-container">
    <img src="${data.imageUrl}" alt="${data.title}">
    <i class="fa-solid fa-trash-can overlay-icon" data-work-id="${data.id}"></i>
  </div>`;
  
  
    // Ajoute la figure clone à la galerie modale
    galleryModal.appendChild(figureClone);
  
    // Retourner les deux éléments pour des modifications indépendantes
    return { figure, figureClone };
  }

  document.addEventListener("DOMContentLoaded", () => {
    //   const modal1 = document.getElementById("modal1");
      const modal2 = document.getElementById("modal2");
      const addPhotoButton = document.querySelector(".add-photo");
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
    const isFileFilled = photoInput.files.length > 0; // Vérifie si un fichier est sélectionné
    const isTitleFilled = titleInput.value.trim() !== ""; // Vérifie si le titre est rempli
    const isCategorySelected = categorySelect.value !== ""; // Vérifie si une catégorie est sélectionnée

    if (isFileFilled && isTitleFilled && isCategorySelected) {
      addFile.style.backgroundColor = "#1D6154"; // Bouton vert
      addFile.disabled = false; // Active le bouton
    } else {
      addFile.style.backgroundColor = "#B3B3B3"; // Bouton gris
      addFile.disabled = true; // Désactive le bouton
    }
  }

  // Écouteurs d'événements pour surveiller les changements
  photoInput.addEventListener("change", checkFields);
  titleInput.addEventListener("input", checkFields);
  categorySelect.addEventListener("change", checkFields);

  // Initialisation au chargement de la page
  checkFields();
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
    
          // Fermer la modal 2
          closeModal(modal2);
          openModal(modal1); // Retourner à la première modal si nécessaire
        } catch (error) {
          console.error("Erreur lors de l'envoi de la photo :", error);
        }
      }
    
    //   // Ouvrir la seconde modal et charger les catégories
    //     addPhotoButton.addEventListener("click", () => {
    //     closeModal(modal1); // Fermer la première modal
    //     openModal(modal2);  // Ouvrir la seconde modal
  
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
  
    
    //   // Revenir à la première modal
    //   returnButton.addEventListener("click", () => {
    //     closeModal(modal2);
    //     openModal(modal1);
    //   });
    
    //   // Fermer les modals au clic sur les boutons de fermeture
    //   closeModalButtons.forEach((button) => {
    //     button.addEventListener("click", () => {
    //       closeModal(modal1);
    //       closeModal(modal2);
    //     });
    //   }

    
    //   // Gestion de l'envoi du formulaire pour ajouter une photo
    //   photoForm.addEventListener("submit", submitPhoto);
    // ;
    


    document.addEventListener("DOMContentLoaded", () => {
        // Sélection des éléments HTML
        const modal1 = document.getElementById("modal1");
        const modal2 = document.getElementById("modal2");
        const addPhotoButton = document.querySelector(".add-photo");
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
      
        // Ouvrir la seconde modale au clic sur "Ajouter une photo"
        addPhotoButton.addEventListener("click", () => {
          closeModal(modal1); // Fermer la première modale
          openModal(modal2);  // Ouvrir la seconde modale
        });
      
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

         // Revenir à la première modal
      returnButton.addEventListener("click", () => {
        closeModal(modal2);
        openModal(modal1);
      });

       // Fermer les modals au clic sur les boutons de fermeture
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

      function displayAdminMode() {
        const editButton = document.querySelector(".js-modal-trigger"); // Bouton "modifier"
        const loginButton = document.querySelector(".login"); // Bouton "login/logout"
      
        if (isUserLoggedIn()) {
          // Mode admin : utilisateur connecté
          editButton.style.display = "inline-block"; // Afficher le bouton "Modifier"
      
          // Ajouter une bannière "Mode édition"
          const editBanner = document.createElement("div");
          editBanner.className = "edit-banner";
          editBanner.style.cssText =
            "position: fixed; top: 0; left: 0; width: 100%; background: black; color: white; text-align: center; padding: 10px; z-index: 1000;";
          editBanner.innerHTML =
            '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';
          document.body.prepend(editBanner);
      
          // Modifier le bouton en "Logout"
          loginButton.textContent = "logout";
      
          // Gestionnaire pour la déconnexion
          loginButton.addEventListener("click", () => {
            sessionStorage.removeItem("authToken"); // Supprime le token
            window.location.reload(); // Recharge la page
          });
        } else {
          // Mode visiteur : utilisateur non connecté
          editButton.style.display = "none"; // Masquer le bouton "Modifier"
          loginButton.textContent = "login";
      
          // Gestionnaire pour la connexion
          loginButton.addEventListener("click", () => {
            window.location.href = "login.html"; // Redirige vers la page de login
          });
        }
      }
      
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
      const figureToRemoveGallery = Array.from(gallery.querySelectorAll("figure"))
        .find(figure => figure.querySelector(`img[src*="${workId}"]`));
      if (figureToRemoveGallery) {
        figureToRemoveGallery.remove();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élément :", error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.add-file');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('add-file');

            // Envoyer une requête DELETE au serveur
            fetch(`delete_project.php?id=${projectId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Supprimer le projet du DOM
                        const projectElement = document.getElementById(`project-${projectId}`);
                        projectElement.remove();
                    } else {
                        alert('Erreur : ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression :', error);
                });
        });
    });
});

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
  