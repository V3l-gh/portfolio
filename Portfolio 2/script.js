const themeToggle = document.getElementById("themeToggle");
const form = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");

const legalLink = document.getElementById("legalLink");
const legalModal = document.getElementById("legalModal");
const closeLegalModal = document.getElementById("closeLegalModal");
const sections = document.querySelectorAll("main .section");

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (!themeToggle) {
    return;
  }

  themeToggle.innerHTML =
    theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"
  );
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || savedTheme === "light") {
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

if (sections.length > 0) {
  sections.forEach((section, index) => {
    section.classList.add("section-reveal");
    if (index === 0) {
      section.classList.add("is-visible");
    }
  });

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  sections.forEach((section, index) => {
    if (index > 0) {
      sectionObserver.observe(section);
    }
  });
}

if (legalLink && legalModal) {
  legalLink.addEventListener("click", (event) => {
    event.preventDefault();
    legalModal.showModal();
  });
}

if (closeLegalModal && legalModal) {
  closeLegalModal.addEventListener("click", () => {
    legalModal.close();
  });
}

if (legalModal) {
  legalModal.addEventListener("click", (event) => {
    const bounds = legalModal.getBoundingClientRect();
    const isInDialog =
      bounds.top <= event.clientY &&
      event.clientY <= bounds.top + bounds.height &&
      bounds.left <= event.clientX &&
      event.clientX <= bounds.left + bounds.width;

    if (!isInDialog) {
      legalModal.close();
    }
  });
}

if (form && feedback) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !message) {
      feedback.textContent = "Merci de compléter tous les champs.";
      feedback.style.color = "var(--danger)";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi...";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        feedback.textContent = "Message envoyé avec succès. Merci pour votre prise de contact !";
        feedback.style.color = "var(--success)";
        form.reset();
      } else {
        feedback.textContent = "Échec de l'envoi. Merci de réessayer dans un instant.";
        feedback.style.color = "var(--danger)";
      }
    } catch (error) {
      feedback.textContent = "Échec de l'envoi. Vérifiez votre connexion puis réessayez.";
      feedback.style.color = "var(--danger)";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Envoyer";
      }
    }
  });
}
