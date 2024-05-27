jQuery(document).ready(function() {
	"use strict";
	jQuery('#FMEAACOC_Country_Restriction').select2();
	jQuery('#FMEAACOC_settings_msg').hide();
	window.onbeforeunload = null;
});

function FMEAACOC_Enable_billing_details() {
	"use strict";
	var FMEAACOC_billing_Label = jQuery('#FMEAACOC_billing_Label').val();
	if (FMEAACOC_billing_Label == 'FMEAACOC_0' || FMEAACOC_billing_Label == '' ) {
		jQuery('#FMEAACOC_billing_Label').val('FMEAACOC_1');
		jQuery('.FMEAACOC_billing_Label').show();
	} else {
		jQuery('#FMEAACOC_billing_Label').val('FMEAACOC_0');
		jQuery('.FMEAACOC_billing_Label').hide();
	}
}

function FMEAACOC_Enable_shipping_details() {
	"use strict";
	var FMEAACOC_shipping_Label = jQuery('#FMEAACOC_shipping_Label').val();
	if (FMEAACOC_shipping_Label == 'FMEAACOC_0' || FMEAACOC_shipping_Label == '') {
		jQuery('#FMEAACOC_shipping_Label').val('FMEAACOC_1');
		jQuery('.FMEAACOC_shipping_Label').show();
	} else {
		jQuery('#FMEAACOC_shipping_Label').val('FMEAACOC_0');
		jQuery('.FMEAACOC_shipping_Label').hide();
	}
}

function FMEAACOC_Save_Settings() {
	"use strict";
	var FMEAACOC_Address_AutoComplete_Status = jQuery('#FMEAACOC_Enable').val();
	var FMEAACOC_API_KEY = jQuery('#FMEAACOC_API_KEY').val();
	var FMEAACOC_billing_Label_status = jQuery('#FMEAACOC_billing_Label').val();
	var FMEAACOC_billing_Label_text = jQuery('#FMEAACOC_billing_Label_text').val();
	var FMEAACOC_billing_text = jQuery('#FMEAACOC_billing_text').val();
	var FMEAACOC_shipping_Label_status = jQuery('#FMEAACOC_shipping_Label').val();
	var FMEAACOC_shipping_Label_text = jQuery('#FMEAACOC_shipping_Label_text').val();
	var FMEAACOC_shipping_text = jQuery('#FMEAACOC_shipping_text').val();
	var FMEAACOC_enable_order_autocomplete_address = jQuery('#FMEAACOC_enable_order_autocomplete_address').val();
	var FMEAACOC_Country_Restriction = jQuery('#FMEAACOC_Country_Restriction').val();
	var FMEAACOC_map_design = jQuery('#FMEAACOC_map_design').val();
	var FMEAACOC_shipping_message = jQuery('#FMEAACOC_shipping_message').val();
	var FMEAACOC_billing_message = jQuery('#FMEAACOC_billing_message').val();
	var ajaxurl = ewcpm_php_vars.admin_url;
	if(FMEAACOC_API_KEY=='') {
		alert('Please Enter the Required Google maps Api key');
	} else {
		jQuery.ajax({
			url: ajaxurl,
			type: 'post',
			data: {
				action: 'FMEAACOC_Save_Settings',
				FMEAACOC_Address_AutoComplete_Status:FMEAACOC_Address_AutoComplete_Status,
				FMEAACOC_API_KEY:FMEAACOC_API_KEY,
				FMEAACOC_billing_Label_status:FMEAACOC_billing_Label_status,
				FMEAACOC_billing_Label_text:FMEAACOC_billing_Label_text,
				FMEAACOC_shipping_Label_status:FMEAACOC_shipping_Label_status,
				FMEAACOC_shipping_Label_text:FMEAACOC_shipping_Label_text,
				FMEAACOC_billing_text:FMEAACOC_billing_text,
				FMEAACOC_shipping_text:FMEAACOC_shipping_text,
				FMEAACOC_enable_order_autocomplete_address:FMEAACOC_enable_order_autocomplete_address,
				FMEAACOC_Country_Restriction:FMEAACOC_Country_Restriction,
				FMEAACOC_map_design:FMEAACOC_map_design,
				FMEAACOC_shipping_message:FMEAACOC_shipping_message,
				FMEAACOC_billing_message:FMEAACOC_billing_message
			},
			success: function (data) {
				jQuery('#FMEAACOC_settings_msg').show();	
				setTimeout(function() { 
						jQuery('#FMEAACOC_settings_msg').hide();	
					}, 
				3000);
				window.onbeforeunload = null;
				location.reload();
				
			}   
		});

	}
}

