  
//获取事故信息id
var eventid = GetQueryString("eventid");
$(function(){
	//默认加载物资装备列表
	loadResourceGrid("wzzbInfo","#grid-table1","#grid-pager1");
	loadResourceGrid("jydwInfo","#grid-table2","#grid-pager2");
	loadResourceGrid("bncsInfo","#grid-table3","#grid-pager3");
	loadResourceGrid("ylzyInfo","#grid-table4","#grid-pager4");
	//隐藏除第一个物资装备以外的grid
	$("#jydwGrid").hide();
	$("#bncsGrid").hide();
	$("#ylzyGrid").hide();
	//全选、反选按钮
	$("#checkall").click(function(){
		if(this.checked){
			$("#resourceType :checkbox").prop("checked",true);
		}else{
			$("#resourceType :checkbox").prop("checked",false);
		}
	});

	//绑定tab导航菜单点击事件
    $("#infos li").off("click").on("click", function(){
        $("#infos li.active").removeClass("active");
        $(this).addClass("active");
        var curmenu = $(this).attr("data-tgt");
        //判断当前点击的tab菜单，进行隐藏显示操作
        if(curmenu=="wzzbInfo"){//物资装备
        	$("#wzzbGrid").show();
        	$("#jydwGrid").hide();
			$("#bncsGrid").hide();
			$("#ylzyGrid").hide();
//			loadResourceGrid("wzzbInfo","#grid-table1","#grid-pager1");
        }else if(curmenu=="jydwInfo"){//救援队伍
        	$("#wzzbGrid").hide();
        	$("#jydwGrid").show();
			$("#bncsGrid").hide();
			$("#ylzyGrid").hide();
//			loadResourceGrid("jydwInfo","#grid-table2","#grid-pager2");
        }else if(curmenu=="bncsInfo"){//避难场所
        	$("#wzzbGrid").hide();
        	$("#jydwGrid").hide();
			$("#bncsGrid").show();
			$("#ylzyGrid").hide();
//			loadResourceGrid("bncsInfo","#grid-table3","#grid-pager3");
        }else if(curmenu=="ylzyInfo"){//医疗资源
        	$("#wzzbGrid").hide();
        	$("#jydwGrid").hide();
			$("#bncsGrid").hide();
			$("#ylzyGrid").show();
//			loadResourceGrid("ylzyInfo","#grid-table4","#grid-pager4");
        }
    });
	
	//分析
    $("#analysis").off("click").on("click",function(){
    	$("#grid-table1,#grid-table2,#grid-table3,#grid-table4").jqGrid("clearGridData");
    	
    	var selectedArray = new Array;
    	$("#resourceType :checked").each(function(i){
    		selectedArray[i] = $(this).val();
    	});
    	if(selectedArray.length==0){
    		parent.toast("请选择资源类型!");
    		return;
    	}
    	//清空历史操作
    	$("#analysisRadius").val("");
    	$("#types").val("");
    	$("#wzzbdata").val("");
    	$("#jydwdata").val("");
    	$("#bncsdata").val("");
    	$("#ylzydata").val("");
    	//获取分析半径
    	var radius = $("#radius").val();
    	//分析半径赋值，便于列表中显示查询
    	$("#analysisRadius").val(radius);
    	$("#types").val(selectedArray);
    	//查询
    	$.ajax({
    		type : "post",
    		url : BASE_URL + "ems/emssucresourceevaluation/resoucedata",
    		data : {
    			"eventid":eventid,
    			"radius":radius,
    			"types":JSON.stringify(selectedArray)
    		},
    		success : function(data) {
    			if (data.data.length>0) {
    				window.parent.initMapPts(data.data,"resourceEva",radius);
    			}
    		}
    	});
    	
//    	loadResourceGrid("bncsInfo","#grid-table3","#grid-pager3");
		reloadGrid(selectedArray);
//    	window.parent.initMapCircle(window.parent.window.map,radius);
//    	loadResourceGrid(resType,table,pager);
    	
    });
    
});	

/**
 * 刷新时加载查询条件
 */
