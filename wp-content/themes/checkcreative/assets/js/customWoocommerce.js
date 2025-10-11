import gsap from "gsap";

function initMiniCheckout(formContainer) {
  const $ = window.jQuery;
  if (!$) return;

  const $form = (formContainer ? $(formContainer) : $(document)).find(
    "form.woocommerce-checkout"
  );
  if (!$form.length) return;

  const prefer = ["woocommerce_payments", "stripe"];
  let $radio = null;
  for (const id of prefer) {
    const $r = $form.find(`input[name="payment_method"][value="${id}"]`);
    if ($r.length) {
      $radio = $r;
      break;
    }
  }
  if (!$radio) $radio = $form.find('input[name="payment_method"]').first();
  if ($radio && !$radio.is(":checked")) {
    $radio.prop("checked", true).trigger("change");
  }

  if (window.wc_checkout_form) {
    if (typeof window.wc_checkout_form.init === "function") {
      window.wc_checkout_form.$checkout_form = $form;
      window.wc_checkout_form.init();
    } else if (typeof window.wc_checkout_form === "function") {
      window.wc_checkout_form = new window.wc_checkout_form($form);
    }
  }

  const $btn = $form.find("#place_order");

  function syncPlaceOrderText() {
    const $checked = $form.find('input[name="payment_method"]:checked');
    let txt = $checked.data("order_button_text");

    if (
      !txt &&
      window.wc_checkout_params &&
      window.wc_checkout_params.i18n_place_order
    ) {
      txt = window.wc_checkout_params.i18n_place_order;
    }
    if (!txt)
      txt = $btn.is("input")
        ? $btn.attr("data-value") || $btn.val()
        : $btn.attr("data-value") || $btn.text();

    if ($btn.is("input")) {
      $btn.val(txt).attr("data-value", txt);
    } else {
      $btn.text(txt).attr("data-value", txt);
    }
  }

  function ensurePlaceOrderVisible() {
    const method = $form.find('input[name="payment_method"]:checked').val();
    if (method === "ppcp-gateway" && $btn.length) {
      $btn.removeClass("ppcp-hidden").prop("disabled", false).show();
    }
  }

  jQuery(document.body).trigger("country_to_state_changed");
  jQuery(document.body).trigger("init_checkout");
  jQuery(document.body).trigger("updated_checkout");
  jQuery(document.body).trigger("wc-credit-card-form-init");
  jQuery(document.body).trigger("payment_method_selected");
  syncPlaceOrderText();
  ensurePlaceOrderVisible();

  $form
    .off(".mini-rebind")
    .on("change.mini-rebind", 'input[name="payment_method"]', function () {
      jQuery(document.body).trigger("payment_method_selected");
      jQuery(document.body).trigger("updated_checkout");
      syncPlaceOrderText();
      ensurePlaceOrderVisible();
    })
    .on("change.mini-rebind", "input, select, textarea", function () {
      jQuery(document.body).trigger("updated_checkout");
      setTimeout(syncPlaceOrderText, 0);
    });

  jQuery(document.body)
    .off(".mini-sync")
    .on("updated_checkout.mini-sync", function () {
      syncPlaceOrderText();
      ensurePlaceOrderVisible();
    });

  if ($btn.length) {
    const obs = new MutationObserver(() => ensurePlaceOrderVisible());
    obs.observe($btn[0], {
      attributes: true,
      attributeFilter: ["class", "style", "disabled"],
    });
  }

  const methods = $form
    .find('input[name="payment_method"]')
    .map(function () {
      return this.value;
    })
    .get();
  console.log("[mini-checkout] Métodos:", methods);
}

function openMiniCheckout(e) {
  if (e) e.preventDefault();

  const wrapper = document.getElementById("mini-checkout-wrapper");
  const formContainer = document.getElementById("mini-checkout-form");
  if (!wrapper || !formContainer) return;

  if (!formContainer.dataset.prepared) {
    const checkbox = formContainer.querySelector(".js-billing-toggle");
    const billingWrapper = formContainer.querySelector(
      ".billing-fields-wrapper"
    );
    if (checkbox && billingWrapper) {
      if (!billingWrapper.dataset.prepared) {
        billingWrapper.querySelectorAll("[required]").forEach((el) => {
          el.dataset.originalRequired = "1";
        });
        billingWrapper.dataset.prepared = "1";
      }
      const toggle = () => {
        const show = checkbox.checked;
        billingWrapper.classList.toggle("d-none", !show);
        billingWrapper
          .querySelectorAll('[data-original-required="1"]')
          .forEach((el) => {
            show
              ? el.setAttribute("required", "required")
              : el.removeAttribute("required");
          });
      };
      checkbox.addEventListener("change", toggle);
      toggle();
    }
    formContainer.dataset.prepared = "1";
  }

  wrapper.style.transform = "translateY(0%)";

  initMiniCheckout(formContainer);
}

