# GameOn
Projet réalisé dans le cadre de ma formation "Développeur d'application Javascript" chez Openclassrooms.

## Contexte
>**Instructions**\
>_"Vous ne devez utiliser que du CSS personnalisé et du JavaScript pur, sans jQuery, Bootstrap ou autre librairie"._

Première approche d'interactivité grâce à Javascript. L'objectif de ce projet est de créer un système de validation de formulaire.

## Architecture du projet

### Arborescence
Le javascript est séparé en deux fichiers :
- `main.mjs` : contient le code principal du projet, qui s'exécute lorsque le document est chargé.
- `Input.mjs` : contient le code de la classe Input, qui permet de gérer la validité des inputs du formulaire.

### La class Input
Dans le constructeur de la classe Input, on initialise les propriétés suivantes :
- `this.inputs` : Les éléments HTML possédant une valeur d'attribut `name` égale à celle passée en paramètre.
- `this.isValid` : Un booléen qui indique si l'input est valide.
- `this.validity` : Un objet contenant les informations de validité de l'input propre à l'API Validity.
- `this.type` : Le type de l'input, qui est déterminé par son attribut `type`.
- `this.error` : Le message d'erreur à afficher si l'input n'est pas valide.
- `this.checked` : Initialisé uniquement si `this.type` à la valeur `checkbox` ou `radio`. Un booléen qui indique si l'input est coché.

La classe Input possède 3 méthodes :
- `hasError()` : Génère les messages d'erreurs.
- `showError()` : Permet d'afficher l'erreur en cas d'erreur.
- `removeError()` : Permet de supprimer le message d'erreur.

La validité de chaque input est contrôlée par un listener de type `change` est une fonction de rappel anonyme :
```js
const FirstName = new Input('first');
// ...
const fields = [
  FirstName,
  // ...
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
```

La validation globale du formulaire est contrôlée par un listener de type `submit` sur le formulaire et la fonction de rappel `validate()` :
```js
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
      form.reset(); // Réinitialiser le formulaire
      fields.forEach(field => {
        field.isValid = false; // Réinitialiser l'état des champs
      });
    }, 1000);
  }
}

form.addEventListener('submit', validate);
```