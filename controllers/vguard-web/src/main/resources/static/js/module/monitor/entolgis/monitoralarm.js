/**
 * 监测报警
 */
MonitorAlarm = function(datas){
	this.data = datas[0];
	this.dataLayer;
	var self = this;
	window.onload=function(){
		self.refreshMonitorDatas();
		clearInterval(app.timeAlarmTicket);
		app.timeAlarmTicket= setInterval(function (){
			self.refreshMonitorDatas();
		}, 5000);
		
	}
};



MonitorAlarm.prototype = {

	refreshMonitorDatas : function(){
		var data = this.data;
		var id = data.BUSINESSINFOID;
		var probeData=monitordatas.loadMacProbeList(id);
		var flag = this._getProbeItems(probeData);
		
		if(flag == true){
			//alert("qiye tibiao biangong shanshuo");
			var overlays=app.map.getOverlays();
			overlays.forEach(function(overlay){
				if(overlay.get('tiled')=='tiled')
					app.map.removeOverlay(overlay);
			})
			var feature=new ol.Feature();
			var point=new ol.geom.Point(ol.proj.transform([parseFloat(data.LONGITUDE),parseFloat(data.LATITUDE)],'EPSG:4326','EPSG:3857'));
			feature.setGeometry(point);
			
			var point_div=document.createElement('div');
			point_div.className="css_animation";
			point_div.id="count";
			$('.map').append(point_div);
			if(point_div==null){
				point_div=document.createElement('div');
				point_div.className="css_animation";
				point_div.id=count;
				document.getElementsByTagName("body")[0].appendChild(point_div);
			}
			var point_overlay = new ol.Overlay({
				id:"count",
				element: point_div,
				positioning: 'center-center',
				stopEvent: false
			});
			//insertFirst:false,
			point_overlay.set("tiled","tiled");
			app.map.addOverlay(point_overlay);
			point_overlay.setPosition(point.getCoordinates());
			
			if(this.dataLayer==null){
				this.dataLayer=new ol.layer.Vector({
					source:new ol.source.Vector(),
					style:new ol.style.Style({
						image : new ol.style.Icon({
							anchor : [ 0.32, 0.6 ],
							src : BASE_URL + '/images/gis/buss.png',
							size : [ 32, 29 ],
							scale : 1
						})
					})
				});
				app.map.addLayer(this.dataLayer);
			}
			app.alarmDataSource = this.dataLayer.getSource();
			app.alarmDataSource.addFeature(feature);
			
			
		}
	},

	_getProbeItems:function(datas){
		var flag= false;
		for(var key in datas){
			var item=datas[key];
			switch(item.STATE){
				case "3":
				case "99":
				case "7":
					flag = true;
					break;	
				case "100":					
				case "101":
				case "102":
					flag = true;
					break;
			}
		}
		return flag;
	}

}

