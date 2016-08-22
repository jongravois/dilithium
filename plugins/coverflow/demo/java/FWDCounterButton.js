/* FWDR3DCovCounterButton */
(function(window)
{
	var FWDR3DCovCounterButton = function(propsObj)
	{
		var self = this;
		var prototype = FWDR3DCovCounterButton.prototype;
		
		this.counterButtonBgDO;
		this.counterButtonBgLeftDO;
		this.counterButtonBgCenterDO;
		this.counterButtonBgRightDO;
		
		this.counterButtonTextDO;
		
		this.counterPlusButtonDO;
		this.counterMinusButtonDO;
		
		this.counterButtonWidth = propsObj.counterButtonWidth;
		this.counterButtonHeight = propsObj.counterButtonHeight;
		this.bgWidth = propsObj.bgWidth;
		this.bgMarginWidth = propsObj.bgMarginWidth;
		this.buttonWidth = propsObj.buttonWidth;
		this.buttonSpace = propsObj.buttonSpace;
		
		this.textColor = propsObj.textColor;
		
		this.valuesList = propsObj.valuesList;
		this.value = propsObj.value;
		
		this.mouseX = 0;
		this.mouseY = 0;
		
		this.isEnabled = false;

		this.isMobile = FWDR3DCovUtils.isMobile;
		this.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;

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
			self.setWidth(self.counterButtonWidth);
			self.setHeight(self.counterButtonHeight);
			
			self.setBg();
			self.setText();
			self.setButtons();
			
			self.enable();
		};
		
		this.setBg = function()
		{
			self.counterButtonBgDO = new FWDR3DCovDisplayObject("div");
			self.addChild(self.counterButtonBgDO);
			
			self.counterButtonBgDO.setWidth(self.bgWidth);
			self.counterButtonBgDO.setHeight(self.counterButtonHeight);
			
			self.counterButtonBgLeftDO = new FWDR3DCovSimpleDisplayObject("img");
			self.counterButtonBgLeftDO.screen.src = propsObj.skinPath + "/bgLeft.png";
			self.counterButtonBgDO.addChild(self.counterButtonBgLeftDO);
			
			self.counterButtonBgLeftDO.setWidth(self.bgMarginWidth);
			self.counterButtonBgLeftDO.setHeight(self.counterButtonHeight);
			
			self.counterButtonBgCenterDO = new FWDR3DCovSimpleDisplayObject("div");
			self.counterButtonBgCenterDO.screen.style.backgroundImage = "url(" + propsObj.skinPath + "/bgCenter.png" + ")";
			self.counterButtonBgCenterDO.screen.style.backgroundRepeat = "repeat-x";
			self.counterButtonBgDO.addChild(self.counterButtonBgCenterDO);
			
			self.counterButtonBgCenterDO.setWidth(self.bgWidth - 2 * self.bgMarginWidth);
			self.counterButtonBgCenterDO.setHeight(self.counterButtonHeight);
			self.counterButtonBgCenterDO.setX(self.bgMarginWidth);
			
			self.counterButtonBgRightDO = new FWDR3DCovSimpleDisplayObject("img");
			self.counterButtonBgRightDO.screen.src = propsObj.skinPath + "/bgRight.png";
			self.counterButtonBgDO.addChild(self.counterButtonBgRightDO);
			
			self.counterButtonBgRightDO.setWidth(self.bgMarginWidth);
			self.counterButtonBgRightDO.setHeight(self.counterButtonHeight);
			self.counterButtonBgRightDO.setX(self.bgWidth - self.bgMarginWidth);
		};
		
		this.setText = function()
		{
			self.counterButtonTextDO = new FWDR3DCovSimpleDisplayObject("div");
			self.addChild(self.counterButtonTextDO);
			
			self.counterButtonTextDO.getStyle().fontSmoothing = "antialiased";
			self.counterButtonTextDO.getStyle().webkitFontSmoothing = "antialiased";
			self.counterButtonTextDO.getStyle().textRendering = "optimizeLegibility";
			
			self.counterButtonTextDO.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			self.counterButtonTextDO.getStyle().fontSize = "11px";
			self.counterButtonTextDO.getStyle().color = self.textColor;
			self.counterButtonTextDO.setInnerHTML(self.valuesList[self.value]);
			
			self.setTextPositionId = setTimeout(self.setTextPosition, 10);
		};
		
		this.setTextPosition = function()
		{
			self.counterButtonTextDO.setX(Math.floor((self.bgWidth - self.counterButtonTextDO.getWidth())/2));
			self.counterButtonTextDO.setY(Math.floor((self.counterButtonHeight - self.counterButtonTextDO.getHeight())/2) + 1);
		};
		
		this.setButtons = function()
		{
			FWDR3DCovSimpleButtonUrl.setPrototype();
			
			self.counterPlusButtonDO = new FWDR3DCovSimpleButtonUrl(self.buttonWidth, self.counterButtonHeight, propsObj.skinPath + "/plusNormal.png", propsObj.skinPath + "/plusSelected.png");
			self.addChild(self.counterPlusButtonDO);
			self.counterPlusButtonDO.addListener(FWDR3DCovSimpleButtonUrl.CLICK, self.plusButtonClickHandler);
			
			self.counterPlusButtonDO.setX(self.bgWidth + self.buttonSpace);
			
			FWDR3DCovSimpleButtonUrl.setPrototype();
			
			self.counterMinusButtonDO = new FWDR3DCovSimpleButtonUrl(self.buttonWidth, self.counterButtonHeight, propsObj.skinPath + "/minusNormal.png", propsObj.skinPath + "/minusSelected.png");
			self.addChild(self.counterMinusButtonDO);
			self.counterMinusButtonDO.addListener(FWDR3DCovSimpleButtonUrl.CLICK, self.minusButtonClickHandler);
			
			self.counterMinusButtonDO.setX(self.bgWidth + self.buttonSpace*2 + self.buttonWidth);
		};
		
		this.setSize = function(newWidth)
		{
			if (newWidth == self.counterButtonWidth)
				return;
			
			
		};
		
		this.plusButtonClickHandler = function()
		{
			self.value++;
		
			if (self.value == self.valuesList.length-1)
			{
				self.counterPlusButtonDO.disable();
			}
			else if (!self.counterMinusButtonDO.isEnabled)
			{
				self.counterMinusButtonDO.enable();
			}
			
			self.counterButtonTextDO.setInnerHTML(self.valuesList[self.value]);
			clearTimeout(self.setTextPositionId);
			self.setTextPositionId = setTimeout(self.setTextPosition, 10);
			
			self.dispatchEvent(FWDR3DCovCounterButton.CHANGE, {value:self.value});
		};
		
		this.minusButtonClickHandler = function()
		{
			self.value--;
		
			if (self.value == 0)
			{
				self.counterMinusButtonDO.disable();
			}
			else if (!self.counterPlusButtonDO.isEnabled)
			{
				self.counterPlusButtonDO.enable();
			}
			
			self.counterButtonTextDO.setInnerHTML(self.valuesList[self.value]);
			clearTimeout(self.setTextPositionId);
			self.setTextPositionId = setTimeout(self.setTextPosition, 10);
			
			self.dispatchEvent(FWDR3DCovCounterButton.CHANGE, {value:self.value});
		};
		
		this.setValue = function(newValue)
		{
			self.value = newValue;
			
			self.counterButtonTextDO.setInnerHTML(self.valuesList[self.value]);
			clearTimeout(self.setTextPositionId);
			self.setTextPositionId = setTimeout(self.setTextPosition, 10);
			
			if (self.value == self.valuesList.length-1)
			{
				self.counterPlusButtonDO.disable();
			}
			else
			{
				self.counterPlusButtonDO.enable();
			}
			
			if (self.value == 0)
			{
				self.counterMinusButtonDO.disable();
			}
			else
			{
				self.counterMinusButtonDO.enable();
			}
		};		
		
		this.enable = function()
		{
			self.counterPlusButtonDO.enable();
			self.counterMinusButtonDO.enable();
			self.counterButtonBgDO.setAlpha(1);
			self.counterButtonTextDO.setAlpha(1);
			
			if (self.value == self.valuesList.length-1)
			{
				self.counterPlusButtonDO.disable();
			}
			
			if (self.value == 0)
			{
				self.counterMinusButtonDO.disable();
			}
		};
		
		this.disable = function()
		{
			self.counterPlusButtonDO.disable();
			self.counterMinusButtonDO.disable();
			self.counterButtonBgDO.setAlpha(.5);
			self.counterButtonTextDO.setAlpha(.5);
		};

		// ##############################//
		/* destroy */
		// ##############################//
		this.destroy = function()
		{
			
			
			FWDR3DCovModTweenMax.killTweensOf(self.counterButtonHandlerNDO);
			
			self.counterButtonHandlerDO.destroy();
			self.counterButtonHandlerNDO.destroy();
			self.counterButtonHandlerSDO.destroy();
			self.counterButtonBgDO.destroy();
			self.counterButtonBgLeftDO.destroy();
			self.counterButtonBgCenterDO.destroy();
			self.counterButtonBgRightDO.destroy();
			self.counterButtonProgressDO.destroy();
			self.counterButtonProgressLeftDO.destroy();
			self.counterButtonProgressCenterDO.destroy();
			
			self.counterButtonHandlerDO = null;
			self.counterButtonHandlerNDO = null;
			self.counterButtonHandlerSDO = null;
			self.counterButtonBgDO = null;
			self.counterButtonBgLeftDO = null;
			self.counterButtonBgCenterDO = null;
			self.counterButtonBgRightDO = null;
			self.counterButtonProgressDO = null;
			self.counterButtonProgressLeftDO = null;
			self.counterButtonProgressCenterDO = null;
			
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDR3DCovCounterButton.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDR3DCovCounterButton.setPrototype = function()
	{
		FWDR3DCovCounterButton.prototype = new FWDR3DCovDisplayObject("div");
	};

	FWDR3DCovCounterButton.CHANGE = "onChange";

	FWDR3DCovCounterButton.prototype = null;
	window.FWDR3DCovCounterButton = FWDR3DCovCounterButton;
}(window));