
!function (g, sysConfig, ghp) {
	//TODO:自动生成部分 史家欢 2015-12-21

	//初始化名称空间
	window.JJGis = window.JJGis || {};
	window.JJGis.Plugs = window.JJGis.Plugs || {};


	//实现
	if (window.JJGis.Plugs.FeatureTip) throw new Error('JJGis.Plugs.FeatureTip 类重复加载');
	var jJGisFeatureTip = window.JJGis.Plugs.FeatureTip = function () {
		this._masterElement = null;
		this._dijitPopup = null;
		this._selectTip = null;
		this._isShow = false;

	}
	var _jJGisFeatureTip = null;
	//获得 JJGis.Plugs.FeatureTip 实例
	jJGisFeatureTip.getInstance = function () {
		var rtn = null;
		if (_jJGisFeatureTip == null) {
			rtn = new window.JJGis.Plugs.FeatureTip();
			_jJGisFeatureTip = rtn;
		}
		else {
			rtn = _jJGisFeatureTip;
		}
		return rtn;
	}
	jJGisFeatureTip.prototype.show = function () {
		var tempMls = g.gb("MobileLayerSearch");
		tempMls.style.display = "block";
		this._isShow = true;
		//        if (JJGis.Plugs.FeatureTip.clearPopu)
		//        JJGis.Plugs.FeatureTip.clearPopup();
	}
	jJGisFeatureTip.prototype.close = function () {
		var tempMls = g.gb("MobileLayerSearch");
		tempMls.style.display = "none";
		this._isShow = false;
		//        if (JJGis.Plugs.FeatureTip.clearPopu)
		//            JJGis.Plugs.FeatureTip.clearPopup();
	}

	var map, dialog;
	jJGisFeatureTip.Create = function () {
		require([
        "esri/map", "esri/layers/FeatureLayer",
       "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/renderers/SimpleRenderer", "esri/graphic", "esri/lang",
        "esri/Color", "dojo/number", "dojo/dom-style",
        "dijit/TooltipDialog", "dijit/popup", "dojo/domReady!"
      ], function (
        Map, FeatureLayer,
       SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic, esriLang,
        Color, number, domStyle,
        TooltipDialog, dijitPopup
      ) {

      	var gh = window.Standard.Gis.GisHelper.getInstance();
      	map = gh._gisMap;



      	var southCarolinaCounties = new FeatureLayer("http://151.1.3.31/ArcGIS/rest/services/%E6%AD%A6%E6%B1%89_%E7%AE%A1%E7%BD%91/MapServer/5", {
      		mode: FeatureLayer.MODE_SNAPSHOT,
      		outFields: ["OBJECTID", "DISTRICT", "ARCHIVE_ID", "DRAWNAME", "MATERIAL"]
      	});

      	var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 20,
			new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
			new Color([255, 255, 255, 0.1]), 1),
			new Color([255, 255, 255, 0.1]));

      	southCarolinaCounties.setRenderer(new SimpleRenderer(symbol));


      	map.addLayer(southCarolinaCounties);

      	map.infoWindow.resize(245, 125);

      	dialog = new TooltipDialog({
      		id: "tooltipDialog",
      		style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
      	});
      	dialog.startup();

      	var highlightSymbol = new SimpleMarkerSymbol();

      	southCarolinaCounties.on("click", function (evt) {
      		var t = "<b>${SID}</b><hr><b>XXX0:</b>${ARCHIVE_ID}<br>"
      	      		            + "<b>XXX1:</b>${DRAWNAME}<br>"
      	      		            + "<b>XXX2:</b>${DIAMETER}<br>"
      	      		            + "<b>XXX3:</b>${MATERIAL}";
      		if (_dijitPopup) {
      			dijitPopup = _dijitPopup;
      		}
      		dijitPopup.close(dialog);
      		map.graphics.clear();
      		var content = esriLang.substitute(evt.graphic.attributes, t);
      		var highlightGraphic = new Graphic(evt.graphic.geometry, highlightSymbol);
      		map.graphics.add(highlightGraphic);

      		dialog.setContent(content);

      		domStyle.set(dialog.domNode, "opacity", 0.85);
      		dijitPopup.open({
      			popup: dialog,
      			x: evt.pageX,
      			y: evt.pageY
      		});

      	});
      	//      	fl1.on("click", function (evt) {
      	//      		var t = "<b>${SID}</b><hr><b>XXX0:</b>${ARCHIVE_ID}<br>"
      	//      		            + "<b>XXX1:</b>${DRAWNAME}<br>"
      	//      		            + "<b>XXX2:</b>${DIAMETER}<br>"
      	//      		            + "<b>XXX3:</b>${MATERIAL}";
      	//      		dijitPopup.close(dialog);
      	//      		map.graphics.clear();
      	//      		var content = esriLang.substitute(evt.graphic.attributes, t);
      	//      		var highlightGraphic = new Graphic(evt.graphic.geometry, highlightSymbol);
      	//      		map.graphics.add(highlightGraphic);

      	//      		dialog.setContent(content);

      	//      		domStyle.set(dialog.domNode, "opacity", 0.85);
      	//      		dijitPopup.open({
      	//      			popup: dialog,
      	//      			x: evt.pageX,
      	//      			y: evt.pageY
      	//      		});

      	//      	});


      });

	}
	JJGis.Plugs.FeatureTip.getInstance();

	jJGisFeatureTip.clearPopup = function () {
		var gh = window.Standard.Gis.GisHelper.getInstance();
		map = gh._gisMap;
		var dj = JJGis.Plugs.FeatureTip.getInstance()._dijitPopup
		if (dj) {
			dj.close(dialog);
		}
		map.graphics.clear();
	}
	var _dijitPopup = null;
	jJGisFeatureTip.prototype.AddFLayerTip = function (model) {
		require([
        "esri/map", "esri/layers/FeatureLayer",
       "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/renderers/SimpleRenderer", "esri/graphic", "esri/lang",
        "esri/Color", "dojo/number", "dojo/dom-style",
        "dijit/TooltipDialog", "dijit/popup", "dojo/domReady!"
      ], function (
        Map, FeatureLayer,
        SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic, esriLang,
        Color, number, domStyle,
        TooltipDialog, dijitPopup
      ) {

      	var gh = window.Standard.Gis.GisHelper.getInstance();
      	map = gh._gisMap;

      	var sLayer = sysConfig.getGWTaskUrl() + model._id;

      	var southCarolinaCounties = new FeatureLayer(sLayer, {
      		id: "FeatureLayerTip" + model._id,
      		mode: FeatureLayer.MODE_AUTO,
      		outFields: ["*"]
      	});



      	var symbol = null;

      	if (model._gemType == "esriGeometryPoint") {
      		symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 20,
			new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
			new Color([255, 255, 255, 0.1]), 1),
			new Color([255, 255, 255, 0.1]));

      	}
      	var lineWidth = 2;
      	var ghpIns = ghp.getInstance();
      	if (ghpIns._equipmentType == "IPAD" || ghpIns._equipmentType == "IPHONE") {
      		lineWidth = 15;
      	}
      	if (model._gemType == "esriGeometryPolyline") {
      		symbol = new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID,
				new Color([255, 255, 255, 0.01]),
				lineWidth
			  );

      	}


      	southCarolinaCounties.setRenderer(new SimpleRenderer(symbol));


      	map.addLayer(southCarolinaCounties);

      	map.infoWindow.resize(245, 125);

      	if (dialog == null) {
      		dialog = new TooltipDialog({
      			id: "tooltipDialog",
      			style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
      		});
      	}
      	dialog.startup();

      	var highlightSymbol = new SimpleMarkerSymbol();
      	//outFields: ["OBJECTID", "DISTRICT", "ARCHIVE_ID", "DRAWNAME", "MATERIAL"]DESFILE
      	southCarolinaCounties.on("click", function (evt) {
      		var t = "<b>${OBJECTID}</b><hr><b>XXX0:</b>${DISTRICT}<br>"
      	      		            + "<b>XXX1:</b>${ARCHIVE_ID}<br>"
      	      		            + "<b>XXX2:</b>${DRAWNAME}<br>"
      	      		            + "<b>XXX3:</b>${MATERIAL}";
      		//保存当前选择的对象
      		var ftp = JJGis.Plugs.FeatureTip.getInstance();
      		ftp._selectTip = evt;

      		//      		if (ftp._dijitPopup != null) {
      		//      			dijitPopup = ftp._dijitPopup;
      		//      		} else {
      		//      			ftp._dijitPopup = dijitPopup;
      		//      		}

      		//      		dijitPopup.close(dialog);
      		map.graphics.clear();
      		var content = esriLang.substitute(evt.graphic.attributes, t);
      		var hLineSymbol = new SimpleLineSymbol();
      		var hPolygonSymbol = new SimpleFillSymbol();
      		var hSym = null;
      		if (evt.graphic.geometry.type == "point") {
      			hSym = highlightSymbol;
      		}
      		if (evt.graphic.geometry.type == "polyline") {
      			hSym = hLineSymbol;
      		}
      		if (evt.graphic.geometry.type == "polygon") {
      			hSym = hPolygonSymbol;
      		}
      		var highlightGraphic = new Graphic(evt.graphic.geometry, hSym);

      		map.graphics.add(highlightGraphic);

      		JJGis.Plugs.DemoFrm.Show(evt);


      		//      		dialog.setContent(content);

      		//      		domStyle.set(dialog.domNode, "opacity", 0.85);
      		//      		dijitPopup.open({
      		//      			popup: dialog,
      		//      			x: evt.pageX,
      		//      			y: evt.pageY
      		//      		});

      	});

      });

	}
	jJGisFeatureTip.prototype.RemoveFLayerTip = function (model) {
		require([
        "esri/map", "esri/layers/FeatureLayer",
       "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/renderers/SimpleRenderer", "esri/graphic", "esri/lang",
        "esri/Color", "dojo/number", "dojo/dom-style",
        "dijit/TooltipDialog", "dijit/popup", "dojo/domReady!"
      ], function (
        Map, FeatureLayer,
       SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic, esriLang,
        Color, number, domStyle,
        TooltipDialog, dijitPopup
      ) {

      	var gh = window.Standard.Gis.GisHelper.getInstance();
      	map = gh._gisMap;

      	var sLayer = map.getLayer("FeatureLayerTip" + model._id);
      	map.removeLayer(sLayer);
      });
	}

	//2015年12月22日17:46:00 获取地图服务数据形成图层对象集合
	if (window.JJGis.Plugs.MapLayerInfo) throw new Error('JJGis.Plugs.MapLayerInfo 类重复加载');
	var jJGisMapLayerInfo = window.JJGis.Plugs.MapLayerInfo = function () {
		this._masterElement = null;
		this._LayeInfo = new Array();
	}
	var _jJGisMapLayerInfo = null;
	//获得 JJGis.Plugs.MapLayerInfo 实例
	jJGisMapLayerInfo.getInstance = function () {
		var rtn = null;
		if (_jJGisMapLayerInfo == null) {
			rtn = new window.JJGis.Plugs.MapLayerInfo();
			_jJGisMapLayerInfo = rtn;
		}
		else {
			rtn = _jJGisMapLayerInfo;
		}
		return rtn;
	}
	jJGisMapLayerInfo.Create = function () {
		var rtn = new window.JJGis.Plugs.MapLayerInfo();
		_jJGisMapLayerInfo = rtn;
		return rtn;

	}
	jJGisMapLayerInfo.starup = function () {
		var urltiledNet = sysConfig.getUrltiledNet();
		var layerUrl = "";
		$.ajax({
			type: "GET",
			url: urltiledNet + "?f=json",
			dataType: "json",
			success:
				function (iJson) {
					var res = eval(iJson);
					var rtn = window.JJGis.Plugs.MapLayerInfo.Create();
					rtn._LayeInfo = res.layers;
					for (var i = 0; i < rtn._LayeInfo.length; i++) {
						var temp = new window.JJGis.Plugs.TipLayerItem.Create(rtn._LayeInfo[i]);

						var tempUL = g.gb("layerULList");
						tempUL.appendChild(temp);
						setItemGemType(temp);

					}
					JJGis.Plugs.TipLayerList.Create();
				},
			error: function () {
				console.log("error");
			}
		});
		JJGis.Plugs.DemoFrm.getInstance();
	}
	function setItemGemType(model) {
		var layerUrl = sysConfig.getGWTaskUrl();
		var mInfo = model.getModel();
		$.ajax({
			type: "GET",
			url: layerUrl + mInfo.id + "?f=json",
			dataType: "json",
			success:
				function (iJson) {
					var res = eval(iJson);
					model.setGemType(res.geometryType);
				},
			error: function () {
				console.log("error");
			}
		});
	}
	//TODO:自动生成部分 史家欢 2015-12-22

	//实现
	if (window.JJGis.Plugs.TipLayerList) throw new Error('JJGis.Plugs.TipLayerList 类重复加载');
	var jJGisTipLayerList = window.JJGis.Plugs.TipLayerList = function () {
		this._masterElement = null;
		this._selectItems = new Array();
	}
	var _jJGisTipLayerList = null;
	//获得 JJGis.Plugs.TipLayerList 实例
	jJGisTipLayerList.getInstance = function () {
		var rtn = null;
		if (_jJGisTipLayerList == null) {
			rtn = new window.JJGis.Plugs.TipLayerList();
			_jJGisTipLayerList = rtn;
		}
		else {
			rtn = _jJGisTipLayerList;
		}
		return rtn;
	}
	jJGisTipLayerList.Create = function () {

		var ins = new JJGis.Plugs.TipLayerList();
		_jJGisTipLayerList = ins;
	}

	jJGisTipLayerList.prototype.addItem = function (item) {

		this._selectItems.push(item);
	}
	jJGisTipLayerList.prototype.removeItem = function (item) {
		var tempArray = new Array();
		for (var i = 0; i < this._selectItems.length; i++) {
			var temp = this._selectItems[i];
			if (temp != item) {
				tempArray.push(temp);
			}
		}
		this._selectItems = tempArray;
	}
	//实现
	if (window.JJGis.Plugs.TipLayerItem) throw new Error('JJGis.Plugs.TipLayerItem 类重复加载');
	var jJGisTipLayerItem = window.JJGis.Plugs.TipLayerItem = function () {
		this._masterElement = null;
		this._id = null;
		this._name = null;
		this._model = null;
		this._select = null;
		this._gemType = null;
	}
	var _jJGisTipLayerItem = null;
	//获得 JJGis.Plugs.TipLayerItem 实例
	jJGisTipLayerItem.getInstance = function () {
		var rtn = null;
		if (_jJGisTipLayerItem == null) {
			rtn = new window.JJGis.Plugs.TipLayerItem();
			_jJGisTipLayerItem = rtn;
		}
		else {
			rtn = _jJGisTipLayerItem;
		}
		return rtn;
	}

	jJGisTipLayerItem.Create = function (model) {
		var ghpIns = ghp.getInstance();
		var rtn = g.ce("div");
		var layerImg = g.ce("div");
		var layerName = g.ce("div");
		//兼容IOS写法 
		if (ghpIns._equipmentType == "IPAD" || ghpIns._equipmentType == "IPHONE") {
			rtn.className = "layerInfoIOS";
		} else {
			rtn.className = "layerInfo";
		}
		layerImg.className = "layerImg";
		layerName.className = "layerName";
		layerName.innerHTML = model.name;
		layerImg.style.backgroundImage = "url('../images/GWImages/" + model.name + ".png')";
		var ins = new JJGis.Plugs.TipLayerItem();
		ins._masterElement = rtn;
		ins._id = model.id;
		ins._name = model.name;
		ins._model = model;
		ins._select = false;
		rtn.appendChild(layerImg);
		rtn.appendChild(layerName);

		var itemClick = g.cd(ins, ins.layerItem_Click);
		g.ah(rtn, 'click', itemClick);
		rtn.getModel = g.cd(ins, ins.getModel);
		rtn.setGemType = g.cd(ins, ins.setGemType);
		return rtn;
	}
	jJGisTipLayerItem.prototype.getModel = function () {
		return this._model;
	}
	jJGisTipLayerItem.prototype.setGemType = function (model) {
		this._gemType = model;
	}
	jJGisTipLayerItem.prototype.layerItem_Click = function () {
		var tlList = JJGis.Plugs.TipLayerList.getInstance();
		var ghpIns = ghp.getInstance();
		if (this._select) {
			if (ghpIns._equipmentType == "IPAD" || ghpIns._equipmentType == "IPHONE") {
				this._masterElement.className = "layerInfoIOS";
			} else {
				this._masterElement.className = "layerInfo";
			}

			tlList.removeItem(this);

			this._select = false;

			//如果是手机那么执行如下方法
			if (ghpIns._equipmentType == "IPHONE" || ghpIns._equipmentType == "ANDROID") 
			{
				var tFTip = new JJGis.Plugs.FeatureTip();
				tFTip.RemoveFLayerTip(this);
			}
		} else {
			if (ghpIns._equipmentType == "IPAD" || ghpIns._equipmentType == "IPHONE") {
				this._masterElement.className = "layerInfoIOSSelect";

			} else {
				this._masterElement.className = "layerInfoSelect";
			}


			tlList.addItem(this);
			this._select = true;
			//如果是手机那么执行如下方法
			if (ghpIns._equipmentType == "IPHONE" || ghpIns._equipmentType == "ANDROID")
			{
				var tFTip = new JJGis.Plugs.FeatureTip();
				tFTip.AddFLayerTip(this);
			}
			


		}
	}

	//临时编写代码 后续需要写成类函数对象 
	//实现
	if (window.JJGis.Plugs.DemoFrm) throw new Error('JJGis.Plugs.DemoFrm 类重复加载');
	var jJGisDemoFrm = window.JJGis.Plugs.DemoFrm = function () {
		this._masterElement = null;
	}
	var _jJGisDemoFrm = null;
	//获得 JJGis.Plugs.DemoFrm 实例
	jJGisDemoFrm.getInstance = function () {
		var rtn = null;
		if (_jJGisDemoFrm == null) {
			rtn = new window.JJGis.Plugs.DemoFrm();
			_jJGisDemoFrm = rtn;
		}
		else {
			rtn = _jJGisDemoFrm;
		}
		return rtn;
	}
	jJGisDemoFrm.Create = function () {


	}
	jJGisDemoFrm.Show = function (model) {
		var tp = g.gb("MobileTip");
		tp.style.display = "block";
		var m1 = model.graphic;

		var tx1 = g.gb("x1");
		var tx2 = g.gb("x2");
		var tx3 = g.gb("x3");
		var tx4 = g.gb("x4");
		var tx5 = g.gb("x5");
		var tx6 = g.gb("x6");
		//outFields: ["OBJECTID", "DISTRICT", "ARCHIVE_ID", "DRAWNAME", "MATERIAL"]DESFILE
		tx1.innerHTML = m1.attributes.OBJECTID;
		tx2.innerHTML = m1.attributes.DISTRICT;
		tx3.innerHTML = m1.attributes.ARCHIVE_ID;
		tx4.innerHTML = m1.attributes.DRAWNAME;
		tx5.innerHTML = m1.attributes.MATERIAL;
		tx6.innerHTML = m1.attributes.ADDR;

	}
	jJGisDemoFrm.Close = function () {
		var tp = g.gb("MobileTip");
		tp.style.display = "none";
	}


} (Standard.Gis.Global, Standard.Gis.SysConfig, Standard.Gis.GisHelper)