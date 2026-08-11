document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

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
});
