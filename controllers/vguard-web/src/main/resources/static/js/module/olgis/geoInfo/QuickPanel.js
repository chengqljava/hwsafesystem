/// <reference path="script/cbtree/util/TOC.js" />
/// <reference path="script/cbtree/util/TOC.js" />
!function () {
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.NavClick) throw new Error('JJgis.Gis.NavClick 类重复加载');
    var gisnavClick = window.JJgis.Gis.NavClick = function () {
        return 1;
    }
    var iscolor = false;
    //iden按钮
    gisnavClick.iden_Click = function () {

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

    //平移按钮
    gisnavClick.pingyi_Click = function () {

        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.pingyi(gh._gisMap, gh._navTool, gh._navigation);

    }
    //测量
    gisnavClick.celiang_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.celiang(gh._gisMap);

    }
    //等比放大
    gisnavClick.dengbida_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.dengbida(gh._gisMap, gh._navTool, gh._navigation);
    }
    //等比缩小
    gisnavClick.dengbixiao_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.dengbixiao(gh._gisMap, gh._navTool, gh._navigation);
    }
    //全图按钮
    gisnavClick.quantu_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.quantu(gh._gisMap, gh._navTool, gh._navigation);
    }
    //放大按钮
    gisnavClick.fangda_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.fangda(gh._gisMap, gh._navTool, gh._navigation);
    }
    //缩小按钮
    gisnavClick.suoxiao_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.suoxiao(gh._gisMap, gh._navTool, gh._navigation);
    }
    //前一视图按钮
    gisnavClick.qianyi_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.qianyi(gh._gisMap, gh._navTool, gh._navigation);
    }
    //后一视图按钮
    gisnavClick.houyi_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var nav = new window.JJgis.Gis.GisNavigation();
        nav.houyi(gh._gisMap, gh._navTool, gh._navigation);
    }
    //服务控制按钮
    gisnavClick.fuwu_Click = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance();
        var serCon = new window.JJgis.Gis.ServiceCon();

        serCon.start(gh._gisMap, gh._laynameList[0], gh._laynameList[1]);

    }
    //拖拽
    var srcdiv = null;
    gisnavClick.dropa = function (ev, divdom) {
        ev.preventDefault();
        //alert("dropa");
    }
    //gisnavClick.drag = function drag(ev, divdom) {
    //    srcdiv = divdom;
    //    alert("drag");
    //    //ev.dataTransfer.setData("text/html", divdom.currentSrc);
    //    //ev.preventDefault();
    //}

    function drop(ev, divdom) {
        ev.preventDefault();
        console.log("drop");
        if (srcdiv != divdom) {
            srcdiv.innerHTML = divdom.innerHTML;
            divdom.innerHTML = ev.dataTransfer.getData("text/html");
        }
    }

    //图层控制
    gisnavClick.tuceng_Click = function () {

        var gh = window.Standard.Gis.GisHelper.getInstance();
        var mapCon = new window.JJgis.Gis.MapCon();

        mapCon.start(gh._gisMap);


        //    var tempFtip = JJGis.Plugs.FeatureTip.getInstance();
        //    if (tempFtip._isShow) {
        //        tempFtip.close(); 
        //    } else {
        //        tempFtip.show();
        //    }


    }
    //查询控制
    gisnavClick.chaxun_Click = function () {
        var tempFtip = JJGis.Plugs.FeatureTip.getInstance();
        if (tempFtip._isShow) {
            tempFtip.close();
        } else {
            tempFtip.show();
        }
        if (Div3.style.display == "block") {
            Div3.style.display = "none";
            MobileLayerSearch.style.display = "none";
            cxkz.style.backgroundColor = "#35414f";
        }
        else {
            Div3.style.display = "block";
            MobileLayerSearch.style.display = "block";
            //3个窗体切换
            qkpRootContainer3.style.display = "none";
            document.getElementById('fwkz').style.backgroundColor = "#35414f";
            qkpRootContainer7.style.display = "none";
            document.getElementById('tckz').style.backgroundColor = "#35414f";
            qkpRootContainer6.style.display = "none";
            document.getElementById('celiang').style.backgroundColor = "#35414f";

            cxkz.style.backgroundColor = "#35b3fd";
        }
    }
    //预留按钮
    function em_Click() {
        if (qkpRootContainer3.style.display == "block") {
            qkpRootContainer3.style.display = "none";
        }
        else {
            qkpRootContainer3.style.display = "block";
        }
    }
} ();

