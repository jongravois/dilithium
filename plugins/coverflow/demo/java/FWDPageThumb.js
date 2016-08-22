/* FWDR3DCovPageThumb */
(function (window){
var FWDR3DCovPageThumb = function(id, bWidth, bHeight, nImgUrl, sImgUrl)
{
		var self = this;
		var prototype = FWDR3DCovPageThumb.prototype;
		
		this.id = id;
		
		this.nImgUrl = nImgUrl;
		this.sImgUrl = sImgUrl;
		
		this.n_do;
		this.s_do;
		
		this.totalWidth = bWidth;
		this.totalHeight = bHeight;
		
		this.isMobile_bl = FWDR3DCovUtils.isMobile;
		this.hasPointerEvent_bl = FWDR3DCovUtils.hasPointerEvent;
		
		this.isEnabled = false;
		
		//##########################################//
		/* initialize this */
		//##########################################//
		this.init = function(){
			this.setupMainContainers();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			this.n_do = new FWDR3DCovSimpleDisplayObject("img");
			this.n_do.screen.src = this.nImgUrl;
			this.s_do = new FWDR3DCovSimpleDisplayObject("img");
			this.s_do.screen.src = this.sImgUrl;
			
			this.addChild(this.s_do);
			this.addChild(this.n_do);
			
			this.setWidth(bWidth);
			this.setHeight(bHeight);
			
			this.n_do.setWidth(bWidth);
			this.n_do.setHeight(bHeight);
			
			this.s_do.setWidth(bWidth);
			this.s_do.setHeight(bHeight);
			
			self.enable();
		};
		
		this.onMouseOver = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDR3DCovModTweenMax.to(self.n_do, .9, {alpha:0, ease:Expo.easeOut});
			}
		};
			
		this.onMouseOut = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDR3DCovModTweenMax.to(self.n_do, .9, {alpha:1, ease:Expo.easeOut});
			}
		};
			
		this.onClick = function(e){
			self.dispatchEvent(FWDR3DCovPageThumb.CLICK, {id:self.id});
		};
		
		this.enable = function()
		{
			if (self.isEnabled)
				return;
			
			self.isEnabled = true;
			
			this.setButtonMode(true);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
					self.screen.addEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.addEventListener("touchstart", self.onClick);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mouseup", self.onClick);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmouseup", self.onClick);
			}
			
			FWDR3DCovModTweenMax.to(self, .1, {alpha:1, ease:Expo.easeOut});
		};
		
		this.disable = function()
		{
			if (!self.isEnabled)
				return;

			self.isEnabled = false;
		
			FWDR3DCovModTweenMax.to(self.n_do, .9, {alpha:1, ease:Expo.easeOut});
			
			this.setButtonMode(false);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.removeEventListener("MSPointerOver", self.onMouseOver);
					self.screen.removeEventListener("MSPointerOut", self.onMouseOut);
					self.screen.removeEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.removeEventListener("touchstart", self.onClick);
				}
			}else if(self.screen.removeEventListener){	
				self.screen.removeEventListener("mouseover", self.onMouseOver);
				self.screen.removeEventListener("mouseout", self.onMouseOut);
				self.screen.removeEventListener("mouseup", self.onClick);
			}else if(self.screen.detachEvent){
				self.screen.detachEvent("onmouseover", self.onMouseOver);
				self.screen.detachEvent("onmouseout", self.onMouseOut);
				self.screen.detachEvent("onmouseup", self.onClick);
			}
			
			FWDR3DCovModTweenMax.to(self, .1, {alpha:.2, ease:Expo.easeOut});
		};
		
		//##############################//
		/* destroy */
		//##############################//
		this.destroy = function(){
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.removeEventListener("MSPointerOver", self.onMouseOver);
					self.screen.removeEventListener("MSPointerOut", self.onMouseOut);
					self.screen.removeEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.removeEventListener("touchstart", self.onClick);
				}
			}else if(self.screen.removeEventListener){	
				self.screen.removeEventListener("mouseover", self.onMouseOver);
				self.screen.removeEventListener("mouseout", self.onMouseOut);
				self.screen.removeEventListener("mouseup", self.onClick);
			}else if(self.screen.detachEvent){
				self.screen.detachEvent("onmouseover", self.onMouseOver);
				self.screen.detachEvent("onmouseout", self.onMouseOut);
				self.screen.detachEvent("onmouseup", self.onClick);
			}
			
			FWDR3DCovModTweenMax.killTweensOf(self.n_do);
			
			self.n_do.destroy();
			self.s_do.destroy();
			
			self.nImgUrl = null;
			self.sImgUrl = null;
			
			self.n_do = null;
			self.s_do = null;
			
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDR3DCovPageThumb.prototype = null;
		};
	
		this.init();
	};
	
	/* set prototype */
	FWDR3DCovPageThumb.setPrototype = function(){
		FWDR3DCovPageThumb.prototype = new FWDR3DCovDisplayObject("div");
	};
	
	FWDR3DCovPageThumb.CLICK = "onClick";
	
	FWDR3DCovPageThumb.prototype = null;
	window.FWDR3DCovPageThumb = FWDR3DCovPageThumb;
}(window));