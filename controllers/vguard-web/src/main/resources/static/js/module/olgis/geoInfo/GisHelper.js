!function () {
    //TODO:自动生成部分 史家欢 2015-12-02

    //初始化名称空间
    window.Standard = window.Standard || {};
    window.Standard.Gis = window.Standard.Gis || {};


    //实现
    if (window.Standard.Gis.Global) throw new Error('Standard.Gis.Global 类重复加载');
    var standardGlobal = window.Standard.Gis.Global = function () {
        this._masterElement = null;
    }

    //委托
    standardGlobal.createDelegate = function (instance, method) {
        return function () {
            return method.apply(instance, arguments);
        }
    };
    standardGlobal.cd = standardGlobal.createDelegate; //短名

    //创建 HttpRequest
    standardGlobal.createHttpRequest = function () {

        var req = null;
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }

        return req;
    }
    standardGlobal.creq = standardGlobal.createHttpRequest;
    //事件通用函数
    standardGlobal.addHandler = function (element, eventName, handler) {

        if (element.addEventListener) {

            element.addEventListener(eventName, handler, false);

        }
        else if (element.attachEvent) {

            element.attachEvent('on' + eventName, handler);
        }
    };

    standardGlobal.ah = standardGlobal.addHandler;

    //创建element对象
    standardGlobal.createElement = function (elementName) {
        var rtn = document.createElement(elementName);
        return rtn;
    }
    standardGlobal.ce = standardGlobal.createElement;

    //根据ID获取对象
    standardGlobal.getElementById = function (x) { return window.document.getElementById(x) };

    standardGlobal.gb = standardGlobal.getElementById;
} ()
!function (g) {
    //TODO:自动生成部分 史家欢 2015-12-02

    //初始化名称空间
    window.Standard = window.Standard || {};
    window.Standard.Gis = window.Standard.Gis || {};


    //实现
    if (window.Standard.Gis.GisHelper) throw new Error('Standard.Gis.GisHelper 类重复加载');
    var standardGisHelper = window.Standard.Gis.GisHelper = function () {
        this._masterElement = null;
        this._gisMap = null;
        this._activateTool = null; //启动绘画函数
        this._activateGeometry = null; //获取绘画后的几何对象
        this._canleDraw = null; //取消绘画以及绘画产生的Geometry对象
        this._highLight = null; //高亮feature对象集合
        this._navTool = null; //工具条
        this._navigation = null; //工具条
        this._laynameList = new Array(); //图层集合
    }
    var _standardGisHelper = null;
    //获得 Standard.Gis.GisHelper 实例
    standardGisHelper.getInstance = function () {
        var rtn = null;
        if (_standardGisHelper == null) {
            rtn = new window.Standard.Gis.GisHelper();
            _standardGisHelper = rtn;
        }
        else {
            rtn = _standardGisHelper;
        }
        return rtn;
    }
    function getEquipmentType() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

        //|| bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM
        var rtn = null;
        if (bIsIpad) {
            rtn = "IPAD";
        }
        if (bIsIphoneOs) {
            rtn = "IPHONE";
        }
        if (bIsMidp) {
            rtn = bIsMidp;
        }
        if (bIsUc7) {
            rtn = bIsUc7;
        }
        if (bIsUc) {
            rtn = bIsUc;
        }
        if (bIsAndroid) {
            rtn = "ANDROID";
        }
        if (bIsCE) {
            rtn = bIsCE;
        }
        if (bIsWM) {
            rtn = bIsWM;
        }
        return rtn;

    }
    standardGisHelper.Create = function () {
        var ins = new window.Standard.Gis.GisHelper();
        _standardGisHelper = ins;
        _standardGisHelper._equipmentType = getEquipmentType();
        return ins;
    }
    
} (Standard.Gis.Global)