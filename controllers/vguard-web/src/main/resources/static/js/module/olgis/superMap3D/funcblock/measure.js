var Measure = function(scene,sceneControl){
	this._scene = scene;
	this._sceneControl = sceneControl;
	this.altitudeMode = 0;
	this.tag = null;
	self = this;
};
Measure.prototype = {
	//距离量算
	measureDis : function(){
		var measureDisAction = new SuperMap.Web.UI.Action3Ds.MeasureDistance(this._sceneControl);
		this._sceneControl.set_sceneAction(measureDisAction);
		this.altitudeMode = 2;
		this._sceneControl.addEvent("measureDistance",this.disHandler);
		this._sceneControl.addEvent("measureDistanceFinished",this.disFinishedHandler);
	},

	//面积量算
	measureArea : function(){
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.MeasureArea(this._sceneControl);
		this._sceneControl.set_sceneAction(measureAreaAction);
		this.altitudeMode = 2;
		this.tag = "MeasureArea";
		this._sceneControl.addEvent("measureArea",this.areaHandler);
		this._sceneControl.addEvent("measureAreaFinished",this.areaFinishedHandler);
	},

	//高程量算
	measureHeight : function(){
		//设置控件的当前操作为高程量算
		var measureHeightAction = new SuperMap.Web.UI.Action3Ds.MeasureHeight(sceneControl);
		sceneControl.set_sceneAction(measureHeightAction);
		//给高程算事件和量算结束事件注册回调函数
		this.altitudeMode = 2;
		sceneControl.addEvent("measureHeight", this.heightHandler);
		sceneControl.addEvent("measureHeightFinished", this.heightFinishedHandler);
	},

	//水平距离
	measureLevel : function(){
		 //设置控件的当前操作为面积量算
		var MeasureHorizontalDistance = new SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance(sceneControl);
		sceneControl.set_sceneAction(MeasureHorizontalDistance);
		//给面积量算事件和量算结束事件注册回调函数
        this.altitudeMode = 2;
		sceneControl.addEvent("measureDistance", this.disHandler);
		sceneControl.addEvent("measureDistanceFinished", this.disFinishedHandler);
	},
	clearAll : function(){
		utils.pan(this._sceneControl);
		this._scene.get_trackingLayer3D().removeAll();
	},
	disHandler : function (dCurrentDis,line3d){
		//量算过程中及时的显示量算信息
        var text = "距离：" + dCurrentDis[0].toFixed(2) + "米"+ "    总距离："  +  dCurrentDis[1].toFixed(2) +  "米";
		window.status=text;
	},
	disFinishedHandler : function(dTotalDis,line3D){
		if (line3D == null) {
	        return;
	    }
        var unit = '米';
        if(dTotalDis >1000){
            dTotalDis=dTotalDis/1000;
            unit="千米"
        }
        var text = '总距离：' + dTotalDis.toFixed(2) + unit;

        self.AddGeometryPoint(line3D,text);
		self.tag = "MeasureDistance";
        self.addGeometryToScene(line3D,self.tag);
	},
	areaHandler : function(dArea){
		window.status="面积：" + dArea + "平方米" ;
	},
	areaFinishedHandler : function(dArea,region3d){
		var unit = '平方米';
        if(dArea >1000000){
            unit = "平方千米";
            dArea = dArea/1000000;
        }
        var text = '总面积：' + dArea.toFixed(2) + unit;
        self.addGeometryToScene(region3d,self.tag);
        self.AddGeometryPoint(region3d);

        /*添加标注字体*/
        var point3D = region3d.get_innerPoint3D();
        self.addTextToScene(text,point3D,"MeasureArea");

	},
	heightHandler : function(dHeight) {
		window.status="高程：" + dHeight + "米";
	},
	heightFinishedHandler : function(dHeight, line3D){
		var text = '高程：' + dHeight.toFixed(2) + '米';
        //量算结束后显示总的高程信息
        self.AddGeometryPoint(line3D,text);
        self.addGeometryToScene(line3D,"heightLine");
	},
	AddGeometryPoint : function(geo,strText){
		if(geo == null){
			return;
		}
        for (var i = 0; i < geo.get_partCount() ; i++) {
            var point3Ds = geo.getPart(i);
            for (var j = 0; j < point3Ds.get_count() ; j++) {
                var point3D = point3Ds.get_item(j);
                var geoPoint = new SuperMap.Web.Core.GeoPoint3D(point3D);
                self.addGeometryToScene(geoPoint,"disLine_"+j);

                //特殊处理最后一个点
                if ((j == point3Ds.get_count() - 1) && (strText != undefined)) {
                	self.addTextToScene(strText,point3D,"MeasureDistance");
                }
            }
        }
    },
    addGeometryToScene : function(geometry,tag){
        var feature3D = new SuperMap.Web.Core.Feature3D();
        feature3D.set_geometry(geometry);
        var style3d = new SuperMap.Web.Core.Style3D();
        style3d.set_altitudeMode(self.altitudeMode);
        style3d.set_markerColor(new SuperMap.Web.Core.Color(255, 0, 255, 250));
        style3d.set_lineWidth(1.5);
        style3d.set_lineColor(new SuperMap.Web.Core.Color(255, 255, 0, 255));
        style3d.set_fillForeColor(new SuperMap.Web.Core.Color(255, 255, 0, 100));
        feature3D.set_style3D(style3d);
        self._scene.get_trackingLayer3D().add(feature3D, tag);
    },
    addTextToScene : function(text,position,tag){
        var feature3D = new SuperMap.Web.Core.Feature3D();
        var geoText3D = new SuperMap.Web.Core.GeoText3D();
        var textPart3D = new SuperMap.Web.Core.TextPart3D(text, position);
        geoText3D.addPart(textPart3D);
        feature3D.set_geometry(geoText3D);

        var style3d = new SuperMap.Web.Core.Style3D();
        style3d.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);

        var textStyle = new SuperMap.Web.Core.TextStyle3D();
        textStyle.set_outline(true);
        textStyle.set_foreColor(new SuperMap.Web.Core.Color(255, 255, 0, 255));
        textStyle.set_backColor(new SuperMap.Web.Core.Color(0,0,0,255));
        textStyle.set_isSizeFixed(true);
        textStyle.set_fontScale(1.2);
        feature3D.set_textStyle3D(textStyle);
        feature3D.set_style3D(style3d);
        self._scene.get_trackingLayer3D().add(feature3D, tag);
    }


}






