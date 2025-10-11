<?php
defined('ABSPATH') || exit;
?>

<style>
  .modal-backdrop.agegate-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.65);
    z-index: 1055;
    opacity: 0;
    transition: opacity 240ms ease;
  }

  .modal-backdrop.agegate-backdrop.show {
    opacity: 1;
  }
</style>

<div class="modal ag-anim" id="ageGateModal" tabindex="-1" aria-hidden="true" aria-labelledby="ageGateTitle"
     data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content bg-secondary text-primary p-4">
      <div class="modal-header border-0">
        <h4 class="modal-title" id="ageGateTitle">Confirmación de edad</h4>
      </div>

      <div class="modal-body">
        <div class="js-ag-ask">
          <p class="mb-4">La venta de bebidas alcohólicas a menores de 18 años está prohibida. Para continuar, confirma tu edad.</p>
          <div class="d-flex gap-3 justify-content-center">
            <button type="button" class="btn btn-pink px-4" id="age-yes">Sí, tengo 18+</button>
            <button type="button" class="btn btn-outline-light px-4" id="age-no">No</button>
          </div>
        </div>

        <div class="js-ag-denied d-none">
          <p class="mb-3">lo siento necesitas ser mayor de edad para ver esta página :(</p>
          <small class="d-block opacity-75">Cierra esta pestaña o vuelve más tarde.</small>
        </div>
      </div>
    </div>
  </div>
</div>
