  
//获取事故信息id
var eventid = GetQueryString("eventid");
$(function(){
	//默认加载物资装备列表
	loadResourceGrid("wzzbInfo","#grid-table1","#grid-pager1");
	loadResourceGrid("jydwInfo","#grid-table2","#grid-pager2");
	loadResourceGrid("bncsInfo","#grid-table3","#grid-pager3");
	loadResourceGrid("ylzyInfo","#grid-table4","#grid-pager4");
	loadResourceGrid("ysbzInfo","#grid-table5","#grid-pager5");
	loadResourceGrid("txbzInfo","#grid-table6","#grid-pager6");
	loadResourceGrid("yjzjInfo","#grid-table7","#grid-pager7");
	loadResourceGrid("yjjgInfo","#grid-table8","#grid-pager8");
	
	//隐藏除第一个物资装备以外的grid
	$("#jydwGrid").hide();
	$("#bncsGrid").hide();
	$("#ylzyGrid").hide();
	$("#ysbzGrid").hide();
	$("#txbzGrid").hide();
	$("#yjzjGrid").hide();
	$("#yjjgGrid").hide();

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
				$("#ysbzGrid").hide();
				$("#txbzGrid").hide();
				$("#yjzjGrid").hide();
				$("#yjjgGrid").hide();
	        }else if(curmenu=="jydwInfo"){//救援队伍
	        	$("#wzzbGrid").hide();
	        	$("#jydwGrid").show();
				$("#bncsGrid").hide();
				$("#ylzyGrid").hide();
				$("#ysbzGrid").hide();
				$("#txbzGrid").hide();
				$("#yjzjGrid").hide();
				$("#yjjgGrid").hide();
	        }else if(curmenu=="bncsInfo"){//避难场所
	        	$("#wzzbGrid").hide();
	        	$("#jydwGrid").hide();
				$("#bncsGrid").show();
				$("#ylzyGrid").hide();
				$("#ysbzGrid").hide();
				$("#txbzGrid").hide();
				$("#yjzjGrid").hide();
				$("#yjjgGrid").hide();
	        }else if(curmenu=="ylzyInfo"){//医疗资源
	        	$("#wzzbGrid").hide();
	        	$("#jydwGrid").hide();
				$("#bncsGrid").hide();
				$("#ylzyGrid").show();
				$("#ysbzGrid").hide();
				$("#txbzGrid").hide();
				$("#yjzjGrid").hide();
				$("#yjjgGrid").hide();
	        }else if(curmenu=="ysbzInfo"){//医疗资源
	        	$("#wzzbGrid").hide();
	        	$("#jydwGrid").hide();
				$("#bncsGrid").hide();
				$("#ylzyGrid").hide();
				$("#ysbzGrid").show();
				$("#txbzGrid").hide();
				$("#yjzjGrid").hide();
				$("#yjjgGrid").hide();
	        }else if(curmenu=="txbzInfo"){//医疗资源
	        	$("#wzzbGrid").hide();
	        	$("#jydwGrid").hide();
				$("#bncsGrid").hide();
				$("#ylzyGrid").hide();
				$("#ysbzGrid").hide();
				$("#txbzGrid").show();
				$("#yjzjGrid").hide();
				$("#yjjgGrid").hide();
	        }else if(curmenu=="yjzjInfo"){//医疗资源
	        	$("#wzzbGrid").hide();
	        	$("#jydwGrid").hide();
				$("#bncsGrid").hide();
				$("#ylzyGrid").hide();
				$("#ysbzGrid").hide();
				$("#txbzGrid").hide();
				$("#yjzjGrid").show();
				$("#yjjgGrid").hide();
	        }else if(curmenu=="yjjgInfo"){//医疗资源
	        	$("#wzzbGrid").hide();
	        	$("#jydwGrid").hide();
				$("#bncsGrid").hide();
				$("#ylzyGrid").hide();
				$("#ysbzGrid").hide();
				$("#txbzGrid").hide();
				$("#yjzjGrid").hide();
				$("#yjjgGrid").show();
	        }
	    });
	
	//分析
    $("#analysis").off("click").on("click",function(){
    	$("#grid-table1,#grid-table2,#grid-table3,#grid-table4,#grid-table5,#grid-table6,#grid-table7,#grid-table8").jqGrid("clearGridData");
    	$("#flag").val("2");
    	var selectedArray = new Array;
    	$("span.item").each(function(){
    		console.log($(this).hasClass('selected'));
    		if($(this).hasClass('selected')){
    		}else{
    			selectedArray.push($(this).data("kind"));
    		}
    		
    	});
    	console.log(selectedArray);
    	if(selectedArray.length==0){
    		parent.toast("请选择资源类型!");
    		return;
    	}
    	var radiusCount = removeAllSpace($("#radius").val());
    	if (!checkNumber(radiusCount) || radiusCount<0 || radiusCount>20) {
    		parent.toast("分布范围请输入0-20以内的整数!");
    		$("#radius").val('');
    		return false;
    	}
    	//清空历史操作
    	$("#analysisRadius").val("");
    	$("#types").val("");
    	$("#wzzbdata").val("");
    	$("#jydwdata").val("");
    	$("#bncsdata").val("");
    	$("#ylzydata").val("");
    	$("#ysbzdata").val("");
    	$("#txbzdata").val("");
    	$("#yjzjdata").val("");
    	$("#yjjgdata").val("");
    	//获取分析半径
    	var radius = $("#radius").val();
    	//分析半径赋值，便于列表中显示查询
    	$("#analysisRadius").val(radius);
    	$("#types").val(selectedArray);
    	
    	$("#infos").removeClass('singleArea');
//    	$("#zypgAdd").addClass('singleArea');
    	$('#zypgHistry').addClass('singleArea');
//    	$("#infos").show();
//    	$("#saveBtn").show();
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
    			$("#wzzbGrid").show();
    			if (data.data.length > 0) {
    				console.log(data.data);
    				window.parent.initMapPts(data.data,"resourceEva",radius);
    			}
    		}
    	});
		reloadGrid(selectedArray);
		$("#wzzbGrid").show();
    	$("#jydwGrid").hide();
		$("#bncsGrid").hide();
		$("#ylzyGrid").hide();
		$("#ysbzGrid").hide();
		$("#txbzGrid").hide();
		$("#yjzjGrid").hide();
		$("#yjjgGrid").hide();
		$('#save').show();
		autoHeight();
    });
});	

