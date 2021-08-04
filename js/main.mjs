import { Input } from './components/modal.mjs';

// DOM Elements ----------------------------------------------------/

const navBurger = document.querySelector('.nav__burger');
const openButton = document.querySelectorAll('.btn--signup');
const modalOuter = document.querySelector('.modal-outer');
const form = document.querySelector("form[name='reserve']");
const closeButton = document.querySelector('span.close');
const successMessage = document.querySelector('.success-message');

// Gestion de l'ouverture/fermeture de la barre de navigation ------/

/**
 * Permet d'afficher/masquer les éléments
 * de la barre de navigation lors d'un clic
 * sur l'icône de classe burger
 * @param event
 */
function toggleNav(event) {
  let nav = event.target.closest('.nav');
  nav.classList.toggle('responsive');
}

navBurger.addEventListener('click', toggleNav);

// Gestion de l'ouverture/fermeture de la modale -------------------/

function openModal() {
  modalOuter.classList.add('open');
}

function closeModal() {
  modalOuter.classList.remove('open');
}

// Ouvrir la modale avec le bouton d'inscription
openButton.forEach(button => {
  button.addEventListener('click', openModal);
});

// Fermer la modale

// 1. Grâce au bouton de fermeture
closeButton.addEventListener('click', closeModal);

// 2. Si l'on clique en dehors de la modale
modalOuter.addEventListener('click', event => {
  /**
   * Avec e.target on cible l'élément sur lequel on clique.
   * Avec .closet('.modal-inner') on obtient l'ancêtre le plus
   * proche qui a la classe 'modal-inner'. Si on clique à
   * l'intérieur de l'élément 'modal-inner' ça nous le renvoit,
   * sinon on obtient une valeur null. Grâce au '!' on
   * transforme la valeur de retour en boolean.
   */
  const isOutside = !event.target.closest('.modal-inner');
  if (isOutside) {
    closeModal();
  }
});

// 3. Si l'on presse le bouton Escape
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// Validation du formulaire ----------------------------------------/

const FirstName = new Input('first');
const LastName = new Input('last');
const Email = new Input('email');
const BirthDate = new Input('birthdate');
const Quantity = new Input('quantity');
const Locations = new Input('location');
const Terms = new Input('term');

const fields = [
  FirstName,
  LastName,
  Email,
  BirthDate,
  Quantity,
  Locations,
  Terms,
];

// Ajouter un listener sur chaque Input
fields.forEach(field => {
  field.inputs.forEach(input => {
    input.addEventListener('change', event => {
      // Mettre à jour la valeur de l'input
      field.value = event.target.value;
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = event.target.checked;
      }
      // Si une erreur est présente la montrer
      if (field.hasError()) {
        field.showError();
        field.isValid = false;
      }
      // S'il n'y a aucune erreur enlever l'erreur précédente & valider l'état de l'input
      if (!field.hasError()) {
        field.removeError();
        field.isValid = true;
      }
    });
  });
});

function toggleSuccess() {
  successMessage.classList.toggle('valid');
}

/**
 * 1. Empêcher le comportement par défaut du submit
 * 2. Les champs sont-ils valides ?
 * => Si faux récupérer les champs invalide et montrer leur erreur
 * => Sinon afficher le message de validation puis fermer la modale
 *    et réinitialiser le formulaire. Ensuite cacher le message de
 *    validation. Ainsi le formulaire est de nouveau disponible si
 *    l'utilisateur décide de soumettre une autre inscription.
 * @param {*} event
 */

function validate(event) {
  event.preventDefault();
  let fieldsAreValid = fields.every(field => field.isValid);
  if (!fieldsAreValid) {
    let invalidFields = fields.filter(field => !field.isValid);
    invalidFields.forEach(field => {
      field.hasError();
      field.showError();
    });
  } else {
    toggleSuccess();
    setTimeout(() => {
      setTimeout(() => {
        toggleSuccess();
      }, 500);
      closeModal();
      form.reset();
    }, 1000);
  }
}

form.addEventListener('submit', validate);
