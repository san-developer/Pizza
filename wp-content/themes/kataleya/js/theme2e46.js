"use strict";
/* Order Menu */

function validateEmail(email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{1,4})?$/;
    if (!emailReg.test(email)) {
        return false;
    } else {
        return true;
    }
}

function validateContactNumber(number) {
    var numberReg = /^((\+)?[1-9]{1,3})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
    if (!numberReg.test(number)) {
        return false;
    } else {
        return true;
    }
}

function validateTextOnly(text) {
    var textReg = /^[A-z]+$/;
    if (!textReg.test(text)) {
        return false;
    } else {
        return true;
    }
}

function validateNumberOnly(number) {
    var numberReg = /^[0-9]+$/;
    if (!numberReg.test(number)) {
        return false;
    } else {
        return true;
    }
}

function checkElementValidation(child, type, check, error) {

    child.parent().find('.error-message').remove();

    if ( child.val() == "" && child.attr("data-required") == "required" ) {
        child.addClass("error");
        child.parent().append('<span class="error-message">' + child.parents("form").attr("data-required") + '</span>');
        child.parent().find('.error-message').css("margin-left", -child.parent().find('.error-message').innerWidth()/2);
        return false;
    } else if( child.attr("data-validation") == type && 
        child.val() != "" ) {

        if( !check ) {
            child.addClass("error");
            child.parent().append('<span class="error-message">' + error + '</span>');
            child.parent().find('.error-message').css("margin-left", -child.parent().find('.error-message').innerWidth()/2);
            return false;
        }
    }

    child.removeClass("error");
    return true;
}

function checkFormValidation(el) {
    var valid = true,
        children = el.find('input[type="text"], textarea');

    children.each(function(index) {
        var child = children.eq(index);
        var parent = child.parents("form");

        if( !checkElementValidation(child, "email", validateEmail(child.val()), parent.attr("data-email")) ||
            !checkElementValidation(child, "phone", validateContactNumber(child.val()), parent.attr("data-phone")) ||
            !checkElementValidation(child, "text_only", validateTextOnly(child.val()), parent.attr("data-text")) ||
            !checkElementValidation(child, "number", validateNumberOnly(child.val()), parent.attr("data-number")) 
        ) {
            valid = false;
        }
    });

    return valid;
}

(function($, undefined) {
    $.expr[":"].containsNoCase = function(el, i, m) {
        var search = m[3];
        if (!search) return false;
        return new RegExp(search, "i").test($(el).text());
    };

    $.fn.searchFilter = function(options) {
        var opt = $.extend({
            // target selector
            targetSelector: "",
            // number of characters before search is applied
            charCount: 1
        }, options);

        return this.each(function() {
            var $el = $(this);
            $el.keyup(function() {
                var search = $(this).val();

                var $target = $(opt.targetSelector);
                $target.show();

                if (search && search.length >= opt.charCount) {
                	$target.not(":containsNoCase(" + search + ")").hide();
                }

                $('.order-menu section').each( function(index) {
                	var temp = $('.order-menu section').eq(index);

	                if( temp.children('.food-item:visible').length === 0 ) {
	                	if( !temp.children('.no-results').length ) {
	                		temp.append('<span class="no-results">No results found!</span>');
	                	}
	                } else {
	                	temp.children('.no-results').remove();
	                }
                });

				if( $('.order-menu section').children(':visible').length == 0 ) {
					$('.order-menu section').append('test');
				}
            });
        });
    };
})(jQuery);

jQuery.fn.serializeObject = function()
{
	var o = {};
	var a = this.serializeArray();
	jQuery.each(a, function() {
	    if (o[this.name]) {
	        if (!o[this.name].push) {
	            o[this.name] = [o[this.name]];
	        }
	        o[this.name].push(this.value || '');
	    } else {
	        o[this.name] = this.value || '';
	    }
	});
	return o;
};

jQuery.fn.alterClass = function ( removals, additions ) {
	
	var self = this;
	
	if ( removals.indexOf( '*' ) === -1 ) {
		// Use native jQuery methods if there is no wildcard matching
		self.removeClass( removals );
		return !additions ? self : self.addClass( additions );
	}
 
	var patt = new RegExp( '\\s' + 
			removals.
				replace( /\*/g, '[A-Za-z0-9-_]+' ).
				split( ' ' ).
				join( '\\s|\\s' ) + 
			'\\s', 'g' );
 
	self.each( function ( i, it ) {
		var cn = ' ' + it.className + ' ';
		while ( patt.test( cn ) ) {
			cn = cn.replace( patt, ' ' );
		}
		it.className = jQuery.trim( cn );
	});
 
	return !additions ? self : self.addClass( additions );
};