function FMEAACOC_Enable_Disable(){
	"use strict";
	var FMEAACOC_status =  jQuery('#FMEAACOC_Enable').val();
	if(FMEAACOC_status=='FMEAACOC_0' || FMEAACOC_status=='') {
		jQuery('#FMEAACOC_Enable').val('FMEAACOC_1');
	}else {
		jQuery('#FMEAACOC_Enable').val('FMEAACOC_0');	
	}
}

function FMEAACOC_Enable_order_autocomplete_address() {
	"use strict";
	var FMEAACOC_Enable_order_autocomplete_address =  jQuery('#FMEAACOC_enable_order_autocomplete_address').val();
	if(FMEAACOC_Enable_order_autocomplete_address=='FMEAACOC_0') {
		jQuery('#FMEAACOC_enable_order_autocomplete_address').val('FMEAACOC_1');
	}else {
		jQuery('#FMEAACOC_enable_order_autocomplete_address').val('FMEAACOC_0');	
	}
}

function FMEAACOC_select_Map() {
	"use strict";

	var FMEAACOC_map_val = jQuery('#FMEAACOC_map_design').val();

	if(FMEAACOC_map_val=='FMEAACOC_defualt_map') {
		jQuery('#FMEAACOC_defualt_map1').hide();
		jQuery('#FMEAACOC_defualt_map').show();
		jQuery('#FMEAACOC_defualt_map2').hide();
		jQuery('#FMEAACOC_defualt_map3').hide();
		jQuery('#FMEAACOC_defualt_map4').hide();
	} else if(FMEAACOC_map_val=='FMEAACOC_defualt_map1') {
		jQuery('#FMEAACOC_defualt_map1').show();
		jQuery('#FMEAACOC_defualt_map').hide();
		jQuery('#FMEAACOC_defualt_map2').hide();
		jQuery('#FMEAACOC_defualt_map3').hide();
		jQuery('#FMEAACOC_defualt_map4').hide();
	} else if(FMEAACOC_map_val=='FMEAACOC_defualt_map2') {
		jQuery('#FMEAACOC_defualt_map2').show();
		jQuery('#FMEAACOC_defualt_map').hide();
		jQuery('#FMEAACOC_defualt_map1').hide();
		jQuery('#FMEAACOC_defualt_map3').hide();
		jQuery('#FMEAACOC_defualt_map4').hide();
	} else if(FMEAACOC_map_val=='FMEAACOC_defualt_map3') {
		jQuery('#FMEAACOC_defualt_map3').show();
		jQuery('#FMEAACOC_defualt_map').hide();
		jQuery('#FMEAACOC_defualt_map1').hide();
		jQuery('#FMEAACOC_defualt_map2').hide();
		jQuery('#FMEAACOC_defualt_map4').hide();
	} else if(FMEAACOC_map_val=='FMEAACOC_defualt_map4') {
		jQuery('#FMEAACOC_defualt_map4').show();
		jQuery('#FMEAACOC_defualt_map').hide();
		jQuery('#FMEAACOC_defualt_map1').hide();
		jQuery('#FMEAACOC_defualt_map2').hide();
		jQuery('#FMEAACOC_defualt_map3').hide();
	}				

}