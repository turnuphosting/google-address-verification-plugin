var temp=0;
var map_style=[];
var gmap = '';
var gmarker = '';
var gmap1 = '';
var gmarker1 = '';
var infowindow_s = '';
var infowindow_b = '';
var is_billing_available = false;
var is_shipping_available = false;
var autocompleteLsr  = '';
var autocomplete1  = '';
var input1  = '';
var autocompleteLsr2  = '';
var autocomplete2  = '';
var input2 = '';

jQuery(document).ready(function(){
	"use strict";

	var fme_shipping_message = fmeaacoc_data.FMEAACOC_shipping_message;

	if (!fme_shipping_message) {
		fme_shipping_message = 'Shipping not available in this country';
	}


	var fme_billing_message = fmeaacoc_data.FMEAACOC_billing_message;


	if (!fme_billing_message) {
		fme_billing_message = 'Selling not available in this country';
	}



	jQuery('form input').on('keypress', function(e) {
		return e.which !== 13;
	});
	var FMEAACOC_geocoder = new google.maps.Geocoder();
	function FMEAACOC_geocodePosition(FMEAACOC_pos) {
		"use strict";
		FMEAACOC_geocoder.geocode({
			latLng: FMEAACOC_pos
		}, function(responses) {
			if (responses && responses.length > 0) {
				FMEAACOC_updateMarkerAddress(responses[0].address_components, responses[0].formatted_address);
			} else {
				FMEAACOC_updateMarkerAddress('Cannot determine address at this location.');
			}
		});
	}
	function FMEAACOC_updateMarkerStatus(FMEAACOC_str) {
		"use strict";
		document.getElementById('markerStatus').innerHTML = FMEAACOC_str;
	}
	function FMEAACOC_updateMarkerPosition(latLng) {
		"use strict";
		document.getElementById('info').innerHTML = [
		latLng.lat(),
		latLng.lng()
		].join(', ');
	}
	function FMEAACOC_updateMarkerAddress(FMEAACOC_str,FMEAACOC_formatted_address) {
		"use strict";
		document.getElementById('address').innerHTML = FMEAACOC_formatted_address;
		var getval = FMEAACOC_str;
		var FMEAACOC_componentForms = {
			street_number: 'short_name',
			route: 'long_name',
			locality: 'long_name',
			administrative_area_level_1: 'long_name',
			country: 'short_name',
			postal_code: 'short_name'
		};
		if(FMEAACOC_formatted_address != '') {
			jQuery('#billing_address_1').val(FMEAACOC_formatted_address);
		}

		var FMEAACOC_locations_vals = [];
		for (var i = 0; i < getval.length; i++) {
			var addressTypes = getval[i].types[0];
			if (FMEAACOC_componentForms[addressTypes]) {
				var val = getval[i][FMEAACOC_componentForms[addressTypes]];
				if(addressTypes=='country') {
					FMEAACOC_Fileds_Check_Availability(val, gmarker, gmap, 'billing');
					if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
						if(is_shipping_available && is_billing_available) {
							jQuery('#place_order').attr('disabled', false);
						} else {
							jQuery('#place_order').attr('disabled', true);
						}
					}
				}
				FMEAACOC_locations_vals.push({
					title: addressTypes, 
					location_val: val
				});
			}
		} 

		for (var i = 0; i < FMEAACOC_locations_vals.length; i++) {
			if(FMEAACOC_locations_vals[i]['title']=='country') {
				let long_name = FMEAACOC_locations_vals[i]['location_val'];
				let $element = jQuery('#billing_country')
				let val = $element.find("option:contains('"+long_name+"')").val()
				$element.val(long_name).trigger('change.select2');
				jQuery('#billing_country').trigger('change');
			} 

			var postal_code_arr = [];
			if(FMEAACOC_locations_vals[i]['title']=="postal_code") {
				
				postal_code_arr.push(FMEAACOC_locations_vals[i]['location_val']);
			}
			if(FMEAACOC_locations_vals[i]['title']=="administrative_area_level_1") {
				var state_arr = [];
				state_arr.push(FMEAACOC_locations_vals[i]['location_val']);
			} 
			if(FMEAACOC_locations_vals[i]['title']=="locality") {
				var billing_city_arr = []
				billing_city_arr.push(FMEAACOC_locations_vals[i]['location_val']);
			} 
		}


		
		if(postal_code_arr==undefined || postal_code_arr.length == 0){
			jQuery('#billing_postcode').val('');
			
		} else {
			jQuery('#billing_postcode').val(postal_code_arr[0]);
			
		}
		if(state_arr==undefined) {
			jQuery('#billing_state').val('');
		}  else {
			var elt = document.getElementById('billing_state');
			if(elt.nodeName=='INPUT') {
				jQuery('#billing_state').val(state_arr[0]);
			} else if(elt.nodeName=='SELECT') {
				let long_name = state_arr[0];
				let $element = jQuery('#billing_state')
				let val = $element.find("option:contains('"+long_name+"')").val()
				$element.val(val).trigger('change.select2');
				jQuery('#billing_state').trigger('change');
			} 	
		}
		if(billing_city_arr==undefined) {
			jQuery('#billing_city').val('');
		}  else {
			jQuery('#billing_city').val(billing_city_arr[0]);
		}
	}

	function FMEAACOC_restrict_country (restriction_type, field_type) {

		var selling_location = fmeaacoc_data.fme_selling_location;
		var selling_allowed_countries = fmeaacoc_data.fme_selling_location_allowed_countries;
		var selling_except_countries = fmeaacoc_data.woocommerce_all_except_countries;
		var shipping_location = fmeaacoc_data.fme_shipping_location;
		var shipping_allowed_countries = fmeaacoc_data.fme_shipping_location_allowed_countries;
		var all_countries = fmeaacoc_data.fme_all_countries;
		
		var restricted_countries = all_countries;
		
		if (selling_location == 'specific') {

			restricted_countries = selling_allowed_countries;

		} else if (selling_location == 'all') {

			restricted_countries = [];

		} else if (selling_location == 'all_except') {
			// restricted_countries = all_countries.filter(function(obj) { return selling_except_countries.indexOf(obj) == -1; });
			restricted_countries = [];
		}
		
		return restricted_countries;

	}

	function FMEAACOC_Fileds_Check_Availability (fme_current_country, c_marker, c_map, fields_type) {

		var selling_location = fmeaacoc_data.fme_selling_location;
		var selling_allowed_countries = fmeaacoc_data.fme_selling_location_allowed_countries;
		var selling_except_countries = fmeaacoc_data.woocommerce_all_except_countries;
		var shipping_location = fmeaacoc_data.fme_shipping_location;
		var shipping_allowed_countries = fmeaacoc_data.fme_shipping_location_allowed_countries;
		var all_countries = fmeaacoc_data.fme_all_countries;


		if (fields_type == 'billing') {

			if (selling_location == 'specific') {

				if (!selling_allowed_countries.includes(fme_current_country)) {
					// c_marker.setLabel(fme_billing_message);
					infowindow_b.setContent("<h3><strong>"+fme_billing_message+"</strong></h3>");
					infowindow_b.open(c_map, c_marker);
					jQuery('#place_order').attr('disabled', true);
					is_billing_available = false;
					return false;
				} else {
					if (c_marker) {
						c_marker.setLabel('');
					}
					infowindow_b.setContent('');
					infowindow_b.close();
					jQuery('#place_order').attr('disabled', false);
					is_billing_available = true;
					return true;
				}

			} else if (selling_location == 'all') {
				if (c_marker) {
					c_marker.setLabel('');
				}
				infowindow_b.setContent('');
				infowindow_b.close();
				jQuery('#place_order').attr('disabled', false);
				is_billing_available = true;
				return true;

			} else if (selling_location == 'all_except') {
				if (selling_except_countries.includes(fme_current_country)) {
					// c_marker.setLabel(fme_billing_message);
					infowindow_b.setContent("<h4><strong>"+fme_billing_message+"</strong></h4>");
					infowindow_b.open(c_map, c_marker);
					jQuery('#place_order').attr('disabled', true);
					is_billing_available = false;
					return false;
				} else {
					if (c_marker) {
						c_marker.setLabel('');
					}
					infowindow_b.setContent('');
					infowindow_b.close();
					jQuery('#place_order').attr('disabled', false);
					is_billing_available = true;
					return true;
				}

			}

		} else if (fields_type == 'shipping') {

			if(shipping_location == '') {

				if ( selling_location == 'all_except' ) {
					if (selling_except_countries.includes(fme_current_country)){
						infowindow_s.setContent("<h3><strong>"+fme_shipping_message+"</strong></h3>");
						infowindow_s.open(c_map, c_marker);
						jQuery('#place_order').attr('disabled', true);
						is_shipping_available = false;
						return false;
					} else {
						if (c_marker) {
							c_marker.setLabel('');
						}
						infowindow_s.setContent('');
						infowindow_s.close();
						jQuery('#place_order').attr('disabled', false);
						is_shipping_available = true;
						return true;
					}

				} else if ( selling_location == 'specific' ) {

					if (selling_allowed_countries.includes(fme_current_country)){
						if (c_marker) {
							c_marker.setLabel('');
						}
						infowindow_s.setContent('');
						infowindow_s.close();
						jQuery('#place_order').attr('disabled', false);
						is_shipping_available = true;
						return true;
					} else {
						// c_marker.setLabel(fme_shipping_message);
						infowindow_s.setContent("<h3><strong>"+fme_shipping_message+"</strong></h3>");
						infowindow_s.open(c_map, c_marker);
						jQuery('#place_order').attr('disabled', true);
						is_shipping_available = false;
						return false;
					}

				}  else if ( selling_location == 'all' ) {
					if (c_marker) {
						c_marker.setLabel('');
					}
					infowindow_s.setContent('');
					infowindow_s.close();
					jQuery('#place_order').attr('disabled', false);
					is_shipping_available = true;
					return true;
				}

			} else if ( shipping_location == 'specific' ) {
				if (shipping_allowed_countries.includes(fme_current_country)){
					if (c_marker) {
						c_marker.setLabel('');
					}
					infowindow_s.setContent('');
					infowindow_s.close();
					jQuery('#place_order').attr('disabled', false);
					is_shipping_available = true;	
					return true;
				} else {
					// c_marker.setLabel(fme_shipping_message);
					infowindow_s.setContent("<h3><strong>"+fme_shipping_message+"</strong></h3>");
					infowindow_s.open(c_map, c_marker);
					jQuery('#place_order').attr('disabled', true);
					is_shipping_available = false;
					return false;
				}

			} else if ( shipping_location == 'all' ) {
				if (c_marker) {
					c_marker.setLabel('');
				}
				infowindow_s.setContent('');
				infowindow_s.close();
				jQuery('#place_order').attr('disabled', false);
				is_shipping_available = true;
				return true;
			} else if ( shipping_location == 'disabled' ) {
				if (c_marker) {
					c_marker.setLabel('');
				}
				infowindow_s.setContent('');
				infowindow_s.close();
				jQuery('#place_order').attr('disabled', false);
				is_shipping_available = true;
				return true;
			}
		}
	}


	function FMEAACOC_map_design(FMEAACOC_map_design) {
		
		if (FMEAACOC_map_design=='FMEAACOC_defualt_map4') {
			map_style = [
			{
				"stylers": [
				{
					"hue": "#007fff"
				},
				{
					"saturation": 89
				}
				]
			},
			{
				"featureType": "water",
				"stylers": [
				{
					"color": "#ffffff"
				}
				]
			},
			{
				"featureType": "administrative.country",
				"elementType": "labels",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			}
			]
		} else if(FMEAACOC_map_design=='FMEAACOC_defualt_map3') {

			map_style = [
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#193341"
				}
				]
			},
			{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#2c5a71"
				}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#29768a"
				},
				{
					"lightness": -37
				}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#406d80"
				}
				]
			},
			{
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#406d80"
				}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
				{
					"visibility": "on"
				},
				{
					"color": "#3e606f"
				},
				{
					"weight": 2
				},
				{
					"gamma": 0.84
				}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#ffffff"
				}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry",
				"stylers": [
				{
					"weight": 0.6
				},
				{
					"color": "#1a3541"
				}
				]
			},
			{
				"elementType": "labels.icon",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#2c5a71"
				}
				]
			}
			]
		} else if(FMEAACOC_map_design=='FMEAACOC_defualt_map2') {

			map_style = [
			{
				"featureType": "landscape",
				"stylers": [
				{
					"hue": "#FFA800"
				},
				{
					"saturation": 0
				},
				{
					"lightness": 0
				},
				{
					"gamma": 1
				}
				]
			},
			{
				"featureType": "road.highway",
				"stylers": [
				{
					"hue": "#53FF00"
				},
				{
					"saturation": -73
				},
				{
					"lightness": 40
				},
				{
					"gamma": 1
				}
				]
			},
			{
				"featureType": "road.arterial",
				"stylers": [
				{
					"hue": "#FBFF00"
				},
				{
					"saturation": 0
				},
				{
					"lightness": 0
				},
				{
					"gamma": 1
				}
				]
			},
			{
				"featureType": "road.local",
				"stylers": [
				{
					"hue": "#00FFFD"
				},
				{
					"saturation": 0
				},
				{
					"lightness": 30
				},
				{
					"gamma": 1
				}
				]
			},
			{
				"featureType": "water",
				"stylers": [
				{
					"hue": "#00BFFF"
				},
				{
					"saturation": 6
				},
				{
					"lightness": 8
				},
				{
					"gamma": 1
				}
				]
			},
			{
				"featureType": "poi",
				"stylers": [
				{
					"hue": "#679714"
				},
				{
					"saturation": 33.4
				},
				{
					"lightness": -25.4
				},
				{
					"gamma": 1
				}
				]
			}
			]
		} else if(FMEAACOC_map_design=='FMEAACOC_defualt_map1') {

			map_style = [
			{
				"featureType": "administrative.locality",
				"elementType": "all",
				"stylers": [
				{
					"hue": "#ff0200"
				},
				{
					"saturation": 7
				},
				{
					"lightness": 19
				},
				{
					"visibility": "on"
				}
				]
			},
			{
				"featureType": "administrative.locality",
				"elementType": "labels.text",
				"stylers": [
				{
					"visibility": "on"
				},
				{
					"saturation": "-3"
				}
				]
			},
			{
				"featureType": "administrative.locality",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#748ca3"
				}
				]
			},
			{
				"featureType": "landscape",
				"elementType": "all",
				"stylers": [
				{
					"hue": "#ff0200"
				},
				{
					"saturation": -100
				},
				{
					"lightness": 100
				},
				{
					"visibility": "simplified"
				}
				]
			},
			{
				"featureType": "poi",
				"elementType": "all",
				"stylers": [
				{
					"hue": "#ff0200"
				},
				{
					"saturation": "23"
				},
				{
					"lightness": "20"
				},
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.school",
				"elementType": "geometry.fill",
				"stylers": [
				{
					"color": "#ffdbda"
				},
				{
					"saturation": "0"
				},
				{
					"visibility": "on"
				}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
				{
					"hue": "#ff0200"
				},
				{
					"saturation": "100"
				},
				{
					"lightness": 31
				},
				{
					"visibility": "simplified"
				}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry.stroke",
				"stylers": [
				{
					"color": "#f39247"
				},
				{
					"saturation": "0"
				}
				]
			},
			{
				"featureType": "road",
				"elementType": "labels",
				"stylers": [
				{
					"hue": "#008eff"
				},
				{
					"saturation": -93
				},
				{
					"lightness": 31
				},
				{
					"visibility": "on"
				}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry.stroke",
				"stylers": [
				{
					"visibility": "on"
				},
				{
					"color": "#ffe5e5"
				},
				{
					"saturation": "0"
				}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "labels",
				"stylers": [
				{
					"hue": "#bbc0c4"
				},
				{
					"saturation": -93
				},
				{
					"lightness": -2
				},
				{
					"visibility": "simplified"
				}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "labels.text",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [
				{
					"hue": "#ff0200"
				},
				{
					"saturation": -90
				},
				{
					"lightness": -8
				},
				{
					"visibility": "simplified"
				}
				]
			},
			{
				"featureType": "transit",
				"elementType": "all",
				"stylers": [
				{
					"hue": "#e9ebed"
				},
				{
					"saturation": 10
				},
				{
					"lightness": 69
				},
				{
					"visibility": "on"
				}
				]
			},
			{
				"featureType": "water",
				"elementType": "all",
				"stylers": [
				{
					"hue": "#e9ebed"
				},
				{
					"saturation": -78
				},
				{
					"lightness": 67
				},
				{
					"visibility": "simplified"
				}
				]
			}
			]
		} else if(FMEAACOC_map_design=='FMEAACOC_defualt_map') {
			map_style = '';
		}

	}

	var FMEAACOC_Address_AutoComplete_Settings = jQuery('#FMEAACOC_Address_AutoComplete_Settings').val();
	var FMEAACOC_settings = JSON.parse(FMEAACOC_Address_AutoComplete_Settings);
	var FMEAACOC_billing_Label_status = FMEAACOC_settings.FMEAACOC_billing_Label_status;
	var FMEAACOC_Country_Restriction = FMEAACOC_settings.FMEAACOC_Country_Restriction;
	var FMEAACOC_API_KEY = FMEAACOC_settings.FMEAACOC_API_KEY;
	var FMEAACOC_Address_AutoComplete_Status = FMEAACOC_settings.FMEAACOC_Address_AutoComplete_Status;
	if (FMEAACOC_Address_AutoComplete_Status=='FMEAACOC_1' && FMEAACOC_billing_Label_status=='FMEAACOC_1') {
		if (FMEAACOC_API_KEY !='') {
			var FMEAACOC_billing_Label_text = FMEAACOC_settings.FMEAACOC_billing_Label_text;
			var current= window.location.href;
			if(current.indexOf('shipping') == -1){
				if(FMEAACOC_billing_Label_text && jQuery('#billing_address_1_field').children()[0] ) {
					jQuery('#billing_address_1_field').children()[0].replaceWith(FMEAACOC_billing_Label_text);
				}	
			}
			jQuery('#billing_address_1').css("border", "2px solid lightgray");
			// google.maps.event.addDomListener(window, 'load', FMEAACOC_Billing_autocomplete);
			FMEAACOC_Billing_autocomplete();
			if(FMEAACOC_Country_Restriction!=null) {
				jQuery('body').on('change','#billing_country',function(){
				    clearInterval(myInterval);
				    temp=temp+1;
					var data=jQuery(this).val();

					if(FMEAACOC_Country_Restriction.indexOf(data) != '-1'){
					   //  console.log("xsaxsa");
					   // return;
						jQuery('#FMEAACOC_map_canvas').hide();
						autocomplete1.unbindAll();
						autocomplete1 = '';
						google.maps.event.clearInstanceListeners(input1);
					}else{
					   // console.log("xsaxsa");
					   // return;
						jQuery('#FMEAACOC_map_canvas').show();
						autocomplete1 = new google.maps.places.Autocomplete(input1);
						autocomplete1.bindTo('bounds', gmap);
						autocomplete1.setFields(
							['address_components', 'geometry', 'icon', 'name']);	
						
						autocomplete1.addListener('place_changed', function() {
							infowindow_b.close();
							gmarker.setVisible(false);
							var place = autocomplete1.getPlace();
							if (!place.geometry) {
								window.alert("No details available for input: '" + place.name + "'");
								return;
							}

							if (place.geometry.viewport) {
								gmap.fitBounds(place.geometry.viewport);
							} else {
								gmap.setCenter(place.geometry.location);
								gmap.setZoom(17);  
							}
							gmarker.setPosition(place.geometry.location);
							gmarker.setVisible(true);
							var check='';
							var address = '';
							if (place.address_components) {
								address = [
								(place.address_components[0] && place.address_components[0].short_name || ''),
								(place.address_components[1] && place.address_components[1].short_name || ''),
								(place.address_components[2] && place.address_components[2].short_name || '')
								].join(' ');

								var componentForm = {
									street_number: 'short_name',
									route: 'long_name',
									locality: 'long_name',
									administrative_area_level_1: 'long_name',
									country: 'short_name',
									postal_code: 'short_name'
								};

								var locations_val = [];
								for (var i = 0; i < place.address_components.length; i++) {
									var addressType = place.address_components[i].types[0];
									if (componentForm[addressType]) {
										var val = place.address_components[i][componentForm[addressType]];
										if(addressType=='country') {
											FMEAACOC_Fileds_Check_Availability(val, gmarker, gmap, 'billing');

											if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
												if(is_shipping_available && is_billing_available) {
													jQuery('#place_order').attr('disabled', false);
												} else {
													jQuery('#place_order').attr('disabled', true);
												}
											}
										}
										locations_val.push({
											title: addressType, 
											location_val:  val
										});
									}
								}
								for (var i = 0; i < locations_val.length; i++) {
									if(locations_val[i]['title']=='country') {

										let long_name = locations_val[i]['location_val'];
										let $element = jQuery('#billing_country');
										check = long_name;
										let val = $element.find("option:contains('"+long_name+"')").val();
										$element.val(long_name).trigger('change.select2');
										jQuery('#billing_country').trigger('change');
									} 

									var postal_code_arr = [];
									if(locations_val[i]['title']=="postal_code") {
										
										postal_code_arr.push(locations_val[i]['location_val']);
									}

									if(locations_val[i]['title']=="administrative_area_level_1") {
										var state_arr = [];
										state_arr.push(locations_val[i]['location_val']);
									} 
									if(locations_val[i]['title']=="locality") {
										var billing_city_arr = []
										billing_city_arr.push(locations_val[i]['location_val']);

									} 
								} 

								
								if(postal_code_arr==undefined || postal_code_arr.length == 0){
									
									jQuery('#billing_postcode').val('');
								} else {
									
									jQuery('#billing_postcode').val(postal_code_arr[0]);
								}



								if(state_arr==undefined) {
									jQuery('#billing_state').val('');
								}  else {
									var elt = document.getElementById('billing_state');
									if(elt.nodeName=='INPUT') {
										jQuery('#billing_state').val(state_arr[0]);
									} else if(elt.nodeName=='SELECT') {
										let long_name = state_arr[0];
										let $element = jQuery('#billing_state')
										let val = $element.find("option:contains('"+long_name+"')").val()

										$element.val(val).trigger('change.select2');
										jQuery('#billing_state').trigger('change');
									} 	
								}

								if(billing_city_arr==undefined) {
									jQuery('#billing_city').val('');
								}  else {
									jQuery('#billing_city').val(billing_city_arr[0]);
								}
							}

							if(FMEAACOC_Country_Restriction.indexOf(check) != '-1') {
								var infowindow = new google.maps.InfoWindow();
								var infowindowContent = document.getElementById('infowindow-content');
								infowindow.setContent(infowindowContent);
								infowindowContent.children['place-icon'].src = place.icon;
								infowindowContent.children['place-name'].textContent = place.name;
								infowindowContent.children['place-address'].textContent = address;
								// infowindow_b.open(gmap, gmarker);
							}
						});
					}
    setTimeout(function(){
        console.log(temp);
        if(temp==1){
            jQuery("#billing_address_1").val("");
        	jQuery("#billing_city").val("");
        	jQuery("#billing_state").val("");
        	jQuery("#billing_postcode").val("");
            jQuery("#billing_phone").val(""); 
        } else{
         jQuery("#billing_address_1").val(jQuery("#billing_address_1").val().split(',')[0]);
			 
        }
    },500);
});	


jQuery('body').on('select2:select', '#billing_country', function () {
	var data=jQuery(this).val();
	FMEAACOC_Fileds_Check_Availability(data, gmarker, gmap, 'billing');

	if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
		if(is_shipping_available && is_billing_available) {
			jQuery('#place_order').attr('disabled', false);
		} else {
			jQuery('#place_order').attr('disabled', true);
		}
	}


					// if(!jQuery('#ship-to-different-address-checkbox').prop('checked')) {
					// 	FMEAACOC_Fileds_Check_Availability(data, gmarker, 'billing');
					// } else {
					// 	gmarker.setLabel('');
					// 	jQuery('#place_order').attr('disabled', false);
					// }
					let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
					let geocoder = new google.maps.Geocoder();
					let location = regionNames.of(data);
					
					geocoder.geocode({ 'address': location }, function(results, status){
						if (status == google.maps.GeocoderStatus.OK) {
							gmap.setCenter(results[0].geometry.location);
							gmap.panTo(results[0].geometry.location);
							gmarker.setPosition(results[0].geometry.location);

						} else {
							alert("Could not find location: " + location);
						}
					});
				});
}	
}
}


