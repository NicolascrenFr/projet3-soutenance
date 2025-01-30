let modal = null;
const focusableSelector= "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

}

const closeModal = function (e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  e.preventDefault();
  modal.setAttribute("aria-hidden", "true"); // l'élément sera masqué//
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  const hideModal = function () {
    modal.style.display = "none"
    modal.removeEventListener("animationend", hideModal)
    modal = null
  }
  modal.addEventListener("animationend", hideModal)
}

const stopPropagation = function (e) {
  e.stopPropagation();
}

const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
  if (e.shiftkey === true) {
    index --;
  } else {
  index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
}

document.querySelectorAll(".js-modal-trigger").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e)
  }
})

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
      loginForm.addEventListener("submit", handleSubmit);
  }
});

async function handleSubmit(event) {
    event.preventDefault();

    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("motDePasse").value,
    };

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (response.status != 200) {
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        document.querySelector("form").prepend(errorBox);
    } else {
    let result = await response.json();
    const token = result.token;
    sessionStorage.setItem("authToken", token);
    window.location.href = "index.html";
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

// Appel des fonctions au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    displayAdminMode();
    protectAdminActions();
    toggleCategoriesVisibility();
  });
  
function isUserLoggedIn() {
	return Boolean(sessionStorage.getItem("authToken")); // Vérifie si un token d'authentification existe
  }
  
  // Pour ne plus voir les catégories quand on est login
  function toggleCategoriesVisibility() {
	const categoriesContainer = document.querySelector(".div-container"); // Sélectionnez le conteneur des catégories
	if (isUserLoggedIn()) {
		categoriesContainer.style.display = "none"; // Masquer les catégories
	} else {
		categoriesContainer.style.display = "flex"; // Afficher les catégories
	}
  }
