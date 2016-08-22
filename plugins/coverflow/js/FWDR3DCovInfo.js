/* Info screen */
(function (window){
	
	var FWDR3DCovInfo = function(){
		
		var self = this;
		var prototype = FWDR3DCovInfo.prototype;
		
		/* init */
		this.init = function(){
			this.setWidth(500);
			this.setBkColor("#FF0000");
			this.getStyle().padding = "10px";
		};
		
		this.showText = function(txt){
			this.setInnerHTML(txt);
		};
		
		/* destroy */
		this.destroy = function(){

			prototype.destroy();
			FWDR3DCovInfo.prototype = null;
			self = null;
		};
		
		this.init();
	};
		
	/* set prototype */
	FWDR3DCovInfo.setPrototype = function(){
		FWDR3DCovInfo.prototype = new FWDR3DCovDisplayObject("div", "relative");
	};
	
	FWDR3DCovInfo.prototype = null;
	window.FWDR3DCovInfo = FWDR3DCovInfo;
}(window));