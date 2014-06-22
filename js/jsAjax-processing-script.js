/*
 * JavaScript Dashboard Class
 * Created On: 24-MAY-2014
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

window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

$(document).on("iscroll_init", function() {
  
  //alert(32);
});

$( document ).on( "pageshow", "#landing-page", function() {
	$('.fixed-footer')
	.find('a')
	.removeClass('ui-btn-active');
	
	$('a.login')
	.addClass('ui-btn-active');
	
	$('.slidesjs-container')
	.add('.slidesjs-control')
	.css('width', $( '#events-notification-container' ).width()+'px' )
	.css('height', $( '#events-notification-container' ).height()+'px' );
} );

$( document ).on( "pagecreate", "#landing-page", function() {
	
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
	
	if( ++appLoadCount > 1 ){
		/*locally stored data*/
		appLoadCount = 1;
		
		clearData();
	}
	
	get_dynamic_categories();
	/*
	var welcomeMessage = getData( 'welcome-message' );
	
	if( ! ( welcomeMessage == 'koboko' ) ){
		putData( 'welcome-message' , 'koboko' );
		
		$('#welcome-message-popup')
		.enhanceWithin()
		.popup();
		
		$('#welcome-message-popup').popup("open",{transition:'pop'});
	}
	*/
	activate_iservice_search();
});

$( document ).on( "pageshow", "#loading-page-tutorial", function() {
	
	$('div.loader')
	.css('marginTop', ( $(window).height() / 2 )  - ( 260 / 2 )+'px' );
	
});

$( document ).on( "pagecreate", "#business-details-tutorial", function() {
	
	$( "#display-image" ).on( "swipe", function(){
		$("#business-details-tutorial")
		.find('.swipe-text')
		.each(function(){
			$(this).text( $(this).attr('alt') );
		});
		
		$("#business-details-tutorial")
		.find('.swipe-image')
		.each(function(){
			$(this).attr('src', $(this).attr('alt') );
		});
		
	} );
	
	//BIND CLICK OF THUMBNAILS
	 $('#display-image-thumbs')
	 .find('img.images-thumb')
	 .bind( 'click' , function(){
		$('img#display-image')
		.attr( 'src', $(this).attr('src') );
	 });
	/*
	$('#go-to-home-page-tutorial')
	.on('click', function(e){
		e.preventDefault();
		$.mobile.navigate( "#home-page-tutorial", { transition : "none" });
	});*/
	
});

$( document ).on( "pagecreate", "#home-page", function() {
	
	$.mobile.iscrollview.prototype.options.refreshOnPageBeforeShow = true;
	
	$("#home-page-example-wrapper", this).bind( {
	"iscroll_onpulldown" : function(){},
	"iscroll_onpullup"   : function(){
		
		$("#home-page-example-wrapper").iscrollview("refresh");
		
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
	},
	iscroll_onpulluploading:function(){
		
		$('#app-loading-animation-id').show();
		
		$("#home-page-example-wrapper").iscrollview("refresh", '', function(){}, function(){
			if( $('#app-loading-animation-id').is(':visible') ){
				$("#home-page-example-wrapper").iscrollview("scrollToElement", '#app-loading-animation-id' ); 
			}
		});
	},
	});
	
	//activate_iservice_search();
	//continuous_scroll_load_more();
	
	ga('send', 'pageview', {'page': '/home-page' , 'title': 'Business List' });
	
});
 
$( document ).on( "pageshow", "#home-page", function() {
	/*recalculate_height_of_scrollable_areas( '.content-scrollable-area' );*/
	if( $("#home-page-example-wrapper").hasClass('iscroll-wrapper') ){
		$("#home-page-example-wrapper").iscrollview("refresh");
	}
	
	$('.fixed-footer')
	.find('a')
	.removeClass('ui-btn-active');
	
	$('a.skull')
	.addClass('ui-btn-active');
});
 
$( document ).on( "pagecreate", "#categories-page", function() {
	//activate_iservice_search();
});
$( document ).on( "pagecreate", "#mallam-musa", function() {
	//activate_iservice_search();
});
$( document ).on( "pagecreate", "#business-details", function() {
	//activate_iservice_search();
});

$( document ).on( "pageshow", "#categories-page", function() {
	$('#app-main-menu')
	.find('h2')
	.not('.more-categories')
	.find('a')
	.removeClass('ui-btn-icon-left');
	
	$('.fixed-footer')
	.find('a')
	.removeClass('ui-btn-active');
	
	$('a.beer')
	.addClass('ui-btn-active');
});

