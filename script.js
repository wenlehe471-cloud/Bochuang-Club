const scroller = document.querySelector(".snap-page");
const header = document.querySelector(".site-header");
const dots = Array.from(document.querySelectorAll(".side-dots a"));
const sections = Array.from(document.querySelectorAll(".panel"));
const slides = Array.from(document.querySelectorAll(".program-slide"));
const currentLabel = document.querySelector("[data-slide-current]");
let activeSlide = 0;
let slideTimer = null;

document.querySelectorAll("[data-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.target);
    target?.scrollIntoView({ behavior: "smooth" });
  });
});

function setActiveSlide(nextIndex) {
  const next = (nextIndex + slides.length) % slides.length;
  if (next === activeSlide) return;

  slides[activeSlide].classList.add("is-leaving");
  slides[activeSlide].classList.remove("is-active");

  activeSlide = next;
  slides[activeSlide].classList.add("is-active");
  currentLabel.textContent = String(activeSlide + 1).padStart(2, "0");

  window.setTimeout(() => {
    slides.forEach((slide, index) => {
      if (index !== activeSlide) slide.classList.remove("is-leaving");
    });
  }, 680);
}

function restartSlideTimer() {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => setActiveSlide(activeSlide + 1), 4200);
}

document.querySelector("[data-slide-prev]")?.addEventListener("click", () => {
  setActiveSlide(activeSlide - 1);
  restartSlideTimer();
});

document.querySelector("[data-slide-next]")?.addEventListener("click", () => {
  setActiveSlide(activeSlide + 1);
  restartSlideTimer();
});

restartSlideTimer();

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const activeId = visible.target.id;
    const theme = visible.target.dataset.theme;
    header.classList.toggle("is-light", theme === "light");

    dots.forEach((dot) => {
      dot.classList.toggle("active", dot.getAttribute("href") === `#${activeId}`);
    });
  },
  {
    root: scroller,
    threshold: [0.42, 0.58, 0.72],
  }
);

sections.forEach((section) => observer.observe(section));
