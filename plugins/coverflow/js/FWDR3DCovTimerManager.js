/* Slide show time manager */
(function(window){
	
	var FWDR3DCovTimerManager = function(delay, autoplay){
		
		var self = this;
		var prototpype = FWDR3DCovTimerManager.prototype;
		
		this.timeOutId;
		this.delay = delay;
		this.isStopped_bl = !autoplay;
		
		this.stop = function(){
			clearTimeout(this.timeOutId);
			this.dispatchEvent(FWDR3DCovTimerManager.STOP);
		};
		
		this.start = function(){
			if(!this.isStopped_bl){
				this.timeOutId = setTimeout(this.onTimeHanlder, this.delay);
				this.dispatchEvent(FWDR3DCovTimerManager.START);
			}
		};
		
		this.onTimeHanlder = function(){
			self.dispatchEvent(FWDR3DCovTimerManager.TIME);
		};
		
		/* destroy */
		this.destroy = function(){
			
			clearTimeout(this.timeOutId);
			
			prototpype.destroy();
			self = null;
			prototpype = null;
			FWDR3DCovTimerManager.prototype = null;
		};
	};

	FWDR3DCovTimerManager.setProtptype = function(){
		FWDR3DCovTimerManager.prototype = new FWDR3DCovEventDispatcher();
	};
	
	FWDR3DCovTimerManager.START = "start";
	FWDR3DCovTimerManager.STOP = "stop";
	FWDR3DCovTimerManager.TIME = "time";
	
	FWDR3DCovTimerManager.prototype = null;
	window.FWDR3DCovTimerManager = FWDR3DCovTimerManager;
	
}(window));