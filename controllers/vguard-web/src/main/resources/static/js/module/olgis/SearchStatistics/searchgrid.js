/**
 * 查询结果的列表数据展示
 */
var SearchGrid = function(options) {
	this._map = options.map;
	this._field = options.field || "ENTNAME";
	this._identifier = options.identifier || "BUSINESSINFOID";
	this._gridStore = null;
	this._features = [];
	this._feature;
	this._popPanel = options.popPanel;
	this._gridWidget = null;
	this._isSetType = options.isSetType ;
	this._ovLayer = null;
	this._selectStyle = options.selectStyle;
	this._init(options.datas);
}

SearchGrid.prototype._init = function(datas) {
		var self = this;
		require(["dijit/registry", "dojox/grid/DataGrid",
				"dojo/data/ItemFileReadStore", "dojox/grid/cells/_base" ],
				function(registry, DataGrid, ItemFileReadStore, CellBase) {
					var items=_getItems(datas);
					var data = {
						bidentifier : 'BUSINESSINFOID',
						label : '企业编号',
						items : items
					};

					var layout = [ {
						cells : [ new CellBase.RowIndex({
							width : 3,
							name : '序号'
						}), {
							field : self._field,
							name : '名称',
							width : "auto",
							headerStyles : "text-align:center;"
						} ]
					} ];

					// 存储数据
					self._gridStore = new ItemFileReadStore({
						data : data
					});
					self._gridWidget = registry.byId('resultGrid');
					if (self._gridWidget == undefined) {
						var element = $('#resultGridDiv')[0];
						self._gridWidget = new DataGrid({
							id : 'resultGrid',
							store : self._gridStore,
							width : '100%',
							height : '100%',
							style : 'overflow:auto;display:block;width:100%;height:100%;',
							structure : layout
						}, element);

						self._gridWidget.startup();

						// 监听Grid的事件
						self._gridWidget.on("RowClick", _onGridRowClick);
						self._gridWidget.on("RowMouseOver",
								_onGridRowMouseOver);
						self._gridWidget.on("MouseOut", _onGridMouseOut);
					} else {
						self._gridWidget.setStructure(layout);
						self._gridWidget.setStore(self._gridStore);
					}
				});
		
	function _getItems(datas) {
		datas=datas.QueryList;
		self._features = [];
		var items = [];
		if (datas == undefined || datas.length <= 0)
			return items;
		for ( var key in datas) {
			var item = datas[key];
			if (item.LONGITUDE == undefined || item.LATITUDE == undefined)
				return;
			var feature = new ol.Feature();
			if (self._isSetType) {
				if (item.CHEMICAL == "1" && item.DANGER == "0") {
					feature.set('type', 'whqy');
				} else if (item.CHEMICAL == "0" && item.DANGER == "1") {
					feature.set('type', 'zdwxy');
				} else {
					feature.set('type', 'zdwh');
				}
			}
			feature.setProperties(item);
			feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([
					item.LONGITUDE, item.LATITUDE ])));
			self._features.push(feature);
			items.push(item);
		}
		return items;
	};
	
	function _onGridRowClick(evt) {
		var item = self._gridWidget.getItem(evt.rowIndex);
		var coordinate = ol.proj.fromLonLat([ parseFloat(item.LONGITUDE),
				parseFloat(item.LATITUDE) ]);
		utils.centerAndZoomPoint(self._map, coordinate, 13);
		
		if(self._ovLayer==null)return;
		self._feature=null;
		self._ovLayer.getSource().clear();
		self._ovLayer.getSource().addFeature(new ol.Feature(new ol.geom.Point(coordinate)));
		self._popPanel.loadClosePopup(item);
	};
	
	function _onGridRowMouseOver(evt) {
		var item = self._gridWidget.getItem(evt.rowIndex);
		if (self._ovLayer == null) {
			self._ovLayer = new ol.layer.Vector({
				source : new ol.source.Vector(),
				style : self._selectStyle
			});
			self._ovLayer.setZIndex(99);
			self._map.addLayer(self._ovLayer);
		}/*else{
			self._ovLayer.getSource().clear();
		}*/
		
		if(self._feature!=null){
			self._ovLayer.getSource().removeFeature(self._feature);
		}
		self._feature=new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE )])))
		self._ovLayer.getSource().addFeature(self._feature);
		
		self._popPanel.showPopup(item);
	};
	
	function _onGridMouseOut(evt) {
		if (self._ovLayer!=null&&self._feature!=null) {
			self._ovLayer.getSource().removeFeature(self._feature);
			self._feature=null;
		}
		self._popPanel.hidePopup();
	};
	
	self.getFeatures=function() {
		return this._features;
	},
	self.setData=function(datas) {
		this._gridWidget.setStore(null);
		this._features=[];
		if (datas == undefined || datas.length <= 0)
			return;
		var self = this;
		var items=_getItems(datas);
		var data = {
			bidentifier : 'BUSINESSINFOID',
			label : '企业编号',
			items : items
		};
		require([ "dojo/data/ItemFileReadStore" ], function(ItemFileReadStore) {
			// 存储数据
			self._gridStore = new ItemFileReadStore({
				data : data
			});
			self._gridWidget.setStore(self._gridStore);
		})
	},
	self.destroy=function() {
		this._gridWidget.destroy();
	}
	
	$(".popup-closeBtn").click(function() {
		if(self._ovLayer==null)return ;
		self._ovLayer.getSource().clear();
	})
}
