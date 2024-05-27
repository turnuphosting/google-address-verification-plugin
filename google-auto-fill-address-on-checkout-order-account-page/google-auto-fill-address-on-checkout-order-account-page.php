<?php
/**
* Plugin Name: Google Auto-fill Address on Checkout, Order & Account Page
* Description: This plugin allows you to fill the checkout form automatically by using google's address autocomplete API.
* Author: FME Addons
* TextDomain: FMEAACOC
* Version: 1.0.6
* Domain Path:       /languages
* Woo: 6689767:3cbad45a3e4d0fd661e6a6bd21abffb9
*/

if ( ! defined( 'WPINC' ) ) {
	wp_die();
}

/*
 * Check if WooCommerce is active
 * if wooCommerce is not active ext Tabs module will not work.
 **/
if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins'))) ) {
	/**
	* Check WooCommerce is installed and active
	*
	* This function will check that woocommerce is installed and active
	* and returns true or false
	*
	* @return true or false
	*/
	function FMEAOCOC_address_autocomplete_on_checkout_admin_notice() {

			// Deactivate the plugin
		deactivate_plugins(__FILE__);

		$allowed_tags = array(
			'a' => array(
				'class' => array(),
				'href'  => array(),
				'rel'   => array(),
				'title' => array(),
			),
			'abbr' => array(
				'title' => array(),
			),
			'b' => array(),
			'blockquote' => array(
				'cite'  => array(),
			),
			'cite' => array(
				'title' => array(),
			),
			'code' => array(),
			'del' => array(
				'datetime' => array(),
				'title' => array(),
			),
			'dd' => array(),
			'div' => array(
				'class' => array(),
				'title' => array(),
				'style' => array(),
			),
			'dl' => array(),
			'dt' => array(),
			'em' => array(),
			'h1' => array(),
			'h2' => array(),
			'h3' => array(),
			'h4' => array(),
			'h5' => array(),
			'h6' => array(),
			'i' => array(),
			'img' => array(
				'alt'    => array(),
				'class'  => array(),
				'height' => array(),
				'src'    => array(),
				'width'  => array(),
			),
			'li' => array(
				'class' => array(),
			),
			'ol' => array(
				'class' => array(),
			),
			'p' => array(
				'class' => array(),
			),
			'q' => array(
				'cite' => array(),
				'title' => array(),
			),
			'span' => array(
				'class' => array(),
				'title' => array(),
				'style' => array(),
			),
			'strike' => array(),
			'strong' => array(),
			'ul' => array(
				'class' => array(),
			),
		);

		$wooextmm_message = '<div id="message" class="error">
		<p><strong>Extendons: Adress AutoComplete on checkout Plugin is inactive.</strong> The <a href="http://wordpress.org/extend/plugins/woocommerce/">WooCommerce plugin</a> must be active for this plugin to work. Please install &amp; activate WooCommerce »</p></div>';

		echo wp_kses(__($wooextmm_message, 'exthwsm'), $allowed_tags);

	}
	add_action('admin_notices', 'FMEAOCOC_address_autocomplete_on_checkout_admin_notice');
}

if ( !class_exists( 'FMEAOCOC_Google_Address_Autocomplete_On_Checkout' ) ) {

	class FMEAOCOC_Google_Address_Autocomplete_On_Checkout {
		
		public function __construct() {
			$this->FMEAOCOC_address_autocomplete_on_checkout_module_constants();
			if (is_admin()) {
				require_once( FMEAOCOC_PLUGIN_DIR . 'admin/fme_address_autocomplete_on_checkout_admin.php' );
				register_activation_hook( __FILE__, array( $this, 'FMEAOCOC_install_default_settings' ) );
			} else {
				require_once( FMEAOCOC_PLUGIN_DIR . 'front/fme_address_autocomplete_on_checkout_front.php' );
			}
		}
		public function FMEAOCOC_install_default_settings() {
			$FMEAACOC_Settings_array = array(
				'FMEAACOC_Address_AutoComplete_Status' => 'FMEAACOC_0',
				'FMEAACOC_API_KEY' => '',
				'FMEAACOC_billing_Label_status' => 'FMEAACOC_0',
				'FMEAACOC_billing_Label_text' => '',
				'FMEAACOC_shipping_Label_status' => 'FMEAACOC_0',
				'FMEAACOC_shipping_Label_text' => '',
				'FMEAACOC_enable_order_autocomplete_address' => 'FMEAACOC_0',
				'FMEAACOC_billing_text'=> '',
				'FMEAACOC_shipping_text' => '',
				'FMEAACOC_Country_Restriction'=> array(),
				'FMEAACOC_map_design' => 'FMEAACOC_defualt_map',
				'FMEAACOC_shipping_message' => '',
				'FMEAACOC_billing_message' => ''
			);
			if ('' == get_option('FMEAACOC_Settings')) {
				update_option('FMEAACOC_Settings' , $FMEAACOC_Settings_array);
			}
		}
		public function FMEAOCOC_address_autocomplete_on_checkout_module_constants() {

			if ( !defined( 'FMEAOCOC_URL' ) ) {
				define( 'FMEAOCOC_URL', plugin_dir_url( __FILE__ ) );
			}

			if ( !defined( 'FMEAOCOC_BASENAME' ) ) {
				define( 'FMEAOCOC_BASENAME', plugin_basename( __FILE__ ) );
			}

			if ( ! defined( 'FMEAOCOC_PLUGIN_DIR' ) ) {
				define( 'FMEAOCOC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
			}
		}

	} 

	new FMEAOCOC_Google_Address_Autocomplete_On_Checkout();
}  
