import { toggleScrollLock } from "./initLenis.js";

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    expires = "; expires=" + d.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(name + "="))
      ?.split("=")[1] || null
  );
}

export function isAgeVerified() {
  return (
    localStorage.getItem("age_gate_adult") === "1" ||
    getCookie("age_gate_adult") === "1"
  );
}

export function resetAgeGate() {
  localStorage.removeItem("age_gate_adult");
  sessionStorage.removeItem("age_gate_denied");
  const base = "age_gate_adult=; path=/; SameSite=Lax";
  document.cookie = `${base}; Max-Age=0`;
  document.cookie = `${base}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

let inited = false;

export function secheckcreativegeGate() {
  if (inited) return;
  inited = true;

  const modalEl = document.getElementById("ageGateModal");
  if (!modalEl) return;

  const askView = modalEl.querySelector(".js-ag-ask");
  const deniedView = modalEl.querySelector(".js-ag-denied");
  const btnYes = modalEl.querySelector("#age-yes");
  const btnNo = modalEl.querySelector("#age-no");
  const btnClose = modalEl.querySelector(".js-ag-close");

  const hasBootstrap = !!(window.bootstrap && window.bootstrap.Modal);
  const bsInstance = hasBootstrap
    ? new window.bootstrap.Modal(modalEl, {
        backdrop: "static",
        keyboard: false,
      })
    : null;

  function hidePrelock() {
    document.documentElement.classList.remove("age-prelock");
    const veil = document.getElementById("age-prelock-veil");
    if (veil && veil.parentNode) veil.parentNode.removeChild(veil);
  }

  function ensureBackdrop() {
    if (document.querySelector(".modal-backdrop.agegate-backdrop")) return;
    const b = document.createElement("div");
    b.className = "modal-backdrop agegate-backdrop";
    document.body.appendChild(b);
    requestAnimationFrame(() => b.classList.add("show"));
  }

  function removeBackdrop() {
    const b = document.querySelector(".modal-backdrop.agegate-backdrop");
    if (b) b.parentNode.removeChild(b);
  }

  function showModal() {
    toggleScrollLock(true);
    if (hasBootstrap) {
      bsInstance.show();
    } else {
      modalEl.classList.add("agegate-fallback");
      ensureBackdrop();
      requestAnimationFrame(() => {
        modalEl.classList.add("show");
      });
    }
    hidePrelock();
  }

  function hideModal() {
    if (hasBootstrap) {
      bsInstance.hide();
    } else {
      modalEl.classList.remove("show");
      const b = document.querySelector(".modal-backdrop.agegate-backdrop");
      if (b) b.classList.remove("show");
      setTimeout(() => {
        removeBackdrop();
        modalEl.classList.remove("agegate-fallback");
      }, 250);
    }
    toggleScrollLock(false);
  }

  function showAsk() {
    if (btnClose) btnClose.classList.remove("d-none");
    askView.classList.remove("d-none");
    deniedView.classList.add("d-none");
    showModal();
  }

  function showDenied() {
    askView.classList.add("d-none");
    deniedView.classList.remove("d-none");
    if (btnClose) btnClose.classList.add("d-none");
    showModal();
    window.dispatchEvent(new CustomEvent("ageGate:denied"));
  }

  const isAdultLS = localStorage.getItem("age_gate_adult") === "1";
  const isAdultCookie = getCookie("age_gate_adult") === "1";
  const deniedSession = sessionStorage.getItem("age_gate_denied") === "1";

  if (isAdultLS || isAdultCookie) {
    hidePrelock();
  } else if (deniedSession) {
    showDenied();
  } else {
    showAsk();
  }

  if (btnYes) {
    btnYes.addEventListener("click", () => {
      localStorage.setItem("age_gate_adult", "1");
      setCookie("age_gate_adult", "1", 30);
      hideModal();
      window.dispatchEvent(new CustomEvent("ageGate:granted"));
    });
  }

  if (btnNo) {
    btnNo.addEventListener("click", () => {
      sessionStorage.setItem("age_gate_denied", "1");
      showDenied();
    });
  }

  modalEl.addEventListener("hidden.bs.modal", () => toggleScrollLock(false));
}
