//描述：grid窗口控件
//时间：2016-1-4 11:16:31
//研发人员：史家欢
!function (g, sysConfig, ghp) {
    //TODO:自动生成部分 史家欢 2015-12-28

    //初始化名称空间
    window.JJGis = window.JJGis || {};
    window.JJGis.Plugs = window.JJGis.Plugs || {};


    //实现
    if (window.JJGis.Plugs.FeatureGrid) throw new Error('JJGis.Plugs.FeatureGrid 类重复加载');
    var jJGisFeatureGrid = window.JJGis.Plugs.FeatureGrid = function () {
        this._masterElement = null; //整合窗口控件
        this._resSelTypeElement = null; //左侧选择对象
        this._resSelColElement = null; //右侧结果集对象
        this._selectList = null; //选中要素集合
        this._selectFeature = null; //选中要素
        this._fgdShowEle = null; //隐藏显示按钮
        this._fgdCloseEle = null; //关闭按钮
        this._fgdRSColHeadInfo = null; //列表head容器对象
        this._fgdRSColContent = null; //列表容器对象
        this._fgdFDVContent = null; //窗口控件
        this._fgdrResInfo = null; //窗口标题
        this._colCount = null; //记录数量
        this._currentCount = null; //当前数量
    }
    var _jJGisFeatureGrid = null;
    //获得 JJGis.Plugs.FeatureGrid 实例
    jJGisFeatureGrid.getInstance = function () {
        var rtn = null;
        if (_jJGisFeatureGrid == null) {
            rtn = new window.JJGis.Plugs.FeatureGrid();
            _jJGisFeatureGrid = rtn;
        }
        else {
            rtn = _jJGisFeatureGrid;
        }
        return rtn;
    }
    //创建
    jJGisFeatureGrid.Create = function () {
        var ins = new JJGis.Plugs.FeatureGrid();
        var rtn = g.gb("FeatureDataView");

        ins._masterElement = rtn;
        ins._resSelTypeElement = g.gb("fgdResSelType");
        ins._resSelColElement = g.gb("fgdResSelColElement");

        ins._fgdShowEle = g.gb("fgdShow");
        ins._fgdCloseEle = g.gb("fgdClose");
        ins._fgdRSColHeadInfo = g.gb("fgdRSColHeadInfo");
        ins._fgdRSColContent = g.gb("fgdRSColContent");
        ins._fgdFDVContent = g.gb("fgdFDVContent");
        ins._fgdrResInfo = g.gb("fgdrResInfo");

        rtn.show = g.cd(ins, ins.show);
        rtn.close = g.cd(ins, ins.close);
        rtn.setSelectList = g.cd(ins, ins.setSelectList);
        rtn.getSelectList = g.cd(ins, ins.getSelectList);

        rtn.setSelectFeature = g.cd(ins, ins.setSelectFeature);
        rtn.getSelectFeature = g.cd(ins, ins.getSelectFeature);
        rtn.setData = g.cd(ins, ins.setData);
        rtn.clearSelTypeElement = g.cd(ins, ins.clearSelTypeElement);
        rtn.clearSelColElement = g.cd(ins, ins.clearSelColElement);
        rtn.clear = g.cd(ins, ins.clear);
        rtn.getResSelTypeElement = g.cd(ins, ins.getResSelTypeElement);
        rtn.getFgdResSelColElement = g.cd(ins, ins.getFgdResSelColElement);
        rtn.setTitle = g.cd(ins, ins.setTitle);

        var showClick = g.cd(ins, ins.showChange_click);
        g.ah(ins._fgdShowEle, 'click', showClick);

        var closeClick = g.cd(ins, ins.close_click);
        g.ah(ins._fgdCloseEle, 'click', closeClick);

        _jJGisFeatureGrid = rtn;
    }

    //显示窗口
    jJGisFeatureGrid.prototype.show = function () {
        this._masterElement.style.height = "230px";
        this._fgdFDVContent.style.display = "block";
        this._fgdShowEle.style.backgroundImage = "url('images/箭头向下.png')";
    }
    //关闭窗口
    jJGisFeatureGrid.prototype.close = function () {
        this._masterElement.style.height = "0px";
        this._fgdFDVContent.style.display = "none";
        this._fgdShowEle.style.backgroundImage = "url('images/箭头向上.png')";
    }
    //窗口标题
    jJGisFeatureGrid.prototype.setTitle = function (model) {

        this._fgdrResInfo.innerHTML = model;
    }
    //设置选中列
    jJGisFeatureGrid.prototype.setSelectList = function (model) {
        this._selectList = model;
        return this._selectList;
    }
    //获取选中列
    jJGisFeatureGrid.prototype.getSelectList = function () {

        return this._selectList;
    }
    //设置选中要素
    jJGisFeatureGrid.prototype.setSelectFeature = function (model) {

        this._selectFeature = model;
        return this._selectFeature;
    }
    //获取选中要素
    jJGisFeatureGrid.prototype.getSelectFeature = function () {

        return this._selectFeature;
    }

    //设置数据结果集
    jJGisFeatureGrid.prototype.setData = function (FeatureList) { }

    //清除左侧选择对象
    jJGisFeatureGrid.prototype.clearSelTypeElement = function () {
        var tempUL = g.gb("fgdResContent").children[0];
        tempUL.innerHTML = "";
    }
    //清除右侧结果集对象
    jJGisFeatureGrid.prototype.clearSelColElement = function () {

        var tempHead = g.gb("fgdRSColHeadInfo");
        tempHead.innerHTML = "";
        var tempCol = g.gb("fgdRSColContent");
        tempCol.innerHTML = "";
    }

    //清除左右侧结果集对象
    jJGisFeatureGrid.prototype.clear = function () {
        this._masterElement.clearSelTypeElement();
        this._masterElement.clearSelColElement();
    }
    jJGisFeatureGrid.prototype.getResSelTypeElement = function () {
        return this._resSelTypeElement;
    }
    jJGisFeatureGrid.prototype.getFgdResSelColElement = function () {
        return this._resSelColElement;
    }

    //隐藏显示事件
    jJGisFeatureGrid.prototype.showChange_click = function () {
        if (this._fgdFDVContent.style.display == "none" || this._fgdFDVContent.style.display == "") {
            this._masterElement.style.height = "230px";
            this._fgdFDVContent.style.display = "block";
            this._fgdShowEle.style.backgroundImage = "url('images/箭头向下.png')";
        } else {

            this._masterElement.style.height = "0px";
            this._fgdFDVContent.style.display = "none";
            this._fgdShowEle.style.backgroundImage = "url('images/箭头向上.png')";
        }
    }

    //隐藏关闭事件
    jJGisFeatureGrid.prototype.close_click = function () {
        this._masterElement.close();
    }

    //实现
    if (window.JJGis.Plugs.FeatureList) throw new Error('JJGis.Plugs.FeatureList 类重复加载');
    var jJGisFeatureList = window.JJGis.Plugs.FeatureList = function () {
        this._masterElement = null;
        this._fid = null; //Id号
        this._name = null; //显示名称
        this._icon = null; //图标
        this._ftrCount = null; //数量
        this._feature = null; //Feature对象集合
    }
    var _jJGisFeatureList = null;
    //获得 JJGis.Plugs.FeatureList 实例
    jJGisFeatureList.getInstance = function () {
        var rtn = null;
        if (_jJGisFeatureList == null) {
            rtn = new window.JJGis.Plugs.FeatureList();
            _jJGisFeatureList = rtn;
        }
        else {
            rtn = _jJGisFeatureList;
        }
        return rtn;
    }
    //创建父级容器默认是 _resSelTypeElement

    jJGisFeatureList.Create = function (fid, name, icon, ftrCount, feature) {

        var tempUL = g.gb("fgdResContent").children[0];
        var mLI = g.ce("li");
        tempUL.appendChild(mLI);

        var mDiv = g.ce("div");
        mLI.appendChild(mDiv);

        mDiv.className = "fgdRTCountent";

        mDiv.innerHTML = name + "[" + feature.featureSet.features.length + "]";
        mDiv.style.backgroundImage = "url('" + icon + "')";
        var ins = new JJGis.Plugs.FeatureList();

        ins._masterElement = mDiv;
        ins._fid = fid;
        ins._name = name;
        ins._icon = icon;
        ins._ftrCount = ftrCount;
        ins._feature = feature;

        var flClick = g.cd(ins, ins.featureList_click);
        g.ah(mDiv, 'click', flClick);

        //return mLI;
    }

    //点击事件，设置选中焦点样式
    jJGisFeatureList.prototype.featureList_click = function () {
        var tempJpf = JJGis.Plugs.FeatureGrid.getInstance();
        var tempSel = tempJpf.getSelectList();
        if (tempSel) {
            tempSel._masterElement.className = "fgdRTCountent";
        }
        tempJpf.setSelectList(this);
        this._masterElement.className = "fgdRTCountentSelect";
        var tempItem = new JJGis.Plugs.FeatureItem();
        tempItem.setData(this._feature);

    }

    //实现
    if (window.JJGis.Plugs.FeatureItem) throw new Error('JJGis.Plugs.FeatureItem 类重复加载');
    var jJGisFeatureItem = window.JJGis.Plugs.FeatureItem = function () {
        this._masterElement = null;
        this._feature = null;
    }
    var _jJGisFeatureItem = null;
    //获得 JJGis.Plugs.FeatureItem 实例
    jJGisFeatureItem.getInstance = function () {
        var rtn = null;
        if (_jJGisFeatureItem == null) {
            rtn = new window.JJGis.Plugs.FeatureItem();
            _jJGisFeatureItem = rtn;
        }
        else {
            rtn = _jJGisFeatureItem;
        }
        return rtn;
    }
    var tGridShowCount = 20; //每次显示的结果数量最大值
    //设置对象属性（自动会清空上次结果）而且还包括自动创建create
    jJGisFeatureItem.prototype.setData = function (model) {
        var tempJpf = JJGis.Plugs.FeatureGrid.getInstance();
        tempJpf.clearSelColElement();
        tempJpf._colCount = 0;
        tempJpf._currentCount = 0;

        var tempUL = g.ce("ul");
        for (var i = 0; i < model.featureSet.fields.length; i++) {
            var tempA = model.featureSet.fields[i].alias;
            var tempLI = g.ce("li");
            tempLI.innerHTML = tempA;
            tempUL.appendChild(tempLI);
        }
        var tempHead = g.gb("fgdRSColHeadInfo");
        var tempCol = g.gb("fgdRSColContent");
        var tempSelType = g.gb("fgdResSelType");
        var tempFeatureDataView = g.gb("FeatureDataView");

        var tempWidth = model.featureSet.fields.length * 122;
        var tempW = document.body.clientWidth - 290;
        if (tempWidth < tempW) {
            tempWidth = tempW;
            tempJpf.getFgdResSelColElement().style.overflowX = "hidden";
        } else {
            tempJpf.getFgdResSelColElement().style.overflowX = "auto";
        }


        var ghpIns = ghp.getInstance();

        //兼容IOS写法 
        if (ghpIns._equipmentType == "IPAD" || ghpIns._equipmentType == "IPHONE") {
            tempCol.style.height = (tempFeatureDataView.clientHeight - tempSelType.clientHeight - 1) + "px";
        } else {
            tempHead.style.width = tempWidth + "px";
            tempCol.style.width = tempWidth + "px";
        }



        tempHead.appendChild(tempUL); // model.featureSet.features.length
        var tempCount = 0;
        var tempLoadMore = null;
        if (model.featureSet.features.length > tGridShowCount) {
            tempCount = tGridShowCount;
            tempJpf._currentCount = tGridShowCount;

            var tempLoadMore = g.ce("div");
            tempLoadMore.className = "fgdRSColMore";
            tempLoadMore.id = "fgdRSColMore";
            tempLoadMore.innerHTML = "加载更多......";
            var tempins = new JJGis.Plugs.FeatureItem();
            var tempLoadMoreClick = g.cd(tempins, tempins.loadMore_click);
            g.ah(tempLoadMore, 'click', tempLoadMoreClick);



        } else {
            tempCount = model.featureSet.features.length;
            tempJpf._currentCount = tempCount;
        }
        tempJpf._colCount = model.featureSet.features.length;

        for (var i = 0; i < tempCount; i++) {
            var tempFeature = model.featureSet.features[i];
            var tempRscol = g.ce("div");
            tempRscol.className = "fgdRSColItem";
            var tempRsUL = g.ce("ul");
            tempRscol.appendChild(tempRsUL);
            var tempins = new JJGis.Plugs.FeatureItem();
            tempins._feature = tempFeature;
            tempins._masterElement = tempRscol;

            var tempSClick = g.cd(tempins, tempins.select_click);
            g.ah(tempRscol, 'click', tempSClick);

            for (var j = 0; j < model.featureSet.fields.length; j++) {
                var tempRsLi = g.ce("li");

                var tempArr = model.featureSet.fields[j].alias;
                var tempFName = model.featureSet.fields[j].name;
                var tempValue = tempFeature.attributes[tempFName];

                var tempItemColCov = g.ce("div");
                var tempItemItemColName = g.ce("div");
                var tempItemItemValue = g.ce("div");

                tempItemColCov.className = "fgdRSCItemColCov";
                tempItemItemColName.className = "fgdRSCItemColName";
                tempItemItemValue.className = "fgdRSCItemValue";

                tempItemItemColName.innerHTML = tempArr;
                tempItemItemValue.innerHTML = tempValue;

                tempItemColCov.appendChild(tempItemItemColName);
                tempItemColCov.appendChild(tempItemItemValue);
                tempRsLi.appendChild(tempItemColCov);

                tempRsLi.title = tempValue;
                //tempRsLi.innerHTML = tempValue;
                tempRsUL.appendChild(tempRsLi);
            }

            tempCol.appendChild(tempRscol);

            if (ghpIns._equipmentType == "IPAD" || ghpIns._equipmentType == "IPHONE") {
                var tempRscolLine = g.ce("div");
                tempRscolLine.className = "fgdRSColItemLine";
                tempRscolLine.innerHTML = "------------分割线------------";
                tempCol.appendChild(tempRscolLine);
            }


        }
        if (tempLoadMore) {
            //兼容写法
            tempCol.appendChild(tempLoadMore);

        }
        var tempXDiv = g.ce("div");
        tempXDiv.id = "fgdRSColMoreClearBoth";
        tempXDiv.className = "fgdRSColMoreClearBoth";
        tempCol.appendChild(tempXDiv);

    }
    //清除当前内容
    jJGisFeatureItem.prototype.clear = function () {
    }
    //单行选中事件，隐含定位高亮，设置选中焦点样式
    jJGisFeatureItem.prototype.select_click = function () {
        var ths = this;
        var tempJpf = JJGis.Plugs.FeatureGrid.getInstance();
        var gh = window.Standard.Gis.GisHelper.getInstance();

        var map = gh._gisMap;
        var tempFeature = tempJpf.getSelectFeature();
        if (tempFeature) {
            tempFeature._masterElement.className = "fgdRSColItem";

            var tempSymbol = sysConfig.getSymbols(tempFeature._fid);
            for (var i = 0; i < map.graphics.graphics.length; i++) {
                var tempGraphic = map.graphics.graphics[i];
                if (tempGraphic.geometry == tempFeature._feature.geometry) {
                    tempGraphic.symbol = tempSymbol;
                }
            }

        }

        this._masterElement.className = "fgdRSColItemSelect";
        tempJpf.setSelectFeature(this);
        this._fid = tempJpf.getSelectList()._fid;

        var tex = this._feature.geometry.getExtent();
        if (this._feature.geometry.type == "point") {
            var tempSymbol = sysConfig.getHighSymbols(tempJpf.getSelectList()._fid);
            for (var i = 0; i < map.graphics.graphics.length; i++) {
                var tempGraphic = map.graphics.graphics[i];
                if (tempGraphic.geometry == this._feature.geometry) {
                    tempGraphic.symbol = tempSymbol;
                }
            }

            map.centerAt(this._feature.geometry);
        }
        if (this._feature.geometry.type == "polyline") {
            var tempSymbol = sysConfig.getHighSymbols(tempJpf.getSelectList()._fid);
            for (var i = 0; i < map.graphics.graphics.length; i++) {
                var tempGraphic = map.graphics.graphics[i];
                if (tempGraphic.geometry == this._feature.geometry) {
                    tempGraphic.symbol = tempSymbol;
                }
            }
            var ttx = this._feature.geometry.getExtent();
            map.setExtent(ttx, true);

            //map.centerAt(this._feature.geometry);
        }
        map.graphics.refresh();
        //
        //		map.setExtent(, false);
        //		var model = tempJpf.getSelectList()._feature;
    }
    //加载更多事件
    jJGisFeatureItem.prototype.loadMore_click = function () {
        //alert("加载更多......");
        var tempJpf = JJGis.Plugs.FeatureGrid.getInstance();
        var tempCol = g.gb("fgdRSColContent");
        var model = tempJpf.getSelectList()._feature;
        var tempCount = tempJpf._currentCount + tGridShowCount;

        var tempLoadMore = g.gb("fgdRSColMore");
        var tempXDiv = g.gb("fgdRSColMoreClearBoth");

        if (model.featureSet.features.length > tempCount) {

        } else {
            tempCount = model.featureSet.features.length;
        }
        tempCol.removeChild(tempLoadMore);
        tempCol.removeChild(tempXDiv);
        for (var i = tempJpf._currentCount; i < tempCount; i++) {
            var tempFeature = model.featureSet.features[i];
            var tempRscol = g.ce("div");
            tempRscol.className = "fgdRSColItem";
            var tempRsUL = g.ce("ul");
            tempRscol.appendChild(tempRsUL);
            var tempins = new JJGis.Plugs.FeatureItem();
            tempins._feature = tempFeature;
            tempins._masterElement = tempRscol;

            var tempSClick = g.cd(tempins, tempins.select_click);
            g.ah(tempRscol, 'click', tempSClick);

            for (var j = 0; j < model.featureSet.fields.length; j++) {
                var tempRsLi = g.ce("li");

                var tempArr = model.featureSet.fields[j].alias;
                var tempFName = model.featureSet.fields[j].name;
                var tempValue = tempFeature.attributes[tempFName];

                var tempItemColCov = g.ce("div");
                var tempItemItemColName = g.ce("div");
                var tempItemItemValue = g.ce("div");

                tempItemColCov.className = "fgdRSCItemColCov";
                tempItemItemColName.className = "fgdRSCItemColName";
                tempItemItemValue.className = "fgdRSCItemValue";

                tempItemItemColName.innerHTML = tempArr;
                tempItemItemValue.innerHTML = tempValue;

                tempItemColCov.appendChild(tempItemItemColName);
                tempItemColCov.appendChild(tempItemItemValue);
                tempRsLi.appendChild(tempItemColCov);

                tempRsLi.title = tempValue;
                //tempRsLi.innerHTML = tempValue;
                tempRsUL.appendChild(tempRsLi);
            }
            tempCol.appendChild(tempRscol);

            var ghpIns = ghp.getInstance();
            if (ghpIns._equipmentType == "IPAD" || ghpIns._equipmentType == "IPHONE") {
                var tempRscolLine = g.ce("div");
                tempRscolLine.className = "fgdRSColItemLine";
                tempRscolLine.innerHTML = "------------分割线------------";
                tempCol.appendChild(tempRscolLine);
            }
        }

        if (model.featureSet.features.length > tempCount) {
            tempJpf._currentCount = tempCount;
            tempCol.appendChild(tempLoadMore);


        } else {
            tempJpf._currentCount = model.featureSet.features.length;
        }
        tempCol.appendChild(tempXDiv);
    }


} (Standard.Gis.Global, Standard.Gis.SysConfig, Standard.Gis.GisHelper)