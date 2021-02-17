/**
 * UI/Components/BasicInfo/MainMenu.js
 *
 * Chararacter Basic information windows
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function(require)
{
	'use strict';


	/**
	 * Dependencies
	 */
	var Preferences        = require('Core/Preferences');
	var Renderer           = require('Renderer/Renderer');
	var Session            = require('Engine/SessionStorage');
	var UIManager          = require('UI/UIManager');
	var UIComponent        = require('UI/UIComponent');
	var Inventory          = require('UI/Components/Inventory/Inventory');
	var Equipment          = require('UI/Components/Equipment/Equipment');
	var SkillList          = require('UI/Components/SkillList/SkillList');
	var PartyFriends       = require('UI/Components/PartyFriends/PartyFriends');
	var Guild              = require('UI/Components/Guild/Guild');
	var Escape             = require('UI/Components/Escape/Escape');
	var htmlText           = require('text!./MainMenu.html');
	var cssText            = require('text!./MainMenu.css');


	/**
	 * Create Basic Info component
	 */
	var MainMenu = new UIComponent( 'MainMenu', htmlText, cssText );


	/**
	 * Stored data
	 */
	MainMenu.weight        = 0;
	MainMenu.weight_max    = 1;


	/**
	 * @var {Preferences} structure
	 */
	var _preferences = Preferences.get('MainMenu', {
		x:        Infinity,
		y:        Infinity,
		reduce:   true,
		buttons:  true,
		magnet_top: true,
		magnet_bottom: false,
		magnet_left: true,
		magnet_right: false
	}, 1.0);


	/**
	 * Initialize UI
	 */
	MainMenu.init = function init()
	{
		console.log('init');
		// Don't activate drag drop when clicking on buttons
		this.ui.find('.topbar button').mousedown(function( event ){
			event.stopImmediatePropagation();
		});

		this.ui.find('.buttons button').mousedown(function(){
			switch (this.className) {
				case 'item':
					Inventory.ui.toggle();
					break;

				case 'info':
					Equipment.toggle();
					break;

				case 'skill':
					SkillList.toggle();
					break;

				case 'option':
					Escape.ui.toggle();
					break;

				case 'party':
					PartyFriends.toggle();
					break;

				case 'guild':
					Guild.toggle();
					break;

				case 'map':
				case 'quest':
			}
		});

		this.draggable();
	};


	/**
	 * When append the element to html
	 * Execute elements in memory
	 */
	MainMenu.onAppend = function onAppend()
	{
		// Apply preferences
		this.ui.css({
			top:  Math.min( Math.max( 0, _preferences.y), Renderer.height - this.ui.height()),
			left: Math.min( Math.max( 0, _preferences.x), Renderer.width  - this.ui.width())
		});
		
		this.magnet.TOP = _preferences.magnet_top;
		this.magnet.BOTTOM = _preferences.magnet_bottom;
		this.magnet.LEFT = _preferences.magnet_left;
		this.magnet.RIGHT = _preferences.magnet_right;
	};


	/**
	 * Once remove, save preferences
	 */
	MainMenu.onRemove = function onRemove()
	{
		_preferences.x       = parseInt(this.ui.css('left'), 10);
		_preferences.y       = parseInt(this.ui.css('top'), 10);
		_preferences.reduce  = this.ui.hasClass('small');
		_preferences.buttons = this.ui.find('.buttons').is(':visible');
		_preferences.magnet_top = this.magnet.TOP;
		_preferences.magnet_bottom = this.magnet.BOTTOM;
		_preferences.magnet_left = this.magnet.LEFT;
		_preferences.magnet_right = this.magnet.RIGHT;
		_preferences.save();
	};


	/**
	 * Update UI elements
	 *
	 * @param {string} type identifier
	 * @param {number} val1
	 * @param {number} val2 (optional)
	 */
	MainMenu.update = function update( type, val1, val2 )
	{
		switch (type) {
			case 'zeny':
				Session.zeny = val1;

				var list = val1.toString().split('');
				var i, count = list.length;
				var str = '';

				for (i = 0; i < count; i++) {
					str = list[count-i-1] + (i && i%3 ===0 ? ',' : '') + str;
				}

				this.ui.find('.'+ type +'_value').text(str);
				break;

			case 'weight':
				this.ui.find('.weight_value').text(val1 / 10 | 0);
				this.ui.find('.weight_total').text(val2 / 10 | 0);
				this.ui.find('.weight').css('color',  val1 < (val2/2) ? '' : 'red');
				break;
		}
	};


	/**
	 * Create component and export it
	 */
	return UIManager.addComponent(MainMenu);
});
