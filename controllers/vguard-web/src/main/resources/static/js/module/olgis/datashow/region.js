/**
 * 区域范围图层
 */
var RegionVectorLayer=function(map){
	this._map=map;
	this._regionPoly=null;
	this._regionData=null;
	this._distCode=null;
	this._init();
}

RegionVectorLayer.prototype._init=function(){
	var self=this;
	
	var areadisplay = new areaDisplay();
	var regionData = areadisplay.init();
	this._regionData=regionData;
	_loadDropdown();
	
	function _loadDropdown(){
		if(regionData==undefined)return;
		var map=regionData;
		for(var i=0;i<map.length;i++){
			var name = map[i].properties.name;
			/*var alink = $("<a>" +name+ "</a>");
			var myli=$('<li>');
			myli.append(alink);
			$("#City").append(myli);*/
			var opt=$("<option></option>").text(name);
			$("#city").append(opt);
		}
		//var text=$("#city").find("option:selected").text()
	}
	
	function _getRegion(name){
		var regionItem;
		self._regionData.every(function(item){
			if(item.properties.name==name){
				regionItem=item;
				return false;
			}
			return true;
		});
		return regionItem;
	}
	
	self.getDistCode=function(name){
		var regionItem=_getRegion(name);
		if(regionItem==undefined)return null;
		return regionItem.properties.id;
	}
	
	self.getRegion=function(name){
		var regionItem=_getRegion(name);
		if(regionItem==undefined)return null;
		return regionItem;
	}
	
	//显示区域
	self.display=function(param){
		self._regionPoly = areadisplay.displayArea(param);
		return self._regionPoly;
	}
	
	self.centerPoly=function(){
		utils.centerPolygon(this._map,self._regionPoly);
	}
	
	self.getRegionData=function(){
		return regionData;
	}
	
	self.clearFeature=function(){
		areadisplay.clearArea();
	}
	
	//获取区域内资源数据
	self.getDatas=function(data){
		if(regionPoly==undefined)return null;
		var map={};
		for(var key in data){
			var item=data[key];
			var point = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					"type": "Point",
					"coordinates": [item.LONGITUDE,item.LATITUDE]
				}
			};
			var poly = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					 "type": "Polygon",
					 "coordinates": regionPoly.getCoordinates()
				 }
			};
			if(turf.inside(point, poly)){
				map[key]=item;
			}
		}
		return map;
	}
}