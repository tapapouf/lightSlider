!function($, window){
"use strict";

var lightSliderFactory = function(opt){
return function () {
	var options = $.extend({}, lightSliderFactory_DEFAULTS, opt);
	var $container = 0;
	var prev_item = 0;
	var cur_item = 0;
	var $items = [];
	var $nav_items = [];
	var item_count = 0;
	var datas = {};

	var init = function(el){
		$container = $(el);
		$items = $container.find(options.itemsSelector);
		item_count = $items.size();
		$nav_items = $container.find(options.navsSelector).bind('click', slidenavclicked);
		$container.find(options.arrowsSelector).bind('click', slidearrowclicked);
		
		options.oninit.call(null, $container, el, options, $items, datas, showItem, decalItem);
	};

	var slidenavclicked = function(ev){
		if ( $container.hasClass(options.cantAnimClass) ) {
			return;
		}
		var $el = $(ev.currentTarget);
		var data_nb = $el.attr(options.itemNbAttr);
		prev_item = cur_item;
		cur_item = $el.index() % item_count;
		if ( cur_item != prev_item ) {
			showItem();
		}
	};

	var slidearrowclicked = function(ev){
		var $el = $(ev.currentTarget);
		var way = ($el.hasClass(options.arrowLeftClass)) ? -1 : 1;
		decalItem(way);
	};

	var decalItem = function(way){
		if ( $container.hasClass(options.cantAnimClass) ) {
			return;
		}
		prev_item = cur_item;
		cur_item += way;
		if ( cur_item < 0 ) {
			cur_item = item_count - 1;
		}
		else if ( cur_item >= item_count ) {
			cur_item = 0;
		}
		showItem();
	};

	var showItem = function(){
		$container.addClass(options.cantAnimClass);
		
		// callback qui permet de gerer la transition
		options.onshowitem.call(null, $container, prev_item, cur_item, $items, datas);

		refreshNavItems();
	};

	var refreshNavItems = function(){
		$nav_items.removeClass(options.navsClassSelected);
		$($nav_items.get(cur_item)).addClass(options.navsClassSelected);
	};

	return {
		'init' : init
	}

}();
}

var lightSliderFactory_DEFAULTS = {
	'itemsSelector' : '.js-slideitem',
	'navsSelector' : '.js-slideitemnav',
	'arrowsSelector' : '.js-slidearrow',
	'arrowLeftClass' : 'js-slidearrow--left',
	'cantAnimClass' : 'cantanim',
	'itemNbAttr' : 'data-nb',
	'navsClassSelected' : 'isselected',
	'oninit' : function(){},
	'onshowitem' : function(){}
};

// =======================
$.fn.lightSlider = function (option) {
	return this.each(function () {
		var $this   = $(this);
		var data    = $this.data("cyma.lightSlider");
		var options = typeof option === "object" && option;

		if (!data) {
			data = lightSliderFactory(options);
			data.init(this);
			$this.data("cyma.lightSlider", data);
		}
		if (typeof option === "string") data[option]();
	});
};

}(jQuery, window);