function FMEAACOC_Billing_autocomplete() {
	"use strict";
	var FMEAACOC_Address_AutoComplete_Settings = jQuery('#FMEAACOC_Address_AutoComplete_Settings').val();
	var FMEAACOC_settings = JSON.parse(FMEAACOC_Address_AutoComplete_Settings);
	var FMEAACOC_Country_Restriction = FMEAACOC_settings.FMEAACOC_Country_Restriction;
	jQuery('#billing_address_1').after('<div id="FMEAACOC_map_canvas"></div><div  style="display:none;"><div id="infowindow-content"><img src="" width="16" height="16" id="place-icon"><span id="place-name"  class="title"></span><br><span id="place-address"></span></div></div><div id="infoPanel"><b>Marker status:</b><div id="markerStatus"><i>Click and drag the marker.</i></div><b>Current position:</b><div id="info"></div><b>Closest matching address:</b><div id="address"></div></div>');
	
	var billing_address = 	FMEAACOC_settings.FMEAACOC_billing_text;
	FMEAACOC_map_design(FMEAACOC_settings.FMEAACOC_map_design);
	if(jQuery('#billing_address_1').val()=='') {
		if(FMEAACOC_settings.FMEAACOC_billing_text!='') {
			var FMEAACOC_billing_address = FMEAACOC_settings.FMEAACOC_billing_text;
		} else {

			var fme_shop_default_country = fmeaacoc_data.fme_shop_default_countries;
			console.log(fme_shop_default_country);
			let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
			regionNames.of(fme_shop_default_country.split(':')[0]);
			var FMEAACOC_billing_address = regionNames.of(fme_shop_default_country.split(':')[0]);
				// var FMEAACOC_billing_address = 'united state';
			}
		} else if(jQuery('#billing_address_1').val()!='' && FMEAACOC_settings.FMEAACOC_billing_text!='') {
			var FMEAACOC_billing_address = jQuery('#billing_address_1').val();
		} else {
			if(FMEAACOC_settings.FMEAACOC_billing_text!='') {
				var FMEAACOC_billing_address = FMEAACOC_settings.FMEAACOC_billing_text;
			} else {
				var FMEAACOC_billing_address = jQuery('#billing_address_1').val();
			}
			
		}
		
		var FMEAACOClatlngarr=[];
		FMEAACOC_geocoder.geocode( { 'address': FMEAACOC_billing_address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				FMEAACOClatlngarr[0]=results[0].geometry.location.lat();
				FMEAACOClatlngarr[1]=results[0].geometry.location.lng();
				var latLng = new google.maps.LatLng(FMEAACOClatlngarr[0],FMEAACOClatlngarr[1]);
				var map = new google.maps.Map(document.getElementById('FMEAACOC_map_canvas'), {
					center: {lat: FMEAACOClatlngarr[0], lng: FMEAACOClatlngarr[1]},
					zoom: 13,
					styles: map_style
				});

				gmap = map;


			// var card = document.getElementById('pac-card');
			var input = document.getElementById('billing_address_1');
			input1 = input;
			var autocomplete = new google.maps.places.Autocomplete(input);

			autocomplete1 = autocomplete;

			autocomplete.setComponentRestrictions({
				country: FMEAACOC_restrict_country('asd', 'asd'),
			});




			// Bind the map's bounds (viewport) property to the autocomplete object,
			// so that the autocomplete requests use the current map bounds for the
			// bounds option in the request.
			autocomplete.bindTo('bounds', map);

			// Set the data fields to return when the user selects a place.
			autocomplete.setFields(
				['address_components', 'geometry', 'icon', 'name']);


			var marker = new google.maps.Marker({
				position: latLng,
				title: 'Point A',
				map: map,
				draggable: true
			});
			gmarker = marker;
			var infowindow1 = new google.maps.InfoWindow();
			infowindow_b = infowindow1;



			FMEAACOC_updateMarkerPosition(latLng);
			FMEAACOC_geocodePosition(latLng);

			google.maps.event.addListener(marker, 'drag', function() {
				FMEAACOC_updateMarkerStatus('Dragging...');
				FMEAACOC_updateMarkerPosition(marker.getPosition());
			});

			google.maps.event.addListener(marker, 'dragend', function() {
				FMEAACOC_updateMarkerStatus('Drag ended');
				FMEAACOC_geocodePosition(marker.getPosition());

			});


			autocompleteLsr = autocomplete.addListener('place_changed', function() {
                if(infowindow){
                    infowindow.close();
                }
				marker.setVisible(false);
				var place = autocomplete.getPlace();
				if (!place.geometry) {
				// User entered the name of a Place that was not suggested and
				// pressed the Enter key, or the Place Details request failed.
				window.alert("No details available for input: '" + place.name + "'");
				return;
			}

			// If the place has a geometry, then present it on a map.
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  // Why 17? Because it looks good.
			}
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);
			var check;
			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');

				var componentForm = {
					street_number: 'short_name',
					route: 'long_name',
					locality: 'long_name',
					administrative_area_level_1: 'long_name',
					country: 'short_name',
					postal_code: 'short_name'
				};

				var locations_val = [];
				for (var i = 0; i < place.address_components.length; i++) {
					var addressType = place.address_components[i].types[0];
					if (componentForm[addressType]) {
						var val = place.address_components[i][componentForm[addressType]];
						if(addressType=='country') {
							// if(!jQuery('#ship-to-different-address-checkbox').prop('checked')) {
								FMEAACOC_Fileds_Check_Availability(val, gmarker, gmap, 'billing');

								if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
									if(is_shipping_available && is_billing_available) {
										jQuery('#place_order').attr('disabled', false);
									} else {
										jQuery('#place_order').attr('disabled', true);
									}
								}
							// } else {
							// 	gmarker.setLabel('');
							// 	jQuery('#place_order').attr('disabled', false);
							// }
						}
						locations_val.push({
							title: addressType, 
							location_val:  val
						});
					}
				} 
				for (var i = 0; i < locations_val.length; i++) {
					if(locations_val[i]['title']=='country') {

						let long_name = locations_val[i]['location_val'];
						let $element = jQuery('#billing_country');
						check = long_name;
						let val = $element.find("option:contains('"+long_name+"')").val();
						$element.val(long_name).trigger('change.select2');
						jQuery('#billing_country').trigger('change');
					} 
					var postal_code_arr = [];
					if(locations_val[i]['title']=="postal_code") {
						
						postal_code_arr.push(locations_val[i]['location_val']);
					}

					if(locations_val[i]['title']=="administrative_area_level_1") {
						var state_arr = [];
						state_arr.push(locations_val[i]['location_val']);
					} 
					if(locations_val[i]['title']=="locality") {
						var billing_city_arr = []
						billing_city_arr.push(locations_val[i]['location_val']);

					} 
				} 


				
				if(postal_code_arr==undefined || postal_code_arr.length == 0){
					jQuery('#billing_postcode').val('');
					
				} else {
					jQuery('#billing_postcode').val(postal_code_arr[0]);
					
				}
				if(state_arr==undefined) {
					jQuery('#billing_state').val('');
				}  else {
					var elt = document.getElementById('billing_state');
					if(elt.nodeName=='INPUT') {
						jQuery('#billing_state').val(state_arr[0]);
					} else if(elt.nodeName=='SELECT') {
						let long_name = state_arr[0];
						let $element = jQuery('#billing_state')
						let val = $element.find("option:contains('"+long_name+"')").val()

						$element.val(val).trigger('change.select2');
						jQuery('#billing_state').trigger('change');
					} 	
				}

				if(billing_city_arr==undefined) {
					jQuery('#billing_city').val('');
				}  else {
					jQuery('#billing_city').val(billing_city_arr[0]);
				}
			}
			if(FMEAACOC_Country_Restriction.indexOf(check) != '-1') {
				var infowindow = new google.maps.InfoWindow();
				var infowindowContent = document.getElementById('infowindow-content');
				infowindow.setContent(infowindowContent);
				infowindowContent.children['place-icon'].src = place.icon;
				infowindowContent.children['place-name'].textContent = place.name;
				infowindowContent.children['place-address'].textContent = address;
				// infowindow.open(gmap, gmarker);
			}
		});
} else {
			// alert("Geocode was not successful for the following reason: " + status);
		}
	});

}