// mini-cart.js
export function initMiniCartDrawerWoocommerce() {
  const drawer = document.getElementById("mini-cart-drawer");
  if (!drawer) return;

  // Único contenedor que debe scrollear
  const listEl = drawer.querySelector("#mini-cart-items");

  // --- Bloqueo / desbloqueo de scroll del fondo (iOS/Android/Desktop)
  let scrollLocked = false;
  let pageScrollY = 0;

  function lockScroll() {
    if (scrollLocked) return;
    scrollLocked = true;

    pageScrollY = window.scrollY || document.documentElement.scrollTop || 0;

    // Android/desktop
    document.documentElement.style.overflow = "hidden";

    // iOS-friendly lock
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${pageScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.classList.add("is-scroll-locked");
  }

  function unlockScroll() {
    if (!scrollLocked) return;
    scrollLocked = false;

    document.documentElement.style.overflow = "";

    const body = document.body;
    body.classList.remove("is-scroll-locked");
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";

    window.scrollTo(0, pageScrollY);
  }

  // iOS “rubber band” guard: evita que el gesto salte del contenedor al body.
  if (listEl) {
    listEl.addEventListener(
      "touchstart",
      function () {
        const atTop = this.scrollTop <= 0;
        const atBottom =
          this.scrollTop + this.clientHeight >= this.scrollHeight;

        // Empuja 1px dentro para que iOS no haga bounce hacia el body
        if (atTop) this.scrollTop = 1;
        if (atBottom)
          this.scrollTop = this.scrollHeight - this.clientHeight - 1;
      },
      { passive: true }
    );

    // Si la lista no tiene overflow real, evita que el gesto afecte al body
    listEl.addEventListener(
      "touchmove",
      (ev) => {
        if (listEl.scrollHeight <= listEl.clientHeight) {
          ev.preventDefault();
        }
      },
      { passive: false }
    );
  }

  removeFromMiniCartWoocommerce();

  const openDrawer = () => {
    lockScroll();
    gsap.fromTo(
      drawer,
      { y: "-100%" },
      { y: "0%", duration: 0.5, ease: "power3.inOut" }
    );
  };

  const closeDrawer = () => {
    gsap.to(drawer, {
      y: "-100%",
      duration: 0.4,
      ease: "power2.in",
      onComplete: unlockScroll,
    });
  };

  document.addEventListener("wc-blocks_added_to_cart", openDrawer);
  if (window.jQuery) {
    jQuery(document.body).on("added_to_cart", openDrawer);
  }

  // --- helper: pide peso al servidor
  async function getCartWeight(btn) {
    const nonce = btn?.dataset?.weightNonce || "";
    const endpoint =
      window.wc_cart_params && wc_cart_params.wc_ajax_url
        ? wc_cart_params.wc_ajax_url.replace(
            "%%endpoint%%",
            "preview_cart_weight"
          )
        : "?wc-ajax=preview_cart_weight";

    const body = new URLSearchParams();
    body.append("nonce", nonce);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: body.toString(),
      credentials: "same-origin",
    }).then((r) => r.json());

    if (
      res &&
      res.success &&
      res.data &&
      typeof res.data.weight_kg !== "undefined"
    ) {
      return parseFloat(res.data.weight_kg);
    }
    throw new Error(
      res?.data?.message || "No se pudo obtener el peso del carrito"
    );
  }

  // --- delegación de eventos
  document.addEventListener("click", async (e) => {
    const target = e.target;

    // 1) Botón "Finalizar compra" del mini-cart
    const checkoutBtn = target.closest("#open-mini-checkout, .mc-checkout");
    if (checkoutBtn) {
      e.preventDefault();
      if (checkoutBtn.dataset.busy === "1") return;
      checkoutBtn.dataset.busy = "1";

      try {
        const kg = await getCartWeight(checkoutBtn);
        if (!isNaN(kg) && kg > 50) {
          alert(
            "¡Eh! Tu carrito supera los 50 kg y no puede efectuarse el envío."
          );
          checkoutBtn.dataset.busy = "0";
          return;
        }

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          const url = checkoutBtn.dataset.checkoutUrl || "/finalizar-compra/";
          window.location.href = url;
        } else {
          // Abre tu modal/mini-checkout
          openMiniCheckout(e);
        }
      } catch (err) {
        console.warn(err);
        alert("No se pudo verificar el peso del carrito. Inténtalo de nuevo.");
      } finally {
        checkoutBtn.dataset.busy = "0";
      }
      return;
    }

    // 2) Cerrar por botón específico
    const clickedCloseButton = target.matches(
      '.mc-close, [data-dismiss="drawer"]'
    );
    if (clickedCloseButton) {
      closeDrawer();
      return;
    }

    // 3) Cerrar por click fuera del drawer (y no sobre el mini-checkout)
    const clickedOutsideDrawer = !target.closest("#mini-cart-drawer");
    const clickedOutsideCheckout = !target.closest("#mini-checkout-wrapper");
    const clickedInsideCheckoutBtn = target.closest(".mc-checkout");
    if (
      clickedOutsideDrawer &&
      clickedOutsideCheckout &&
      !clickedInsideCheckoutBtn
    ) {
      closeDrawer();
      return;
    }
  });

  // 4) Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

