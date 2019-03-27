/**
 * 查询结果
 */
dojo.require("dijit/registry");
dojo.require("dojox/grid/DataGrid");
dojo.require("dojo/data/ItemFileWriteStore");
dojo.require("dojo/data/ItemFileReadStore");
dojo.require("dojox/grid/cells/_base");
dojo.require("dojo/_base/connect");
//dojo.require("dojox/grid/cells/Bool");
var SearchResult=function(){
	var grid=dijit.registry.byId("grid");

	if(grid!=null){
		grid.destroy();
	}else{
	
	}
	this.realTimeCurve=null;
	this.statisticMap=null;
	

};

SearchResult.prototype={
		self:this,
		_flag:false,
		_alarmFlag:false,

		_refreshProbeList:function(id){
			var data=monitordatas.loadMacProbeList(id);
			//$('#statistic')[0].innerHTML="历史状态统计图";
			if(data==null||data.length<=0){
				var gridWidget=dijit.registry.byId("probGrid");
				if(gridWidget!=null)gridWidget.setStore(null);
				var ec,curvec;
				if($('#barCharts').length<=0){
					var ecContext=$('.areaContent')[1];
					var gd=$('.grid')[0];
					if(gd==null){
						gd=document.createElement('div');
						gd.className="grid";
						ecContext.appendChild(gd);
					}
					
					//$(ecContext).empty();
					ecContext=$('#bartab')[0];
					ec=document.createElement('div');
					ec.className="tabcharts";
					ecContext.appendChild(ec);
					
					ecContext=$('#curvetab')[0];
					curvec=document.createElement('div');
					curvec.className="tabcharts";
					ecContext.appendChild(curvec);
				}else{
					ec=$('#barCharts')[0];
					curvec=$("#curveCharts")[0];
				}
				this.realTimeCurve=new RealTimeCurve(echarts,curvec);
				this.statisticMap=new StatisticMap(echarts,ec);
			}else{
				//探头列表
				this._initProbeList(data);
			}
			var self=this;
			clearInterval(app.timeTick);
			app.timeTick = setInterval(function (){
				var data=monitordatas.loadMacProbeList(id);
				//探头列表
				self._initProbeList(data);
			}, 5000);
			
		},
		_getProbeItems:function(datas){
			var items=[];
			if(datas==undefined||datas.length<=0)return items;
			for(var key in datas){
				var item=datas[key];
				switch(item.STATE){
					case "0":
						item.STATE='正常';
						break;
					case "2":
						item.STATE='待标定';
						break;
					case "3":
					case "99":
					case "7":
						item.STATE='故障报警';
						this._alarmFlag = true;
						break;
					case "4":
						item.STATE='预警';
						break;
					case "100":					
					case "101":						
					case "102":
					case "103":
					case "104":
						item.STATE='监测报警';
						this._alarmFlag = true;
						break;
					
						
				}
				item.CHROVAL = item.CHROVAL +' ('+ item.UNIT +')';
				if(item.VIDEOID == null || item.VIDEOID == ""){
					item.VIDEOIDVALUE = '';
				}
				else{
					item.VIDEOIDVALUE = '查看视频';
				}
				item.UPDATETIME=new Date(item.UPDATETIME).format("yyyy-MM-dd HH:mm:ss");    
				items.push(item);
			}
			return items;
		},
		//探头列表
		_initProbeList:function(datas){
			var self=this;
			datas=this._getProbeItems(datas);
			var data = {
					bidentifier : 'PROBEID',
					label : '探头编号',
					items : datas
				};
			
			var layout=[
			    		{cells:[new dojox.grid.cells.RowIndex({ width: 5, name: '序号',styles:"text-align:center;" }),
			    		        {field :"PROBENAME",name : '监测点位名称',width : 10,headerStyles : "text-align:center;",styles:"text-align:center;"},
			    		        {field :"CHROVAL",name : '监测数值',width : 8,headerStyles : "text-align:center;",styles:"text-align:center;"},
			    		        {field :"STATE",name : '状态',width : 10,headerStyles : "text-align:center;",styles:"text-align:center;"},
			    		        {field :"UPDATETIME",name : '时间',width : "auto",headerStyles : "text-align:center;",styles:"text-align:center;"},
			    		        {field :"VIDEOIDVALUE",name : '视频',width : "auto",cellClasses: "videoClass",width: "60px",headerStyles : "text-align:center;",
			    		        	formatter:function(value, index){
				    		              if(value){
				    		            	  return "<div class='mapVideo'></div>"; 
				    		              }else{
				    		                  return "";
				    		              }
				    		           }
			    		        },//
			    		        {field :"VIDEOID",name : '视频1',width : "auto",width: "60px",headerStyles : "text-align:center;"},
			    		    //    {field:"---",name:'统计图1',width : "auto",type: dojox.grid.cells.Bool, editable: true,style:"display:none",headerStyles : "text-align:center;"}
			    		]}
			    	];
			
			//存储数据
			var gridStore = new dojo.data.ItemFileWriteStore({
				data : data
			});

			var gridWidget=dijit.registry.byId("probGrid");
			
			if(gridWidget!=null){
				gridWidget.destroy();
			}
			var pElement=$('.areaContent')[0];
			var element=$('.grid')[1];
			if(element==null){
				element=document.createElement('div');
				element.className="grid";
				pElement.appendChild(element);
			}
			gridWidget = new dojox.grid.DataGrid({  
				id: 'probGrid',
				style : 'overflow:auto;display:block;width:100%;height:174px;',
			    structure: layout
			},element);  
			gridWidget.startup();
			gridWidget.layout.setColumnVisibility(6,false);
			gridWidget.setStore(null);
			gridWidget.setStore(gridStore);
			dojo.connect(gridWidget, "onStyleRow", function(row) {  
				var stateValue=gridWidget.getItem(row.index).STATE.toString();
				   if (stateValue == "监测报警") {  
				      row.customClasses += " redRow ";  
				   }else if(stateValue == "故障报警"){
					   row.customClasses += " yellowRow ";  
				   }
				
				});  
			gridWidget.resize();  
		
			
			var count=0,map=[],ec,curvec;
			if($('#barCharts').length<=0){
				var ecContext=$('.areaContent')[1];
				var gd=$('.grid')[0];
				if(gd==null){
					gd=document.createElement('div');
					gd.className="grid";
					ecContext.appendChild(gd);
				}
				
				//$(ecContext).empty();
				ecContext=$('#bartab')[0];
				ec=document.createElement('div');
				ec.className="tabcharts";
				ecContext.appendChild(ec);
				
				curvec=document.createElement('div');
				curvec.className="tabcharts";
				ecContext.appendChild(curvec);
			}else{
				ec=$('#barCharts')[0];
				curvec=$('#curveCharts')[0];
			}
			
			if(gridWidget.rowCount>0&&self._flag==false){
				self.realTimeCurve=new RealTimeCurve(echarts,curvec);
				self.statisticMap=new StatisticMap(echarts,ec);
				var item=gridWidget.getItem(0);
				if(item==null||item.PROBEID==null)return;
				self.realTimeCurve.setOption(item.PROBEID.toString(),item.PROBENAME.toString());
				//gridWidget.getCell(5).setValue(0,true);
				var data=monitordatas.loadStateTJByProbe(item.PROBEID.toString());
				var datas=[data[0].TTGZ==null?0:data[0].TTGZ,data[0].WLGZ==null?0:data[0].WLGZ,data[0].TXGZ==null?0:data[0].TXGZ,
						data[0].GB==null?0:data[0].GB,data[0].DB==null?0:data[0].DB,data[0].MLC==null?0:data[0].MLC
						]
				self.statisticMap.setOption(datas,item.PROBENAME.toString());
				self._flag=true;
			}


			//监听cell的事件    CellClick
			gridWidget.on("RowClick",function(evt){
				if(evt.cellIndex == 5){
					
					var videoids = this.getItem(evt.rowIndex).VIDEOID.toString();
					//alert(videoids);
					if(videoids == null || videoids == "")return;
					
					var videoid=videoids.split(',');
					//alert(videoid[0]);
					var data=monitordatas.loadVideoInfo(videoid[0]);
					$('.videoPop').attr('ip',JSON.stringify(data[0]));
					$('.videoPop').show("slow","linear",function(){
					    VideoInfo.cameraObj = $("#plugin").loadCamera({
											"ip":data[0].IPADDR,
											"port":data[0].PORT,
											"username":data[0].USERNAME,
											"password":data[0].PASSWORD,
											"channel":data[0].VIDEONUM,
											"brand":data[0].BRAND,
											"width":($(window).width() - 205),
											"height":($(window).height()*0.6 - 40)
										});
						if(!VideoInfo.cameraObj.isInstall()){
							layer.confirm("插件没有安装,请下载安装!", {
				                btn: ['下载','取消'], //按钮
				                shade: false //不显示遮罩
				            }, function(index){
				                window.location.href = BASE_URL+"/monitor/macmonitormap/downloadWebComponentsZW";
				                layer.close(index);
				            });
				            return;
						}							
						VideoInfo.cameraObj.play();//播放
					});
					$('.videoTitle')[0].innerHTML=data[0].VIDEONAME;
				}else{

				var item=this.getItem(evt.rowIndex);
				//$('#statistic')[0].innerHTML=item.PROBENAME.toString()+"历史状态统计图";
				self.realTimeCurve=new RealTimeCurve(echarts,$('#curveCharts')[0]);
				self.realTimeCurve.setOption(item.PROBEID.toString(),item.PROBENAME.toString());
				self.statisticMap=new StatisticMap(echarts,$('#barCharts')[0]);
				var data=monitordatas.loadStateTJByProbe(item.PROBEID.toString());

				
				var datas=[data[0].TTGZ==null?0:data[0].TTGZ,data[0].WLGZ==null?0:data[0].WLGZ,data[0].TXGZ==null?0:data[0].TXGZ,
						data[0].GB==null?0:data[0].GB,data[0].DB==null?0:data[0].DB,data[0].MLC==null?0:data[0].MLC
						]
				self.statisticMap.setOption(datas,item.PROBENAME.toString());

				}
			});
		}
}

Date.prototype.format=function (fmt) { 
	var o = { 
		    "M+" : this.getMonth()+1,                 //月份 
		    "d+" : this.getDate(),                    //日 
		    "H+" : this.getHours(),                   //小时 
		    "m+" : this.getMinutes(),                 //分 
		    "s+" : this.getSeconds(),                 //秒 
		    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
		    "S"  : this.getMilliseconds()             //毫秒 
		  }; 
		  if(/(y+)/.test(fmt)) 
		    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		  for(var k in o) 
		    if(new RegExp("("+ k +")").test(fmt)) 
		  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
		  return fmt; 
}



