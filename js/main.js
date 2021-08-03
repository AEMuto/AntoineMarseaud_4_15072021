function editNav() {
  let x = document.getElementById('myTopnav');
  if (x.className === 'nav') {
    x.className += ' responsive';
  } else {
    x.className = 'nav';
  }
}

// DOM Elements
const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');
const closeButton = document.querySelector('span.close');
const openButton = document.querySelectorAll('.btn--signup');
const formData = document.querySelectorAll('.formData');

// Gestion de l'ouverture/fermeture de la modale

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
modalOuter.addEventListener('click', e => {
  const isOutside = !e.target.closest('.modal-inner');
  if (isOutside) {
    closeModal();
  }
});

// 3. Si l'on presse le bouton Escape
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Form Control
/**
 *
 * @param {*} value
 * @returns
 */
function birthDateValidation(value) {
  const inputDate = new Date(value);
  const inputTime = inputDate.getTime();
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const age = (currentTime - inputTime) / 31536000000; // nb de ms dans une année
  if (age > 12 && age < 120) {
    return true;
  } else {
    return false;
  }
}

/**
 * Décrire ce que fait cette Classe
 * @param {*} event
 */
class Input {
  constructor(element) {
    this.inputs = document.querySelectorAll(`input[name="${element}"]`);
    this.isValid = false;
    this.validity = this.inputs[0].validity;
    this.type = this.inputs[0].getAttribute('type');
    this.value = this.inputs[0].value;
    this.error;
    // Radio ou chekbox cas particulier
    if (this.type === 'radio' || this.type === 'checkbox') {
      this.checked = false;
    }
  }

  /**
   * Pour générer les messages d'erreurs classique on utilise l'API Validity
   * Les cas particuliers sont birthdate, checkbox(terms) & radio(locations)
   * @returns
   */
  hasError() {
    // Birthdate scenario
    if (
      this.type === 'date' &&
      this.value &&
      !birthDateValidation(this.value)
    ) {
      this.error = 'Veuillez rentrer une date de naissance correcte';
      return this.error;
    }
    // Checkbox & Radio
    if (this.type === 'checkbox' && !this.checked) {
      this.error = `Veuillez accepter les conditions d'utilisations`;
      return this.error;
    }
    if (this.type === 'radio') {
      this.inputs.forEach(input => {
        if (!input.checked) {
          this.error = 'Veuillez sélectionner une ville';
          return this.error;
        }
      });
    }
    // Normal case scenario
    if (this.validity.valueMissing) {
      this.error = 'Veuillez remplir ce champs';
      return this.error;
    }
    if (this.validity.patternMismatch) {
      if (this.type === 'text') {
        this.error = 'Veuillez entrer 2 caractères alphabétiques ou plus';
        return this.error;
      }
      if (this.type === 'email') {
        this.error = 'Veuillez entrer une adresse email valide';
        return this.error;
      }
    }
    if (this.validity.rangeUnderflow || this.validity.rangeOverflow) {
      this.error = 'Veuillez rentrer un nombre entre 0 et 99';
      return this.error;
    }
  }
  /**
   * Avec la méthode closest() on récupère l'ancêtre le plus proche
   * ayant la classe formData. On lui applique un attribut dataset
   * error-visible avec une valeur de true pour que le css stylise le champs
   * comme étant invalide. Puis on affiche le message d'erreur en récupérant
   * la valeur de la propriété error précedemment générer par la méthode hasError()
   */
  showError() {
    this.inputs[0].closest('.formData').dataset.errorVisible = true;
    this.inputs[0].closest('.formData').dataset.error = this.error;
  }
  /**
   * removeError() a une logique identique à showError(),
   * sauf que l'on réinitialise les valeurs
   */
  removeError() {
    this.inputs[0].closest('.formData').dataset.errorVisible = false;
    this.inputs[0].closest('.formData').dataset.error = '';
    this.error = null;
  }
}

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
      // Updater la value de l'input sinon elle reste identique à celle définie dans le constructor
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

/**
 * Décrire ce que fait cette fonction
 * @param {*} event
 */
function validate(event) {
  // Empêcher le comportement par défaut du submit
  event.preventDefault();
  // Les champs sont-ils valides ?
  let fieldsAreValid = fields.every(field => field.isValid);
  // Si faux récupérer les champs invalide et montrer leur erreur
  if (!fieldsAreValid) {
    let invalidFields = fields.filter(field => !field.isValid);
    invalidFields.forEach(field => {
      console.log('Champs invalide: ', field.type);
      // Générer les erreurs
      field.hasError();
      // Montrer les erreurs
      field.showError();
    });
  } else {
    // animation snackbar
    console.log('Merci ! Votre réservation a été reçue');
  }
}

document
  .querySelector("form[name='reserve']")
  .addEventListener('submit', validate);
