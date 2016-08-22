/*
 * @name Thumbnails generator for WowBook
 *
 * @author Marcio Aguiar
 * @version 1.0.0
 * @requires jQuery v1.7.0
 *
 * Copyright 2015- Marcio Aguiar. All rights reserved.
 *
 * To use this file you must to buy a license at http://codecanyon.net/user/maguiar01/portfolio
 *
 * Date: Wed Feb 20 10:05:49 2015 -0300
 */

;(function($) {

function stitchImages( images, width, height ){
	images = $(images);
	var canvas = $("<canvas>").prependTo("body")[0];
	canvas.width  = width;
	canvas.height = height*images.length;
	var ctx = canvas.getContext("2d");
	ctx.mozImageSmoothingEnabled = true;
	images.each(function( index ){
		console.log("stitching image ", index);
		var downsampled = downsample( this, width, height );
		ctx.drawImage( downsampled, 0, index*height);
	});

	return canvas;
} // stitchImages

function downsample( image, width, height ){
	var canvas = document.createElement('canvas'),
	    ctx = canvas.getContext('2d');
	var w = image.width, h = image.height;
	var sw = w, sh = h;
	canvas.width  = w;
	canvas.height = h;
	ctx.drawImage(image, 0, 0, w, h);

	while( w>width && h>height) {
		w=w/2;
		h=h/2;
		if (w<width) w=width;
		if (h<height) h=height;

		ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, w, h);
		sw = w, sh = h;
	}
	return canvas
} // downsample


// if width and height are set, use both
// if width < 1 = width is scale fator
// if width is set and height is not => height will be calculated keeping the aspect ratio
function createThumbnailsSprite( book, width, height ){
	var images = book.origin.find("img");
	    opts   = book.opts;
	console.log(images);

	if (!width || !height) {
		var scale;
		if ($.isNumeric(width) && width<1) { scale=width; width=undefined }
		if (!scale)  scale  = width/book.pageWidth || height/book.pageHeight || opts.thumbnailScale;
		// o Math.floor é pra ser compativel com wowbook no metodo thumbnailConfig
		if (!height) height = opts.thumbnailHeight || Math.floor( book.pageHeight*scale );
		if (!width)  width  = opts.thumbnailWidth || Math.floor( book.pageWidth*scale );
	}

	var canvas = stitchImages( images, width, height );
	return canvas;
} // createThumbnailsSprite

function loadAllPages( book, callback ) {
	var loadedPages = 0, total = book.pages.length;
	book.opts.pagesInMemory = null;

	book.opts.onLoadPage = function(book, page, pageindex){
		loadedPages += 1;
		$('#progress > .loaded').text( loadedPages );
		console.log("loaded page ",pageindex );
		if ( loadedPages!=total ) return;
		console.log("ALL PAGES LOADED");
		callback();
	}

	for(var i=0,l=book.pages.length;i<l;i++) {
		if ( !book.pages[i].loaded ) {
			console.log("loading page ",i);
			book.loadPage( i );
		} else {
			loadedPages += 1;
		}
	}
	$('#progress > .loaded').text( loadedPages );
	if ( loadedPages==total ) callback();
} // loadAllPages

function createUI(){
	var div = $("<div>").prependTo("body").css({
		background: "white",
		border:"1px solid black",
		position: "absolute",
		padding: "8px",
		zIndex: 1000000,
		top: 0,
		left: 0
	});
	var button = $("<button style='position: relative; top:0; left: 0'>Generate Thumbnails</button>");
	button.appendTo(div);
	$("<div id='progress' style='display: none;'><span class='loaded'>0</span> / <span class='total'></span> pages loaded</div>").appendTo(div);
	var anchor = $("<a download='thumbnails.png' style='display:block'>Click to download thumbnails</a>");
	button.click(function(){
		var book = $.wowBook( $(".wowbook") );
		$('#progress').css("display", "block").find(".total").text( book.pages.length );
		loadAllPages( book, function(){
			var canvas  = createThumbnailsSprite( book );
			var data    = canvas.toDataURL('image/png');
			anchor[0].href = data; // dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
			div.append(anchor).append(canvas);
		})
	});
	return
} // createUI

createUI();


})(jQuery);