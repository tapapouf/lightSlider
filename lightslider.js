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
	var auto_play = options.autoPlay;
	var auto_play_timer = 0;
	var navs_clicked = false;

	var init = function(el){
		$container = $(el);
		$items = $container.find(options.itemsSelector);
		item_count = $items.size();
		$nav_items = $container.find(options.navsSelector).bind('click', slideNavClicked);
		$container.find(options.arrowsSelector).bind('click', slideArrowClicked);
		if ( options.useTouchEvents && $.fn.swipe ) {
			$container.swipe({
				swipeLeft:function(event, direction, distance, duration, fingerCount) {
					navs_clicked = true;
					stopAutoPlay();
					decalItem(1);
				},
				swipeRight:function(event, direction, distance, duration, fingerCount) {
					navs_clicked = true;
					stopAutoPlay();
					decalItem(-1);
				}
			});
		}

		options.oninit && options.oninit.call(null, $container, el, options, $items, datas, showItem, decalItem);
		if ( auto_play ) {
			$container.hover(function(){
				navs_clicked = false;
				stopAutoPlay();
			}, function(){
				if ( options.autoPlayForceRestart || navs_clicked === false ) {
					startAutoPlay();
				}
			});
			startAutoPlay();
		}
	};

	var startAutoPlay = function(){
		auto_play_timer = setInterval(function() {
			decalItem(1);
		}, options.autoPlayDelay);
	};

	var stopAutoPlay = function(){
		clearTimeout(auto_play_timer);
	};

	var slideNavClicked = function(ev){
		navs_clicked = true;
		stopAutoPlay();
		if ( $container.hasClass(options.cantAnimClass) ) {
			return;
		}
		var $el = $(ev.currentTarget);
		var data_nb = $el.attr(options.itemNbAttr);
		var data_nb = $el.index();
		prev_item = cur_item;
		cur_item = $el.index() % item_count;
		if ( cur_item != prev_item ) {
			showItem();
		}
	};

	var slideArrowClicked = function(ev){
		navs_clicked = true;
		stopAutoPlay();
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

	var setItem = function(nb){
		if ( $container.hasClass(options.cantAnimClass) ) {
			return;
		}
		prev_item = cur_item;
		cur_item = nb;
		showItem();
	};

	var showItem = function(){
		$container.addClass(options.cantAnimClass);
		
		// callback qui permet de gerer la transition
		options.onshowitem.call(null, $container, prev_item, cur_item, options, $items, datas);

		refreshNavItems();
	};

	var refreshNavItems = function(){
		$nav_items.removeClass(options.navsClassSelected)
			.eq(cur_item).addClass(options.navsClassSelected);
	};

	return {
		'init' : init,
		'setItem' : setItem
	};

}();
};

var lightSliderFactory_DEFAULTS = {
	'itemsSelector' : '.js-slideitem',
	'navsSelector' : '.js-slideitemnav',
	'arrowsSelector' : '.js-slidearrow',
	'arrowLeftClass' : 'js-slidearrow--left',
	'cantAnimClass' : 'cantanim',
	'itemNbAttr' : 'data-nb',
	'navsClassSelected' : 'isselected',
	'useTouchEvents' : true,
	'autoPlay' : false,
	'autoPlayForceRestart' : false,
	'autoPlayDelay' : 5000,
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
		if (typeof option === "string") {
			console.log(option);
			data[option]();
		}
	});
};

}(jQuery, window);

