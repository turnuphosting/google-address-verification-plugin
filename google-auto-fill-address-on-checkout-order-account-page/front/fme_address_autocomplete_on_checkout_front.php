<?php  
if ( ! defined( 'WPINC' ) ) {
	wp_die();
}
if ( !class_exists( 'Fme_Address_Autocomplete_On_Checkout_Front' ) ) { 

	class Fme_Address_Autocomplete_On_Checkout_Front { 

		public function __construct() {
			add_action( 'wp_enqueue_scripts', array($this,'Fme_address_autocomplete_google_enqueue_scripts' ));
			add_filter('wp_head', array($this, 'FMEAACOC_get_settings'));
		}

		public function FMEAACOC_get_settings() {
			$Fme_Address_Autocomplete_Settings = get_option('FMEAACOC_Settings');
			?>
			<input type="hidden" name="FMEAACOC_Address_AutoComplete_Settings" id="FMEAACOC_Address_AutoComplete_Settings" value="<?php echo esc_attr(json_encode($Fme_Address_Autocomplete_Settings)); ?>">
			<?php
		}

		public function Fme_address_autocomplete_google_enqueue_scripts() {
			if (is_checkout() || is_account_page()) {
				$Fme_Address_Autocomplete_Settings = get_option('FMEAACOC_Settings');
				$google_api_key = esc_attr($Fme_Address_Autocomplete_Settings['FMEAACOC_API_KEY']);
				wp_enqueue_script('jquery');
				wp_enqueue_script( 	'FMEAACOC_address_auto_complete_js', plugins_url( 'assets/js/FMEAACOC_address_auto_complete_front.js', __FILE__ ), false, 1.0);
				wp_enqueue_script('FMEAACOC_google-maps', 'https://maps.googleapis.com/maps/api/js?key=' . $google_api_key . '&libraries=places', array('jquery-core', 'jquery', 'FMEAACOC_address_auto_complete_js'), 1.0);
				wp_enqueue_style( 	'FMEAACOC_address_auto_complete_css', plugins_url( 'assets/css/FMEAACOC_address_auto_complete_front.css', __FILE__ ), false, 1.0);

				$fme_selling_location = get_option('woocommerce_allowed_countries');
				$fme_selling_location_allowed_countries = get_option('woocommerce_specific_allowed_countries');
				$woocommerce_all_except_countries = get_option('woocommerce_all_except_countries');

				$fme_shipping_location = get_option('woocommerce_ship_to_countries');
				$fme_shipping_location_allowed_countries = get_option('woocommerce_specific_ship_to_countries');
				$fme_shop_default_countries = get_option('woocommerce_default_country');
			
				$countries = new WC_Countries();
				$countries_array = array();
				foreach ($countries->get_countries() as $key => $value) {
					array_push($countries_array, $key);
				}
				$FMEAACOC_View_Settings = get_option('FMEAACOC_Settings');
				$fmeaacoc_data = array(
					'fme_selling_location' => $fme_selling_location,
					'fme_selling_location_allowed_countries' => $fme_selling_location_allowed_countries,
					'woocommerce_all_except_countries' => $woocommerce_all_except_countries,
					'fme_shipping_location' => $fme_shipping_location,
					'fme_shipping_location_allowed_countries' => $fme_shipping_location_allowed_countries,
					'fme_shop_default_countries' => $fme_shop_default_countries,
					'fme_all_countries' => $countries_array,
					'FMEAACOC_shipping_message' => $FMEAACOC_View_Settings['FMEAACOC_shipping_message'],
					'FMEAACOC_billing_message' => $FMEAACOC_View_Settings['FMEAACOC_billing_message']
				);

				wp_localize_script('FMEAACOC_address_auto_complete_js', 'fmeaacoc_data', $fmeaacoc_data);

			}
		}	
	}

	new Fme_Address_Autocomplete_On_Checkout_Front();
}
