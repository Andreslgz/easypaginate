/*
 * Easy Paginate
 * 
 * written by Alen Grakalic - http://cssglobe.com
 * adapted by Devi Mandiri - http://devi.web.id
 * 
 * Copyright (c) 2011 Alen Grakalic (http://cssglobe.com)
 * Dual licensed under the MIT and GPL.
 */
 
(function($){

	$.easyPaginate = function(el, options){

		var defaults = {
			step: 4,
			delay: 4000,
			numeric: true,
			nextprev: true,
			auto: false,
			clickstop: true,
			controls: "pagination",
			current: "current",
			container: "easy-paginate",
			prevContent: "Previous",
			nextContent: "Next",
			onClick: false,
			onSlide: false
		};

		var plugin = this;

		plugin.$el = $(el);

		plugin.$el.data("easyPaginate", plugin);

		var step, lower, upper,
			children = plugin.$el.children(),
			count = children.length,
			next, prev, page = 1,
			timer, clicked = false,
			activePage, _idx;

		var show = function(){
			lower = (page - 1) * step;
			upper = lower + step;

			_idx = 0;

			children.removeClass("current");

			children.hide().slice(lower, upper).show();

			activePage = children.not(":hidden");

			if (plugin.$el.find(".current").length < 1){
				activePage.eq(0).addClass("current");
			}

			if (plugin.options.nextprev){
				if (upper >= count){ next.hide(); } else { next.show(); }
				if (lower >= 1){ prev.show(); } else { prev.hide(); }
			}

			var o = plugin.$el.parent().find("." + plugin.options.controls);

			if (o.length > 0) {
				o.find("li").removeClass(plugin.options.current);
				o.find('li[data-index="' + page + '"]').addClass(plugin.options.current);
			}

			_slide();
		};

		var _slide = function(){
			clearTimeout(timer);

			if (plugin.options.auto){
				if (plugin.options.clickstop && clicked){} else {

					if (_idx >= activePage.length ){
						if (upper >= count){
							page = 1;
						} else {
							page++;
						}
						show();
					} else {
						if ($.isFunction(plugin.options.onSlide)){
							var el = plugin.$el.find(".current");
							if (el.length > 0){
								plugin.options.onSlide.apply(this, [el]);
							}
						}
						timer = setTimeout(function(){
							children.removeClass("current");
							activePage.eq(_idx + 1).addClass("current");
							_idx++;
							_slide();
						}, plugin.options.delay);
					}
				}
			}
		};

		plugin.pause = function(){
			clicked = false;
			plugin.options.auto = false;
			_slide();
		};

		plugin.slide = function(){
			plugin.options.auto = true;
			clicked = false;
			_slide();
		};

	plugin.test = function(){
		alert('test');
	};
	
		var init = function(){
			plugin.options = $.extend({}, defaults, options);

			plugin.$el.wrap('<div class="' + plugin.options.container + '" />');

			step = plugin.options.step;

			if (count > step){
				var pages = Math.floor(count / step);
				if((count/step) > pages) pages++;

				var ol = $('<ol class="' + plugin.options.controls + '"></ol>').insertAfter(plugin.$el);

				if (plugin.options.nextprev){
					prev = $('<li class="prev">' + plugin.options.prevContent + "</li>")
								.hide()
								.appendTo(ol)
								.click(function () {
									clicked = true;
									page--;
									show();
								});
				}

				if (plugin.options.numeric){
					for (var i = 1; i <= pages; i++){
						$('<li data-index="' + i + '">' + i + "</li>")
							.appendTo(ol)
							.click(function () {
								clicked = true;
								page = $(this).attr("data-index");
								show();
							});
					}
				}

				if (plugin.options.nextprev){
					next = $('<li class="next">' + plugin.options.nextContent + "</li>")
								.hide()
								.appendTo(ol)
								.click(function () {
									clicked = true;
									page++;
									show();
								});
				}

				if ($.isFunction(plugin.options.onClick)){
					children.click(function(){
						children.removeClass("current");
						$(this).addClass("current");
						_idx = children.not(":hidden").index(this);
						plugin.pause();
						plugin.options.onClick.apply(this, arguments);
					});
				}

				show();
			}
		};
		
		init();
	};

	$.fn.easyPaginate = function(options){
		return (undefined == $(this).data("easyPaginate"))
			? this.each(function(){
				(new $.easyPaginate(this, options));
			})
			: $(this).data("easyPaginate");
	};

})(jQuery);
