// Este puente convierte el evento jQuery `added_to_cart` en un evento nativo del DOM
if (window.jQuery) {
	jQuery(document.body).on('added_to_cart', function (e, fragments, cartHash, $button) {
		document.dispatchEvent(new CustomEvent('wc-added-to-cart', {
			detail: { fragments, cartHash, button: $button?.get(0) }
		}));
	});
}