/* ==========================================================================
   WOW Agency — site-wide JavaScript
   Covers: mobile nav toggle, optional lead form validation, and reveal effects.
   Loaded on every page via <script src="site.js" defer></script>
   ========================================================================== */

window.addEventListener("unhandledrejection", (e) => {
  if (e.reason && e.reason.name === "AbortError" && /transition/i.test(e.reason.message)) {
    e.preventDefault();
  }
});

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. Mobile nav toggle (present on every page)
  ------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".mobile-menu");
    if (!toggle || !menu) return;

    const closeBtn = menu.querySelector(".close-btn");

    function openMenu() {
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    }
    function closeMenu() {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  function initPageNavigation() {
    const pagePaths = {
      home: "index.html",
      about: "about.html",
      services: "services.html",
      contact: "contact.html",
      "start-a-project": "contact.html",
    };

    document.querySelectorAll("a[data-path]").forEach((link) => {
      const path = pagePaths[link.dataset.path];
      if (path) link.setAttribute("href", path);
    });
  }

  /* ------------------------------------------------------------------
     2. Lead capture form — client-side validation + submit simulation
        (US: lead capture form, confirms on submit)
  ------------------------------------------------------------------ */
  function initLeadForm() {
    const form = document.getElementById("lead-form");
    if (!form) return;
    const success = document.getElementById("form-success");

    const rules = {
      name: (v) => v.trim().length > 0,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      company: (v) => v.trim().length > 0,
      message: (v) => v.trim().length > 0,
    };

    function validateField(field) {
      const name = field.dataset.field;
      if (!rules[name]) return true;
      const input = field.querySelector("input, textarea, select");
      const valid = rules[name](input.value || "");
      field.classList.toggle("has-error", !valid);
      return valid;
    }

    form.querySelectorAll(".field[data-field]").forEach((field) => {
      const input = field.querySelector("input, textarea, select");
      if (!input) return;
      input.addEventListener("blur", () => validateField(field));
      input.addEventListener("input", () => {
        if (field.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let allValid = true;
      form.querySelectorAll(".field[data-field]").forEach((field) => {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) {
        const firstError = form.querySelector(".field.has-error input, .field.has-error textarea, .field.has-error select");
        if (firstError) firstError.focus();
        return;
      }

      // Simulate a network submit. No backend is wired up yet — swap this
      // block for a real fetch() call to your form endpoint when ready.
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      setTimeout(() => {
        form.classList.add("hide");
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }, 500);
    });
  }

  /* ------------------------------------------------------------------
     3. Scroll-reveal for ledger-line style SVGs placed below the fold
        (the hero's own line still animates on load via CSS)
  ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".ledger-band, .value-card, .team-card, .service-card");
    if (!("IntersectionObserver" in window) || targets.length === 0) return;

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------
     4. Auto-scroll to the contact form on the Contact page.
        Guarded on #contact-form-section, which only exists in
        Contact.html, so this is a no-op on every other page even
        though the script is shared.
  ------------------------------------------------------------------ */
  function initContactAutoScroll() {
    const formSection = document.getElementById("contact-form-section");
    if (!formSection) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector("header");
    const offset = (header ? header.offsetHeight : 80) + 16;

    function scrollToForm() {
      const y = formSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    }

    // Small delay so it doesn't fight the page-fade-in transition.
    window.addEventListener("load", () => setTimeout(scrollToForm, 300));
  }

  function init() {
    initPageNavigation();
    initMobileNav();
    initLeadForm();
    initScrollReveal();
    initContactAutoScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();