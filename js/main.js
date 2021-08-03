function editNav() {
  let x = document.getElementById('myTopnav');
  if (x.className === 'nav') {
    x.className += ' responsive';
  } else {
    x.className = 'nav';
  }
}

// DOM Elements ----------------------------------------------------/

const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');

const openButton = document.querySelectorAll('.btn--signup');
const closeButton = document.querySelector('span.close');

const succesMessage = document.querySelector('.success-message');

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
modalOuter.addEventListener('click', e => {
  /**
   * Avec e.target on cible l'élément sur lequel on clique.
   * Avec .closet('.modal-inner') on obtient l'ancêtre le plus
   * proche qui a la classe 'modal-inner'. Si on clique à
   * l'intérieur de l'élément 'modal-inner' ça nous le renvoit,
   * sinon on obtient une valeur null. Grâce au '!' on
   * transforme la valeur de retour en boolean.
   */
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

// Validation du formulaire ----------------------------------------/

/**
 * Vérifier que la date entré par l'utilisateur est correcte
 * On calcule l'âge de l'utilisateur.
 * Il faut qu'il ait entre 13 et 119 ans pour que la date
 * soit considérée comme valide.
 * @param {*} value
 * @returns
 */
function birthDateValidation(value) {
  const msInYear = 31536000000;
  const inputDate = new Date(value);
  const inputTime = inputDate.getTime();
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const age = (currentTime - inputTime) / msInYear;
  if (age > 12 && age < 120) {
    return true;
  } else {
    return false;
  }
}

/**
 * Plutôt que de gérer les champs du formulaire au cas par cas
 * on utilise une classe; Ce qui nous permet de garder notre code
 * DRY. Cette classe Input prend en paramètre un élément du DOM
 * correspondant au champs que l'on veut vérifier.
 * @param {*} element
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
   * Génération des messages d'erreurs
   * Utilisation de l'API Validity en priorité pour la gestion des erreurs courantes.
   * Les cas particuliers sont birthdate, checkbox(terms) et radio(locations).
   * L'API Validity ne renvoit pas d'information si jamais l'utilisateur
   * 1. Rentre une date de naissance incohérente (ex: supérieur à la date actuelle)
   * 2. Ne coche pas une checkbox
   * 3. Ne sélectionne aucun boutons radio
   * La méthode va comparer les valeurs rentrées par l'utilisateur ou
   * vérifier l'état de Validity. Si une erreur est trouvée on met à jour
   * la propriété 'error' de l'instance de la classe avec un message d'erreur
   * correspondant au type d'erreur.
   * Puis on renvoit celle-ci, ce qui nous permet de vérifier facilement
   * l'état de l'instance de la classe lors d'une conditionnelle.
   * Le cas échéant renverrait 'undefined'.
   * @returns
   */
  hasError() {
    // Date de naissance
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
    // Erreurs courantes
    if (this.validity.badInput) {
      this.error = 'Veuillez rentrer une valeur correct';
      return this.error;
    }
    if (this.validity.valueMissing) {
      this.error = 'Veuillez remplir ce champs';
      return this.error;
    }
    if (this.validity.patternMismatch) {
      if (this.type === 'text') {
        this.error = 'Veuillez rentrer 2 caractères alphabétiques ou plus';
        return this.error;
      }
      if (this.type === 'email') {
        this.error = 'Veuillez rentrer une adresse email valide';
        return this.error;
      }
    }
    if (
      this.validity.rangeUnderflow ||
      this.validity.rangeOverflow ||
      this.validity.stepMismatch
    ) {
      this.error = 'Veuillez rentrer un nombre entier entre 0 et 99';
      return this.error;
    }
  }
  /**
   * Montrer l'erreur.
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
   * Enlever l'erreur.
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

function showSuccess() {
  succesMessage.classList.add('valid');
}

function hideSuccess() {
  succesMessage.classList.remove('valid');
}

/**
 * 1. Empêcher le comportement par défaut du submit
 * 2. Les champs sont-ils valides ?
 * => Si faux récupérer les champs invalide et montrer leur erreur
 * => Sinon afficher le message de validation puis fermer la modale et
 *    ensuite cacher le message de validation. Ainsi le formulaire est
 *    de nouveau disponible si l'utilisateur décide de réaliser une
 *    autre inscription.
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
    showSuccess();
    setTimeout(() => {
      setTimeout(() => {
        hideSuccess();
      }, 500);
      closeModal();
    }, 1000);
  }
}

document
  .querySelector("form[name='reserve']")
  .addEventListener('submit', validate);
