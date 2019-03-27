/**
 * 鼠标移动事件
 */
var pointerEvent=function(options){
	this._init(options.map,options.dataLayer,options.popPanel,options.style)
}

pointerEvent.prototype._init=function(map,dataLayer,popPanel,style){
	var self=this;
	self._dataLayer=dataLayer;
	self._style=style;
	self._map=map;
	self._popPanel=popPanel;
	
	var selectClick=new ol.interaction.Select({
		condition : ol.events.condition.click,
		style : self._style,
		filter : function(feature, layer) {
			return layer === self._dataLayer;
		}
	}); 
	
	selectClick.on('select', function(evt) {
		_selectClickFun(evt);
	});
	
	//鼠标移动事件
	var selectPointerMove=new ol.interaction.Select({
		condition : ol.events.condition.pointerMove,
		style : self._style,
		filter : function(feature, layer) {
			return layer === self._dataLayer;
		}
	});
	
	selectPointerMove.on('select', function(evt) {
		_selectPointerMoveFun(evt);
	});
	
	
	//单击事件
	_selectClickFun = function(evt) {
		var feature = evt.selected[0];
		if (feature != undefined) {
			self._popPanel.loadClosePopup(feature.getProperties());
		}
	}
	
	//鼠标移动事件
	_selectPointerMoveFun = function(evt) {
		var feature = evt.selected[0];
		if (feature != undefined) {
			self._popPanel.showPopup(feature.getProperties());
		}else {
			self._popPanel.hidePopup();
		}
	}
	
	self._map.addInteraction(selectPointerMove);
	self._map.addInteraction(selectClick);
	
	//清除选择的要素
	self.clearSelection=function(){
		if(selectClick==undefined)return;
		selectClick.getFeatures().clear();
	}
	
	//移除鼠标事件
	self.removeInteraction=function(){
		self._map.removeInteraction(selectClick);
		self._map.removeInteraction(selectPointerMove);
	}
	
	//添加鼠标事件
	self.addInteraction=function(){
		self._map.addInteraction(selectPointerMove);
		self._map.addInteraction(selectClick);
	}
}