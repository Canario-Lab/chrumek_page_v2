const themeStorageKey = "chrum-theme";
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.getElementById("themeToggleIcon");

const getThemeLabel = (theme) => {
  if (theme === "dark") {
    return {
      label: document.body.dataset.themeLabelDark || "Motyw strony: ciemny. Przełącz na jasny.",
      title: document.body.dataset.themeTitleDark || "Motyw strony: ciemny"
    };
  }

  return {
    label: document.body.dataset.themeLabelLight || "Motyw strony: jasny. Przełącz na ciemny.",
    title: document.body.dataset.themeTitleLight || "Motyw strony: jasny"
  };
};

const applyTheme = (theme) => {
  const safeTheme = theme === "dark" ? "dark" : "light";
  const { label, title } = getThemeLabel(safeTheme);

  document.body.setAttribute("data-theme", safeTheme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", title);
  }

  if (themeToggleIcon) {
    themeToggleIcon.textContent = safeTheme === "dark" ? "☀" : "☾";
  }
};

let savedTheme = "light";

try {
  savedTheme = localStorage.getItem(themeStorageKey) || "light";
} catch (error) {
  savedTheme = "light";
}

applyTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);

  try {
    localStorage.setItem(themeStorageKey, nextTheme);
  } catch (error) {
    // localStorage can be unavailable in private contexts.
  }
});

const langSwitch = document.querySelector("[data-lang-switch]");

if (langSwitch) {
  const langToggle = langSwitch.querySelector(".lang-toggle");
  const langMenu = langSwitch.querySelector(".lang-menu");
  const langLinks = Array.from(langSwitch.querySelectorAll(".lang-option"));

  const setMenuOpen = (open) => {
    langSwitch.classList.toggle("is-open", open);

    if (langToggle) {
      langToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
  };

  const updateLangHrefs = () => {
    const hash = window.location.hash || "";

    langLinks.forEach((link) => {
      const base = link.getAttribute("data-base") || link.getAttribute("href");
      link.setAttribute("href", `${base}${hash}`);
    });
  };

  updateLangHrefs();
  window.addEventListener("hashchange", updateLangHrefs);

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen(!langSwitch.classList.contains("is-open"));
    });

    langLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          setMenuOpen(false);
          return;
        }

        event.preventDefault();

        const href = link.getAttribute("href");
        setMenuOpen(false);

        if (href) {
          window.location.href = href;
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (langSwitch.contains(event.target)) return;
      setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
    });
  }
}

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}
