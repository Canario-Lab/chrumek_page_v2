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
  const currentLang = document.documentElement.lang || "en";
  const normalizedCurrentLang = currentLang.toLocaleLowerCase();
  const languageOptions = [
    { code: "pl", label: "Polski" },
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "Français" },
    { code: "it", label: "Italiano" },
    { code: "pt-BR", label: "Português (BR)" },
    { code: "pt-PT", label: "Português (PT)" },
    { code: "tr", label: "Türkçe" },
    { code: "bg", label: "Български" },
    { code: "cs", label: "Čeština" },
    { code: "da", label: "Dansk" },
    { code: "el", label: "Ελληνικά" },
    { code: "fi", label: "Suomi" },
    { code: "hr", label: "Hrvatski" },
    { code: "hu", label: "Magyar" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "nl", label: "Nederlands" },
    { code: "no", label: "Norsk" },
    { code: "ro", label: "Română" },
    { code: "ru", label: "Русский" },
    { code: "sk", label: "Slovenčina" },
    { code: "sl", label: "Slovenščina" },
    { code: "sv", label: "Svenska" },
    { code: "uk", label: "Українська" },
    { code: "vi", label: "Tiếng Việt" },
    { code: "zh-Hans", label: "简体中文" }
  ];

  const getLanguagePageSuffix = () => {
    const path = window.location.pathname.replace(/index\.html$/i, "");

    if (/\/privacy\/?$/i.test(path)) {
      return "privacy/";
    }

    if (/\/terms\/?$/i.test(path)) {
      return "terms/";
    }

    return "";
  };

  const buildLanguageHref = (code) => {
    const suffix = getLanguagePageSuffix();
    const basePrefix = suffix ? "../../" : "../";
    return `${basePrefix}${code}/${suffix}`;
  };

  const buildLanguageOption = ({ code, label }) => {
    const href = buildLanguageHref(code);
    const link = document.createElement("a");
    const isCurrent = code.toLocaleLowerCase() === normalizedCurrentLang;

    link.className = `lang-option${isCurrent ? " is-active" : ""}`;
    link.href = href;
    link.dataset.base = href;
    link.lang = code;
    link.hreflang = code;
    link.setAttribute("role", "menuitem");

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    }

    const main = document.createElement("span");
    main.className = "lang-option-main";

    const name = document.createElement("span");
    name.textContent = label;

    const check = document.createElement("span");
    check.className = "lang-option-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";

    main.append(name);
    link.append(main, check);

    return link;
  };

  if (langMenu) {
    const existingLinks = Array.from(langSwitch.querySelectorAll(".lang-option"));
    const existingLocales = new Map(existingLinks.map((link) => [
      (link.getAttribute("hreflang") || link.lang || "").toLocaleLowerCase(),
      link
    ]));

    languageOptions.forEach((option) => {
      const normalizedCode = option.code.toLocaleLowerCase();
      const existingLink = existingLocales.get(normalizedCode);

      if (existingLink) {
        const href = buildLanguageHref(option.code);
        existingLink.href = href;
        existingLink.dataset.base = href;
        existingLink.lang = option.code;
        existingLink.hreflang = option.code;
        return;
      }

      langMenu.append(buildLanguageOption(option));
    });
  }

  const langLinks = Array.from(langSwitch.querySelectorAll(".lang-option"));
  const languagePickerLabels = {
    bg: { search: "Търси език", empty: "Няма намерени езици" },
    cs: { search: "Hledat jazyk", empty: "Žádné jazyky nenalezeny" },
    da: { search: "Søg efter sprog", empty: "Ingen sprog fundet" },
    de: { search: "Sprache suchen", empty: "Keine Sprachen gefunden" },
    el: { search: "Αναζήτηση γλώσσας", empty: "Δεν βρέθηκαν γλώσσες" },
    en: { search: "Search language", empty: "No languages found" },
    es: { search: "Buscar idioma", empty: "No se encontraron idiomas" },
    fi: { search: "Etsi kieltä", empty: "Kieliä ei löytynyt" },
    fr: { search: "Rechercher une langue", empty: "Aucune langue trouvée" },
    hr: { search: "Pretraži jezik", empty: "Nema pronađenih jezika" },
    hu: { search: "Nyelv keresése", empty: "Nincs találat" },
    it: { search: "Cerca lingua", empty: "Nessuna lingua trovata" },
    ja: { search: "言語を検索", empty: "言語が見つかりません" },
    ko: { search: "언어 검색", empty: "언어를 찾을 수 없습니다" },
    nl: { search: "Taal zoeken", empty: "Geen talen gevonden" },
    no: { search: "Søk etter språk", empty: "Ingen språk funnet" },
    pl: { search: "Szukaj języka", empty: "Nie znaleziono języka" },
    "pt-BR": { search: "Buscar idioma", empty: "Nenhum idioma encontrado" },
    "pt-PT": { search: "Procurar idioma", empty: "Nenhum idioma encontrado" },
    ro: { search: "Caută limba", empty: "Nu s-au găsit limbi" },
    ru: { search: "Поиск языка", empty: "Языки не найдены" },
    sk: { search: "Hľadať jazyk", empty: "Nenašli sa žiadne jazyky" },
    sl: { search: "Poišči jezik", empty: "Ni najdenih jezikov" },
    sv: { search: "Sök språk", empty: "Inga språk hittades" },
    tr: { search: "Dil ara", empty: "Dil bulunamadı" },
    uk: { search: "Пошук мови", empty: "Мови не знайдено" },
    vi: { search: "Tìm ngôn ngữ", empty: "Không tìm thấy ngôn ngữ" },
    "zh-Hans": { search: "搜索语言", empty: "未找到语言" }
  };
  const labels = languagePickerLabels[currentLang] || languagePickerLabels[currentLang.split("-")[0]] || languagePickerLabels.en;
  const mobileSheetQuery = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)");
  let langSearchInput = null;
  let langEmptyState = null;
  let langSheetClose = null;

  if (langMenu) {
    langMenu.setAttribute("role", "dialog");
    langLinks.forEach((link) => link.removeAttribute("role"));
  }

  if (langToggle) {
    langToggle.setAttribute("aria-haspopup", "dialog");
  }

  if (langMenu && langLinks.length > 8) {
    const grabber = document.createElement("div");
    grabber.className = "lang-menu-grabber";
    grabber.setAttribute("aria-hidden", "true");

    const searchWrap = document.createElement("div");
    searchWrap.className = "lang-search-wrap";

    const sheetHeader = document.createElement("div");
    sheetHeader.className = "lang-sheet-header";

    const sheetTitle = document.createElement("p");
    sheetTitle.className = "lang-sheet-title";
    sheetTitle.textContent = langToggle?.getAttribute("aria-label") || labels.search;

    langSheetClose = document.createElement("button");
    langSheetClose.className = "lang-sheet-close";
    langSheetClose.type = "button";
    langSheetClose.setAttribute("aria-label", "Close language selector");
    langSheetClose.textContent = "×";

    langSearchInput = document.createElement("input");
    langSearchInput.className = "lang-search";
    langSearchInput.type = "search";
    langSearchInput.autocomplete = "off";
    langSearchInput.spellcheck = false;
    langSearchInput.placeholder = labels.search;
    langSearchInput.setAttribute("aria-label", labels.search);

    langEmptyState = document.createElement("p");
    langEmptyState.className = "lang-empty";
    langEmptyState.hidden = true;
    langEmptyState.textContent = labels.empty;

    sheetHeader.append(sheetTitle, langSheetClose);
    searchWrap.append(langSearchInput);
    langMenu.prepend(searchWrap);
    langMenu.prepend(sheetHeader);
    langMenu.prepend(grabber);
    langMenu.append(langEmptyState);
  }

  const setMenuOpen = (open) => {
    langSwitch.classList.toggle("is-open", open);
    document.body.classList.toggle("lang-sheet-open", open && mobileSheetQuery.matches);

    if (langToggle) {
      langToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (langMenu) {
      langMenu.setAttribute("aria-modal", open && mobileSheetQuery.matches ? "true" : "false");
    }

    if (open && langMenu) {
      langMenu.scrollTop = 0;
    }

    if (!open && langSearchInput) {
      langSearchInput.value = "";
      filterLanguageOptions("");
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

  const getVisibleLangLinks = () => langLinks.filter((link) => !link.hidden);

  const focusVisibleOption = (direction = 1) => {
    const visibleLinks = getVisibleLangLinks();
    if (!visibleLinks.length) return;

    const focusedIndex = visibleLinks.indexOf(document.activeElement);
    const activeIndex = visibleLinks.findIndex((link) => link.classList.contains("is-active"));
    const baseIndex = focusedIndex >= 0 ? focusedIndex : Math.max(activeIndex, 0) - direction;
    const nextIndex = (baseIndex + direction + visibleLinks.length) % visibleLinks.length;
    visibleLinks[nextIndex].focus();
  };

  const filterLanguageOptions = (query) => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let visibleCount = 0;

    langLinks.forEach((link) => {
      const haystack = [
        link.textContent,
        link.getAttribute("lang"),
        link.getAttribute("hreflang")
      ].join(" ").toLocaleLowerCase();
      const isVisible = !normalizedQuery || haystack.includes(normalizedQuery);
      link.hidden = !isVisible;
      visibleCount += isVisible ? 1 : 0;
    });

    if (langEmptyState) {
      langEmptyState.hidden = visibleCount > 0;
    }
  };

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const shouldOpen = !langSwitch.classList.contains("is-open");
      setMenuOpen(shouldOpen);

      if (shouldOpen && langSearchInput && !mobileSheetQuery.matches) {
        window.setTimeout(() => langSearchInput.focus(), 0);
      }
    });

    langToggle.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      setMenuOpen(true);
      focusVisibleOption(event.key === "ArrowDown" ? 1 : -1);
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

    langMenu.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        focusVisibleOption(event.key === "ArrowDown" ? 1 : -1);
        return;
      }

      if (event.key !== "Home" && event.key !== "End") return;

      const visibleLinks = getVisibleLangLinks();
      if (!visibleLinks.length) return;

      event.preventDefault();
      visibleLinks[event.key === "Home" ? 0 : visibleLinks.length - 1].focus();
    });

    langSearchInput?.addEventListener("input", (event) => {
      filterLanguageOptions(event.target.value);
    });

    langSearchInput?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      focusVisibleOption(1);
    });

    langSheetClose?.addEventListener("click", () => {
      setMenuOpen(false);
      langToggle.focus();
    });

    langSwitch.addEventListener("click", (event) => {
      if (event.target !== langSwitch) return;
      setMenuOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (langSwitch.contains(event.target)) return;
      setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
    });

    const syncSheetLock = () => {
      document.body.classList.toggle("lang-sheet-open", langSwitch.classList.contains("is-open") && mobileSheetQuery.matches);
    };

    if (mobileSheetQuery.addEventListener) {
      mobileSheetQuery.addEventListener("change", syncSheetLock);
    } else {
      mobileSheetQuery.addListener(syncSheetLock);
    }
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
