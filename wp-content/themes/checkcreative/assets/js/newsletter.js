import { toggleScrollLock } from "./initLenis";

export function newsletterFormHandler() {
  (function ($) {
    const $modal = $("#newsletterModal");
    const $form = $modal.find("#newsletter-form");
    const $msg = $modal.find("#newsletter-msg");
    const $title = $modal.find("#newsletter-modal-title");
    const $closeBT = $modal.find('[data-bs-dismiss="modal"]');

    if ($modal.length && !$modal.parent().is("body")) {
      $modal.appendTo("body");
    }

    function resetModalUI() {
      $msg
        .addClass("d-none")
        .removeClass("alert-success alert-danger alert-info")
        .text("");

      $form.show();
      $title.show();

      if ($form.length) $form[0].reset();
    }

    $modal.on("show.bs.modal", function (ev) {
      resetModalUI();
      toggleScrollLock(true);

      const $btn = $(ev.relatedTarget || []);
      const title = $btn.data("newsletter-title") || "Únete al club";
      const source = $btn.data("newsletter-source") || "";
      const tags = $btn.data("newsletter-tags") || "banner-acf";

      $("#newsletter-modal-title").text(title);
      $("#newsletter-source").val(source);
      $("#newsletter-tags").val(tags);
    });

    $modal.on("hidden.bs.modal", function () {
      resetModalUI();
      toggleScrollLock(false);
    });

    $(document)
      .off("submit", "#newsletter-form")
      .on("submit", "#newsletter-form", function (e) {
        e.preventDefault();

        $.ajax({
          url:
            (window.checkcreative_ajax && (checkcreative_ajax.ajaxUrl || checkcreative_ajax.ajaxurl)) ||
            (window.checkcreativeAjax && window.checkcreativeAjax.ajaxurl) ||
            "/wp-admin/admin-ajax.php",
          type: "POST",
          data: $(this).serialize(),
          beforeSend() {
            $msg
              .removeClass("d-none alert-success alert-danger alert-info")
              .text("Enviando…");
          },
          success(resp) {
            if (resp && resp.success) {
              const existed = resp.data && resp.data.existing === true;

              if (!existed) {
                $form.hide();
                $title.hide();
                $msg
                  .addClass("alert-success")
                  .text(resp.data.message || "¡Listo!");

                setTimeout(() => {
                  $closeBT.trigger("click");
                }, 2000);
              } else {
                $msg
                  .addClass("alert-info")
                  .text(resp.data.message || "Ya estabas dentro del club.");
              }
            } else {
              $msg
                .addClass("alert-danger")
                .text(
                  (resp && resp.data && resp.data.message) ||
                    "Error desconocido"
                );
            }
          },
          error() {
            $msg.addClass("alert-danger").text("Error de servidor");
          },
        });
      });
  })(jQuery);
}
