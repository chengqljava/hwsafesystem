var flyLineRoute = function(option){
	this._scene = option.scene;
	this._sceneControl = option.sceneControl;
	this._flyManager=option.flyManager;
	this._filepath_1=option.filepath_1;
	this._speedInput=option.speedInput;
	this._linesCheckbox = option.linesCheckbox;
	this._stopsCheckbox = option.stopsCheckbox;
	self = this;
	this.flyRoutes = null;
    this.flyRoute = null;
    
	if (self._flyManager != null) {
        if (self._flyManager.get_flyStatus() == SuperMap.Web.Realspace.FlyStatus.FSTOP) {
            //获取飞行路线
            this.flyRoutes = self._flyManager.get_routes();
            if (this.flyRoutes != null) {
                var filePath = self._filepath_1;
                if (this.flyRoutes.fromFile(filePath) == false) {
                    return false;
                }
                this.flyRoute = this.flyRoutes.get_currentRoute();
                
                //this.flyRoute.set_speed(this._speed);
                this.flyRoute.set_speed(this._speedInput.val());
                this.flyRoute.set_isLinesVisible(this._linesCheckbox.prop("checked"));
                this.flyRoute.set_isStopsVisible(this._stopsCheckbox.prop("checked"));
                
                this._speedInput.change(function() {
                	//alert(self._speedInput.val());
            		self.flyRoute.set_speed(self._speedInput.val());
            		}); 
            	
            	this._linesCheckbox.change(function() {
            		self.flyRoute.set_isLinesVisible(self._linesCheckbox.prop("checked"));
            		}); 
            	this._stopsCheckbox.change(function() {
            		self.flyRoute.set_isStopsVisible(self._stopsCheckbox.prop("checked"));
            		});
                //routeLoaded = true;
            }
        }
    }

};

flyLineRoute.prototype={
		//开始飞行
    play:function(){

    	if (self._flyManager == null && this.flyRoutes == null &&
    			self._flyManager.get_flyStatus() == SuperMap.Web.Realspace.FlyStatus.FPLAY) {
    	        return;
    	     }
    	else {               
    	        self._flyManager.play();
    	     }
    },
    //暂停飞行
    pause:function(){
    	if (self._flyManager == null)
            return;
    	self._flyManager.pause();
    },
  //停止飞行
    stop:function() {
        if (self._flyManager == null)
            return;
        self._flyManager.stop();
    }
    
    
}