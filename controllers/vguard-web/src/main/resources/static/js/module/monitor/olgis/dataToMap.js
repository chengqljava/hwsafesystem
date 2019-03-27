var DataToMap = function(datas){

		this._features = this.datasToFeature(datas);

	
	
	//数据集合
	if(this._features!=undefined||this._features.length>=0){
		this.dataSource= new ol.source.Vector({
	        features: this._features
	
	    });
	}
		
		this.dataLayer=new ol.layer.Vector({
			source : this.dataSource,
			style : new ol.style.Style({
				image : new ol.style.Icon({
					anchor : [ 0.35, 0.7 ],
					src : BASE_URL + '/images/gis/whqy.png',
					size : [ 24, 23 ],
					scale : 1
				})
			})
		});
		app.map.addLayer(this.dataLayer);

};
DataToMap.prototype = {
		
		datasToFeature:function(datas){
			var features=[];
			for(var key in datas){
				var item=datas[key];
				if (item.LONGITUDE == undefined
						|| item.LATITUDE == undefined)
					return;
				var feature=new ol.Feature();
				var point = new ol.geom.Point(ol.proj.fromLonLat([ parseFloat(item.LONGITUDE),
			                                                       parseFloat(item.LATITUDE)]));
				feature.setProperties(item);
				feature.setGeometry(point);
				
				features.push(feature);
			}
			return features;
		},
		
		setData : function(datas){
			app.popPanel.closeClosePopup();
			this._features = [];
			this.dataSource.clear();
			this._features = this.datasToFeature(datas);
			this.dataSource.addFeatures(this._features);
		
		},
		clearAlarmData : function(){
			//清除报警数据的地图数据集
			app.alarmDataSource.clear();
			//	清除报警数据的闪烁图层
			var overlays=app.map.getOverlays();
			overlays.forEach(function(overlay){
				if(overlay.get('tiled')=='tiled')
					app.map.removeOverlay(overlay);
			})
		},
		getDataLayer:function(){
			return this.dataLayer;
		},
		//清空所有矢量图层
		clearVectorLayers:function(map){
			var layers=map.getLayers();
			if(layers==null||layers.getLength()<=0)return;
			layers.forEach(function(layer){
				if(layer.get('tile')=='tile')return;
				layer.getSource().clear();
			});
		},

		//移除overlaye
		removeOverlays:function(map){
			var overlays=map.getOverlays();
			if(overlays==null||overlays.getLength()<=0)return;
			overlays.forEach(function(overlay){
				var id=overlay.getId();
				if(id=='closePopupOverlay'||id=='popupOverlay'){
					overlay.setPosition(undefined);
					$(overlay.getElement()).blur();
					return;
				}
				map.removeOverlay(overlay);
			});
		}
		
}