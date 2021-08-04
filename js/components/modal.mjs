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

export { Input };
