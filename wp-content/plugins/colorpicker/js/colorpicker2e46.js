"use strict";

function sticky() {
    var siteLogo = jQuery('.site-logo img');
    var siteLogoStickyURL = siteLogo.attr('data-sticky');
    var siteLogoURL = siteLogo.attr('src');

    jQuery(window).scroll(function() {
        if(jQuery(window).scrollTop() > 200) {
            jQuery('body').addClass('sticky-scroll');
            if( siteLogoStickyURL ) {
                siteLogo.attr('src', siteLogoStickyURL);
            }
        } else {
            jQuery('body').removeClass('sticky-scroll');
            if( siteLogoStickyURL ) {
                siteLogo.attr('src', siteLogoURL);
            }
        }
    });
}

var stylesheet = jQuery("link[href*='scheme'], link[href*='custom-styles']");
var prefix = 'http://anpsthemes.com/kataleya/pizza-place/wp-content/plugins/colorpicker/schemes';

/* =Color schemes
-------------------------------------------------------------- */

var cookieSchemeName = "anps_kataleya_scheme";

/* Check if cookie exists and set it */
if(jQuery.cookie(cookieSchemeName)) {
    jQuery('.colorpicker .colors li').removeClass('selected').eq(jQuery.cookie(cookieSchemeName)).addClass("selected");
    stylesheet.attr('href', prefix + '/scheme-' + jQuery.cookie(cookieSchemeName) + '.css');
}

/* User clicks on a color scheme */
jQuery('.colorpicker .colors button').on('click', function() {
    var parent = jQuery(this).parent();
    jQuery('.colorpicker .colors li').removeClass('selected');
    jQuery.cookie(cookieSchemeName, parent.index(), { path: '/' });
    parent.addClass('selected');
    stylesheet.attr('href', prefix + '/scheme-' + parent.index() + '.css');
});

/* =Layout (boxed/wide)
-------------------------------------------------------------- */

var cookieLayoutName = "anps_kataleya_layout";

/* Check if cookie exists and set it */
if(jQuery.cookie(cookieLayoutName)) {
    var el = jQuery("body");
    jQuery('.layout').val(jQuery.cookie(cookieLayoutName));
    if(jQuery.cookie(cookieLayoutName) == 'boxed') {
        el.addClass("boxed");

        if( !jQuery.cookie(cookieLayoutName) ) {
            el.addClass("pattern-1");
        }
    } else {
        el.removeClass("boxed");
    }
}

/* User changes layout */
jQuery(".layout").on("change", function() {
    jQuery("body").removeClass("boxed");
    var el = jQuery("body");
    if(jQuery(this).val() == 'boxed') {
        el.addClass("boxed");
        if( !el.hasClass("pattern-1") && 
            !el.hasClass("pattern-2") && 
            !el.hasClass("pattern-3") && 
            !el.hasClass("pattern-4") && 
            !el.hasClass("pattern-5") && 
            !el.hasClass("pattern-6") && 
            !el.hasClass("pattern-7") && 
            !el.hasClass("pattern-8") &&
            !el.hasClass("pattern-9") &&
            !el.hasClass("pattern-10")) {
            el.addClass("pattern-1");
        }
        jQuery.cookie(cookieLayoutName, jQuery(this).val(), { path: '/' });
    } else {
        el.removeClass("boxed");
        jQuery.cookie(cookieLayoutName, jQuery(this).val(), { path: '/' });
    }
});

/* =Pattern
-------------------------------------------------------------- */

var cookiePatternName = "anps_kataleya_pattern";

/* Check if cookie exists and set it */
if(jQuery.cookie(cookiePatternName)) {
    jQuery('.colorpicker .patterns li').removeClass('selected').eq(jQuery.cookie(cookiePatternName)-1).addClass("selected");
    jQuery('body').addClass('pattern-' + jQuery.cookie(cookiePatternName));
}

/* User clicks on pattern */
jQuery('.colorpicker .patterns button').on('click', function() {
    jQuery('body').removeClass('pattern-1 pattern-2 pattern-3 pattern-4 pattern-5 pattern-6 pattern-7 pattern-8 pattern-9 pattern-10');
    var parent = jQuery(this).parent();
    jQuery('.colorpicker .patterns li').removeClass('selected');
    jQuery.cookie(cookiePatternName, parent.index() + 1, { path: '/' });
    parent.addClass('selected');
     jQuery('body').addClass('pattern-' + (parent.index() + 1));
});

/* =Menu Style
-------------------------------------------------------------- */

var cookieMenuName = "anps_kataleya_menu";

/* Check if cookie exists and set it */
if(jQuery.cookie(cookieMenuName)) {
    var el = jQuery("body");
    jQuery(".menu-style").val(jQuery.cookie(cookieMenuName));
    if(jQuery.cookie(cookieMenuName) == 'sticky') {
        el.addClass("sticky-menu");
        sticky();
    } else {
        el.removeClass("sticky-menu");
    }
}

/* User changes menu style */
jQuery(".menu-style").on("change", function() {
    jQuery(".site-header").removeClass("sticky-menu");
    var el = jQuery("body");
    if(jQuery(this).val() == 'sticky') {
        el.addClass("sticky-menu");
        jQuery.cookie(cookieMenuName, jQuery(this).val(), { path: '/' });
        sticky();
    } else {
        el.removeClass("sticky-menu");
        jQuery.cookie(cookieMenuName, jQuery(this).val(), { path: '/' });
    }
});

/* =Open/Close colorpicker
-------------------------------------------------------------- */

jQuery('.colorpicker-close button').on('click', function() {
    jQuery('.colorpicker').removeClass('animate');
    jQuery('.colorpicker').toggleClass('active');

    var cookieVal = 'false';
    if( jQuery('.colorpicker').hasClass('active') ) {
        cookieVal = 'true';
    }

    jQuery.cookie("anps_kataleya_closed", cookieVal, { path: '/' });
});