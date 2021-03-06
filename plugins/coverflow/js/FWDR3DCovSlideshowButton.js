/* FWDR3DCovSlideshowButton */
(function(window)
{
	var FWDR3DCovSlideshowButton = function(data)
	{
		var self = this;
		var prototype = FWDR3DCovSlideshowButton.prototype;

		this.playButtonNImg = data.playButtonNImg;
		this.playButtonSImg = data.playButtonSImg;
		this.pauseButtonImg = data.pauseButtonImg;
		this.timerButtonImg = data.slideshowTimerImg;

		this.playButtonDO;
		this.playButtonNDO;
		this.playButtonSDO;
		
		this.pauseButtonDO;
		
		this.timerButtonDO;
		this.timerButtonBgDO;
		this.timerButtonTextDO;
		
		this.delay = data.slideshowDelay;
		this.autoplay = data.autoplay;
		this.curSeconds = data.slideshowDelay/1000;
		
		this.isPlaying = false;
		this.isCounting = false;
		
		this.btnWidth = self.playButtonNImg.width;
		this.btnHeight = self.playButtonNImg.height;

		this.isMobile = FWDR3DCovUtils.isMobile;
		this.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;
		
		this.timeoutId;
		this.timerIntervalId;

		// ##########################################//
		/* initialize this */
		// ##########################################//
		this.init = function()
		{
			self.setupMainContainers();
		};

		// ##########################################//
		/* setup main containers */
		// ##########################################//
		this.setupMainContainers = function()
		{
			self.setButtonMode(true);
			self.setWidth(self.btnWidth);
			self.setHeight(self.btnHeight);
			
			self.setPauseButton();
			self.settimerButton();
			self.setPlayButton();

			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
					self.screen.addEventListener("MSPointerUp", self.onClick);
				}
				else
				{
					self.screen.addEventListener("touchend", self.onClick);
				}
			}
			else
			{
				if (window.addEventListener)
				{
					self.screen.addEventListener("mouseover", self.onMouseOver);
					self.screen.addEventListener("mouseout", self.onMouseOut);
					self.screen.addEventListener("click", self.onClick);
				}
				else
				{
					self.screen.attachEvent("onmouseover", self.onMouseOver);
					self.screen.attachEvent("onmouseout", self.onMouseOut);
					self.screen.attachEvent("onclick", self.onClick);
				}
			}
		};
		
		this.settimerButton = function()
		{
			self.timerButtonDO = new FWDR3DCovDisplayObject("div");
			self.addChild(self.timerButtonDO);
			
			self.timerButtonDO.setWidth(self.btnWidth);
			self.timerButtonDO.setHeight(self.btnHeight);
			
			self.timerButtonBgDO = new FWDR3DCovSimpleDisplayObject("img");
			self.timerButtonBgDO.setScreen(self.timerButtonImg);
			self.timerButtonDO.addChild(self.timerButtonBgDO);
			
			self.timerButtonTextDO = new FWDR3DCovDisplayObject("div");
			self.timerButtonDO.addChild(self.timerButtonTextDO);
			
			self.timerButtonTextDO.getStyle().fontSmoothing = "antialiased";
			self.timerButtonTextDO.getStyle().webkitFontSmoothing = "antialiased";
			self.timerButtonTextDO.getStyle().textRendering = "optimizeLegibility";
			
			self.timerButtonTextDO.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			self.timerButtonTextDO.getStyle().fontSize = "10px";
			self.timerButtonTextDO.getStyle().color = data.slideshowTimerColor;
			
			if (self.curSeconds < 10)
				self.timerButtonTextDO.setInnerHTML("0" + self.curSeconds);
			else
				self.timerButtonTextDO.setInnerHTML(self.curSeconds);
				
			self.setTextPositionId = setTimeout(self.setTextPosition, 10);
		};
		
		this.setTextPosition = function()
		{
			self.timerButtonTextDO.setX(Math.floor((self.btnWidth - self.timerButtonTextDO.getWidth())/2));
			self.timerButtonTextDO.setY(Math.floor((self.btnHeight - self.timerButtonTextDO.getHeight())/2));
		};
		
		this.setPauseButton = function()
		{
			self.pauseButtonDO = new FWDR3DCovSimpleDisplayObject("img");
			self.pauseButtonDO.setScreen(self.pauseButtonImg);
			self.addChild(self.pauseButtonDO);
			
			self.pauseButtonDO.setWidth(self.btnWidth);
			self.pauseButtonDO.setHeight(self.btnHeight);
		};
		
		this.setPlayButton = function()
		{
			self.playButtonDO = new FWDR3DCovDisplayObject("div");
			self.addChild(self.playButtonDO);
			
			self.playButtonSDO = new FWDR3DCovSimpleDisplayObject("img");
			self.playButtonSDO.setScreen(self.playButtonSImg);
			self.playButtonDO.addChild(self.playButtonSDO);
			
			self.playButtonNDO = new FWDR3DCovSimpleDisplayObject("img");
			self.playButtonNDO.setScreen(self.playButtonNImg);
			self.playButtonDO.addChild(self.playButtonNDO);
			
			self.playButtonDO.setWidth(self.btnWidth);
			self.playButtonDO.setHeight(self.btnHeight);
		};

		this.onMouseOver = function()
		{
			if (self.isPlaying)
			{
				FWDR3DCovModTweenMax.to(self.timerButtonDO, .8, {alpha:0, ease : Expo.easeOut});
			}
			else
			{
				FWDR3DCovModTweenMax.to(self.playButtonNDO, .8, {alpha:0, ease : Expo.easeOut});
			}
		};

		this.onMouseOut = function()
		{
			if (self.isPlaying)
			{
				FWDR3DCovModTweenMax.to(self.timerButtonDO, .8, {alpha:1, ease : Expo.easeOut});
			}
			else
			{
				FWDR3DCovModTweenMax.to(self.playButtonNDO, .8, {alpha:1, ease : Expo.easeOut});
			}
		};

		this.onClick = function(e)
		{
			if (self.isPlaying)
			{
				self.stop();
				
				self.dispatchEvent(FWDR3DCovSlideshowButton.PAUSE_CLICK);
			}
			else
			{
				self.start();
				
				self.dispatchEvent(FWDR3DCovSlideshowButton.PLAY_CLICK);
			}
			
			if (!self.isMobile)
			{
				self.onMouseOver();
			}
		};
		
		this.start = function()
		{
			self.isPlaying = true;
			self.isCounting = true;
			self.playButtonDO.setAlpha(0);
			self.curSeconds = self.delay/1000;
			
			clearTimeout(self.timeoutId);
			clearInterval(self.timerIntervalId);
			self.timeoutId = setTimeout(self.onTimeHandler, self.delay);
			self.timerIntervalId = setInterval(self.onTickHandler, 1000);
			
			if (self.curSeconds < 10)
				self.timerButtonTextDO.setInnerHTML("0" + self.curSeconds);
			else
				self.timerButtonTextDO.setInnerHTML(self.curSeconds);
		};
		
		this.stop = function()
		{
			self.isPlaying = false;
			self.isCounting = false;
			self.playButtonDO.setAlpha(1);
			
			clearTimeout(self.timeoutId);
			clearInterval(self.timerIntervalId);
		};
		
		this.resetCounter = function()
		{
			self.isCounting = false;
			
			clearTimeout(self.timeoutId);
			clearInterval(self.timerIntervalId);
			
			self.curSeconds = self.delay/1000;
			
			if (self.curSeconds < 10)
				self.timerButtonTextDO.setInnerHTML("0" + self.curSeconds);
			else
				self.timerButtonTextDO.setInnerHTML(self.curSeconds);
		};
		
		this.onTimeHandler = function()
		{
			self.isCounting = false;
			
			clearTimeout(self.timeoutId);
			clearInterval(self.timerIntervalId);
			
			self.onTickHandler();
			self.dispatchEvent(FWDR3DCovSlideshowButton.TIME);
		};
		
		this.onTickHandler = function()
		{
			self.curSeconds--;
			
			if (self.curSeconds < 10)
				self.timerButtonTextDO.setInnerHTML("0" + self.curSeconds);
			else
				self.timerButtonTextDO.setInnerHTML(self.curSeconds);
		};

		// ##############################//
		/* destroy */
		// ##############################//
		this.destroy = function()
		{
			clearTimeout(self.timeoutId);
			clearTimeout(self.setTextPositionId);
			clearInterval(self.timerIntervalId);
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.screen.removeEventListener("MSPointerOver", self.onMouseOver);
					self.screen.removeEventListener("MSPointerOut", self.onMouseOut);
					self.screen.removeEventListener("MSPointerUp", self.onClick);
				}
				else
				{
					self.screen.removeEventListener("touchend", self.onClick);
				}
			}
			else
			{
				if (window.addEventListener)
				{
					self.screen.removeEventListener("mouseover", self.onMouseOver);
					self.screen.removeEventListener("mouseout", self.onMouseOut);
					self.screen.removeEventListener("click", self.onClick);
				}
				else
				{
					self.screen.detachEvent("onmouseover", self.onMouseOver);
					self.screen.detachEvent("onmouseout", self.onMouseOut);
					self.screen.detachEvent("onclick", self.onClick);
				}
			}
			
			FWDR3DCovModTweenMax.killTweensOf(self.timerButtonDO);
			FWDR3DCovModTweenMax.killTweensOf(self.playButtonNDO);
			
			self.playButtonDO.destroy();
			self.playButtonNDO.destroy();
			self.playButtonSDO.destroy();
			
			self.pauseButtonDO.destroy();
			
			self.timerButtonDO.destroy();
			self.timerButtonBgDO.destroy();
			self.timerButtonTextDO.destroy();
			
			prototype.destroy();
			self = null;
			prototype = null;
			FWDR3DCovSlideshowButton.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDR3DCovSlideshowButton.setPrototype = function()
	{
		FWDR3DCovSlideshowButton.prototype = new FWDR3DCovDisplayObject("div");
	};

	FWDR3DCovSlideshowButton.PLAY_CLICK = "onPlayClick";
	FWDR3DCovSlideshowButton.PAUSE_CLICK = "onPauseClick";
	FWDR3DCovSlideshowButton.TIME = "onTime";

	FWDR3DCovSlideshowButton.prototype = null;
	window.FWDR3DCovSlideshowButton = FWDR3DCovSlideshowButton;
}(window));