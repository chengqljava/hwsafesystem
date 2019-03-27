/**
 * 
 */
var EnterpriseTheme=function(map,echarts){
	this._map=map;
	this._echarts=echarts;
	this._chartUtils=new chartUtils(this._echarts);
	this._overlays=[];
	this._floatingPane=null;
	this._gridWidget=null;
	this._isOpen=false;
	this._init();
}

EnterpriseTheme.prototype={
		_init:function(){
			var self=this;
			require(["dijit/registry","dojo/_base/window","dojox/layout/FloatingPane"
				     ],function(registry,win, FloatingPane){
					var floaterDiv=document.createElement('div');
					win.body().appendChild(floaterDiv);
					var leftDiv=document.createElement('div');
					leftDiv.id="barDiv";
					leftDiv.style.float="left";
					leftDiv.style.width="275px";
					//leftDiv.style.width="45%";
					leftDiv.style.height="100%";
					leftDiv.style.border=" 0.5px black solid";
					floaterDiv.appendChild(leftDiv);
					var rightDiv=document.createElement('div');
					rightDiv.id="gridDiv";
					rightDiv.style.position="absolute";
					rightDiv.style.right = "0";
					rightDiv.style.width="318px";
					//rightDiv.style.width="55%";
					rightDiv.style.height="100%";
					rightDiv.style.borderLeft=" 1px #ccc solid";
					floaterDiv.appendChild(rightDiv);
					/*var topDiv=document.createElement('div');
					topDiv.style.width="100%";
					topDiv.style.height="50%";
					topDiv.style.border=" 1px yellow solid";
					rightDiv.appendChild(topDiv);
					var bottomDiv=document.createElement('div');
					bottomDiv.style.width="100%";
					bottomDiv.style.height="50%";
					rightDiv.appendChild(bottomDiv);*/
					self._floatingPane=new FloatingPane({
						title:"专题图详细信息",
						id:"floatPane",
						closeable: true,
		                resizable: true,
		                dockable: false,
		                resizeAxis: 'xy',
		                style: "position:absolute;top:1px;right:8%;width:606px;height:502px;z-index:500;",
					},floaterDiv);
					self._floatingPane.startup();
					self._floatingPane.show();
					self._floatingPane.bringToTop();
					self._isOpen=true;
					self._floatingPane.close = function() {
						if(!this.closable){ return; } 
						self.close();
					};
				})
		},
		setTitle:function(title){
			this._floatingPane.setTitle(title);
		},
		//清除资源
		_destroy:function(){
			var self=this;
			/*if(self._floatingPane!=null){
				self._floatingPane.destroy();
			}*/
			self._overlays.map(function(overlay){
				self._map.removeOverlay(overlay);
			});
		},
		close:function(){
			this._destroy();
			if(this._floatingPane){
				this._floatingPane.destroy();
				this._floatingPane=null;
			}
			if(this._gridWidget){
				this._gridWidget.destroy();
				this._gridWidget=null;
				//document.getElementById('gridDiv').remove();
			}
			utils.clearVectorLayers(this._map);
			this._isOpen=false;
		},
		isOpen:function(){
			return this._isOpen;
		},
		//地图上添加饼图
		addMapPieCharts:function(datas){	
			this._destroy();
			var self=this;
			datas.map(function(data,index){
				var domid = "chart"+index;  
		        var element=document.createElement('div');
		        element.id=domid;
		        $(element).css('width','80px');
		        $(element).css('height','80px');
		        
				var chart = new ol.Overlay({  
					id:domid,
		            position: data.point,  
		            //positioning: 'center-center',   地图存在上的饼状图存在偏移
		            element:element
		        });  
				self._map.addOverlay(chart);
				self._overlays.push(chart);
		        self._chartUtils.addMapPieChart(element,data.name,data.values);	
			});
		},
		//地图上添加柱状图
		addMapBarCharts:function(datas){	
			this._destroy();
			var self=this;
			datas.map(function(data,index){
				var domid = "chart"+index;  
		        var element=document.createElement('div');
		        element.id=domid;
		        $(element).css('width','80px');
		        $(element).css('height','80px');
		        
				var chart = new ol.Overlay({  
					id:domid,
		            position: data.point,  
		            //positioning: 'center-center',   地图存在上的饼状图存在偏移
		            element:element
		        });  
				self._map.addOverlay(chart);
				self._overlays.push(chart);
				var series=[];
				data.values.map(function(item){
		    		series.push({
		    			name: item.name,
		                type: 'bar',
		                data: [item.value]
		    		});
		    	});
		        self._chartUtils.addMapBarChart(element,data.name,series);	
			});
		},
		addGrid:function(headData,datas){
			if(this._floatingPane==null){
				this._init();
			}
			var self=this;
			require(["dijit/registry","dojox/grid/DataGrid", "dojo/data/ItemFileReadStore",
			         "dojox/grid/cells/_base" ],function(registry,DataGrid,ItemFileReadStore,CellBase){
				var data = {
					bidentifier :'name',
					label : '行政区划名称',
					items : datas
				};
					
				var cells=[];
				headData.some(function(item){
					cells.push(new CellBase.RowIndex({ width: 3, name: '序号' }));
					cells.push({
						field :'name',
						name : '行政区划名称',
						width :5,
						headerStyles : "text-align:center;"
					});
					for(var i in item.values){
						cells.push({
							field :item.values[i].name,
							name : item.values[i].name,
							width : "auto",
							headerStyles : "text-align:center;"
						});
					}
					return true;
				});
				//设置数据列表表头
				var layout=[/*{
					cells:[
					    new CellBase.RowIndex({ width: 3, name: '序号' })
					]},*/
					{cells:cells}
				];
					
				//存储数据
				var gridStore = new ItemFileReadStore({
					data : data
				});
				self._gridWidget =registry.byId('enterpriseGrid');
				if(self._gridWidget==undefined){
					var element=document.createElement('grid');
					document.getElementById('gridDiv').appendChild(element);
					self._gridWidget = new DataGrid({  
						id: 'enterpriseGrid',
						store: gridStore,  
						width:'100%',
						height:'100%',
						style:'overflow:auto;',
					    structure: layout
					},element);  
					
					self._gridWidget.startup(); 
				}else{
					self._gridWidget.setStructure(layout);
					self._gridWidget.setStore(gridStore);
				}
			});
		},
		
		addBarChart:function(datas,series){	
			if(this._floatingPane==null){
				this._init();
			}
			var legendData,yAxisData;
			legendData=datas.grades;
			yAxisData=datas.names;
			this._chartUtils.addBarChart(document.getElementById('barDiv'),{
				legend:legendData,
				yAxis:yAxisData,
				series:series
			});
		}
}
