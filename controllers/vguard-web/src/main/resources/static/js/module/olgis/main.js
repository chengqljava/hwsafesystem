/**
 * 
 */
/*
 * 读取配置文件
 */
var app = this;
var mapParams;
var viewParams;
var ovmapParams;
var mousePostionParams;
app.measureLayer;

$.ajax({
	url : "../../js/module/olgis/configs/config.json",
	type : "GET",
	dataType : "json",
	async : false,
	success : function(data) {
		app.maps=mapParams=data.map;
		viewParams=data.map.view;
		ovmapParams=data.overviewMap;
		mousePostionParams=data.mousePositionControl;
	},
	error : function(err) {
		console.log("读取配置文件失败！");
		console.log(err);
	}
});


//初始地图视野
initView = new ol.View(viewParams);

var wtqurl = GIS_URL + mapParams.googleWTQ.url;

//五通桥地形图
app.googleWTQ=new ol.layer.Tile({
	tile:mapParams.googleWTQ.tile,
	source:new ol.source.TileWMS({
		projection:mapParams.googleWTQ.projection,
        url:wtqurl,  
		params:{    
         LAYERS:mapParams.googleWTQ.params.layers,
         VERSION: mapParams.googleWTQ.params.version,
         FORMAT:mapParams.googleWTQ.params.format
       }
	}),
	visible:mapParams.googleWTQ.visible
});
app.googleWTQViewParams = mapParams.googleWTQ.view;
app.googleWTQView = new ol.View(mapParams.googleWTQ.view);

var imagewtqurl = GIS_URL + mapParams.googleImageWTQ.url;
//五通桥影像图
app.googleImageWTQ=new ol.layer.Tile({
	tile:mapParams.googleImageWTQ.tile,
	source:new ol.source.TileWMS({
		projection:mapParams.googleImageWTQ.projection,
        url:imagewtqurl,  
		params:{    
         LAYERS:mapParams.googleImageWTQ.params.layers,
         VERSION: mapParams.googleImageWTQ.params.version,
         FORMAT:mapParams.googleImageWTQ.params.format
       }
	}),
	visible:mapParams.googleImageWTQ.visible
});
app.googleImageWTQViewParams = mapParams.googleImageWTQ.view;
app.googleImageWTQView = new ol.View(mapParams.googleImageWTQ.view);

app.extent=new ol.proj.transformExtent(mapParams.extent,"EPSG:3857","EPSG:3857");

//鹰眼图
app.ovMap=new ol.control.OverviewMap({
	className : ovmapParams.className,
	collapsed : ovmapParams.collapsed,
	tipLabel:ovmapParams.tipLabel,
	view:new ol.View(ovmapParams.view)
});


//比例尺
var scaleLine=new ol.control.ScaleLine();

//鼠标位置信息
var mousePositionControl=new ol.control.MousePosition({
	coordinateFormat:ol.coordinate.createStringXY(mousePostionParams.coordinateFormat),
	projection:mousePostionParams.projection,
	className:mousePostionParams.className,
	target:document.getElementById(mousePostionParams.target),
	undefinedHTML:mousePostionParams.undefinedHTML
});

//拖放旋转
var rotate=new ol.control.Rotate({
	tipLabel:'复位'
});

//初始化地图
app.map = new ol.Map({
	controls : ol.control.defaults({
		attribution : false,
		zoomOptions:{
			zoomInTipLabel:'放大',
			zoomOutTipLabel:'缩小'
		},
		rotateOptions:{
			tipLabel:'复位'
		}
		
	}).extend([
		scaleLine,
		app.ovMap,
		mousePositionControl,
		rotate
	]),
	interactions : ol.interaction.defaults({
		doubleClickZoom:false
	}).extend([
	        new ol.interaction.DragRotateAndZoom()
	]),
	layers : [app.googleWTQ],
	target : 'map',
	view : app.googleWTQView
});

initCenterPosition();

/**
 * 手动初始化中心点
 */
function initCenterPosition(){
	var coords=ol.proj.fromLonLat([parseFloat(121.13),parseFloat(31.17)]);
	var view=app.map.getView();
	view.setZoom(mapParams.googleWTQ.view.zoom);
	view.setCenter([coords[0],coords[1]]);
}




