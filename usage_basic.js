( function( $ ) {

	$( document ).ready( function() {

		$('.slideshow').lightSlider({
			'oninit' : function($container, el, options, $items, datas, showItem, decalItem){
				// touch events
				$container.swipe({
					swipeLeft:function(event, direction, distance, duration, fingerCount) {
						decalItem(1);
					},
					swipeRight:function(event, direction, distance, duration, fingerCount) {
						decalItem(-1);
					}
				});
			},
			'onshowitem' : function($container, prev_item, cur_item, $items, datas){
				$($items.get(prev_item)).animate({'margin-left':'100%'}, 700, function(){
					$(this).css('display','none');
				});
				$($items.get(cur_item)).css({'margin-left':'-100%', 'display':'block'}).animate({'margin-left':'0'}, 700, function(){
					
				});

				$container.removeClass('cantanim');
			}
		});
		
	} );

} )( jQuery );