export function removeFromMiniCartWoocommerce() {
  jQuery(document).on("click", ".mc-remove", function (e) {
    console.log("removeFromMiniCartWoocommerce");
    e.preventDefault();

    const $btn = jQuery(this);
    const cartKey = $btn.data("cart-key");

    jQuery.post(
      checkcreative_ajax.ajaxUrl,
      {
        action: "checkcreative_remove_from_mini_cart",
        security: checkcreative_ajax.nonce,
        key: cartKey,
      },
      (res) => {
        if (!res.success) return;

        /* 1. Refresca todos los fragments que te devuelve PHP */
        if (res.data.fragments) {
          Object.entries(res.data.fragments).forEach(([sel, html]) => {
            const el = document.querySelector(sel);
            if (!el) return;

            // El <ul> .mc-items se reemplaza completo
            if (sel === "#mini-cart-items") {
              const wrapper = document.createElement("div");
              wrapper.innerHTML = html.trim();
              const newUl = wrapper.firstElementChild;
              if (newUl) {
                el.replaceWith(newUl);
                // Los nuevos botones dentro del <ul> también necesitan listener
              }
            } else {
              el.innerHTML = html;
            }
          });
        }

        /* 2. Elimina la fila del producto */
        $btn.closest(".mc-item")?.remove();

        updateTotalQty();
      }
    );
  });
}

