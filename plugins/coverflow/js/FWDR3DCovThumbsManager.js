/* thumbs manager */
(function(window)
{
	var FWDR3DCovThumbsManager = function(data, parent)
	{
		var self = this;
		var prototype = FWDR3DCovThumbsManager.prototype;

		this.data = data;
		this.parent = parent;
		
		this.stageWidth = parent.stageWidth;
		this.stageHeight = parent.stageHeight;
		
		this.thumbsHolderDO;

		this.totalThumbs;
		this.thumbsAr = [];
		
		this.nrThumbsToDisplay = data.nrThumbsToDisplay;
		
		this.dataListId = data.startAtCategory;
		
		this.curDataListAr;
		
		this.dragCurId;
		this.prevCurId;
		this.curId;
		
		this.startPos = data.coverflowStartPosition;
		
		this.thumbWidth = data.thumbWidth;
		this.thumbHeight = data.thumbHeight;
		
		this.borderSize = data.thumbBorderSize;
		
		this.perspective = self.thumbWidth * 4;
		
		this.sizeRatio = self.thumbWidth / 200;
		
		this.countLoadedThumbsLeft;
		this.countLoadedThumbsRight;
		
		this.controlsDO;
		this.prevButtonDO;
		this.nextButtonDO;
		this.scrollbarDO;
		this.slideshowButtonDO;
		
		this.controlsHeight = self.data.nextButtonNImg.height;
		this.showText = self.data.showText;
		
		this.thumbXSpace3D = self.data.thumbXSpace3D;
		this.thumbXOffset3D = self.data.thumbXOffset3D;
		this.thumbZSpace3D = self.data.thumbZSpace3D;
		this.thumbZOffset3D = self.data.thumbZOffset3D;
		this.thumbYAngle3D = self.data.thumbYAngle3D;
		this.thumbXSpace2D = self.data.thumbXSpace2D;
		this.thumbXOffset2D = self.data.thumbXOffset2D;
		
		this.textDO;
		this.textHolderDO;
		this.textGradientDO;
		this.thumbOverDO;
		
		this.showRefl = data.showRefl;
		this.reflHeight = data.reflHeight;
		this.reflDist = data.reflDist;
		this.reflAlpha = data.reflAlpha;
		
		this.isThumbOver = false;
		this.hasThumbText = false;
		
		this.introFinished = false;
		this.isPlaying = false;
		this.disableThumbClick = false;
		this.isTextSet = false;
		this.allowToSwitchCat = false;
		
		this.showSlideshowButton = data.showSlideshowButton;
		
		this.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;
		this.isMobile = FWDR3DCovUtils.isMobile;

		this.loadWithDelayIdLeft;
		this.loadWithDelayIdRight;
		this.slideshowTimeoutId;
		this.textTimeoutId;
		this.zSortingId;
		this.hideThumbsFinishedId;
		this.loadHtmlContentsId;
		this.loadImagesId;
		this.setTextHeightId;
		this.setIntroFinishedId;
		this.showControlsId;

		/* init */
		this.init = function()
		{
			self.thumbsHolderDO = new FWDR3DCovDisplayObject3D("div", "absolute", "visible");
			self.addChild(self.thumbsHolderDO);
			
			self.thumbsHolderDO.setZ(100000);
			
			self.thumbsHolderDO.setPerspective(self.perspective);
			
			self.thumbsHolderDO.setX(Math.floor(self.stageWidth/2));
			
			if (self.data.controlsPos)
			{
				self.thumbsHolderDO.setY(Math.floor((self.stageHeight - self.data.prevButtonNImg.height)/2 + self.controlsHeight));
			}
			else
			{
				self.thumbsHolderDO.setY(Math.floor((self.stageHeight - self.data.prevButtonNImg.height)/2));
			}
			
			if ((!self.isMobile && !FWDR3DCovUtils.isSafari) || FWDR3DCovUtils.isAndroidAndWebkit)
			{
				self.thumbsHolderDO.setPreserve3D();
			}
			
			if (!self.isMobile)
			{
				if (self.screen.addEventListener)
				{
					window.addEventListener("mousemove", self.onThumbMove);
				}
				else
				{
					document.attachEvent("onmousemove", self.onThumbMove);
				}
			}
			
			if (self.hasPointerEvent)
			{
				window.addEventListener("MSPointerMove", self.onThumbMove);
			}
			
			self.showScrollbar = data.showScrollbar;
			self.showNextButton = data.showNextButton;
			self.showPrevButton = data.showPrevButton;
			
			if (self.isMobile)
			{
				if (data.disableScrollbarOnMobile)
				{
					self.showScrollbar = false;
				}
				
				if (data.disableNextAndPrevButtonsOnMobile)
				{
					self.showNextButton = false;
					self.showPrevButton = false;
				}	
			}
			
			if (self.showText)
			{
				self.setupText();
				
				if (self.isMobile)
				{
					self.setupThumbOver();
				}
			}
			
			self.showCurrentCat(-1);
			
			if (self.data.autoplay)
			{
				self.showSlideshowButton = true;
			}
			
			self.setupControls();
		};
		
		this.onThumbMove = function(e)
		{
			if (!self.textHolderDO)
				return;
			
			if (self.disableThumbClick)
				return;
			
			var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);
			
			self.thumbMouseX = viewportMouseCoordinates.screenX - parent.rect.left - (self.stageWidth - self.thumbWidth)/2;
			self.thumbMouseY = viewportMouseCoordinates.screenY - parent.rect.top - (self.stageHeight - data.prevButtonNImg.height - self.thumbHeight)/2;
			
			if (self.isTextSet)
			{
				if (self.isMobile)
				{
					self.checkThumbOver();
				}
				else
				{
					self.thumbsAr[self.curId].checkThumbOver();
				}
			}
		};
		
		//##############################################//
		/* show current cat */
		//##############################################//
		this.showCurrentCat = function(id)
		{
			if ((id != self.dataListId) && (id >= 0))
			{
				self.allowToSwitchCat = false;
				self.hideCurrentCat();
				self.dataListId = id;
				
				return;
			}
			
			self.thumbsAr = [];
			self.curDataListAr = self.data.dataListAr[self.dataListId];
			self.totalThumbs = self.curDataListAr.length;
			
			if (self.totalThumbs == 0)
			{
				var message = "This category doesn't contain any thumbnails!";

				self.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text : message});
				
				return;
			}
			
			if (self.isMobile)
			{
				 self.totalThumbs = Math.min(self.totalThumbs, data.maxNumberOfThumbsOnMobile);
			}
			
			if (typeof(self.startPos) == "number")
			{
				self.startPos = Math.floor(self.startPos) - 1;
				
				if (self.startPos < 0)
				{
					self.startPos = Math.floor((self.totalThumbs-1)/2);
				}
				else if (self.startPos > self.totalThumbs-1)
				{
					self.startPos = Math.floor((self.totalThumbs-1)/2);
				}
				
				self.curId = self.startPos;
			}
			else
			{
				switch (self.startPos)
				{
					case "left":
						self.curId = 0;
						break;
					case "right":
						self.curId = self.totalThumbs-1;
						break;
					default:
						self.curId = Math.floor((self.totalThumbs-1)/2);
				}
			}

			if (self.showScrollbar && self.scrollbarDO)
			{
				self.scrollbarDO.totalItems = self.totalThumbs;
				self.scrollbarDO.curItemId = self.curId;
				self.scrollbarDO.gotoItem2();
			}
			
			self.setupThumbs();
			
			self.prevCurId = self.curId;
			
			self.startIntro();
		};
		
		//################################################//
		/* hide current cat */
		//################################################//
		this.hideCurrentCat = function()
		{
			clearTimeout(self.loadWithDelayIdLeft);
			clearTimeout(self.loadWithDelayIdRight);
			clearTimeout(self.textTimeoutId);
			clearInterval(self.zSortingId);
			clearTimeout(self.hideThumbsFinishedId);
			clearTimeout(self.loadHtmlContentsId);
			clearTimeout(self.loadImagesId);
			clearTimeout(self.setTextHeightId);
			clearTimeout(self.setIntroFinishedId);
			clearTimeout(self.showControlsId);
			
			self.stopSlideshow();
			
			self.disableThumbClick = true;
			
			if (self.image)
			{
				self.image.onload = null;
				self.image.onerror = null;
			}
			
			if (self.imageLeft)
			{
				self.imageLeft.onload = null;
				self.imageLeft.onerror = null;
			}
			
			if (self.imageRight)
			{
				self.imageRight.onload = null;
				self.imageRight.onerror = null;
			}
			
			self.hideThumbs();
		};
		
		this.hideThumbs = function()
		{
			var delay;
			var delayDelta;
			var newX = -self.thumbWidth/2;
			var maxNrOfSideThumbs = Math.max(self.totalThumbs - self.curId, self.curId);
			
			if (self.nrThumbsToDisplay > 0)
			{
				delayDelta = Math.floor(1000/self.nrThumbsToDisplay);
			}
			else
			{
				delayDelta = Math.floor(1000/maxNrOfSideThumbs);
			}
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				if (i == self.curId)
				{
					if (self.nrThumbsToDisplay > 0)
					{
						self.hideThumbsFinishedId = setTimeout(self.hideThumbsFinished, 1000 + 500);
					}
					else
					{
						self.hideThumbsFinishedId = setTimeout(self.hideThumbsFinished, 1000 + 500);
					}
				}
				else if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
				{
					delay = Math.abs(self.nrThumbsToDisplay - Math.abs(i - self.curId) + 1) * delayDelta;
					FWDR3DCovModTweenMax.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
					thumb.hide((delay - 250)/1000);
				}
				else
				{
					delay = Math.abs(maxNrOfSideThumbs - Math.abs(i - self.curId) + 1) * delayDelta;
					FWDR3DCovModTweenMax.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
					thumb.hide((delay - 250)/1000);
				}
			}
		};
		
		this.hideThumbsFinished = function()
		{
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				if (i == self.curId)
				{
					thumb.hide(0);
					FWDR3DCovModTweenMax.to(thumb, .6, {alpha:0, delay:.2, onComplete:self.allThumbsAreTweened});
					
					if (self.isMobile && self.textHolderDO)
					{
						FWDR3DCovModTweenMax.to(self.textHolderDO, .6, {alpha:0, delay:.2, ease:Expo.easeOut});
						FWDR3DCovModTweenMax.to(self.textGradientDO, .6, {alpha:0, delay:.2, ease:Expo.easeOut});
					}
				}
				else
				{
					thumb.setAlpha(0);
				}
			}
		};
		
		this.allThumbsAreTweened = function()
		{
			self.destroyCurrentCat();
			self.showCurrentCat();
		};
		
		this.destroyCurrentCat = function()
		{
			var thumb;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				FWDR3DCovModTweenMax.killTweensOf(thumb);
				self.thumbsHolderDO.removeChild(thumb);
				thumb.destroy();
				thumb = null;
			}
		};
		
		this.startIntro = function()
		{
			self.disableThumbClick = true;
			
			thumb = self.thumbsAr[self.curId];
			
			var newX = -self.thumbWidth/2;
			var newY = -self.thumbHeight/2;
			
			thumb.setGradient(0);
			
			thumb.setX(Math.floor(newX));
			thumb.setY(Math.floor(newY));
			
			thumb.setAlpha(0);
			FWDR3DCovModTweenMax.to(thumb, .8, {alpha:1});
			
			self.thumbsHolderDO.addChild(thumb);
			
			if (self.data.showThumbnailsHtmlContent)
			{
				self.loadCenterHtmlContent();
				self.loadHtmlContentsId = setTimeout(self.loadHtmlContents, 600);
			}
			else
			{
				self.loadCenterImage();
				self.loadImagesId = setTimeout(self.loadImages, 600);
			}
		};

		/* setup thumbs */
		this.setupThumbs = function()
		{
			var thumb;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				FWDR3DCovThumb.setPrototype();
				
				thumb = new FWDR3DCovThumb(i, self.data, self);
				
				self.thumbsAr.push(thumb);
				
				thumb.addListener(FWDR3DCovThumb.CLICK, self.onThumbClick);
			}
		};
		
		this.onThumbClick = function(e)
		{
			if (self.disableThumbClick)
				return;
			
			self.curId = e.id;
			
			self.thumbClickHandler();
		};
		
		this.thumbClickHandler = function()
		{
			if (self.curId != self.prevCurId)
			{
				self.gotoThumb();
			}
			else
			{
				var type = self.curDataListAr[self.curId].mediaType;
				var tempId = self.curId;
				
				if (type == "none")
				{
					return;
				}
				
				if (type != "link")
				{
					for (var i=0; i<self.totalThumbs; i++)
					{
						if ((i < self.curId) && ((self.curDataListAr[i].mediaType == "link") || (self.curDataListAr[i].mediaType == "none")))
						{
							tempId -= 1;
						}
					};
				}
				
				if (type == "link")
				{
					window.open(self.curDataListAr[self.curId].secondObj.url, self.curDataListAr[self.curId].secondObj.target);
				}
				else
				{
					self.dispatchEvent(FWDR3DCovThumbsManager.THUMB_CLICK, {id:tempId});
				}
			}
		};
		
		this.resizeHandler = function()
		{
			if ((self.stageWidth == parent.stageWidth) && (self.stageHeight == parent.stageHeight))
					return;
			
			self.stageWidth = parent.stageWidth;
			self.stageHeight = parent.stageHeight;
			
			self.thumbsHolderDO.setX(Math.floor(self.stageWidth/2));
			self.thumbsHolderDO.setY(Math.floor(self.stageHeight/2 - self.data.prevButtonNImg.height/2));
			
			self.positionControls();
			
			if (self.textHolderDO && self.isMobile)
			{
				self.textHolderDO.setX(Math.floor((self.stageWidth - self.thumbWidth)/2) + self.borderSize);
				self.textHolderDO.setY(Math.floor((self.stageHeight - self.thumbHeight)/2 - self.data.prevButtonNImg.height/2) + self.borderSize);
			}
			
			if (self.thumbOverDO)
			{
				self.thumbOverDO.setX(Math.floor((self.stageWidth - self.thumbWidth)/2));
				self.thumbOverDO.setY(Math.floor((self.stageHeight - self.thumbHeight - self.data.prevButtonNImg.height)/2));
			}
		};
		
		this.setupText = function()
		{
			self.textHolderDO = new FWDR3DCovDisplayObject3D("div");
			self.addChild(self.textHolderDO);
			
			if (self.isMobile)
			{
				self.textHolderDO.setZ(200000);
			}
			
			self.textHolderDO.setWidth(self.thumbWidth - self.borderSize * 2);
			self.textHolderDO.setHeight(self.thumbHeight - self.borderSize * 2);
			
			if (self.isMobile)
			{
				self.textHolderDO.setX(Math.floor((self.stageWidth - self.thumbWidth)/2) + self.borderSize);
				self.textHolderDO.setY(Math.floor((self.stageHeight - self.thumbHeight - self.data.prevButtonNImg.height)/2) + self.borderSize);
			}
			else
			{
				self.textHolderDO.setX(-1000);
			}
			
			if (self.data.showTextBackgroundImage)
			{
				self.textGradientDO = new FWDR3DCovSimpleDisplayObject("img");
				self.textHolderDO.addChild(self.textGradientDO);
				
				self.textGradientDO.setWidth(self.thumbWidth - self.borderSize * 2);
				self.textGradientDO.setHeight(self.thumbHeight - self.borderSize * 2);
				
				self.textGradientDO.screen.src = data.thumbTitleGradientPath;
			}
			else
			{
				self.textGradientDO = new FWDR3DCovSimpleDisplayObject("div");
				self.textHolderDO.addChild(self.textGradientDO);
				
				self.textGradientDO.setWidth(self.thumbWidth - self.borderSize * 2);
				self.textGradientDO.setHeight(self.thumbHeight - self.borderSize * 2);
				
				self.textGradientDO.setBkColor(self.data.textBackgroundColor);
				self.textGradientDO.setAlpha(self.data.textBackgroundOpacity);
			}
			
			self.textDO = new FWDR3DCovSimpleDisplayObject("div");
			self.textHolderDO.addChild(self.textDO);
			
			self.textDO.setWidth(self.thumbWidth - self.borderSize * 2);
			
			self.textDO.getStyle().fontSmoothing = "antialiased";
			self.textDO.getStyle().webkitFontSmoothing = "antialiased";
			self.textDO.getStyle().textRendering = "optimizeLegibility";
		};
		
		this.setupThumbOver = function()
		{
			self.thumbOverDO = new FWDR3DCovDisplayObject("div");
			self.addChild(self.thumbOverDO);
			
			if (!self.isMobile)
			{
				self.thumbOverDO.setButtonMode(true);
			}
			
			if (FWDR3DCovUtils.isIE)
			{
				self.thumbOverDO.setBkColor("#000000");
				self.thumbOverDO.setAlpha(.001);
			}
			
			self.thumbOverDO.setWidth(self.thumbWidth);
			self.thumbOverDO.setHeight(self.thumbHeight);
			
			self.thumbOverDO.setX(Math.floor((self.stageWidth - self.thumbWidth)/2));
			self.thumbOverDO.setY(Math.floor((self.stageHeight - self.thumbHeight - self.data.prevButtonNImg.height)/2));
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.thumbOverDO.screen.addEventListener("MSPointerUp", self.onThumbOverTouch);
				}
				else
				{
					self.thumbOverDO.screen.addEventListener("touchend", self.onThumbOverTouch);
				}
			}
			else
			{
				if (self.screen.addEventListener)
				{
					self.thumbOverDO.screen.addEventListener("click", self.onThumbOverClick);
				}
				else
				{
					self.thumbOverDO.screen.attachEvent("onclick", self.onThumbOverClick);
				}
			}
		};
		
		this.onThumbOverClick = function()
		{
			if (self.disableThumbClick)
				return;
			
			self.thumbClickHandler();
		};
		
		this.onThumbOverTouch = function(e)
		{
			if(e.preventDefault) e.preventDefault();
			
			if (self.disableThumbClick)
				return;
			
			self.thumbClickHandler();
		};
		
		this.addThumbText = function()
		{
			self.textHolderDO.setY(Math.floor((self.stageHeight - self.thumbHeight - self.data.prevButtonNImg.height)/2) + self.borderSize);

			self.textDO.setInnerHTML(self.curDataListAr[self.curId].thumbText);
			
			self.textTitleOffset = self.curDataListAr[self.curId].textTitleOffset;
			self.textDescriptionOffsetTop = self.curDataListAr[self.curId].textDescriptionOffsetTop;
			self.textDescriptionOffsetBottom = self.curDataListAr[self.curId].textDescriptionOffsetBottom;
			
			self.textGradientDO.setY(self.thumbHeight - self.borderSize * 2 - self.textTitleOffset);
			self.textDO.setY(self.thumbHeight - self.borderSize * 2 - self.textTitleOffset + self.textDescriptionOffsetTop);
			
			self.textHolderDO.setAlpha(0);
	
			self.setTextHeightId = setTimeout(self.setTextHeight, 10);
		};
	
		this.setTextHeight = function()
		{	
			self.textHeight = self.textDO.getHeight();
			
			FWDR3DCovModTweenMax.to(self.textHolderDO, .8, {alpha:1, ease:Expo.easeOut});
			FWDR3DCovModTweenMax.to(self.textGradientDO, .8, {alpha:1, ease:Expo.easeOut});
			
			self.hasThumbText = true;
			
			self.checkThumbOver();
		};
		
		this.removeThumbText = function()
		{
			if (self.isMobile)
			{
				self.removeTextFinish();
			}
			else
			{
				FWDR3DCovModTweenMax.to(self.textHolderDO, .6, {alpha:0, ease:Expo.easeOut, onComplete:self.removeTextFinish});
			}
		};
		
		this.removeTextFinish = function()
		{
			FWDR3DCovModTweenMax.killTweensOf(self.textHolderDO);
			FWDR3DCovModTweenMax.killTweensOf(self.textGradientDO);
			FWDR3DCovModTweenMax.killTweensOf(self.textDO);
			
			self.hasThumbText = false;
			self.isThumbOver = false;
			
			self.textHolderDO.setY(2000);
		};
		
		this.checkThumbOver = function()
		{
			if (!self.hasThumbText)
				return;
			
			if ((self.thumbMouseX >= 0) && (self.thumbMouseX <= self.thumbWidth) && (self.thumbMouseY >= 0) && (self.thumbMouseY <= self.thumbHeight))
			{
				self.onThumbOverHandler();
			}
			else
			{
				self.onThumbOutHandler();
			}
		};
		
		this.onThumbOverHandler = function()
		{
			if (!self.isThumbOver)
			{
				self.isThumbOver = true;
				
				FWDR3DCovModTweenMax.to(self.textGradientDO, .8, {y:self.thumbHeight - self.borderSize * 2 - self.textDescriptionOffsetTop - self.textHeight - self.textDescriptionOffsetBottom, ease:Expo.easeOut});
				FWDR3DCovModTweenMax.to(self.textDO, .8, {y:self.thumbHeight - self.borderSize * 2 - self.textHeight - self.textDescriptionOffsetBottom, ease:Expo.easeOut});
			}
		};

		this.onThumbOutHandler = function()
		{
			if (self.isThumbOver)
			{
				self.isThumbOver = false;
				
				FWDR3DCovModTweenMax.to(self.textGradientDO, .8, {y:self.thumbHeight - self.borderSize * 2 - self.textTitleOffset, ease:Expo.easeOut});
				FWDR3DCovModTweenMax.to(self.textDO, .8, {y:self.thumbHeight - self.borderSize * 2 - self.textTitleOffset + self.textDescriptionOffsetTop, ease:Expo.easeOut});
			}
		};
		
		this.loadImages = function()
		{
			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{	
				self.setupIntro3D();
			}
			else
			{
				self.setupIntro2D();
			}
			
			self.countLoadedThumbsLeft = self.curId - 1;
			self.loadWithDelayIdLeft = setTimeout(self.loadThumbImageLeft, 100);
			
			self.countLoadedThumbsRight = self.curId + 1;
			self.loadWithDelayIdRight = setTimeout(self.loadThumbImageRight, 100);
		};
		
		this.loadCenterImage = function()
		{
			self.imagePath = self.curDataListAr[self.curId].thumbPath;

			self.image = new Image();
			self.image.onerror = self.onImageLoadErrorHandler;
			self.image.onload = self.onImageLoadHandlerCenter;
			self.image.src = self.imagePath;
		};
		
		this.onImageLoadHandlerCenter = function(e)
		{
			var thumb = self.thumbsAr[self.curId];
			
			thumb.addImage(self.image);
			
			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			if (self.showText)
			{
				self.isTextSet = true;
				
				if (self.isMobile)
				{
					self.addThumbText();
				}
				else
				{
					thumb.addText(self.textHolderDO, self.textGradientDO, self.textDO);
				}
			}
		};

		this.loadThumbImageLeft = function()
		{
			if (self.countLoadedThumbsLeft < 0)
					return;
			
			self.imagePath = self.curDataListAr[self.countLoadedThumbsLeft].thumbPath;

			self.imageLeft = new Image();
			self.imageLeft.onerror = self.onImageLoadErrorHandler;
			self.imageLeft.onload = self.onImageLoadHandlerLeft;
			self.imageLeft.src = self.imagePath;
		};

		this.onImageLoadHandlerLeft = function(e)
		{
			var thumb = self.thumbsAr[self.countLoadedThumbsLeft];

			thumb.addImage(self.imageLeft);
			
			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			self.countLoadedThumbsLeft--;
			
			self.loadWithDelayIdLeft = setTimeout(self.loadThumbImageLeft, 200);
		};
		
		this.loadThumbImageRight = function()
		{
			if (self.countLoadedThumbsRight > self.totalThumbs-1)
				return;
			
			self.imagePath = self.curDataListAr[self.countLoadedThumbsRight].thumbPath;

			self.imageRight = new Image();
			self.imageRight.onerror = self.onImageLoadErrorHandler;
			self.imageRight.onload = self.onImageLoadHandlerRight;
			self.imageRight.src = self.imagePath;
		};

		this.onImageLoadHandlerRight = function(e)
		{
			var thumb = self.thumbsAr[self.countLoadedThumbsRight];

			thumb.addImage(self.imageRight);

			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			self.countLoadedThumbsRight++;
			
			self.loadWithDelayIdRight = setTimeout(self.loadThumbImageRight, 200);
		};

		this.onImageLoadErrorHandler = function(e)
		{
			if (!self || !self.data)
				return;

			var message = "Thumb can't be loaded, probably the path is incorrect <font color='#FFFFFF'>" + self.imagePath + "</font>";

			self.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text : message});
		};
		
		this.loadHtmlContents = function()
		{
			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{	
				self.setupIntro3D();
			}
			else
			{
				self.setupIntro2D();
			}
			
			self.countLoadedThumbsLeft = self.curId - 1;
			self.loadWithDelayIdLeft = setTimeout(self.loadThumbHtmlContentLeft, 100);
			
			self.countLoadedThumbsRight = self.curId + 1;
			self.loadWithDelayIdRight = setTimeout(self.loadThumbHtmlContentRight, 100);
		};
		
		this.loadCenterHtmlContent = function()
		{
			var thumb = self.thumbsAr[self.curId];

			thumb.addHtmlContent();
			
			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			if (self.showText)
			{
				self.isTextSet = true;
				
				if (self.isMobile)
				{
					self.addThumbText();
				}
				else
				{
					thumb.addText(self.textHolderDO, self.textGradientDO, self.textDO);
				}
			}
		};

		this.loadThumbHtmlContentLeft = function()
		{
			if (self.countLoadedThumbsLeft < 0)
					return;
			
			var thumb = self.thumbsAr[self.countLoadedThumbsLeft];

			thumb.addHtmlContent();
			
			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			self.countLoadedThumbsLeft--;
			
			self.loadWithDelayIdLeft = setTimeout(self.loadThumbHtmlContentLeft, 200);
		};

		this.loadThumbHtmlContentRight = function()
		{
			if (self.countLoadedThumbsRight > self.totalThumbs-1)
				return;
			
			var thumb = self.thumbsAr[self.countLoadedThumbsRight];

			thumb.addHtmlContent();

			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			self.countLoadedThumbsRight++;
			
			self.loadWithDelayIdRight = setTimeout(self.loadThumbHtmlContentRight, 200);
		};
		
		this.setupIntro3D = function()
		{
			var newX;
			var newY;
			var newZ;
			
			var newAngleY;
			
			var delay;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = -Math.floor(self.thumbWidth/2);
				newY = -Math.floor(self.thumbHeight/2);
				
				thumb.setX(Math.floor(newX));
				thumb.setY(Math.floor(newY));
				
				newX = 0;
				newY = 0;
				newZ = 0;

				newAngleY = 0;
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				if (i != self.curId)
				{
					if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
					{
						newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
						newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
						newAngleY = -self.thumbYAngle3D * sgn;
						
						newX *= self.sizeRatio;
						newZ *= self.sizeRatio;
						
						var ratio = self.thumbHeight / self.thumbWidth;
						
						if (ratio > 0.7)
						{
							newX *= Math.min(1/ratio, 0.8);
						}
						
						newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
						newY = Math.floor(newY) - Math.floor(self.thumbHeight/2);
						
						thumb.setZ(newZ - Math.abs(i - self.curId) * 100);
						
						delay = Math.abs(i - self.curId) * Math.floor(1000/self.nrThumbsToDisplay);
						
						if (FWDR3DCovUtils.isIEAndMoreThen9)
						{
							FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, delay:delay/1000, ease:Quart.easeOut});
							thumb.setZIndex(self.nrThumbsToDisplay + 1 - Math.abs(i - self.curId));
						}
						else
						{
							FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, angleX:.1, delay:delay/1000, ease:Quart.easeOut});
						}
					}
					else
					{
						if (self.nrThumbsToDisplay > 0)
						{
							newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * sgn;
							newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
							newAngleY = -self.thumbYAngle3D * sgn;
							
							thumb.setAlpha(0);
							
							if (FWDR3DCovUtils.isIEAndMoreThen9)
							{
								thumb.setZIndex(0);
							}
							
							thumb.disable();
						}
						else
						{
							newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
							newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
							newAngleY = -self.thumbYAngle3D * sgn;
							
							if (FWDR3DCovUtils.isIEAndMoreThen9)
							{
								thumb.setZIndex(Math.floor(self.totalThumbs/2) - Math.abs(i - self.curId));
							}
						}
						
						newX *= self.sizeRatio;
						newZ *= self.sizeRatio;
						
						var ratio = self.thumbHeight / self.thumbWidth;
						
						if (ratio > 0.7)
						{
							newX *= Math.min(1/ratio, 0.8);
						}
						
						newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
						newY = Math.floor(newY) - Math.floor(self.thumbHeight/2);
						
						if (self.nrThumbsToDisplay > 0)
						{
							thumb.setX(Math.floor(newX));
							thumb.setY(Math.floor(newY));
							thumb.setZ(Math.floor(newZ));
							
							thumb.setAngleY(newAngleY);
						}
						else
						{
							thumb.setZ(Math.floor(newZ));
							
							delay = Math.abs(i - self.curId) * Math.floor(1000/(self.totalThumbs/2));
							if (FWDR3DCovUtils.isIEAndMoreThen9)
							{
								FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, delay:delay/1000, ease:Quart.easeOut});
							}
							else
							{
								FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, angleX:.1, delay:delay/1000, ease:Quart.easeOut});
							}
						}
					}
				}
				else
				{
					if (FWDR3DCovUtils.isIEAndMoreThen9)
					{
						if (self.nrThumbsToDisplay > 0)
						{
							thumb.setZIndex(self.nrThumbsToDisplay + 1);
						}
						else
						{
							thumb.setZIndex(Math.floor(self.totalThumbs/2));
						}
					}
				}
				
				thumb.setGradient(sgn);	
				thumb.curZ = Math.floor(newZ);	
				
				self.thumbsHolderDO.addChild(thumb);
			}
			
			self.setIntroFinishedId = setTimeout(self.setIntroFinished, delay + 800);
			self.showControlsId = setTimeout(self.showControls, delay);
		};
		
		this.setupIntro2D = function()
		{
			var newX;
			var newScale;
			var delay;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = 0;

				newScale = 1;
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				if ((self.nrThumbsToDisplay <= 0) || (self.nrThumbsToDisplay > 13))
				{
					self.nrThumbsToDisplay = 13;
				}
				
				if (i != self.curId)
				{
					if ((Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
					{
						newX = (self.thumbXSpace2D * Math.abs(i - self.curId) + self.thumbXOffset2D) * sgn;
						newScale = Math.max(.9 - Math.abs(i - self.curId) * .05, .25);
						
						newX *= self.sizeRatio;
						
						var ratio = self.thumbHeight / self.thumbWidth;
						
						if (ratio > 0.7)
						{
							newX *= Math.min(1/ratio, 0.8);
						}
						
						newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
						
						delay = Math.abs(i - self.curId) * Math.floor(1000/self.nrThumbsToDisplay);
						
						thumb.newX = Math.floor(newX);
						thumb.showThumbIntro2D(newScale, delay/1000);
						
						thumb.setZIndex(self.nrThumbsToDisplay + 1 - Math.abs(i - self.curId));
					}
					else
					{
						newX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * sgn;
						newScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);	
						
						newX *= self.sizeRatio;
						
						var ratio = self.thumbHeight / self.thumbWidth;
						
						if (ratio > 0.7)
						{
							newX *= Math.min(1/ratio, 0.8);
						}
						
						newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
						
						thumb.newX = Math.floor(newX);
						
						thumb.setAlpha(0);
						thumb.setZIndex(0);
						thumb.disable();
						
						thumb.showThumbIntro2D(newScale, 0);
					}
				}
				else
				{
					thumb.setZIndex(self.nrThumbsToDisplay + 1);
				}
				
				thumb.setGradient(sgn);	
				
				self.thumbsHolderDO.addChild(thumb);
			}
			
			self.setIntroFinishedId = setTimeout(self.setIntroFinished, delay + 800);
			self.showControlsId = setTimeout(self.showControls, delay);
		};
		
		this.setIntroFinished = function()
		{
			self.introFinished = true;
			self.allowToSwitchCat = true;
			self.disableThumbClick = false;
			
			self.dispatchEvent(FWDR3DCovThumbsManager.THUMBS_INTRO_FINISH);
			
			if (self.isMobile)
			{
				self.setupMobileDrag();
			}
			
			if (FWDR3DCovUtils.isIEAndMoreThen9 || !FWDR3DCovUtils.hasTransform3d || self.data.showDisplay2DAlways)
			{
				self.zSortingId = setInterval(self.sortZ, 16);
			}
			
			if (self.data.autoplay)
			{
				if (self.slideshowButtonDO)
				{
					self.slideshowButtonDO.onClick();
					self.slideshowButtonDO.onMouseOut();
				}
			}
		};
		
		this.gotoThumb = function()
		{
			if (!self.introFinished)
				return;

			if (self.showScrollbar && !self.scrollbarDO.isPressed)
			{
				self.scrollbarDO.gotoItem(self.curId, true);
			}

			if (self.isPlaying)
			{
				clearTimeout(self.slideshowTimeoutId);
				self.slideshowTimeoutId = setTimeout(self.startTimeAgain, self.data.transitionDelay);
				
				if (self.slideshowButtonDO.isCounting)
				{
					self.slideshowButtonDO.resetCounter();
				}
			}
			
			if (self.showText)
			{
				if (self.isTextSet)
				{
					self.isTextSet = false;
					
					if (self.isMobile)
					{
						self.removeThumbText();
					}
					else
					{
						 self.thumbsAr[self.prevCurId].removeText();
					}
					
					clearTimeout(self.textTimeoutId);
					self.textTimeoutId = setTimeout(self.setThumbText, 800);
				}
				else
				{
					clearTimeout(self.textTimeoutId);
					self.textTimeoutId = setTimeout(self.setThumbText, 800);
				}
			}
			
			self.prevCurId = self.curId;

			if (FWDR3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{	
				self.gotoThumb3D();
			}
			else
			{
				self.gotoThumb2D();
			}
			
			self.dispatchEvent(FWDR3DCovThumbsManager.THUMB_CHANGE, {id:self.curId});
		};
		
		this.setThumbText = function()
		{
			self.isTextSet = true;
			
			if (self.isMobile)
			{
				self.addThumbText();
			}
			else
			{
				self.thumbsAr[self.curId].addText(self.textHolderDO, self.textGradientDO, self.textDO);
			}
		};
		
		this.gotoThumb3D = function()
		{
			var newX;
			var newY;
			var newZ;
			
			var newAngleY;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = 0;
				newY = 0;
				newZ = 0;
				
				newAngleX = 0;
				newAngleY = 0;
				newAngleZ = 0;
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				if (i != self.curId)
				{
					if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
					{
						newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
						newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
						newAngleY = -self.thumbYAngle3D * sgn;	
					}
					else
					{
						if (self.nrThumbsToDisplay > 0)
						{
							newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * sgn;
							newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
							newAngleY = -self.thumbYAngle3D * sgn;
						}
						else
						{
							newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
							newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
							newAngleY = -self.thumbYAngle3D * sgn;
						}
					}
				}
				
				newX *= self.sizeRatio;
				newZ *= self.sizeRatio;
				
				var ratio = self.thumbHeight / self.thumbWidth;
				
				if (ratio > 0.7)
				{
					newX *= Math.min(1/ratio, 0.8);
				}
				
				newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
				newY = Math.floor(newY) - Math.floor(self.thumbHeight/2);
				
				if (Math.abs(thumb.curX) != Math.floor(self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D))
				{
					FWDR3DCovModTweenMax.killTweensOf(thumb);
					
					if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
					{
						if (FWDR3DCovUtils.isIEAndMoreThen9)
						{
							FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, alpha:1, ease:Quart.easeOut});
						}
						else
						{
							FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, angleX:.1, alpha:1, ease:Quart.easeOut});
						}
						
						thumb.enable();
					}
					else
					{
						if (self.nrThumbsToDisplay > 0)
						{
							if (FWDR3DCovUtils.isIEAndMoreThen9)
							{
								FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, alpha:0, ease:Quart.easeOut});
							}
							else
							{
								FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, angleX:.1, alpha:0, ease:Quart.easeOut});
							}
							
							thumb.disable();
						}
						else
						{
							if (FWDR3DCovUtils.isIEAndMoreThen9)
							{
								FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, alpha:1, ease:Quart.easeOut});
							}
							else
							{
								FWDR3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleY:newAngleY, angleX:.1, alpha:1, ease:Quart.easeOut});
							}
							
							thumb.enable();
						}
					}			
				}
				
				thumb.curX = Math.floor(newX);
				thumb.curZ = Math.floor(newZ);
				thumb.setGradient(sgn);
			}
		};
		
		this.gotoThumb2D = function()
		{
			var newX;
			var newScale;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = 0;

				newScale = 1;
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				if ((self.nrThumbsToDisplay <= 0) || (self.nrThumbsToDisplay > 13))
				{
					self.nrThumbsToDisplay = 13;
				}
				
				if ((Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
				{
					if (i != self.curId)
					{
						newScale = Math.max(.9 - Math.abs(i - self.curId) * .05, .25);
						newX = (self.thumbXSpace2D * Math.abs(i - self.curId) + self.thumbXOffset2D) * sgn;
						
						newX *= self.sizeRatio;
						
						var ratio = self.thumbHeight / self.thumbWidth;
						
						if (ratio > 0.7)
						{
							newX *= Math.min(1/ratio, 0.8);
						}
						
						newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
						
						thumb.newX = Math.floor(newX);
						thumb.setScale(newScale, 1);
						
						thumb.enable();
					}
					else
					{
						newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
						
						thumb.newX = Math.floor(newX);
						thumb.setScale(newScale, 1);
						
						thumb.enable();
					}
				}
				else
				{
					newX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * sgn;
					newScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);
					
					thumb.setScale(newScale);
					
					newX *= self.sizeRatio;
					
					var ratio = self.thumbHeight / self.thumbWidth;
					
					if (ratio > 0.7)
					{
						newX *= Math.min(1/ratio, 0.8);
					}
					
					newX = Math.floor(newX) - Math.floor(self.thumbWidth/2);
					
					thumb.newX = Math.floor(newX);
					thumb.setScale(newScale, 0);
					
					thumb.disable();
				}
				
				thumb.setGradient(sgn);
			}
		};
		
		this.sortZ = function()
		{
			var minX = 10000;
			var centerId;
			var zIndex;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				var tx = thumb.getX() + self.thumbWidth/2;
				
				if (Math.abs(tx) < minX)
				{
					minX = Math.abs(tx);
					centerId = i;
				}
			}
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				if (self.nrThumbsToDisplay > 0)
				{
					if (Math.abs(i - centerId) <= self.nrThumbsToDisplay)
					{
						zIndex = self.nrThumbsToDisplay + 1 - Math.abs(i - centerId);
					}
					else
					{
						zIndex = 0;
					}
				}
				else
				{
					zIndex = Math.floor(self.totalThumbs/2) - Math.abs(i - centerId);
				}
				
				if (zIndex != thumb.getZIndex())
				{
					thumb.setZIndex(zIndex);
				}
			}
		};
		
		this.setupControls = function()
		{
			self.controlsDO = new FWDR3DCovDisplayObject3D("div");
			self.addChild(self.controlsDO);
			
			self.controlsDO.setZ(200000);
			
			self.controlsWidth = self.data.prevButtonNImg.width;
			
			if (self.showScrollbar)
			{
				self.setupScrollbar();
			}
			
			if (self.showPrevButton)
			{
				self.setupPrevButton();
			}
			
			if (self.showNextButton)
			{
				self.setupNextButton();
			}
			
			if (self.showSlideshowButton)
			{
				self.setupSlideshowButton();
			}
			
			if (self.data.enableMouseWheelScroll)
			{
				self.addMouseWheelSupport();
			}
			
			if (self.data.addKeyboardSupport)
			{
				self.addKeyboardSupport();
			}

			if (self.showScrollbar)
			{
				self.controlsWidth -= self.scrollbarDO.getWidth();
				self.scrollbarDO.scrollbarMaxWidth -=  self.controlsWidth;
				self.scrollbarDO.resize2();
				self.scrollbarDO.resize(self.stageWidth, self.controlsWidth);
				
				var newX = self.scrollbarDO.getX() + self.scrollbarDO.getWidth();

				if (self.showNextButton)
				{
					self.nextButtonDO.setX(newX);
					
					newX += self.nextButtonDO.getWidth();
				}
				
				if (self.showSlideshowButton)
				{
					self.slideshowButtonDO.setX(newX);
				}
			}
			
			if (self.showScrollbar)
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - (self.controlsWidth + self.scrollbarDO.getWidth()))/2));
				self.controlsDO.setWidth(self.controlsWidth + self.scrollbarDO.getWidth());
			}
			else
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - self.controlsWidth)/2));
				self.controlsDO.setWidth(self.controlsWidth);
			}
			
			if (self.data.controlsPos)
			{
				self.controlsDO.setY(-self.controlsHeight);
			}
			else
			{
				self.controlsDO.setY(self.stageHeight);
			}
			
			self.controlsDO.setHeight(self.data.prevButtonNImg.height);
		};
		
		this.showControls = function()
		{
			if (self.data.controlsPos)
			{
				FWDR3DCovModTweenMax.to(self.controlsDO, .8, {y:0, ease : Expo.easeOut});
			}
			else
			{
				FWDR3DCovModTweenMax.to(self.controlsDO, .8, {y:self.stageHeight - self.controlsHeight, ease : Expo.easeOut});
			}
		};
		
		this.positionControls = function()
		{
			if (self.showScrollbar)
			{
				self.scrollbarDO.resize(self.stageWidth, self.controlsWidth);
				
				var newX = self.scrollbarDO.getX() + self.scrollbarDO.getWidth();

				if (self.showNextButton)
				{
					self.nextButtonDO.setX(newX);
					
					newX += self.nextButtonDO.getWidth();
				}
				
				if (self.showSlideshowButton)
				{
					self.slideshowButtonDO.setX(newX);
				}
			}

			if (self.showScrollbar)
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - (self.controlsWidth + self.scrollbarDO.getWidth()))/2));
				self.controlsDO.setWidth(self.controlsWidth + self.scrollbarDO.getWidth());
			}
			else
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - self.controlsWidth)/2));
				self.controlsDO.setWidth(self.controlsWidth);
			}
			
			if (!self.data.controlsPos)
			{
				self.controlsDO.setY(self.stageHeight - self.controlsHeight);
			}
		};
		
		this.setupPrevButton = function()
		{
			FWDR3DCovSimpleButton.setPrototype();
			
			self.prevButtonDO = new FWDR3DCovSimpleButton(self.data.prevButtonNImg, self.data.prevButtonSImg);
			self.prevButtonDO.addListener(FWDR3DCovSimpleButton.CLICK, self.prevButtonOnClickHandler);
			self.controlsDO.addChild(self.prevButtonDO);
		};
		
		this.prevButtonOnClickHandler = function()
		{
			if (self.curId > 0)
			{
				self.curId--;
				self.gotoThumb();
			}
		};
		
		this.setupNextButton = function()
		{
			FWDR3DCovSimpleButton.setPrototype();
			
			self.nextButtonDO = new FWDR3DCovSimpleButton(self.data.nextButtonNImg, self.data.nextButtonSImg);
			self.nextButtonDO.addListener(FWDR3DCovSimpleButton.CLICK, self.nextButtonOnClickHandler);
			self.controlsDO.addChild(self.nextButtonDO);
			
			self.nextButtonDO.setX(self.controlsWidth);
			self.controlsWidth += self.nextButtonDO.getWidth();
		};
		
		this.nextButtonOnClickHandler = function()
		{
			if (self.curId < self.totalThumbs-1)
			{
				self.curId++;
				self.gotoThumb();
			}
		};
		
		this.setupSlideshowButton = function()
		{
			FWDR3DCovSlideshowButton.setPrototype();
			
			self.slideshowButtonDO = new FWDR3DCovSlideshowButton(self.data);
			self.slideshowButtonDO.addListener(FWDR3DCovSlideshowButton.PLAY_CLICK, self.onSlideshowButtonPlayClickHandler);
			self.slideshowButtonDO.addListener(FWDR3DCovSlideshowButton.PAUSE_CLICK, self.onSlideshowButtonPauseClickHandler);
			self.slideshowButtonDO.addListener(FWDR3DCovSlideshowButton.TIME, self.onSlideshowButtonTime);
			self.controlsDO.addChild(self.slideshowButtonDO);
			
			self.slideshowButtonDO.setX(self.controlsWidth);
			self.controlsWidth += self.slideshowButtonDO.getWidth();
			
			if (self.data.autoplay && self.showSlideshowButton)
			{
				self.slideshowButtonDO.setVisible(false);
			}
		};
		
		this.onSlideshowButtonPlayClickHandler = function()
		{
			self.isPlaying = true;
		};
		
		this.onSlideshowButtonPauseClickHandler = function()
		{
			self.isPlaying = false;
			clearTimeout(self.slideshowTimeoutId);
		};
		
		this.startSlideshow = function()
		{
			if (!self.isPlaying)
			{
				self.isPlaying = true;
				
				self.slideshowButtonDO.start();
				self.slideshowButtonDO.onMouseOut();
			}
		};
		
		this.stopSlideshow = function()
		{
			if (self.isPlaying)
			{
				self.isPlaying = false;
				clearTimeout(self.slideshowTimeoutId);
				
				self.slideshowButtonDO.stop();
				self.slideshowButtonDO.onMouseOut();
			}
		};
		
		this.onSlideshowButtonTime = function()
		{
			if (self.curId == self.totalThumbs-1)
			{
				self.curId = 0;
			}
			else
			{
				self.curId++;
			}
			
			self.gotoThumb();
		};
		
		this.startTimeAgain = function()
		{
			self.slideshowButtonDO.start();
		};

		this.setupScrollbar = function()
		{
			FWDR3DCovScrollbar.setPrototype();
			
			self.scrollbarDO = new FWDR3DCovScrollbar(self.data, self.totalThumbs, self.curId);
			self.scrollbarDO.addListener(FWDR3DCovScrollbar.MOVE, self.onScrollbarMove);
			self.controlsDO.addChild(self.scrollbarDO);
			
			self.scrollbarDO.setX(self.controlsWidth);
			self.controlsWidth += self.scrollbarDO.getWidth();
		};
		
		this.onScrollbarMove = function(e)
		{
			self.curId = e.id;
			self.gotoThumb();
		};
		
		this.addMouseWheelSupport = function()
		{
			if (window.addEventListener)
			{
				self.parent.mainDO.screen.addEventListener("mousewheel", self.mouseWheelHandler);
				self.parent.mainDO.screen.addEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}
			else if (document.attachEvent)
			{
				self.parent.mainDO.screen.attachEvent("onmousewheel", self.mouseWheelHandler);
			}
		};
		
		this.mouseWheelHandler = function(e)
		{
			if (!self.introFinished || !self.allowToSwitchCat)
				return;
				
			if (self.showScrollbar && self.scrollbarDO.isPressed)
				return;
			
			var dir = e.detail || e.wheelDelta;	
			
			if (e.wheelDelta)
				dir *= -1;
			
			if (dir > 0)
			{
				if (self.curId < self.totalThumbs-1)
				{
					self.curId++;
					self.gotoThumb();
				}
			}
			else if (dir < 0)
			{
				if (self.curId > 0)
				{
					self.curId--;
					self.gotoThumb();
				}
			}
			
			if (e.preventDefault)
			{
				e.preventDefault();
			}
			else
			{
				return false;
			}
		};
		
		//##########################################//
		/* setup mobile drag */
		//##########################################//
		this.setupMobileDrag = function()
		{
			if (self.hasPointerEvent)
			{
				self.parent.mainDO.screen.addEventListener("MSPointerDown", self.mobileDragStartHandler);
			}
			else
			{
				self.parent.mainDO.screen.addEventListener("touchstart", self.mobileDragStartTest);
			}
		};
		
		this.mobileDragStartTest = function(e)
		{
			var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);	
			
			if (viewportMouseCoordinates.screenY > self.controlsDO.getY())
				return;
			
			self.lastPressedX = viewportMouseCoordinates.screenX;
			self.lastPressedY = viewportMouseCoordinates.screenY;
			
			self.dragCurId = self.curId;
			
			window.addEventListener("touchmove", self.mobileDragMoveTest);
			window.addEventListener("touchend", self.mobileDragEndTest);
		};
		
		this.mobileDragMoveTest = function(e)
		{
			if (e.touches.length != 1) return;
			
			self.disableThumbClick = true;
			
			var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;
			self.mouseY = viewportMouseCoordinates.screenY;
			
			var angle = Math.atan2(self.mouseY - self.lastPressedY, self.mouseX - self.lastPressedX);
			var posAngle = Math.abs(angle) * 180 / Math.PI;
			
			if ((posAngle > 120) || (posAngle < 60))
			{
				if(e.preventDefault) e.preventDefault();
				
				self.curId = self.dragCurId + Math.floor((-(self.mouseX - self.lastPressedX) / 100) * self.data.swipeSpeed);
				
				if (self.curId < 0)
				{
					self.curId = 0;
				}
				else if (self.curId > self.totalThumbs-1)
				{
					self.curId = self.totalThumbs-1;
				}
				
				self.gotoThumb();
			}
			else
			{
				window.removeEventListener("touchmove", self.mobileDragMoveTest);
			}
		};
		
		this.mobileDragEndTest = function(e)
		{
			self.disableThumbClick = false;
			
			window.removeEventListener("touchmove", self.mobileDragMoveTest);
			window.removeEventListener("touchend", self.mobileDragEndTest);
		};
		
		this.mobileDragStartHandler = function(e)
		{
			var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);		
			
			if (viewportMouseCoordinates.screenY > self.controlsDO.getY())
				return;

			self.lastPressedX = viewportMouseCoordinates.screenX;	
			
			self.dragCurId = self.curId;

			window.addEventListener("MSPointerUp", self.mobileDragEndHandler, false);
			window.addEventListener("MSPointerMove", self.mobileDragMoveHandler);
		};
		
		this.mobileDragMoveHandler = function(e)
		{
			if(e.preventDefault) e.preventDefault();
			
			self.disableThumbClick = true;
			
			var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;;
			
			self.curId = self.dragCurId + Math.floor((-(self.mouseX - self.lastPressedX) / 100) * self.data.swipeSpeed);
			
			if (self.curId < 0)
			{
				self.curId = 0;
			}
			else if (self.curId > self.totalThumbs-1)
			{
				self.curId = self.totalThumbs-1;
			}
			
			self.gotoThumb();
		};

		this.mobileDragEndHandler = function(e)
		{
			self.disableThumbClick = false;
			
			window.removeEventListener("MSPointerUp", self.mobileDragEndHandler);
			window.removeEventListener("MSPointerMove", self.mobileDragMoveHandler);
		};
		
		//####################################//
		/* add keyboard support */
		//####################################//
		this.addKeyboardSupport = function()
		{
			if(document.addEventListener){
				document.addEventListener("keydown",  this.onKeyDownHandler);	
				document.addEventListener("keyup",  this.onKeyUpHandler);	
			}else{
				document.attachEvent("onkeydown",  this.onKeyDownHandler);	
				document.attachEvent("onkeyup",  this.onKeyUpHandler);	
			}
		};
		
		this.onKeyDownHandler = function(e)
		{
			if (!self.introFinished || !self.allowToSwitchCat)
				return;
				
			if (self.showScrollbar && self.scrollbarDO.isPressed)
				return;
				
			if (parent.lightboxDO && parent.lightboxDO.isShowed_bl)
				return;
				
			if(document.removeEventListener){
				document.removeEventListener("keydown",  self.onKeyDownHandler);
			}else{
				document.detachEvent("onkeydown",  self.onKeyDownHandler);
			}
				
			if (e.keyCode == 39)
			{	
				if (self.curId < self.totalThumbs-1)
				{
					self.curId++;
					self.gotoThumb();
				}
				
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}
			}
			else if (e.keyCode == 37)
			{
				if (self.curId > 0)
				{
					self.curId--;
					self.gotoThumb();
				}
				
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}
			}
		};
		
		this.onKeyUpHandler = function(e)
		{
			if(document.addEventListener){
				document.addEventListener("keydown",  self.onKeyDownHandler);	
			}else{
				document.attachEvent("onkeydown",  self.onKeyDownHandler);	
			}
		};
		
		this.update = function(e)
		{
			if (FWDR3DCovUtils.hasTransform3d)
			{
				self.thumbXSpace3D = e.xSpace;
				self.thumbXOffset3D = e.xOffset;
				self.thumbYAngle3D = e.yAngle;
				self.thumbZSpace3D = e.zSpace;
				self.thumbZOffset3D = e.zOffset;
			}
			else
			{
				self.thumbXSpace2D = e.xSpace;
				self.thumbXOffset2D = e.xOffset;
			}
			
			self.nrThumbsToDisplay = e.nrThumbs;
			
			self.showRefl = e.showRefl;
			self.reflDist = e.reflDist;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				self.thumbsAr[i].update();
			}
			
			self.gotoThumb();
		};
		
		/* destroy */
		this.destroy = function()
		{
			clearTimeout(self.loadWithDelayIdLeft);
			clearTimeout(self.loadWithDelayIdRight);
			clearTimeout(self.slideshowTimeoutId);
			clearTimeout(self.textTimeoutId);
			clearInterval(self.zSortingId);
			clearTimeout(self.hideThumbsFinishedId);
			clearTimeout(self.loadHtmlContentsId);
			clearTimeout(self.loadImagesId);
			clearTimeout(self.setTextHeightId);
			clearTimeout(self.setIntroFinishedId);
			clearTimeout(self.showControlsId);
			
			if (!self.isMobile)
			{
				if (self.screen.addEventListener)
				{
					window.removeEventListener("mousemove", self.onThumbMove);
				}
				else
				{
					document.detachEvent("onmousemove", self.onThumbMove);
				}
			}
			
			if (self.hasPointerEvent)
			{
				window.removeEventListener("MSPointerMove", self.onThumbMove);
			}
			
			if (self.hasPointerEvent)
			{
				self.parent.mainDO.screen.removeEventListener("MSPointerDown", self.mobileDragStartHandler);
				window.removeEventListener("MSPointerUp", self.mobileDragEndHandler);
				window.removeEventListener("MSPointerMove", self.mobileDragMoveHandler);
			}
			else
			{
				if (window.addEventListener)
				{
					self.parent.mainDO.screen.removeEventListener("touchstart", self.mobileDragStartTest);
					window.removeEventListener("touchmove", self.mobileDragMoveTest);
					window.removeEventListener("touchend", self.mobileDragEndTest);
				}
			}
			
			if (window.addEventListener)
			{
				self.parent.mainDO.screen.removeEventListener("mousewheel", self.mouseWheelHandler);
				self.parent.mainDO.screen.removeEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}
			else if (document.attachEvent)
			{
				self.parent.mainDO.screen.detachEvent("onmousewheel", self.mouseWheelHandler);
			}
			
			if (self.addKeyboardSupport)
			{
				if(document.removeEventListener){
					document.removeEventListener("keydown",  this.onKeyDownHandler);	
					document.removeEventListener("keyup",  this.onKeyUpHandler);	
				}else if(document.attachEvent){
					document.detachEvent("onkeydown",  this.onKeyDownHandler);	
					document.detachEvent("onkeyup",  this.onKeyUpHandler);	
				}
			}
			
			if (self.image)
			{
				self.image.onload = null;
				self.image.onerror = null;
				self.image.src = "";
			}

			if (self.imageLeft)
			{
				self.imageLeft.onload = null;
				self.imageLeft.onerror = null;
				self.imageLeft.src = "";
			}
			
			if (self.imageRight)
			{
				self.imageRight.onload = null;
				self.imageRight.onerror = null;
				self.imageRight.src = "";
			}
			
			self.image = null;
			self.imageLeft = null;
			self.imageRight = null;

			/* destroy thumbs */
			for (var i=0; i<self.totalThumbs; i++)
			{
				FWDR3DCovModTweenMax.killTweensOf(self.thumbsAr[i]);
				self.thumbsAr[i].destroy();
				self.thumbsAr[i] = null;
			};

			self.thumbsAr = null;
			
			if (self.prevButtonDO)
			{
				self.prevButtonDO.destroy();
				self.prevButtonDO = null;
			}
			
			if (self.nextButtonDO)
			{
				self.nextButtonDO.destroy();
				self.nextButtonDO = null;
			}
			
			if (self.scrollbarDO)
			{
				self.scrollbarDO.destroy();
				self.scrollbarDO = null;
			}
			
			if (self.slideshowButtonDO)
			{
				self.slideshowButtonDO.destroy();
				self.slideshowButtonDO = null;
			}	
			
			if (self.textGradientDO && self.textGradientDO.screen)
			{
				FWDR3DCovModTweenMax.killTweensOf(self.textGradientDO);
				self.textGradientDO.destroy();
				self.textGradientDO = null;
			}
			
			if (self.textDO && self.textDO.screen)
			{
				FWDR3DCovModTweenMax.killTweensOf(self.textDO);
				self.textDO.destroy();
				self.textDO = null;
			}
			
			if (self.textHolderDO && self.textHolderDO.screen)
			{
				FWDR3DCovModTweenMax.killTweensOf(self.textHolderDO);
				self.textHolderDO.destroy();
				self.textHolderDO = null;
			}
			
			if (self.thumbOverDO)
			{
				self.thumbOverDO.destroy();
				self.thumbOverDO = null;
			}

			if (self.thumbsHolderDO)
			{
				self.thumbsHolderDO.destroy();
				self.thumbsHolderDO = null;
			}
			
			if (self.controlsDO)
			{
				FWDR3DCovModTweenMax.killTweensOf(self.controlsDO);
				self.controlsDO.destroy();
				self.controlsDO = null;
			}
			
			self.screen.innerHTML = "";
			self = null;
			prototype.destroy();
			prototype = null;
			FWDR3DCovThumbsManager.prototype = null;
		};
		
		this.init();
	};

	/* set prototype */
	FWDR3DCovThumbsManager.setPrototype = function()
	{
		FWDR3DCovThumbsManager.prototype = new FWDR3DCovDisplayObject3D("div", "relative", "visible");
	};
	
	FWDR3DCovThumbsManager.THUMB_CLICK = "onThumbClick";
	FWDR3DCovThumbsManager.LOAD_ERROR = "onLoadError";
	FWDR3DCovThumbsManager.THUMBS_INTRO_FINISH = "onThumbsIntroFinish";
	FWDR3DCovThumbsManager.THUMB_CHANGE = "onThumbChange";

	window.FWDR3DCovThumbsManager = FWDR3DCovThumbsManager;

}(window));