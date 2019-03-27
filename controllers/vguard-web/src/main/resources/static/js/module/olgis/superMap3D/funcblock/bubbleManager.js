/*气泡的生成，初始化，重置以及关闭管理*/
var bubbleManager = function(option){
	this._sceneControl = option.sceneControl;
	this._scene = option.scene;
};

bubbleManager.prototype = {
	createBubble : function(pos){
			try{
				var bubble = new SuperMap.Web.Realspace.Bubble();
				bubble.set_pointer(pos);
			    bubble.set_frameWidth(1);
			    bubble.set_roundQuality(1);	
			    bubble.set_backColor(new SuperMap.Web.Core.Color(33,33,33,255));
				bubble.set_frameColor(new SuperMap.Web.Core.Color(33,33,33,255));
				bubble.set_height(358);
				bubble.set_width(490);
				//bubble.set_isAutoHide(true);
				this._sceneControl.get_bubbles().removeAll();
				this._sceneControl.get_bubbles().add(bubble);
				return bubble;
				}
			catch(e){
					new Error("创建气泡失败");
				}
		},
		bubbleInitialize : function(bubble){
			try{
				var frameInfo = document.getElementById("infoWindow");   
		        frameInfo.contentWindow.popupContent(infoFlag,fieldInfo);
		        frameInfo.frameborder = 0;
		        frameInfo.style.marginwidth = 0;
		        frameInfo.style.marginheight = 0;
		        frameInfo.style.width = bubble.get_clientWidth()+"px";
		        frameInfo.style.height = bubble.get_clientHeight()+"px";
		        frameInfo.style.left = bubble.get_clientLeft() + this._sceneControl.get_controlOffsetX()+"px";
		        frameInfo.style.top = bubble.get_clientTop() + this._sceneControl.get_controlOffsetY()+"px";
		        frameInfo.style.display = "block";
			}
			catch(e){
				new Error("气泡初始化失败！");
			}
		},
		bubbleResize : function(bubble){
			try
			{
				var frameInfo = document.getElementById("infoWindow");
				frameInfo.contentWindow.popupContent(infoFlag,fieldInfo);
				frameInfo.style.width = bubble.get_clientWidth()+"px";
				frameInfo.style.height = bubble.get_clientHeight()+"px";
				frameInfo.style.left = bubble.get_clientLeft() + this._sceneControl.get_controlOffsetX()+"px";
				frameInfo.style.top = bubble.get_clientTop() + this._sceneControl.get_controlOffsetY()+"px";
				frameInfo.style.display = "block";
			}
			catch(e)
			{
				new Error("气泡重置失败！");
			}
		},
		bubbleClose : function(bubble){
			try
			{
				var frameInfo = document.getElementById("infoWindow");
				frameInfo.style.display = "none";
				var selection3Ds = this._scene.findSelection3Ds(true);
				if (selection3Ds.length > 0) {
					for(var i = 0; i <= selection3Ds.length - 1; i++){
						selection3Ds[i].removeAll();
					}
				}
			}
			catch(e){
				new Error("关闭气泡失败！");
			}
		}
}