//验证字符串是否是数字
function checkNumber(theObj) {
	var reg = /^\+?[1-9][0-9]*$/;
	if (reg.test(theObj)) {
		return true;
	}
		return false;
}
//正则表达式去掉所有空格
function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}
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
		}else if(selected[index]=="ysbz"){
			reloadType("grid-table5");
		}else if(selected[index]=="txbz"){
			reloadType("grid-table6");
		}else if(selected[index]=="yjzj"){
			reloadType("grid-table7");
		}else if(selected[index]=="yjjg"){
			reloadType("grid-table8");
		}
	}
}

//保存
$("#save").click(function(){
	
	var types = $("#types").val();
	console.log(types);
	//初始化列表中需要保存的资源id
	var wzzbIds = new Array;
	var jydwIds = new Array;
	var bncsIds = new Array;
	var ylzyIds = new Array;
	var ysbzIds = new Array;
	var txbzIds = new Array;
	var yjzjIds = new Array;
	var yjjgIds = new Array;
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
	if(types.indexOf("ysbz")!=-1){
		$("#grid-table5 tr:gt(0)").each(function(i){
			ysbzIds[i] = $(this).find("td:eq(0)").text();
		});
		$("#ysbzdata").val(ysbzIds);
	}
	if(types.indexOf("txbz")!=-1){
		$("#grid-table6 tr:gt(0)").each(function(i){
			txbzIds[i] = $(this).find("td:eq(0)").text();
		});
		$("#txbzdata").val(txbzIds);
	}
	if(types.indexOf("yjzj")!=-1){
		$("#grid-table7 tr:gt(0)").each(function(i){
			yjzjIds[i] = $(this).find("td:eq(0)").text();
		});
		$("#yjzjdata").val(yjzjIds);
	}
	if(types.indexOf("yjjg")!=-1){
		$("#grid-table8 tr:gt(0)").each(function(i){
			yjjgIds[i] = $(this).find("td:eq(0)").text();
		});
		$("#yjjgdata").val(yjjgIds);
	}
	var wzzbdata = $("#wzzbdata").val();
	var jydwdata = $("#jydwdata").val();
	var bncsdata = $("#bncsdata").val();
	var ylzydata = $("#ylzydata").val();
	var ysbzdata = $("#ysbzdata").val();
	var txbzdata = $("#txbzdata").val();
	var yjzjdata = $("#yjzjdata").val();
	var yjjgdata = $("#yjjgdata").val();
	if(wzzbdata.length==0&&jydwdata.length==0&&bncsdata.length==0&&ylzydata.length==0 &&ysbzdata.length==0 &&txbzdata.length==0 &&yjzjdata.length==0 &&yjjgdata.length==0){
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
			"ysbzdata":$("#ysbzdata").val(),
			"txbzdata":$("#txbzdata").val(),
			"yjzjdata":$("#yjzjdata").val(),
			"yjjgdata":$("#yjjgdata").val(),
			"radius":$("#analysisRadius").val()
		},
		global : false,
		success : function(json) {
			parent.toast(json.msg);
			$('#save').hide();
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
	}else if(resType == "ysbzInfo"){
		colname = [ "主键id", "运输工具名称", "日常用途","存放地点"];
		url = BASE_URL + "ems/emssucresourceevaluation/transtoollist";
	}else if(resType == "txbzInfo"){
		colname = [ "主键id", "团队名称", "应急资源类型"];
		url = BASE_URL + "ems/emssucresourceevaluation/comfirmlist";
	}else if(resType == "yjzjInfo"){
		colname = [ "主键id", "姓名", "专家类别","手机号"];
		url = BASE_URL + "ems/emssucresourceevaluation/expertlist";
	}else if(resType == "yjjgInfo"){
		colname = [ "主键id", "机构名称", "机构职责"];
		url = BASE_URL + "ems/emssucresourceevaluation/orglist";
	}
	//获取列表参数
	var colmodel = loadColmodel(resType);
	
//	console.log(colmodel);
	
	// 分页表格响应式处理
	var tableHeight = $(window).height() - 150 - 33 - 37;
	$(window).resize(
			function() {
				$(table).jqGrid("setGridHeight",150);
				$(table).jqGrid("setGridWidth",$(window).width() - 42 );
				autoHeight();
	});

	var sortname='';
	if (resType =='yjjgInfo') {
		sortname = 'orgname';
	}else if(resType =='txbzInfo'){
		sortname = 'commvehnum';
	}else if(resType =='ysbzInfo'){
		sortname = 'transtoolid';
	}else if(resType =='yjzjInfo'){
		sortname = 'name';
	}else{
		sortname = 'createtime';
	}
	//如果为物资装备，添加双击事件显示仓库应急物资
//		$("#grid-table").jqGrid("clearGridData");
		$(table).jqGrid({
			height : 150,
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
			sortname : sortname,
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
	        loadComplete: function() {
				$(table).jqGrid( 'setGridHeight', 150);
				$(table).jqGrid("setGridWidth", $(window).width() - 40 );
//				autoHeight();
			},
			ondblClickRow:function(rowid,iRow,iCol,e){ 
				/*if (resType == "wzzbInfo") {
					var event = $(table).jqGrid('getRowData',rowid); //选中的一条记录 
					parent.openWin(BASE_URL
							+ "views/module/ems/emsmap/resource/materialList.html?emsdeposid="+event.EMSDEPOSID,
							'应急物资', '540px', '333px');
					
				}*/
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
	}else if(resType == "ysbzInfo"){
		//医疗资源
		colmodel= [
			{
				name : "TRANSTOOLID",
				index : "TRANSTOOLID",
				width : "5%",
				align : "center",
				sortable : false,
				hidden : true
			},
			{
				name : "TRANSTOOLNAME",
				index : "TRANSTOOLNAME",
				width : "15%",
				align : "center",
				sortable : false
			}, 
			{
				name :"USECODENAME",
				index : "USECODENAME",
				width : "15%",
				align : "center",
				sortable : false
			}, 
			{
				name :"DEPOSITPLACE",
				index : "DEPOSITPLACE",
				width : "15%",
				align : "center",
				sortable : false
			}
		];
	}else if(resType == "txbzInfo"){
		//医疗资源
		colmodel= [
			{
				name : "FIRMID",
				index : "FIRMID",
				width : "5%",
				align : "center",
				sortable : false,
				hidden : true
			},
			{
				name : "FIRMNAME",
				index : "FIRMNAME",
				width : "15%",
				align : "center",
				sortable : false
			}, 
			{
				name :"TYPECODENAME",
				index : "TYPECODENAME",
				width : "15%",
				align : "center",
				sortable : false
			}
		];
	}else if(resType == "yjzjInfo"){
		//医疗资源
		colmodel= [
			{
				name : "EXPERTID",
				index : "EXPERTID",
				width : "5%",
				align : "center",
				sortable : false,
				hidden : true
			},
			{
				name : "NAME",
				index : "NAME",
				width : "15%",
				align : "center",
				sortable : false
			}, 
			{
				name :"EXPERTTYPE",
				index : "EXPERTTYPE",
				width : "15%",
				align : "center",
				sortable : false
			}, 
			{
				name :"PHONE",
				index : "PHONE",
				width : "15%",
				align : "center",
				sortable : false
			}
		];
	}else if(resType == "yjjgInfo"){
		//医疗资源
		colmodel= [
			{
				name : "ORGID",
				index : "ORGID",
				width : "5%",
				align : "center",
				sortable : false,
				hidden : true
			},
			{
				name : "ORGNAME",
				index : "ORGNAME",
				width : "15%",
				align : "center",
				sortable : false
			}, 
			{
				name :"ORGDUTIES",
				index : "ORGDUTIES",
				width : "15%",
				align : "center",
				sortable : false,
				formatter:function(cellvalue, options, obj) { 
                    if (cellvalue == null ) {
						return '--';
					}else{
						return cellvalue;
					}
                }
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
