/**
 * 重大危险源及其下属类型图层
 */
var EnterpriseVectorLayer=function(options){
	this._map=options.map;
	this._type=options.type;
	//this._init();
	
	var self=this;
	
	var styleutils=new styleUtils();
	
	//数据样式
	
	var selectStyle=styleutils.getSelectStyle();
	
	this._datas=_getDatas(self._type);
	this.baseLayer=new BaseLayer({
		map:self._map,
		datas:self._datas,
		style:self._datas.style,
		selectStyle:selectStyle
	});
}
	

	
	//获得数据
	function _getDatas(type){
		var styleutils=new styleUtils();
		var datas;
		var _style;
		var flag=0; 
		switch(type){
			case "所有企业":
				datas = businessAllList();
				flag = 10;
				break;
			case "重大危险源":
				datas = businessByDanger("1");
				flag=0;
				break;
			case "危险化学品":
				datas = businessByDangerType("1");
				flag=0;
				break;
			case "燃气类":
				datas = businessByDangerType("2");
				flag=0;
				break;
			case "港口":
				datas = businessByDangerType("3");
				flag=0;
				break;
			case "危化企业":
				datas = businessByChemical("1");
				flag=1;
				break;
			case "生产":
				datas = businessByChemicalType("3");
				flag=1;
				break;
			case "经营":
				datas = businessByChemicalType("4");
				flag=1;
				break;
			case "运输":
				datas = businessByChemicalType("5");
				flag=1;
				break;
			case "使用":
				datas = businessByChemicalType("6");
				flag=1;
				break;
			case "废弃物处置":
				datas = businessByChemicalType("7"); 
				break;
			case "无需许可":
				datas = businessByChemicalType("2");
				flag=1;
				break;
			case "应急机构":
				datas = emergerByOrgan();
				flag=2;
				break;
			case "应急仓库":
				datas = emergerByDepos();
				flag=3;
				break;
			case "应急队伍":
				datas = emergerByTeam();
				flag=4;
				break;
			case "应急物资":
				datas = emergerByMaterial();
				flag=5;
				break;
			case "隐患分布":
				datas = entHiddendanger();
				flag=6;
				break;
		}
		if(flag==0){
			_style=styleutils.getZdwxyStyle();
		}else if(flag==1){
			_style=styleutils.getWhqyStyle();
		}else if(flag==2){
			_style=styleutils.getYjjgStyle();
		}else if(flag==3){
			_style=styleutils.getYjckStyle();
		}else if(flag==4){
			_style=styleutils.getYjdwStyle();
		}else if(flag==5){
			_style=styleutils.getYjwzStyle();
		}else if(flag==6){
			_style=styleutils.getYhfbStyle();
		}
		var datares = datatrans(datas,flag);
		var datas = {
				data:datares,
				flag:flag,
				style:_style
		};
		
		return datas;
	}
	
	 function datatrans(data,flag){
		 var dataArray = [];
		 if(data==undefined||data.length<=0)return;
		 if(flag == 0 || flag == 1 || flag == 10){
			 for(var i = 0;i<data.length;i++){
				 var datamap = {};
				 datamap["NAME"] = data[i].entname;
				 datamap["ID"] = data[i].businessinfoid;
				 datamap["LONGITUDE"] = data[i].longitude;
				 datamap["LATITUDE"] = data[i].latitude;
				 datamap["PROPER"] = data[i];
				 datamap["POPFLAG"] = "ent";
				 dataArray.push(datamap);
			 }
		 }else if(flag == 2){
			 for(var i = 0;i<data.length;i++){
				 var datamap = {};
				 datamap["NAME"] = data[i].orgname;
				 datamap["ID"] = data[i].orgid;
				 datamap["LONGITUDE"] = data[i].longitude;
				 datamap["LATITUDE"] = data[i].latitude;
				 datamap["PROPER"] = data[i];
				 datamap["POPFLAG"] = "yjjg";
				 dataArray.push(datamap);
			 }
		 }else if(flag == 3){
			 for(var i = 0;i<data.length;i++){
				 var datamap = {};
				 datamap["NAME"] = data[i].storehouse;
				 datamap["ID"] = data[i].emsdeposid;
				 datamap["LONGITUDE"] = data[i].longitude;
				 datamap["LATITUDE"] = data[i].latitude;
				 datamap["PROPER"] = data[i];
				 datamap["POPFLAG"] = "yjck";
				 dataArray.push(datamap);
			 }
		 }else if(flag == 4){
			 for(var i = 0;i<data.length;i++){
				 var datamap = {};
				 datamap["NAME"] = data[i].teamname;
				 datamap["ID"] = data[i].teamid;
				 datamap["LONGITUDE"] = data[i].LONGITUDE;
				 datamap["LATITUDE"] = data[i].LATITUDE;
				 datamap["PROPER"] = data[i];
				 datamap["POPFLAG"] = "yjdw";
				 dataArray.push(datamap);
			 }
		 }else if(flag == 5){
			 for(var i = 0;i<data.length;i++){
				 var datamap = {};
				 datamap["NAME"] = data[i].MATERIALNAME;
				 datamap["ID"] = data[i].EMSMATERIALID;
				 datamap["LONGITUDE"] = data[i].LONGITUDE;
				 datamap["LATITUDE"] = data[i].LATITUDE;
				 datamap["PROPER"] = data[i];
				 datamap["POPFLAG"] = "yjwz";
				 dataArray.push(datamap);
			 }
		 }else if(flag == 6){
			 for(var i = 0;i<data.length;i++){
				 var datamap = {};
				 datamap["NAME"] = data[i].ENTNAME;
				 datamap["ID"] = data[i].businessinfoid;
				 datamap["LONGITUDE"] = data[i].LONGITUDE;
				 datamap["LATITUDE"] = data[i].LATITUDE;
				 datamap["PROPER"] = data[i];
				 datamap["POPFLAG"] = "yhfb";
				 dataArray.push(datamap);
			 }
		 }
		 return dataArray;
		 
	 }
EnterpriseVectorLayer.prototype = {

	
	getData:function(type){
		return _getDatas(type);
	},
	
	//释放资源
	destroy:function(){
		this.baseLayer.destroy();
	},
	
	//更新数据
	setData:function(type){
		self._features=[];
		var data=_getDatas(type);
		this.baseLayer.setUpdateData(data);
	},
	
	//区域范围内图层
	setRegionData:function(datas){
		self._features=[];
		//self._datas=datas;
		this.baseLayer.setData(datas);
	},
	
	//条件查询
	search:function(filter){
		this.baseLayer.search(filter);
	},
	
	getFeatures:function(){
		return this.baseLayer.getFeatures();
	},
	
	getFeaturesCount:function(){
		return this.baseLayer.getFeaturesCount();
	},
	
	//清除数据
	clearFeatures:function(){
		return this.baseLayer.clearFeatures();
	},
	
	//获得图层中所有要素的范围
	getExtent:function(){
		return this.baseLayer.getExtent();
	},
	
	//清除选择的要素
	clearSelection:function(){
		return this.baseLayer.clearSelection();
	},
	
	//移除鼠标事件
	removeInteraction:function(){
		this.baseLayer.removeInteraction();
	},
	
	//添加鼠标事件
	addInteraction:function(){
		this.baseLayer.addInteraction();
	},
	
	clearPopup: function(){
		this.baseLayer.clearPopup();
	}
}
