<?php 
if ( ! defined( 'WPINC' ) ) {
	wp_die();
}

if ( !class_exists( 'FMEAOCOC_Google_Address_Autocomplete_On_Checkout_Admin' ) ) { 

	class FMEAOCOC_Google_Address_Autocomplete_On_Checkout_Admin extends FMEAOCOC_Google_Address_Autocomplete_On_Checkout {
		
		public function __construct() {

			add_action( 'init', array( $this, 'FMEAOCOC_address_autocomplete_on_checkout_text_domain' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'FMEAOCOC_address_autocomplete_on_checkout_admin_scripts' ) );
			add_action('wp_ajax_FMEAACOC_Save_Settings', array($this, 'FMEAACOC_AuotComplete_on_checkout'));
			add_action('wp_ajax_nopriv_FMEAACOC_Save_Settings', array($this, 'FMEAACOC_AuotComplete_on_checkout'));

			add_filter('woocommerce_settings_tabs_array', array($this,'FMEAOCOC_filter_woocommerce_settings_tabs_array'), 50 );	

			add_action( 'woocommerce_settings_fme_autocomplete_settings', array($this,'FMEAOCOC_settings_gmap_menu_configuration' )); 
		}

		public function FMEAOCOC_filter_woocommerce_settings_tabs_array( $tabs ) {
			$tabs['fme_autocomplete_settings'] = __('AutoFill Address', 'FMEAACOC');
			return $tabs;
		}

		public function FMEAOCOC_settings_gmap_menu_configuration() {

			require_once( FMEAOCOC_PLUGIN_DIR . 'admin/views/fme-address-autocomplete-on-checkout-admin-view.php' );
		}

		public function FMEAACOC_AuotComplete_on_checkout() {

			$FMEAACOC_Address_AutoComplete_Status = isset($_REQUEST['FMEAACOC_Address_AutoComplete_Status']) ? filter_var($_REQUEST['FMEAACOC_Address_AutoComplete_Status']) : '';

			$FMEAACOC_API_KEY = isset($_REQUEST['FMEAACOC_API_KEY']) ? filter_var($_REQUEST['FMEAACOC_API_KEY']) : '';

			$FMEAACOC_billing_Label_status = isset($_REQUEST['FMEAACOC_billing_Label_status']) ? filter_var($_REQUEST['FMEAACOC_billing_Label_status']) : '';

			$FMEAACOC_billing_Label_text = isset($_REQUEST['FMEAACOC_billing_Label_text']) ? map_deep( wp_unslash( $_REQUEST['FMEAACOC_billing_Label_text'] ), 'sanitize_text_field' ) : '';

			$FMEAACOC_shipping_Label_status = isset($_REQUEST['FMEAACOC_shipping_Label_status']) ? filter_var($_REQUEST['FMEAACOC_shipping_Label_status']) : '';

			$FMEAACOC_shipping_Label_text = isset($_REQUEST['FMEAACOC_shipping_Label_text']) ? map_deep( wp_unslash( $_REQUEST['FMEAACOC_shipping_Label_text'] ), 'sanitize_text_field' ) : '';

			$FMEAACOC_enable_order_autocomplete_address = isset($_REQUEST['FMEAACOC_enable_order_autocomplete_address']) ? map_deep( wp_unslash( $_REQUEST['FMEAACOC_enable_order_autocomplete_address'] ), 'sanitize_text_field' ) : '';

			$FMEAACOC_shipping_text = isset($_REQUEST['FMEAACOC_shipping_text']) ? map_deep( wp_unslash( $_REQUEST['FMEAACOC_shipping_text'] ), 'sanitize_text_field' ) : '';

			$FMEAACOC_billing_text = isset($_REQUEST['FMEAACOC_billing_text']) ? map_deep( wp_unslash( $_REQUEST['FMEAACOC_billing_text'] ), 'sanitize_text_field' ) : '';

			$FMEAACOC_Country_Restriction = isset($_REQUEST['FMEAACOC_Country_Restriction']) ? array_map('filter_var', $_REQUEST['FMEAACOC_Country_Restriction']) : array();

			$FMEAACOC_map_design = isset($_REQUEST['FMEAACOC_map_design']) ? filter_var($_REQUEST['FMEAACOC_map_design']) : '';

			$FMEAACOC_billing_message = isset($_REQUEST['FMEAACOC_billing_message']) ? map_deep( wp_unslash( $_REQUEST['FMEAACOC_billing_message'] ), 'sanitize_text_field' ) : '';
			$FMEAACOC_shipping_message = isset($_REQUEST['FMEAACOC_shipping_message']) ? map_deep( wp_unslash( $_REQUEST['FMEAACOC_shipping_message'] ), 'sanitize_text_field' ): '';

			$FMEAACOC_Settings_array = array(

				'FMEAACOC_Address_AutoComplete_Status' => $FMEAACOC_Address_AutoComplete_Status,
				'FMEAACOC_API_KEY' =>$FMEAACOC_API_KEY,
				'FMEAACOC_billing_Label_status' => $FMEAACOC_billing_Label_status,
				'FMEAACOC_billing_Label_text' => $FMEAACOC_billing_Label_text,
				'FMEAACOC_shipping_Label_status' => $FMEAACOC_shipping_Label_status,
				'FMEAACOC_shipping_Label_text' => $FMEAACOC_shipping_Label_text,
				'FMEAACOC_enable_order_autocomplete_address' => $FMEAACOC_enable_order_autocomplete_address,
				'FMEAACOC_billing_text'=> $FMEAACOC_billing_text,
				'FMEAACOC_shipping_text' => $FMEAACOC_shipping_text,
				'FMEAACOC_Country_Restriction'=> $FMEAACOC_Country_Restriction,
				'FMEAACOC_map_design' => $FMEAACOC_map_design,
				'FMEAACOC_shipping_message' => $FMEAACOC_shipping_message,
				'FMEAACOC_billing_message' => $FMEAACOC_billing_message

			);
			update_option('FMEAACOC_Settings' , $FMEAACOC_Settings_array);
			wp_die();
		}

	
		public function FMEAOCOC_address_autocomplete_on_checkout_text_domain() {
			load_plugin_textdomain('FMEAACOC', false, dirname(plugin_basename(__FILE__)) . '/languages/');
		}

		public function FMEAOCOC_address_autocomplete_on_checkout_admin_scripts() {	

			if (isset($_GET['tab'])) {

				if (is_admin() && 'fme_autocomplete_settings'== $_GET['tab']) {

					wp_enqueue_style('jquery');
					wp_enqueue_style( 'bootstrapcssFMEAACOC', plugins_url( 'assets/css/bootstrap.min.css', __FILE__ ), false , 1.0 );
					wp_enqueue_style( 'fme_address-autocomplete-on-checkout-admin-css-FMEAACOC', plugins_url( 'assets/css/fme_address-autocomplete-on-checkout-admin.css', __FILE__ ), false , 1.0 );
					wp_enqueue_script( 'bootstrapjsFMEAACOC', plugins_url( 'assets/js/bootstrap.min.js', __FILE__ ), false, 1.0 );
					wp_enqueue_script( 'select2-min-js', plugins_url( 'assets/js/select2.min.js', __FILE__ ), false, 1.0 );
					wp_enqueue_style( 'select2-min-css', plugins_url( 'assets/css/select2.min.css', __FILE__ ), false , 1.0 );

					wp_enqueue_script( 'fme_address_admin_settings_FMEAACOC_js', plugins_url( 'assets/js/fme_address-autocomplete-on-checkout-admin.js', __FILE__ ), false, 1.0 );
					$ewcpm_data = array(
						'admin_url' => admin_url('admin-ajax.php'),
					);
					wp_localize_script('fme_address_admin_settings_FMEAACOC_js', 'ewcpm_php_vars', $ewcpm_data);
					wp_localize_script('fme_address_admin_settings_FMEAACOC_js', 'ajax_url_add_pq', array('ajax_url_add_pq_data' => admin_url('admin-ajax.php')));
				}
			}
			$Fme_Address_Autocomplete_Settings = get_option('FMEAACOC_Settings');
			?>
			<input type="hidden" name="FMEAACOC_Address_AutoComplete_Settings" id="FMEAACOC_Address_AutoComplete_Settings" value="<?php echo esc_attr(json_encode($Fme_Address_Autocomplete_Settings)); ?>">
			<?php
			$google_api_key = esc_attr($Fme_Address_Autocomplete_Settings['FMEAACOC_API_KEY']);
			wp_enqueue_script( 'fme_address_autocomplete_on_checkout_admin_js_FMEAACOC', plugins_url( 'assets/js/fme-order-autocomplete-address.js', __FILE__ ), false, 1.0 );

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

			wp_localize_script('fme_address_autocomplete_on_checkout_admin_js_FMEAACOC', 'fmeaacoc_data', $fmeaacoc_data);


			wp_enqueue_script('FMEAACOC_google-maps', 'https://maps.googleapis.com/maps/api/js?key=' . $google_api_key . '&libraries=places', array('fme_address_autocomplete_on_checkout_admin_js_FMEAACOC'), 1.0);
		}
	} 

	new FMEAOCOC_Google_Address_Autocomplete_On_Checkout_Admin();
}