$( document ).on( "pageshow", "#about", function() {
	$('.fixed-footer')
	.find('a')
	.removeClass('ui-btn-active');
	
	$('a.more-b')
	.addClass('ui-btn-active');
	
	ga('send', 'pageview', {'page': '/about' , 'title': 'About Koboko' });
});

$( document ).on( "pageshow", "#mallam-musa", function() {
	$('.fixed-footer')
	.find('a')
	.removeClass('ui-btn-active');
	
	$('a.mallam-musa-b')
	.addClass('ui-btn-active');
	
	if( storeObject.videos_playlist ){
		
		$('iframe#player')
		.attr('src' , storeObject.videos_playlist );
		ga('send', 'pageview', {'page': '/mallam-musa' , 'title': 'The Chronicles of Mallam Musa Series' });
		
		if( storeObject.latest_video ){
			$('h2#mallam-musa-video-title')
			.text( storeObject.latest_video.title );
		}
		
		/*Videos in Series*/
		if( videosLoad ){
			get_videos();
		}
		
		if( $("#mallam-musa-example-wrapper").hasClass('iscroll-wrapper') ){
			$("#mallam-musa-example-wrapper").iscrollview("refresh");
		}
	}
});

var storeObject = {
    
}

var appLoadCount = 0;

var appLoad = true;

var videosLoad = true;

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
var ajax_request_md5_key = '';

//AJAX Request Data Before Sending
var ajax_request_data_before_sending_to_server = '';

var function_click_process = 1;

var cancel_ajax_recursive_function = false;

//BUSINESS LISTINGS QUERY LIMITS
var business_limit_start = new Array();
var business_limit_interval = 20;

//SEARCH QUERY LIMITS
var search_condition = '';
var search_limit_start = 0;
var search_limit_interval = 20;

function clearData(){
	var storedObjects = amplify.store();
	
	ga('send', 'pageview', {'page': '/user-triggered-refresh' , 'title': 'User Refreshed App' });
	
	$.each( storedObjects , function ( key , value ){
		switch( key ){
		case 'custom-uuid':
		case 'rated-businesses':
		break;
		default:
			amplify.store( key , null );
		break;
		}
	});
};

function putData( key , value ){
	return amplify.store( key , value );
};

function getData( key ){
	return amplify.store( key );
};

function get_dynamic_categories(){
	ajax_data = {action:'categories', todo:'get_dynamic_categories'};
	form_method = 'get';
	ajax_data_type = 'json';
	ajax_action = 'request_function_output';
	ajax_container = $('#login-form');
	ajax_send();
	
};