//工具条
!function () {
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.GisNavigation) throw new Error('JJgis.Gis.GisNavigation 类重复加载');
    var gisNavigation = window.JJgis.Gis.GisNavigation = function () {
        return 1;
    }
    //平移
    gisNavigation.prototype.pingyi = function (map, navTool, Navigation) {
        navTool.activate(Navigation.PAN);
        document.getElementById('map').style.cursor = "pointer";
    }
    //等比放大
    gisNavigation.prototype.dengbida = function (map, navTool, Navigation) {
        map.setExtent(map.extent.expand(0.5));
    }

    //等比缩小
    gisNavigation.prototype.dengbixiao = function (map, navTool, Navigation) {
        map.setExtent(map.extent.expand(2));
    }

    var Constant = function () {
        this.measurement = null;

    }
    var IConstant = new Constant();
    gisNavigation.getConstant = function () {
        return IConstant;
    }
    //测量
    gisNavigation.prototype.celiang = function (map) {
        require(["esri/config", "esri/dijit/Measurement", "esri/units", "esri/tasks/GeometryService"], function (esriConfig, Measurement, Units, GeometryService) {

            if (qkpRootContainer6.style.display == "block") {
                qkpRootContainer6.style.display = "none";
                document.getElementById('celiang').style.backgroundColor = "#35414f";
                var measurement = JJgis.Gis.GisNavigation.getConstant().measurement;
                measurement.clearResult();
                measurement.setTool("area", false);
                measurement.setTool("distance", false);
                measurement.setTool("location", false);
            }
            else {
                Div3.style.display = "none";
                document.getElementById('cxkz').style.backgroundColor = "#35414f";
                qkpRootContainer6.style.display = "block";
                //3个窗体切换
                qkpRootContainer7.style.display = "none";
                document.getElementById('tckz').style.backgroundColor = "#35414f";
                qkpRootContainer3.style.display = "none";
                document.getElementById('fwkz').style.backgroundColor = "#35414f";

                document.getElementById('celiang').style.backgroundColor = "#35b3fd";
                //esriConfig.defaults.io.proxyUrl = "/proxy/";
                if (JJgis.Gis.GisNavigation.getConstant().measurement == null) {
                    esriConfig.defaults.io.alwaysUseProxy = false;
                    esriConfig.defaults.geometryService = new GeometryService("http://151.1.3.31/ArcGIS/rest/services/Geometry/GeometryServer");

                    JJgis.Gis.GisNavigation.getConstant().measurement = new Measurement({
                        map: map,
                        defaultAreaUnit: Units.SQUARE_METERS,
                        defaultLengthUnit: Units.KILOMETERS
                    }, document.getElementById("celiangDIV"));
                    JJgis.Gis.GisNavigation.getConstant().measurement.startup();
                }

            }

        });


    }

    //全图
    gisNavigation.prototype.quantu = function (map, navTool, Navigation) {
        navTool.zoomToFullExtent();
    }
    //放大
    gisNavigation.prototype.fangda = function (map, navTool, Navigation) {
        navTool.activate(Navigation.ZOOM_IN);
        document.getElementById('fangda').style.backgroundColor = "#35b3fd";
        document.getElementById('map').onmouseup = function () {
            setTimeout(function () {
                document.getElementById('fangda').style.backgroundColor = "#35414f";
                navTool.deactivate();
            }, 1000);
        }


    }
    //缩小
    gisNavigation.prototype.suoxiao = function (map, navTool, Navigation) {
        navTool.activate(Navigation.ZOOM_OUT);
        document.getElementById('suoxiao').style.backgroundColor = "#35b3fd";
        document.getElementById('map').onmouseup = function () {
            setTimeout(function () {
                document.getElementById('suoxiao').style.backgroundColor = "#35414f";
                navTool.deactivate();
            }, 1000);
        }

    }
    //前一视图
    gisNavigation.prototype.qianyi = function (map, navTool, Navigation) {
        navTool.zoomToPrevExtent();
    }
    //后一视图
    gisNavigation.prototype.houyi = function (map, navTool, Navigation) {
        navTool.zoomToNextExtent();
    }
} ()

