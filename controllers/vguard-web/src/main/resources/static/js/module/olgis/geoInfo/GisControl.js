!function () {
    //初始化名称空间
    window.GisControl = window.GisControl || {};

    //实现
    if (window.GisControl.Helper) throw new Error('GisControl.Helper 类重复加载');
    var gisControlHelper = window.GisControl.Helper = function () {
        this._masterElement = null;
    }
    var _gisControlHelper = null;
    //获得 GisControl.Helper 实例
    gisControlHelper.getInstance = function () {
        var rtn = null;
        if (_gisControlHelper == null) {
            rtn = new window.GisControl.Helper();
            _gisControlHelper = rtn;
        }
        else {
            rtn = _gisControlHelper;
        }
        return rtn;
    }

    //事件通用函数
    gisControlHelper.addHandler = function (element, eventName, handler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, handler, false);
        }
        else if (element.attachEvent) {
            element.attachEvent('on' + eventName, handler);
        }
    };
    gisControlHelper.ah = gisControlHelper.addHandler;

    //创建element对象
    gisControlHelper.createElement = function (elementName) {
        var rtn = document.createElement(elementName);
        return rtn;
    }
    gisControlHelper.ce = gisControlHelper.createElement;

    //委托
    gisControlHelper.createDelegate = function (instance, method) {
        return function () {
            return method.apply(instance, arguments);
        }
    };
    gisControlHelper.dbing = gisControlHelper.createDelegate;

    //创建 HttpRequest
    gisControlHelper.createHttpRequest = function () {
        var xmlhttp = null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xmlhttp;
    }

}();