export function filterBarWoocommerce() {
  const sidebar = document.getElementById("shopSidebar");
  const toggleBtn = document.getElementById("sidebarToggle");
  const filterButtons = document.querySelectorAll(".cat-filter-btn");
  const productsContainer = document.querySelector(".shop-products__scroll");

  let isOpen = false;

  const mq = window.matchMedia("(max-width: 768px)");

  function openSidebar() {
    if (mq.matches) {
      // MOBILE: altura
      gsap.to(sidebar, {
        height: "auto",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      // DESKTOP: anchura
      gsap.to(sidebar, {
        width: 350,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }

  function closeSidebar() {
    if (mq.matches) {
      gsap.to(sidebar, {
        height: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    } else {
      gsap.to(sidebar, {
        width: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }

  if (mq.matches) {
    gsap.set(sidebar, { height: 0 });
  } else {
    gsap.set(sidebar, { width: 0 });
  }

  toggleBtn?.addEventListener("click", () => {
    if (!isOpen) {
      openSidebar();
    } else {
      closeSidebar();
    }
    isOpen = !isOpen;
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const categorySlug = button.dataset.cat;

      // Botón activo
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      productsContainer.innerHTML = "<p>Cargando productos...</p>";

      fetch(checkcreative_ajax.ajaxUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "load_filtered_products",
          category: categorySlug,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          productsContainer.innerHTML = data.html;
        });
    });
  });
}

// Add multiplier logic to the "Añadir al carrito" button
export function addToCartMultiplierWoocommerce() {
  jQuery(function ($) {
    $(document).on("click", ".dropdown-item[data-multiplier]", function () {
      const $item = $(this);
      const multiplier = parseInt($item.data("multiplier"), 10) || 1;
      const productId = $item.data("product-id");

      /* elementos de la tarjeta */
      const $card = $item.closest(".product-card");
      const $addBtn = $card.find(
        '.add_to_cart_button[data-product_id="' + productId + '"]'
      );
      const $label = $card.find(".dropdown-label");
      const unitPrice = parseFloat($addBtn.data("price"));

      $label.text($item.text().trim());

      $addBtn.attr("data-quantity", multiplier);

      const total = (unitPrice * multiplier).toFixed(2);

      $addBtn.attr("data-price", total);

      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(total);

      $addBtn.html("Añadir – " + formatted);
    });
  });
}

/**
 * Sincroniza el botón “Añadir al carrito” de la ficha de producto
 * con la cantidad total elegida en los selectores de unidades.
 *  - Muestra 0,00 € y queda deshabilitado cuando total === 0
 *  - Actualiza data-quantity, texto y estado en cualquier cambio
 */
//REVISARRRRRR
function syncAddToCartBtn() {
  // 1. Localizamos SOLO el botón de la ficha, no los de listados
  const btn = document.querySelector(".product-page .add_to_cart_button");
  if (!btn) return;

  // 2. Cantidad total de unidades seleccionadas
  const total = parseInt(document.getElementById("total-qty")?.value || 0, 10);

  // 3. Precio unitario (lo pusiste en data-unit_price o data-price)
  const unit = parseFloat(btn.dataset.unit_price || btn.dataset.price || 0);

  // 4. Calculamos precio total y formateamos
  const totalPriceNumber = unit * total;
  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(totalPriceNumber);

  // 5. Actualizamos atributos y etiqueta
  btn.dataset.quantity = total; // lo leerá Woo AJAX
  btn.innerHTML = "Añadir – " + formattedPrice;
  btn.disabled = total === 0; // bloquea o habilita
  btn.classList.toggle("disabled", total === 0);
}

// Función que actualiza el total general de productos en #total-qty
export function updateTotalQty() {
  const totalQty = document.getElementById("total-qty");
  const container = document.querySelector(".product-page__content");
  if (!totalQty || !container) return;

  let total = 0;

  container.querySelectorAll(".qty-input").forEach((input) => {
    const value = parseInt(input.value) || 0;
    const multiplier = parseInt(input.dataset.multiplier) || 1;
    total += value * multiplier;
  });

  totalQty.value = total;

  syncAddToCartBtn();
}

// Función que actualiza el total general de productos en #total-qty
// módulo qty-stepper.js
let isQtyStepperReady = false;

function refreshShippingOnly() {
  if (typeof checkcreative_ajax === "undefined") return;

  jQuery.post(
    checkcreative_ajax.ajaxUrl,
    {
      action: "checkcreative_get_shipping",
      security: checkcreative_ajax.nonce,
    },
    function (res) {
      if (!res || !res.success) return;
      var el = document.querySelector("#checkcreative-shipping-amount");
      if (el) el.innerHTML = res.data.amount_html;
    },
    "json"
  );
}

export function initCartQtyStepper() {
  if (isQtyStepperReady) return; // ya estaba inicializado
  isQtyStepperReady = true;

  document.addEventListener("click", handleQtyClick);
  document
    .querySelectorAll(".qty-input")
    .forEach((el) => el.addEventListener("input", updateTotalQty));
}

function handleQtyClick(e) {
  if (!e.target.matches(".qty-btn")) return;

  const btn = e.target;
  const row = btn.closest("[data-cart-key]") || btn.closest(".qty-wrapper");
  const input =
    document.getElementById(btn.dataset.target) ||
    row?.querySelector(".qty-input");
  if (!input) return;

  const min = +input.min || 0;
  const max = +input.max || 999999;
  let val = +input.value || 0;

  if (btn.classList.contains("qty-plus") && val < max) val++;
  if (btn.classList.contains("qty-minus") && val > min) val--;

  input.value = val;

  if (row && row.dataset.cartKey) {
    jQuery.post(
      checkcreative_ajax.ajaxUrl,
      {
        action: "checkcreative_update_qty",
        security: checkcreative_ajax.nonce,
        key: row.dataset.cartKey,
        qty: val,
      },
      (res) => {
        if (!res.success) return;

        Object.entries(res.data.fragments).forEach(([sel, html]) => {
          const el = document.querySelector(sel);

          if (!el) return;

          if (sel === "#cart-totals-wrapper") {
            const tmp = document.createElement("div");
            tmp.innerHTML = html;
            el.replaceWith(tmp.firstElementChild);
          } else {
            el.innerHTML = html;
          }
        });

        refreshShippingOnly();
        updateTotalQty();
      }
    );
  } else {
    updateTotalQty();
  }
}

export function removeFromCartWoocommerce() {
  jQuery(document).on("click", ".remove-from-cart", function (e) {
    e.preventDefault();

    const $btn = jQuery(this);
    const cartKey = $btn.data("cart-key");

    jQuery.post(
      checkcreative_ajax.ajaxUrl,
      {
        action: "checkcreative_remove_from_cart",
        security: checkcreative_ajax.nonce,
        key: cartKey,
      },
      (res) => {
        if (!res.success) return;

        /* 1. Refresca todos los fragments que te devuelve PHP */
        if (res.data.fragments) {
          Object.entries(res.data.fragments).forEach(([sel, html]) => {
            const el = document.querySelector(sel);
            if (!el) return;

            if (sel === "#cart-totals-wrapper") {
              const tmp = document.createElement("div");
              tmp.innerHTML = html;
              el.replaceWith(tmp.firstElementChild);
            } else {
              el.innerHTML = html;
            }
          });
        }

        /* 2. Elimina la fila del producto */
        $btn.closest("tr").remove();

        /* 3. Recalcula la cantidad total */

        if (jQuery(".woocommerce-cart-form tbody tr").length === 0) {
          window.location.reload();
        } else {
          updateTotalQty();
          refreshShippingOnly();
        }
      }
    );
  });
}

export function refreshMiniCartAfterAdd() {
  jQuery("body").on("added_to_cart", function () {
    console.log("✅ Producto añadido, actualizando mini-cart...");

    fetch(checkcreative_ajax.ajaxUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "get_mini_cart_fragments_custom",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        // 1. Reemplazar <ul id="mini-cart-items">
        const ul = document.querySelector("#mini-cart-items");
        if (ul && data.data.fragments["#mini-cart-items"]) {
          ul.innerHTML = data.data.fragments["#mini-cart-items"];
        }

        // 2. Reemplazar subtotal
        const subtotal = document.querySelector("#mini-cart-subtotal");
        if (subtotal && data.data.fragments["#mini-cart-subtotal"]) {
          subtotal.innerHTML = data.data.fragments["#mini-cart-subtotal"];
        }

        // 3. Reactivar botones qty y remove
        initCartQtyStepper();
        removeFromMiniCartWoocommerce();
      });
  });
}

export function initProductPageAddToCart() {
  document.addEventListener(
    "click",
    function (e) {
      const btn = e.target.closest(".product-page .add_to_cart_button");
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add("loading");

      const ajaxAddUrl = wc_add_to_cart_params.wc_ajax_url.replace(
        "%%endpoint%%",
        "add_to_cart"
      );
      const dataAdd = new URLSearchParams({
        action: "woocommerce_ajax_add_to_cart",
        product_id: btn.dataset.product_id,
        product_sku: btn.dataset.product_sku,
        quantity: btn.dataset.quantity,
      });

      fetch(ajaxAddUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: dataAdd,
      })
        .then((r) => r.json())
        .then((response) => {
          if (response.error && response.product_url) {
            window.location = response.product_url;
            return;
          }

          return fetch(checkcreative_ajax.ajaxUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              action: "get_mini_cart_fragments_custom",
            }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.success && data.data.fragments) {
                Object.entries(data.data.fragments).forEach(([sel, html]) => {
                  document.querySelectorAll(sel).forEach((el) => {
                    el.innerHTML = html;
                  });
                });
              }
            })
            .then(() => {
              const drawer = document.getElementById("mini-cart-drawer");
              if (drawer)
                gsap.fromTo(
                  drawer,
                  { y: "-100%" },
                  { y: "0%", duration: 0.5, ease: "power3.inOut" }
                );
            });
        })
        .then(() => {
          btn.classList.remove("loading");
          btn.classList.add("added");

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.classList.remove("added");
          }, 1500);
        })
        .catch((err) => {
          console.error(err);
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          btn.classList.remove("loading");
        });
    },
    /* useCapture */ true
  );
}

