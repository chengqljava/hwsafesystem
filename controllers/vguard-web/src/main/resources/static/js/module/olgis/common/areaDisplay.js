/*读取json中区域范围数据，返回区域边界坐标数组；
根据区域范围的名字返回该范围polygon；并将其加载在地图上*/

var areaDisplay = function(){
	var _self = this;
	
	this.init = function(){
		
		this.areaData;
		
		$.ajax({
	    	url : "../../js/module/olgis/configs/310100.json",
	    	type : "GET",
	    	dataType : "json",
	    	async : false,
	    	success : function(data) {
	    		var map = data.features;
	    		areaData = map;
	    		
	    	},
	    	error : function(err) {
	    		console.log("网络异常");
	    		console.log(err);
	    	}
		});
		return areaData;
	}
	

	//区域数据样式
	var styleutils=new styleUtils();
	var areaStyle=styleutils.getAreaStyle();
	
	var areaSource = new ol.source.Vector();
	var areaLayer;
	//显示区域根据区域名称
	this.displayArea = function(param){
		var areaPolygon = new ol.geom.Polygon(param.geom.coordinates[0]);
		var polygonFeature = new ol.Feature(areaPolygon.transform('EPSG:4326', 'EPSG:3857'));
		areaSource.clear();

		if (areaLayer == undefined) {
			areaLayer = new ol.layer.Vector({
				source : areaSource,
				style : areaStyle
			});

			app.map.addLayer(areaLayer);
		}
		areaSource.addFeature(polygonFeature);
		utils.centerPolygon(app.map,areaPolygon);
		return areaPolygon;
		
	}
	
	//清除区域layer
	this.clearArea = function(){
		areaSource.clear();
	}

}