function map(element, location, zoom) {
	jQuery(element).gmap3({
		map: {
			options: {
				zoom: zoom,
				scrollwheel: false
			}
		},
		getlatlng:{
			address: location,
			callback: function(results) {
			if ( !results ) { return; }
			jQuery(this).gmap3('get').setCenter(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
			jQuery(this).gmap3({
				marker: {
					latLng:results[0].geometry.location,
				}
			});
			}
		}
	});
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

jQuery.fn.isOnScreen = function(){
     
    var win = jQuery(window);
     
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
     
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
     
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};

jQuery(function($) {
	var SITE_URL = $('#site-url').val();

	$('.navbar-toggle').on('click', function() {
		$('.site-navigation').height($(window).height() - 97);
		$('body').toggleClass('mobile-menu');
		return false;
	});

	$(window).resize(function() {
		if( $('.mobile-menu').length ) {
			$('.site-navigation').height($(window).height() - 97);
		}
	});
	
	addNewStyle('@media (min-width: 1200px) {.ls-container, .ls-inner, .ls-slide {height: ' + $(window).height() + 'px !important;}}');


	var siteLogo = $('.site-logo img');
	var siteLogoStickyURL = siteLogo.attr('data-sticky');
	var siteLogoURL = siteLogo.attr('src');

	if($('.sticky-menu').length) {
		$(window).scroll(function() {
			if($(window).scrollTop() > 200) {
				$('body').addClass('sticky-scroll');
				if( siteLogoStickyURL ) {
					siteLogo.attr('src', siteLogoStickyURL);
				}
			} else {
				$('body').removeClass('sticky-scroll');
				if( siteLogoStickyURL ) {
					siteLogo.attr('src', siteLogoURL);
				}
			}
		});
	}

	//Enable swiping...
	$(".carousel-inner").swipe( {
		//Generic swipe handler for all directions
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			$(this).parent().carousel('prev'); 
		},
		swipeRight: function() {
			$(this).parent().carousel('next'); 
		},
		//Default is 75px, set to 0 for demo so any distance triggers swipe
		threshold:0
	});

	//Enable autoplay

	$('.carousel').carousel({
	  interval: 4000
	});

	/* Navigation links (smooth scroll) */

	$('.site-navigation a[href*=#]:not([href=#])').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
	      || location.hostname == this.hostname) {

	    var target = $(this.hash);
	    var href = $.attr(this, 'href');
	    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	    if (target.length) {
	      $('html,body').animate({
	        scrollTop: target.offset().top
	      }, 1000, function () {
	          window.location.hash = href;
	      });
	      return false;
	    }
	  }
	});

	var navLinkIDs = [];

	$('.site-navigation a[href*=#]:not([href=#])').each(function(index) {
		var temp = $('.site-navigation a[href*=#]:not([href=#])').eq(index).attr("href").split('#');
		temp = '#' + temp[1];
		// Check if the element exits
		if($(temp).length) {
			navLinkIDs.push(temp);
		}
	});

	function siteNavigation() {
		$.each(navLinkIDs, function(i, val) {
			if( $(val).isOnScreen() ) {
				$('.site-navigation > li').removeClass('active');
				$('.site-navigation a[href*="' + val + '"]').parent().addClass('active');
				return false;
			}
		});
	}

	siteNavigation();

	$(window).scroll(function() {
		siteNavigation();
	});

	/* Blog load more */

	if( !$('.load-more.no-ajax') ) {
		var blogPage = 1;

		$('.load-more .btn').on('click', function() {
			$('.load-more .btn').attr('disabled', 'disabled');

			$.ajax({
				url: SITE_URL + "/blog/page-" + (blogPage + 1) + ".html",
				cache: false
			}).done(function(html) {
				$('.blog-loop > .container > .row > div').append(html);
				$('.blog-loop .blog-new-page:last-of-type').hide();
				$('.blog-loop .blog-new-page:last-of-type').slideDown();
				blogPage++;

				if( !UrlExists( SITE_URL + "/blog/page-" + (blogPage + 1) + ".html" ) ) {
					$('.load-more').remove();
				}

				$('.load-more .btn').removeAttr('disabled');
			});
		});
	}

	/* Masonry */
	var masonry = $('.masonry .col-md-12');
	if(masonry.length) {
		masonry.imagesLoaded(function() {
			masonry.isotope({
				itemSelector: '.masonry .col-md-12 article',
	            animationOptions: {
	                duration: 750,
	                queue: false,
	            }
			});
		});
	}

	/* Flickr Widget */

	if( $('.flickr-widget').length ) {
		$('.flickr-widget').jflickrfeed({
			limit: 9,
			qstrings: {
				id: $('.flickr-widget').attr('data-account')
			},
			useTemplate: false,
			itemCallback: function(item) {
				$(this).append('<a target="_blank" href="' + item.link + '"><img src="' + item.image_q + '" alt="' + item.title + '"/></a>');
			}
		});
	}

	/* Hover */

	var hoverEl = $('.hover');

	$('img').imagesLoaded(function() {
		hoverEl.each(function(index) {
			hoverEl.eq(index).addClass('hover-align');
			hoverEl.eq(index).css({
				'margin-top' : '-' + ((hoverEl.eq(index).innerHeight()) / 2) + 'px',
			});
		});
	});


	/* Portfolio Filtering */

	var $container = '';
	if( $('.portfolio').length ) {
		$('img').imagesLoaded(function() {
			$container = $('.portfolio');
			if($container.length) {

			  /* Settings Up Isotope */

			  $container.isotope({
			      itemSelector : '.portfolio article',
			      layoutMode: 'fitRows',
			      animationOptions: {
			          duration: 750,
			          queue: false,
			      }
			  });

			  /* On Scroll */

			  var first_scroll = true;

			  $(window).scroll(function() {
			      if(first_scroll) {
			          $container.isotope();
			          first_scroll = false;
			      }
			  });

			  /* On Resize */

			  $(window).resize(function(){
			      $container.isotope();
			  });
			}
		});
	}

	/* Twitter */

	try {

	$("[data-twitter]").each(function(index) {
	    var el = $("[data-twitter]").eq(index);

	    $.ajax({
	        type: "POST",
	        url: $('#site-url').val() + '/assets/php/twitter.php',
	        data: {
	          account : el.attr("data-twitter")
	        },

	        success: function(msg) {
	          el.find(".carousel-inner").html(msg);
	        }
	    });
	    
	});
	} catch(e) {}

	/* Mailing */

	$('form[data-form="contact"]').on("submit", function(e) {
	  $(".contact-success").remove();
	  var el = $(this);
	  var formData = el.serializeObject();

	  if(checkFormValidation(el)) {
	      try {
	          $.ajax({
	              type: "POST",
	              url: $('#site-url').val() + '/includes/' + 'mail.php',
	              data: {
	                  form_data : formData,
	              }
	          }).success(function(msg) {
	            $("form.contact-form").append('<div class="row"><div class="col-md-12"><div class="alert alert-success contact-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-check"></i>' + $("form.contact-form").attr("data-success") + '</div></div></div>');
	         	$('.contact-success .close').on('click', function() {
					$(this).parent().remove();
				});
	          });
	      } catch(e) { console.log(e); }
	  }

	  e.preventDefault();
	  return false;
	});

	/* WordPress specific */
	// Comment buttons
	$('button[data-form="clear"]').on('click', function() {
	 $('textarea, input[type="text"]').val(''); 
	});
	$('button[data-form="submit"]').on('click', function() {
	 $('.form-submit #submit').click(); 
	});
	// Search widget
	$('.widget_product_search form').addClass('searchform');
	$('.searchform input[type="submit"]').remove();
	$('.searchform div').append('<button type="submit" class="fa fa-search" id="searchsubmit" value=""></button>');
	$('.searchform input[type="text"]').attr('placeholder', 'Search...');


	/* Portfolio AJAX Pagination & Filter
	-------------------------------------------------------------- */

	if( $('.portfolio').length ) {
		// Portfolio Shortcode Settings (static, only need to be read on initial load)
		var portfolioPerpage 	 = parseInt($('.portfolio').attr('data-perpage'));
		var portfolioOrder 		 = $('.portfolio').attr('data-order');
		var portfolioOrderby 	 = $('.portfolio').attr('data-orderby');
		var portfolioNumCatPosts = $('.portfolio').attr('data-individual-categories').split(':');

		$('.portfolio-pagination button').on('click', function() {
			portfolioAjaxPagination($(this));
		});

		/* On Filter Click */

		$('.filter button').on('click', function() {
			// Select the proper filter element
			$('.filter button').removeClass('selected');
			$(this).addClass("selected");

			var item = "";
			var cat = $(this).attr('data-filter');
			// Add dot before category class names
			if( cat != '*' ) {
				item = ".";
			}
			item += cat;

			// Check if AJAX pagination is active
			if( $('.portfolio-pagination').length ) {
				// Only show first page items
				item += '.page-1';

				// Change page classes
				var curPage = 1;
				var catClass = '.' + cat
				if( cat === '*' ) {
					catClass = '';
				}
				
				// Removes all page classes
				$('.portfolio article').alterClass('page-*', '');

				$('.portfolio article' + catClass).each(function(index) {
					$('.portfolio article' + catClass).eq(index).addClass('page-' + curPage);

					if((index + 1) % portfolioPerpage == 0) {
						curPage++;
					}
				});

				// Re-create the pagination, set it to 1st page

				var numPosts = portfolioNumCatPosts[$('.filter .selected').parent().index()];
				var elPagination = $('.portfolio-pagination');
				$('.portfolio-pagination').html('');
				for(var i=1;i<=Math.ceil(numPosts/portfolioPerpage);i++) {
					if( i === 1 ) {
						elPagination.append('<li class="active"><button class="page-numbers">' + i + '</button></li>');
					} else {
						elPagination.append('<li><button class="page-numbers">' + i + '</button></li>');
					}
				}

				$('.portfolio-pagination button').on('click', function() {
					portfolioAjaxPagination($(this));
				});

				portfolioAjaxPagination($('.portfolio-pagination li.active button'));
			}

			$container.isotope({ filter: item });
		});
	}

	function portfolioPaginationChange(el, index) {
        // Only display nth page items
        $container.isotope({ filter: '.page-' +  (index + 1)});

        // Change pagination active state
        $('.portfolio-pagination li').removeClass('active');
        el.parent().addClass('active');
	}

	function portfolioAjaxPagination (el) {
		var index = parseInt(el.parent().index());

		// How many items are already added?
		var numItems = $container.children('article.page-' + (index + 1)).length;

		// How many items do we still need?
		var getItems = portfolioPerpage - numItems;

		// If we need to get some items, get them via AJAX
		if( getItems > 0 && !(index + 1 == $('.portfolio-pagination li').length && numItems != 0) ) {
			$.ajax({
				type: "POST",
				url: $('#site-url').val() + '/includes/portfolio-ajax.php',
				data: {
					category : $('.filter .selected').attr('data-filter'),
					orderby  : portfolioOrderby,
					perpage  : portfolioPerpage,
					order 	 : portfolioOrder,
					numitems : getItems,
					offset 	 : portfolioPerpage * index,
				}
			}).success(function(data) {				
				// Get the AJAX items and add them to the isotope element
	            var item = $(data);
	            $container.append(item).isotope( 'appended', item );

	            // New items are added, now change the page
	            portfolioPaginationChange(el, index);
			});
		} else {
			// We do not need to get any new items, just change the page
			portfolioPaginationChange(el, index);
		}
	}

	/* Portfolio recent AJAX */

    $("a[data-rel^='prettyPhoto']").prettyPhoto({
    	show_title: false,
    	social_tools: '',
    	default_width: 1200,
    	callback: function(){
    		$('body').removeClass('portfolio-open');
    	},
    	changepicturecallback: function(){
    		$('body').addClass('portfolio-open');
    	},
		markup: '<div class="pp_pic_holder"> \
			<div class="ppt">&nbsp;</div> \
			<div class="pp_top"> \
				<div class="pp_left"></div> \
				<div class="pp_middle"></div> \
				<div class="pp_right"></div> \
			</div> \
			<div class="pp_content_container"> \
				<div class="pp_left"> \
				<div class="pp_right"> \
					<div class="pp_content"> \
						<div class="pp_loaderIcon"></div> \
						<div class="pp_fade"> \
							<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
							<div class="pp_hoverContainer"> \
								<a class="pp_next" href="#">next</a> \
								<a class="pp_previous" href="#">previous</a> \
							</div> \
							<div id="pp_full_res"></div> \
							<div class="pp_details"> \
								<div class="pp_nav"> \
									<a href="#" class="pp_arrow_previous">Previous</a> \
									<p class="currentTextHolder">0/0</p> \
									<a href="#" class="pp_arrow_next">Next</a> \
								</div> \
								<p class="pp_description"></p> \
								{pp_social} \
								<a class="pp_close" href="#">×</a> \
							</div> \
						</div> \
					</div> \
				</div> \
				</div> \
			</div> \
			<div class="pp_bottom"> \
				<div class="pp_left"></div> \
				<div class="pp_middle"></div> \
				<div class="pp_right"></div> \
			</div> \
		</div> \
		<div class="pp_overlay"></div>',
    });
});