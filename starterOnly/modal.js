function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalBackground = document.querySelector(".bground");
const modalContent = document.querySelector(".content");
const modalBody = document.querySelector(".modal-body");
const modalButton = document.querySelector(".modal-btn");

const formData = document.querySelectorAll(".formData");
const [firstName, lastName, email, birthDate, tournamentNumber, cities, terms] =
  formData;

// launch modal event
modalButton.addEventListener("click", toggleModal);

// launch modal form
function toggleModal() {
  modalBackground.style.display === "block"
    ? (modalBackground.style.display = "none")
    : (modalBackground.style.display = "block");
}

function toggleModalAnimation() {
  modalContent.style.animationName === "modalopen"
    ? (modalContent.style.animationName = "modalclose")
    : (modalContent.style.animationName = "modalopen");
}

// launch success
function toggleSuccess() {
  document.querySelector(".success").style.display === "flex"
    ? (document.querySelector(".success").style.display = "none")
    : (document.querySelector(".success").style.display = "flex");
}

// close modal
document.querySelector("span.close").addEventListener("click", e => {
  e.stopPropagation();
  modalContent.style.animationName = "modalclose";
  setTimeout(toggleModal, 700);
  setTimeout(toggleModalAnimation, 700);
});

let outsideModal = true;

modalBody.addEventListener("mouseleave", () => {
  outsideModal = true;
});
modalBody.addEventListener("mouseenter", () => {
  outsideModal = false;
});

modalBackground.addEventListener("click", e => {
  if (outsideModal) {
    e.stopPropagation();
    modalContent.style.animationName = "modalclose";
    setTimeout(toggleModal, 700);
    setTimeout(toggleModalAnimation, 700);
  }
});

// Form Control

function nameValidation(value) {
  return /^[a-zA-Z]{2,}$/.test(value);
}

function emailValidation(value) {
  return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(value);
}

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

let firstNameIsValid;
firstName.querySelector(".text-control").addEventListener("change", event => {
  if (nameValidation(event.target.value)) {
    firstName.setAttribute("data-error-visible", "false");
    firstNameIsValid = true;
  } else {
    firstName.setAttribute("data-error-visible", "true");
    firstName.setAttribute(
      "data-error",
      "Veuillez entrer 2 caractères alphabétiques ou plus"
    );
  }
});

let lastNameIsValid;
lastName.querySelector(".text-control").addEventListener("change", event => {
  if (nameValidation(event.target.value)) {
    lastName.setAttribute("data-error-visible", "false");
    lastNameIsValid = true;
  } else {
    lastName.setAttribute("data-error-visible", "true");
    lastName.setAttribute(
      "data-error",
      "Veuillez entrer 2 caractères alphabétiques ou plus"
    );
  }
});

let emailIsValid;
email.querySelector(".text-control").addEventListener("change", event => {
  if (emailValidation(event.target.value)) {
    email.setAttribute("data-error-visible", "false");
    emailIsValid = true;
  } else {
    email.setAttribute("data-error-visible", "true");
    email.setAttribute(
      "data-error",
      "Veuillez entrer une adresse email valide"
    );
  }
});

let birthDateIsValid;
birthDate.querySelector(".text-control").addEventListener("change", event => {
  if (birthDateValidation(event.target.value)) {
    birthDate.setAttribute("data-error-visible", "false");
    birthDateIsValid = true;
  } else {
    birthDate.setAttribute("data-error-visible", "true");
    birthDate.setAttribute(
      "data-error",
      "Vous devez entrer votre date de naissance et avoir au moins 13 ans"
    );
  }
});

let tournamentNumberIsValid;
tournamentNumber
  .querySelector(".text-control")
  .addEventListener("change", event => {
    let value = event.target.value;
    if (value >= 0 && value <= 99) {
      tournamentNumber.setAttribute("data-error-visible", "false");
      tournamentNumberIsValid = true;
    } else {
      tournamentNumber.setAttribute("data-error-visible", "true");
      tournamentNumber.setAttribute(
        "data-error",
        "Veuillez entrer une valeur correcte"
      );
    }
  });

let citiesIsValid;
cities.querySelectorAll("input[name='location']").forEach(city => {
  city.addEventListener("change", event => {
    if (city.checked) {
      cities.setAttribute("data-error-visible", "false");
      citiesIsValid = true;
    } else {
      cities.setAttribute("data-error-visible", "true");
      cities.setAttribute("data-error", "Veuillez sélectionner une ville");
    }
  });
});

let termsIsValid = true;
terms.querySelector("#checkbox1").addEventListener("change", event => {
  let element = terms.querySelector("#checkbox1");
  if (element.checked) {
    terms.setAttribute("data-error-visible", "false");
    termsIsValid = true;
  } else {
    termsIsValid = false;
    terms.setAttribute("data-error-visible", "true");
    terms.setAttribute(
      "data-error",
      "Vous devez vérifier que vous acceptez les termes et conditions."
    );
  }
});

function validate(event) {
  event.preventDefault();
  let inputsAreValid;
  let inputs = [
    firstNameIsValid,
    lastNameIsValid,
    emailIsValid,
    birthDateIsValid,
    tournamentNumberIsValid,
    citiesIsValid,
    termsIsValid,
  ];
  inputs.forEach(input => {
    console.log(input);
    if (!input) {
      inputsAreValid = false;
      // afficher le data-error correspondant
    } else {
      inputsAreValid = true;
    }
  });
  console.log(inputsAreValid);
  if (inputsAreValid) {
    document.querySelector(".success").style.display = "flex";
    setTimeout(toggleSuccess, 2000);
    setTimeout(toggleModal, 2500);
  }
  console.log("Form Submitted!");
}

document
  .querySelector("form[name='reserve']")
  .addEventListener("submit", validate);
