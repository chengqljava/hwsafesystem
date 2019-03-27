!function (g) {
    //TODO:自动生成部分 史家欢 2015-12-21

    //初始化名称空间
    window.Standard = window.Standard || {};
    window.Standard.Gis = window.Standard.Gis || {};


    //实现
    if (window.Standard.Gis.SysConfig) throw new Error('Standard.Gis.SysConfig 类重复加载');
    var standardSysConfig = window.Standard.Gis.SysConfig = function () {
        this._masterElement = null;
    }
    var _standardSysConfig = null;
    //获得 Standard.Gis.SysConfig 实例
    standardSysConfig.getInstance = function () {
        var rtn = null;
        if (_standardSysConfig == null) {
            rtn = new window.Standard.Gis.SysConfig();
            _standardSysConfig = rtn;
        }
        else {
            rtn = _standardSysConfig;
        }
        return rtn;
    }
    standardSysConfig.getUrlBase = function () {
        //var url = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaCities_Community_BaseMap_CHN/ZhengZhou_Community_BaseMap_CHN/MapServer";
        var url = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/";
        return url;
    }
    standardSysConfig.getUrltiledNet = function () {
        var url = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaCities_Community_BaseMap_CHN/ZhengZhou_Community_BaseMap_CHN/MapServer";
        return url;
    }
    standardSysConfig.getProxyUrl = function () {
        var url = "http://151.1.3.210/Arcgis10ProXY/proxy.ashx";
        return url;
    }
    standardSysConfig.getGWTaskUrl = function () {
        var url = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaCities_Community_BaseMap_CHN/ZhengZhou_Community_BaseMap_CHN/MapServer/";
        return url;
    }
    standardSysConfig.getsvcUrl = function () {
        var url = "http://151.1.3.187/GisTest/Service/GisService.svc";
        return url;
    }
    standardSysConfig.getSymbols = function (model) {
        return selectSymbol(model, 1);
    }
    standardSysConfig.getHighSymbols = function (model) {
        return selectSymbol(model, 2);
    }
    function selectSymbol(model, status) {
        var sm = null;
        require(["esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureFillSymbol", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/InfoTemplate"], function (SimpleMarkerSymbol,
SimpleLineSymbol, PictureFillSymbol, PictureMarkerSymbol, Color, Graphic, InfoTemplate) {

                if (status == 1) {
                    switch (model) {
                        case 0:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/栓点图_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 1:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/套筒_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 2:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/气源_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 3:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/罐站_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 4:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/引入管_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 5:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/阀门_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 6:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/调压设备_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 7:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/监测点_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 8:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/节点_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 9:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/煤气表_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 10:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/用户点_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 11:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/极性保护_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 12:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/凝水缸_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 13:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([5, 155, 90]), 4);
                            break;
                        case 14:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([5, 155, 90]), 4);
                            break;
                        case 15:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([5, 155, 90]), 4);
                            break;
                        case 16:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([5, 155, 90]), 4);
                            break;
                        case 17:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/附属设备_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 18:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/窨井_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 19:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/阀门_N.png", 32, 48).setOffset(0, 25);
                            break;
                        case 20:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([5, 155, 90]), 4);
                            break;
                        default:
                            break;
                    }
                }
                if (status == 2) {
                    switch (model) {
                        case 0:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/栓点图_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 1:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/套筒_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 2:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/气源_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 3:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/罐站_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 4:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/引入管_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 5:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/阀门_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 6:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/调压设备_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 7:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/监测点_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 8:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/节点_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 9:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/煤气表_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 10:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/用户点_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 11:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/极性保护_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 12:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/凝水缸_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 13:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 225, 0]), 3);
                            //sm = new PictureMarkerSymbol("../StandardGisScript/images/高压管线_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 14:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 225, 0]), 3);
                            //sm = new PictureMarkerSymbol("../StandardGisScript/images/次高压管线_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 15:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 225, 0]), 3);
                            //sm = new PictureMarkerSymbol("../StandardGisScript/images/中压管线_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 16:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 225, 0]), 3);
                            //sm = new PictureMarkerSymbol("../StandardGisScript/images/低压管线_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 17:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/附属设备_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 18:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/窨井_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 19:
                            sm = new PictureMarkerSymbol("../StandardGisScript/images/阀门_H.png", 32, 48).setOffset(0, 25);
                            break;
                        case 20:
                            sm = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 225, 0]), 3);
                            //sm = new PictureMarkerSymbol("../StandardGisScript/images/架空管线_H.png", 32, 48).setOffset(0, 25);
                            break;
                        default:
                            break;
                    }
                }


            });
        return sm;
    }
    standardSysConfig.setLoading = function (model) {
        var tempDom = g.gb("gisLoadFrm");
        if (model) {
            tempDom.style.display = "block";
        } else {
            tempDom.style.display = "none";
        }
    }
} (Standard.Gis.Global);
!function (sysConfig) {
    var map;
    require([
			"dojo/parser", "dojo/ready",
              "esri/map",
              "esri/dijit/OverviewMap",
              "esri/dijit/Scalebar",
              "esri/layers/ArcGISTiledMapServiceLayer",

			  "esri/layers/ArcGISDynamicMapServiceLayer",
			  "esri/config", "esri/toolbars/navigation", "dojo/keys", "esri/sniff", "esri/SnappingManager","dijit/form/DateTextBox"
            ], function (
              parser, ready, Map, OverviewMap, Scalebar, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, esriConfig, Navigation, keys, has, SnappingManager
            ) {
                ready(function () {

                    parser.parse();
                    map = new Map("map", {
                        
                        logo: false,
                        isZoomSlider: false,
                        zoom:4,
                        center: [115, 35]
                        //  navigationMode:"-webkit-transition-duration:1s;-webkit-transition-timing-function:ease-in-out;"
                    });
                    var gh = window.Standard.Gis.GisHelper.Create();
                    var urlBase = sysConfig.getUrlBase(); // "http://151.1.3.31/ArcGIS/rest/services/武汉_底图/MapServer";

                    var urltiledNet = sysConfig.getUrltiledNet(); // "http://151.1.3.31/ArcGIS/rest/services/武汉_管网/MapServer";

                    var baseMap = new ArcGISTiledMapServiceLayer(urlBase, { id: "地形图" });

                    var nettiledMap = new ArcGISTiledMapServiceLayer(urltiledNet, { id: "切片管网" });
                    gh._laynameList.push(baseMap);
                    //gh._laynameList.push(nettiledMap);

                    map.addLayer(baseMap);
                    //map.addLayers([baseMap, nettiledMap]);

                    esriConfig.defaults.io.proxyUrl = sysConfig.getProxyUrl(); // "http://151.1.3.187/Arcgis10ProXY/proxy.ashx";
                    esriConfig.defaults.io.alwaysUseProxy = false;

                    var snapManager = map.enableSnapping({
                        snapKey: has("mac") ? keys.META : keys.CTRL
                    });

                    gh._gisMap = map;
                    gh._navigation = Navigation;
                    gh._navTool = new Navigation(map); ;
                    window.Standard.Gis.DrawActive.Create();
                });
            });
} (Standard.Gis.SysConfig);
!function (sysConfig) {

    //TODO:自动生成部分 史家欢 2015-12-02

    //初始化名称空间
    window.Standard = window.Standard || {};
    window.Standard.Gis = window.Standard.Gis || {};


    //实现
    if (window.Standard.Gis.DrawActive) throw new Error('Standard.Gis.DrawActive 类重复加载');
    var standardDrawActive = window.Standard.Gis.DrawActive = function () {
        this._masterElement = null;
    }
    var _standardDrawActive = null;
    //获得 Standard.Gis.DrawActive 实例
    standardDrawActive.getInstance = function () {
        var rtn = null;
        if (_standardDrawActive == null) {
            rtn = new window.Standard.Gis.DrawActive();
            _standardDrawActive = rtn;
        }
        else {
            rtn = _standardDrawActive;
        }
        return rtn;
    }
    standardDrawActive.Create = function () {
        require([
           	        "esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "dojo/domReady!"
           	      ], function (GraphicsLayer, Draw, Graphic, Color, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) {

           	          var gh = window.Standard.Gis.GisHelper.getInstance();

           	          var map = gh._gisMap;

           	          var toolbar;
           	          var standback = null;
           	          function activateTool(drawType) {
           	              //var tool = this.label.toUpperCase().replace(/ /g, "_");
           	              toolbar = new Draw(map);
           	              toolbar.on("draw-end", addToMap);
           	              toolbar.activate(Draw[drawType]);
           	              map.hideZoomSlider();
           	          }
           	          //标准图幅工具
           	          function standTool(callback) {
           	              //var tool = this.label.toUpperCase().replace(/ /g, "_");
           	              standback = callback;
           	              toolbar = new Draw(map);
           	              toolbar.on("draw-end", standToMap);
           	              toolbar.activate(Draw["POINT"]);
           	              map.hideZoomSlider();
           	          }
           	          gh._activateTool = activateTool;
           	          gh._standTool = standTool;
           	          gh._canleDraw = canleDraw;

           	          function canleDraw() {
           	              gh._activateGeometry = null;
           	              toolbar.deactivate();
           	              if (map.getLayer("DrawLayer")) {
           	                  var gfLayer = map.getLayer("DrawLayer");
           	                  gfLayer.clear();
           	              }
           	          }
           	          function createToolbar(themap) {
           	              toolbar = new Draw(map);
           	              toolbar.on("draw-end", addToMap);
           	          }

           	          function addToMap(evt) {
           	              gh._activateGeometry = null;
           	              var symbol;
           	              toolbar.deactivate();
           	              map.showZoomSlider();
           	              switch (evt.geometry.type) {
           	                  case "point":
           	                  case "multipoint":
           	                      symbol = new SimpleMarkerSymbol();
           	                      break;
           	                  case "polyline":
           	                      symbol = new SimpleLineSymbol();
           	                      break;
           	                  default:
           	                      symbol = new SimpleFillSymbol();
           	                      break;
           	              }
           	              var graphic = new Graphic(evt.geometry, symbol);
           	              if (!map.getLayer("DrawLayer")) {
           	                  var gfLayer = new GraphicsLayer();

           	                  gfLayer.add(graphic);
           	                  gfLayer.id = "DrawLayer";
           	                  map.addLayer(gfLayer);
           	              } else {

           	                  var gfLayer = map.getLayer("DrawLayer");
           	                  gfLayer.clear();
           	                  gfLayer.add(graphic);
           	              }
           	              gh._activateGeometry = evt.geometry;
           	          }
           	          //标准图幅
           	          function standToMap(evt) {
           	              gh._activateGeometry = null;
           	              gh._activateGeometry = evt.geometry;
           	              var symbol;
           	              toolbar.deactivate();
           	              map.showZoomSlider();


           	              var mq = new window.Standard.Gis.Query();
           	              var url = "http://151.1.3.31/ArcGIS/rest/services/%e6%ad%a6%e6%b1%89_%e7%bd%91%e6%a0%bc/MapServer/0";
           	              mq.query(url, null, null, null, "Streamline", Stand);

           	          }
           	          function Stand(evt) {

           	              var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
           	              var graphic = new Graphic(evt.featureSet.features[0].geometry, symbol);
           	              if (!map.getLayer("DrawLayer")) {
           	                  var gfLayer = new GraphicsLayer();

           	                  gfLayer.add(graphic);
           	                  gfLayer.id = "DrawLayer";
           	                  map.addLayer(gfLayer);
           	              } else {

           	                  var gfLayer = map.getLayer("DrawLayer");
           	                  gfLayer.clear();
           	                  gfLayer.add(graphic);
           	              }
           	              // gh._gisMap.centerAndZoom(gh._activateGeometry, 5);
           	              var ttx = evt.featureSet.features[0].geometry.getExtent();
           	              map.setExtent(ttx, true);

           	              standback(evt.featureSet.features[0].attributes.CNAME);
           	          }
           	      });
    }
    //实现
    if (window.Standard.Gis.Query) throw new Error('Standard.Gis.Query 类重复加载');
    var standardQuery = window.Standard.Gis.Query = function () {
        this._masterElement = null;
    }
    var _standardQuery = null;
    var _taskUrl = sysConfig.getGWTaskUrl(); //"http://151.1.3.31/ArcGIS/rest/services/%E6%AD%A6%E6%B1%89_%E7%AE%A1%E7%BD%91/MapServer/";
    standardQuery.prototype.query = function (layers, outFields, whereStr, isGeometry, querytype, callback) {
        /// <summary>layers:图层；outFields：显示列；whereStr：查询条件；isGeometry：是否使用空间参数；querytype：Full 完整版，Streamline 精简版；callback：回调函数</summary>
        var df = null;
        require([
        "dojo/dom", "dojo/on",
        "esri/tasks/query", "esri/tasks/QueryTask", "dojo/domReady!"
      ], function (dom, on, Query, QueryTask) {
          var gh = window.Standard.Gis.GisHelper.getInstance();
          if (querytype == "Full") {

              for (var i = 0; i < layers._Layers.length; i++) {
                  var temp = layers._Layers[i];

                  var queryTask = new QueryTask(_taskUrl + temp._LayerID);

                  var query = new Query();
                  query.returnGeometry = true;
                  if (gh._activateGeometry && isGeometry == true) {
                      query.geometry = gh._activateGeometry;
                  }
                  if (typeof whereStr == "string") {
                      query.where = whereStr;
                  } else if (typeof whereStr == "object") {
                      query.where = whereStr.name + whereStr[i];
                  }
                  query.outFields = outFields;
                  queryTask.StandardLayer = temp;
                  window.Standard.Gis.Query.getConstant().count = layers._Layers.length;
                  queryTask.on("complete", showResults);
                  queryTask.execute(query);

              }
          }
          if (querytype == "Streamline") {

              var queryTask = new QueryTask(layers);

              var query = new Query();
              query.returnGeometry = true;
              query.geometry = gh._activateGeometry;
              queryTask.on("complete", showResults);
              queryTask.execute(query);


          }
          function showResults(results) {
              callback(results, this.StandardLayer, this.Nums)

          }
      });

    }
    //用于交互图层查询数据的图层集合
    if (window.Standard.Gis.Layers) throw new Error('Standard.Gis.Layers 类重复加载');
    var standardLayers = window.Standard.Gis.Layers = function () {
        this._Layers = new Array();
    }
    standardLayers.prototype.addLayerItem = function (c) {
        this._Layers.push(c);
    }
    //用于交互图层对象
    if (window.Standard.Gis.LayerItem) throw new Error('Standard.Gis.LayerItem 类重复加载');
    var standardLayerItem = window.Standard.Gis.LayerItem = function () {
        this._LayerID = null;
        this._LayerName = null;
        this._LayerNum = null;
    }

    var Constant = function () {
        this.count = ""; //获得query查询次数

    }
    var IConstant = new Constant();


    standardQuery.getConstant = function () {
        return IConstant;
    }
    standardLayerItem.Create = function (id, name) {


    }
} (Standard.Gis.SysConfig);
//点、线 高亮
!function (sysConfig) {

    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.Highlight) throw new Error('JJgis.Gis.Highlight 类重复加载');
    var gisHighlight = window.JJgis.Gis.Highlight = function () {
        /// <summary>Highlight || 点、线高亮类（包括一次高亮和二次高亮）</summary>
    }
    var _arr = function () {
        this._attributes = new Array();
        this._geometry = new Array();
    }
    var arrFeature = function (resFeature) {
        var arrs = new _arr();

        var features = resFeature.featureSet.features;
        for (var i = 0; i < features.length; i++) {
            arrs._attributes.push(features[i].attributes);
            arrs._geometry.push(features[i].geometry);
        }
        return arrs;

    }

    function _oneHigh(resFeature, res, layname) {
        if (resFeature.featureSet.features.length == 0) return;
        var ts = arrFeature(resFeature);
        require(["esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureFillSymbol", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/InfoTemplate", "esri/layers/GraphicsLayer"], function (SimpleMarkerSymbol,
SimpleLineSymbol, PictureFillSymbol, PictureMarkerSymbol, Color, Graphic, InfoTemplate, GraphicsLayer) {

                var gmap = window.Standard.Gis.GisHelper.getInstance()._gisMap;
                var tempID = resFeature.target.StandardLayer._LayerID;
                var sms = sysConfig.getSymbols(tempID);
                for (var i = 0; i < ts._geometry.length; i++) {
                    if (ts._geometry[i].type == "point") {


                        var tempGraphic = new Graphic(ts._geometry[i], sms);
                        var tempPanel = new JJgis.Gis.SysMangent().dynamicFile(resFeature, i);
                        tempGraphic.infoTemplate = new JJgis.Gis.ShowResult().Information(tempPanel);
                        gmap.graphics.add(tempGraphic);


                    } else {
                        /*添加线*/

                        var tempGraphic = new Graphic(ts._geometry[i], sms);
                        var tempPanel = new JJgis.Gis.SysMangent().dynamicFile(resFeature, i);
                        tempGraphic.infoTemplate = new JJgis.Gis.ShowResult().Information(tempPanel);
                        gmap.graphics.add(tempGraphic);



                    }

                }


            });
        gisHighlight.getConstant().resl.push(ts);
        gisHighlight.getConstant().resl[gisHighlight.getConstant().resl.length - 1].layname = layname;
        return gisHighlight.getConstant().resl;

    }
    var sengeo = "";
    function _twoHigh(geometry) {
        /// <summary>二次高亮</summary>
        /// <summary>geometry 空间参数</summary>

        require(["esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureFillSymbol", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/layers/GraphicsLayer"], function (SimpleMarkerSymbol,
SimpleLineSymbol, PictureFillSymbol, PictureMarkerSymbol, Color, Graphic, GraphicsLayer) {
                var dd = gisHighlight.getConstant().resl;
                var gmap = window.Standard.Gis.GisHelper.getInstance()._gisMap;


                if (JJgis.Gis.Highlight.getConstant().geotry == "") {
                    JJgis.Gis.Highlight.getConstant().geotry = geometry;
                } else {
                    sengeo = JJgis.Gis.Highlight.getConstant().geotry;
                    JJgis.Gis.Highlight.getConstant().geotry = geometry;
                }
                if (geometry.type == "point") {

                    var sms = new PictureMarkerSymbol("../StandardGisScript/images/Legend/阀门-(5)-.png", 32, 48).setOffset(0, 25);
                    var sms1 = new PictureMarkerSymbol("../StandardGisScript/images/Legend/阀门-(5)--_1.png", 32, 48).setOffset(0, 25); //还原红色图标
                    var sms2 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([5, 155, 90]), 4); //原色线



                    for (var s = 0; s < gmap.graphics.graphics.length; s++) {
                        if (gmap.graphics.graphics[s].geometry.type == "polyline") continue;
                        if (JJgis.Gis.Highlight.getConstant().geotry.x == gmap.graphics.graphics[s].geometry.x && JJgis.Gis.Highlight.getConstant().geotry.y == gmap.graphics.graphics[s].geometry.y) {
                            gmap.graphics.graphics[s].symbol = sms;
                            break;
                        }

                    }



                    if (sengeo != "") {
                        //还原所有线
                        for (var s = 0; s < gmap.graphics.graphics.length; s++) {
                            if (gmap.graphics.graphics[s].geometry.type == "point") continue;
                            if (sengeo.x == gmap.graphics.graphics[s].geometry.paths[0][1][0] && sengeo.y == gmap.graphics.graphics[s].geometry.paths[0][1][1]) {
                                gmap.graphics.graphics[s].symbol = sms2;
                                break;
                            }

                        }
                        for (var s = 0; s < gmap.graphics.graphics.length; s++) {
                            if (gmap.graphics.graphics[s].geometry.type == "polyline") continue;
                            if (sengeo.x == gmap.graphics.graphics[s].geometry.x && sengeo.y == gmap.graphics.graphics[s].geometry.y) {
                                gmap.graphics.graphics[s].symbol = sms1;
                                break;
                            }

                        }

                    }

                }
                if (geometry.type == "polyline") {
                    var sms = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 225, 0]), 3);
                    var sms1 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([5, 155, 90]), 4); //原色
                    var sms2 = new PictureMarkerSymbol("../StandardGisScript/images/Legend/阀门-(5)--_1.png", 32, 48).setOffset(0, 25); //红色点图标



                    for (var s = 0; s < gmap.graphics.graphics.length; s++) {
                        if (gmap.graphics.graphics[s].geometry.type == "point") continue;
                        if (JJgis.Gis.Highlight.getConstant().geotry.x == gmap.graphics.graphics[s].geometry.paths[0][1][0] && JJgis.Gis.Highlight.getConstant().geotry.y == gmap.graphics.graphics[s].geometry.paths[0][1][1]) {
                            gmap.graphics.graphics[s].symbol = sms;
                            break;
                        }

                    }



                    if (sengeo != "") {
                        //还原所有点图标
                        for (var s = 0; s < gmap.graphics.graphics.length; s++) {
                            if (gmap.graphics.graphics[s].geometry.type == "polyline") continue;
                            if (sengeo.x == gmap.graphics.graphics[s].geometry.x && sengeo.y == gmap.graphics.graphics[s].geometry.y) {
                                gmap.graphics.graphics[s].symbol = sms2;
                                break;
                            }

                        }
                        for (var s = 0; s < gmap.graphics.graphics.length; s++) {
                            if (gmap.graphics.graphics[s].geometry.type == "point") continue;
                            if (sengeo.x == gmap.graphics.graphics[s].geometry.paths[0][1][0] && sengeo.y == gmap.graphics.graphics[s].geometry.paths[0][1][1]) {
                                gmap.graphics.graphics[s].symbol = sms1;
                                break;
                            }

                        }

                    }


                }
            });

    }
    var Constant = function () {
        this.geotry = "";
        this.resl = new Array(); //一个高亮显示所有信息，用于二次高亮查找点、线
    }
    var IConstant = new Constant();


    gisHighlight.getConstant = function () {
        return IConstant;
    }
    gisHighlight.prototype.PointCenter = function (x, y, spatialReference) {
        var geo = { x: x, y: y, spatialReference: spatialReference };
        return geo;
    }
    //subtype 数字或字符串转换成可观看的汉子
    gisHighlight.prototype.oneHigh = function (resFeature, layerName, callBack) {
        /// <summary>一次高亮 || resFeature：结果集；layerName：图层；callBack：回调方法 true 不使用回调函数</summary>
        var onehigh = null;
        var svcUrl = sysConfig.getsvcUrl(); // "http://151.1.3.187/GisTest/Service/GisService.svc";
        $.ajax({
            type: "get",
            //contentType: 'text/json',
            url: svcUrl + "/GetSubtype/" + layerName,
            success: function (res) {
                if (callBack) return;
                if (resFeature.featureSet.features.length == 0) return callBack("", layerName); ;
                onehigh = _oneHigh(resFeature, res, layerName);
                for (var i = 0; i < onehigh[onehigh.length - 1]._attributes.length; i++) {
                    for (var j = 0; j < res.length; j++) {
                        if (onehigh[onehigh.length - 1]._attributes[i].SUBTYPE == res[j].CV_CODE) {
                            onehigh[onehigh.length - 1]._attributes[i].SUBTYPE = res[j].CV_VALUE;
                            continue;
                        }
                    }
                    onehigh.layName = layerName;
                }
                if (callBack) {
                    var newres = onehigh;
                    callBack(newres, layerName);
                }
            }
        });
        //return _oneHigh(resFeature,res);
    }
    gisHighlight.prototype.twoHigh = function (objId) {
        _twoHigh(objId);
    }
} (Standard.Gis.SysConfig);
//系统工具类/ 放到hepper
!function (SysConfig) {
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.SysMangent) throw new Error('JJgis.Gis.SysMangent 类重复加载');
    var gisSys = window.JJgis.Gis.SysMangent = function () {

    }
    var Constant = function () {
        this.Field = null;
        this.Name = null;
        this.CacheLayer = null;
        this.result = new Array();
        this.layarr = new Array();
        this.rest = 0; //是否重置
        this.star = 0; //是否查询过

    }
    var IConstant = new Constant();
    gisSys.getConstant = function () {
        return IConstant;
    }
    var svcUrl = SysConfig.getsvcUrl(); // "http://151.1.3.187/GisTest/Service/GisService.svc";
    //获得该用户组 能查看那些列
    gisSys.prototype.getColumn = function (gid, layerName, callBack) {
        var _arr = function () {
            this._Field = new Array();
        }

        $.ajax({
            type: "get",
            //contentType: 'text/json',
            url: svcUrl + "/GetTabsCollecByGigTableName/" + gid + "/" + layerName,
            success: function (res) {
                var _Field = new Array();
                var _Name = new Array();
                for (var i = 0; i < res[0].FielddicInfoList.length; i++) {
                    _Field[i] = res[0].FielddicInfoList[i].Fieldname;
                    _Name[i] = res[0].FielddicInfoList[i].Aliasname;
                }
                IConstant.Name = _Name;
                IConstant.Field = _Field;
                callBack(_Field);
            }
        });
    }


    //图层缓存

    function Creat() {
        $.ajax({
            type: "get",
            //contentType: 'text/json',
            url: svcUrl + "/GetConfigLayersAll",
            success: function (res) {
                //callBack(res, tableName);
                // sessionStorage["conlayer"] = res;
                //new gisSys.Constant().CacheLayer = res;

                IConstant.CacheLayer = res;

                //window.JJgis.Gis.SysMangent.CacheLayer = res;
            }
        });
    }
    Creat();
    //数组转换 sql in
    gisSys.prototype.arrTosqlIn = function (arr) {
        var strarr = new Array();
        var str = "(";
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (j + 1 == arr[i].length) {
                    str += arr[i][j] + ")";
                    break;
                }
                str += arr[i][j] + ",";
            }
            strarr[i] = str;
            str = "(";
        }
        return strarr;
    }
    //featureSet 转换 feature  feature包换 _attributes数据信息、 _geometry空间信息、_field列
    gisSys.prototype.objTofeature = function (featureSet) {
        var _arr = function () {
            this._attributes = new Array();
            this._geometry = new Array();
            this._field = new Array();

        }
        var arrs = new _arr();

        var features = featureSet.featureSet.features;
        for (var i = 0; i < features.length; i++) {
            arrs._attributes.push(features[i].attributes);
            arrs._geometry.push(features[i].geometry);
        }
        var fields = featureSet.featureSet.fields;
        for (var i = 0; i < fields.length; i++) {
            arrs._field[i] = fields[i];
        }
        //  new window.JJgis.Gis.Highlight().oneHigh(featureSet,1,callback);
        return arrs;
    }
    //动态获得 列中文名和值 infowindow用
    gisSys.prototype.dynamicFile = function (featureSet, i) {
        //alias  字段中文名 fileen[j].alias

        var fileen = featureSet.featureSet.fields;
        var textval;
        for (var j = 0; j < featureSet.featureSet.fields.length; j++) {
            var ggg = featureSet.featureSet.features[i].attributes["" + fileen[j].name + ""];
            if (j == 0)
                textval = "<b>" + fileen[j].alias + "</b> : " + ggg + "<br/>";
            else
                textval += "<b>" + fileen[j].alias + "</b> : " + ggg + "<br/>";

        }

        return textval;
    }
} (Standard.Gis.SysConfig);
!function (SysConfig) {
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.Analysis) throw new Error('JJgis.Gis.Analysis 类重复加载');
    var gisAna = window.JJgis.Gis.Analysis = function () {

    }
    var svcUrl = SysConfig.getsvcUrl(); // "http://151.1.3.187/GisTest/Service/GisService.svc";
    gisAna.prototype.AnaQuery = function (objectId, tableName, valveList, isMustCLoseValve, callBack) {
        if (valveList == "") {
            $.ajax({
                type: "get",
                url: svcUrl + "/BurstPipesAnalysisOne/" + tableName + "/" + objectId + "/" + isMustCLoseValve + "",
                success: function (res) {

                    var r = _oneQuery(res);
                    callBack(r);
                }
            });
        } else {
            $.ajax({
                type: "get",
                url: svcUrl + "/BurstPipesAnalysisSecond/" + tableName + "/" + objectId + "/" + valveList + "/" + isMustCLoseValve + "",
                success: function (res) {

                    var r = _oneQuery(res);
                    callBack(r);
                }
            });
        }
    }
    var _layer = function () {
        this.type = new Array();
        this.id = new Array();
    }
    function _oneQuery(res) {
        var layer = window.JJgis.Gis.SysMangent.getConstant().CacheLayer;
        var gh = new _layer();
        var k = 0;

        for (var i = 0; i < layer.length; i++) {
            var typearr = new Array();
            var idarr = new Array();
            for (var j = 0; j < res.length; j++) {

                if (layer[i].CLTableName == res[j].TableName) {
                    if (k == 0) {

                        typearr[k] = layer[i];
                        typearr[k].IsControlLayers = res[j].IsControlLayers;
                    }
                    idarr[k] = res[j].ObjectId;

                    k++;
                }

            }
            if (typearr.length != 0 && gh.type.length != 0) {
                gh.type[gh.type.length] = typearr;
                gh.id[gh.id.length] = idarr;
            }
            if (typearr.length != 0 && gh.type.length == 0) {
                gh.type[0] = typearr;
                gh.id[0] = idarr;
            }

            typearr = null;
            idarr = null;
            k = 0;
        }
        return gh;
    }

    var Constant = function () {
        this.mark = false;
        this.handle = null;

    }
    var IConstant = new Constant();
    gisAna.getConstant = function () {
        return IConstant;
    }
    var _taskUrl = SysConfig.getGWTaskUrl(); // "http://151.1.3.31/ArcGIS/rest/services/%E6%AD%A6%E6%B1%89_%E7%AE%A1%E7%BD%91/MapServer/";
    gisAna.prototype.Identify = function (arriden, callback) {
        var cachelay = window.JJgis.Gis.SysMangent.getConstant().CacheLayer;
        require(["esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/InfoTemplate"], function (IdentifyTask, IdentifyParameters, InfoTemplate) {
            var gh = window.Standard.Gis.GisHelper.getInstance();
            identifyTask = new IdentifyTask(SysConfig.getUrltiledNet()); //http://151.1.3.31/ArcGIS/rest/services/武汉_管网/MapServer

            identifyParams = new IdentifyParameters();
            identifyParams.tolerance = 1;
            identifyParams.returnGeometry = true;
            //identifyParams.layerIds = [0]; //13, 14, 15, 16
            identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;

            identifyParams.mapExtent = gh._gisMap.extent;
            if (callback != null) {
                identifyParams.geometry = gh._activateGeometry;
                var deferred = identifyTask.execute(identifyParams);
                var features = new Array();
                var objects = new Array();
                var i = 0;
                deferred.addCallback(function (response) {

                    dojo.map(response, function (result) {
                        var feature = result.feature;
                        feature.attributes.layerName = result.layerName;
                        features[i] = feature;
                        objects[i] = feature.attributes.OBJECTID;
                        i++;
                    });

                    //for (var k = 0; k < cachelay.length; k++) {
                    //    if (response[0].layerId == cachelay[k].CLLayerCode) {
                    //        features.CLTableName = cachelay[k].CLTableName;
                    //        break;
                    //    }
                    //}
                    return callback(objects, features, response[0].layerId);
                });
                return;
            }
            //gh._gisMap.on("click", executeIdentifyTask);

            if (!JJgis.Gis.Analysis.getConstant().mark) {
                JJgis.Gis.Analysis.getConstant().handle = dojo.connect(gh._gisMap, "onClick", executeIdentifyTask);
                JJgis.Gis.Analysis.getConstant().mark = true;
            }
            else {
                dojo.disconnect(JJgis.Gis.Analysis.getConstant().handle);
                JJgis.Gis.Analysis.getConstant().mark = false;
            }

            //iden显示信息窗
            function executeIdentifyTask(evt) {
                identifyParams.geometry = evt.mapPoint;
                // identifyParams.mapExtent = gh._gisMap.extent;

                var deferred = identifyTask.execute(identifyParams);
                deferred.addCallback(function (response) {
                    return dojo.map(response, function (result) {
                        var feature = result.feature;
                        feature.attributes.layerName = result.layerName;
                        if (result.layerName != ' ') {
                            var template = new InfoTemplate("${layerName}", "${*}");
                            feature.setInfoTemplate(template);
                        }
                        return feature;
                    });
                });
                gh._gisMap.infoWindow.setFeatures([deferred]);
                gh._gisMap.infoWindow.show(evt.mapPoint);
            }
        });
    }

} (Standard.Gis.SysConfig);
//对话框显示信息类
!function () {
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.ShowResult) throw new Error('JJgis.Gis.ShowResult 类重复加载');
    var gisSys = window.JJgis.Gis.ShowResult = function () {

    }
    //Information 地图显示点位信息dialog
    gisSys.prototype.Information = function (text) {
        var infoTemplate;

        require(["esri/InfoTemplate"], function (InfoTemplate) {
            infoTemplate = new InfoTemplate();
            infoTemplate.setTitle("详细信息");
            infoTemplate.setContent("<div class='info'><div class='infoBase'>基础属性</div><div class='infoAll'>常用属性</div><div class='infoSpecial'>特殊属性</div><div class='text'>" + text + "</div><div class='dimage'></div></div>");
            //infoTemplate.resize(300, 600);

        });
        return infoTemplate;
    }
} ();
!function () {
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.Widget) throw new Error('JJgis.Gis.Widget 类重复加载');
    var gisWid = window.JJgis.Gis.Widget = function () {
        /// <summary>小部件类</summary>
    }
    var Constant = function () {
        this.Tab = null;

    }
    var IConstant = new Constant();
    gisWid.getConstant = function () {
        return IConstant;
    }

    gisWid.prototype.Grid = function (featureSet, domEl) {
        /// <summary>Grid 母版 || featureSet：query完成事件查询回来的结果集，包含列、信息数据等；domEl：domID</summary>
        require(['dojo/_base/lang', 'dojox/grid/EnhancedGrid', 'dojox/grid/enhanced/plugins/Pagination', 'dojo/data/ItemFileWriteStore', 'dojo/domReady!'], function (lang, DataGrid, Pagination, ItemFileWriteStore) {
            var fet = new window.JJgis.Gis.SysMangent().objTofeature(featureSet);

            var data = {
                identifier: "id",
                items: []
            };
            //return;
            var field = new Array();
            var layout = new Array();
            var gridarr = function () {
                this.field = null;
                this.name = null;
                this.width = "130px";
            }
            var t = new gridarr();
            t.field = "id";
            t.name = "编号";
            field.push(t);
            for (var i = 0; i < fet._field.length; i++) {
                var tx = new gridarr();

                tx.field = fet._field[i].name;
                tx.name = fet._field[i].alias;

                field.push(tx);
            }
            layout.push(field);
            for (var i = 0; i < fet._attributes.length; i++) {
                data.items.push(lang.mixin({ id: i + 1 }, fet._attributes[i]));
            }
            var store = new ItemFileWriteStore({ data: data });

            var grid = new DataGrid({
                id: 'grid',
                store: store,
                structure: layout,
                rowSelector: '0px',
                rowHeight: 30,

                plugins: { pagination: true }
            });
            grid.placeAt(domEl);
            grid.startup();



        });
    }

    gisWid.prototype.Buffer = function (value) {
        /// <summary>Buffer 沿路打印  || value：多少米</summary>
        require(["dojo/dom", "dojo/_base/array", "esri/Color", "esri/config", "esri/graphic", "esri/geometry/normalizeUtils", "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (dom, array, Color, esriConfig, Graphic, normalizeUtils, GeometryService, BufferParameters, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) {


            esriConfig.defaults.geometryService = new GeometryService("http://151.1.3.31/ArcGIS/rest/services/Geometry/GeometryServer");
            //  esriConfig.defaults.io.proxyUrl = "/proxy/";
            //esriConfig.defaults.io.alwaysUseProxy = false;

            var gh = window.Standard.Gis.GisHelper.getInstance();


            var geometry = gh._activateGeometry;
            var symbol = null;
            switch (geometry.type) {
                case "point":
                    symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 0.25]));
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
                    break;
                case "polygon":
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                    break;
            }

            var graphic = new Graphic(geometry, symbol);
            gh._gisMap.graphics.add(graphic);


            var params = new BufferParameters();
            params.distances = [value]; //25
            params.outSpatialReference = map.spatialReference;
            params.unit = GeometryService.UNIT_METER;


            normalizeUtils.normalizeCentralMeridian([geometry], esriConfig.defaults.geometryService).then(function (normalizedGeometries) {
                var normalizedGeometry = normalizedGeometries[0];
                if (normalizedGeometry.type === "polygon") {

                    esriConfig.defaults.geometryService.simplify([normalizedGeometry], function (geometries) {
                        params.geometries = geometries;
                        esriConfig.defaults.geometryService.buffer(params, showBuffer);
                    });
                } else {
                    params.geometries = [normalizedGeometry];
                    esriConfig.defaults.geometryService.buffer(params, showBuffer);
                }

            });


            function showBuffer(bufferedGeometries) {
                var symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0, 0.65]), 2
            ),
            new Color([255, 0, 0, 0.35])
          );

                array.forEach(bufferedGeometries, function (geometry) {
                    var graphic = new Graphic(geometry, symbol);
                    gh._gisMap.graphics.add(graphic);
                });

            }

        });
    }
    var standcall = null;
    gisWid.prototype.Standard = function (callback) {
        /// <summary>Standard 标准图幅 || callback：domID回调函数</summary>
        standcall = callback;

        var mq = new window.Standard.Gis.Query();
        var url = "http://151.1.3.31/ArcGIS/rest/services/%e6%ad%a6%e6%b1%89_%e7%bd%91%e6%a0%bc/MapServer/0";
        mq.query(url, null, null, null, "Streamline", Stand);

    }
    function Stand(evt) {


        require(["esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
            var gh = window.Standard.Gis.GisHelper.getInstance();
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            var graphic = new Graphic(evt.featureSet.features[0].geometry, symbol);
            gh._gisMap.graphics.add(graphic);
            var gh = window.Standard.Gis.GisHelper.getInstance();
            gh._canleDraw();
            standcall(evt.featureSet.features[0].attributes.CNAME);
        });
    }
    gisWid.prototype.dateTime = function () {

    //sangcalender
       
            var oracle = parent.window.document.getElementById('oracle');
          oracle.className="sang_Calender";
       
    }
    //    function Tab() {
    //        /// <summary>Tab选项卡面板</summary>

    //        require(['dijit/layout/TabContainer'], function (TabContainer) {
    //            var tc = new TabContainer({
    //                style: "height: 100%; width: 100%;",
    //                onClick: function (e) {

    //                    for (var i = 0; i < itePoints.length; i++) {

    //                        if (e.target.innerHTML == itePoints[i].name) {
    //                            if (itePoints[i].isGraphic) break;
    //                            for (var j = 0; j < itePoints[i].length; j++) {
    //                                var detgraphic = new Graphic(itePoints[i][j], sms);
    //                                map.graphics.add(detgraphic)
    //                            }
    //                            itePoints[i].isGraphic = true;
    //                            selIndex = i;
    //                            break;
    //                        }

    //                    }

    //                }

    //            });

    //            JJgis.Gis.Widget.getConstant().Tab = tc;

    //        });

    //    }
    //    //Tab();

    //    gisWid.prototype.ItemPane = function (num) {
    //        /// <summary>给Tab添加面板</summary>
    //        require(['dijit/layout/ContentPane'], function (ContentPane) {

    //            var cp = new ContentPane({
    //                title: msel[i],
    //                content: "<div id='_tcgirid" + (num + 1) + "' ></div>"
    //            });

    //            Tab.addChild(cp);
    //        });

    //    }
} ();