function reloadGrid(selected) {

	//遍历选中值
	for(var index in selected){
		if(selected[index]=="wzzb"){
			reloadType("grid-table1");
		}else if(selected[index]=="jydw"){
			reloadType("grid-table2");
		}else if(selected[index]=="bncs"){
			reloadType("grid-table3");
		}else if(selected[index]=="ylzy"){
			reloadType("grid-table4");
		}
	}
   
}

//保存
$("#save").click(function(){
	var types = $("#types").val();
	//初始化列表中需要保存的资源id
	var wzzbIds = new Array;
	var jydwIds = new Array;
	var bncsIds = new Array;
	var ylzyIds = new Array;
	if(types.indexOf("wzzb")!=-1){
		$("#grid-table1 tr:gt(0)").each(function(i){
			wzzbIds[i] = $(this).find("td:eq(0)").text();
		});
		$("#wzzbdata").val(wzzbIds);
	}
	if(types.indexOf("jydw")!=-1){
		$("#grid-table2 tr:gt(0)").each(function(i){
			jydwIds[i] = $(this).find("td:eq(0)").text();
		});
		$("#jydwdata").val(jydwIds);
	}
	if(types.indexOf("bncs")!=-1){
		$("#grid-table3 tbody tr:gt(0)").each(function(i){
			bncsIds[i] = $(this).find("td:eq(0)").text();
			
		});
		$("#bncsdata").val(bncsIds);
	}
	if(types.indexOf("ylzy")!=-1){
		$("#grid-table4 tr:gt(0)").each(function(i){
			ylzyIds[i] = $(this).find("td:eq(0)").text();
		});
		$("#ylzydata").val(ylzyIds);
	}
	var wzzbdata = $("#wzzbdata").val();
	var jydwdata = $("#jydwdata").val();
	var bncsdata = $("#bncsdata").val();
	var ylzydata = $("#ylzydata").val();
	if(wzzbdata.length==0&&jydwdata.length==0&&bncsdata.length==0&&ylzydata.length==0){
		parent.toast("没有需要保存的资源数据!");
		return;
	}
	
	//异步加载
	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emssucresourceevaluation/save',
		cache : false,
		dataType : 'json',
		data : {
			"eventid":eventid,
			"wzzbdata":$("#wzzbdata").val(),
			"jydwdata":$("#jydwdata").val(),
			"bncsdata":$("#bncsdata").val(),
			"ylzydata":$("#ylzydata").val(),
			"radius":$("#analysisRadius").val()
		},
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
	
	
});

//根据类型id刷新
function reloadType(type){
	 $("#"+type).jqGrid("setGridParam", {
	        page: 1,
	        postData: {
	        	"eventid":eventid,
				"radius":$("#analysisRadius").val()
	        }
	    }).trigger("reloadGrid");
}

function loadResourceGrid(resType,table,pager) {
	var colname,url;
	if (resType == "wzzbInfo") {
		colname = [ "仓库id", "资源名称", "资源类型", "主管单位", "库容"];
		url = BASE_URL + "ems/emssucresourceevaluation/deposlist";
	}else if(resType == "jydwInfo"){
		colname = [ "主键id", "队伍名称", "应急资源类型"];
		url = BASE_URL + "ems/emssucresourceevaluation/teamlist";
	}else if(resType == "bncsInfo"){
		colname = ["避难场所id","避难场所名称","应急资源类型"];
		url = BASE_URL + "ems/emssucresourceevaluation/shelterlist";
	}else if(resType == "ylzyInfo"){
		colname = [ "主键id", "医疗机构名称", "医疗机构类型"];
		url = BASE_URL + "ems/emssucresourceevaluation/healthdeptlist";
	}
	//获取列表参数
	var colmodel = loadColmodel(resType);
	
	// 分页表格响应式处理
	var tableHeight = $(window).height() - 150 - 33;
	$(window).resize(
			function() {
				$("#grid-table").jqGrid("setGridHeight",$(window).height() - 150 - 33);
				$("#grid-table").jqGrid("setGridWidth",$(window).width() * 0.99);
	});

	//如果为物资装备，添加双击事件显示仓库应急物资
		$("#grid-table").jqGrid("clearGridData");
		$(table).jqGrid({
			height : tableHeight,
			url : url,
			datatype : "json",
			cache : false,
			mtype : "POST",
			colNames : colname,
			colModel : colmodel,
			postData : {
				"eventid" : eventid,
				"radius" : $("#analysisRadius").val()
			},
			sortname : "CREATETIME",
			sortorder : "desc",
			viewrecords : true,
			pager : pager,
			jsonReader : {
				root : "datas",
				total : "total",
				page : "page",
				records : "records",
				repeatitems : false
			},
			rowNum : 5,
			rowList : [ 5, 10, 20 ],
			altRows : true,
			autowidth : true,
			ondblClickRow:function(rowid,iRow,iCol,e){ 
				if (resType == "wzzbInfo") {
					var event = $(table).jqGrid('getRowData',rowid); //选中的一条记录 
					parent.openWin(BASE_URL
							+ "views/module/ems/map/resource/materialList.html?emsdeposid="+event.EMSDEPOSID,
							'应急物资', '50%', '50%');
					
				}
			}
		});
}