// Shipping Details AutoComplete Address

var FMEAACOC_geocoder1 = new google.maps.Geocoder();
function FMEAACOC_geocodePosition1(FMEAACOC_pos) {
	"use strict";
	FMEAACOC_geocoder1.geocode({
		latLng: FMEAACOC_pos
	}, function(responses1) {
		if (responses1 && responses1.length > 0) {
			FMEAACOC_updateMarkerAddress1(responses1[0].address_components, responses1[0].formatted_address);
		} else {
			FMEAACOC_updateMarkerAddress1('Cannot determine address at this location.');
		}
	});
}
function FMEAACOC_updateMarkerStatus1(FMEAACOC_str) {
	"use strict";
	document.getElementById('markerStatus1').innerHTML = FMEAACOC_str;
}
function FMEAACOC_updateMarkerPosition1(latLng) {
	"use strict";
	document.getElementById('info1').innerHTML = [
	latLng.lat(),
	latLng.lng()
	].join(', ');
}
function FMEAACOC_updateMarkerAddress1(FMEAACOC_str1,FMEAACOC_formatted_address1) {
	"use strict";
	document.getElementById('address1').innerHTML = FMEAACOC_formatted_address1;
	var getval =FMEAACOC_str1;
	var FMEAACOC_componentForms = {
		street_number: 'short_name',
		route: 'long_name',
		locality: 'long_name',
		administrative_area_level_1: 'long_name',
		country: 'short_name',
		postal_code: 'short_name'
	};
	
	if(FMEAACOC_formatted_address1 != '') {
		jQuery('#shipping_address_1').val(FMEAACOC_formatted_address1);
	}
	var FMEAACOC_locations_vals = [];
	for (var i = 0; i < getval.length; i++) {
		var addressTypes = getval[i].types[0];

		if (FMEAACOC_componentForms[addressTypes]) {
			var val = getval[i][FMEAACOC_componentForms[addressTypes]];
			if(addressTypes=='country') {
				FMEAACOC_Fileds_Check_Availability(val, gmarker1, gmap1, 'shipping');
				if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
					if(is_shipping_available && is_billing_available) {
						jQuery('#place_order').attr('disabled', false);
					} else {
						jQuery('#place_order').attr('disabled', true);
					}
				}
			}
			FMEAACOC_locations_vals.push({
				title: addressTypes, 
				location_val:  val
			});
		}
	} 
	for (var i = 0; i < FMEAACOC_locations_vals.length; i++) {
		if(FMEAACOC_locations_vals[i]['title']=='country') {
			let long_name = FMEAACOC_locations_vals[i]['location_val'];
			let $element = jQuery('#shipping_country')
			let val = $element.find("option:contains('"+long_name+"')").val()
			$element.val(long_name).trigger('change.select2');
			jQuery('#shipping_country').trigger('change');
		} 
		var postal_code_arr = [];
		if(FMEAACOC_locations_vals[i]['title']=="postal_code") {
			
			postal_code_arr.push(FMEAACOC_locations_vals[i]['location_val']);
		}
		if(FMEAACOC_locations_vals[i]['title']=="administrative_area_level_1") {
			var state_arr = [];
			state_arr.push(FMEAACOC_locations_vals[i]['location_val']);
		} 
		if(FMEAACOC_locations_vals[i]['title']=="locality") {
			var shipping_city_arr = []
			shipping_city_arr.push(FMEAACOC_locations_vals[i]['location_val']);
		} 
	} 



	if(postal_code_arr==undefined || postal_code_arr.length == 0){
		jQuery('#shipping_postcode').val('');
		
	} else {
		
		jQuery('#shipping_postcode').val(postal_code_arr[0]);
		
	}
	if(state_arr==undefined) {
		jQuery('#shipping_state').val('');
	}  else {
		var elt = document.getElementById('shipping_state');
		if(elt.nodeName=='INPUT') {
			jQuery('#shipping_state').val(state_arr[0]);
		} else if(elt.nodeName=='SELECT') {
			let long_name = state_arr[0];
			let $element = jQuery('#shipping_state')
			let val = $element.find("option:contains('"+long_name+"')").val()
			$element.val(val).trigger('change.select2');
			jQuery('#shipping_state').trigger('change');
		} 	
	}
	if(shipping_city_arr==undefined) {
		jQuery('#shipping_city').val('');
	}  else {
		jQuery('#shipping_city').val(shipping_city_arr[0]);
	}
}


