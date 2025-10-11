<form id="formLlamada" class="bg-warm-gray p-4 rounded legend">
	<div class="row">
		<div class="col-12 d-flex justify-content-end">
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
	</div>
	<div class="row mb-4">
		<div class="col-12">
			<label class="d-block fs-4 mb-2"><?= __('Te llamamos', 'checkcreative') ?></label>
			<label class="d-block fs-6"><?= __('Nuestro equipo de especialistas se pondrá en contacto contigo.', 'checkcreative') ?></label>
		</div>
	</div>
	<div class="row mb-3">
		<div class="col-12">
			<label class="d-none" for="nombre_ll"><?= __('Nombre', 'checkcreative') ?></label>
			<input type="text" id="nombre_ll" name="nombre" class="form-control" placeholder="<?= __('Nombre', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col-12">
			<label class="d-none" for="apellidos_ll"><?= __('Apellidos', 'checkcreative') ?></label>
			<input type="text" id="apellidos_ll" name="apellidos" class="form-control" placeholder="<?= __('Apellidos', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col-12">
			<label class="d-none" for="codigoPostal_ll"><?= __('Código Postal', 'checkcreative') ?></label>
			<input type="text" id="codigoPostal_ll" name="codigoPostal" class="form-control" placeholder="<?= __('Código Postal', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col-12">
			<label class="d-none" for="telefono_ll"><?= __('Teléfono', 'checkcreative') ?></label>
			<input type="tel" id="telefono_ll" name="telefono" class="form-control" placeholder="<?= __('Teléfono', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-4">
		<div class="col">
			<label class="d-none" for="email_ll"><?= __('Email', 'checkcreative') ?></label>
			<input type="email" id="email_ll" name="email" class="form-control" placeholder="<?= __('Email', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col">
			<div class="form-check mb-2">
				<input class="form-check-input" type="checkbox" id="comunicaciones_ll" name="comunicacionesComerciales">
				<label class="form-check-label" for="comunicaciones_ll">
					<?= __('Acepto recibir comunicaciones comerciales', 'checkcreative') ?>
				</label>
			</div>
			<div class="form-check">
				<input class="form-check-input" type="checkbox" id="privacidad_ll" name="politicaPrivacidad">
				<label class="form-check-label" for="privacidad_ll">
					<?= __('Acepto la', 'checkcreative') ?>
					<a target="_blank" href="<?= get_privacy_policy_url() ?>" class="link-dark"><?= __('política de privacidad', 'checkcreative') ?></a>
				</label>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col">
			<button type="submit" class="btn btn-primary w-100"><?= __('Enviar', 'checkcreative') ?></button>
		</div>
	</div>
</form>