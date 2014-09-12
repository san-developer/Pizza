jQuery(function($) {
	/* Order Menu */

	$('#order-search').searchFilter({ targetSelector: ".order-menu .food-item", charCount: 3});

	$('.close-order').on('click', function() {
		$('body').toggleClass('order-open');
		$('.order-menu-wrapper').toggleClass('active');

		if ('WebkitTransform' in document.body.style || 'MozTransform' in document.body.style || 'OTransform' in document.body.style || 'transform' in document.body.style) {} else {
		    $('.order-menu-wrapper').toggleClass('show-ie');
		}
	});

	$('.mobile-close').on('click', function(e) {
		$('.close-order').click();
	});

	$('.order-menu .quantity button').on('click', function() {
		var el = $(this).parent().children('.num');
		var parent = $(this).parent().parent().parent();
		var previousPrice = parseFloat($('.order-footer .price span').html().replace(',', '.'));
		var price = parseFloat($(this).parent().parent().children('.price').clone().children().remove().end().text().replace(',', '.'));
		var val = parseInt(el.html());

		if( $(this).hasClass('plus') ) {
			el.html(val + 1);
			$('.order-footer .price span, .order-review .price span').html((previousPrice + price).toFixed(1));
		} else {
			if( val > 0 ) {
				el.html(val - 1);
				$('.order-footer .price span, .order-review .price span').html((previousPrice - price).toFixed(1));
			} else {
				el.html('0');
			}
		}

		if( parseInt(el.html()) > 0 ) {
			parent.addClass('active');
		} else {
			parent.removeClass('active');
		}
	});

	$('button[data-menu-order="review"]').on('click', function() {
		$('.order-summary').html('');
		var vals = '';
		$('.order-menu .food-item.active').each(function(index) {
			var el = $('.order-menu .food-item.active').eq(index);
			if( vals != '' ) {
				vals += ';';
			}
			vals += el.attr('id') + ':' + el.find('.num').html();

			$('.order-summary').append('<li id="' + el.attr('id') + '"><h3><span class="pull-left">' + el.find('h3').html() + '</span><span class="pull-right color">×' + el.find('.num').html() + '</span></h3></li>');
		});

		$.cookie('kataleya-order', vals, { expires: 365, path: '/' });

		var notes = $('.order-menu .order-notes').val();
		if( notes ) {
			$.cookie('kataleya-order-notes', notes, { expires: 365, path: '/' });
			$('.order-review .order-notes').val(notes);
		}

		$('.order-header, .order-menu section, .order-footer, .order-review').toggleClass('hidden');
	});

	$('button[data-menu-order="notes"]').on('click', function() {
		$('.order-notes').toggleClass('hidden');
	});

	$('button[data-menu-order="back"]').on('click', function() {
		$('.order-header, .order-menu section, .order-footer, .order-review').toggleClass('hidden');
		return false;
		e.preventDefault();
	});

	if( $.cookie('kataleya-order') && $.cookie('kataleya-order') != 'null' ) {
		var vals = $.cookie('kataleya-order').split(';');
		var total = 0;

		$.each(vals, function(index) {
			var eachVal = vals[index].split(':');
			$('.order-menu #' + eachVal[0]).addClass('active').find('.num').html(eachVal[1]);

			total += parseInt(eachVal[1]) * parseFloat($('.order-menu #' + eachVal[0]).find('.price').clone().children().remove().end().text().replace(',', '.'));
		});

		$('.order-footer .price span, .order-review .price span').html(total.toFixed(1));
		if( total > 0 ) {
			$('.order-menu-wrapper').addClass('cookie-content');
		}
	}

	if( $.cookie('kataleya-order-notes') && $.cookie('kataleya-order-notes') != 'null' ) {
		var notes = $.cookie('kataleya-order-notes');
		$('.order-menu .order-notes').val(notes).removeClass('hidden');
	}

	/* Content Form */

	function setCustomer(vals) {
		var menuOrderCustomer = $('form[data-menu-order="customer"]');
		var formOrderCustomer = $('form[data-menu-order="content-form"]');

		$.each(vals, function(index) {
			var eachVal = vals[index].split(':');
			menuOrderCustomer.find('[name="' + eachVal[0] + '"]').val(eachVal[1]);
			formOrderCustomer.find('[name="' + eachVal[0] + '"]').val(eachVal[1]);
		});
	}

	$('button[data-menu-order="content-form-submit"]').on('click', function(e) {
		var vals = '';
		var menuOrderCustomer = $('form[data-menu-order="customer"]');
		$('form[data-menu-order="content-form"] input').each(function(index) {
			var el = $('form[data-menu-order="content-form"] input').eq(index);
			if( vals != '' ) {
				vals += ';';
			}
			vals += el.attr('name') + ':' + el.val();

			menuOrderCustomer.find('#order-' + el.attr('id')).val(el.val());
		});
		$('.close-order').click();
		$.cookie('kataleya-order-customer', vals, { expires: 365, path: '/' });
		setCustomer(vals.split(';'));
		return false;
		e.preventDefault();
	});

	/* Customer Cookie */

	if( $.cookie('kataleya-order-customer') ) {
		setCustomer($.cookie('kataleya-order-customer').split(';'));
	}

	/* Reservation */

	$('form[data-form="reservation"]').on('submit', function(e) {
		$(".contact-success").remove();

		var el = $(this);
      	var formData = el.serializeObject();

		try {
			$.ajax({
				type: "POST",
				url: $('#anps-restaurant-plugin-url').val() + '/ajax/reservation.php',
				data: {
			  		form_data : formData,
				}
			}).success(function(msg) {
				el.append('<div class="row"><div class="col-md-12"><div class="alert alert-success contact-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-check"></i>' + $(el).attr("data-success") + '</div></div></div>');
				$('.contact-success .close').on('click', function() {
					$(this).parent().remove();
				});
			});
		} catch(e) { console.log(e); }

		e.preventDefault();
		return false;
	});

	/* Order form submit */

	$('form[data-menu-order="customer"]').on('submit', function(e) {
		$(".contact-success").remove();
		var el = $(this);
      	var formData = el.serializeObject();

      	var orderItems = {  };

      	$('.order-summary li').each(function(index) {
      		var tempEl = $('.order-summary li').eq(index);
      		orderItems[tempEl.attr('id')] = tempEl.find('.pull-right').html().replace('×', '');
      	});

      	orderItems['TOTAL'] = $('.order-review .price span').html();

		try {
			$.ajax({
				type: "POST",
				url: $('#anps-restaurant-plugin-url').val() + '/ajax/order.php',
				data: {
			  		form_data 	: formData,
			  		order_items : orderItems
				}
			}).success(function(msg) {
				el.append('<div class="row"><div class="col-md-12"><div class="alert alert-success contact-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-check"></i>' + $(el).attr("data-success") + '</div></div></div>');
				$('.contact-success .close').on('click', function() {
					$(this).parent().remove();
				});
				$.cookie('kataleya-order', null, { path: '/' });
				$.cookie('kataleya-order-customer', null, { path: '/' });
				$.cookie('kataleya-order-notes', null, { path: '/' });
			});
		} catch(e) { console.log(e); }

		e.preventDefault();
		return false;
	});
})