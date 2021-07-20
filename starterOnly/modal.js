function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelector(".modal-btn");
const modalContent = document.querySelector(".content");
const formData = document.querySelectorAll(".formData");

// launch modal event
modalBtn.addEventListener("click", toggleModal);

// launch modal form
function toggleModal() {
  modalbg.style.display === "block"
    ? (modalbg.style.display = "none")
    : (modalbg.style.display = "block");
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
  // modalContent.style.animationName = "modalopen";
});
