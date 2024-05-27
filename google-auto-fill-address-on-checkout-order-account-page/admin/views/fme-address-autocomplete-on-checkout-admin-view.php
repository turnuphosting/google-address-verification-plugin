<?php 
$FMEAACOC_View_Settings = get_option('FMEAACOC_Settings');
?>
<div class="container-fluid">
	<div class="FMEAACOC_Settings_Form">

		<div class="row" id="FMEAACOC_Settings">
			<div class="col-sm-12 col-md-3">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Enable Autocomplete Address:', 'FMEAACOC'); ?></div>
			</div>
			<div class="col-sm-12 col-md-6">
					<input type="checkbox" <?php echo checked('FMEAACOC_1' , $FMEAACOC_View_Settings['FMEAACOC_Address_AutoComplete_Status']); ?> value='<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_Address_AutoComplete_Status']); ?>' onchange="FMEAACOC_Enable_Disable()" class="form-control" id="FMEAACOC_Enable">
					<label for="FMEAACOC_Enable" id="FMEAACOC_description"><?php echo esc_html__('Activate Google Address Autocomplete on Checkout, Account and Orders Page', 'FMEAACOC'); ?></label>
			</div>
		</div>

		<div class="row" id="FMEAACOC_Settings">
			<div class="col-sm-12 col-md-3">
				<div class="form-row">
					<div id="FMEAACOC_Label"><?php echo esc_html__('Google API Key:', 'FMEAACOC'); ?>							<span class="woocommerce-help-tip" data-tip="Enter the API key for Google Places API."></span>
					</div>
				</div>

			</div>
		
			<div class="col-sm-12 col-md-6">
				<input type="text" name="FMEAACOC_API_KEY" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_API_KEY']); ?>" id="FMEAACOC_API_KEY" class="form-control">
			</div>
		</div>

		<div class="row" id="FMEAACOC_Settings">
			<div class="col-sm-12 col-md-3">
				<div class="form-row">
					<div id="FMEAACOC_Label"><?php echo esc_html__('Country Restriction:', 'FMEAACOC'); ?>
						<span class="woocommerce-help-tip" data-tip="Select country to hide map on Checkout, Account and Orders Page"></span>
					</div>
				</div>
			</div>
			
			<div class="col-sm-12 col-md-6">
				<?php
				global $woocommerce;
				$countries_obj   = new WC_Countries();
				$countries  = $countries_obj->__get('countries');
				if ('' == $FMEAACOC_View_Settings['FMEAACOC_Country_Restriction']) {
					$selected_country = array();
				} else {
					$selected_country = $FMEAACOC_View_Settings['FMEAACOC_Country_Restriction'];
				}
				?>
				<select name="FMEAACOC_Country_Restriction" id="FMEAACOC_Country_Restriction" multiple="multiple">
					<?php 
					foreach ($countries as $key => $value) {
						?>
						<option  class="option-item" value="<?php echo esc_attr($key); ?>"
							<?php
							if (in_array($key, $selected_country)) {
								echo esc_attr('selected');
							}
							?>
							>
							<?php
							echo esc_attr($value);
							?>
						</option>
						<?php
					}
					?>
				</select>
			</div>
		</div>

		<div class="row" id="FMEAACOC_Settings">
			<div class="col-sm-12 col-md-3">
				<div class="form-row">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Select Map Design:', 'FMEAACOC'); ?>
				<span class="woocommerce-help-tip" data-tip="Select Map Design To Show On Checkout & Orders Page"></span>
				</div>
			</div>
			</div>
			<div class="col-sm-12 col-md-9">
				<select name="FMEAACOC_map_design" id="FMEAACOC_map_design" onchange="FMEAACOC_select_Map()">
					<option value="FMEAACOC_defualt_map" <?php selected('FMEAACOC_defualt_map' , $FMEAACOC_View_Settings['FMEAACOC_map_design']); ?>><?php echo esc_html__('Standard', 'FMEAACOC'); ?></option>
					<option value="FMEAACOC_defualt_map1" <?php selected('FMEAACOC_defualt_map1' , $FMEAACOC_View_Settings['FMEAACOC_map_design']); ?>><?php echo esc_html__('Light Pink', 'FMEAACOC'); ?></option>
					<option value="FMEAACOC_defualt_map2" <?php selected('FMEAACOC_defualt_map2' , $FMEAACOC_View_Settings['FMEAACOC_map_design']); ?>><?php echo esc_html__('Green', 'FMEAACOC'); ?></option>
					<option value="FMEAACOC_defualt_map3" <?php selected('FMEAACOC_defualt_map3' , $FMEAACOC_View_Settings['FMEAACOC_map_design']); ?>><?php echo esc_html__('Aubergine', 'FMEAACOC'); ?></option>
					<option value="FMEAACOC_defualt_map4" <?php selected('FMEAACOC_defualt_map4' , $FMEAACOC_View_Settings['FMEAACOC_map_design']); ?>><?php echo esc_html__('Sky Blue', 'FMEAACOC'); ?></option>
				</select>
			</div>
			<div class="col-md-3" id="FMEAACOC_Map_templates">
			</div>
			<div class="col-md-6" id="FMEAACOC_Map_templates">

				<img src="<?php echo esc_attr(FMEAOCOC_URL) . 'admin/images/default_map.png'; ?>" class="img-responsive" id="FMEAACOC_defualt_map" 
				<?php 
				if ('FMEAACOC_defualt_map'==$FMEAACOC_View_Settings['FMEAACOC_map_design'] || '' == $FMEAACOC_View_Settings['FMEAACOC_map_design']) {
					echo 'style = display:block';
				} else {
					echo 'style = display:none';
				}
				?>
				>
				<img src="<?php echo esc_attr(FMEAOCOC_URL) . 'admin/images/default_map1.png'; ?>" class="img-responsive" id="FMEAACOC_defualt_map1"
				<?php 
				if ('FMEAACOC_defualt_map1'==$FMEAACOC_View_Settings['FMEAACOC_map_design']) {
					echo 'style = display:block';
				} else {
					echo 'style = display:none';
				}
				?>
				>
				<img src="<?php echo esc_attr(FMEAOCOC_URL) . 'admin/images/default_map2.png'; ?>" class="img-responsive" id="FMEAACOC_defualt_map2"
				<?php 
				if ('FMEAACOC_defualt_map2'==$FMEAACOC_View_Settings['FMEAACOC_map_design']) {
					echo 'style = display:block';
				} else {
					echo 'style = display:none';
				}
				?>
				>
				<img src="<?php echo esc_attr(FMEAOCOC_URL) . 'admin/images/default_map3.png'; ?>" class="img-responsive" id="FMEAACOC_defualt_map3" 
				<?php 
				if ('FMEAACOC_defualt_map3'==$FMEAACOC_View_Settings['FMEAACOC_map_design']) {
					echo 'style = display:block';
				} else {
					echo 'style = display:none';
				}
				?>
				>
				<img src="<?php echo esc_attr(FMEAOCOC_URL) . 'admin/images/default_map4.png'; ?>" class="img-responsive" id="FMEAACOC_defualt_map4"
				<?php 
				if ('FMEAACOC_defualt_map4'==$FMEAACOC_View_Settings['FMEAACOC_map_design']) {
					echo 'style = display:block';
				} else {
					echo 'style = display:none';
				}
				?>
				>
			</div>
		</div>

		<div class="row" id="FMEAACOC_Settings">
			<div class="col-sm-12 col-md-3">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Show on Billing Details:', 'FMEAACOC'); ?></div>
			</div>
			<div class="col-sm-12 col-md-6">
				<input type="checkbox" onchange="FMEAACOC_Enable_billing_details()" <?php checked('FMEAACOC_1', $FMEAACOC_View_Settings['FMEAACOC_billing_Label_status']); ?> class="form-control" placeholder="Address Autocomplete" id="FMEAACOC_billing_Label" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_billing_Label_status']); ?>">
				<label id="FMEAACOC_description"><?php echo esc_html__('Enable Google Address Autocomplete On Checkout Billing Details', 'FMEAACOC'); ?></label>
			</div>
		</div>
		<div class="row FMEAACOC_billing_Label" id="FMEAACOC_Settings" 
			<?php 
			if ('FMEAACOC_0' == $FMEAACOC_View_Settings['FMEAACOC_billing_Label_status'] || '' == $FMEAACOC_View_Settings['FMEAACOC_billing_Label_status']) { 
				echo "style='display:none'";  
			} 
			?>
			>
			<div class="col-sm-12 col-md-3">
				<div class="form-row">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Field Label:', 'FMEAACOC'); ?>
				<span class="woocommerce-help-tip" data-tip="Enter the label of autocomplete field you want to show on Billing Details"></span></div>
			</div>
			</div>
			<div class="col-sm-12 col-md-6">
				<input type="text" name="FMEAACOC_billing_Label_text" id="FMEAACOC_billing_Label_text" class="form-control" placeholder=" Billing address autocomplete label" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_billing_Label_text']); ?>">
			</div>
		</div>
		<div class="row FMEAACOC_billing_Label" id="FMEAACOC_Settings" 
			<?php 
			if ('FMEAACOC_0' == $FMEAACOC_View_Settings['FMEAACOC_billing_Label_status'] || '' == $FMEAACOC_View_Settings['FMEAACOC_billing_Label_status']) { 
				echo "style='display:none'";  
			} 
			?>
			>
			<div class="col-sm-12 col-md-3">
				<div class="form-row">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Billing Field Address:', 'FMEAACOC'); ?>
				<span class="woocommerce-help-tip" data-tip="Enter the Address of autocomplete field you want to show on Billing Address Field"></span></div>
			</div>
			</div>
			<div class="col-sm-12 col-md-6">
				<input type="text" name="FMEAACOC_billing_text" id="FMEAACOC_billing_text" class="form-control" placeholder=" Billing autocomplete address" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_billing_text']); ?>">
			</div>
		</div>

		<div class="row FMEAACOC_billing_Label" id="FMEAACOC_Settings" 
		<?php 
		if ('FMEAACOC_0' == $FMEAACOC_View_Settings['FMEAACOC_billing_Label_status'] || '' == $FMEAACOC_View_Settings['FMEAACOC_billing_Label_status']) { 
			echo "style='display:none'";  
		} 
		?>
		>
		<div class="col-sm-12 col-md-3">
			<div class="form-row">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Billing Error Message:', 'FMEAACOC'); ?>
				<span class="woocommerce-help-tip" data-tip="Enter the message to show when Selling not available on selected country"></span></div>
			</div>
		</div>
		<div class="col-sm-12 col-md-6">
			<input type="text" name="FMEAACOC_billing_message" id="FMEAACOC_billing_message" class="form-control" placeholder="Billing not available message" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_billing_message']); ?>">
		</div>
	</div>


		<div class="row" id="FMEAACOC_Settings">
			<div class="col-sm-12 col-md-3">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Show on Shipping Details:', 'FMEAACOC'); ?></div>
			</div>
			<div class="col-sm-12 col-md-6">
				<input type="checkbox" <?php checked('FMEAACOC_1' , $FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status']); ?> onchange="FMEAACOC_Enable_shipping_details()" class="form-control" id="FMEAACOC_shipping_Label" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status']); ?>">
				<label id="FMEAACOC_description" for="FMEAACOC_shipping_Label"><?php echo esc_html__('Enable Google Address Autocomplete on Checkout shipping Details', 'FMEAACOC'); ?></label>
			</div>
		</div>
		<div class="row FMEAACOC_shipping_Label" id="FMEAACOC_Settings" 
			<?php 
			if ('FMEAACOC_0' == $FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status'] || '' == $FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status']) { 
				echo "style='display:none'";  
			} 
			?>
			>
			<div class="col-sm-12 col-md-3">
				<div class="form-row">
					<div id="FMEAACOC_Label"><?php echo esc_html__('Field Label:', 'FMEAACOC'); ?>
					<span class="woocommerce-help-tip" data-tip="Enter the label of autocomplete field you want to show on shipping Details"></span></div>
				</div>
			</div>
			<div class="col-sm-12 col-md-6">
				<input type="text" name="FMEAACOC_shipping_Label_text" id="FMEAACOC_shipping_Label_text" class="form-control" placeholder="Shipping address autocomplete label" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_shipping_Label_text']); ?>">
			</div>
		</div>
		<div class="row FMEAACOC_shipping_Label" id="FMEAACOC_Settings" 
			<?php 
			if ('FMEAACOC_0' == $FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status'] || '' == $FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status']) { 
				echo "style='display:none'";  
			} 
			?>
			>
			<div class="col-sm-12 col-md-3">
				<div class="form-row">
					<div id="FMEAACOC_Label"><?php echo esc_html__('Shipping Field Address:', 'FMEAACOC'); ?>
					<span class="woocommerce-help-tip" data-tip="Enter the Address of autocomplete field you want to show on shipping Address Field">	
					</span>
				</div></div>
			</div>
			<div class="col-sm-12 col-md-6">
				<input type="text" name="FMEAACOC_shipping_text" id="FMEAACOC_shipping_text" class="form-control" placeholder="Shipping autocomplete address" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_shipping_text']); ?>">
			</div>
		</div>

		<div class="row FMEAACOC_shipping_Label" id="FMEAACOC_Settings" 
		<?php 
		if ('FMEAACOC_0' == $FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status'] || '' == $FMEAACOC_View_Settings['FMEAACOC_shipping_Label_status']) { 
			echo "style='display:none'";  
		} 
		?>
		>
		<div class="col-sm-12 col-md-3">
			<div class="form-row">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Shipping Error Message:', 'FMEAACOC'); ?>
				<span class="woocommerce-help-tip" data-tip="Enter the message to show when shipping not available on selected country">	
				</span>
			</div></div>
		</div>
		<div class="col-sm-12 col-md-6">
			<input type="text" name="FMEAACOC_shipping_message" id="FMEAACOC_shipping_message" class="form-control" placeholder="Shipping not available message" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_shipping_message']); ?>">
		</div>
	</div>


		<div class="row" id="FMEAACOC_Settings">
			<div class="col-sm-12 col-md-3">
				<div id="FMEAACOC_Label"><?php echo esc_html__('Show on Orders Page:', 'FMEAACOC'); ?></div>
			</div>
			<div class="col-sm-12 col-md-6">
				<input type="checkbox" <?php checked('FMEAACOC_1' , $FMEAACOC_View_Settings['FMEAACOC_enable_order_autocomplete_address']); ?> onchange="FMEAACOC_Enable_order_autocomplete_address()" class="form-control" id="FMEAACOC_enable_order_autocomplete_address" value="<?php echo esc_attr($FMEAACOC_View_Settings['FMEAACOC_enable_order_autocomplete_address']); ?>">
				<label id="FMEAACOC_description"><?php echo esc_html__('Enable Google Address Autocomplete on Order Page', 'FMEAACOC'); ?></label>
			</div>
		</div>

	</div>
	<div class="row">
		<div class="col-md-3">
			<input type="button" onclick="FMEAACOC_Save_Settings();" name="FMEAACOC_Seve_Settings" value="<?php echo esc_html__('Save Settings', 'FMEAACOC'); ?>" class="button-primary" id="FMEAACOC_Seve_Settings_btn">
		</div>
		<div class="col-md-6 col-sm-12">
			<span id="FMEAACOC_settings_msg" >
					<strong><?php echo esc_html__('Save General Settings Successfully!', ' FMEAACOC'); ?></strong>
			</span>
		</div>
	</div>
</div>
