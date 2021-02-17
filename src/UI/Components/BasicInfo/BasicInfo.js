/**
 * UI/Components/BasicInfo/BasicInfo.js
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
	var DB                 = require('DB/DBManager');
	var MonsterTable       = require('DB/Monsters/MonsterTable');
	var Client             = require('Core/Client');
	var Preferences        = require('Core/Preferences');
	var Renderer           = require('Renderer/Renderer');
	var UIManager          = require('UI/UIManager');
	var UIComponent        = require('UI/UIComponent');
	var htmlText           = require('text!./BasicInfo.html');
	var cssText            = require('text!./BasicInfo.css');


	/**
	 * Create Basic Info component
	 */
	var BasicInfo = new UIComponent( 'BasicInfo', htmlText, cssText );


	/**
	 * Stored data
	 */
	BasicInfo.base_exp      = 0;
	BasicInfo.base_exp_next = 1;
	BasicInfo.job_exp       = 0;
	BasicInfo.job_exp_next  =-1;


	/**
	 * @var {Preferences} structure
	 */
	var _preferences = Preferences.get('BasicInfo', {
		x:        640,
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
	BasicInfo.init = function init()
	{
		this.draggable();
	};


	/**
	 * When append the element to html
	 * Execute elements in memory
	 */
	BasicInfo.onAppend = function onAppend()
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
		
		// large/small window
		this.ui.removeClass('small large');
		this.ui.addClass('large');
	};


	/**
	 * Once remove, save preferences
	 */
	BasicInfo.onRemove = function onRemove()
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
	 * Process shortcut
	 *
	 * @param {object} key
	 */
	BasicInfo.onShortCut = function onShortCut( key )
	{
		switch (key.cmd) {
			case 'EXTEND':
				this.toggleMode();
				break;
		}
	};


	/**
	 * Switch window size
	 */
	BasicInfo.toggleMode = function toggleMode()
	{
		this.ui.find('.buttons').show();
	};

	/**
	 * Update UI elements
	 *
	 * @param {string} type identifier
	 * @param {number} val1
	 * @param {number} val2 (optional)
	 */
	BasicInfo.update = function update( type, val1, val2 )
	{
		switch (type) {
			case 'name':
			case 'blvl':
			case 'jlvl':
				this.ui.find('.'+ type +'_value').text(val1);
				break;

			case 'job':
				this.ui.find('.job_value').text(MonsterTable[val1]);
				break;

			case 'bexp':
			case 'jexp':
				if (!val2) {
					this.ui.find('.' + type).hide();
					break;
				}

				this.ui.find('.'+ type).show();
				this.ui.find('.'+ type +' div').css('width', Math.min( 100, Math.floor(val1 * 100 / val2) ) + '%');
				this.ui.find('.'+ type +'_value').text( Math.min( 100, (Math.floor(val1 * 1000 / val2) * 0.1).toFixed(1)) + '%');
				break;

			case 'hp':
			case 'sp':
				var perc  = Math.floor(val1 * 100 / val2);
				var color = perc < 25 ? 'red' : 'blue';
				this.ui.find('.'+ type +'_value').text(val1);
				this.ui.find('.'+ type +'_max_value').text(val2);
				this.ui.find('.'+ type +'_perc').text( perc + '%');

				if (perc <= 0) {
					this.ui.find('.'+ type +'_bar div').css('backgroundImage', 'none');
					break;
				}

				Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/gze'+ color +'_left.bmp', function(url){
					this.ui.find('.'+ type +'_bar_left').css('backgroundImage', 'url('+ url +')');
				}.bind(this));

				Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/gze'+ color +'_mid.bmp', function(url){
					this.ui.find('.'+ type +'_bar_middle').css({
						backgroundImage: 'url('+ url +')',
						width: Math.floor( Math.min( perc, 100 ) * 1.27 ) + 'px'
					});
				}.bind(this));

				Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/gze'+ color +'_right.bmp', function(url){
					this.ui.find('.'+ type +'_bar_right').css({
						backgroundImage: 'url('+ url +')',
						left: Math.floor( Math.min( perc, 100) * 1.27 ) + 'px'
					});
				}.bind(this));
				break;
		}
	};


	/**
	 * Create component and export it
	 */
	return UIManager.addComponent(BasicInfo);
});
