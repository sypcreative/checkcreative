export const toggleBillingForm = () => {
  console.log("toggleBillingForm");
  const checkbox = document.querySelector(".js-billing-toggle");
  const wrapper = document.querySelector(".billing-fields-wrapper"); // ← clase

  if (!checkbox || !wrapper) {
    console.warn("No se encontró el checkbox o el wrapper de facturación.");
    return;
  }
  /* Marcar qué inputs eran required */
  if (!wrapper.dataset.prepared) {
    wrapper.querySelectorAll("[required]").forEach((el) => {
      el.dataset.originalRequired = "1";
    });
    wrapper.dataset.prepared = "1";
  }

  function toggle() {
    const show = checkbox.checked;
    wrapper.classList.toggle("d-none", !show);

    wrapper.querySelectorAll('[data-original-required="1"]').forEach((el) => {
      show
        ? el.setAttribute("required", "required")
        : el.removeAttribute("required");
    });
  }

  checkbox.addEventListener("change", toggle);
  toggle(); // estado inicial
};
