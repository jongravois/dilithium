/* FWDR3DCovSlidersMenu */
(function (window){
var FWDR3DCovSlidersMenu = function(parent, sValues, data)
{
		var self = this;
		var prototype = FWDR3DCovSlidersMenu.prototype;
		
		this.parent = parent;
		
		this.slidersValues = sValues;
		this.menuButtons_ar = [];

		this.buttonsHolder_do = null;
		
		this.stageWidth;
		this.stageHeight;
		this.maxWidth = 970;
		this.buttonsHolderWidth = 200;
		this.buttonsBarOriginalHeight = 70;
		this.totalHeight = 0;
		this.buttonsBarTotalHeight = 200;
		this.totalButtons;
		this.totalHeight = 200;
		this.spacerWidth = 2;
		this.spacerHeight = 11;
		this.hSpace = 2;
		this.vSpace = 36;
		this.minMarginXSpace = 12;
		this.startY = 8;

		this.init = function()
		{
			self.parent.style.height = "10px";
			self.parent.appendChild(self.screen);
			
			if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
			{
				if (FWDR3DCovUtils.hasTransform3d)
				{
					self.nrOfSliders = 5;
					self.totalButtons = 9;
					
					self.setupSliderButtons3D1();
				}
				else
				{
					self.nrOfSliders = 2;
					self.totalButtons = 6;
					
					self.setupSliderButtons2D1();
				}
			}
			else
			{
				if (FWDR3DCovUtils.hasTransform3d)
				{
					self.nrOfSliders = 5;
					self.totalButtons = 7;
					
					self.setupSliderButtons3D2();
				}
				else
				{
					self.nrOfSliders = 2;
					self.totalButtons = 4;
					
					self.setupSliderButtons2D2();
				}
			}
			
			self.positionSlidersId = setTimeout(self.positionSliderButtons, 50);
		};
			
		this.positionAndResize = function(viewportWidth)
		{
			if (self.viewportWidth == viewportWidth) return;
		
			self.viewportWidth = viewportWidth;
			self.stageWidth = viewportWidth;
			
			self.positionSliderButtons();
		};
		
		this.setupSliderButtons3D1 = function()
		{	
			var sliderButton;
			
			self.buttonsHolder_do = new FWDR3DCovDisplayObject("div");
			self.buttonsHolder_do.getStyle().backgroundPosition = "0% 100%";
			self.buttonsHolder_do.setBkColor(self.buttonsHolderBackgroundColor_str);
			self.buttonsHolder_do.setWidth(self.buttonsHolderWidth);
			self.buttonsHolder_do.setHeight(self.buttonsBarOriginalHeight);
			self.addChild(self.buttonsHolder_do);
			
			for(var i=0; i<self.totalButtons; i++)
			{
				FWDR3DCovSlidersMenuButton.setPrototype();
				
				var propsObj = {};
				
				propsObj.id = i;
				propsObj.nrOfSliders = self.nrOfSliders;
				propsObj.totalButtons = self.totalButtons;
				
				switch (i)
				{
					case 0:
						propsObj.sliderMinValue = 40;
						propsObj.sliderMaxValue = 180;
						propsObj.sliderValue = self.slidersValues[0];
						propsObj.text = "Central thumb sides spacing";
						break;
					case 1:
						propsObj.sliderMinValue = 1;
						propsObj.sliderMaxValue = 180;
						propsObj.sliderValue = self.slidersValues[1];
						propsObj.text = "Side thumbs spacing";
						break;
					case 2:
						propsObj.sliderMinValue = 1;
						propsObj.sliderMaxValue = 90;
						propsObj.sliderValue = self.slidersValues[2];
						propsObj.text = "Side thumbs Y axis rotation";
						break;
					case 3:
						propsObj.sliderMinValue = 30;
						propsObj.sliderMaxValue = 300;
						propsObj.sliderValue = self.slidersValues[3];
						propsObj.text = "Central thumb sides depth";
						break;
					case 4:
						propsObj.sliderMinValue = 50;
						propsObj.sliderMaxValue = 200;
						propsObj.sliderValue = self.slidersValues[4];
						propsObj.text = "Side thumbs perspective depth";
						break;
					case 5:
						propsObj.text = "Number of side thumbs to display";
						propsObj.value = self.slidersValues[5];
						break;
					case 6:
						propsObj.value = self.slidersValues[9];
						propsObj.text = "Show reflection";
						break;
					case 7:
						propsObj.sliderMinValue = 0;
						propsObj.sliderMaxValue = 100;
						propsObj.sliderValue = self.slidersValues[10];
						propsObj.text = "Reflection distance";
						break;
					case 8:
						propsObj.text = "Configuration reset";
						break;
				}
				
				sliderButton = new FWDR3DCovSlidersMenuButton(propsObj);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.CHANGE, self.sliderButtonChangeHandler3D1);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.RESET, self.reset1);
				
				self.menuButtons_ar[i] = sliderButton;
				self.buttonsHolder_do.addChild(sliderButton);
			}
		};
		
		this.sliderButtonChangeHandler3D1 = function()
		{
			if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					yAngle:self.menuButtons_ar[2].value,
					zOffset:self.menuButtons_ar[3].value,
					zSpace:self.menuButtons_ar[4].value,
					nrThumbs:self.menuButtons_ar[5].value,
					showRefl:self.menuButtons_ar[6].value,
					reflDist:self.menuButtons_ar[7].value
				});
			}
			else
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					yAngle:self.menuButtons_ar[2].value,
					zOffset:self.menuButtons_ar[3].value,
					zSpace:self.menuButtons_ar[4].value,
					nrThumbs:self.menuButtons_ar[5].value,
				});
			}
		};
		
		this.setupSliderButtons2D1 = function()
		{	
			var sliderButton;
			
			self.buttonsHolder_do = new FWDR3DCovDisplayObject("div");
			self.buttonsHolder_do.getStyle().backgroundPosition = "0% 100%";
			self.buttonsHolder_do.setBkColor(self.buttonsHolderBackgroundColor_str);
			self.buttonsHolder_do.setWidth(self.buttonsHolderWidth);
			self.buttonsHolder_do.setHeight(self.buttonsBarOriginalHeight);
			self.addChild(self.buttonsHolder_do);
			
			for(var i=0; i<self.totalButtons; i++)
			{
				FWDR3DCovSlidersMenuButton.setPrototype();
				
				var propsObj = {};
				
				propsObj.id = i;
				propsObj.nrOfSliders = self.nrOfSliders;
				propsObj.totalButtons = self.totalButtons;
				
				switch (i)
				{
					case 0:
						propsObj.sliderMinValue = 10;
						propsObj.sliderMaxValue = 80;
						propsObj.sliderValue = self.slidersValues[6];
						propsObj.text = "Central thumb sides spacing";
						break;
					case 1:
						propsObj.sliderMinValue = 10;
						propsObj.sliderMaxValue = 100;
						propsObj.sliderValue = self.slidersValues[7];
						propsObj.text = "Side thumbs spacing";
						break;
					case 2:
						propsObj.text = "Number of side thumbs to display";
						propsObj.value = self.slidersValues[8];
						break;
					case 3:
						propsObj.value = self.slidersValues[9];
						propsObj.text = "Show reflection";
						break;
					case 4:
						propsObj.sliderMinValue = 0;
						propsObj.sliderMaxValue = 100;
						propsObj.sliderValue = self.slidersValues[10];
						propsObj.text = "Reflection distance";
						break;
					case 5:
						propsObj.text = "Configuration reset";
						break;
				}
				
				sliderButton = new FWDR3DCovSlidersMenuButton(propsObj);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.CHANGE, self.sliderButtonChangeHandler2D1);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.RESET, self.reset1);
				
				self.menuButtons_ar[i] = sliderButton;
				self.buttonsHolder_do.addChild(sliderButton);
			}
		};
		
		this.sliderButtonChangeHandler2D1 = function()
		{
			if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					nrThumbs:self.menuButtons_ar[2].value,
					showRefl:self.menuButtons_ar[3].value,
					reflDist:self.menuButtons_ar[4].value
				});
			}
			else
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					nrThumbs:self.menuButtons_ar[2].value
				});
			}
		};
		
		this.reset1 = function()
		{
			if (FWDR3DCovUtils.hasTransform3d)
			{
				self.menuButtons_ar[0].setValue(self.slidersValues[0]);
				self.menuButtons_ar[1].setValue(self.slidersValues[1]);
				self.menuButtons_ar[2].setValue(self.slidersValues[2]);
				self.menuButtons_ar[3].setValue(self.slidersValues[3]);
				self.menuButtons_ar[4].setValue(self.slidersValues[4]);
				self.menuButtons_ar[5].setValue(self.slidersValues[5]);
				
				if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
				{
					self.menuButtons_ar[6].setValue(self.slidersValues[9]);
					self.menuButtons_ar[7].setValue(self.slidersValues[10]);
				}
				
				self.sliderButtonChangeHandler3D1();
			}
			else
			{
				self.menuButtons_ar[0].setValue(self.slidersValues[6]);
				self.menuButtons_ar[1].setValue(self.slidersValues[7]);
				self.menuButtons_ar[2].setValue(self.slidersValues[8]);
				
				if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
				{
					self.menuButtons_ar[3].setValue(self.slidersValues[9]);
					self.menuButtons_ar[4].setValue(self.slidersValues[10]);
				}
				
				self.sliderButtonChangeHandler2D1();
			}
		};

		this.setupSliderButtons3D2 = function()
		{	
			var sliderButton;
			
			self.buttonsHolder_do = new FWDR3DCovDisplayObject("div");
			self.buttonsHolder_do.getStyle().backgroundPosition = "0% 100%";
			self.buttonsHolder_do.setBkColor(self.buttonsHolderBackgroundColor_str);
			self.buttonsHolder_do.setWidth(self.buttonsHolderWidth);
			self.buttonsHolder_do.setHeight(self.buttonsBarOriginalHeight);
			self.addChild(self.buttonsHolder_do);
			
			for(var i=0; i<self.totalButtons; i++)
			{
				FWDR3DCovSlidersMenuButton.setPrototype();
				
				var propsObj = {};
				
				propsObj.id = i;
				propsObj.nrOfSliders = self.nrOfSliders;
				propsObj.totalButtons = self.totalButtons;
				
				switch (i)
				{
					case 0:
						propsObj.sliderMinValue = 40;
						propsObj.sliderMaxValue = 180;
						propsObj.sliderValue = self.slidersValues[0];
						propsObj.text = "Central thumb sides spacing";
						break;
					case 1:
						propsObj.sliderMinValue = 1;
						propsObj.sliderMaxValue = 180;
						propsObj.sliderValue = self.slidersValues[1];
						propsObj.text = "Side thumbs spacing";
						break;
					case 2:
						propsObj.sliderMinValue = 1;
						propsObj.sliderMaxValue = 90;
						propsObj.sliderValue = self.slidersValues[2];
						propsObj.text = "Side thumbs Y axis rotation";
						break;
					case 3:
						propsObj.sliderMinValue = 30;
						propsObj.sliderMaxValue = 300;
						propsObj.sliderValue = self.slidersValues[3];
						propsObj.text = "Central thumb sides depth";
						break;
					case 4:
						propsObj.sliderMinValue = 50;
						propsObj.sliderMaxValue = 200;
						propsObj.sliderValue = self.slidersValues[4];
						propsObj.text = "Side thumbs perspective depth";
						break;
					case 5:
						propsObj.text = "Number of side thumbs to display";
						propsObj.value = self.slidersValues[5];
						break;
					case 6:
						propsObj.text = "Configuration reset";
						break;
				}
				
				sliderButton = new FWDR3DCovSlidersMenuButton(propsObj);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.CHANGE, self.sliderButtonChangeHandler3D2);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.RESET, self.reset2);
				
				self.menuButtons_ar[i] = sliderButton;
				self.buttonsHolder_do.addChild(sliderButton);
			}
		};
		
		this.sliderButtonChangeHandler3D2 = function()
		{
			if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					yAngle:self.menuButtons_ar[2].value,
					zOffset:self.menuButtons_ar[3].value,
					zSpace:self.menuButtons_ar[4].value,
					nrThumbs:self.menuButtons_ar[5].value,
					showRefl:self.menuButtons_ar[6].value,
					reflDist:self.menuButtons_ar[7].value
				});
			}
			else
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					yAngle:self.menuButtons_ar[2].value,
					zOffset:self.menuButtons_ar[3].value,
					zSpace:self.menuButtons_ar[4].value,
					nrThumbs:self.menuButtons_ar[5].value
				});
			}
		};
		
		this.setupSliderButtons2D2 = function()
		{	
			var sliderButton;
			
			self.buttonsHolder_do = new FWDR3DCovDisplayObject("div");
			self.buttonsHolder_do.getStyle().backgroundPosition = "0% 100%";
			self.buttonsHolder_do.setBkColor(self.buttonsHolderBackgroundColor_str);
			self.buttonsHolder_do.setWidth(self.buttonsHolderWidth);
			self.buttonsHolder_do.setHeight(self.buttonsBarOriginalHeight);
			self.addChild(self.buttonsHolder_do);
			
			for(var i=0; i<self.totalButtons; i++)
			{
				FWDR3DCovSlidersMenuButton.setPrototype();
				
				var propsObj = {};
				
				propsObj.id = i;
				propsObj.nrOfSliders = self.nrOfSliders;
				propsObj.totalButtons = self.totalButtons;
				
				switch (i)
				{
					case 0:
						propsObj.sliderMinValue = 10;
						propsObj.sliderMaxValue = 80;
						propsObj.sliderValue = self.slidersValues[6];
						propsObj.text = "Central thumb sides spacing";
						break;
					case 1:
						propsObj.sliderMinValue = 10;
						propsObj.sliderMaxValue = 100;
						propsObj.sliderValue = self.slidersValues[7];
						propsObj.text = "Side thumbs spacing";
						break;
					case 2:
						propsObj.text = "Number of side thumbs to display";
						propsObj.value = self.slidersValues[8];
						break;
					case 3:
						propsObj.text = "Configuration reset";
						break;
				}
				
				sliderButton = new FWDR3DCovSlidersMenuButton(propsObj);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.CHANGE, self.sliderButtonChangeHandler2D2);
				sliderButton.addListener(FWDR3DCovSlidersMenuButton.RESET, self.reset2);
				
				self.menuButtons_ar[i] = sliderButton;
				self.buttonsHolder_do.addChild(sliderButton);
			}
		};
		
		this.sliderButtonChangeHandler2D2 = function()
		{
			if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					nrThumbs:self.menuButtons_ar[2].value,
					showRefl:self.menuButtons_ar[3].value,
					reflDist:self.menuButtons_ar[4].value
				});
			}
			else
			{
				self.dispatchEvent(FWDR3DCovSlidersMenu.CHANGE,
				{
					xOffset:self.menuButtons_ar[0].value,
					xSpace:self.menuButtons_ar[1].value,
					nrThumbs:self.menuButtons_ar[2].value
				});
			}
		};
		
		this.reset2 = function()
		{
			if (FWDR3DCovUtils.hasTransform3d)
			{
				self.menuButtons_ar[0].setValue(self.slidersValues[0]);
				self.menuButtons_ar[1].setValue(self.slidersValues[1]);
				self.menuButtons_ar[2].setValue(self.slidersValues[2]);
				self.menuButtons_ar[3].setValue(self.slidersValues[3]);
				self.menuButtons_ar[4].setValue(self.slidersValues[4]);
				self.menuButtons_ar[5].setValue(self.slidersValues[5]);
				
				if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
				{
					self.menuButtons_ar[6].setValue(self.slidersValues[9]);
					self.menuButtons_ar[7].setValue(self.slidersValues[10]);
				}
				
				self.sliderButtonChangeHandler3D2();
			}
			else
			{
				self.menuButtons_ar[0].setValue(self.slidersValues[6]);
				self.menuButtons_ar[1].setValue(self.slidersValues[7]);
				self.menuButtons_ar[2].setValue(self.slidersValues[8]);
				
				if (!FWDR3DCovUtils.isMobile && !FWDR3DCovUtils.isIEAndLessThen9 && !data.showThumbnailsHtmlContent)
				{
					self.menuButtons_ar[3].setValue(self.slidersValues[9]);
					self.menuButtons_ar[4].setValue(self.slidersValues[10]);
				}
				
				self.sliderButtonChangeHandler2D2();
			}
		};
		
		//###################################################//
		/* position slider buttons */
		//###################################################//
		this.positionSliderButtons = function()
		{
			if(isNaN(self.stageWidth)) return;
			
			var button;
			var prevButton;
			var rowsAr = [];
			var rowsWidthAr = [];
			var tempX;
			var tempY = self.startY;
			var maxY = 0;
			var totalRowWidth = 0;
			var rowsNr = 0;
			var spacerCount = 0;
			
			self.buttonsHolderWidth = self.stageWidth;
			
			rowsAr[rowsNr] = [0];
			rowsWidthAr[rowsNr] = self.menuButtons_ar[0].totalWidth;
			
			for (var i=1; i<self.totalButtons; i++)
			{	
				button = self.menuButtons_ar[i];
				
				if (rowsWidthAr[rowsNr] + button.totalWidth + self.hSpace > Math.min(self.stageWidth, self.maxWidth) - self.minMarginXSpace)
				{	
					rowsNr++;
					rowsAr[rowsNr] = [];
					rowsAr[rowsNr].push(i);
					rowsWidthAr[rowsNr] = button.totalWidth;
				}
				else
				{
					rowsWidthAr[rowsNr] += button.totalWidth + self.hSpace;
					rowsAr[rowsNr].push(i);
				}
			}
			
			for (var i=0; i<rowsNr + 1; i++)
			{
				var rowMarginXSpace = parseInt((self.buttonsHolderWidth - rowsWidthAr[i])/2);
				
				if (i > 0) tempY += button.totalHeight + self.vSpace;
					
				for (var j=0; j<rowsAr[i].length; j++)
				{
					button = self.menuButtons_ar[rowsAr[i][j]];
					
					if (j == 0)
					{
						tempX = rowMarginXSpace;
					}
					else
					{
						prevButton = self.menuButtons_ar[rowsAr[i][j] - 1];
						tempX = prevButton.finalX + prevButton.totalWidth + self.hSpace;
					}
					
					button.finalX = tempX;
					button.finalY = tempY + 4;
						
					if (maxY < button.finalY)
						maxY = button.finalY;
					
					self.buttonsBarTotalHeight = maxY + button.totalHeight + self.startY + 7;
					
					button.setX(button.finalX);
					button.setY(button.finalY);
				}
			}
			
			self.totalHeight = self.buttonsBarTotalHeight;  
			self.buttonsHolder_do.setWidth(self.buttonsHolderWidth);
			self.buttonsHolder_do.setHeight(self.buttonsBarTotalHeight + 15);
			
			self.setX(parseInt((self.viewportWidth - self.stageWidth)/2));
			self.parent.style.height = (self.totalHeight + 15) + "px";
		};
		
		this.disable = function()
		{
			for(var i=0; i<self.totalButtons; i++)
			{
				self.menuButtons_ar[i].disable();
			}
		};
		
		this.enable = function()
		{
			for(var i=0; i<self.totalButtons; i++)
			{
				self.menuButtons_ar[i].enable();
			}
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDR3DCovSlidersMenu.setPrototype = function(){
		FWDR3DCovSlidersMenu.prototype = new FWDR3DCovDisplayObject("div", "absolute", "visible");
	};
	
	FWDR3DCovSlidersMenu.CHANGE = "onChange";

	FWDR3DCovSlidersMenu.prototype = null;
	window.FWDR3DCovSlidersMenu = FWDR3DCovSlidersMenu;
}(window));