!function (helper) {
    //初始化名称空间
    window.GisControl = window.GisControl || {};

    //实现
    if (window.GisControl.Basics) throw new Error('GisControl.Basics 类重复加载');
    var gisControlBasics = window.GisControl.Basics = function () {
        this._masterElement = null;
        this._MapDiv1 = null;
        this._MapDiv2 = null;

        this._RootCon = null;
        this._ToolBar = null;
        this._RulerBar = null;
        this._ToolBtn = null;
        this._MainBar = null;
        this._EyeBtn = null;
        this._ChangeMapBar = null;
        this._ChgMapInputBar = null;
        this._ControlLayerBar = null;
        this._ConLayerInfoBar = null;

        this._IdenEvent = null;
        this._IdenHandle = null;

        this._IdenBtn = null;
        this._RulerBtn = null;
        this._GlobeBtn = null;
        this._ZoomInBtn = null;
        this._ZoomOutBtn = null;
        this._PViewBtn = null;
        this._NViewBtn = null;
        this._ChangeMapBtn = null;
        this._ControlLayerBtn = null;


        this._Map = null;//map1对象
        this._Map2 = null;//map2对象
        this._BaseMapLayer = null;//原始地图Layer
        this._AddMapLayer = null;//添加地图Layer
        this._NavTool = null;//工具栏对象
        this._Navigation = null;//工具栏
        this._Measurement = null;//测量工具对象
        this._MLArray = new Array();
        this._MLArray2 = new Array();

        this._tempIfr = null;//Iframe对象
        this._Url = null;
        this._MapService = null;//地图服务
        this._X = null;//x坐标
        this._Y = null;//y坐标
        this._Message = null;//信息
        this._PointStyle = null;//点位样式图片Id
        this._ToolEnabled = null;//显示隐藏工具条(赋值disabled为隐藏工具条)
        this._LayerType = null;//图层服务类型
    }
    var _gisControlBasics = null;
    //获得 GisControl.Basics 实例
    gisControlBasics.getInstance = function () {
        var rtn = null;
        if (_gisControlBasics == null) {
            rtn = new window.GisControl.Basics();
            _gisControlBasics = rtn;
        }
        else {
            rtn = _gisControlBasics;
        }
        return rtn;
    }

    //创建
    gisControlBasics.Create = function () {
        var ins = window.GisControl.Basics.getInstance();
        var rtn = helper.createElement("div");
        rtn.className = "gcRootContent";
        ins._RootCon = rtn;

        var mapDIV = helper.createElement("div");
        mapDIV.id = "gcmap";
        mapDIV.style.width = "100%";
        mapDIV.style.height = "100%";
        rtn.appendChild(mapDIV);
        mapDIV.style.display = "block";
        ins._MapDiv1 = mapDIV;

        var mapDiv2 = helper.createElement("div");
        mapDiv2.id = "gcmap2";
        mapDiv2.style.width = "100%";
        mapDiv2.style.height = "100%";
        mapDiv2.style.display = "none";
        rtn.appendChild(mapDiv2);
        ins._MapDiv2 = mapDiv2;

        var LocateButton = helper.createElement("div");
        LocateButton.id = "LocateButton";
        mapDIV.appendChild(LocateButton);

        var gcMainBar = helper.createElement("div");
        gcMainBar.className = "gcMainBar";
        rtn.appendChild(gcMainBar);
        ins._MainBar = gcMainBar;

        //创建测量窗
        var gcMeasurement = helper.createElement("div");
        gcMeasurement.className = "gcMeasurement";
        gcMainBar.appendChild(gcMeasurement);
        ins._RulerBar = gcMeasurement;

        var gcMeaTitleBar = helper.createElement("div");
        gcMeaTitleBar.className = "gcMeaTitleBar";
        gcMeasurement.appendChild(gcMeaTitleBar);

        var gcMeaTitle = helper.createElement("div");
        gcMeaTitle.className = "gcMeaTitle";
        gcMeaTitle.innerHTML = "测量";
        gcMeaTitleBar.appendChild(gcMeaTitle);

        var gcMeaClose = helper.createElement("div");
        gcMeaClose.className = "gcMeaClose";
        gcMeaTitleBar.appendChild(gcMeaClose);
        var RulerCK = helper.dbing(ins, ins.Ruler_Click);
        helper.ah(gcMeaClose, "click", RulerCK);

        var measurementDiv = helper.createElement("div");
        measurementDiv.id = "measurementDiv";
        gcMeasurement.appendChild(measurementDiv);

        var gcToolBar = helper.createElement("div");
        gcToolBar.className = "gcToolBar";
        gcMainBar.appendChild(gcToolBar);
        ins._ToolBar = gcToolBar;

        //服务透明度控制
        var ControlLayerCK = helper.dbing(ins, ins.ControlLayer_Click);
        var ControlLayer = ins.CreateItem("服务透明度控制", "gcToolItem gcIcon9", ControlLayerCK);
        gcToolBar.appendChild(ControlLayer);
        ins._ControlLayerBtn = ControlLayer;

        //服务透明度控制窗
        var gcControlLayerBar = gisControlBasics.ControlLayerBarCreate();
        gcMainBar.appendChild(gcControlLayerBar);
        ins._ControlLayerBar = gcControlLayerBar;

        //创建更换地图窗
        var gcChangeMapBar = gisControlBasics.ChangeMapBarCreate();
        gcMainBar.appendChild(gcChangeMapBar);
        ins._ChangeMapBar = gcChangeMapBar;

        //添加地图服务
        var ChangeMapCK = helper.dbing(ins, ins.ChangeMap_Click);
        var ChangeMap = ins.CreateItem("添加地图", "gcToolItem gcIcon8", ChangeMapCK);
        gcToolBar.appendChild(ChangeMap);
        ins._ChangeMapBtn = ChangeMap;

        //Identify
        var IdenCk = helper.dbing(ins, ins.Iden_Click);
        var Identify = ins.CreateItem("Identify", "gcToolItem gcIcon1", IdenCk);
        gcToolBar.appendChild(Identify);
        ins._IdenBtn = Identify;

        //测量
        var RulerCk = helper.dbing(ins, ins.Ruler_Click);
        var Ruler = ins.CreateItem("测量", "gcToolItem gcIcon2", RulerCk);
        gcToolBar.appendChild(Ruler);
        ins._RulerBtn = Ruler;


        //全图
        var GlobeCk = helper.dbing(ins, ins.Globe_Click);
        var Globe = ins.CreateItem("全图", "gcToolItem gcIcon3", GlobeCk);
        gcToolBar.appendChild(Globe);
        ins._GlobeBtn = Globe;

        //放大
        var ZoomInCk = helper.dbing(ins, ins.ZoomIn_Click);
        var ZoomIn = ins.CreateItem("放大", "gcToolItem gcIcon4", ZoomInCk);
        gcToolBar.appendChild(ZoomIn);
        ins._ZoomInBtn = ZoomIn;

        //缩小
        var ZoomOutCk = helper.dbing(ins, ins.ZoomOut_Click);
        var ZoomOut = ins.CreateItem("缩小", "gcToolItem gcIcon5", ZoomOutCk);
        gcToolBar.appendChild(ZoomOut);
        ins._ZoomOutBtn = ZoomOut;

        //前一视图
        var PViewCk = helper.dbing(ins, ins.PView_Click);
        var PView = ins.CreateItem("前一视图", "gcToolItem gcIcon6", PViewCk);
        gcToolBar.appendChild(PView);
        ins._PViewBtn = PView;

        //后一视图
        var NViewCk = helper.dbing(ins, ins.NView_Click);
        var NView = ins.CreateItem("后一视图", "gcToolItem gcIcon7", NViewCk);
        gcToolBar.appendChild(NView);
        ins._NViewBtn = NView;


        var ChangeShowCk = helper.dbing(ins, ins.ChangeShow_Click);
        var gcEagleEyeBar = helper.createElement("div");
        gcEagleEyeBar.className = "gcEagleEyeBar gcEagleEyeBar_Hide";
        gcMainBar.appendChild(gcEagleEyeBar);
        helper.ah(gcEagleEyeBar, "click", ChangeShowCk);
        ins._EyeBtn = gcEagleEyeBar;

        return rtn;
    }

    //添加地图窗口界面
    gisControlBasics.ChangeMapBarCreate = function () {
        var ins = window.GisControl.Basics.getInstance();
        var gcChangeMapBar = helper.createElement("div");
        gcChangeMapBar.className = "gcChangeMapBar";

        var gcChgMapTitleBar = helper.createElement("div");
        gcChgMapTitleBar.className = "gcChgMapTitleBar";
        gcChangeMapBar.appendChild(gcChgMapTitleBar);

        var gcChgMapTitle = helper.createElement("div");
        gcChgMapTitle.className = "gcChgMapTitle";
        gcChgMapTitle.innerHTML = "添加地图";
        gcChgMapTitleBar.appendChild(gcChgMapTitle);

        var gcMeaClose = helper.createElement("div");
        gcMeaClose.className = "gcMeaClose";
        gcChgMapTitleBar.appendChild(gcMeaClose);
        var ChangeMapCK = helper.dbing(ins, ins.ChangeMap_Click);
        helper.ah(gcMeaClose, "click", ChangeMapCK);

        var gcChgMapInfoBar = helper.createElement("div");
        gcChgMapInfoBar.className = "gcChgMapInfoBar";
        gcChangeMapBar.appendChild(gcChgMapInfoBar);

        var gcChgMapInputbox = helper.createElement("textarea");
        gcChgMapInputbox.className = "gcChgMapInputbox";
        gcChgMapInputbox.placeholder = "在此输入地图服务地址";
        gcChgMapInputbox.id = "mxmx";
        gcChgMapInfoBar.appendChild(gcChgMapInputbox);
        ins._ChgMapInputBar = gcChgMapInputbox;

        var gcChgMapBtnBar = helper.createElement("div");
        gcChgMapBtnBar.className = "gcChgMapBtnBar clearfix";
        gcChgMapInfoBar.appendChild(gcChgMapBtnBar);

        var gcChangeBtn = helper.createElement("div");
        gcChangeBtn.className = "gcChangeBtn";
        gcChangeBtn.innerHTML = "添加";
        var AddCK = helper.dbing(ins, ins.Add_Click);
        helper.ah(gcChangeBtn, "click", AddCK);
        gcChgMapBtnBar.appendChild(gcChangeBtn);

        var gcReturnBtn = helper.createElement("div");
        gcReturnBtn.className = "gcReturnBtn";
        gcReturnBtn.innerHTML = "初始化";
        var ReturnCK = helper.dbing(ins, ins.Return_Click);
        helper.ah(gcReturnBtn, "click", ReturnCK);
        gcChgMapBtnBar.appendChild(gcReturnBtn);




        return gcChangeMapBar;
    }

    //服务透明度控制窗口
    gisControlBasics.ControlLayerBarCreate = function () {
        var ins = window.GisControl.Basics.getInstance();
        var gcConLayerBar = helper.createElement("div");
        gcConLayerBar.className = "gcConLayerBar";

        var gcConLayerTitleBar = helper.createElement("div");
        gcConLayerTitleBar.className = "gcConLayerTitleBar";
        gcConLayerBar.appendChild(gcConLayerTitleBar);

        var gcConLayerTitle = helper.createElement("div");
        gcConLayerTitle.className = "gcConLayerTitle";
        gcConLayerTitle.innerHTML = "服务透明度控制";
        gcConLayerTitleBar.appendChild(gcConLayerTitle);

        var gcMeaClose = helper.createElement("div");
        gcMeaClose.className = "gcMeaClose";
        gcConLayerTitleBar.appendChild(gcMeaClose);
        var ConLayerCK = helper.dbing(ins, ins.ControlLayer_Click);
        helper.ah(gcMeaClose, "click", ConLayerCK);

        var gcConLayerInfoBar = helper.createElement("div");
        gcConLayerInfoBar.className = "gcConLayerInfoBar";
        gcConLayerBar.appendChild(gcConLayerInfoBar);
        ins._ConLayerInfoBar = gcConLayerInfoBar;

        return gcConLayerBar;

    }

    gisControlBasics.CreateConLayerItem = function (list) {
        var ins = window.GisControl.Basics.getInstance();
        ins._ConLayerInfoBar.innerHTML = "";
        for (var i = 0; i < list.length; i++) {
            var gcConItem = helper.createElement("div");
            gcConItem.className = "gcConItem clearfix";
            ins._ConLayerInfoBar.appendChild(gcConItem);

            var gcConItemTitle = helper.createElement("div");
            gcConItemTitle.className = "gcConItemTitle";
            gcConItemTitle.innerHTML = "图层" + (i + 1);
            gcConItem.appendChild(gcConItemTitle);

            var gcConSliderBar = helper.createElement("div");
            gcConSliderBar.className = "gcConSliderBar";
            gcConItem.appendChild(gcConSliderBar);
            gcConSliderBar.num = i;
            gcConSliderBar.id = "gcSl" + i;
            templist = list;
            $("#gcSl" + i).slider({
                range: "min",
                min: 0,
                max: 100,
                value: 100,
                slide: function (event, ui) {
                    templist[this.num].setOpacity((ui.value) / 100);
                }
            });
        }
    }

    gisControlBasics.prototype.CreateItem = function (title, className, event_click) {
        var rtn = helper.createElement("div");
        rtn.className = className;
        rtn.title = title;
        helper.ah(rtn, "click", event_click);
        return rtn;
    }

    //地图加载
    gisControlBasics.prototype.LoadMap = function (URLSearch) {
        var tempThis = this;
        require(["dojo/parser", "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/Scalebar", "esri/dijit/LocateButton", "esri/toolbars/navigation", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/InfoTemplate", "esri/config", "esri/dijit/Measurement", "esri/units", "esri/tasks/GeometryService", "esri/layers/GraphicsLayer", "esri/symbols/PictureMarkerSymbol", "esri/geometry/Point", "esri/graphic", "esri/dijit/InfoWindow", "esri/dijit/InfoWindowLite", "dojo/domReady!"], function (parser, Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, Scalebar, LocateButton, Navigation, IdentifyTask, IdentifyParameters, InfoTemplate, esriConfig, Measurement, Units, GeometryService, GraphicsLayer, PictureMarkerSymbol, Point, Graphic, InfoWindow, InfoWindowLite) {

            var identifyTask, identifyParams;
            tempThis._MapService = tempThis.GetQueryString(URLSearch, "MapService");
            tempThis._Message = tempThis.GetQueryString(URLSearch, "Message");
            tempThis._X = Number(tempThis.GetQueryString(URLSearch, "X"));
            tempThis._Y = Number(tempThis.GetQueryString(URLSearch, "Y"));
            tempThis._PointStyle = Number(tempThis.GetQueryString(URLSearch, "PointStyle"));
            tempThis._ToolEnabled = tempThis.GetQueryString(URLSearch, "ToolEnabled");
            tempThis._LayerType = tempThis.GetQueryString(URLSearch, "LayerType");

            var map = new Map("gcmap", {
                //zoom: 1,
                logo: false,
                sliderPosition: "bottom-right"
            });

            //默认载入底图(根据需要增加的)

            //var tempMapLayer = new ArcGISDynamicMapServiceLayer("http://117.158.128.172:8089/ArcGIS/rest/services/%E6%96%B0%E5%BA%95%E5%9B%BE/MapServer", { id: "tempMapLayer" });
            //map.addLayer(tempMapLayer);

            var baseMapLayer;
            if (tempThis._LayerType == "Tiled") {
                baseMapLayer = new ArcGISTiledMapServiceLayer(tempThis._MapService, { id: "baseMapLayer" });
                tempThis._BaseMapLayer = baseMapLayer;
                map.addLayer(baseMapLayer);
            }
            else {
                baseMapLayer = new ArcGISDynamicMapServiceLayer(tempThis._MapService, { id: "baseMapLayer" });
                tempThis._BaseMapLayer = baseMapLayer;
                map.addLayer(baseMapLayer);
            }

            tempThis._MLArray.push(baseMapLayer);

            //var baseMapLayer = new ArcGISTiledMapServiceLayer("http://10.0.6.102/zzsk_gis_hostedsite/rest/services/liaoning/LNBounds/MapServer", { id: "baseMapLayer" });
            //tempThis._BaseMapLayer = baseMapLayer;
            //map.addLayer(baseMapLayer);

            tempThis._Map = map;

            var locaLayer = new GraphicsLayer({ id: "定位层" });
            map.addLayer(locaLayer);


            //测量工具
            esriConfig.defaults.io.proxyUrl = "/proxy/";
            esriConfig.defaults.io.alwaysUseProxy = false;
            esriConfig.defaults.geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");


            var measurement = new Measurement({
                map: map,
                defaultAreaUnit: Units.SQUARE_MILES,
                defaultLengthUnit: Units.KILOMETERS
            }, document.getElementById('measurementDiv'));
            measurement.startup();
            tempThis._Measurement = measurement;

            //比例尺
            var scalebar = new Scalebar({
                map: map,
                attachTo: "bottom-left",
                scalebarStyle: "line",
                scalebarUnit: "metric"
            });

            //定位
            var geoLocate = new LocateButton({
                map: map,
                highlightLocation: true
            }, "LocateButton");
            geoLocate.startup();

            //工具条
            var navToolbar = new Navigation(map);
            tempThis._NavTool = navToolbar;
            tempThis._Navigation = Navigation;

            var infoWindow = new InfoWindow(null, document.createElement("div"));
            infoWindow.startup();

            map.on("load", mapReady);
            //map.on("click", function (e) {
            //    e.mapPoint;
            //    alert("1");
            //})

            function mapReady() {
                tempThis._IdenEvent = executeIdentifyTask;

                identifyTask = new IdentifyTask(tempThis._MapService);

                identifyParams = new IdentifyParameters();
                identifyParams.mapExtent = map.extent;
                identifyParams.tolerance = 1;
                identifyParams.returnGeometry = true;
                identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;

                if (tempThis._X != 0 && tempThis._Y != 0) {
                    var tempPoint = new Point(tempThis._X, tempThis._Y, map.spatialReference);
                    var symbolPhoto;
                    if (tempThis._PointStyle != 0) {
                        symbolPhoto = new PictureMarkerSymbol(BASE_URL+"/images/gis/geoInfo/control/" + tempThis._PointStyle + ".png", 21, 32);

                    }
                    else {
                        symbolPhoto = new PictureMarkerSymbol(BASE_URL+"/images/gis/geoInfo/control/1.png", 21, 32);
                    }
                    var tempGp = new Graphic(tempPoint, symbolPhoto);
                    locaLayer.add(tempGp);
                    locaLayer.on("click", pointClick);
                    if (tempThis._Message) {
                        tempThis.showTip();
                    }
                    map.centerAndZoom(tempPoint, 13);
                    //map.centerAt(tempPoint);
                }
                else {
                    //map.setZoom(0);
                }

            }
            function executeIdentifyTask(evt) {
                identifyParams.geometry = evt.mapPoint;
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
                map.infoWindow.setFeatures([deferred]);
                map.infoWindow.show(evt.mapPoint);
            }

            function pointClick() {
                var template = new InfoTemplate("详细信息", tempThis._Message);
                locaLayer.infoTemplate = template;
            }

            if (tempThis._ToolEnabled == "disabled") {
                tempThis._MainBar.style.display = "none";
            }
        });
    }

    //显示隐藏工具条点击事件
    gisControlBasics.prototype.ChangeShow_Click = function () {
        var tWidth = this._RootCon.parentNode.clientWidth;
        this.CancelAll();

        if (this._EyeBtn.className == "gcEagleEyeBar gcEagleEyeBar_Hide") {
            this._EyeBtn.className = "gcEagleEyeBar gcEagleEyeBar_Show";
            if (tWidth <= 320) {
                this._ToolBar.style.width = "126px";
                this._ZoomInBtn.style.display = "none";
                this._ZoomOutBtn.style.display = "none";
                this._NViewBtn.style.display = "none";
                this._PViewBtn.style.display = "none";
                this._ChangeMapBtn.style.display = "none";
                this._ControlLayerBtn.style.display = "none";
            }
            else if (tWidth < 450 && 320 < tWidth) {
                this._ToolBar.style.width = "198px";
                this._ZoomInBtn.style.display = "none";
                this._ZoomOutBtn.style.display = "none";
                this._ChangeMapBtn.style.display = "none";
                this._ControlLayerBtn.style.display = "none";
            }
            else {
                this._ToolBar.style.width = "345px";
            }
        }
        else {
            this._ToolBar.style.width = "";
            this._EyeBtn.className = "gcEagleEyeBar gcEagleEyeBar_Hide";
        }
    }

    gisControlBasics.prototype.Iden_Click = function () {
        if (this._IdenBtn.style.backgroundColor == "") {
            this.CancelAll();
            this._IdenBtn.style.backgroundColor = "#cbeafe";
            this._IdenHandle = dojo.connect(this._Map, "onClick", this._IdenEvent);
        }
        else {
            this._IdenBtn.style.backgroundColor = "";
            dojo.disconnect(this._IdenHandle);
        }
    }
    gisControlBasics.prototype.Ruler_Click = function () {
        var measurement = this._Measurement;
        measurement.clearResult();
        measurement.setTool("area", false);
        measurement.setTool("distance", false);
        measurement.setTool("location", false);

        if (this._RulerBar.style.display == "block") {
            this._RulerBar.style.display = "none";
            this._RulerBtn.style.backgroundColor = "";
        }
        else {
            this.CancelAll();
            this._RulerBar.style.display = "block";
            this._RulerBtn.style.backgroundColor = "#cbeafe";

        }
    }
    gisControlBasics.prototype.Globe_Click = function () {
        this._NavTool.zoomToFullExtent();
    }
    gisControlBasics.prototype.ZoomIn_Click = function () {
        if (this._ZoomInBtn.style.backgroundColor == "") {
            this.CancelAll();
            this._ZoomInBtn.style.backgroundColor = "#cbeafe";
            this._NavTool.activate(this._Navigation.ZOOM_IN);
        }
        else {
            this._ZoomInBtn.style.backgroundColor = "";
            this._NavTool.deactivate();
        }
    }
    gisControlBasics.prototype.ZoomOut_Click = function () {
        if (this._ZoomOutBtn.style.backgroundColor == "") {
            this.CancelAll();
            this._ZoomOutBtn.style.backgroundColor = "#cbeafe";
            this._NavTool.activate(this._Navigation.ZOOM_OUT);
        }
        else {
            this._ZoomOutBtn.style.backgroundColor = "";
            this._NavTool.deactivate();
        }
    }
    gisControlBasics.prototype.PView_Click = function () {
        this._NavTool.zoomToPrevExtent();
    }
    gisControlBasics.prototype.NView_Click = function () {
        this._NavTool.zoomToNextExtent();
    }
    gisControlBasics.prototype.ChangeMap_Click = function () {
        if (this._ChangeMapBar.style.display == "block") {
            this._ChangeMapBar.style.display = "none";
            this._ChangeMapBtn.style.backgroundColor = "";
        }
        else {
            this.CancelAll();
            this._ChangeMapBar.style.display = "block";
            this._ChangeMapBtn.style.backgroundColor = "#cbeafe";
        }
    }
    gisControlBasics.prototype.ControlLayer_Click = function () {
        if (this._ControlLayerBar.style.display == "block") {
            this._ControlLayerBar.style.display = "none";
            this._ControlLayerBtn.style.backgroundColor = "";
        }
        else {
            this.CancelAll();
            if (this._MapDiv1.style.display == "block") {
                gisControlBasics.CreateConLayerItem(this._MLArray);
            }
            else if (this._MapDiv2.style.display == "block") {
                gisControlBasics.CreateConLayerItem(this._MLArray2);
            }

            this._ControlLayerBar.style.display = "block";
            this._ControlLayerBtn.style.backgroundColor = "#cbeafe";
        }
    }

    gisControlBasics.prototype.Return_Click = function () {
        this._tempIfr.location.reload();
    }

    gisControlBasics.prototype.Add_Click = function () {
        var tempThis = this;
        var tempUrl = null;
        if (tempThis._ChgMapInputBar.value == "") {
        	console.log("请输入地图服务地址.");
            setLoading(false);
        }
        else {
            tempUrl = decodeURI(tempThis._ChgMapInputBar.value);
            if (IsURL(tempUrl) == true) {
                var xmlHttp = helper.createHttpRequest();
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 200) {
                            xmlHttp.responseText;
                            var objJson = eval("(" + xmlHttp.responseText + ")");
                            successFun(objJson);
                        }
                        else {
                        	console.log("服务请求失败.请确认地图服务地址正确性.");
                            setLoading(false);
                        }
                    }
                }
                xmlHttp.open("get", tempUrl + "?f=json", true);
                xmlHttp.send(null);
            }
            else {
            	console.log("格式错误.")
            }
        }
        //正则判断Url合法性
        function IsURL(str_url) {
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)";
            //+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
            //      + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
            //      + "|" // 允许IP和DOMAIN（域名）
            //      + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
            //      + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
            //      + "[a-z]{2,6})" // first level domain- .com or .museum 
            //      + "(:[0-9]{1,4})?" // 端口- :80 
            //      + "((/?)|" // a slash isn't required if there is no file name 
            //      + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            if (re.test(str_url)) {
                return (true);
            } else {
                return (false);
            }
        }
        function successFun(objData) {
            if (objData.spatialReference.wkid == tempThis._Map.spatialReference.wkid) {
                tempThis._MapDiv1.style.display = "block";
                tempThis._MapDiv2.style.display = "none";
                require(["esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer"], function (ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer) {
                    var addMapLayer;
                    if (objData.singleFusedMapCache == true) {
                        addMapLayer = new ArcGISTiledMapServiceLayer(tempUrl);
                    }
                    else {
                        addMapLayer = new ArcGISDynamicMapServiceLayer(tempUrl);
                    }
                    tempThis._Map.addLayer(addMapLayer);
                    tempThis._MLArray.push(addMapLayer);
                    console.log("地图添加成功!");
                    tempThis.CancelAll();
                });
            }
            else {
                tempThis._MapDiv1.style.display = "none";
                tempThis._MapDiv2.style.display = "block";


                require(["dojo/parser", "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/Scalebar", "esri/dijit/LocateButton", "esri/toolbars/navigation", "esri/tasks/IdentifyTask",
       "esri/tasks/IdentifyParameters", "esri/InfoTemplate", "esri/config", "esri/dijit/Measurement", "esri/units", "esri/tasks/GeometryService", "esri/layers/GraphicsLayer", "esri/symbols/PictureMarkerSymbol", "esri/geometry/Point", "esri/graphic", "esri/dijit/InfoWindow", "esri/dijit/InfoWindowLite", "dojo/domReady!"], function (parser, Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, Scalebar, LocateButton, Navigation, IdentifyTask, IdentifyParameters, InfoTemplate, esriConfig, Measurement, Units, GeometryService, GraphicsLayer, PictureMarkerSymbol, Point, Graphic, InfoWindow, InfoWindowLite) {

           if (tempThis._Map2) {
               var addMapLayer;
               if (objData.singleFusedMapCache == true) {
                   addMapLayer = new ArcGISTiledMapServiceLayer(tempUrl);
               }
               else {
                   addMapLayer = new ArcGISDynamicMapServiceLayer(tempUrl);
               }
               tempThis._Map2.addLayer(addMapLayer);
               tempThis._MLArray2.push(addMapLayer);
               console.log("地图添加成功!");
               tempThis.CancelAll();
           }
           else {
               var identifyTask, identifyParams;
               var map2 = new Map("gcmap2", {
                   //zoom: 13,
                   logo: false,
                   sliderPosition: "bottom-right"
               });
               var baseMapLayer2 = new ArcGISDynamicMapServiceLayer(tempThis._ChgMapInputBar.value, { id: "baseMapLayer2" });
               map2.addLayer(baseMapLayer2);

               tempThis._Map2 = map2;
               tempThis._MLArray2.push(baseMapLayer2);

               var locaLayer = new GraphicsLayer({ id: "定位层" });
               map2.addLayer(locaLayer);

               //map2.on("load", mapReady);

               function mapReady() {
                   var tempPoint = new Point(tempThis._X, tempThis._Y, map.spatialReference);
                   var symbolPhoto = new PictureMarkerSymbol("images/pointStyle/" + tempThis._PointStyle + ".png", 21, 32);
                   var tempGp = new Graphic(tempPoint, symbolPhoto);
                   locaLayer.add(tempGp);
                   locaLayer.on("click", pointClick);
                   tempThis.showTip();
                   //map.centerAndZoom(tempPoint, 13);
                   map.centerAt(tempPoint);
               }
               function pointClick() {
                   var template = new InfoTemplate("详细信息", tempThis._Message);
                   locaLayer.infoTemplate = template;
               }
               if (tempThis._ToolEnabled == "disabled") {
                   tempThis._MainBar.style.display = "none";
               }
           }
       });
            }
        }
    }

    gisControlBasics.prototype.showTip = function () {
        var tempThis = this;
        require(["esri/map", "esri/InfoTemplate", "esri/dijit/InfoWindow", "esri/dijit/InfoWindowLite", "esri/geometry/Point", "dojo/domReady!"], function (Map, InfoTemplate, InfoWindow, InfoWindowLite, Point) {
            var tempPoint = new Point(tempThis._X, tempThis._Y, tempThis._Map.spatialReference);
            var iw = tempThis._Map.infoWindow;
            iw.resize(250);
            iw.setTitle("详细信息");
            iw.setContent(tempThis._Message);
            var p = tempThis._Map.toScreen(tempPoint);
            iw.show(p, InfoWindow.ANCHOR_UPPERLEFT);
        });
    }

    //取消所有状态
    gisControlBasics.prototype.CancelAll = function () {
        //取消Identify
        this._IdenBtn.style.backgroundColor = "";
        if (this._IdenHandle) {
            dojo.disconnect(this._IdenHandle);
        }
        //取消测量
        this._RulerBar.style.display = "none";
        this._RulerBtn.style.backgroundColor = "";
        var measurement = this._Measurement;
        measurement.clearResult();
        measurement.setTool("area", false);
        measurement.setTool("distance", false);
        measurement.setTool("location", false);

        //取消放大
        this._ZoomInBtn.style.backgroundColor = "";
        this._NavTool.deactivate();

        //取消缩小
        this._ZoomOutBtn.style.backgroundColor = "";
        this._NavTool.deactivate();

        //取消更换地图
        this._ChangeMapBar.style.display = "none";
        this._ChangeMapBtn.style.backgroundColor = "";

        //取消透明度
        this._ControlLayerBar.style.display = "none";
        this._ControlLayerBtn.style.backgroundColor = "";
    }

    //获取URL传值
    gisControlBasics.prototype.GetQueryString = function (urlSearch, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(urlSearch);
        r = r.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
}(window.GisControl.Helper)