//服务控制
!function () {
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.ServiceCon) throw new Error('JJgis.Gis.ServiceCon 类重复加载');
    var serviceCon = window.JJgis.Gis.ServiceCon = function () {
        return 1;
    }
    serviceCon.prototype.start = function (map, baseMapLayer, nettiledMap) {
        if (qkpRootContainer3.style.display == "block") {
            qkpRootContainer3.style.display = "none";
            document.getElementById('fwkz').style.backgroundColor = "#35414f";
        }
        else {
            qkpRootContainer3.style.display = "block";
            //3个窗体切换
            qkpRootContainer7.style.display = "none";
            document.getElementById('tckz').style.backgroundColor = "#35414f";
            qkpRootContainer6.style.display = "none";
            document.getElementById('celiang').style.backgroundColor = "#35414f";
            Div3.style.display = "none";
            document.getElementById('cxkz').style.backgroundColor = "#35414f";


            document.getElementById('fwkz').style.backgroundColor = "#35b3fd";
            if (map.getLayer("地形图") == null) {
                document.getElementById('addOfDel').style.background = "";
            } else {
                document.getElementById('addOfDel').style.background = "url('images/xz.png')";
            }
            if (map.getLayer("切片管网") == null) {
                document.getElementById('addOfDel2').style.background = "";
            } else {
                document.getElementById('addOfDel2').style.background = "url('images/xz.png')";
            }
            document.getElementById('addOfDel').onmouseover = function () {
                if (map.getLayer("地形图") == null) {
                    document.getElementById('addOfDel').style.background = "";
                } else {
                    document.getElementById('addOfDel').style.background = "url('images/sc.png')";
                }
            }
            document.getElementById('addOfDel').onmouseleave = function () {
                if (map.getLayer("地形图") == null) {
                    document.getElementById('addOfDel').style.background = "";
                } else {
                    document.getElementById('addOfDel').style.background = "url('images/xz.png')";
                }
            }
            document.getElementById('addOfDel').onclick = function () {
                map.removeLayer(baseMapLayer);
            }
            document.getElementById('dxt').ondragend = function () {
                if (map.getLayer("地形图") == null) {
                    map.addLayer(baseMapLayer, 0);
                    document.getElementById('addOfDel').style.background = "url('images/xz.png')";
                }
            }
            document.getElementById('addOfDel2').onmouseover = function () {
                if (map.getLayer("切片管网") == null) {
                    document.getElementById('addOfDel2').style.background = ""
                } else {
                    document.getElementById('addOfDel2').style.background = "url('images/sc.png')";
                }
            }
            document.getElementById('addOfDel2').onmouseleave = function () {
                if (map.getLayer("切片管网") == null) {
                    document.getElementById('addOfDel2').style.background = ""
                } else {
                    document.getElementById('addOfDel2').style.background = "url('images/xz.png')";
                }
            }
            document.getElementById('addOfDel2').onclick = function () {
                map.removeLayer(nettiledMap);
            }
            document.getElementById('qpgw').ondragend = function () {
                if (map.getLayer("切片管网") == null) {
                    map.addLayer(nettiledMap, 1);
                    document.getElementById('addOfDel2').style.background = "url('images/xz.png')";
                }
            }
        }
    }
} ()




//图层控制
!function () {
    var toc = null;
    window.JJgis = window.JJgis || {};
    window.JJgis.Gis = window.JJgis.Gis || {};
    if (window.JJgis.Gis.MapCon) throw new Error('JJgis.Gis.MapCon 类重复加载');
    var mapCon = window.JJgis.Gis.MapCon = function () {
        return 1;
    }
    var map = null;
    mapCon.prototype.start = function () {
        var gh = window.Standard.Gis.GisHelper.getInstance(); //_gisMap
        require(["cbtree/util/TOC", ], function (TOC) {
                if (toc == null) {
                    toc = new TOC({
                        checked: true,
                        name: "图层列表",
                        enableDelete: true,
                        deleteRecursive: true,
                        valueToIconMap: { subType: { "*": "* maki"} }
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
    }

    function getRootParent(item) {
        var parentId = item.parent;
        var parent = toc.get(parentId);
        if (parent && parent.type.indexOf("HEADER") < 0) {
            return getRootParent(parent);
        }
        return parent;
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

    function showTooltip(evt) {
        // Popup a tooltip when hovering over a earthquake symbol.
        var attr = evt.graphic.attributes;
        var magn = Math.round(attr.Magnitude * 10) / 10;
        var ttDlg = new TooltipDialog({
            id: "toolTipDialog",
            content: attr.Name + "<br />Magnitude: " + magn + "<br />Injured: " + (attr.Num_Injured || "0") +
       "<br />Deaths: " + (attr.Num_Deaths || "0"),
            style: "position: absolute; width: 250px; font: normal normal bold 6pt Tahoma;z-index:100"
        });
        ttDlg.startup();
        dijit.placeOnScreen(ttDlg.domNode, { x: evt.pageX, y: evt.pageY }, ["TL", "BL"], { x: 10, y: 10 });
    }

    function closeTooltip() {
        var widget = dijit.byId("toolTipDialog");
        if (widget) {
            widget.destroy()
        }
    }

} ()


   