/**
 *获取列表字段参数
 */
function loadColmodel(resType){
	var colmodel;
	if (resType == "wzzbInfo") {
		//物资
		 colmodel = [
						{
							name:'EMSDEPOSID',
							index:'EMSDEPOSID', 
							width:'5%',
							align: "center",
			                sortable: false,
							hidden:true
						},
						{
							name:'STOREHOUSE',
							index:'STOREHOUSE',
							width:'5%',
							align: "center",
							sortable: false
						},
						{
							name:'MATERIALTYPE',
							index:'MATERIALTYPE', 
							width:'5%',
							align: "center",
							sortable: false,
							formatter:function(cellvalue, options, obj) { 
			    				return SelectOption.getMaeMaterialtype(obj.MATERIALTYPE);
			    			}
						}, 
						{
							name:'MEASURE',
							index:'MEASURE', 
							width:'5%',
							align: "center",
							sortable: false
						}, 
						{
							name:'CAPACITY',
							index:'CAPACITY', 
							width:'5%',
							align: "center",
							sortable: false
						}
				];
	}else if(resType == "jydwInfo"){
		//队伍
		colmodel = [
					{
						name: 'TEAMID',
						index: 'TEAMID', 
						width: '5%',
						hidden: true
					},
					{
						name: 'TEAMNAME',
						index: 'TEAMNAME', 
						align: "center", 
						width: '5%'
					},
					{
						name: 'TEAMTYPEID',
						index: 'TEAMTYPEID', 
						align: "center", 
						width: '5%',
						formatter : function(cellvalue, options, obj){
							return SelectOption.getTeamType(obj.TEAMTYPEID);
						}
					}
				];
	}else if(resType == "bncsInfo"){
		//避难场所
		 colmodel = [
		             {
		                 name: "SHELTERID",
		                 index: "SHELTERID",
		                 width: "10%",
		                 align: "center",
		                 sortable: false,
		                 hidden: true
		             },
		             {
		                 name: "SHELTERNAME",
		                 index: "SHELTERNAME",
		                 width: "10%",
		                 align: "center",
		                 sortable: false
		             },
		             {
		                 name: "RESOURCETYPENAME",
		                 index: "RESOURCETYPENAME",
		                 width: "10%",
		                 align: "center",
		                 sortable: false
		             }
		         ];
	}else if(resType == "ylzyInfo"){
		//医疗资源
		colmodel= [
			{
				name : "DEPTID",
				index : "DEPTID",
				width : "5%",
				align : "center",
				sortable : false,
				hidden : true
			},
			{
				name : "DEPTNAME",
				index : "DEPTNAME",
				width : "15%",
				align : "center",
				sortable : false
			}, 
			{
				name :"RESOURCETYPENAME",
				index : "RESOURCETYPENAME",
				width : "15%",
				align : "center",
				sortable : false
			}
		];
	}
	return colmodel;
}


    function GetQueryString(name)
    {
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    }
