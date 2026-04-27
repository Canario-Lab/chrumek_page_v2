const themeStorageKey = "chrum-theme";
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const langToggle = document.querySelector("[data-lang-toggle]");

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

langToggle?.addEventListener("click", (event) => {
  event.preventDefault();
});

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
