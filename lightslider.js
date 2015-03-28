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
	var $bg_container = null;

	var init = function(el, options){
		$container = $(el);
		$items = $container.find('.js-slideitem');
		item_count = $items.size();
		$nav_items = $container.find('.js-slideitemnav').bind('click', slidenavclicked);
		$container.find('.js-slidearrow').bind('click', slidearrowclicked);
		
	};

	var slidenavclicked = function(ev){
		if ( $container.hasClass('cantanim') ) {
			return;
		}
		var $el = $(ev.currentTarget);
		var data_nb = $el.attr('data-nb');
		prev_item = cur_item;
		cur_item = $el.index() % item_count;
		if ( cur_item != prev_item ) {
			showItem();
		}
	};

	var slidearrowclicked = function(ev){
		if ( $container.hasClass('cantanim') ) {
			return;
		}
		var $el = $(ev.currentTarget);
		var way = ($el.hasClass('js-slidearrow--left')) ? -1 : 1;
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
		$container.addClass('cantanim');
		
		// callback qui permet de gerer la transition
		options.onshowitem.call(null, $container, prev_item, cur_item, $items);

		refreshNavItems();
		
	};

	var refreshNavItems = function(){

		$nav_items.removeClass('isselected');
		$($nav_items.get(cur_item)).addClass('isselected');
		
	};

	

	return {
		'init' : init
	}

}();
}

var lightSliderFactory_DEFAULTS = {
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
			data.init(this, options);
			$this.data("cyma.lightSlider", data);
		}
		if (typeof option === "string") data[option]();
	});
};

}(jQuery, window);

