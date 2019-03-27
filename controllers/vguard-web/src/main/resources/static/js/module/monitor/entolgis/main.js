/**
 * 
 */
/*require.config({
	baseUrl:BASE_URL+"/js",
	packages:[{
		name:"dojo",
		location:"module/olgis/dojo/dojo",
		main:'main',
		lib: '.'
	},{
		name:"dijit",
		location:"module/olgis/dojo/dijit",
		main:'main',
		lib: '.'
	},{
		name:"dojox",
		location:"module/olgis/dojo/dojox",
		main:'main',
		lib: '.'
	}
	],
	paths:{
		//require:"module/monitor/olgis/require",
		"ol":"module/olgis/ol",
		"monitormap":"common/monitor/monitormap",
		"searchResult":"module/monitor/olgis/searchResult"
	}
});
*/

var app = this,mapParams;
//读取配置文件
$.ajax({
	url : BASE_URL+"/js/module/olgis/configs/config.json",
	type : "GET",
	dataType : "json",
	async : false,
	success : function(data) {
		mapParams=data.map;
	},
	error : function(err) {
		console.log("读取配置文件失败！");
		console.log(err);
	}
});

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
	visible:true
});
app.googleWTQView = new ol.View(mapParams.googleWTQ.view);

//初始化地图
app.map = new ol.Map({
	controls : ol.control.defaults({
		attribution : false,
	}),
	layers : [app.googleWTQ],
	target : 'map',
	view : app.googleWTQView
});