function get_videos(){
	ajax_data = {action:'videos', todo:'get_videos'};
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

home_link_navigate();
function home_link_navigate(){
	$('a.koboko-home-link-navigate')
	.on( 'click', function( e ){
		e.preventDefault();
		$.mobile.navigate( "#home-page", { transition : "none" });
	});
};

function events_notification_swipe( $e , notTutorial ){
	var $all_elements = $e.find('.events-notification-holder');
	var $element = $e.find('.events-notification-holder:visible');
	
	var load_more_adverts = false;
	
	
	if( notTutorial && ( $all_elements.length - 2 ) == $element.index() ){
		if( refreshBusinessListing[ 'advert' ] ){
			load_more_adverts = true;
		}
	}
	
	$element
	.addClass('hide-this-element');
	
	if( ( $all_elements.length - 1 ) == $element.index() ){
		
		if( notTutorial && refreshBusinessListing[ 'advert' ] ){
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
	
	if( notTutorial && load_more_adverts ){
		get_adverts();
	}
};
	
function bind_main_menu_click_events(){
	
	$('#app-main-menu')
	.find('a.category-navigation-menu')
	.bind( 'click', function(e){
		
		e.preventDefault();
		
		$.mobile.navigate( "#home-page", { transition : "none" });
		
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
	
	$('a.skull')
	.add( '#application-title-bar-home-page' )
	.add( '#feel-good' )
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
		
	});
};

	$('a.skull')
	.add( '#application-title-bar-home-page' )
	.add( '#feel-good' )
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
		
		$('#search-text-field-home-page').attr( 'value' , '' );
	});
	
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

function prepare_advert_html( key , value , mode ){
	
	var html = '<ul data-role="listview" data-inset="false" data-divider-theme="a" >';
		html += '<li>';
			html += '<div class="events-notifications-content half-open-events-notifications">';
				html += '<img src="'+value.display_image+'" width="100%" />';
			html += '</div>';
			
			if( value.additional_info || value.title ){
				html += '<div class="text-area">';
					if( value.title )html += '<h5>'+value.title+'</h5>';
					if( value.additional_info )html += value.additional_info;
				html += '</div>';
			}
		html += '</li>';
	html += '</ul>';
    
	return html;
};

function continuous_scroll_load_more(){
	$( document )
	.bind( 'scroll' , function(){
		//console.log('scroll',( $(this).scrollTop()+$(window).height() ) +'--'+ $(document).height() );
		
		var active_page_id = get_active_page_id();
		
		switch( active_page_id ){
		case "home-page":	
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
		break;
		}
	});
	
};


function activate_iservice_search(){
	/*
	.add('form#search-form-mallam-musa')
	.add('form#search-form-business-details')
	.add('form#search-form-business-details')*/
	
	$('form.search-form')
	.on('submit', function (e){
		
		e.preventDefault();
		
		var active_page_id = get_active_page_id();
		
		if( ! active_page_id ){
			active_page_id = "landing-page";
		}
		
		if( active_page_id ){
		
			switch( active_page_id ){
			case "home-page":
			case "business-details":
			case "mallam-musa":
			case "landing-page":
			case "categories-page":
			case "about":
				$( '#businesses-container' )
				.add( '#category-navigation-container' )
				.add( '#search-results-container' )
				.removeClass('in-category-navigation-mode')
				.addClass('in-search-mode');
				
				//Submit Search Request
				refreshBusinessListing[ "search_results" ] = true;
				search_limit_start = 0;
				search_condition = $(this).find('#search-text-field-'+active_page_id).val();
				
				if( active_page_id != 'home-page' ){
					$('.search-form')
					.find('input')
					.val('')
					.attr('value', '');
				
					$('#search-text-field-home-page').attr( 'value' , search_condition );
					
					$.mobile.navigate( "#home-page", { transition : "none" });
				}
				
				$('#search-results-container')
				.empty();
				
				get_search_results();
				
				$('#main-title-bar')
				.text( 'Search Results: ' + $('#search-text-field-home-page').attr('value') );
		
			break;
			}
		}
	});
};

function get_active_page_id(){
	var active_page = $( "body" ).pagecontainer( "getActivePage" );
	var active_page_id = active_page.context.location.hash;
	
	if( active_page_id ){
		active_page_id = active_page_id.replace('#', '');
	}
	
	return active_page_id;
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
			
			ajax_request_md5_key = '';
			ajax_request_md5_key += ajax_data_type + form_method + pagepointer + ajax_get_url;
			if( typeof(ajax_data) == "object" )
				ajax_request_md5_key += $.param( ajax_data );
			else
				ajax_request_md5_key += ajax_data;
			
			/*CHECK FOR LOCALLY STORED DATA*/
			ajax_request_md5_key = md5( ajax_request_md5_key );
			
			var storedData = getData( ajax_request_md5_key );
			
			if( storedData ){
				ajaxSuccess( storedData , false );
				return false;
			}
		},
		error: function(event, request, settings, ex) {
			ajaxError( event, request, settings, ex );
		},
		success: function(data){
			
			ajaxSuccess( data , true );
		}
	});
	}
};

function ajaxError( event, request, settings, ex ){
	if( $('#app-loading-animation-id').is(':visible') ){
		$('#app-loading-animation-id')
		.hide();
		
		if( $("#home-page-example-wrapper") && $("#home-page-example-wrapper").hasClass('iscroll-wrapper') ){
			$("#home-page-example-wrapper").iscrollview("refresh");
		}
	}
};

