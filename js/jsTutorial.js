/*
 * JavaScript Tutorial Class
 * Created On: 13-MAY-2014
 * Created By: Ogbuitepu O. Patrick
 *
 *pageshow
*/
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','js/analytics.js','ga');

var customUUID = getData( 'custom-uuid' );
if( ! customUUID ){
	var launch_date = new Date();
	var customUUID = launch_date.getTime();
	putData( 'custom-uuid' , customUUID );
}

ga('create', 'UA-49474437-2', {
	'storage': 'none',
	//'clientId':device.uuid
	'clientId':customUUID
});
ga('send', 'pageview', {'page': '/app-init' , 'title': 'App Initialized' });

$( document ).on( "pagecreate", "#home-page-tutorial", function() {
	
	activate_tutorial_widgets();
	
	setTimeout(function(){
		activate_tutorial_function();
		tutorial_start( '.tutorial-trigger-start' );
	}, 1000 );
});

$( document ).on( "pageshow", "#loading-page-tutorial", function() {
	
});

var debounceTimer = '';
var reStartingTutorial = '';

function activate_tutorial_function(){
	
	$( "#tutorial-popup-arrow" ).on( "popupafteropen", function( event, ui ) { 
		
		show_tutorial_overlay();
		
		var $element = $('.tutorial-trigger-current');
		$('#tutorial-msg').text( $element.attr('tutorial-msg') );
		$('#tutorial-serial').text( $element.attr('tutorial-serial') );
		
		if( $element.hasClass('tutorial-reposition') ){
			$(this).popup( "reposition" , { positionTo:$element } );
		}
		
	} );
	
	$( "#tutorial-popup-arrow" ).on( "popupafterclose", function( event, ui ) { 
		/*hide_tutorial_overlay();*/
		if( debounceTimer )
			clearTimeout( debounceTimer );
			
		debounceTimer = setTimeout( function(){
			
			var $element = $('.tutorial-trigger-current');
			
			if( $element.hasClass('tutorial-trigger-finish') ){
				setTimeout( function(){
					hide_tutorial_overlay();
					$( "#tutorial-popup-end" ).popup("open",{transition:'pop'});
				} , 1500 );
			}else{
				if( $element.hasClass('tutorial-trigger-end') ){
					$element.addClass('tutorial-trigger-finish');
				}
				
				$( "#tutorial-popup-arrow" ).popup("open",{ positionTo:$element, transition:'pop'});
			}
		}, 400 );
	});
	
	$('#custom-overlay-on-popup').bind('click', function(e){
		
		var $element = $('.tutorial-trigger-current');
		
		if( ! ( $element.attr('tutorial-trigger') ) || $element.attr('tutorial-trigger') == 'click' ){
			var xOffset = 10;
			var yOffset = 10;
			
			var failed = true;
			
			if( $element.hasClass('tutorial-check-parent-dimensions') ){
				$element = $element.parent();
			}
			//console.log('X', e.pageX +'>='+ ( $element.offset().left - xOffset ) +' && '+ e.pageX +'<'+ ( $element.offset().left + $element.width() + xOffset) );
			//console.log('Y', e.pageY +'>='+ ( $element.offset().top - yOffset ) +' && '+ e.pageY +'<'+ ( $element.offset().top + $element.height() + yOffset) );
			
			if( e.pageX >= ( $element.offset().left - xOffset ) && e.pageX < ( $element.offset().left + $element.width() + xOffset) ){
				if( e.pageY >= ( $element.offset().top - yOffset ) && e.pageY < ( $element.offset().top + $element.height() + yOffset) ){
					
					failed = false;
					
					successful_tutorial();
					
				}
			}
			
			if( failed ){
				$('#tutorial-failed-response').show();
				$('#tutorial-instruction').hide();
				hide_tutorial_overlay();
			}
		}
	});
	
	$('#custom-overlay-on-popup').bind('swipe', function(e){
		
		var $element = $('.tutorial-trigger-current');
		
		if( $element.attr('tutorial-trigger') == 'swipe' ){
			var xStart = $element.offset().left;
			var xEnd = $element.offset().left + $element.width();
			
			var yStart = $element.offset().top;
			var yEnd = $element.offset().top + $element.height();
			
			var failed = true;
			
			//console.log('X', e.swipestart.coords[0] +'>'+ xStart +'&&'+ e.swipestart.coords[0] +'<'+ xEnd +'&&'+ e.swipestop.coords[0] +'>'+ xStart +'&&'+ e.swipestop.coords[0] +'<'+ xEnd );
			
			if( e.swipestart.coords[0] > xStart && e.swipestart.coords[0] < xEnd && e.swipestop.coords[0] > xStart && e.swipestop.coords[0] < xEnd ){
				if( e.swipestart.coords[1] > yStart && e.swipestart.coords[1] < yEnd && e.swipestop.coords[1] > yStart && e.swipestop.coords[0] < yEnd ){
					
					failed = false;
					
					successful_tutorial();
				}
			}
			
			if( failed ){
				$('#tutorial-failed-response').show();
				$('#tutorial-instruction').hide();
				hide_tutorial_overlay();
			}
		}
	});
	
	$('.tutorial-try-again').on('click', function(){
		show_tutorial_overlay();
	});
	
	$('.tutorial-skip-to-next').on('click', function(){
		successful_tutorial();
	});
};

function successful_tutorial(){
	var $element = $('.tutorial-trigger-current');
		
	$element.removeClass('tutorial-trigger-current');
	$('.'+$element.attr('tutorial-next')).addClass('tutorial-trigger-current');
	
	switch( $element.attr('tutorial-trigger') ){
	case 'swipe':
		$element.trigger('swipe');
	break;
	default:
		$element.trigger('click');
	break;
	}
	
	$( "#tutorial-popup-arrow" ).popup("close");
};

function tutorial_start( element ){
	
	var $element = $(element);
	
	$('#tutorial-total').text( $('.tutorial-trigger-end').attr('tutorial-serial') );
	
	$( "#tutorial-popup-arrow" ).popup("open",{ positionTo:$element, transition:'pop'});
};

function show_tutorial_overlay(){
	$('#custom-overlay-on-popup')
	.css({
		position:'absolute',
		top:0,
		left:0,
		width:'100%',
		height:'500%',
		opacity:0.1,
		background:'transparent',
		zIndex:10000,
	});
	
	$('#tutorial-failed-response').hide();
	$('#tutorial-instruction').show();
};

function hide_tutorial_overlay(){
	$('#custom-overlay-on-popup')
	.css({
		width:'0',
		height:'0',
		zIndex:0,
	});
};
function activate_tutorial_widgets(){
	$( "#tutorial-popup-arrow" )
	.enhanceWithin()
	.popup();
	
	$( "#tutorial-popup-end" )
	.enhanceWithin()
	.popup();
};