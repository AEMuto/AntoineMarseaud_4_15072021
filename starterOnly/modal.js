function editNav() {
  var x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

// DOM Elements
const modalBackground = document.querySelector('.bground');
const modalContent = document.querySelector('.content');
const modalBody = document.querySelector('.modal-body');
const modalButton = document.querySelector('.modal-btn');

const formData = document.querySelectorAll('.formData');

// launch modal event
modalButton.addEventListener('click', toggleModal);

// launch modal form
function toggleModal() {
  modalBackground.style.display === 'block'
    ? (modalBackground.style.display = 'none')
    : (modalBackground.style.display = 'block');
}

function toggleModalAnimation() {
  modalContent.style.animationName === 'modalopen'
    ? (modalContent.style.animationName = 'modalclose')
    : (modalContent.style.animationName = 'modalopen');
}

// launch success
function toggleSuccess() {
  document.querySelector('.success').style.display === 'flex'
    ? (document.querySelector('.success').style.display = 'none')
    : (document.querySelector('.success').style.display = 'flex');
}

// close modal
document.querySelector('span.close').addEventListener('click', e => {
  e.stopPropagation();
  modalContent.style.animationName = 'modalclose';
  setTimeout(toggleModal, 700);
  setTimeout(toggleModalAnimation, 700);
});

let outsideModal = true;

modalBody.addEventListener('mouseleave', () => {
  outsideModal = true;
});
modalBody.addEventListener('mouseenter', () => {
  outsideModal = false;
});

modalBackground.addEventListener('click', e => {
  if (outsideModal) {
    e.stopPropagation();
    modalContent.style.animationName = 'modalclose';
    setTimeout(toggleModal, 700);
    setTimeout(toggleModalAnimation, 700);
  }
});

// Form Control

function birthDateValidation(value) {
  const inputDate = new Date(value);
  const inputYear = inputDate.getFullYear();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const age = currentYear - inputYear;
  if (age > 12 && age < 120) {
    return true;
  } else {
    return false;
  }
}

class Input {
  constructor(element) {
    this.inputs = document.querySelectorAll(`input[name="${element}"]`);
    this.isValid = false;
    this.validity = this.inputs[0].validity;
    this.type = this.inputs[0].getAttribute('type');
    this.value = this.inputs[0].value;
    this.error;
    // Radio ou chekbox edge case
    if (this.type === 'radio' || this.type === 'checkbox') {
      this.checked = false;
    }
  }
  // Pour générer les messages d'erreur classique on utilise l'API Validity
  // Les cas particuliers sont birthdate, checkbox(terms) & radio(locations)
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

  showError() {
    this.inputs[0].parentElement.dataset.errorVisible = true;
    this.inputs[0].parentElement.dataset.error = this.error;
  }

  removeError() {
    this.inputs[0].parentElement.dataset.errorVisible = false;
    this.inputs[0].parentElement.dataset.error = '';
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
      // Updater la value de l'input sinon elle reste identique à celle définie dans le constructor, pq ?
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
    console.log('Champs validé');
  }
}

document
  .querySelector("form[name='reserve']")
  .addEventListener('submit', validate);
