const galleryItems = Array.from(document.querySelectorAll(".gallary"));
const overlay = document.querySelector(".gallary-overlay");
const modal = document.querySelector(".img-box");
const modalImg = modal.querySelector("img");
const closeBtn = modal.querySelector(".close-btn");
const prevBtn = modal.querySelector(".prev");
const nextBtn = modal.querySelector(".next");
const filterBtns = document.querySelectorAll(".filter-btn");
let currentIndex = 0;

function openModal(index) {
  currentIndex = index;
  modalImg.src = galleryItems[index].querySelector("img").src;
  overlay.classList.add("active");
  modal.classList.add("active");
}

function closeModal() {
  overlay.classList.remove("active");
  modal.classList.remove("active");
}

function showNext() {
  let visibleIndexes = galleryItems
    .map((item, idx) => (item.style.display !== "none" ? idx : -1))
    .filter((idx) => idx !== -1);
  let currentVisibleIdx = visibleIndexes.indexOf(currentIndex);
  let nextVisibleIdx = (currentVisibleIdx + 1) % visibleIndexes.length;
  openModal(visibleIndexes[nextVisibleIdx]);
}

function showPrev() {
  let visibleIndexes = galleryItems
    .map((item, idx) => (item.style.display !== "none" ? idx : -1))
    .filter((idx) => idx !== -1);
  let currentVisibleIdx = visibleIndexes.indexOf(currentIndex);
  let prevVisibleIdx =
    (currentVisibleIdx - 1 + visibleIndexes.length) % visibleIndexes.length;
  openModal(visibleIndexes[prevVisibleIdx]);
}

galleryItems.forEach((item, idx) => {
  item.addEventListener("click", () => openModal(idx));
});

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

document.addEventListener("keydown", (e) => {
  if (modal.classList.contains("active")) {
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "Escape") closeModal();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    galleryItems.forEach((item) => {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
});

const modeToggle = document.getElementById("mode-toggle");
if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}
