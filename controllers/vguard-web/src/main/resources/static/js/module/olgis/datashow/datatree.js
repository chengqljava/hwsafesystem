/**
 * 数据显示类
 * 
 */
var DataTree=function(options){
	this._map=options.map;
	this._field=options.field||"NAME";
	this._identifier=options.identifier||"ID";
	this._gridStore=null;
	this._features=[];
	this._feature;
	this._popPanel=options.popPanel;
	this._gridWidget=null;
	this._isSetType=options.isSetType||false;
	this._ovLayer=null;
	this._selectStyle=options.selectStyle;
	this._style = options.style;
	this._datas = options.datas.data;
	this._flag = options.datas.flag;
	this._init(this._datas);
}

DataTree.prototype._init=function(datas){
	var self=this;
	//if(datas==undefined||datas.length<=0)return;
	_loadData(datas);
	
	function _loadData(datas){
		require(["dijit/registry","dojox/grid/DataGrid", "dojo/data/ItemFileReadStore","dojox/grid/cells/_base" ], function(registry,
				DataGrid,ItemFileReadStore, CellBase){
			var items=[];
			items=getItems(datas);
			
			
			var data = {
				bidentifier : self._identifier,
				label : '企业编号',
				items : items
			};
			
			//设置数据列表表头
			layout=[/*{
				cells:[
				    new CellBase.RowIndex({ width: 3, name: '序号' })
				]},*/
				{cells:[new CellBase.RowIndex({ width: 3, name: '序号' }),
				    {
				        field :self._field,
						name : '名称',
						width : "auto",
						headerStyles : "text-align:center;"
					} 
				]}
			];
			
			//self._gridWidget.setStructure(layout);

			//存储数据
			self._gridStore = new ItemFileReadStore({
				data : data
			});
			
			
			if(registry.byId('grid')==undefined){
				var element=document.getElementById('featureGrid');
				self._gridWidget = new DataGrid({  
					id: 'grid',
					store: self._gridStore,  
				    structure: layout
				},element);  
				//
				//self._gridWidget.setStore(self._gridStore);
				
			}else{
				self._gridWidget=registry.byId('grid');
				self._gridWidget.setStore(self._gridStore);
			}
			self._gridWidget.startup(); 

			
			//监听Grid的事件
			self._gridWidget.on("RowClick", _onGridRowClick);
			self._gridWidget.on("RowMouseOver",_onGridRowMouseOver);
			//self._gridWidget.on("RowMouseOut", _onGridRowMouseOut);
			self._gridWidget.on("MouseOut", _onGridMouseOut);
			//self._dataSource.addFeatures(self._features);
		});
	}
	
	function getItems(datas){
		
		var items=[];
		if(datas==undefined||datas.length<=0)return items;
			for(var key in datas){
				var item=datas[key];
				if (item.LONGITUDE != undefined || item.LATITUDE != undefined){
					var feature=new ol.Feature();
					if(self._isSetType){
						if(item.CHEMICAL=="1"){
							feature.set('type', 'whqy');
						}else if(item.DANGER=="1"){
							feature.set('type', 'zdwxy');
						}
					}
					feature.setProperties(item);
					feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.LONGITUDE),parseFloat(item.LATITUDE)])));
					self._features.push(feature);
					items.push(item);
				}
				
			}
	
		return items;
	}
	
	function _onGridRowClick(evt) {
		var item = self._gridWidget.getItem(evt.rowIndex);
		var coordinate = ol.proj.fromLonLat([parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE )]);
		utils.centerAndZoomPoint(self._map,coordinate, 12);
		if(self._ovLayer==null)return;
		self._feature=null;
		self._ovLayer.getSource().clear();
		self._ovLayer.getSource().addFeature(new ol.Feature(new ol.geom.Point(coordinate)));
		self._popPanel.loadClosePopup(item);
		
	}
	
	function _onGridRowMouseOver(evt) {
		
		var item = self._gridWidget.getItem(evt.rowIndex);
		if(self._ovLayer==null){
			self._ovLayer=new ol.layer.Vector({
				source:new ol.source.Vector(),
				style:self._selectStyle
			});
			self._ovLayer.setZIndex(99);
			self._map.addLayer(self._ovLayer);
		}else{
			self._ovLayer.getSource().clear();
		}
		self._feature=new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE )])))
		self._ovLayer.getSource().addFeature(self._feature);
		self._popPanel.showPopup(item);
	}
	
	/*
	 * 列表鼠标移除事件
	 * */
	function _onGridRowMouseOut(evt) {
		/*if(self._ovLayer!=null){
			self._ovLayer.getSource().clear();
		}
		self._popPanel.hidePopup();*/
	}
	
	function _onGridMouseOut(evt){
		if(self._ovLayer!=null&&self._feature!=null){
			self._ovLayer.getSource().removeFeature(self._feature);
			self._feature=null;
		}
		self._popPanel.hidePopup();
	}
	
	//条件查询
	self.search=function(filter){
		self._gridWidget.setQuery({
			NAME : '*' + filter + '*'
		});
		//gridWidget.setQuery(filter);
		self._features=[];
		var styleutils=new styleUtils(BASE_URL);
		self._gridStore.fetch({
			query:self._gridWidget.query,
			onItem:function(item,request){
				var feature=new ol.Feature();
				feature.setProperties(item);
				if (item.LONGITUDE == undefined || item.LATITUDE == undefined)return;
				feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.LONGITUDE),parseFloat(item.LATITUDE) ])));
				var proper = item.PROPER|| (item.PROPER)[0];
				if(self._flag == 10){
					var type = proper.BUSINESSTYPE || proper[0].BUSINESSTYPE;
					if(type == '1'){
						self._style = styleutils.getZdwxyStyle();
					}else if(type == '2'){
						self._style = styleutils.getWhqyStyle();
					}else if(type == '3'){
						self._style = styleutils.getZcqyStyle();
					}
				}
				feature.setStyle(self._style);
				self._features.push(feature);
			}
		
		});
	}
	
	//获得要素
	self.getFeatures=function(){
		return self._features;
	}

	//更新数据
	self.setData=function(datas){
		self._gridWidget.setStore(null);
		self._features=[];
		if(datas==undefined||datas.length<=0)return;
		var items=getItems(datas);
		var data = {
				bidentifier : self._identifier,
				label : '企业编号',
				items : items
		};
		require(["dojo/data/ItemFileReadStore"],function(ItemFileReadStore){
			//存储数据
			self._gridStore = new ItemFileReadStore({
				data : data
			});
			self._gridWidget.setStore(self._gridStore);
		})
	}

	self.destroy=function(){
		self._gridWidget.destroy();
	}
	
	self.clearClickFeature=function(){
		if(self._ovLayer==null)return ;
		self._ovLayer.getSource().clear();
		self._popPanel.closeClosePopup();
	}
	
	$(".popup-closeBtn").click(function() {
		if(self._ovLayer==null)return ;
		self._ovLayer.getSource().clear();
	})
}
		
