/// <reference path="../../script/cbtree/util/TOC.js" />
/**
    *StandardGis控制功能（服务控制、图层控制等）例子
    *闵翔
    *2016-1-5 16:10:41
**/
!function (g) {
    //TODO:自动生成部分 史家欢 2016-01-05

    //初始化名称空间
    window.JJGis = window.JJGis || {};
    window.JJGis.Plugs = window.JJGis.Plugs || {};


    //控制功能条 整体
    if (window.JJGis.Plugs.ControlFun) throw new Error('JJGis.Plugs.ControlFun 类重复加载');
    var jJGisControlFun = window.JJGis.Plugs.ControlFun = function () {
        this._masterElement = null;
        this._ServiceControlPop = null;
        this._LayerControlPop = null;
        this._QueryControlPop = null;
    }
    var _jJGisControlFun = null;
    //获得 JJGis.Plugs.ControlFun 实例
    jJGisControlFun.getInstance = function () {
        var rtn = null;
        if (_jJGisControlFun == null) {
            rtn = new window.JJGis.Plugs.ControlFun();
            _jJGisControlFun = rtn;
        }
        else {
            rtn = _jJGisControlFun;
        }
        return rtn;
    }

    jJGisControlFun.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkpRootContainer2";

        var tempServiceControl = window.JJGis.Plugs.ControlFun.ServiceControl.Create();
        rtn.appendChild(tempServiceControl);

        var tempLayerControl = window.JJGis.Plugs.ControlFun.LayerControl.Create();
        rtn.appendChild(tempLayerControl);

        var tempQueryControl = window.JJGis.Plugs.ControlFun.QueryControl.Create();
        rtn.appendChild(tempQueryControl);

        var tempSCPop = window.JJGis.Plugs.ControlFun.ServiceControl.PopWindow.Create();
        rtn.appendChild(tempSCPop);

        var tempCFLPop = window.JJGis.Plugs.ControlFun.LayerControl.LPopWindow.Create();
        rtn.appendChild(tempCFLPop);

        var tempQCPop = window.JJGis.Plugs.ControlFun.QueryControl.QPopWindow.Create();
        rtn.appendChild(tempQCPop);

        return rtn;
    }

    //服务控制
    if (window.JJGis.Plugs.ControlFun.ServiceControl) throw new Error('JJGis.Plugs.ControlFun.ServiceControl 类重复加载');
    var jJGisServiceControl = window.JJGis.Plugs.ControlFun.ServiceControl = function () {
        this._masterElement = null;
        this._ServiceControlPop = null;
    }
    var _jJGisServiceControl = null;
    //获得 JJGis.Plugs.ControlFun.ServiceControl 实例
    jJGisServiceControl.getInstance = function () {
        var rtn = null;
        if (_jJGisServiceControl == null) {
            rtn = new window.JJGis.Plugs.ControlFun.ServiceControl();
            _jJGisServiceControl = rtn;
        }
        else {
            rtn = _jJGisServiceControl;
        }
        return rtn;
    }

    jJGisServiceControl.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkp2Item";
        rtn.id = "fuwubtn";

        var qkp2ItemIcon = g.ce("div");
        qkp2ItemIcon.className = "qkp2ItemIcon qkpBGfuwu";
        rtn.appendChild(qkp2ItemIcon);

        var qkp2ItemTitle = g.ce("div");
        qkp2ItemTitle.className = "qkp2ItemTitle";
        qkp2ItemTitle.innerHTML = "服务控制";
        rtn.appendChild(qkp2ItemTitle);

        var ins = new window.JJGis.Plugs.ControlFun.ServiceControl();
        var click = g.cd(ins, ins.ChangeShow_Click);
        g.ah(rtn, "click", click);

        return rtn;
    }
    
    var ServiceControlPop = null;
    var LayerControlPop = null;
    var QueryControlPop = null;

    jJGisServiceControl.prototype.ChangeShow_Click = function () {
        if (ServiceControlPop.style.display == "block") {
            ServiceControlPop.style.display = "none";
            fuwubtn.style.backgroundColor = "#35414f";
        }
        else {
            ServiceControlPop.style.display = "block";
            fuwubtn.style.backgroundColor = "#35b3fd";

            LayerControlPop.style.display = "none";
            tucengbtn.style.backgroundColor = "#35414f";

            QueryControlPop.style.display = "none";
            cxkz.style.backgroundColor = "#35414f";
        }

    }

    //服务控制的弹窗
    if (window.JJGis.Plugs.ControlFun.ServiceControl.PopWindow) throw new Error('JJGis.Plugs.ControlFun.ServiceControl.PopWindow 类重复加载');
    var jJGisPopWindow = window.JJGis.Plugs.ControlFun.ServiceControl.PopWindow = function () {
        this._masterElement = null;
    }
    var _jJGisPopWindow = null;
    //获得 JJGis.Plugs.ControlFun.ServiceControl.PopWindow 实例
    jJGisPopWindow.getInstance = function () {
        var rtn = null;
        if (_jJGisPopWindow == null) {
            rtn = new window.JJGis.Plugs.ControlFun.ServiceControl.PopWindow();
            _jJGisPopWindow = rtn;
        }
        else {
            rtn = _jJGisPopWindow;
        }
        return rtn;
    }

    jJGisPopWindow.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkpRootContainer3";
        rtn.id = "qkpRootContainer3";
        rtn.innerHTML = "<div class='qkpCon3TitleBar'> <div class='qkpCon3Title'> <img src='"+BASE_URL+"/images/gis/geoInfo/fwkz1.png' />&nbsp;<span class='kzTitle'>服务控制</span> </div> <div class='closeBtn' onclick='window.JJGis.Plugs.ControlFun.ServiceControl.PopWindow.fwclose()'>X</div><p class='qkpClearBoth'> </p> </div> <div class='qkpPopBar'> <div> <div class='qkpPopTitle'> 矢量图▼ </div> <div class='qkpCon3ItemsBar1'> <div class='qkpCon3Item'> <div id='div2' class='qkpCon3ItemIcon'> <div class='qkpRightIcon' id='addOfDel' onclick='window.JJGis.Plugs.ControlFun.ServiceControl.PopWindow.terrainClose(this)'> </div> <div> <img id='dxt' src='"+BASE_URL+"/images/gis/geoInfo/dxt.jpg' draggable='true' ondragend='window.JJGis.Plugs.ControlFun.ServiceControl.PopWindow.terrainDrop()'/> </div> </div> <div class='qkpCon3ItemTitle'> 地形图 </div> </div> <p class='qkpClearBoth'> </p> </div> </div> </div>";

        var ins = window.JJGis.Plugs.ControlFun.getInstance();
        ServiceControlPop = ins._ServiceControlPop = rtn;

        return rtn;
    }
    jJGisPopWindow.fwclose = function () {
        var ins = window.JJGis.Plugs.ControlFun.getInstance();
        ins._ServiceControlPop.style.display = "none";
        fuwubtn.style.backgroundColor = "#35414f";
    }
    //地形图拖拽
    jJGisPopWindow.terrainDrop = function () {
        var GHelp = window.Standard.Gis.GisHelper.getInstance();
        var tempMap = GHelp._gisMap;

        if (tempMap.getLayer("地形图") == null) {
            tempMap.addLayer(GHelp._laynameList[0], 0);
            document.getElementById("addOfDel").style.display = "block";
        }
    }
    //管网拖拽
    jJGisPopWindow.tubeDrop = function () {
        var GHelp = window.Standard.Gis.GisHelper.getInstance();
        var tempMap = GHelp._gisMap;

        if (tempMap.getLayer("切片管网") == null) {
            tempMap.addLayer(GHelp._laynameList[1], 1);
            document.getElementById('addOfDel2').style.display = "block";
        }
    }

    //地形图关闭
    jJGisPopWindow.terrainClose = function (t) {
        var GHelp = window.Standard.Gis.GisHelper.getInstance();
        var tempMap = GHelp._gisMap;
        tempMap.removeLayer(GHelp._laynameList[0]);
        t.style.display = "none";
    }

    //管网关闭
    jJGisPopWindow.tubeClose = function (t) {
        var GHelp = window.Standard.Gis.GisHelper.getInstance();
        var tempMap = GHelp._gisMap;
        tempMap.removeLayer(GHelp._laynameList[1]);
        t.style.display = "none";

    }

    //图层控制
    if (window.JJGis.Plugs.ControlFun.LayerControl) throw new Error('JJGis.Plugs.ControlFun.LayerControl 类重复加载');
    var jJGisLayerControl = window.JJGis.Plugs.ControlFun.LayerControl = function () {
        this._masterElement = null;
        this._LayerControlPopnull;
    }
    var _jJGisLayerControl = null;
    //获得 JJGis.Plugs.ControlFun.LayerControl 实例
    jJGisLayerControl.getInstance = function () {
        var rtn = null;
        if (_jJGisLayerControl == null) {
            rtn = new window.JJGis.Plugs.ControlFun.LayerControl();
            _jJGisLayerControl = rtn;
        }
        else {
            rtn = _jJGisLayerControl;
        }
        return rtn;
    }

    jJGisLayerControl.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkp2Item";
        rtn.id = "tucengbtn"

        var qkp2ItemIcon = g.ce("div");
        qkp2ItemIcon.className = "qkp2ItemIcon qkpBGtuceng";
        rtn.appendChild(qkp2ItemIcon);

        var qkp2ItemTitle = g.ce("div");
        qkp2ItemTitle.className = "qkp2ItemTitle";
        qkp2ItemTitle.innerHTML = "图层控制";
        rtn.appendChild(qkp2ItemTitle);

        var ins = new window.JJGis.Plugs.ControlFun.LayerControl();
        var click = g.cd(ins, ins.ChangeShow_Click);
        g.ah(rtn, "click", click);


        return rtn;
    }
    jJGisLayerControl.prototype.ChangeShow_Click = function () {
        if (LayerControlPop.style.display == "block") {
            LayerControlPop.style.display = "none";
            tucengbtn.style.backgroundColor = "#35414f";
        }
        else {
            //图层控制tree
            window.JJGis.Plugs.ControlFun.LayerControl.LPopWindow.LayerConTree();

            ServiceControlPop.style.display = "none";
            fuwubtn.style.backgroundColor = "#35414f";

            LayerControlPop.style.display = "block";
            tucengbtn.style.backgroundColor = "#35b3fd";

            QueryControlPop.style.display = "none";
            cxkz.style.backgroundColor = "#35414f";
        }

    }


    //图层控制弹出框
    if (window.JJGis.Plugs.ControlFun.LayerControl.LPopWindow) throw new Error('JJGis.Plugs.ControlFun.LayerControl.LPopWindow 类重复加载');
    var jJGisLPopWindow = window.JJGis.Plugs.ControlFun.LayerControl.LPopWindow = function () {
        this._masterElement = null;
    }
    var _jJGisLPopWindow = null;
    //获得 JJGis.Plugs.ControlFun.LayerControl.LPopWindow 实例
    jJGisLPopWindow.getInstance = function () {
        var rtn = null;
        if (_jJGisLPopWindow == null) {
            rtn = new window.JJGis.Plugs.ControlFun.LayerControl.LPopWindow();
            _jJGisLPopWindow = rtn;
        }
        else {
            rtn = _jJGisLPopWindow;
        }
        return rtn;
    }

    jJGisLPopWindow.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkpRootContainer3";

        rtn.innerHTML = "<div class='qkpCon3TitleBar'> <div class='qkpCon3Title'> <img src='"+BASE_URL+"/images/gis/geoInfo/tckz1.png' />&nbsp;<span class='kzTitle'>图层控制</span> </div> <div class='closeBtn' onclick='window.JJGis.Plugs.ControlFun.LayerControl.LPopWindow.tcclose()'>X</div><p class='qkpClearBoth'> </p> </div> <div class='qkpPopBar7'> <div class='toc'> <div id='tocTree'> </div> </div> </div>";

        var ins = window.JJGis.Plugs.ControlFun.getInstance();
        LayerControlPop=ins._LayerControlPop = rtn;

        return rtn;
    }
    jJGisLPopWindow.tcclose = function () {
        var ins = window.JJGis.Plugs.ControlFun.getInstance();
        ins._LayerControlPop.style.display = "none";
        tucengbtn.style.backgroundColor = "#35414f";
    }
    //图层控制tree
    var toc = null;
    jJGisLPopWindow.LayerConTree = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance(); //_gisMap
        require(["cbtree/util/TOC", ], function (TOC) {
            if (toc == null) {
                toc = new TOC({
                    checked: true,
                    name: "图层列表",
                    enableDelete: true,
                    deleteRecursive: true,
                    valueToIconMap: { subType: { "*": "* maki" } }
                }, document.getElementById('tocTree'));
                toc.startup();
                var layers = gh._gisMap.layerIds;
                map = gh._gisMap;
                for (var i = layers.length - 1; i >= 0; i--) {
                    var mapService = map.getLayer(layers[i]);
                    var subType = "tiled";
                    if (mapService.declaredClass == "esri.layers.ArcGISDynamicMapServiceLayer") {
                        subType = "dy";
                    }
                    else if (mapService.declaredClass == "esri.layers.ArcGISTiledMapServiceLayer") {
                        subType = "tiled";
                    }

                    toc.addHeader({ id: layers[i], name: layers[i], subType: subType });
                    if (mapService.loaded) {
                        storeLayers(mapService);
                    }

                }
                window.onload = function () {
                    for (var i = 0; i < layers.length; i++) {
                        var mapService = map.getLayer(layers[i]);
                        storeLayers(mapService);
                    }
                }

                toc.on("checkBoxClick", checkboxClicked);
                toc.on("click", nodeClicked);
                toc.on("moved", entryMoved);
                toc.on("delete", entryDeleted);
            }


        });

        function storeLayers(layerInfos) {
            //Layers have been loaded or updated, add any new layers to the store.
            //debugger;
            var dynLayerInfos = layerInfos.layerInfos;

            for (var i = 0; i < dynLayerInfos.length; i++) {
                if (dynLayerInfos[i].defaultVisibility == false) {
                    dynLayerInfos[i].defaultVisibility = true;
                }
            }

            var layerName = layerInfos.id;
            var readonly = false;
            var nodeType = "subtiled";
            if (layerInfos.declaredClass == "esri.layers.ArcGISDynamicMapServiceLayer") {
                readonly = false;
                nodeType = "subdy"
            }
            else {
                readonly = true;
                nodeType = "subtiled"
            }

            dynLayerInfos.forEach(function (layerInfo) {
                var id = layerName + layerInfo.id;
                var pid = layerInfo.parentLayerId;
                var parent = layerName;
                if (layerInfo.parentLayerId >= 0) {
                    parent = layerName + layerInfo.parentLayerId;
                }
                if (!toc.get(id)) {
                    var name = layerInfo.name.split(".").pop();
                    var tocRec = { id: id, name: name, type: nodeType, subType: name.toLowerCase(), layerInfo: layerInfo, servceName: layerInfos.id };
                    var entry = toc.addEntry(tocRec, { parent: parent, readOnly: readonly });
                    if (entry) {
                        toc.setChecked(entry, layerInfo.defaultVisibility);
                    }
                }
            }, this);
        }

        function checkboxClicked(item) {
            // A checkbox was clicked, execute operation for all descendants, if any.
            toc.getDescendants(item).forEach(checkboxClicked);
            var type = item.type;
            if (item.type.indexOf("HEADER") >= 0) {
                type = item.subType;
            }

            switch (type) {
                case "subdy":
                    item.layerInfo.defaultVisibility = toc.getChecked(item);
                    var root = getRootParent(item);
                    var entries = toc.query({ "type": "subdy", checked: true, "servceName": root.id });
                    var layerIds = entries.map(function (entry) {
                        return entry.layerInfo.id;
                    });
                    map.getLayer(root.id).setVisibleLayers(layerIds.length ? layerIds : [-1]);
                    break;

                case "tiled":

                    var visibility = toc.getChecked(item);
                    map.getLayer(item.id).setVisibility(visibility);
                    break;
                case "location":
                    if (toc.getChecked(item)) {
                        item.layer.add(item.feature);
                    } else {
                        item.layer.remove(item.feature);
                    }
                    break;
            }
        }

        function nodeClicked(item) {
            // Tree node label or icon was clicked (not the checkbox).
            switch (item.type) {
                case "HEADER-0":
                    switch (item.subType) {
                        case "earthquake":
                            zoomMap(gblExtent);
                            break;
                        case "layers":
                        case "poi":
                            zoomMap(defExtent);
                            break;
                    }
                    break;
                case "earthQuake":
                    if (toc.getChecked(item)) {
                        zoomMap(item.feature.geometry, 1000000);
                    }
                    break;
                case "location":
                    if (toc.getChecked(item)) {
                        zoomMap(item.feature.geometry, 125000);
                    }
                    break;
            }
        }

        function entryMoved(item, insertIndex, before) {
            // A TOC entry was moved to a new location (DnD)
            switch (item.type) {
                case "layerInfo":
                    // Fetch all dynamic layers in the new order..
                    var entries = toc.getDescendants("LAYERS", { type: "layerInfo" });
                    var layers = entries.map(function (entry) {
                        return entry.layerInfo;
                    });
                    if (layers.length) {
                        map.getLayer("usa").setDynamicLayerInfos(layers);
                    }
                    break;

                case "location":
                    break;
            }
        }

        function entryDeleted(item) {
            // TOC entry was delete...
            switch (item.type) {
                case "earthQuake":
                case "location":
                    item.layer.remove(item.feature);
                    break;
            }
        }
    }

    //查询控制
    if (window.JJGis.Plugs.ControlFun.QueryControl) throw new Error('JJGis.Plugs.ControlFun.QueryControl 类重复加载');
    var jJGisQueryControl = window.JJGis.Plugs.ControlFun.QueryControl = function () {
        this._masterElement = null;
    }
    var _jJGisQueryControl = null;
    //获得 JJGis.Plugs.ControlFun.QueryControl 实例
    jJGisQueryControl.getInstance = function () {
        var rtn = null;
        if (_jJGisQueryControl == null) {
            rtn = new window.JJGis.Plugs.ControlFun.QueryControl();
            _jJGisQueryControl = rtn;
        }
        else {
            rtn = _jJGisQueryControl;
        }
        return rtn;
    }

    jJGisQueryControl.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "qkp2Item";
        rtn.id = "cxkz";
        rtn.style.display = "none";

        var qkp2ItemIcon = g.ce("div");
        qkp2ItemIcon.className = "qkp2ItemIcon qkpBGtuceng";
        rtn.appendChild(qkp2ItemIcon);

        var qkp2ItemTitle = g.ce("div");
        qkp2ItemTitle.className = "qkp2ItemTitle";
        qkp2ItemTitle.innerHTML = "查询控制";
        rtn.appendChild(qkp2ItemTitle);

        var ins = new window.JJGis.Plugs.ControlFun.QueryControl();
        var click = g.cd(ins, ins.ChangeShow_Click);
        g.ah(rtn, "click", click);

        return rtn;
    }

    jJGisQueryControl.prototype.ChangeShow_Click = function () {

        if (QueryControlPop.style.display == "block") {
            QueryControlPop.style.display = "none";
            cxkz.style.backgroundColor = "#35414f";
        }
        else {
            ServiceControlPop.style.display = "none";
            fuwubtn.style.backgroundColor = "#35414f";

            LayerControlPop.style.display = "none";
            tucengbtn.style.backgroundColor = "#35414f";

            QueryControlPop.style.display = "block";
            cxkz.style.backgroundColor = "#35b3fd";
        }

    }

    //关闭所有控制功能
    var ControlFunAllClose = function () {
        var ins = window.JJGis.Plugs.ControlFun.getInstance();
        if (true) {

        }
        //服务控制
        ins._ServiceControlPop.style.display = "none";
        fuwubtn.style.backgroundColor = "#35414f";

        //图层控制
        ins._LayerControlPop.style.display = "none";
        tucengbtn.style.backgroundColor = "#35414f";

        //查询控制
        ins._QueryControlPop.style.display = "none";
        cxkz.style.backgroundColor = "#35414f";

    }

    //查询控制弹出框
    if (window.JJGis.Plugs.ControlFun.QueryControl.QPopWindow) throw new Error('JJGis.Plugs.ControlFun.QueryControl.QPopWindow 类重复加载');
    var jJGisQPopWindow = window.JJGis.Plugs.ControlFun.QueryControl.QPopWindow = function () {
        this._masterElement = null;
    }
    var _jJGisQPopWindow = null;
    //获得 JJGis.Plugs.ControlFun.QueryControl.QPopWindow 实例
    jJGisQPopWindow.getInstance = function () {
        var rtn = null;
        if (_jJGisQPopWindow == null) {
            rtn = new window.JJGis.Plugs.ControlFun.QueryControl.QPopWindow();
            _jJGisQPopWindow = rtn;
        }
        else {
            rtn = _jJGisQPopWindow;
        }
        return rtn;
    }
    jJGisQPopWindow.Create = function () {
        var rtn = g.ce("div");
        rtn.className = "ak2";
        rtn.id = "MobileLayerSearch";

        rtn.innerHTML = " <div class='layerTitle'> 图层筛选</div> <button id='sivCtrlCloseBtn' class='layerCloseBtn' onclick='window.JJGis.Plugs.ControlFun.QueryControl.QPopWindow.cxclose();'> </button> <ul id='layerULList'> </ul>";

        var ins = window.JJGis.Plugs.ControlFun.getInstance();
        QueryControlPop=ins._QueryControlPop = rtn;

        return rtn;
    }
    jJGisQPopWindow.cxclose = function () {
        var ins = window.JJGis.Plugs.ControlFun.getInstance();
        ins._QueryControlPop.style.display = "none";
        cxkz.style.backgroundColor = "#35414f";
    }
}(Standard.Gis.Global);