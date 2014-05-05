/*
 * JavaScript Dashboard Class
 * Created On: 15-JULY-2013
 * Created By: Ogbuitepu O. Patrick
 *
 *pageshow
*/
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','js/analytics.js','ga');

ga('create', 'UA-49474437-2', {
	'storage': 'none',
	//'clientId':device.uuid
	'clientId':'92bf24a5-20e5-4181-9778-2835f28c52d8'
});
ga('send', 'pageview', {'page': '/app-init' , 'title': 'App Initialized' });

$( document ).on( "pagecreate", "#loading-page", function() {
	
	$('div.loader')
	.css('marginTop', ( $(window).height() / 2 )  - ( 260 / 2 )+'px' );
	
	if( ! appLoad ){
		$( '#businesses-container' )
		.add( '#category-navigation-container' )
		.add( '#search-results-container' )
		.html( '' );
	}
	
	storeObject = {};

	appLoad = true;

	tempCategoryHTML = new Array();

	storeBusinesses = new Array();

	activeBusinessView = 'all';

	firstBusinessID = new Array();
	lastBusinessID = new Array();
	currentIterationBusinessID = new Array();

	refreshBusinessListing = new Array();
	
	get_dynamic_categories();
	
	$('div.loader')
	.bind('click', function(){
		$.mobile.navigate( "#home-page", { transition : "fade" });
	});
	
});

$( document ).on( "pagecreate", "#home-page", function() {
	
	$( "#events-notification-container" ).on( "swipe", function(){
		var $all_elements = $(this).find('.events-notification-holder');
		var $element = $(this).find('.events-notification-holder:visible');
		
		var load_more_adverts = false;
		
		if( ( $all_elements.length - 2 ) == $element.index() ){
			if( refreshBusinessListing[ 'advert' ] ){
				load_more_adverts = true;
			}
		}
		
		$element
		.addClass('hide-this-element');
		
		if( ( $all_elements.length - 1 ) == $element.index() ){
			
			if( refreshBusinessListing[ 'advert' ] ){
				load_more_adverts = true;
			}
			
			var $next_element = $all_elements.filter(':first');
			
			$next_element
			.removeClass('hide-this-element');
			
		}else{
			
			var $next_element = $element.next();
			
			$next_element
			.removeClass('hide-this-element');
		}
		
		
		if( $element.find('.events-notifications-content').hasClass('half-open-events-notifications') ){
			$next_element
			.find('.events-notifications-content')
			.addClass('half-open-events-notifications');
		}else{
			$next_element
			.find('.events-notifications-content')
			.removeClass('half-open-events-notifications');
		}
		
		if( load_more_adverts ){
			get_adverts();
		}
		/*
		if( $next_element.find('h3').hasClass('ui-collapsible-heading-collapsed') ){
			$next_element
			.find('h3')
			.click();
		}
		*/
	} );
	
	activate_iservice_search();
	
	bind_events_action_buttons();
	
	continuous_scroll_load_more();
	
	ga('send', 'pageview', {'page': '/home-page' , 'title': 'Home Screen' });
});

$( document ).on( "pageshow", "#home-page", function() {
	//recalculate_height_of_scrollable_areas( '.content-scrollable-area' );
});

$( document ).on( "pageshow", "#mallam-musa", function() {
	//$('#mallam-musa-episodes')
	//.attr('src' , pagepointer + 'files/mm1.mp4' );
	ga('send', 'pageview', {'page': '/mallam-musa' , 'title': 'Mallam Musa Video' });
});

var storeObject = {
    
}

var appLoad = true;

var appShowLoadingAnimation = false;

var activePage = true;

var tempCategoryHTML = new Array();

var storeBusinesses = new Array();

var activeBusinessView = 'all';

var firstBusinessID = new Array();
var lastBusinessID = new Array();
var currentIterationBusinessID = new Array();

var refreshBusinessListing = new Array();

var requestRetryCount = 0;

//var pagepointer = 'http://localhost/sabali/control/';
//var pagepointer = 'http://192.168.1.6/sabali/control/';

var pagepointer = 'http://app.kobokong.com/';

var form_method = 'get';
var ajax_data_type = 'json';
var ajax_data = '';
var ajax_get_url = '';
var ajax_action = '';
var ajax_container;
var ajax_notice_container;

//AJAX Request Data Before Sending
var ajax_request_data_before_sending_to_server = '';

var function_click_process = 1;

var cancel_ajax_recursive_function = false;

//BUSINESS LISTINGS QUERY LIMITS
var business_limit_start = new Array();
var business_limit_interval = 15;

//SEARCH QUERY LIMITS
var search_condition = '';
var search_limit_start = 0;
var search_limit_interval = 15;

function get_dynamic_categories(){
	ajax_data = {action:'categories', todo:'get_dynamic_categories'};
	form_method = 'get';
	ajax_data_type = 'json';
	ajax_action = 'request_function_output';
	ajax_container = $('#login-form');
	ajax_send();
	
};

function get_adverts(){
	appShowLoadingAnimation = false;
	
	ajax_data = {action:'adverts', todo:'get_adverts', limit_start:business_limit_start[ 'advert' ], limit_interval:business_limit_interval };
	form_method = 'get';
	ajax_data_type = 'json';
	ajax_action = 'request_function_output';
	ajax_container = $('#login-form');
	ajax_send();
	
};

function get_business_listings(){
	ajax_data = {action:'businesses', todo:'get_business_listings', limit_start:business_limit_start[ activeBusinessView ], limit_interval:business_limit_interval, active_category:activeBusinessView };
	form_method = 'get';
	ajax_data_type = 'json';
	ajax_action = 'request_function_output';
	ajax_container = $('#login-form');
	ajax_send();
	
};

function get_search_results(){
	ajax_data = {action:'data_search', todo:'search_business_listings', limit_start:search_limit_start, limit_interval:search_limit_interval, search_condition:search_condition };
	form_method = 'get';
	ajax_data_type = 'json';
	ajax_action = 'request_function_output';
	ajax_container = $('#login-form');
	ajax_send();
	
};

function bind_events_action_buttons(){
	$('#events-notification-container')
	.find('.open-events-details')
	.bind( 'click', function(){
		$(this)
		.parents('div.events-notifications-content')
		.removeClass('half-open-events-notifications');
	});
	
	$('#events-notification-container')
	.find('.close-events-details')
	.bind( 'click', function(){
		$(this)
		.parents('div.events-notifications-content')
		.addClass('half-open-events-notifications');
		
	});
};
	
