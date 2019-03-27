/**
 * 数据图层基础类
 */
var BaseLayer=function(options){
	this._map=options.map;
	this._features=[];
	this._pointerevt=null;
	var selectStyle =  options.selectStyle;
	this.style =  options.style;
	var isSetType=options.isSetType||false;
	var datas = options.datas;
	var self=this;
	
	
	if(selectStyle==undefined){
		var styleutils=new styleUtils(BASE_URL);
		selectStyle=styleutils.getSelectStyle();
	}
	
	//数据集合
	this.dataSource=new ol.source.Vector();


	//数据图层
	var dataLayer=new ol.layer.Vector({
		source:this.dataSource
	})
	this._map.addLayer(dataLayer);
	
//	self._features=datatree.getFeatures();
	this._features = dataTrans(datas,this.style);
	this.dataSource.addFeatures(this._features);

	
	//添加弹出框
	this.popPanel=new popupPanel();
	this.popPanel.init();
	var pop=this.popPanel.getPopup();
	var closepop=this.popPanel.getClosePopup();
	this._map.addOverlay(pop);
	this._map.addOverlay(closepop);
	
	
	
	//数据列表
	this.datatree=new DataTree({
		map:self._map,
		datas:datas,
		popPanel:this.popPanel,
		selectStyle:selectStyle,
		style:this.style,
		isSetType:isSetType
	});
	
	//数据鼠标事件
	if(this._pointerevt==undefined){
		this._pointerevt=new pointerEvent({
			map:self._map,
			dataLayer:dataLayer,
			popPanel:this.popPanel,
			style:selectStyle
		});
	}
	
	
	//this._init(datas,features,options.style,options.selectStyle,options.isSetType);
}
function dataTrans(datass,style){
	var datas = datass.data;
	var features=[];
	if(datas==undefined||datas.length<=0)return features;
	var styleutils=new styleUtils(BASE_URL);
	for(var key in datas){
		var item=datas[key];
		if (item.PROPER.longitude != undefined || item.PROPER.latitude != undefined){
			var feature=new ol.Feature();
			var point = new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.PROPER.longitude),parseFloat(item.PROPER.latitude)]));
			feature.setProperties(item);
			feature.setGeometry(point);
			var proper = item.PROPER|| (item.PROPER)[0];
			var type = null;
			if(datass.flag == 10){
				if(true){//暂时写死
					style = styleutils.getZdwxyStyle();
				}else if(type == '2'){
					style = styleutils.getWhqyStyle();
				}else if(type == '3'){
					style = styleutils.getZcqyStyle();
				}
			}
			feature.setStyle(style);
			features.push(feature);
		}
	}
	return features;
}


BaseLayer.prototype={
	
	//释放资源
	destroy : function(){
		this._features=null;
		this.dataSource.clear();
		this.dataSource=null;
		this._map.remove(dataLayer);
		dataLayer=null;
	},
	
	//更新数据
	setUpdateData : function(datas){
		this.datatree.clearClickFeature();
		this._features=[];
		this.dataSource.clear();
		this.datatree.setData(datas.data);
		//this._features=this.datatree.getFeatures();
		this._features=dataTrans(datas,this.style);
		this.dataSource.addFeatures(this._features);
	},
	
	//条件查询
	search : function(filter){
		this.datatree.search(filter);
		this.dataSource.clear();
		this._features=this.datatree.getFeatures();
		this.dataSource.addFeatures(this._features);
	},
	
	getFeatures : function(){
		return this._features;
	},
	
	getFeaturesCount : function(){
		if(this._features==undefined)return 0;
		return this._features.length;
	},
	
	//清除数据
	clearFeatures : function(){
		this._features=[];
		this.dataSource.clear();
		this.datatree.clearClickFeature();
	},
	
	//获得图层中所有要素的范围
	getExtent : function(){
		return this.dataSource.getExtent();
	},
	
	clearSelection : function(){
		if(this._pointerevt==undefined)return;
		this._pointerevt.clearSelection();
	},
	
	//移除鼠标事件
	removeInteraction : function(){
		this._pointerevt.removeInteraction();
	},
	
	//添加鼠标事件
	addInteraction : function(){
		this._pointerevt.addInteraction();
	},
	
	//清除弹出框
	clearPopup : function(){
		this.popPanel.closeClosePopup();
		this.popPanel.hidePopup();
	}
}