function ajaxSuccess( data , store ){
	/*store data in local storage*/
	if( $('#app-loading-animation-id').is(':visible') ){
		$('#app-loading-animation-id')
		.hide();
		
		if( $("#home-page-example-wrapper") && $("#home-page-example-wrapper").hasClass('iscroll-wrapper') ){
			$("#home-page-example-wrapper").iscrollview("refresh");
		}
	}
	
	if( data && store ){
		putData( ajax_request_md5_key , data );
	}
	
	requestRetryCount = 0;
	
	function_click_process = 1;

	switch(ajax_action){
	case "request_function_output":
		ajax_request_function_output(data);
	break;
	}
	
	//CHECK FOR NOTIFICATION
	if(data.notification){
		check_for_and_display_notifications(data.notification);
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
				var show_more = false;
				
				var html_more = '<div data-role="collapsible">';
				html_more += '<h2><span class="con-image-left more-categories">More Categories</span></h2>';
				html_more += '<div data-role="collapsible-set" data-theme="g" data-content-theme="a"  data-collapsed-icon="carat-r" data-expanded-icon="carat-d" style="margin:0 -0.5em;">';
				
				var html = '<div id="app-main-menu" data-role="collapsible-set" data-theme="g" data-content-theme="a" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">';
				$.each(data.html, function(key, value){
					
					var temp = '';
					var icon = 'default-con';
					
					if( value.icon )
						icon = value.icon + '-con';
						
					temp += '<div data-role="collapsible" data-iconpos="right">';
						temp += '<h2><span class="con-image-left '+icon+'">'+value.title+'</span></h2>';
						temp += '<ul data-role="listview">';
					
					if( value.sublevels ){
						$.each(value.sublevels, function(ki, vi){
							temp += '<li><a href="#" data-ajax="false" id="'+ki+'" class="category-navigation-menu">'+vi.title+'</a></li>';
							
							refreshBusinessListing[ ki ] = true;
							storeBusinesses[ ki ] = new Array();
							
							business_limit_start[ ki ] = 0;
						});
					}
					
						temp += '</ul>';
					temp += '</div>';
					
					switch( value.type ){
					case '100':
						html += temp;
					break;
					case '150':
						html_more += temp;
						
						show_more = true;
					break;
					}
				});
				
				if( show_more ){
					html += html_more + '</div>';
				}
				
				html += '</div>';
				
				if( data.videos_playlist ){
					
					storeObject.videos_playlist = data.videos_playlist;
					
				}
				
				//html += '<li data-icon="info" class="ui-alt-icon"><a href="tutorial.html" rel="external">How to Use Koboko</a></li>';
				//html += '<li data-icon="info" class="ui-alt-icon"><a href="#about">About</a></li>';
			}
			
			//Store HTML in Client Storage
			
			//Insert HTMl into respective position
			
			$('#navigation-menu')
			.html( html )
			.trigger('create');
			
			//Initialize to jQuery Mobile Controls
			
			/*Bind Actions if Any*/
			$('#navigation-menu')
			.find('h2 > a')
			.on('click', function(){
				//alert(1);
				$("#categories-page-example-wrapper").iscrollview("refresh");
			});
			
			/*Initialize Refresh Commands*/
			refreshBusinessListing[ 'all' ] = true;
			refreshBusinessListing[ 'search_results' ] = true;
			refreshBusinessListing[ 'advert' ] = true;
			
			business_limit_start[ 'all' ] = 0;
			business_limit_start[ 'advert' ] = 0;
			
			storeBusinesses[ 'advert' ] = new Array();
			storeBusinesses[ 'all' ] = new Array();
			storeBusinesses[ 'search_results' ] = new Array();
			
			bind_main_menu_click_events();
			
			/*Load Initial Adverts*/
			get_adverts();
			
		break;
		case "get-videos":
			/*Transform Data to HTML Markup*/
			if( data.html.videos && data.html.videos.season ){
				var html = '<ul data-role="listview" data-inset="true" data-shadow="false" data-corners="false">';
				
				$.each(data.html.videos.season, function(key, value){
					
					html += '<li data-role="collapsible" data-iconpos="right" data-inset="false">';
						html += '<h2 class="season-title">'+value.season_title+'</h2>';
						html += '<ul data-role="listview" data-theme="a" data-count-theme="g">';
					
					var current_season_id = value.season_id;
					
					$.each( value.season_videos , function(ki, vi){
						html += '<li><a href="#" data-ajax="false" class="videos-link" id="'+ki+'" youtube-link="'+vi.youtube_link+'" title="'+vi.title+'">'+vi.title;
							if( ki == data.html.videos.latest_video ){
								html += '<span class="ui-li-count">new</span>';
							}
						html += '</a></li>';
					});
					
						html += '</ul>';
					html += '</li>';
					
				});
				
				html += '</ul>';
			}
			
			/*Store HTML in Client Storage*/
			
			$('#video-series-container')
			.html( html )
			.trigger('create');
			
			$("#mallam-musa-example-wrapper").iscrollview("refresh");
			
			$('#video-series-container')
			.find('a.videos-link')
			.bind('click', function(){
				
				$('iframe#player')
				.attr('src' , $(this).attr('youtube-link')+'?rel=0' );
				ga('send', 'pageview', {'page': '/mallam-musa' , 'title': $(this).attr('title') });
				
			});
			
			videosLoad = false;
			
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
					.prepend( html )
					.trigger( 'create' );
					
					setTimeout(function(){
						$( '#events-notification-container' )
						.slidesjs({
							width:$( '#events-notification-container' ).width(),
							height:$( '#events-notification-container' ).height(),
						});
						
						/*
						$('.slidesjs-container')
						.add('.slidesjs-control')
						.css('height', $( '#events-notification-container' ).height()+'px' );
						*/
					}, 100 );
					
				}
				
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
				
				/*console.log('last_id', lastBusinessID[ activeBusinessView ]);
				console.log( 'businesses' , storeBusinesses );*/
				
				if( data.html.limit_start ){
					switch( activeBusinessView ){
					case "search_results":
						search_limit_start = data.html.limit_start;
					break;
					default:
						business_limit_start[ activeBusinessView ] = data.html.limit_start;
					break;
					}
				}
				
				if( html ){
					switch( activeBusinessView ){
					case "all":
						$( '#businesses-container' )
						.append( '<ul data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + html + '</ul>' )
						.trigger('create');
						
						//if( ! appLoad )
							//$(".example-wrapper").iscrollview("refresh");
					break;
					case "search_results":
						$( '#search-results-container' )
						.append( '<ul data-role="listview" data-split-icon="star" data-split-theme="a" data-inset="false">' + html + '</ul>' )
						.trigger('create');
						
						//if( $(".example-wrapper").is(':visible') && ! appLoad ){
							//$(".example-wrapper").iscrollview("refresh");
						//}
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
				if( search_limit_start == 0 ){
					switch( activeBusinessView ){
					case "search_results":
						$( '#search-results-container' )
						.html( '<div align="center"><img src="img/no-results.png" style="display:block;"/></div>' )
						.trigger('create');
					break;
					}
				}
				
				refreshBusinessListing[ activeBusinessView ] = false;
			}
			
			$('a.navigate')
			.bind('click', function( e ){
				e.preventDefault();
				
				storeObject.active_business = $(this).attr('id');
				
				$.mobile.navigate( "#business-details", { transition : "none" });
			});
			
			activate_rate_it();
			handle_rating_popup_open();
			
			if( appLoad ){
				appLoad = false;
				//$.mobile.navigate( "#home-page", { transition : "none" } );
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
				
				/*UPDATE RATING*/
				$('#business-details-rating-popup')
				.rateit( 'value', data.html.rating_converted );
				
				$('#business-details-rating-percent-popup')
				.text( data.html.rating + '%' );
				
				$( '#'+key )
				.find('.rateit')
				.rateit( 'value', data.html.rating_converted );
				
				/*DISPLAY FINISH BUTTON*/
				$('#rate-business-form')
				.find('.rate-form-finish')
				.text('Finish')
				.show();
				
				$('#rate-business-form')
				.find('.rate-form-submit')
				.hide();
				
				var storedData = getData( 'rated-businesses' );
				if( ! storedData ){
					var storedData = {};
				}
				
				storedData[key] = true;
				putData( 'rated-businesses' , storedData );
				
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
				
				$.mobile.navigate( "#business-details", { transition : "none" });
			});
			
			activate_rate_it();
		break;
		}
	}
	
	
};