function FMEAACOC_shipping_autocomplete2() {
	"use strict";

	jQuery('#shipping_address_1').after('<div id="FMEAACOC_map_canvas1"></div><div  style="display:none;"><div id="infowindow-content1"><img src="" width="16" height="16" id="place-icon"><span id="place-name"  class="title"></span><br><span id="place-address"></span></div></div><div id="infoPanel"><b>Marker status:</b><div id="markerStatus1"><i>Click and drag the marker.</i></div><b>Current position:</b><div id="info1"></div><b>Closest matching address:</b><div id="address1"></div></div>');
	var FMEAACOC_Address_AutoComplete_Settings = jQuery('#FMEAACOC_Address_AutoComplete_Settings').val();
	var FMEAACOC_settings = JSON.parse(FMEAACOC_Address_AutoComplete_Settings);
	var shipping_address = FMEAACOC_settings.FMEAACOC_shipping_text;	
	FMEAACOC_map_design(FMEAACOC_settings.FMEAACOC_map_design);

	if(jQuery('#shipping_address_1').val()=='') {
		if(FMEAACOC_settings.FMEAACOC_shipping_text!='') {
			var FMEAACOC_shipping_address = FMEAACOC_settings.FMEAACOC_shipping_text;
		} else {


			var fme_shop_default_country = fmeaacoc_data.fme_shop_default_countries;
			alert(fme_shop_default_country);
			let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
			regionNames.of(fme_shop_default_country.split(':')[0]);
			var FMEAACOC_shipping_address = regionNames.of(fme_shop_default_country.split(':')[0]);



			// var FMEAACOC_shipping_address = 'united state';
		}
	} else if(jQuery('#shipping_address_1').val()!='' && FMEAACOC_settings.FMEAACOC_shipping_text!='') {
		var FMEAACOC_shipping_address = jQuery('#shipping_address_1').val();
	} else {
		if(FMEAACOC_settings.FMEAACOC_shipping_text!='') {
			var FMEAACOC_shipping_address = FMEAACOC_settings.FMEAACOC_shipping_text;
		} else {
			var FMEAACOC_shipping_address = jQuery('#shipping_address_1').val();
		}
	}
	var FMEAACOClatlngarr = [];
	FMEAACOC_geocoder.geocode( { 'address': FMEAACOC_shipping_address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			FMEAACOClatlngarr[0]=results[0].geometry.location.lat();
			FMEAACOClatlngarr[1]=results[0].geometry.location.lng();
			var latLng = new google.maps.LatLng(FMEAACOClatlngarr[0],FMEAACOClatlngarr[1]);
			var map1 = new google.maps.Map(document.getElementById('FMEAACOC_map_canvas1'), {
				center: {lat: FMEAACOClatlngarr[0], lng: FMEAACOClatlngarr[1]},
				zoom: 13,
				styles:map_style
			});

			gmap1 = map1;

		// var card = document.getElementById('pac-card');
		var input = document.getElementById('shipping_address_1');
		input2 = input;
		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete2 = autocomplete;
		// Bind the map's bounds (viewport) property to the autocomplete object,
		// so that the autocomplete requests use the current map bounds for the
		// bounds option in the request.
		autocomplete.bindTo('bounds', map1);

		// Set the data fields to return when the user selects a place.
		autocomplete.setFields(
			['address_components', 'geometry', 'icon', 'name']);

		var infowindow = new google.maps.InfoWindow();
		var infowindowContent = document.getElementById('infowindow-content1');
		infowindow.setContent(infowindowContent);
		var marker = new google.maps.Marker({
			position: latLng,
			title: 'Point A',
			map: gmap1,
			draggable: true,
		});
		gmarker1 = marker;

		var infowindow2 = new google.maps.InfoWindow();
		infowindow_s = infowindow2;



		FMEAACOC_updateMarkerPosition1(latLng);
		FMEAACOC_geocodePosition1(latLng);

		google.maps.event.addListener(gmarker1, 'drag', function() {
			FMEAACOC_updateMarkerStatus1('Dragging...');
			FMEAACOC_updateMarkerPosition1(gmarker1.getPosition());
		});

		google.maps.event.addListener(gmarker1, 'dragend', function() {
			FMEAACOC_updateMarkerStatus1('Drag ended');
			FMEAACOC_geocodePosition1(gmarker1.getPosition());
		});


		autocompleteLsr2 = autocomplete.addListener('place_changed', function() {
			infowindow.close();
			gmarker1.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				// User entered the name of a Place that was not suggested and
				// pressed the Enter key, or the Place Details request failed.
				window.alert("No details available for input: '" + place.name + "'");
				return;
			}

			// If the place has a geometry, then present it on a map.
			if (place.geometry.viewport) {
				map1.fitBounds(place.geometry.viewport);
			} else {
				map1.setCenter(place.geometry.location);
				map1.setZoom(17);  // Why 17? Because it looks good.
			}
			gmarker1.setPosition(place.geometry.location);
			gmarker1.setVisible(true);

			var address = '';
			var check = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');

				var componentForm = {
					street_number: 'short_name',
					route: 'long_name',
					locality: 'long_name',
					administrative_area_level_1: 'long_name',
					country: 'short_name',
					postal_code: 'short_name'
				};

				var locations_val = [];
				for (var i = 0; i < place.address_components.length; i++) {
					var addressType = place.address_components[i].types[0];
					if (componentForm[addressType]) {
						var val = place.address_components[i][componentForm[addressType]];
						if(addressType=='country') {
							FMEAACOC_Fileds_Check_Availability(val, gmarker, gmap, 'shipping');
							if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
								if(is_shipping_available && is_billing_available) {
									jQuery('#place_order').attr('disabled', false);
								} else {
									jQuery('#place_order').attr('disabled', true);
								}
							}
						}
						locations_val.push({
							title: addressType, 
							location_val:  val
						});
					}
				} 

				for (var i = 0; i < locations_val.length; i++) {
					
					if(locations_val[i]['title']=='country') {

						let long_name = locations_val[i]['location_val'];
						let $element = jQuery('#shipping_country')
						check = long_name;
						let val = $element.find("option:contains('"+long_name+"')").val()
						$element.val(long_name).trigger('change.select2');
						jQuery('#shipping_country').trigger('change');
					} 
					var postal_code_arr = [];
					if(locations_val[i]['title']=="postal_code") {
						
						postal_code_arr.push(locations_val[i]['location_val']);
					}

					if(locations_val[i]['title']=="administrative_area_level_1") {
						var state_arr = [];
						state_arr.push(locations_val[i]['location_val']);
					} 
					if(locations_val[i]['title']=="locality") {
						var billing_city_arr = []
						billing_city_arr.push(locations_val[i]['location_val']);

					} 
				} 


				

				if(postal_code_arr==undefined || postal_code_arr.length == 0){
					jQuery('#shipping_postcode').val('');
					
				} else {
					jQuery('#shipping_postcode').val(postal_code_arr[0]);
					
				}

				if(state_arr==undefined) {
					jQuery('#shipping_state').val('');
				}  else {
					var elt = document.getElementById('shipping_state');
					if(elt.nodeName=='INPUT') {
						jQuery('#shipping_state').val(state_arr[0]);
					} else if(elt.nodeName=='SELECT') {
						let long_name = state_arr[0];
						let $element = jQuery('#shipping_state')
						let val = $element.find("option:contains('"+long_name+"')").val()
						$element.val(val).trigger('change.select2');
						jQuery('#shipping_state').trigger('change');
					} 	
				}

				if(billing_city_arr==undefined) {
					jQuery('#shipping_city').val('');
				}  else {
					jQuery('#shipping_city').val(billing_city_arr[0]);
				}
			}
			if(FMEAACOC_Country_Restriction.indexOf(check) != '-1') {
				infowindowContent.children['place-icon'].src = place.icon;
				infowindowContent.children['place-name'].textContent = place.name;
				infowindowContent.children['place-address'].textContent = address;
				// infowindow.open(map1, gmarker1);
			}
		});


} else {
		// alert("Geocode was not successful for the following reason: " + status);
	}
});

}
var FMEAACOC_Address_AutoComplete_Settings = jQuery('#FMEAACOC_Address_AutoComplete_Settings').val();
var FMEAACOC_settings = JSON.parse(FMEAACOC_Address_AutoComplete_Settings);
var FMEAACOC_shipping_Label_status = FMEAACOC_settings.FMEAACOC_shipping_Label_status;
var FMEAACOC_Country_Restriction = FMEAACOC_settings.FMEAACOC_Country_Restriction;
var FMEAACOC_API_KEY = FMEAACOC_settings.FMEAACOC_API_KEY;

