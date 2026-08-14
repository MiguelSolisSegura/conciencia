document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre = form.querySelector("#nombre").value.trim();
      const email = form.querySelector("#email").value.trim();
      const mensaje = form.querySelector("#mensaje").value.trim();
      const subject = encodeURIComponent(`Mensaje de ${nombre} (${email})`);
      const body = encodeURIComponent(`${mensaje}\n\n—\n${nombre}\n${email}`);
      window.location.href = `mailto:conciencia.ia.cr@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Team Carousel
  const track = document.querySelector("#team-carousel-track");
  if (track) {
    const slides = Array.from(track.querySelectorAll(".team-carousel-slide"));
    const prevBtn = document.querySelector("#team-carousel-prev");
    const nextBtn = document.querySelector("#team-carousel-next");
    const counter = document.querySelector("#team-carousel-counter");
    const dotsContainer = document.querySelector("#team-carousel-dots");

    const getSlideStep = () => {
      if (!slides.length) return 0;
      const slide = slides[0];
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return slide.offsetWidth + gap;
    };

    const getActiveIndex = () => {
      if (!slides.length) return 0;
      let closestIndex = 0;
      let minDiff = Infinity;
      const trackLeft = track.offsetLeft;
      const currentScroll = track.scrollLeft;

      slides.forEach((slide, idx) => {
        const slidePos = slide.offsetLeft - trackLeft;
        const diff = Math.abs(slidePos - currentScroll);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = idx;
        }
      });
      return closestIndex;
    };

    const scrollToSlide = (index) => {
      const clampedIndex = Math.max(0, Math.min(index, slides.length - 1));
      const targetSlide = slides[clampedIndex];
      if (targetSlide) {
        const targetLeft = targetSlide.offsetLeft - track.offsetLeft;
        track.scrollTo({
          left: targetLeft,
          behavior: "smooth"
        });
      }
    };

    // Render pagination dots
    if (dotsContainer && slides.length > 0) {
      dotsContainer.innerHTML = "";
      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `carousel-dot${index === 0 ? " is-active" : ""}`;
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Ir al integrante ${index + 1} de ${slides.length}`);
        dot.setAttribute("aria-selected", index === 0 ? "true" : "false");
        dot.addEventListener("click", () => {
          scrollToSlide(index);
        });
        dotsContainer.appendChild(dot);
      });
    }

    const updateUI = () => {
      const activeIdx = getActiveIndex();

      if (counter) {
        const curr = String(activeIdx + 1).padStart(2, "0");
        const total = String(slides.length).padStart(2, "0");
        counter.textContent = `${curr} / ${total}`;
      }

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".carousel-dot");
        dots.forEach((dot, idx) => {
          const isActive = idx === activeIdx;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-selected", String(isActive));
        });
      }
    };

    const handleNext = () => {
      const currentIdx = getActiveIndex();
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 15) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const targetIdx = Math.min(slides.length - 1, currentIdx + 1);
        scrollToSlide(targetIdx);
      }
    };

    const handlePrev = () => {
      const currentIdx = getActiveIndex();
      if (track.scrollLeft <= 15) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        track.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        const targetIdx = Math.max(0, currentIdx - 1);
        scrollToSlide(targetIdx);
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleNext();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handlePrev();
      });
    }

    // Keyboard navigation
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    });

    // Mouse drag scrolling
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeftStart = track.scrollLeft;
      track.classList.add("is-dragging");
    });

    window.addEventListener("mouseup", () => {
      if (isDown) {
        isDown = false;
        track.classList.remove("is-dragging");
        updateUI();
      }
    });

    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.3;
      track.scrollLeft = scrollLeftStart - walk;
    });

    // Scroll listener
    let isScrolling = false;
    track.addEventListener(
      "scroll",
      () => {
        if (!isScrolling) {
          window.requestAnimationFrame(() => {
            updateUI();
            isScrolling = false;
          });
          isScrolling = true;
        }
      },
      { passive: true }
    );

    // Initial state
    updateUI();
    window.addEventListener("resize", updateUI);
  }
});
