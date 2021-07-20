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

// close modal
document.querySelector("span.close").addEventListener("click", e => {
  e.stopPropagation();
  modalContent.style.animationName = "modalclose";
  setTimeout(toggleModal, 700);
  setTimeout(toggleModalAnimation, 700);
});

let outsideModal;

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

// document.querySelector('.formData').setAttribute('data-error', 'Veuillez entrer 2 caractères ou plus pour le champ du nom.')
// document.querySelector(".formData").setAttribute("data-error-visible", "true")

function nameValidation(value) {
  return /^[a-zA-Z]{2,}$/.test(value);
}

function emailValidation(value) {
  return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(value);
}

function birthDateValidation(value) {
  console.log(Date.parse(value));
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
  console.log(event.target.value, typeof event.target.value);
  console.log(Date.parse(event.target.value));
  if (event.target.value) {
    birthDate.setAttribute("data-error-visible", "false");
    birthDateIsValid = true;
  } else {
    birthDate.setAttribute("data-error-visible", "true");
    birthDate.setAttribute(
      "data-error",
      "Vous devez entrer votre date de naissance"
    );
  }
});