export function maxWeightFn() {
  jQuery(function ($) {
    // Si mantienes esto, OK; pero ya no es imprescindible:
    $("form.woocommerce-cart").on("change", "input.qty", function () {
      var $form = $(this).closest("form");
      $form.find('[name="update_cart"]').prop("disabled", false); // no forzamos click para evitar reload
    });

    $("#go-to-checkout").on("click", function (e) {
      e.preventDefault();

      var $btn = $(this);
      $btn.data("busy", true);

      var nonce = $btn.data("weight-nonce");

      // Tomamos el primer form de carrito que exista
      var $form = $(
        "form.woocommerce-cart, form.woocommerce-cart-form"
      ).first();
      var formSerialized = $form.length ? $form.serialize() : "";

      var checkoutUrl = $btn.data("checkout-url") || "/finalizar-compra/";

      $.ajax({
        url:
          typeof wc_cart_params !== "undefined"
            ? wc_cart_params.wc_ajax_url.replace(
                "%%endpoint%%",
                "preview_cart_weight"
              )
            : "?wc-ajax=preview_cart_weight",
        method: "POST",
        dataType: "json",
        data: {
          nonce: nonce,
          form: formSerialized,
        },
      })
        .done(function (res) {
          if (res && res.success) {
            var kg = parseFloat(res.data.weight_kg);
            console.log("Kilos en el carrito:", kg, "kg");

            if (!isNaN(kg) && kg > 50) {
              alert(
                "Tu carrito supera los 50 kg y no puede efectuarse el envío. Elimina algunos productos o contacta con nosotros."
              );
              $btn.data("busy", false);
              return; // no redirige
            }

            // <= 50 kg: redirigimos al checkout
            window.location.href = checkoutUrl;
          } else {
            console.warn(
              (res && res.data && res.data.message) ||
                "No se pudo obtener el peso del carrito."
            );
            alert(
              "No se pudo verificar el peso del carrito. Inténtalo de nuevo."
            );
            $btn.data("busy", false);
          }
        })
        .fail(function () {
          console.warn("Error AJAX al obtener el peso del carrito.");
          alert("Error al verificar el peso del carrito. Inténtalo de nuevo.");
          $btn.data("busy", false);
        });
    });
  });
}

