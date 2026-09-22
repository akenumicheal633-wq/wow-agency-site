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
    const header = document.querySelector("header");
    if (!header || document.querySelector(".nav-toggle")) return;
    header.classList.add("has-mobile-nav");

    const navigation = header.querySelector("nav");
    if (!navigation) return;

    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span></span><span></span><span></span>';

    const menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.innerHTML = `
      <div class="mobile-menu-panel">
        <button class="close-btn" type="button" aria-label="Close navigation">&times;</button>
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="services.html">Services</a>
        <a href="contact.html">Contact</a>
        <a class="mobile-menu-cta" href="contact.html">Let's Talk <span aria-hidden="true">&rarr;</span></a>
      </div>`;

    const headerCta = Array.from(header.querySelectorAll("a")).find(
      (link) => link.textContent.includes("Let's Talk")
    );
    if (headerCta) headerCta.classList.add("desktop-header-cta");

      if (!document.getElementById("mobile-nav-styles")) {
        const styles = document.createElement("style");
        styles.id = "mobile-nav-styles";
        styles.textContent = `
          .nav-toggle { display: none; border: 0; background: transparent; padding: 10px; cursor: pointer; }
          .nav-toggle span { display: block; width: 24px; height: 2px; margin: 5px 0; background: currentColor; transition: transform .2s ease, opacity .2s ease; }
          .mobile-menu { display: none; }
          @media (max-width: 1023px) {
            .has-mobile-nav nav { display: none !important; }
            .has-mobile-nav .desktop-header-cta { display: none !important; }
            .nav-toggle { display: block; color: #F5C542; }
            .mobile-menu { display: block; position: fixed; inset: 0; z-index: 60; background: rgba(15, 23, 32, .58); opacity: 0; pointer-events: none; transition: opacity .2s ease; }
            .mobile-menu.open { opacity: 1; pointer-events: auto; }
            .mobile-menu-panel { position: absolute; top: 0; right: 0; width: min(82vw, 340px); min-height: 100%; padding: 92px 28px 32px; background: #0F1720; box-shadow: -12px 0 32px rgba(0,0,0,.2); transform: translateX(100%); transition: transform .25s ease; }
            .mobile-menu.open .mobile-menu-panel { transform: translateX(0); }
            .mobile-menu-panel a { display: block; padding: 16px 0; color: #F7F5F0; font: 700 13px 'Space Grotesk', sans-serif; letter-spacing: .12em; text-transform: uppercase; border-bottom: 1px solid rgba(247,245,240,.12); }
            .mobile-menu-panel a:hover { color: #F5C542; }
            .mobile-menu-panel .close-btn { position: absolute; top: 25px; right: 24px; border: 0; background: transparent; color: #F5C542; font-size: 32px; line-height: 1; cursor: pointer; }
            .mobile-menu-panel .mobile-menu-cta { margin-top: 28px; padding: 15px 18px; color: #0F1720; background: #F5C542; border: 0; border-radius: 999px; }
            body.menu-open { overflow: hidden; }
          }
        `;
        document.head.appendChild(styles);
      }

    header.querySelector("div")?.appendChild(toggle);
    header.appendChild(menu);

    const closeBtn = menu.querySelector(".close-btn");

    function openMenu() {
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");
      document.body.classList.add("menu-open");
    }
    function closeMenu() {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
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
      "about-us": "about.html",
      services: "services.html",
      "services-disciplines": "services.html",
      contact: "contact.html",
      "contact-project-brief": "contact.html",
      portfolio: "index.html",
      "start-a-project": "contact.html",
    };

    document.querySelectorAll("a[data-path]").forEach((link) => {
      const path = pagePaths[link.dataset.path];
      if (path) link.setAttribute("href", path);
    });
  }

  function removeProductionTier() {
    const tierLabel = Array.from(document.querySelectorAll("span")).find(
      (span) => span.textContent.trim() === "ESTIMATED PRODUCTION TIER"
    );
    const tierControl = tierLabel && tierLabel.parentElement && tierLabel.parentElement.parentElement;
    if (tierControl && tierControl.querySelector('input[type="range"]')) {
      tierControl.remove();
    }
  }

  function restorePageScroll() {
    const root = document.documentElement;
    if (root.style.overflow === "hidden") {
      root.style.removeProperty("width");
      root.style.removeProperty("height");
      root.style.removeProperty("overflow");
      root.style.removeProperty("position");
    }
  }

  function clearFormPlaceholders() {
    document.querySelectorAll("input[placeholder], textarea[placeholder], select[placeholder]").forEach((field) => {
      field.removeAttribute("placeholder");
    });
  }

  function enlargeSectionPageLogo() {
    const page = window.location.pathname.split("/").pop();
    if (page !== "about.html" && page !== "services.html") return;

    const logo = document.querySelector("header img[alt='wow-agency-logo.png']");
    if (logo) logo.classList.replace("h-14", "h-16");
  }

  function addContactIntro() {
    if (!window.location.pathname.endsWith("contact.html") || document.querySelector(".contact-intro")) return;

    const section = document.querySelector("main section");
    if (!section) return;

    const intro = document.createElement("div");
    intro.className = "contact-intro w-full max-w-2xl mx-auto mb-space-xl text-center";
    intro.innerHTML = `
      <span class="font-label-eyebrow text-label-eyebrow uppercase tracking-[0.14em] text-on-surface-variant">START A CONVERSATION</span>
      <h1 class="font-headline-xl text-headline-xl text-on-surface mt-space-sm">Let's make something people remember.</h1>
      <p class="font-body-lead text-body-lead text-on-surface-variant mt-space-sm max-w-xl mx-auto">Tell us what matters, who it is for, and the reaction you want to create. We will shape the right experience with you.</p>`;
    section.insertBefore(intro, section.firstElementChild);
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
  ------------------------------------------------------------------ */
  function initContactAutoScroll() {
    const form = document.getElementById("projectBriefForm");
    const formSection = form && (form.closest(".bg-surface-container-lowest") || form);
    if (!formSection) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector("header");
    const offset = (header ? header.offsetHeight : 80) + 16;

    function scrollToForm() {
      const y = formSection.getBoundingClientRect().top + window.pageYOffset - offset;
      if (reduceMotion) {
        window.scrollTo({ top: y, behavior: "auto" });
        return;
      }

      const start = window.pageYOffset;
      const distance = y - start;
      const duration = 1200;
      const startedAt = performance.now();

      function glide(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        window.scrollTo(0, start + distance * eased);
        if (progress < 1) window.requestAnimationFrame(glide);
      }

      window.requestAnimationFrame(glide);
    }

    // Small delay so it doesn't fight the page-fade-in transition.
    window.addEventListener("load", () => setTimeout(scrollToForm, 300));
  }

  function init() {
    initPageNavigation();
    restorePageScroll();
    clearFormPlaceholders();
    enlargeSectionPageLogo();
    addContactIntro();
    removeProductionTier();
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