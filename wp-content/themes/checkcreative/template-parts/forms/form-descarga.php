<form id="formDescarga" class="bg-warm-gray p-4 rounded legend">
	<div class="row">
		<div class="col-12 d-flex justify-content-end">
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
	</div>
	<div class="row mb-4">
		<div class="col-12">
			<label class="d-block fs-4 mb-2"><?= __('Descarga el documento', 'checkcreative') ?></label>
			<label class="d-block fs-6"><?= __('Déjanos tus datos y recibe la información en tu correo electrónico.', 'checkcreative') ?></label>
		</div>
	</div>
	<div class="row mb-3">
		<div class="col-12">
			<label class="d-none" for="nombre_d"><?= __('Nombre', 'checkcreative') ?></label>
			<input type="text" id="nombre_d" name="nombre" class="form-control" placeholder="<?= __('Nombre', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col-12">
			<label class="d-none" for="apellidos_d"><?= __('Apellidos', 'checkcreative') ?></label>
			<input type="text" id="apellidos_d" name="apellidos" class="form-control" placeholder="<?= __('Apellidos', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col">
			<label class="d-none" for="profesion_d"><?= __('Selecciona profesión', 'checkcreative') ?></label>
			<select id="profesion_d" name="email" class="form-select">
				<option selected><?= __('Profesión', 'checkcreative') ?></option>
				<option value="1"><?= __('Profesión 1', 'checkcreative') ?></option>
				<option value="2"><?= __('Profesión 2', 'checkcreative') ?></option>
			</select>
		</div>
	</div>
	<div class="row mb-4">
		<div class="col">
			<label class="d-none" for="modelo_d"><?= __('Modelo de interés', 'checkcreative') ?></label>
			<input type="text" id="modelo_d" name="modelo" class="form-control" placeholder="<?= __('Modelo de interés', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col">
			<label class="d-none" for="documento_d"><?= __('Nombre documento', 'checkcreative') ?></label>
			<input type="text" id="documento_d" name="documento" class="form-control" placeholder="<?= __('Nombre documento', 'checkcreative') ?>">
		</div>
	</div>
	<div class="row mb-3">
		<div class="col">
			<div class="form-check mb-2">
				<input class="form-check-input" type="checkbox" id="comunicaciones_d" name="comunicacionesComerciales">
				<label class="form-check-label" for="comunicaciones_d">
					<?= __('Acepto recibir comunicaciones comerciales', 'checkcreative') ?>
				</label>
			</div>
			<div class="form-check">
				<input class="form-check-input" type="checkbox" id="privacidad_d" name="politicaPrivacidad">
				<label class="form-check-label" for="privacidad_d">
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