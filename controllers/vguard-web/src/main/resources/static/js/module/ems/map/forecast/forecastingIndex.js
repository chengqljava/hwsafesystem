//获取事故信息id
var eventid = GetQueryString("eventid");
//道路封锁信息
var array = new Array();
//警戒区区域面积
var countArea;
//警戒区域名称
var areaname;
//警戒区点位信息
var pointArray = new Array();

$(document).ready(function() {
	
	//地图加载上一次最新的事故模拟覆盖物
	window.parent.addEvnAnaGisOverLays(eventid);
	//加载最新的事故模拟的保护场所ids
	loadPlaceArr(eventid);
	/**
	 * 加载安全信息树
	 */
	SelectTree.loadForecastInfoSelect("forecastinfomenu", {},null,
	function(treeNode){
		if(treeNode.tId){
			var tid = treeNode.tId;
			$("li #"+tid+" a").attr("target","contentIframe");
			$("li #"+tid+" a").attr("href","javascript:void(0)");
			
			if(treeNode.id == -1){
				return false;
			}
			
			$('#menuname').html(treeNode.name); //菜单名称
			var nodeurl = "";
			if (treeNode.url != "undefined" && treeNode.url != null)
				nodeurl =  treeNode.url;
			var url = BASE_URL+ ""; //进入编辑页面
			$("#contentIframe").attr("src",url);
		}
	});
	var flag = 1;
	$('.upDown').click(function() {
		if (flag == 1) {
			$('.div_left').hide();
			$('.div_right').css({'margin-left':'0px','width':'100%'});
			$(this).css('left','0.5%');
			$('.upDown').addClass('downUp');
			flag=0;	
		}else{
			$('.div_left').show();
			$('.div_right').css({'margin-left':'19.6%','width':'80.4%'});
			$(this).css('left','16%');
			$('.upDown').removeClass('downUp');
			flag=1;	
		}
	});
	
	$('#menuname').html("综合预测");
	loadSafemenutree();

	loadForecast(eventid);
	clickFirst();//自动触发点击防护目标
	
	/*新建预测*/
	$("#addForecast").click(function(){
		
		$("#forecasttitle").removeAttr("disabled");//清除不可编辑
		$("#forecasttitle").val("");//清空标题
		$("#forecastid").val("0");
		$("#newBtn").show();//显示三个按钮
		$("#addForecast").attr("disabled", true); //增加按钮不可点击
		$("#addForecast").attr("class","disabledBtn");
		$("#viewHistory").attr("disabled", true); //历史按钮不可点击
		$("#viewHistory").attr("class", "disabledBtn"); //历史按钮不可点击
		$("#bsBtn").attr("disabled",false);//保存按钮可点击
		clickFirst();//自动触发点击防护目标
		
		loadResource(eventid);
	});
	
	/*历史记录*/
	$("#viewHistory").off("click").on("click", function (){
		parent.openWin(BASE_URL
				+ "views/module/ems/map/forecast/historyRecordList.html?eventid="+eventid,
				'综合预测历史记录', '45%', '40%');
	})
	var f = "dlfs";
	var raodArray = new Array();
	var fl;
	//设置道路封锁
	 $("#dlfsBtn").off("click").on("click", function () {
		 fl =true;
		 	if (f == $("#dlfs_Btn").val()) {
		 		parent.window.map.addEventListener("click",function(e){
		 			if (fl) {
		 				$('#roadModal').modal();
			 			 $("#roadname_Btn").off("click").on("click",function(){
			 				 var raodname = $("#roadname").val();
			 				 if (raodname == "" || typeof(raodname) == 'undefined') {
			 					parent.toast("道路名称不能为空!");
								return false;
			 				 }else{
			 					var map = {name:raodname,lng:e.point.lng,lat:e.point.lat};
								raodArray.push(raodname+","+e.point.lng+","+e.point.lat);
								array.push(map);
								parent.simpleMarker(raodname,e.point.lng,e.point.lat);
								$("#contentIframe").attr("src",BASE_URL+"views/module/ems/map/forecast/roadInfo.html");
								$("#roadname").val("");
								$('#roadModal').modal("hide");
							}
			 			 });
			 			$("#dlfs_Btn").val("1");
			 			fl = false;
					}
		 		});
			}
	 });

	//设置警戒区域
		$("#jjqBtn").click(function(){
			$('#menuname').html("警戒区"); //菜单名称
			//鼠标完成绘制事件
			var overlaycomplete = function(e){
				//添加到父页面覆盖物集合
				parent.window.allDriveRouteArr.push(e.overlay);
				pointArray = e.overlay.getPath();//Array<Point> 返回多边型的点数组
			    var p = new parent.BMap.Polygon(pointArray);
			    //获取面积
			    var area =  parent.BMapLib.GeoUtils.getPolygonArea(p);
			    if (isNaN(area)) {
					parent.toast("因警戒区域面积无法计算,请重新绘制!");
					return false;
				}
				$("#jjqBtn").attr("disabled","true");
			    countArea = Number(area/1000000).toFixed(7);
			    $('#areaModal').modal();
			};  
			var drawingManager = parent.drawArea();
			//添加鼠标绘制事件
			drawingManager.addEventListener('overlaycomplete', overlaycomplete);  
			$("#contentIframe").attr("src",BASE_URL+"views/module/ems/map/forecast/warnArea.html");
			
		});
		
		//警戒区域确认
		$("#area_Btn").off("click").on("click",function(){
			areaname = $("#areaname").val();
			if (areaname == "" || typeof(areaname) == 'undefined') {
				parent.toast("警戒区名称不能为空!");
				return false;
			}
			$("#contentIframe").attr("src",BASE_URL+"views/module/ems/map/forecast/warnArea.html");
			$('#areaModal').modal("hide");
			
		});
		
		//保存
		$("#bsBtn").off("click").on("click",function(){
			$("#bsBtn").attr("disabled",true);
			var forecasttitle =$("#forecasttitle").val()
			var content = $("#contentIframe").contents().find("#eventcontrol").val(); 
			$("#eventcontrolInfo").val(content);
			if (forecasttitle == "" || typeof(forecasttitle) == 'undefined') {
				parent.toast("预测标题不能为空!");
				$("#bsBtn").removeAttr("disabled");//如果没有录入标题,设置新增可用
				return false;
			}else{
				save();
				$("#addForecast").removeAttr("disabled"); //增加按钮可点击
				$("#addForecast").attr("class","backBtn");
				$("#viewHistory").removeAttr("disabled"); //历史按钮可点击
				$("#viewHistory").attr("class","backBtn");
				$("#newBtn").hide();//隐藏三个按钮
			}
		});
});

