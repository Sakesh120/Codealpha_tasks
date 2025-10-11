let myGallary = document.getElementById("myGallary");
let overlay = document.querySelector(".gallary-overlay");
let imgBox = document.querySelector(".img-box");
let img = document.querySelector(".img-box img");
let close = document.querySelector(".close-btn");
let prevBtn = document.querySelector(".nav-btn.prev");
let nextBtn = document.querySelector(".nav-btn.next");
let galleryImages = Array.from(myGallary.querySelectorAll("img"));
let currentIndex = -1;
const modeToggle = document.getElementById("mode-toggle");
const body = document.body;

myGallary.addEventListener("click", (e) => {
  if (e.target && e.target.tagName === "IMG") {
    let imgSrc = e.target.src;
    currentIndex = galleryImages.indexOf(e.target);
    overlay.classList.add("active");
    console.log(imgSrc);
    overlay.classList.add("active");
    imgBox.classList.add("active");
    img.src = imgSrc;
  }
});

close.addEventListener("click", () => {
  closeImg();
});

overlay.addEventListener("click", () => {
  closeImg();
});

const closeImg = () => {
  overlay.classList.remove("active");
  imgBox.classList.remove("active");
  img.src = "";
  currentIndex = -1;
};
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = galleryImages.length - 1;
  }
  img.src = galleryImages[currentIndex].src;
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentIndex < galleryImages.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  img.src = galleryImages[currentIndex].src;
});

if (localStorage.getItem("mode") === "dark") {
  body.classList.add("dark-mode");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});
