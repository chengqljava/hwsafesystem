/**
 * 
 */
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

app.extent=new ol.proj.transformExtent(mapParams.extent,"EPSG:3857","EPSG:3857");

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
	target : "map",
	view : app.googleWTQView
});
//加载地图初始范围与初始坐标点
loadPosition();

//加载地图初始范围与初始坐标点
var locate,type;
function loadPosition(){
	type=$('#type').val();
	var longitude = $('#longitude').val();
	var latitude = $('#latitude').val();
	var num =  /^\d+(\.\d{1,4})?$/;
	var coords=null;
	if((longitude==undefined||latitude==undefined)||(longitude==""||latitude=="")||(!(num.test(longitude))||!(num.test(latitude)))){
		longitude=121.13;
		latitude=31.17;
	}else if(parseFloat(longitude) <= 120.79 || parseFloat(longitude) >= 121.31 || parseFloat(latitude) <= 30.97 || parseFloat(latitude) >= 31.36){
		// 弹出提示信息
		parent.toast("范围超出了青浦区域，自动定位到青浦地区！");
		longitude=121.13;
		latitude=31.17;
	}
	
	var coords=ol.proj.fromLonLat([parseFloat(longitude),parseFloat(latitude)]);
	locate=new MapLocate.create(app.map,coords[0],coords[1]);
	var view=app.map.getView();
	view.setZoom(mapParams.googleWTQ.view.zoom);
	view.setCenter([coords[0],coords[1]]);
	
	/*
	var vw=app.map.getView();
	initView.projection=vw.getProjection();
	initView.zoom=vw.getZoom();
	initView.center=vw.getCenter();
	*/
}



/* 
 * 设置地图的显示范围
 */
function setMapView(view) {     
	app.map.setView(view);
}

/*
 * 面定位
 * */
function centerPolygon(polygon){
	var extent=polygon.getExtent();
	app.map.getView().fit(extent,app.map.getSize());
}

//获取面中心点
function coordCenter(polygon){
	var extent = polygon.getExtent();
	var coordCenter = new ol.extent.getCenter(extent);
	return coordCenter;
}

/*
 * 保存标注
 * */
$(".big_map_bottom_button_red").click(function(){
	try{
		var coordinates  = locate.save();
		$('.big_map_bottom_drag').hide();
		$('.big_map_bottom').hide();
		var longitude =parseFloat(coordinates[0]).toFixed(4); //经度
		var latitude = parseFloat(coordinates[1]).toFixed(4);//纬度	
		if($('#register').val()=="register"){
			parent.$('#longitude').val(longitude);
			parent.$('#longitude').focus();
			parent.$('#latitude').val(latitude);
			parent.$('#latitude').focus();
			parent.$('#latitude').blur();
		}else{
			
			var obj = parent.frames["layui-layer-iframe"+parent.getParentIndex()];
			if(obj.$('#longitude')==undefined||obj.$('#longitude').val()==undefined){
				obj.$("#contentIframe").contents().find("#longitude").val(longitude);
				
			}else{
				obj.$('#longitude').val(longitude);
			}
			if(obj.$('#latitude')==undefined||obj.$('#latitude').val()==undefined){
				obj.$("#contentIframe").contents().find("#latitude").val(latitude);
			}else{
				obj.$('#latitude').val(latitude);
			}
			obj.$('#longitude').focus();
			obj.$('#longitude').blur();
			obj.$('#latitude').focus();
			obj.$('#latitude').blur();
		}
		
		$('.big_map_bottom_info').css('visibility','visible');
		setTimeout(function () { 
			parent.parent.closeWin(); //关闭弹出框	
	    }, 1000);
	}catch(err){
		$('big_map_bottom_info').hide();
		$('.big_map_bottom_drag').show();
		window.wxc.xcConfirm("保存失败！", window.wxc.xcConfirm.typeEnum.warning);
	}
})

/*
 * 回到原位
 * */
$('.big_map_bottom_button_white').click(function(){
	locate.reset();
	if(type=='add'){
		$('.big_map_bottom_drag').show();
		$('.big_map_bottom').hide();
	}else{
		$('.big_map_bottom_drag').show();
		$('.big_map_bottom').hide();
	}
})

/*
 * 初始范围
 * */
$("#initExtent").click(function(){
	//initMapView();
	//loadArea();
	app.map.setView(new ol.View(initView));
})