function loadPlaceArr(eventid){
	/* 读取 */
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucsimulation/loadPlaceIdArr",
		dataType : "json",
		async: false,
		data : {
			eventid : eventid
		},
		success : function(data) {
			if (data) {						
				$("#placeIds").val(data);				
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
}

/* 保存 */
function save(){
	var params = {
				"roaddata":JSON.stringify(array),//道路点位信息
				"blockarea":JSON.stringify(pointArray),//警戒区域信息
				"areaname":areaname,//警戒区域名称
				"eventid":eventid,//事件id
				"eventcontrolInfo":$("#eventcontrolInfo").val(),//事态控制策略
				"forecasttitle":$("#forecasttitle").val(),//综合评测标题
				"countArea":countArea,//警戒区面积
				"evaluationid":$("#evaluationid").val()//评估id
				/*"teamList":$("#teamList").val(),
				"shelterList":$("#shelterList").val()*/
				
				}; 
	$.ajax({
		type : 'post',
		url : BASE_URL + 'ems/emssucigrforecast/save',
		cache : false,
		dataType : 'json',
		data : params,
		global : false,
		success : function(json) {
			parent.toast(json.msg);// 弹出提示信息
			clickFirst();
			/*parent.getActiveIFrame().reloadGrid();// 重新加载
			parent.closeWin();// 关闭弹出框
*/		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

//根据eventid查询综合预测
function loadForecast(eventid){
	/* 读取 */
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucigrforecast/loadbyeventid",
		dataType : "json",
		data : {
			eventid : eventid
		},
		success : function(data) {
			if (data) {				
				var list = data.forecastList;
				console.log(list!=null );
				if(list!=null){					
					$("#forecasttitle").val(list[0].forecasttitle);
					$("#forecastid").val(list[0].forecastid);
					$("#evaluationid").val(data.evaluationid);
					loadRoad(list[0].forecastid);
				} else {
					$("#addForecast").click();
					loadResource(eventid);
				}				
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
}

/*加载道路封锁、警戒区*/
function loadRoad(forecastid){
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucigrforecast/getRoute",
		data : {
			"forecastid":forecastid
		},
		dataType: "json",
		success : function(data) {
			if (data.leaveList.length>0) {				
				//撤离路线
				window.parent.initHistoryDriveRoute(data.leaveList,"cllx");			
	
			}
			if(data.rescueList.length>0){
				//救援路线
				window.parent.initHistoryDriveRoute(data.rescueList,"jylx");
			}
			if (data.roadblockList.length>0 ) {
				//道路封锁
				$.each(data.roadblockList,function(index,obj){
//					alert(obj.roadlon+","+obj.roadlat);
					window.parent.simpleMarker(obj.roadname,obj.roadlon,obj.roadlat);
				});
			}
			if (data.alertzone) {
				//道路封锁
				window.parent.loadWarnArea(data.alertzone.zonearea);
			}
//			parent.closeWin();
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/*加载最新的资源评估中应急救援和避难场所的数据，并在地图上标识救援和撤离路线*/
function loadResource(eventid){
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucresourceevaluation/getLatestsucData",
		data : {
			"eventid":eventid
		},
		success : function(data) {
			console.log(data.teamList.length);
			console.log(data.evaluationid);
			if (data.evaluationid != null && data.evaluationid !='' && typeof(data.evaluationid) != 'undefined') {
				if (data.teamList.length>0 ) {
					window.parent.initDriveRoute(data.teamList,"jylx");
					//撤离路线
					window.parent.initDriveRoute(data.shelterList,"cllx");
				}
				$("#evaluationid").val("");
				//评估id赋值
				$("#evaluationid").val(data.evaluationid);
			}else{
				parent.confirm("请先进行资源评估", function() {
//					window.parent.document.getElementById("#resAessBtn").click();
				});
				parent.closeWin();// 关闭弹出框
			}
		}
	});	
}



/*触发点击第一个*/
function clickFirst(){
	$("#safeinfomenu li ul li ul li:first a").click();	
}

function loadSafemenutree(){
	var setting = {
			data : {
				simpleData : {
					enable : true
				}
			},
			callback: {
				onClick: treeClick
			}
	};	
	$.ajax({
		type :'post',
		url : BASE_URL+'/ems/emssucigrforecast/forecastmenutree',
		cache : false,
		data: {},
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#safeinfomenu"), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				var url = map[i].url;
				var menucode = "";
				if(map[i].pId == null || map[i].pId == ""){
					//根节点
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					open = true;
				}else{
					//业务表名称
					menucode = map[i].code;
					open = true;
				}	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon,url,menucode));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, url,menucode) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.url = url; 
		this.menucode = menucode;
	}
}

/**点击权限树节点*/
function treeClick(event,treeId, treeNode, clickFlag){
	var tid = treeNode.tId;
	$("li #"+tid+" a").attr("target","contentIframe");
	$("li #"+tid+" a").attr("href","javascript:void(0)");
	
	if(treeNode.id == -1){
		return false;
	}
	if(treeNode.url == ""||treeNode.url == null){
		return false;
	}
	
	
	$('#menuname').html(treeNode.name); //菜单名称
	var nodeurl = "";
	var forecastid = $("#forecastid").val();
	var placeIds = $("#placeIds").val();
	if (treeNode.url != "undefined" && treeNode.url != null)
		nodeurl =  treeNode.url;
	var url = BASE_URL+ nodeurl+"&eventid="+eventid+"&forecastid="+forecastid+"&placeIds="+placeIds; //进入编辑页面
	$("#contentIframe").attr("src",url);
	
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