export function coupon() {
  const block = document.getElementById("coupon-block");
  const btn = document.getElementById("apply-coupon-btn");
  const input = document.getElementById("coupon_code");
  const wrap = document.querySelector(".woocommerce-notices-wrapper");
  if (!block || !btn || !input) return;

  const WOO_APPLY_URL = block.dataset.wooApplyUrl; // ✅ viene de PHP
  const ADMIN_AJAX = block.dataset.adminAjax; // admin-ajax.php
  const NONCE = block.dataset.applyCouponNonce || "";

  async function refreshTotals() {
    const fd = new FormData();
    fd.append("action", "syp_refresh_totals");
    const r = await fetch(ADMIN_AJAX, {
      method: "POST",
      body: fd,
      credentials: "same-origin",
    });
    const j = await r.json();
    if (!j?.success) return;

    const d = j.data;
    const subEl = document.getElementById("checkcreative-subtotal");
    const totEl = document.getElementById("checkcreative-total");
    const shipEl = document.getElementById("checkcreative-shipping-amount");
    const list = document.getElementById("checkcreative-totals");

    if (subEl && d.subtotal) subEl.innerHTML = d.subtotal;

    // reemplaza filas de cupones
    list.querySelectorAll(".checkcreative-coupon-row").forEach((el) => el.remove());
    if (d.coupons) {
      const tpl = document.createElement("template");
      tpl.innerHTML = d.coupons.trim();
      const totalRow = document.getElementById("checkcreative-total-row");
      [...tpl.content.children].forEach((node) =>
        list.insertBefore(node, totalRow)
      );
    }

    if (shipEl && typeof d.shipping !== "undefined")
      shipEl.innerHTML = d.shipping;
    if (totEl && d.total) totEl.innerHTML = d.total;
  }

  btn.addEventListener("click", async function () {
    const code = (input.value || "").trim();
    if (!code) return;

    const fd = new FormData();
    fd.append("coupon_code", code);
    if (NONCE) fd.append("security", NONCE);

    btn.disabled = true;
    try {
      const res = await fetch(WOO_APPLY_URL, {
        method: "POST",
        body: fd,
        credentials: "same-origin",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (e) {}

      if (wrap) wrap.innerHTML = data?.messages || text || "";

      const success = data
        ? data.result === "success"
        : /woocommerce-message|woocommerce-info/i.test(text);
      if (success) {
        await refreshTotals(); // 👈 actualiza subtotal/cupones/total sin recargar
        if (window.jQuery) {
          jQuery(document.body).trigger("update_checkout");
          jQuery(document.body).trigger("wc_fragment_refresh");
        }
      }
    } catch (e) {
      console.error(e);
      if (wrap)
        wrap.innerHTML =
          '<ul class="woocommerce-error"><li>No se pudo aplicar el cupón.</li></ul>';
    } finally {
      btn.disabled = false;
    }
  });
}