function activate_rate_it(){
	$('.rateit')
	.rateit({ max: 5, step: 0.5 });
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
			
			var storedData = getData( 'rated-businesses' );
			
			var key = business.id;
			if( storedData && storedData[key] ){
				$('form#rate-business-form')
				.find('.rate-form-finish')
				.show();
				
				$('form#rate-business-form')
				.find('.rate-form-submit')
				.hide();
				
				$('form#rate-business-form')
				.find('fieldset')
				.hide();
			}else{
				$('form#rate-business-form')
				.find('.rate-form-finish')
				.hide();
				
				$('form#rate-business-form')
				.find('fieldset')
				.show();
				
				$('form#rate-business-form')
				.find('.rate-form-submit')
				.show();
			}
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
	
});

function render_and_display_active_business_listing(){
	//alert(storeObject.active_business);
	
	if( storeObject.active_business ){
	
		$("#business-details")
		.find('img.loadable-image')
		.addClass('loading-mode');
		
		$("#business-details")
		.find('.loader-animation-container')
		.removeClass('loading-mode');
		
		var business = storeBusinesses[ activeBusinessView ][ storeObject.active_business ];
		
		//console.log('active', storeBusinesses[ activeBusinessView ] );
		
		ga('send', 'pageview', {'page': '/business-details' , 'title': business.name + ': ' + business.id });
		
		$('img#display-image')
		.attr('src', business.primary_display_image )
		.removeClass( '' );
		
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
		
		$('#business-details')
		 .imagesLoaded()
		 .always( function( instance ) {
			$("#business-details")
			.find('.loader-animation-container')
			.addClass('loading-mode');
			
			$("#business-details")
			.find('img')
			.removeClass('loading-mode');
			
			if( $("#business-details-example-wrapper").hasClass('iscroll-wrapper') ){
				$("#business-details-example-wrapper").iscrollview("refresh");
			}
		});
		
		
	 }
};