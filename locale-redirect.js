(function () {
  var root = document.documentElement;
  var base = root.dataset.redirectBase || ".";
  var suffix = root.dataset.redirectSuffix || "/";
  var defaultLocale = root.dataset.defaultLocale || "en";
  var supportedLocales = (root.dataset.supportedLocales || "pl,en,es,de,fr,it,pt-BR,pt-PT,tr")
    .split(",")
    .map(function (locale) {
      return locale.trim();
    })
    .filter(Boolean);

  function normalizeBase(path) {
    return path.slice(-1) === "/" ? path : path + "/";
  }

  function normalizeSuffix(path) {
    if (!path) return "/";
    if (path.charAt(0) !== "/") return "/" + path;
    return path;
  }

  function supports(locale) {
    return supportedLocales.indexOf(locale) !== -1;
  }

  function detectTargetLanguage(list) {
    for (var i = 0; i < list.length; i += 1) {
      var raw = list[i];
      if (typeof raw !== "string") continue;
      var lang = raw.trim().toLowerCase();

      if (supports("pl") && lang.indexOf("pl") === 0) return "pl";
      if (supports("en") && lang.indexOf("en") === 0) return "en";
      if (supports("es") && lang.indexOf("es") === 0) return "es";
      if (supports("de") && lang.indexOf("de") === 0) return "de";
      if (supports("fr") && lang.indexOf("fr") === 0) return "fr";
      if (supports("it") && lang.indexOf("it") === 0) return "it";
      if (supports("pt-BR") && lang.indexOf("pt-br") === 0) return "pt-BR";
      if (supports("pt-PT") && lang.indexOf("pt-pt") === 0) return "pt-PT";
      if (lang === "pt") {
        if (supports("pt-BR")) return "pt-BR";
        if (supports("pt-PT")) return "pt-PT";
      }
      if (supports("tr") && lang.indexOf("tr") === 0) return "tr";
    }

    return supports(defaultLocale) ? defaultLocale : supportedLocales[0] || "en";
  }

  var langs = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language || defaultLocale];

  var target = detectTargetLanguage(langs);
  var destination = normalizeBase(base) + target + normalizeSuffix(suffix);
  var search = window.location.search || "";
  var hash = window.location.hash || "";

  window.location.replace(destination + search + hash);
})();