function bind_main_menu_click_events(){
	
	$('#app-main-menu')
	.find('a.category-navigation-menu')
	.bind( 'click', function(e){
		
		e.preventDefault();
		
		//Update Default text in title bar
		$('#main-title-bar')
		.text( $(this).text() );
		
		//Open Category Container
		$( '#businesses-container' )
		.add( '#category-navigation-container' )
		.add( '#search-results-container' )
		.removeClass('in-search-mode')
		.addClass('in-category-navigation-mode');
		
		//Populate Initial Listings
		activeBusinessView = $(this).attr('id');
		
		//check if category array is empty
		//console.log( $(this).text() , tempCategoryHTML );
		
		$( '#category-navigation-container' )
		.html('');
		
		if( tempCategoryHTML[ activeBusinessView ] ){
			$( '#category-navigation-container' )
			.html( '<ul data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + tempCategoryHTML[ activeBusinessView ] + '</ul>' )
			.trigger('create');
		}
		
		//else: request category array from server
		get_business_listings();
		
	});
	
	$('#app-main-menu')
	.find('#home-page-menu-link')
	.add( '#application-title-bar-home-page' )
	.bind( 'click', function(){
		
		//var active_page = $( "body" ).pagecontainer( "getActivePage" );
		////console.log( 'act', active_page );
		
		//Update Default text in title bar
		$('#main-title-bar')
		.text( 'Trending' );
		
		//Open Category Container
		$( '#businesses-container' )
		.add( '#events-notification-container' )
		.add( '#category-navigation-container' )
		.add( '#search-results-container' )
		.removeClass('in-search-mode')
		.removeClass('in-category-navigation-mode');
		
		//Populate Initial Listings
		activeBusinessView = 'all';
		
		//close panel
		$('#navigation-menu')
		.panel( 'close' );
		
	});
};

function prepare_business_listing_html( key , value , mode ){
	var html = '<li data-role="list-divider">'+value.name+'</li>';
		html += '<li><a href="#" data-transition="slide" class="navigate" id="'+key+'">';
		html += '<div class="image-container">';
			html += '<img height="100%" src="'+value.primary_display_image+'" >';
		html += '</div>';
		html += '<p><strong>'+value.primary_activity+'</strong></p>';
		html += '<div class="rateit" data-rateit-value="'+value.rating_converted+'" data-rateit-ispreset="true" data-rateit-readonly="true"></div>';
		html += '<p>'+value.short_address+'</p>';
		html += '</a>';
		
		if( mode != 'search-mode' ){
			html += '<a href="#rate-business-popup" class="rate-business-popup" j_id="'+key+'" data-rel="popup" data-position-to="window" data-transition="slideup">Rate Business</a>';
		}
		
	html += '</li>';
	
	return html;
};

function prepare_business_listing_htmlOLD( key , value , mode ){
	var html = '<li style="background-image: url('+value.primary_display_image+'); background-position: center;"><a href="#" data-transition="slide" class="navigate" id="'+key+'">';
		html += '<h2>'+value.name+'</h2>';
		html += '<p><strong>'+value.primary_activity+'</strong></p>';
		html += '<div class="rateit" data-rateit-value="'+value.rating_converted+'" data-rateit-ispreset="true" data-rateit-readonly="true"></div>';
		html += '<p>'+value.short_address+'</p>';
		html += '</a>';
		
		if( mode != 'search-mode' ){
			//html += '<a href="#rate-business-popup" class="rate-business-popup" j_id="'+key+'" data-rel="popup" data-position-to="window" data-transition="slideup">Rate Business</a>';
		}
		
	html += '</li>';
	
	return html;
};

function prepare_advert_html( key , value , mode ){
	
	var html = '<div class="ui-block-a events-notification-holder hide-this-element">';
		html += '<div class="jqm-block-content">';
			html += '<ul data-role="listview" data-inset="false" data-divider-theme="a" class="events-notification-container">';
			html += '<li data-role="list-divider">'+value.title+'</li>';
			html += '<li class="advert-content">';
				html += '<div class="events-notifications-content half-open-events-notifications">';
					
					html += '<div data-role="controlgroup" data-type="horizontal" class="events-details-control-buttons">';
						html += '<a href="#" class="open-events-details border-round ui-btn ui-btn-inline ui-icon-plus ui-alt-icon ui-btn-icon-notext ui-nodisc-icon" title="Tap to view more details">Details</a>';
					
						html += '<a href="#" class="close-events-details border-round ui-btn ui-btn-inline ui-icon-minus ui-alt-icon ui-btn-icon-notext ui-nodisc-icon" title="Tap to view summary">Summary</a>';
					
						html += '<a href="'+value.link_website+'" class="open-events-view border-round ui-btn ui-btn-inline ui-icon-action ui-alt-icon ui-btn-icon-notext ui-nodisc-icon" title="Tap to open events view">Open Events</a>';
					html += '</div>';
					
					html += '<img src="'+value.display_image+'" width="100%" />';
					
					html += '<div class="events-details-additional-info">';
						html += value.additional_info;
					html += '</div>';
				html += '</div>';
			html += '</li>';
			html += '</ul>';
		html += '</div>';
	html += '</div>';
    
	return html;
};

function continuous_scroll_load_more(){
	$( document )
	.bind( 'scroll' , function(){
		//console.log('scroll',( $(this).scrollTop()+$(window).height() ) +'--'+ $(document).height() );
		
		var position = $(this).scrollTop() + $(window).height();
		var comparePosition = $(document).height() - 50;
		
		if( position > comparePosition && refreshBusinessListing[ activeBusinessView ] ){
			
			appShowLoadingAnimation = true;
			
			switch( activeBusinessView ){
			case "search_results":
				//load more content
				get_search_results();
			break;
			default:
				//load more content
				get_business_listings();
			break;
			}
		}
		
	});
	
};

function activate_iservice_search(){
	
	$('#iservice-search-button-home-page')
	.add('#iservice-search-button-business-details')
	.add('#iservice-search-button-mallam-musa')
	.bind('click', function (){
		
		var active_page = $( "body" ).pagecontainer( "getActivePage" );
		var active_page_id = active_page.context.location.hash;
		
		if( active_page_id ){
			active_page_id = active_page_id.replace('#', '');
			
			switch( active_page_id ){
			case "home-page":
			case "business-details":
			case "mallam-musa":
				$('#iservice-search-button-'+active_page_id)
				.addClass('in-search-mode');
				
				$('#application-title-bar-'+active_page_id)
				.addClass('in-search-mode');
				
				$('#iservice-search-field-'+active_page_id)
				.addClass('in-search-mode');
			break;
			}
		}
		
	});
	
	$('a#hide-search-bar-home-page')
	.add('a#hide-search-bar-business-details')
	.add('a#hide-search-bar-mallam-musa')
	.bind('click', function (){
		var active_page = $( "body" ).pagecontainer( "getActivePage" );
		var active_page_id = active_page.context.location.hash;
		
		if( active_page_id ){
			active_page_id = active_page_id.replace('#', '');
			
			switch( active_page_id ){
			case "home-page":
			case "business-details":
			case "mallam-musa":
				$('#iservice-search-button-'+active_page_id)
				.removeClass('in-search-mode');
				
				$('#application-title-bar-'+active_page_id)
				.removeClass('in-search-mode');
				
				$('#iservice-search-field-'+active_page_id)
				.removeClass('in-search-mode');
				
				$('#businesses-container')
				.removeClass('in-search-mode');
				
				$('#events-notification-container')
				.removeClass('in-search-mode');
				
				$('#search-results-container')
				.removeClass('in-search-mode');
				
				$('#main-title-bar')
				.text( 'Trending' );
				
			}
		}
	});
	
	$('form#search-form-home-page')
	.add('form#search-form-mallam-musa')
	.add('form#search-form-business-details')
	.bind('submit', function (e){
		e.preventDefault();
		
		var active_page = $( "body" ).pagecontainer( "getActivePage" );
		var active_page_id = active_page.context.location.hash;
		
		if( active_page_id ){
			active_page_id = active_page_id.replace('#', '');
			
			switch( active_page_id ){
			case "home-page":
			case "business-details":
			case "mallam-musa":
				$( '#businesses-container' )
				.add( '#category-navigation-container' )
				.add( '#search-results-container' )
				.add( '#events-notification-container' )
				.removeClass('in-category-navigation-mode')
				.addClass('in-search-mode');
				
				//Submit Search Request
				search_limit_start = 0;
				search_condition = $(this).find('#search-text-field-'+active_page_id).val();
				
				if( active_page_id != 'home-page' ){
					$('#search-text-field-home-page').val( search_condition );
					
					$.mobile.navigate( "#home-page", { transition : "fade" });
				}
				
				$('#search-results-container')
				.empty();
				
				get_search_results();
				
				$('#main-title-bar')
				.text( 'Search Results: ' + $('#search-text-field-home-page').val() );
		
			break;
			}
		}
	});
};

function recalculate_height_of_scrollable_areas( id ){
	//CHECK IF EVENTS CONTAINER IS VISIBLE
	
	var subtract = 0;
	var doc_height = $(window).height();
	
	var spacing = 3;
	
	subtract = $('#sub-title-heading-bar').offset().top + $('#sub-title-heading-bar').height() + spacing;
	
	if( doc_height && subtract && doc_height > subtract){
		
		$(id)
		.css({ 
			'height': (doc_height - subtract) + 'px',
			'maxHeight': (doc_height - subtract) + 'px',
		});
		
	}
	
	
};
/*
activate_multi_page_widgets();
function activate_multi_page_widgets(){
	$( "#rate-business-popup" )
	.enhanceWithin()
	.popup();
};
*/

function ajax_send(){
	
	if(function_click_process){
	//Send Data to Server
	$.ajax({
		dataType:ajax_data_type,
		type:form_method,
		data:ajax_data,
		url: pagepointer+'php/app_request_processor.php'+ajax_get_url,
		timeout:30000,
		beforeSend:function(){
			//Display Loading Gif
			function_click_process = 0;
			
			cancel_ajax_recursive_function = false;
			
			confirm_action_prompt = 0;
			
			/*ajax_container.html('<div id="loading-gif" class="no-print">Please Wait</div>');*/
			
			$('div.progress-bar-container:visible')
			.html('<div id="virtual-progress-bar"><div class="progress-bar"></div></div>');
			
			progress_bar_change();
			
			ajax_request_data_before_sending_to_server = '';
			ajax_request_data_before_sending_to_server += '<p><b>dataType:</b> '+ajax_data_type+'</p>';
			ajax_request_data_before_sending_to_server += '<p><b>type:</b> '+form_method+'</p>';
			if( typeof(ajax_data) == "object" )
				ajax_request_data_before_sending_to_server += '<p><b>data:</b> '+ $.param( ajax_data ) +'</p>';
			else
				ajax_request_data_before_sending_to_server += '<p><b>data:</b> '+ ajax_data +'</p>';
			
			ajax_request_data_before_sending_to_server += '<p><b>url:</b> '+pagepointer+'php/backend.php'+ajax_get_url+'</p>';
			
			var html = '<li><div class="loader-animation"><img src="img/i-service-loading.png" height="120" /></div></li>';
			
			//Display loading animation
			if( appShowLoadingAnimation ){
				$('#businesses-container')
				.append( '<ul class="app-loading-animation" data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + html + '</ul>' )
				.trigger('create');
			
				$(document)
				.delay(500)
				.css( 'height', $(document).height() + 150 )
				.scrollTop( $(document).scrollTop() + 120 );
				
				appShowLoadingAnimation = false;
			}
		},
		error: function(event, request, settings, ex) {
			
			if( $('ul.app-loading-animation') ){
				$('ul.app-loading-animation')
				.remove();
			}
		},
		success: function(data){
			
			requestRetryCount = 0;
			
			function_click_process = 1;

			switch(ajax_action){
			case "generate_modules":
				ajax_generate_modules(data);
			break;
			case "request_function_output":
				ajax_request_function_output(data);
			break;
			}
			
			//CHECK FOR NOTIFICATION
			if(data.notification){
				check_for_and_display_notifications(data.notification);
			}
		
			if( $('ul.app-loading-animation') ){
				$('ul.app-loading-animation')
				.remove();
			}
		}
	});
	}
};

function ajax_request_function_output(data){
	//alert(data);
	//Close Pop-up Menu
	if( data.status ){
		switch(data.status){
		case "get-dynamic-categories":
			//Transform Data to HTML Markup
			if( data.html ){
				var html = '<ul id="app-main-menu" data-role="listview">';
				html += ' <li data-icon="home" class="ui-alt-icon"><a href="#home-page" id="home-page-menu-link" data-rel="close">Trending</a></li>';
				$.each(data.html, function(key, value){
					
					html += '<li data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false" class="ui-alt-icon">';
						html += '<h3>'+value.title+'</h3>';
						html += '<ul data-role="listview">';
					
					$.each(value.sublevels, function(ki, vi){
						html = html + '<li><a href="#" data-ajax="false" id="'+ki+'" class="category-navigation-menu">'+vi.title+'</a></li>';
						
						refreshBusinessListing[ ki ] = true;
						storeBusinesses[ ki ] = new Array();
						
						business_limit_start[ ki ] = 0;
					});
					
						html += '</ul>';
					html += '</li>';
					
				});
				
				html += '<li data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false" class="ui-alt-icon">';
					html += '<h3>Chronicles of Mallam Musa</h3>';
					html += '<ul data-role="listview" data-count-theme="g">';
						html = html + '<li><a href="#mallam-musa" data-transition="fade" data-icon="arrow-r">S01E01: Aliens Invade Africa<span class="ui-li-count">new</span></a></li>';
					html += '</ul>';
				html += '</li>';
				
				html += '<li data-icon="gear" class="ui-alt-icon"><a href="#about">About</a></li>';
				
				//html += '<li data-icon="gear" class="ui-alt-icon"><a href="#">Settings | Updates</a></li>';
				html += '</ul>';
				//html += '</div>';
			}
			
			//Store HTML in Client Storage
			
			//Insert HTMl into respective position
			
			//$('#navigation-menu')
			$('.jqm-navmenu-panel')
			.html( html )
			.trigger('create');
			
			//Initialize to jQuery Mobile Controls
			
			//Bind Actions if Any
			
			//Initialize Refresh Commands
			refreshBusinessListing[ 'all' ] = true;
			refreshBusinessListing[ 'search_results' ] = true;
			refreshBusinessListing[ 'advert' ] = true;
			
			business_limit_start[ 'all' ] = 0;
			business_limit_start[ 'advert' ] = 0;
			
			storeBusinesses[ 'advert' ] = new Array();
			storeBusinesses[ 'all' ] = new Array();
			storeBusinesses[ 'search_results' ] = new Array();
			
			//console.log('cat-biz',storeBusinesses);
			
			bind_main_menu_click_events();
			
			//Load Initial Adverts
			get_adverts();
			
		break;
		case "get-adverts":
			if( data.html.advert ){
				
				var html = '';
				
				var idOfLastBusiness = '';
				var idOfFirstBusiness = '';
				
				currentIterationBusinessID[ 'advert' ] = '';
				
				//console.log('look', data.html.business);
				
				$.each(data.html.advert, function(key, value){
					
					html += prepare_advert_html( key , value , 'business-listing' );
					
					//First Dataset
					if(  ! value.prev_business_id ){
						idOfFirstBusiness = key;
					}
					
					//Last Dataset
					if(  ! value.next_business_id ){
						idOfLastBusiness = key;
					}
					
					storeBusinesses[ 'advert' ][key] = value;
					
				});
				
				//UPDATE THIS ITERATION FIRST BUSINESS ID
				currentIterationBusinessID[ 'advert' ] = idOfFirstBusiness;
				
				//SET FIRST BUSINESS ID
				if( ! ( firstBusinessID[ 'advert' ] ) ){
					firstBusinessID[ 'advert' ] = idOfFirstBusiness;
				}
				
				//UPDATE PREV BUSINESS ID OF FIRST BUSINESS
				storeBusinesses[ 'advert' ][ idOfFirstBusiness ].prev_business_id = idOfLastBusiness;
				
				//UPDATE NEXT BUSINESS ID OF LAST BUSINESS
				storeBusinesses[ 'advert' ][ idOfLastBusiness ].next_business_id = idOfFirstBusiness;
				
				//UPDATE NEXT ID OF LAST BUSINESS FOR PREVIOUS ITERATION
				if( currentIterationBusinessID[ 'advert' ] && lastBusinessID[ 'advert' ] ){
					
					storeBusinesses[ 'advert' ][ lastBusinessID[ 'advert' ] ].next_business_id = currentIterationBusinessID[ 'advert' ];
				}
				
				//UPDATE PREV ID OF FIRST BUSINESS FOR FIRST ITERATION
				if( firstBusinessID[ 'advert' ] && idOfLastBusiness ){
					storeBusinesses[ 'advert' ][ firstBusinessID[ 'advert' ] ].prev_business_id = idOfLastBusiness;
				}
				
				lastBusinessID[ 'advert' ] = idOfLastBusiness;
				
				if( data.html.limit_start ){
					business_limit_start[ 'advert' ] = data.html.limit_start;
				}
				
				if( html ){
					$( '#events-notification-container' )
					.find('.events-notification-holder')
					.addClass('hide-this-element');
					
					$( '#events-notification-container' )
					.prepend( html )
					.trigger('create');
					
					$( '#events-notification-container' )
					.find('.events-notification-holder:first')
					.removeClass('hide-this-element');
					
					bind_events_action_buttons();
				}
				
				//alert('done');
			}else{
				refreshBusinessListing[ 'advert' ] = false;
			}
			
			if( appLoad ){
				//Load Initial Business Listings
				get_business_listings();
			}
		break;
		case "search-business-listings":
			activeBusinessView = 'search_results';
		case "get-business-listings":
			
			if( ! activeBusinessView )
				activeBusinessView = 'all';
			
			if( data.html.business ){
				
				var html = '';
				
				currentIterationBusinessID[ activeBusinessView ] = '';
				
				var idOfLastBusiness = '';
				var idOfFirstBusiness = '';
				
				//console.log('look', data.html.business);
				
				$.each(data.html.business, function(key, value){
					
					html += prepare_business_listing_html( key , value , 'business-listing' );
					
					//First Dataset
					if(  ! value.prev_business_id ){
						idOfFirstBusiness = key;
					}
					
					//Last Dataset
					if(  ! value.next_business_id ){
						idOfLastBusiness = key;
					}
					
					storeBusinesses[ activeBusinessView ][key] = value;
					
				});
				
				//UPDATE THIS ITERATION FIRST BUSINESS ID
				currentIterationBusinessID[ activeBusinessView ] = idOfFirstBusiness;
				
				//SET FIRST BUSINESS ID
				if( ! ( firstBusinessID[ activeBusinessView ] ) ){
					firstBusinessID[ activeBusinessView ] = idOfFirstBusiness;
				}
				
				//UPDATE PREV BUSINESS ID OF FIRST BUSINESS
				storeBusinesses[ activeBusinessView ][ idOfFirstBusiness ].prev_business_id = idOfLastBusiness;
				
				//UPDATE NEXT BUSINESS ID OF LAST BUSINESS
				storeBusinesses[ activeBusinessView ][ idOfLastBusiness ].next_business_id = idOfFirstBusiness;
				
				//UPDATE NEXT ID OF LAST BUSINESS FOR PREVIOUS ITERATION
				if( currentIterationBusinessID[ activeBusinessView ] && lastBusinessID[ activeBusinessView ] ){
					
					storeBusinesses[ activeBusinessView ][ lastBusinessID[ activeBusinessView ] ].next_business_id = currentIterationBusinessID[ activeBusinessView ];
				}else{
					//storeBusinesses[ activeBusinessView ][ idOfLastBusiness ].next_business_id = currentIterationBusinessID[ activeBusinessView ];
				}
				
				//UPDATE PREV ID OF FIRST BUSINESS FOR FIRST ITERATION
				if( firstBusinessID[ activeBusinessView ] && idOfLastBusiness ){
					storeBusinesses[ activeBusinessView ][ firstBusinessID[ activeBusinessView ] ].prev_business_id = idOfLastBusiness;
				}
				
				lastBusinessID[ activeBusinessView ] = idOfLastBusiness;
				
				////console.log('last_id', lastBusinessID[ activeBusinessView ]);
				console.log( 'businesses' , storeBusinesses );
				
				if( data.html.limit_start ){
					business_limit_start[ activeBusinessView ] = data.html.limit_start;
				}
				
				if( html ){
					switch( activeBusinessView ){
					case "all":
						$( '#businesses-container' )
						.append( '<ul data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + html + '</ul>' )
						.trigger('create');
					break;
					case "search_results":
						$( '#search-results-container' )
						.append( '<ul data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + html + '</ul>' )
						.trigger('create');
					break;
					default:
						if( tempCategoryHTML[ activeBusinessView ] )
							tempCategoryHTML[ activeBusinessView ] += html;
						else
							tempCategoryHTML[ activeBusinessView ] = html;
							
						$( '#category-navigation-container' )
						.append( '<ul data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + html + '</ul>' )
						.trigger('create');
					break;
					}
				}
				
				//alert('done');
			}else{
				refreshBusinessListing[ activeBusinessView ] = false;
			}
			
			$('a.navigate')
			.bind('click', function(){
				
				storeObject.active_business = $(this).attr('id');
				
				$.mobile.navigate( "#business-details", { transition : "fade" });
			});
			
			activate_rate_it();
			handle_rating_popup_open();
			
			if( appLoad ){
				appLoad = false;
				$.mobile.navigate( "#home-page", { transition : "fade" } );
			}
		break;
		case "rate-business-listings":
			
			//temp might be optimized later to effect rating in all sections
			activeBusinessView = 'all';
			
			if( data.html.business_id ){
				
				var key = data.html.business_id;
				
				var value = storeBusinesses[ activeBusinessView ][key];
				
				value.rating = data.html.rating;
				value.rating_converted = data.html.rating_converted;
				
				storeBusinesses[ activeBusinessView ][key] = value;
				
				//UPDATE RATING
				$('#business-details-rating-popup')
				.rateit( 'value', data.html.rating_converted );
				
				$('#business-details-rating-percent-popup')
				.text( data.html.rating + '%' );
				
				$( '#'+key )
				.find('.rateit')
				.rateit( 'value', data.html.rating_converted );
				
				//DISPLAY FINISH BUTTON
				$('#rate-business-form')
				.find('.rate-form-finish')
				.text('Finish')
				.show();
				
				$('#rate-business-form')
				.find('.rate-form-submit')
				.hide();
				
				//alert('done');
			}else{
				refreshBusinessListing[ activeBusinessView ] = false;
			}
			
			activate_rate_it();
			handle_rating_popup_open();
		break;
		case "search-business-listings":
			
			activeBusinessView = 'search_results';
			
			if( data.html.business ){
				var html = '';
				
				var last_id = '';
				
				currentIterationBusinessID[ activeBusinessView ] = '';
				
				$.each(data.html.business, function(key, value){
					
					if( ! firstBusinessID[ activeBusinessView ] ){
						firstBusinessID[ activeBusinessView ] = key;
					}
					
					if( ! currentIterationBusinessID[ activeBusinessView ] ){
						currentIterationBusinessID[ activeBusinessView ] = key;
					}
					
					html += prepare_business_listing_html( key , value , 'search-mode' );
					
					if( ( ! value.next_business_id ) && firstBusinessID[ activeBusinessView ] ){
						value.next_business_id = firstBusinessID[ activeBusinessView ];
					}
					
					if( ( ! value.prev_business_id ) && lastBusinessID[ activeBusinessView ] ){
						value.prev_business_id = lastBusinessID[ activeBusinessView ];
					}
					
					storeBusinesses[ activeBusinessView ][ key ] = value;
					
					last_id = key;
					
				});
				
				//UPDATE NEXT ID OF LAST BUSINESS FOR PREVIOUS ITERATION
				if( currentIterationBusinessID[ activeBusinessView ] && lastBusinessID[ activeBusinessView ] ){
					storeBusinesses[ activeBusinessView ][ lastBusinessID[ activeBusinessView ] ].next_business_id = currentIterationBusinessID[ activeBusinessView ];
				}else{
					storeBusinesses[ activeBusinessView ][ last_id ].next_business_id = currentIterationBusinessID[ activeBusinessView ];
				}
				
				//UPDATE PREV ID OF FIRST BUSINESS FOR FIRST ITERATION
				if( firstBusinessID[ activeBusinessView ] && last_id ){
					storeBusinesses[ activeBusinessView ][ firstBusinessID[ activeBusinessView ] ].prev_business_id = last_id;
				}
				
				lastBusinessID[ activeBusinessView ] = last_id;
				
				//console.log( 'search-businesses' , storeBusinesses );
				
				if( data.html.limit_start ){
					search_limit_start = data.html.limit_start;
				}
				
				if( html ){
					$( '#search-results-container' )
					.append( '<ul data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + html + '</ul>' )
					.trigger('create');
				}
				
				//alert('done');
			}else{
				refreshBusinessListing[ activeBusinessView ] = false;
			}
			
			$('a.navigate')
			.bind('click', function(){
				
				storeObject.active_business = $(this).attr('id');
				
				$.mobile.navigate( "#business-details", { transition : "fade" });
			});
			
			activate_rate_it();
		break;
		}
	}
	
	//Handle / Display Error Messages / Notifications
	display_notification( data );
	
	//Check for re-process command
	re_process_previous_request( data );
};

function re_process_previous_request( data ){

};

function activate_rate_it(){
	$('.rateit')
	.rateit({ max: 5, step: 0.5 });
};

//Function to Refresh Form Token After Processing
function refresh_form_token( data ){
	//Update school properties if set
	if( data.tok && $('form') ){
		$('form')
		.find('#processing')
		.val( data.tok );
	}
};

//Display Notification Message
function display_notification( data ){
	if( data.typ ){
		var theme = 'alert-error';
		
		if( data.theme ){
			theme = data.theme;
		}
		
		switch(data.typ){
		case "search_cleared":
		case "searched":
		case "saved":
		case "jsuerror":
		case "uerror":
		case "serror":
			//Refresh Token
			refresh_form_token( data );
			
			var html = '<div class="alert ' + theme + ' alert-block">';
			  html += '<button type="button" class="close" id="alert-close-button" data-dismiss="alert">&times;</button>';
			  html += '<h4>' + data.err + '</h4>';
			  html += data.msg;
			html += '</div>';
			
			var $notification_container = $('#notification-container');
			
			$notification_container
			.html( html );
			
			$('#alert-close-button')
			.bind('click', function(){
				$('#notification-container')
				.empty();
			});
			
			/*
			$('#form-gen-submit').popover({
				"html": true,
				"content": data.msg,
				"title": data.err,
			})
			.popover('show');
			*/
		break;
		}
	}
};
	
function prepare_new_record_form(data){
	//Prepare and Display New Record Form
	//.html('<div id="form-panel-wrapper1">'+data.html+'</div>')
	$('#form-content-area')
	.html(data.html);
	
	if( data.status ){
		switch(data.status){
		case "display-data-capture-form":
			//Bind Html text-editor
			bind_html_text_editor_control();
			
			//Activate Client Side Validation / Tooltips
			activate_tooltip_for_form_element( $('#form-content-area').find('form') );
			activate_validation_for_required_form_element( $('#form-content-area').find('form') );
			
		break;
		}
	}
	
	//Bind Form Submit Event
	$('#form-content-area')
	.find('form')
	.bind('submit', function(){
		
		if( $(this).data('do-not-submit') ){
			return false;
		}
		
		ajax_data = $(this).serialize();
	
		form_method = 'post';
		ajax_data_type = 'json';	//SAVE CHANGES, SEARCH
		ajax_action = 'request_function_output';
		//ajax_action = 'submit_form_data';
		
		ajax_container = $('#login-form');
		ajax_get_url = $(this).attr('action');
		
		ajax_notice_container = 'window';
		
		ajax_send();
		return false;
	});
	
	//Bind form submission event
	action_button_submit_form();
	select_record_click_function();
	
	//Activate Ajax file upload
	createUploader();
};

//File Uploader
function createUploader(){
	if($('.upload-box').hasClass('cell-element')){
		
		$('.upload-box').each(function(){
			var id = $(this).attr('id');
			var name = $(this).find('input').attr('name');
			var acceptable_files_format = $(this).find('input').attr('acceptable-files-format');
			
			var uploader = new qq.FileUploader({
				element: document.getElementById(id),
				listElement: document.getElementById('separate-list'),
				action: pagepointer+'php/upload.php',
				params: {
					tableID: $('form').find('input[name="table"]').val(),
					name:name,
					acceptable_files_format:acceptable_files_format,
				},
				onComplete: function(id, fileName, responseJSON){
					if(responseJSON.success=='true'){
						$('.qq-upload-success')
						.find('.qq-upload-failed-text')
						.text('Success')
						.css('color','#ff6600');
					}else{
						//alert('failed');
					}
				}
			});
		});
		
	}
};

//Bind Multi-select option tooltip
var timer_interval;
var mouse_vertical_position;

var progress_bar_timer_id;
function progress_bar_change(){
	var total = 20;
	var step = 1;
	
	if(function_click_process==0){
		var $progress = $('#virtual-progress-bar').find('.progress-bar');
		
		if($progress.data('step') && $progress.data('step')!='undefined'){
			step = $progress.data('step');
		}
		
		var percentage_step = (step/total)*100;
		++step;
		
		if( percentage_step > 100 ){
			$progress
			.css('width', '100%');
			
			$('#virtual-progress-bar')
			.remove();
			
			$('.progress-bar-container')
			.html('');
			
			//Refresh Page
			function_click_process = 1;
			
			++requestRetryCount;
			
			//Stop All Processing
			window.stop();
			
			//check retry count
			if( requestRetryCount > 1 ){
				//display no network access msg
				//requestRetryCount = 0;
				
				var settings = {
					message_title:'No Network Access',
					message_message: 'The request was taking too long!',
					auto_close: 'no'
				};
				
			}else{
				//display retrying msg
				
				var settings = {
					message_title:'Refreshing...',
					message_message: 'Please Wait.',
					auto_close: 'yes'
				};
				
				//request resources again
				ajax_send();
				
			}
			
			display_popup_notice( settings );
			
		}else{
			$progress
			.data('step',step)
			.css('width', percentage_step+'%');
			
			progress_bar_timer_id = setTimeout(function(){
				progress_bar_change();
			},1000);
		}
	}else{
		$('#virtual-progress-bar')
		.find('.progress-bar')
		.css('width', '100%');
		
		setTimeout(function(){
			$('#virtual-progress-bar')
			.remove();
			
			$('.progress-bar-container')
			.html('');
		},800);
	}
};

//Display Notification Pop-up
function display_popup_notice( settings ){
	
	var theme = 'a';
	
	var html = '<div data-role="popup" id="errorNotice" data-position-to="#" class="ui-content" data-theme="'+theme+'">';
		html = html + '<h3>'+settings.message_title+'</h3>';
		html = html + '<p>'+settings.message_message+'</p>';
	html = html + '</div>';
	
	$('#notification-popup')
	.html(html)
	.trigger("create");
		
	//Close All Pop-ups
	if( $('.ui-popup') ){
		$('.ui-popup')
		.popup("close");
	}
	
	$('#errorNotice')
	.popup("open");
	
	if( settings.auto_close ){
		switch( settings.auto_close ){
		case "yes":
			setTimeout(function(){
				$("#errorNotice")
				.popup("close");
			}, 2000 );
		break;
		}
	}
	
	$( "#errorNotice" ).on( "popupafterclose", function( event, ui ) {
		$('#errorNotice').remove();
	});
};
	
function display_tooltip(me, name, removetip){
	
	if( removetip ){
		$('#ogbuitepu-tip-con').fadeOut(800);
		return;
	}
	
	//Check if tooltip is set
	if(me.attr('tip') && me.attr('tip').length > 1){
		$('#ogbuitepu-tip-con')
		.find('> div')
		.html(me.attr('tip'));
		
		//Display tooltip
		var offsetY = 8;
		var offsetX = 12;
		
		//var left = me.offset().left - (offsetX + $('#ogbuitepu-tip-con').width() );
		//var top = (me.offset().top + ((me.height() + offsetY)/2)) - ($('#ogbuitepu-tip-con').height()/2);
		
		var left = me.offset().left;
		var top = (me.offset().top + ((me.height() + offsetY)));
		
		if( parseFloat( name ) ){
			top = (name) - ($('#ogbuitepu-tip-con').height()/2);
		}
		
		$('#ogbuitepu-tip-con')
		.find('> div')
		.css({
			padding:me.css('padding'),
		});
		
		$('#ogbuitepu-tip-con')
		.css({
			width:me.width()+'px',
			top:top,
			left:left,
		})
		.fadeIn(800);
	}else{
		//Hide tooltip container
		$('#ogbuitepu-tip-con').fadeOut(800);
	}
	
};

$('<style>.invalid-data{ background:#faa !important; }</style><div id="ogbuitepu-tip-con"><div></div></div>').prependTo('body');
$('#ogbuitepu-tip-con')
.css({
	position:'absolute',
	display:'none',
	top:0,
	left:0,
	backgroundColor:'transparent',
	backgroundImage:'url('+pagepointer+'images/tip-arrow-r.png)',
	backgroundPosition:'top center',
	backgroundRepeat:'no-repeat',
	opacity:0.95,
	paddingTop:'11px',
	/*width:'220px',*/
	height:'auto',
	color:'#fff',
	zIndex:90000,
});
$('#ogbuitepu-tip-con')
.find('> div')
.css({
	position:'relative',
	background:'#ee1f19',
	opacity:0.95,
	/*padding:'5%',*/
	width:'100%',
	height:'95%',
	color:'#fff',
	textShadow:'none',
	borderRadius:'8px',
	boxShadow:'1px 1px 3px #222',
	fontSize:'0.85em',
	fontFamily:'arial',
});

function activate_tooltip_for_form_element( $form ){
	$form
	.find('.form-gen-element')
	.bind('focus',function(){
		display_tooltip($(this) , $(this).attr('name'), false);
	});
	
	$form
	.find('.form-gen-element')
	.bind('blur',function(){
		display_tooltip( $(this) , '', true );
	});
};

function activate_validation_for_required_form_element( $form ){
	$form
	.find('.form-element-required-field')
	.bind('blur',function(){
		validate( $(this) );
	});
	
	$form
	.not('.skip-validation')
	.bind('submit', function(){
		
		$(this)
		.find('.form-element-required-field')
		.blur();
		
		if( $(this).find('.form-element-required-field').hasClass('invalid-data') ){
			$(this)
			.find('.invalid-element:first')
			.focus();
			
			$(this).data('do-not-submit', true);
			
			//display notification to fill all required fields
			var data = {
				typ:'jsuerror',
				err:'Invalid Form Field',
				msg:'Please do ensure to correctly fill all required fields with appropriate values',
			};
			display_notification( data );
			
			return false;
		}
		
		$(this).data('do-not-submit', false);
		
	});
	
};

function validate( me ){
	//var e = $('#required'+name);
	//alert(e.attr('alt'));
	
	if( testdata( me.val() , me.attr('alt') ) ){
		if(me.hasClass('invalid-data')){
			me.removeClass('invalid-data').addClass('valid-data');
		}else{
			me.addClass('valid-data');
		}
	}else{
		if(me.hasClass('valid-data')){
			me.addClass('invalid-data').removeClass('valid-data');
		}else{
			me.addClass('invalid-data');
		}
	}
};

function testdata(data,id){
	switch (id){
	case 'text':
	case 'textarea':
	case 'upload':
		if(data.length>1)return 1;
		else return 0;
	break;
	case 'category':
		if(data.length>11)return 1;
		else return 0;
	break;
	case 'number':
	case 'currency':
		data = data.replace(',','');
		return (data - 0) == data && data.length > 0;
	break;
	case 'email':
		return vemail(data);
	break;
	case 'password':
		return vpassword(data);
	break;
		if(data.length>6)return 1;
		else return 0;
	break;
	case 'phone':
	case 'tel':
		return vphone(data);
		break;
	case 'select':
	case 'multi-select':
		return data;
		break;
	default:
		return 0;
	}
};

function vphone(phone) {
	var phoneReg = /[a-zA-Z]/;
	if( phone.length<5 || phoneReg.test( phone ) ) {
		return 0;
	} else {
		return 1;
	}
};

function vemail(email) {
	
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if( email.length<1 || !emailReg.test( email ) ) {
		return 0;
	} else {
		return 1;
	}
};

var pass = 0;
function vpassword(data){
	if($('input[type="password"]:first').val()!=pass){
		pass = 0;
	}
	
	if(!pass){
		//VERIFY PASSWORD
		if( data.length > 6 ){
			/*
			//TEST FOR AT LEAST ONE NUMBER
			var passReg = /[0-9]/;
			if( passReg.test( data ) ) {
				//TEST FOR AT LEAST ONE UPPERCASE ALPHABET
				passReg = /[A-Z]/;
				if( passReg.test( data ) ){
					//TEST FOR AT LEAST ONE LOWERCASE ALPHABET
					passReg = /[a-z]/;
					if( passReg.test( data ) ){
						//STORE FIRST PASSWORD
						pass = data;
						return 1;
					}else{
						//NO LOWERCASE ALPHABET IN PASSWORD
						pass = 0;
						return 0;
					}
				}else{
					//NO UPPERCASE ALPHABET IN PASSWORD
					pass = 0;
					return 0;
				}
			}else{
				//NO NUMBER IN PASSWORD
				pass = 0;
				return 0;
			}
			*/
			pass = data;
			return 1;
		}else{ 
			pass = 0;
			return 0;
		}
		/*
		a.	User ID and password cannot match
		b.	Minimum of 1 upper case alphabetic character required
		c.	Minimum of 1 lower case alphabetic character required
		d.	Minimum of 1 numeric character required
		e.	Minimum of 8 characters will constitute the password
		*/
	}else{
		//CONFIRM SECOND PASSWORD
		if(data==pass)return 1;
		else return 0;
	}
};
/******************************************************/


function handle_rating_popup_open(){
	$( ".rate-business-popup" )
	.on( "click", function(){
		storeObject.active_business = $(this).attr('j_id');
	});
	
	$( "#rate-business-popup" )
	.on( "popupafteropen", function( event, ui ) {
		
		if( storeObject.active_business && storeBusinesses[ activeBusinessView ][ storeObject.active_business ] ){
			var business = storeBusinesses[ activeBusinessView ][ storeObject.active_business ];
			
			$('#rate-business-title')
			.html( business.name );
			
			$('#business-details-rating-popup')
			.rateit( 'value', business.rating_converted );
			
			$('#business-details-rating-percent-popup')
			.text( business.rating + '%' );
			
			$('#rate-business-id')
			.val( storeObject.active_business );
			
			$('#rate-business-form')
			.find('.rate-form-finish')
			.hide();
			
			$('#rate-business-form')
			.find('.rate-form-submit')
			.show();
		}
	} );
	
	$('form#rate-business-form')
	.on( 'submit', function(e){
		e.preventDefault();
		
		$('#rate-business-form')
		.find('.rate-form-finish')
		.text('Processing...')
		.show();
		
		$('#rate-business-form')
		.find('.rate-form-submit')
		.hide();
		
		ajax_data = $(this).serialize();
		form_method = 'get';
		ajax_data_type = 'json';
		ajax_action = 'request_function_output';
		ajax_container = $('#login-form');
		ajax_send();
	});
};

$( document ).on( "pageshow", "#business-details", function() {
	render_and_display_active_business_listing();
});

$( document ).on( "pagecreate", "#business-details", function() {
	
	//BIND CLICK OF THUMBNAILS
	 $('#display-image-thumbs')
	 .find('img.images-thumb')
	 .bind( 'click' , function(){
		$('img#display-image')
		.attr( 'src', $(this).attr('src') );
	 });
	 
	 
	//$('#business-details-container').on( "swipeleft", function(e){
	$('#business-title')
	.add('#display-image')
	.on( "swipeleft", function(e){
		
		var debounce = Math.abs( e.swipestart.coords[0] - e.swipestop.coords[0] );
		//alert(debounce);
		if ( debounce > 1 ){
			if( $(this).attr( 'business-id' ) ){
				var id = $(this).attr( 'business-id' );
				
				storeObject.active_business = storeBusinesses[ activeBusinessView ][ id ].next_business_id;
				
				//console.log( 'business' , storeBusinesses );
				//console.log( 'active-business' , activeBusinessView );
				
				if( storeObject.active_business == lastBusinessID[ activeBusinessView ] && refreshBusinessListing[ activeBusinessView ] ){
					switch( activeBusinessView ){
					case 'all':
						get_business_listings();
					break;
					case 'search_results':
						get_search_results();
					break;
					}
					//storeObject.active_business = $(this).attr( 'next-business-id' );
					
					storeObject.active_business = storeBusinesses[ activeBusinessView ][ id ].next_business_id;
				}
				
				render_and_display_active_business_listing();
			}
		}
		
	} );
	
	
	 //$('#business-details-container').on( "swiperight", function(e){
	 $('#business-title')
	 .add('#display-image')
	 .on( "swiperight", function(e){
		
		var debounce = Math.abs( e.swipestart.coords[0] - e.swipestop.coords[0] );
		//alert(debounce);
		if ( debounce > 1 ){
			if( $(this).attr( 'business-id' ) ){
				var id = $(this).attr( 'business-id' );
				
				storeObject.active_business = storeBusinesses[ activeBusinessView ][ id ].prev_business_id;
				
				//console.log( 'business' , storeBusinesses );
				//console.log( 'active-business' , activeBusinessView );
				
				if( storeObject.active_business == lastBusinessID[ activeBusinessView ] && refreshBusinessListing[ activeBusinessView ] ){
					switch( activeBusinessView ){
					case 'all':
						get_business_listings();
					break;
					case 'search_results':
						get_search_results();
					break;
					}
					//storeObject.active_business = $(this).attr( 'next-business-id' );
					
					storeObject.active_business = storeBusinesses[ activeBusinessView ][ id ].prev_business_id;
				}
				
				
				render_and_display_active_business_listing();
			}
		}
	} );
	
	activate_iservice_search();
});

function render_and_display_active_business_listing(){
	//alert(storeObject.active_business);
	if( storeObject.active_business ){
	
		var business = storeBusinesses[ activeBusinessView ][ storeObject.active_business ];
		
		//console.log('active', storeBusinesses[ activeBusinessView ] );
		
		ga('send', 'pageview', {'page': '/business-details' , 'title': business.name + ': ' + business.id });
		
		$('img#display-image')
		.attr('src', business.primary_display_image );
		
		$('img.images-thumb-1')
		.attr('src', business.primary_display_image );
		
		$('img.images-thumb-2')
		.attr('src', business.display_image_1 );
		
		$('img.images-thumb-3')
		.attr('src', business.display_image_2 );
		
		$('#business-name')
		.text( business.name );
		
		$('#business-title')
		.text( business.name + ' ' + business.short_address );
		
		$('#primary-activity')
		.text( business.primary_activity );
		
		$('#short-address')
		.text( business.short_address );
		
		$('#business-details-rating')
		.rateit( 'value', business.rating_converted );
		
		$('#email')
		.text( business.email );
		
		$('#phone')
		.text( business.phone );
		
		$('#street-address')
		.text( business.street_address );
		
		$('#state')
		.text( business.state );
		
		$('#city')
		.text( business.city );
		
		$('#country')
		.text( business.country );
		
		$('#additional-info')
		.html( business.additional_info );
		
		$('#description-of-business-activity')
		.html( business.description_of_business_activity );
		
		$('#business-details-container')
		.add('#business-title')
		.add('#display-image')
		.attr( 'business-id' , business.id )
		.attr( 'next-business-id' , business.next_business_id )
		.attr( 'prev-business-id' , business.prev_business_id );
		
	 }
};