/*
 * 读取配置文件
 */
var app = this;
var mapParams;
var viewParams;
var mousePostionParams;

$.ajax({
	url : "../../js/module/olgis/configs/config.json",
	type : "GET",
	dataType : "json",
	async : false,
	success : function(data) {
		mapParams=data.map;
		viewParams=data.map.view;
		mousePostionParams=data.mousePositionControl;
	},
	error : function(err) {
		console.log("读取配置文件失败！");
		console.log(err);
	}
});


//初始地图视野
var initView = {};
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

//app.extent=new ol.proj.transformExtent(mapParams.extent,"EPSG:3857","EPSG:3857");

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
		}
	}).extend([
		scaleLine,
		mousePositionControl,
		rotate
	]),
	interactions : ol.interaction.defaults({
		altShiftDragRotate:false
	}).extend([
	    new ol.interaction.DragRotateAndZoom()
	]),
	layers : [app.googleWTQ],
	target : "map"
});
//加载地图初始范围与初始坐标点
loadPosition();

//加载地图初始范围与初始坐标点
var locate;
function loadPosition(){
	var longitude = $('#longitude').val();
	var latitude = $('#latitude').val();
	var num =  /^\d+(\.\d{1,4})?$/;
	if((longitude==undefined||latitude==undefined)||(longitude==""||latitude=="")||(!(num.test(longitude))||!(num.test(latitude)))){
		var coordCenter =utils.mercTransfrom([121.13,33.14]);
		locate=addPointOnMap(app.map,coordCenter[0],coordCenter[1]);
	}else{
		var coords=ol.proj.fromLonLat([parseFloat(longitude),parseFloat(latitude)]);
		locate=addPointOnMap(app.map,coords[0],coords[1]);
		var view=app.map.getView();
		view.setZoom(14);
		view.setCenter([coords[0],coords[1]]);
	}
	var vw=app.map.getView();
	initView.projection=vw.getProjection();
	initView.zoom=vw.getZoom();
	initView.center=vw.getCenter();
}

function addPointOnMap(map,x,y){
	var feature=new ol.Feature();
	feature.setGeometry(new ol.geom.Point([x,y]));
	//样式
	var style= new ol.style.Style({
			image:new ol.style.Icon({
				anchor : [ 0.32, 1],
				src : BASE_URL + '/images/gis/buss.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	
	var locateLayer=new ol.layer.Vector({
		source:new ol.source.Vector(),
		style:style
	});
	map.addLayer(locateLayer);
	locateLayer.getSource().addFeature(feature);
}


/*
 * 初始范围
 * */
$("#initExtent").click(function(){
	app.map.setView(new ol.View(initView));
})

