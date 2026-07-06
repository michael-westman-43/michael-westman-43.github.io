const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const header = $(".site-header");
const menu = $(".menu-toggle");
const links = $(".nav-links");
const themeBtn = $(".theme-toggle");
const year = $("#year");

if (menu && links) {
  menu.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 })
  : null;

$$(".reveal").forEach((element) => {
  if (revealObserver) {
    revealObserver.observe(element);
  } else {
    element.classList.add("visible");
  }
});

window.addEventListener("scroll", () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }
});

$$("[data-count]").forEach((element) => {
  const target = Number(element.dataset.count || "0");
  const suffix = element.dataset.suffix || "";
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));

  const run = () => {
    current = Math.min(target, current + step);
    element.textContent = `${current}${suffix}`;
    if (current < target) requestAnimationFrame(run);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        run();
        countObserver.disconnect();
      }
    }, { threshold: 0.5 });
    countObserver.observe(element);
  } else {
    run();
  }
});

if (themeBtn) {
  const key = `portfolio-theme-${document.body.dataset.person || "default"}`;
  const savedTheme = localStorage.getItem(key);

  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  }

  themeBtn.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(key, nextTheme);
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}
