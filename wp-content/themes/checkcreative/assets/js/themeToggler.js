export function initCookieDarkLight() {
  // Function to toggle theme
  function initThemeCheck() {
    // Get the element that has [data-dash-theme] attribute
    const dashThemeElement = document.querySelector("[data-theme-status]");
    if (!dashThemeElement) return;

    // Toggle between light/dark
    const currentTheme = dashThemeElement.getAttribute("data-theme-status");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    dashThemeElement.setAttribute("data-theme-status", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  // Keydown to toggle theme when Shift + T is pressed
  document.addEventListener("keydown", function (e) {
    const tagName = e.target.tagName.toLowerCase();
    if (
      tagName === "input" ||
      tagName === "textarea" ||
      e.target.isContentEditable
    ) {
      return; // Do nothing if typing into a field
    }

    if (e.shiftKey && e.keyCode === 84) {
      // Shift+T
      e.preventDefault();
      initThemeCheck();
    }
  });

  // For all elements with [data-theme-toggle], add click handler
  document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
    button.addEventListener("click", initThemeCheck);
  });

  // If theme cookie is 'dark', set theme to dark
  if (localStorage.getItem("theme") === "dark") {
    const themeElement = document.querySelector("[data-theme-status]");
    if (themeElement) {
      themeElement.setAttribute("data-theme-status", "dark");
    }
  }
}
