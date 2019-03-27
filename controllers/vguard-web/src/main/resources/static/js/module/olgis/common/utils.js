/**
 * 通用方法工具类
 */
var utils = {};

/*
 * 根据坐标点及缩放级别进行定位
 */
utils.centerAndZoomPoint = function(map, coordinate, zoom) {
	map.getView().setZoom(zoom);
	map.getView().setCenter(coordinate);

}

/*
 * 根据坐标定位
 */
utils.centerPoint = function(map, coordinate) {
	map.getView().setCenter(coordinate);
}

/*
 * 线定位
 * */
utils.centerLine = function(map, line) {
	var extent = line.getExtent();
	map.getView().fit(extent, map.getSize());
}

/*
 * 面定位
 * */
utils.centerPolygon = function(map, polygon) {
	var extent = polygon.getExtent();
	map.getView().fit(extent, map.getSize());
}

/*
 * 范围定位
 * */
utils.centerExtent=function(map,extent){
	map.getView().fit(extent, map.getSize());
}


/*
 * 设置地图的显示范围
 */
utils.setMapView = function(map, view) {
	map.setView(view);
}

//根据终点平移地图
utils.mapPan = function(map, pointCenter) {
	var pan = new ol.animation.pan({
		duration : 200,
		source : (map.getView().getCenter())
	});
	map.beforeRender(pan);
	map.getView().setCenter(pointCenter);
}

/*
 * 坐标转换 3857 --> 4326
 */
utils.projTransfrom = function(point) {
	var point = ol.proj.transform(point,'EPSG:3857', 'EPSG:4326');
	return point;
}

/*
 * 坐标转换 4326 --> 3857
 */
utils.mercTransfrom = function(point) {
	var point = ol.proj.transform(point, 'EPSG:4326' ,'EPSG:3857');
	return point;
}

//清空所有矢量图层
utils.clearVectorLayers=function(map){
	var layers=map.getLayers();
	if(layers==null||layers.getLength()<=0)return;
	layers.forEach(function(layer){
		if(layer.get('tile')=='tile')return;
		layer.getSource().clear();
	});
}

//移除overlaye
utils.removeOverlays=function(map){
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

//移除所有矢量图层
utils.removeVectorLayers=function(map){
	var layers=map.getLayers();
	if(layers==null||layers.getLength()<=0)return;
	layers.forEach(function(layer){
		if(layer.get('tile')=='tile')return;
		map.removeLayer(layer);
	});
}

//移除所有overlaye
/*utils.removeOverlays=function(map){
	var overlays=map.getOverlays();
	if(overlays==null||overlays.getLength()<=0)return;
	overlays.forEach(function(overlay){
		map.removeOverlay(overlay);
	});
}*/

//清除地图上所有
utils.clearMapAll=function(map){
	this.clearVectorLayers(map);
	this.removeOverlays(map);
	this.clearInteractions(map);
}

//获得geojson格式所有数据的范围面
utils.getRegionPolygon=function(regions){
	var envelope=turf.envelope(regions);
	var poly=new ol.geom.Polygon(envelope.geometry.coordinates)
	return poly.transform('EPSG:4326','EPSG:3857');
}

//清除选择的要素
utils.clearInteractions=function(map){
	var interactions=map.getInteractions();
	if(interactions==undefined||interactions.getLength()<=0)return;
	interactions.forEach(function(interaction){
		if(interaction instanceof ol.interaction.Select)interaction.getFeatures().clear();
	});
}

utils.coords2Polygon=function(coords){
	var poly=new ol.geom.Polygon(coords);
	return poly.transform('EPSG:4326','EPSG:3857');
}

