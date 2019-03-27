/**
    *StandardGis基础功能（平移、放大、缩小等）例子
    *闵翔
    *2016-1-5 13:52:33
**/

!function (g) {
    //TODO:自动生成部分 史家欢 2016-01-05

    //初始化名称空间
    window.JJGis = window.JJGis || {};
    window.JJGis.Plugs = window.JJGis.Plugs || {};

    //去冒泡
    var EventBubbling = function (evt) {
        var e = (evt) ? evt : window.event;
        if (window.event) {
            e.cancelBubble = true; // ie下阻止冒泡
        } else {
            e.stopPropagation(); // 其它浏览器下阻止冒泡
        }
    }

    //基础功能整体
    if (window.JJGis.Plugs.BasicsFun) throw new Error('JJGis.Plugs.BasicsFun 类重复加载');
    var jJGisBasicsFun = window.JJGis.Plugs.BasicsFun = function () {
        this._masterElement = null;
        this._navToolbar = null; //导航条
        this._homeButton = null;//主页按钮
        this._measurement = null;//测量工具
    }
    var _jJGisBasicsFun = null;
    //获得 JJGis.Plugs.BasicsFun 实例
    jJGisBasicsFun.getInstance = function () {
        var rtn = null;
        if (_jJGisBasicsFun == null) {
            rtn = new window.JJGis.Plugs.BasicsFun();
            _jJGisBasicsFun = rtn;
        }
        else {
            rtn = _jJGisBasicsFun;
        }
        return rtn;
    }


    jJGisBasicsFun.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkpRootContainer1";
        document.createElement("div").style.color

        var CreateItem = window.JJGis.Plugs.BasicsFun.Item.Create;
        CreateItem(rtn, "qkpItem qkpBGXiangPi", Rubber, "橡皮");
        //CreateItem(rtn, "qkpItem qkpBGKong", spacequery, "空间查询").id="kjcx";
        CreateItem(rtn, "qkpItem qkpBG10", iden, "Identify").id = "iden";
        CreateItem(rtn, "qkpItem qkpBG9", FullMap, "全图");
        CreateItem(rtn, "qkpItem qkpBG4", pingyi, "平移");
        CreateItem(rtn, "qkpItem qkpBG1", Measurement, "测量").id = "celiang";
        CreateItem(rtn, "qkpItem qkpBG7", dbfangda, "等比放大");
        CreateItem(rtn, "qkpItem qkpBG11", dbsuoxiao, "等比缩小");
        CreateItem(rtn, "qkpItem qkpBG2", fangda, "放大").id = "fangda";
        CreateItem(rtn, "qkpItem qkpBG8", suoxiao, "缩小").id = "suoxiao";
        CreateItem(rtn, "qkpItem qkpBG6", Pre, "前一视图");
        CreateItem(rtn, "qkpItem qkpBG3", Next, "后一视图");

        var tempMeasurement = window.JJGis.Plugs.BasicsFun.Measurement.Create();
        rtn.appendChild(tempMeasurement);

        var tempSpaceQuery = window.JJGis.Plugs.BasicsFun.SpaceQuery.Create();
        rtn.appendChild(tempSpaceQuery);

        return rtn;
    }
    //关闭所有基础功能(暂时还没用)
    jJGisBasicsFun.CloseAll = function () {
        //Identify关闭
        document.getElementById('iden').style.backgroundColor = "#35414f";
        iscolor = false;

        //测量关闭
        var ins = window.JJGis.Plugs.BasicsFun.Measurement.getInstance();
        var tempPop = ins._masterElement;
        document.getElementById('celiang').style.backgroundColor = "#35414f";
        tempPop.style.display = "none";
        var measurement = JJgis.Gis.GisNavigation.getConstant().measurement;
        measurement.clearResult();
        measurement.setTool("area", false);
        measurement.setTool("distance", false);
        measurement.setTool("location", false);

    }


    //橡皮
    var Rubber = function () {
    	console.log("橡皮");
    }
    //空间查询
    var spacequery = function () {
        var ins = window.JJGis.Plugs.BasicsFun.SpaceQuery.getInstance();
        var tempPop = ins._SpaceQueryPop;

        if (tempPop.style.display == "block") {
            kjcx.style.backgroundColor = "#35414f";
            tempPop.style.display = "none";
        }
        else {
            tempPop.style.display = "block";
            kjcx.style.backgroundColor = "#35b3fd";
        }
    }

    //Identify
    var iscolor = false;
    var iden = function () {
        var arrq = new Array(13, 14, 15, 16);
        var att = new window.JJgis.Gis.Analysis();
        var atts = att.Identify(arrq, null);
        if (!iscolor) {
            document.getElementById('iden').style.backgroundColor = "#35b3fd";
            iscolor = true;
        } else {
            document.getElementById('iden').style.backgroundColor = "#35414f";
            iscolor = false;
        }
    }

    //测量
    var Measurement = function () {
        var ins = window.JJGis.Plugs.BasicsFun.Measurement.getInstance();
        var tempPop = ins._masterElement;
        if (tempPop.style.display == "block") {
            document.getElementById('celiang').style.backgroundColor = "#35414f";
            tempPop.style.display = "none";
            var measurement = JJgis.Gis.GisNavigation.getConstant().measurement;
            measurement.clearResult();
            measurement.setTool("area", false);
            measurement.setTool("distance", false);
            measurement.setTool("location", false);
        }
        else {
            document.getElementById('celiang').style.backgroundColor = "#35b3fd";
            var gh = window.Standard.Gis.GisHelper.getInstance();
            gh._gisMap, gh._navTool, gh._navigation;
            require(["esri/config", "esri/dijit/Measurement", "esri/units", "esri/tasks/GeometryService"], function (esriConfig, Measurement, Units, GeometryService) {
                if (JJgis.Gis.GisNavigation.getConstant().measurement == null) {
                    esriConfig.defaults.io.alwaysUseProxy = false;
                    esriConfig.defaults.geometryService = new GeometryService("http://151.1.3.31/ArcGIS/rest/services/Geometry/GeometryServer");
                    JJgis.Gis.GisNavigation.getConstant().measurement = new Measurement({
                        map: gh._gisMap,
                        defaultAreaUnit: Units.SQUARE_METERS,
                        defaultLengthUnit: Units.KILOMETERS
                    }, document.getElementById("celiangDIV"));
                    JJgis.Gis.GisNavigation.getConstant().measurement.startup();
                }
            });
            tempPop.style.display = "block";

        }
    }
    //全图
    var FullMap = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        gh._navTool.zoomToFullExtent();
    }
    //平移
    var pingyi = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        gh._navTool.activate(gh._navigation.PAN);
        document.getElementById('map').style.cursor = "pointer";
    }
    //等比缩小
    var dbsuoxiao = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var tempMap = gh._gisMap;
        tempMap.setExtent(tempMap.extent.expand(2));
    }
    //等比放大
    var dbfangda = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var tempMap = gh._gisMap;
        tempMap.setExtent(tempMap.extent.expand(0.5));
    }
    //放大
    var fangda = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        gh._navTool.activate(gh._navigation.ZOOM_IN);
        document.getElementById('fangda').style.backgroundColor = "#35b3fd";
        document.getElementById('map').onmouseup = function () {
            setTimeout(function () {
                document.getElementById('fangda').style.backgroundColor = "#35414f";
                gh._navTool.deactivate();
            }, 1000);
        }
    }
    //缩小
    var suoxiao = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        gh._navTool.activate(gh._navigation.ZOOM_OUT);
        document.getElementById('suoxiao').style.backgroundColor = "#35b3fd";
        document.getElementById('map').onmouseup = function () {
            setTimeout(function () {
                document.getElementById('suoxiao').style.backgroundColor = "#35414f";
                gh._navTool.deactivate();
            }, 1000);
        }
    }
    //前一视图
    var Pre = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        gh._gisMap, gh._navTool, gh._navigation;
        gh._navTool.zoomToPrevExtent();
    }

    //后一试图
    var Next = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        gh._navTool.zoomToNextExtent();
    }


    //基础功能子项
    if (window.JJGis.Plugs.BasicsFun.Item) throw new Error('JJGis.Plugs.BasicsFun.Item 类重复加载');
    var jJGisItem = window.JJGis.Plugs.BasicsFun.Item = function () {
        this._masterElement = null;
    }
    var _jJGisItem = null;
    //获得 JJGis.Plugs.BasicsFun.Item 实例
    jJGisItem.getInstance = function () {
        var rtn = null;
        if (_jJGisItem == null) {
            rtn = new window.JJGis.Plugs.BasicsFun.Item();
            _jJGisItem = rtn;
        }
        else {
            rtn = _jJGisItem;
        }
        return rtn;
    }

    jJGisItem.Create = function (parentelement, classname, eventname, title) {
        var rtn = g.ce("div");
        rtn.className = classname;
        rtn.title = title;
        parentelement.appendChild(rtn);
        g.ah(rtn, "click", eventname);

        return rtn;
    }

    //测量弹窗
    if (window.JJGis.Plugs.BasicsFun.Measurement) throw new Error('JJGis.Plugs.BasicsFun.Measurement 类重复加载');
    var jJGisMeasurement = window.JJGis.Plugs.BasicsFun.Measurement = function () {
        this._masterElement = null;
    }
    var _jJGisMeasurement = null;
    //获得 JJGis.Plugs.BasicsFun.Measurement 实例
    jJGisMeasurement.getInstance = function () {
        var rtn = null;
        if (_jJGisMeasurement == null) {
            rtn = new window.JJGis.Plugs.BasicsFun.Measurement();
            _jJGisMeasurement = rtn;
        }
        else {
            rtn = _jJGisMeasurement;
        }
        return rtn;
    }

    jJGisMeasurement.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkpRootContainer3";

        rtn.innerHTML = "<div class='qkpCon3TitleBar'> <div class='qkpCon3Title'> <img src='"+BASE_URL+"/images/gis/geoInfo/celiang1.png' />&nbsp;<span class='kzTitle'>测量工具</span> </div> <div class='closeBtn' onclick='window.JJGis.Plugs.BasicsFun.Measurement.clclose()'>X</div><p class='qkpClearBoth'> </p> </div> <div class='qkpPopBar6'> <div id='celiangDIV'> </div> </div>";

        var ins = window.JJGis.Plugs.BasicsFun.Measurement.getInstance();
        ins._masterElement = rtn;

        return rtn;
    }
    jJGisMeasurement.clclose = function () {
        var ins = window.JJGis.Plugs.BasicsFun.Measurement.getInstance();
        ins._masterElement.style.display = "none";
        celiang.style.backgroundColor = "#35414f";
    }
    //空间查询弹窗
    if (window.JJGis.Plugs.BasicsFun.SpaceQuery) throw new Error('JJGis.Plugs.BasicsFun.SpaceQuery 类重复加载');
    var jJGisSpaceQuery = window.JJGis.Plugs.BasicsFun.SpaceQuery = function () {
        this._masterElement = null;
        this._SpaceQueryPop = null;
    }
    var _jJGisSpaceQuery = null;
    //获得 JJGis.Plugs.BasicsFun.SpaceQuery 实例
    jJGisSpaceQuery.getInstance = function () {
        var rtn = null;
        if (_jJGisSpaceQuery == null) {
            rtn = new window.JJGis.Plugs.BasicsFun.SpaceQuery();
            _jJGisSpaceQuery = rtn;
        }
        else {
            rtn = _jJGisSpaceQuery;
        }
        return rtn;
    }

    jJGisSpaceQuery.Create = function () {
        var rtn = g.ce("div");

        rtn.className = "qkpRootContainer3";
        rtn.innerHTML = "<div class='qkpCon3TitleBar'> <div class='qkpCon3Title'>空间查询</div> <div class='closeBtn' onclick='window.JJGis.Plugs.BasicsFun.SpaceQuery.kjclose()'>X</div><p class='qkpClearBoth'></p> </div> <div class='qkpPopBar6' style='height:auto;'> <div class='sqPenBtnBar' onclick='window.JJGis.Plugs.BasicsFun.SpaceQuery.PenAClick(this)'><div class='sqPenBtn sqPenA'></div></div> <div class='sqPenBtnBar' onclick='window.JJGis.Plugs.BasicsFun.SpaceQuery.PenBClick(this)'><div class='sqPenBtn sqPenB'></div></div> <div class='sqPenBtnBar' onclick='window.JJGis.Plugs.BasicsFun.SpaceQuery.PenCClick(this)'><div class='sqPenBtn sqPenC'></div></div> <div class='sqPenBtnBar' onclick='window.JJGis.Plugs.BasicsFun.SpaceQuery.PenDClick(this)'><div class='sqPenBtn sqPenD'></div></div> <div class='sqSearchBtn' onclick='window.JJGis.Plugs.BasicsFun.SpaceQuery.SearchClick()'>查询</div> </div>";

        var ins = window.JJGis.Plugs.BasicsFun.SpaceQuery.getInstance();
        ins._SpaceQueryPop = rtn;

        return rtn;
    }
    jJGisSpaceQuery.kjclose = function () {
        var ins = window.JJGis.Plugs.BasicsFun.SpaceQuery.getInstance();
        ins._SpaceQueryPop.style.display = "none";
        kjcx.style.backgroundColor = "#35414f";
    }
    var list = new Array();
    //点选
    jJGisSpaceQuery.PenAClick = function (t) {

        canpen();
        t.className = "sqPenBtnBarSelected";
        DrawMap("POINT");
    }

    //线选
    jJGisSpaceQuery.PenBClick = function (t) {
        canpen();
        t.className = "sqPenBtnBarSelected";
        DrawMap("POLYLINE");
    }

    //面选
    jJGisSpaceQuery.PenCClick = function (t) {
        canpen();
        t.className = "sqPenBtnBarSelected";
        DrawMap("POLYGON");
    }

    //取消选择
    jJGisSpaceQuery.PenDClick = function () {
        canpen();
        CanleDraw();
    }
    var index = 0;

    //查询
    jJGisSpaceQuery.SearchClick = function () {

        if (index == 1) return;
        var genSearchBtn = document.getElementsByClassName('sqSearchBtn')[0];
        genSearchBtn.className = "sqSearchNoBtn";
        index = 1;

        QPipe(null, "空间查询", "OBJECTID > ", myfunction);
    }
    function myfunction() {
        var genSearchBtn = document.getElementsByClassName('sqSearchNoBtn')[0];
        genSearchBtn.className = "sqSearchBtn";
        index = 0;
    }
    function canpen() {
        var temp = document.getElementsByClassName('sqPenBtnBarSelected')[0];
        if (temp != null) {
            temp.className = "sqPenBtnBar";
            CanleDraw();
        }

    }


}(Standard.Gis.Global);