var FMEAACOC_Address_AutoComplete_Status = FMEAACOC_settings.FMEAACOC_Address_AutoComplete_Status;
if (FMEAACOC_Address_AutoComplete_Status=='FMEAACOC_1' && FMEAACOC_shipping_Label_status=='FMEAACOC_1') {
	if (FMEAACOC_API_KEY !='') {
		var FMEAACOC_shipping_Label_text = FMEAACOC_settings.FMEAACOC_shipping_Label_text;
		var current= window.location.href;
		if(current.indexOf('billing') == -1){
			if(FMEAACOC_shipping_Label_text!='' && jQuery('#shipping_address_1_field').children()[0]) {
				jQuery('#shipping_address_1_field').children()[0].replaceWith(FMEAACOC_shipping_Label_text);
			}	
		}
		jQuery('#shipping_address_1').css("border", "2px solid lightgray");
		// google.maps.event.addDomListener(window, 'load', FMEAACOC_shipping_autocomplete2);
		FMEAACOC_shipping_autocomplete2();
		if(FMEAACOC_Country_Restriction!=null) {
			jQuery('body').on('change','#shipping_country',function(){
				var data=jQuery(this).val();
				if(FMEAACOC_Country_Restriction.indexOf(data) != '-1') {
					jQuery('#FMEAACOC_map_canvas1').hide();
					autocomplete2.unbindAll();
					autocomplete2 = '';
					google.maps.event.clearInstanceListeners(input2);
				} else {
					jQuery('#FMEAACOC_map_canvas1').show();

					autocomplete2 = new google.maps.places.Autocomplete(input2);
					autocomplete2.bindTo('bounds', gmap1);
					autocomplete2.setFields(
						['address_components', 'geometry', 'icon', 'name']);	

					autocomplete2.addListener('place_changed', function() {
						infowindow_s.close();
						gmarker1.setVisible(false);
						var place = autocomplete2.getPlace();
						if (!place.geometry) {
							window.alert("No details available for input: '" + place.name + "'");
							return;
						}
						if (place.geometry.viewport) {
							gmap1.fitBounds(place.geometry.viewport);
						} else {
							gmap1.setCenter(place.geometry.location);
							gmap1.setZoom(17);
						}
						gmarker1.setPosition(place.geometry.location);
						gmarker1.setVisible(true);

						var address = '';
						var check = '';
						if (place.address_components) {
							address = [
							(place.address_components[0] && place.address_components[0].short_name || ''),
							(place.address_components[1] && place.address_components[1].short_name || ''),
							(place.address_components[2] && place.address_components[2].short_name || '')
							].join(' ');

							var componentForm = {
								street_number: 'short_name',
								route: 'long_name',
								locality: 'long_name',
								administrative_area_level_1: 'long_name',
								country: 'short_name',
								postal_code: 'short_name'
							};

							var locations_val = [];
							for (var i = 0; i < place.address_components.length; i++) {
								var addressType = place.address_components[i].types[0];
								if (componentForm[addressType]) {
									var val = place.address_components[i][componentForm[addressType]];
									if(addressType=='country') {
										FMEAACOC_Fileds_Check_Availability(val, gmarker, gmap, 'shipping');
										if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
											if(is_shipping_available && is_billing_available) {
												jQuery('#place_order').attr('disabled', false);
											} else {
												jQuery('#place_order').attr('disabled', true);
											}
										}
									}
									locations_val.push({
										title: addressType, 
										location_val:  val
									});
								}
							} 

							for (var i = 0; i < locations_val.length; i++) {
								
								if(locations_val[i]['title']=='country') {

									let long_name = locations_val[i]['location_val'];
									let $element = jQuery('#shipping_country')
									check = long_name;
									let val = $element.find("option:contains('"+long_name+"')").val()
									$element.val(long_name).trigger('change.select2');
									jQuery('#shipping_country').trigger('change');
								} 
								var postal_code_arr = [];
								if(locations_val[i]['title']=="postal_code") {
									
									postal_code_arr.push(locations_val[i]['location_val']);
								}

								if(locations_val[i]['title']=="administrative_area_level_1") {
									var state_arr = [];
									state_arr.push(locations_val[i]['location_val']);
								} 
								if(locations_val[i]['title']=="locality") {
									var billing_city_arr = []
									billing_city_arr.push(locations_val[i]['location_val']);

								} 
							} 



							

							if(postal_code_arr==undefined || postal_code_arr.length == 0){
								jQuery('#shipping_postcode').val('');
								
							} else {
								jQuery('#shipping_postcode').val(postal_code_arr[0]);
								
							}

							if(state_arr==undefined) {
								jQuery('#shipping_state').val('');
							}  else {
								var elt = document.getElementById('shipping_state');
								if(elt.nodeName=='INPUT') {
									jQuery('#shipping_state').val(state_arr[0]);
								} else if(elt.nodeName=='SELECT') {
									let long_name = state_arr[0];
									let $element = jQuery('#shipping_state')
									let val = $element.find("option:contains('"+long_name+"')").val()
									$element.val(val).trigger('change.select2');
									jQuery('#shipping_state').trigger('change');
								} 	
							}

							if(billing_city_arr==undefined) {
								jQuery('#shipping_city').val('');
							}  else {
								jQuery('#shipping_city').val(billing_city_arr[0]);
							}
						}
						if(FMEAACOC_Country_Restriction.indexOf(check) != '-1') {
							var infowindow = new google.maps.InfoWindow();
							var infowindowContent = document.getElementById('infowindow-content1');
							infowindow.setContent(infowindowContent);
							infowindowContent.children['place-icon'].src = place.icon;
							infowindowContent.children['place-name'].textContent = place.name;
							infowindowContent.children['place-address'].textContent = address;
							// infowindow.open(gmap1, gmarker1);
						}
					});




}
});	
}	
}
jQuery('body').on('select2:select', '#shipping_country', function () {
	var data=jQuery(this).val();
	FMEAACOC_Fileds_Check_Availability(data, gmarker1, gmap1 ,'shipping');
	if(jQuery('#ship-to-different-address-checkbox').prop('checked')) {
		if(is_shipping_available && is_billing_available) {
			jQuery('#place_order').attr('disabled', false);
		} else {
			jQuery('#place_order').attr('disabled', true);
		}
	}
	let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
	let geocoder = new google.maps.Geocoder();
	let location = regionNames.of(data);



	geocoder.geocode({ 'address': location }, function(results, status){
		if (status == google.maps.GeocoderStatus.OK) {
			gmap1.setCenter(results[0].geometry.location);
			gmap1.panTo(results[0].geometry.location);
			gmarker1.setPosition(results[0].geometry.location);
		} else {
			alert("Could not find location: " + location);
		}
	});
});
}
});



    const myInterval = setInterval(myTimer, 1000);
    function myTimer() {
        jQuery(document).ready(function(){
            if(jQuery("#billing_address_1").val()){
                jQuery("#billing_address_1").val("");
            	jQuery("#billing_city").val("");
            	jQuery("#billing_state").val("");
            	jQuery("#billing_postcode").val("");
                jQuery("#billing_phone").val("");   
    	    }
        });
    }
    setInterval(function(){
        
           jQuery("#shipping_address_1").val(jQuery("#shipping_address_1").val().split(',')[0]);
    },500);
	
	
    setTimeout(function(){
      //  alert("djkdf")
            jQuery("#shipping_address_1").val("");
            	jQuery("#shipping_city").val("");
            	jQuery("#shipping_state").val("");
            	jQuery("#shipping_postcode").val("");
    },6000);





