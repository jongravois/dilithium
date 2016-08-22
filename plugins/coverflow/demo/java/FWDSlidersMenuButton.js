/* FWDR3DCovSlidersMenuButton */
(function (){
var FWDR3DCovSlidersMenuButton = function(propsObj)
{
		var self = this;
		var prototype = FWDR3DCovSlidersMenuButton.prototype;
		
		this.id = propsObj.id;
		this.text = propsObj.text;
		this.nrOfSliders = propsObj.nrOfSliders;
		this.totalButtons = propsObj.totalButtons;
		
		this.sliderMinValue;
		this.sliderMaxValue;
		this.sliderValue;
		
		this.totalWidth = 190;
		this.totalHeight = 100;
		
		this.imgDO;
		this.sliderDO;
		this.sliderTextDO;
		this.sliderText;
		this.counterButtonDO;
		this.resetButtonDO;
		this.onOffButtonDO;
		this.textDO;
		
		this.finalX;
		this.finalY;
		
		this.isMobile = FWDR3DCovUtils.isMobile;
		this.isDisabled = false;
		
		this.init = function()
		{
			self.setWidth(self.totalWidth);
			self.setHeight(self.totalHeight);

			if (((self.id == 3) && (self.totalButtons == 6)) || ((self.id == 6) && (self.totalButtons == 9)))
			{
				self.value = propsObj.value;
				self.setupMainContainers4();
			}
			else if ((self.id < self.nrOfSliders) || (((self.id == 4) && (self.totalButtons == 6)) || ((self.id == 7) && (self.totalButtons == 9))))
			{
				self.sliderMinValue = propsObj.sliderMinValue;
				self.sliderMaxValue = propsObj.sliderMaxValue;
				self.sliderValue = propsObj.sliderValue;
				self.value = self.sliderValue;
				
				self.setupMainContainers();
			}
			else if (self.id == self.nrOfSliders)
			{
				self.value = propsObj.value;
				self.setupMainContainers2();
			}
			else
			{
				self.setupMainContainers3();
			}
		};
		
		this.setupMainContainers = function()
		{
			self.imgDO = new FWDR3DCovSimpleDisplayObject("img");
			
			self.imgDO.setWidth(170);
			self.imgDO.setHeight(56);
			
			if (self.totalButtons == 9 || self.totalButtons == 7) 
			{
				if (self.id == 3)
				{
					self.imgDO.setX(Math.floor((self.totalWidth - 170)/2) + 0);
				}
				else if (self.id == 4)
				{
					self.imgDO.setX(Math.floor((self.totalWidth - 170)/2) - 0);
				}
				else
				{
					self.imgDO.setX(Math.floor((self.totalWidth - 170)/2));
				}
			}
			else
			{
				self.imgDO.setX(Math.floor((self.totalWidth - 170)/2));
			}
			
			if (((self.id == 4) && (self.totalButtons == 6)) || ((self.id == 7) && (self.totalButtons == 9)))
			{
				self.imgDO.setY(-14);
			}
			else
			{
				self.imgDO.setY(-16);
			}
			
			if (((self.id == 4) && (self.totalButtons == 6)) || ((self.id == 7) && (self.totalButtons == 9)))
			{
				self.imgDO.screen.src = "load/slider-skin/sliderImageRefl.jpg";
			}
			else
			{
				self.imgDO.screen.src = "load/slider-skin/sliderImage" + (self.id+1) + ".jpg";
			}
			
			self.addChild(self.imgDO);
			
			FWDR3DCovSlider.setPrototype();
			self.sliderDO = new FWDR3DCovSlider(
			{
				skinPath:"load/slider-skin",
				sliderWidth:170,
				sliderHeight:22,
				handlerWidth:22,
				trackHeight:12,
				trackMarginWidth:5,
				progressHeight:6,
				minValue:self.sliderMinValue,
				maxValue:self.sliderMaxValue,
				value:self.sliderValue
			});
			
			self.sliderDO.addListener(FWDR3DCovSlider.CHANGE, self.onSliderChange);
			self.addChild(self.sliderDO);
			
			self.sliderDO.setY(45);
			
			self.sliderTextDO = new FWDR3DCovDisplayObject("div");
			self.addChild(self.sliderTextDO);

			self.sliderTextDO.setWidth(40);
			self.sliderTextDO.setHeight(25);
			
			if (self.id == 4)
			{
				self.sliderTextDO.setX(73);
			}
			else
			{
				self.sliderTextDO.setX(75);
			}
			
			self.sliderTextDO.setY(1);
			
			self.sliderText = new FWDR3DCovSimpleDisplayObject("div");
			self.sliderTextDO.addChild(self.sliderText);
			
			self.sliderText.getStyle().fontSmoothing = "antialiased";
			self.sliderText.getStyle().webkitFontSmoothing = "antialiased";
			self.sliderText.getStyle().textRendering = "optimizeLegibility";
			
			self.sliderText.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			self.sliderText.getStyle().fontSize = "12px";
			self.sliderText.getStyle().color = "#000000";
			
			if (FWDR3DCovUtils.isIEAndLessThen9)
			{
				self.sliderText.screen.innerText = self.value;
			}
			else
			{
				self.sliderText.setInnerHTML(self.value);
			}
			
			self.sliderTextId = setTimeout(self.setSliderTextPosition, 10);
			
			self.textDO = new FWDR3DCovSimpleDisplayObject("div");
			self.addChild(self.textDO);
			
			self.textDO.getStyle().fontSmoothing = "antialiased";
			self.textDO.getStyle().webkitFontSmoothing = "antialiased";
			self.textDO.getStyle().textRendering = "optimizeLegibility";
			
			self.textDO.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			self.textDO.getStyle().fontSize = "12px";
			self.textDO.getStyle().color = "#777777";
			
			if (FWDR3DCovUtils.isIEAndLessThen9)
			{
				self.textDO.screen.innerText = self.text;
			}
			else
			{
				self.textDO.getStyle().whiteSpace = "nowrap";
				self.textDO.setInnerHTML(self.text);
			}
			
			setTimeout(self.setTextPosition, 10);
		};
		
		this.onSliderChange = function(e)
		{
			if (FWDR3DCovUtils.isIEAndLessThen9)
			{
				self.sliderText.screen.innerText = self.value;
			}
			else
			{
				self.sliderText.setInnerHTML(self.value);
			}
				
			clearTimeout(self.sliderTextId);
			self.sliderTextId = setTimeout(self.setSliderTextPosition, 10);
			
			self.value = e.value;
			self.dispatchEvent(FWDR3DCovSlidersMenuButton.CHANGE);
		};
		
		this.setTextPosition = function()
		{
			self.textDO.setX(Math.floor((self.totalWidth - self.textDO.getWidth())/2));
			self.textDO.setY(80);
		};
		
		this.setSliderTextPosition = function()
		{
			self.sliderText.setX(Math.floor((40 - self.sliderText.getWidth())/2));
			self.sliderText.setY(Math.floor((25 - self.sliderText.getHeight())/2));
		};
		
		this.setupMainContainers2 = function()
		{
			self.imgDO = new FWDR3DCovSimpleDisplayObject("img");
			
			self.imgDO.setWidth(170);
			self.imgDO.setHeight(56);
			
			self.imgDO.setX(Math.floor((self.totalWidth - 170)/2));
			self.imgDO.setY(-20);
			
			self.imgDO.screen.src = "load/counter-skin/counterImage.jpg";
			self.addChild(self.imgDO);
			
			FWDR3DCovCounterButton.setPrototype();
			
			self.counterButtonDO = new FWDR3DCovCounterButton(
			{
				skinPath:"load/counter-skin",
				counterButtonWidth:152,
				counterButtonHeight:21,
				bgWidth:90,
				bgMarginWidth:5,
				buttonWidth:21,
				buttonSpace:10,
				textColor:"#FFFFFF",
				valuesList:["all", "1 thumbnail", "2 thumbnails", "3 thumbnails", "4 thumbnails"],
				value:self.value
			});
			self.counterButtonDO.addListener(FWDR3DCovCounterButton.CHANGE, self.counterButtonChangeHandler);
			self.addChild(self.counterButtonDO);
			
			self.counterButtonDO.setX(Math.floor((self.totalWidth - self.counterButtonDO.getWidth())/2));
			self.counterButtonDO.setY(45);
			
			self.textDO = new FWDR3DCovSimpleDisplayObject("div");
			self.addChild(self.textDO);
			
			self.textDO.getStyle().fontSmoothing = "antialiased";
			self.textDO.getStyle().webkitFontSmoothing = "antialiased";
			self.textDO.getStyle().textRendering = "optimizeLegibility";
			
			self.textDO.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			self.textDO.getStyle().fontSize = "12px";
			self.textDO.getStyle().color = "#777777";
			
			if (FWDR3DCovUtils.isIEAndLessThen9)
			{
				self.textDO.screen.innerText = self.text;
			}
			else
			{
				self.textDO.getStyle().whiteSpace = "nowrap";
				self.textDO.setInnerHTML(self.text);
			}
			
			setTimeout(self.setTextPosition, 10);
		};
		
		this.counterButtonChangeHandler = function(e)
		{
			self.value = e.value;
			self.dispatchEvent(FWDR3DCovSlidersMenuButton.CHANGE);
		};
		
		this.setupMainContainers3 = function()
		{
			FWDResetButton.setPrototype();
			
			self.resetButtonDO = new FWDResetButton(31, 29, "load/reset-skin");
			self.resetButtonDO.addListener(FWDResetButton.CLICK, self.resetButtonClickHandler);
			self.addChild(self.resetButtonDO);
			
			self.resetButtonDO.setX(Math.floor((self.totalWidth - self.resetButtonDO.getWidth())/2));
			self.resetButtonDO.setY(Math.floor((60 - self.resetButtonDO.getHeight())/2));
			
			self.textDO = new FWDR3DCovSimpleDisplayObject("div");
			self.addChild(self.textDO);
			
			self.textDO.getStyle().fontSmoothing = "antialiased";
			self.textDO.getStyle().webkitFontSmoothing = "antialiased";
			self.textDO.getStyle().textRendering = "optimizeLegibility";
			
			self.textDO.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			self.textDO.getStyle().fontSize = "12px";
			self.textDO.getStyle().color = "#777777";
			
			if (FWDR3DCovUtils.isIEAndLessThen9)
			{
				self.textDO.screen.innerText = self.text;
			}
			else
			{
				self.textDO.getStyle().whiteSpace = "nowrap";
				self.textDO.setInnerHTML(self.text);
			}
			
			setTimeout(self.setTextPosition, 10);
		};
		
		this.resetButtonClickHandler = function(e)
		{
			self.dispatchEvent(FWDR3DCovSlidersMenuButton.RESET);
		};
		
		this.setupMainContainers4 = function()
		{
			FWDR3DCovOnOffButton.setPrototype();
			
			self.onOffButtonDO = new FWDR3DCovOnOffButton(104, 31, 54, "load/onOffButton-skin", self.value);
			self.onOffButtonDO.addListener(FWDR3DCovOnOffButton.CHANGE, self.onOnOffButtonChangeHandler);
			self.addChild(self.onOffButtonDO);
			
			self.onOffButtonDO.setX(Math.floor((self.totalWidth - self.onOffButtonDO.getWidth())/2));
			self.onOffButtonDO.setY(Math.floor((80 - self.onOffButtonDO.getHeight())/2));
			
			self.textDO = new FWDR3DCovSimpleDisplayObject("div");
			self.addChild(self.textDO);
			
			self.textDO.getStyle().fontSmoothing = "antialiased";
			self.textDO.getStyle().webkitFontSmoothing = "antialiased";
			self.textDO.getStyle().textRendering = "optimizeLegibility";
			
			self.textDO.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			self.textDO.getStyle().fontSize = "12px";
			self.textDO.getStyle().color = "#777777";
			
			if (FWDR3DCovUtils.isIEAndLessThen9)
			{
				self.textDO.screen.innerText = self.text;
			}
			else
			{
				self.textDO.getStyle().whiteSpace = "nowrap";
				self.textDO.setInnerHTML(self.text);
			}
			
			setTimeout(self.setTextPosition, 10);
		};
		
		this.onOnOffButtonChangeHandler = function(e)
		{
			self.value = e.value;
			self.dispatchEvent(FWDR3DCovSlidersMenuButton.CHANGE);
		};
		
		this.setValue = function(newValue)
		{
			self.value = newValue;
			
			if (((self.id == 3) && (self.totalButtons == 6)) || ((self.id == 6) && (self.totalButtons == 9)))
			{
				self.onOffButtonDO.setValue(newValue);
			}
			else if ((self.id < self.nrOfSliders) || (((self.id == 4) && (self.totalButtons == 6)) || ((self.id == 7) && (self.totalButtons == 9))))
			{
				if (FWDR3DCovUtils.isIEAndLessThen9)
				{
					self.sliderText.screen.innerText = self.value;
				}
				else
				{
					self.sliderText.setInnerHTML(self.value);
				}
				
				clearTimeout(self.sliderTextId);
				self.sliderTextId = setTimeout(self.setSliderTextPosition, 10);
				
				self.sliderDO.setValue(newValue);
			}
			else if (self.id == self.nrOfSliders)
			{
				self.counterButtonDO.setValue(newValue);
			}
		};
		
		this.disable = function()
		{
			self.isDisabled = true;
			
			if (((self.id == 3) && (self.totalButtons == 6)) || ((self.id == 6) && (self.totalButtons == 9)))
			{
				self.onOffButtonDO.disable();
			}
			else if ((self.id < self.nrOfSliders) || (((self.id == 4) && (self.totalButtons == 6)) || ((self.id == 7) && (self.totalButtons == 9))))
			{
				self.sliderDO.disable();
			}
			else if (self.id == self.nrOfSliders)
			{
				self.counterButtonDO.disable();
			}
			else
			{
				self.resetButtonDO.disable();
			}
		};
		
		this.enable = function()
		{
			self.isDisabled = false;
			
			if (((self.id == 3) && (self.totalButtons == 6)) || ((self.id == 6) && (self.totalButtons == 9)))
			{
				self.onOffButtonDO.enable();
			}
			else if ((self.id < self.nrOfSliders) || (((self.id == 4) && (self.totalButtons == 6)) || ((self.id == 7) && (self.totalButtons == 9))))
			{
				self.sliderDO.enable();
			}
			else if (self.id == self.nrOfSliders)
			{
				self.counterButtonDO.enable();
			}
			else
			{
				self.resetButtonDO.enable();
			}
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDR3DCovSlidersMenuButton.setPrototype = function()
	{
		FWDR3DCovSlidersMenuButton.prototype = new FWDR3DCovDisplayObject("div", "absolute", "visible");
	};

	FWDR3DCovSlidersMenuButton.CHANGE = "onChange";
	FWDR3DCovSlidersMenuButton.RESET = "onReset";
	
	FWDR3DCovSlidersMenuButton.prototype = null;
	window.FWDR3DCovSlidersMenuButton = FWDR3DCovSlidersMenuButton;
}(window));