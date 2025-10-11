<?php
$steps = [
	'Definir el perfil',
	'Contacto',
	'Necesidades',
	'Tipo de vivienda',
	'Tipo de proyecto',
	'Número de paradas',
	'Tiempo',
	'Documentación',
	'Añadido'
];
// Definimos la configuración del formulario en un array
$formSteps = [
	[
		'id'     => 'primerPasoParticulares',
		'title'  => __('¿Cuál es tu perfil?', 'checkcreative'),
		'fields' => [
			[
				'type'    => 'radio',
				'name' => 'tipoPerfil',
				'options' => [
					'particular'  => __('Particular', 'checkcreative'),
					'profesional' => __('Profesional', 'checkcreative')
				]
			]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'segundoPasoParticulares',
		'title'  => __('Déjanos tus datos de contacto', 'checkcreative'),
		'fields' => [
			['type' => 'text', 'name' => 'nombre', 'placeholder' => __('Nombre', 'checkcreative')],
			['type' => 'text', 'name' => 'apellidos', 'placeholder' => __('Apellidos', 'checkcreative')],
			['type' => 'email', 'name' => 'email', 'placeholder' => __('Email', 'checkcreative')],
			['type' => 'text', 'name' => 'ciudad', 'placeholder' => __('Ciudad', 'checkcreative')],
			['type' => 'text', 'name' => 'codigoPostal', 'placeholder' => __('Código postal', 'checkcreative')],
			['type' => 'tel', 'name' => 'telefono', 'placeholder' => __('Teléfono', 'checkcreative')]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'tercerPasoParticulares',
		'title'  => __('¿Qué necesitas?', 'checkcreative'),
		'fields' => [
			[
				'type'    => 'radio',
				'name' => 'necesidades',
				'options' => [
					'accesibilidad' => __('Mejorar la accesibilidad de mi vivienda', 'checkcreative'),
					'revalorizar'   => __('Revalorizar mi propiedad', 'checkcreative'),
					'comodidad'     => __('Mayor comodidad para mi familia', 'checkcreative'),
				]
			]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'cuartoPasoParticulares',
		'title'  => __('¿Qué tipo de vivienda es?', 'checkcreative'),
		'fields' => [
			[
				'type'    => 'radio',
				'name' => 'tipoVivienda',
				'options' => [
					'viviendaUnifamiliar' => __('Vivienda unifamiliar', 'checkcreative'),
					'pisoDuplex'          => __('Piso dúplex', 'checkcreative'),
					'localComercial'      => __('Local comercial', 'checkcreative'),
					'comunidadVecinos'    => __('Comunidad de vecinos', 'checkcreative'),
					'garaje'              => __('Garaje', 'checkcreative')
				]
			]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'quintoPasoParticulares',
		'title'  => __('¿Qué tipo de proyecto es?', 'checkcreative'),
		'fields' => [
			[
				'type'    => 'radio',
				'name' => 'tipoProyecto',
				'options' => [
					'instalacionAscensor' => __('Instalación ascensor', 'checkcreative'),
					'obraCivil'           => __('Obra civil', 'checkcreative'),
					'proyectoTecnico'     => __('Proyecto técnico', 'checkcreative')
				]
			]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'sextoPasoParticulares',
		'title'  => __('¿Cuántas paradas necesitas?', 'checkcreative'),
		'fields' => [
			[
				'type'    => 'radio',
				'name' => 'paradas',
				'options' => [
					'2'      => __('2', 'checkcreative'),
					'3'      => __('3', 'checkcreative'),
					'4'      => __('4', 'checkcreative'),
					'masDe5' => __('Más de 5', 'checkcreative')
				]
			]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'septimoPasoParticulares',
		'title'  => __('¿Cuándo quieres empezar?', 'checkcreative'),
		'fields' => [
			[
				'type'    => 'radio',
				'name' => 'fechaComienzo',
				'options' => [
					'loAntesPosible'   => __('Lo antes posible', 'checkcreative'),
					'menosDeSeisMeses' => __('En menos de 6 meses', 'checkcreative'),
					'masAdelante'      => __('Más adelante', 'checkcreative')
				]
			]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'octavoPasoParticulares',
		'title'  => __('¿Tienes planos o imágenes de tu vivienda?', 'checkcreative'),
		'fields' => [
			[
				'type'    => 'radio',
				'name' => 'documentos',
				'options' => [
					'adjuntarDocumentos' => __('Adjuntar documentos', 'checkcreative'),
					'no'                 => __('No', 'checkcreative')
				]
			],
			[
				'type'        => 'file',
				'name'        => 'documentos_PP',
				'placeholder' => __('Adjuntar documentos', 'checkcreative'),
				'class'       => 'form-control form-control-file',
				'multiple'    => true
			]
		],
		'button' => __('Siguiente', 'checkcreative')
	],
	[
		'id'     => 'novenoPasoParticulares',
		'title'  => __('¿Te gustaría contarnos algo más?', 'checkcreative'),
		'fields' => [
			[
				'type'        => 'textarea',
				'name' => 'descripcion',
				'placeholder' => __('Cuéntanos', 'checkcreative')
			],
			[
				'type'  => 'checkbox',
				'name' => 'comunicacionesComerciales',
				'label' => __('Acepto recibir comunicaciones comerciales', 'checkcreative')
			],
			[
				'type' => 'checkbox-privacy',
				'name' => 'politicaPrivacidad',
			]
		],
		'button' => __('Enviar', 'checkcreative')
	],
];


?>
<div class="formularioPresupuestos d-none h-100" id="formularioPresupuestosParticulares">
	<div class="container-fluid p-0 h-100">
		<div class="row g-0 header-form-presupuesto">
			<div class="col-5 d-none d-md-block">
				<div class="row justify-content-center mb-3">
					<div class="col-12 d-flex align-items-center icons-black">
						<button type="button"
							class="btn btn-link ps-4 text-dark prev-step prevButtonPresupuestoParticulares icon-left text-decoration-none opacity-0">
							<?= __('Atras', 'checkcreative') ?>
						</button>
					</div>
					<div class="col-10">
						<img alt=""
							class="img-fluid w-100 opacity-25"
							src="<?= get_field('opciones_sitio_logo_principal', 'option') ?? 'https://pre.checkcreative.com/wp-content/uploads/2024/04/logo-grande-negro.svg' ?>">
					</div>
				</div>
			</div>
			<div class="col-12 col-md-7 bg-warm-gray d-flex justify-content-end p-3">
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
		</div>
		<div class="modal-body p-0">
			<section class="container-fluid p-0">
				<div class="row g-0">
					<div class="col-5 d-none d-md-block">
						<div class="listadoPasos ps-5 h-header-form" id="listadoPasosParticulares">
							<ul class="list-group list-group-flush pt-4">
								<?php foreach ($steps as $key => $step) :
									$paso = $key + 1;
								?>
									<li class="list-group-item border-0 legend paso <?= $paso === 1 ? 'pasoActivo' : ''; ?> py-0"
										id="paso<?= $paso ?>ParticularesLista">
										<h6 class="fs-6 fw-normal raleway mb-1 pasoTitulo"><?= $step ?></h6>
										<p class="estadoProceso mb-3">
											<span class="enMarcha fw-bold <?= $paso === 1 ? '' : 'opacity-0' ?>"><?= __('En marcha', 'checkcreative') ?></span>
											<span class="completado fw-bold d-none"><?= __('Completado', 'checkcreative') ?></span>
										</p>
									</li>
								<?php endforeach; ?>
							</ul>
						</div>
					</div>
					<div class="col-12 d-flex d-md-none icons-black bg-warm-gray">
						<button type="button"
							class="btn btn-link ps-4 text-dark prev-step prevButtonPresupuestoParticulares icon-left text-decoration-none opacity-0">
							<?= __('Atras', 'checkcreative') ?>
						</button>
					</div>
					<div class="col-12 col-md-7">
						<form id="formPresupuestosParticulares" class="bg-warm-gray p-4 legend m-0 h-100">
							<?php foreach ($formSteps as $key => $step) :
								$paso = $key + 1;
							?>
								<div id="<?= $step['id'] ?>" class="h-100 step-content-PP <?= $paso === 1 ? '' : 'd-none' ?>">
									<div class="row h-100 align-content-between">
										<div class="col-12 mb-3">
											<label class="d-block mb-4"><?= $step['title'] ?></label>
											<?php foreach ($step['fields'] as $field) : ?>
												<?php if ($field['type'] === 'radio') : ?>
													<?php foreach ($field['options'] as $value => $label) : ?>
														<div class="form-check mb-3">
															<input class="form-check-input"
																type="radio"
																name="<?= $field['name'] ?>"
																id="<?= $field['name'] . '_PP' . '_' . $value ?>"
																value="<?= $value ?>">
															<label class="form-check-label"
																for="<?= $field['name'] . '_PP' . '_' . $value ?>"><?= $label ?></label>
														</div>
													<?php endforeach; ?>
												<?php elseif ($field['type'] === 'text' || $field['type'] === 'email' || $field['type'] === 'tel') : ?>
													<input class="form-control mb-3"
														type="<?= $field['type'] ?>"
														name="<?= $field['name'] ?>"
														placeholder="<?= $field['placeholder'] ?>">
												<?php elseif ($field['type'] === 'textarea') : ?>
													<textarea class="form-control mb-3"
														name="<?= $field['name'] ?>"
														placeholder="<?= $field['placeholder'] ?>"></textarea>
												<?php elseif ($field['type'] === 'file') : ?>
													<input class="<?= $field['class'] ?>"
														type="file"
														name="<?= $field['name'] ?>" <?= isset($field['multiple']) && $field['multiple'] ? 'multiple' : '' ?>>
												<?php elseif ($field['type'] === 'checkbox') : ?>
													<div class="form-check mb-3">
														<input class="form-check-input"
															type="checkbox"
															name="<?= $field['name'] ?>"
															id="<?= $field['name'] . '_PP' ?>">
														<label class="form-check-label" for="<?= $field['name'] . '_PP' ?>"><?= $field['label'] ?></label>
													</div>
												<?php elseif ($field['type'] === 'checkbox-privacy') : ?>
													<div class="form-check mb-3">
														<input class="form-check-input"
															type="checkbox"
															name="<?= $field['name'] ?>"
															id="<?= $field['name'] . '_PP' ?>">
														<label class="form-check-label" for="<?= $field['name'] . '_PP' ?>">
															<?= __('Acepto la', 'checkcreative') ?>
															<a target="_blank" href="<?= get_privacy_policy_url() ?>"
																class="link-dark"><?= __('política de privacidad', 'checkcreative') ?></a>
														</label>
													</div>
												<?php endif; ?>
											<?php endforeach; ?>
										</div>
										<div class="col-12">
											<button type="button"
												class="btn btn-primary w-100 nextButtonPresupuestoParticulares"
												data-current-step="<?= $step['id'] ?>"><?= $step['button'] ?></button>
										</div>
									</div>
								</div>
							<?php endforeach; ?>
						</form>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>