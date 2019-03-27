//获取资源评估id
var evaluationid = GetQueryString("evaluationid");
var radius = GetQueryString("radius");
$(function() {
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucresourceevaluation/resoucelist",
		data : {
			"evaluationid":evaluationid
		},
		success : function(data) {
			if (data.data.length>0) {
				window.parent.initResMarks(data.data,data.radius);
			}
		}
	});
	
	// 隐藏除第一个物资装备以外的grid
	$("#type").val("wzzbGrid");
	loadResourceGrid("wzzbInfo", "#grid-table1", "#grid-pager1");
//	loadResourceGrid("jydwInfo", "#grid-table2", "#grid-pager2");
//	loadResourceGrid("bncsInfo", "#grid-table3", "#grid-pager3");
//	loadResourceGrid("ylzyInfo", "#grid-table4", "#grid-pager4");

	// 绑定tab导航菜单点击事件
	$("#infos li").off("click").on("click", function() {
		$("#infos li.active").removeClass("active");
		$(this).addClass("active");
		var curmenu = $(this).attr("data-tgt");
		// 判断当前点击的tab菜单，进行隐藏显示操作
		if (curmenu == "wzzbInfo") {// 物资装备
			$("#wzzbGrid").show();
			$("#jydwGrid,#bncsGrid,#ylzyGrid").hide();
			$("#type").val("wzzbGrid");
			loadResourceGrid("wzzbInfo", "#grid-table1", "#grid-pager1");
		} else if (curmenu == "jydwInfo") {// 救援队伍
			$("#jydwGrid").show();
			$("#bncsGrid,#wzzbGrid,#ylzyGrid").hide();
			$("#type").val("jydwGrid");
			loadResourceGrid("jydwInfo", "#grid-table2", "#grid-pager2");
		} else if (curmenu == "bncsInfo") {// 避难场所
			$("#bncsGrid").show();
			$("#wzzbGrid,#jydwGrid,#ylzyGrid").hide();
			$("#type").val("bncsGrid");
			loadResourceGrid("bncsInfo", "#grid-table3", "#grid-pager3");
		} else if (curmenu == "ylzyInfo") {// 医疗资源
			$("#ylzyGrid").show();
			$("#jydwGrid,#bncsGrid,#wzzbGrid").hide();
			$("#type").val("ylzyGrid");
			loadResourceGrid("ylzyInfo", "#grid-table4", "#grid-pager4");
		}
	});
});

/**
 * 刷新时加载查询条件
 */
function reloadGrid(selected) {
	// 遍历选中值
	for ( var index in selected) {
		if (selected[index] == "wzzb") {
			reloadType("grid-table1");
		} else if (selected[index] == "jydw") {
			reloadType("grid-table2");
		} else if (selected[index] == "bncs") {
			reloadType("grid-table3");
		} else if (selected[index] == "ylzy") {
			reloadType("grid-table4");
		}
	}
}

// 根据类型id刷新
function reloadType(type) {
	$("#" + type).jqGrid("setGridParam", {
		page : 1,
		postData : {
			"evaluationid" : evaluationid
		}
	}).trigger("reloadGrid");
}

function loadResourceGrid(resType, table, pager) {
	var colname, url;
	if (resType == "wzzbInfo") {
		colname = [ "仓库id", "资源名称", "资源类型", "主管单位", "库容","经度","维度" ];
		url = BASE_URL + "ems/emssucresourceevaluation/deposdata";
	} else if (resType == "jydwInfo") {
		colname = [ "主键id", "队伍名称", "应急资源类型","经度","维度" ];
		url = BASE_URL + "ems/emssucresourceevaluation/teamdata";
	} else if (resType == "bncsInfo") {
		colname = [ "避难场所id", "避难场所名称", "应急资源类型","经度","维度" ];
		url = BASE_URL + "ems/emssucresourceevaluation/shelterdata";
	} else if (resType == "ylzyInfo") {
		colname = [ "主键id", "医疗机构名称", "医疗机构类型","经度","维度" ];
		url = BASE_URL + "ems/emssucresourceevaluation/healthdeptdata";
	}
	// 获取列表参数
	var colmodel = loadColmodel(resType);
	// 分页表格响应式处理
	var tableHeight = $(window).height() - $(".pcheck").height() - 107 - 33;
	$(window).resize(
			function() {
				$("#grid-table").jqGrid("setGridHeight",
						$(window).height() - $('.pcheck').height() - 107 - 33);
				$("#grid-table").jqGrid("setGridWidth",
						$(window).width() * 0.99);
			});

	// 如果为物资装备，添加双击事件显示仓库应急物资
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
				"evaluationid" : evaluationid
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
			ondblClickRow : function(rowid, iRow, iCol, e) {
				var event = $(table).jqGrid('getRowData',rowid); //选中的一条记录
				event = lowerJSONKey(event);
				var array = getSimpleName(event);
				event.resourcename = array[0];
				event.typename = array[1];
				event.id = array[2];
				window.parent.initOneResMarks(event,radius);
				console.log(event);
				if (resType == "wzzbInfo") {
					parent.openWin(BASE_URL+ "views/module/ems/map/resource/materialList.html?emsdeposid="+ event.emsdeposid,
							'应急物资', '50%', '50%');
				}
			}
	});
}

/**
 * 获取列表字段参数
 */
function loadColmodel(resType) {
	var colmodel;
	if (resType == "wzzbInfo") {
		// 物资
		colmodel = [ {
			name : 'EMSDEPOSID',
			index : 'EMSDEPOSID',
			width : '5%',
			align : "center",
			sortable : false,
			hidden : true
		}, {
			name : 'STOREHOUSE',
			index : 'STOREHOUSE',
			width : '5%',
			align : "center",
			sortable : false
		}, {
			name : 'MATERIALTYPE',
			index : 'MATERIALTYPE',
			width : '5%',
			align : "center",
			sortable : false,
			formatter : function(cellvalue, options, obj) {
				return SelectOption.getMaeMaterialtype(obj.MATERIALTYPE);
			}
		}, {
			name : 'MEASURE',
			index : 'MEASURE',
			width : '5%',
			align : "center",
			sortable : false
		}, {
			name : 'CAPACITY',
			index : 'CAPACITY',
			width : '5%',
			align : "center",
			sortable : false
		},{
			name : 'LONGITUDE',
			index : 'LONGITUDE',
			align : "center",
			width : '5%',
			hidden : true
		} ,{
			name : 'LATITUDE',
			index : 'LATITUDE',
			align : "center",
			width : '5%',
			hidden : true
		} 
		];
	} else if (resType == "jydwInfo") {
		// 队伍
		colmodel = [ {
			name : 'TEAMID',
			index : 'TEAMID',
			width : '5%',
			hidden : true
		}, {
			name : 'TEAMNAME',
			index : 'TEAMNAME',
			align : "center",
			width : '5%'
		}, {
			name : 'TEAMTYPEID',
			index : 'TEAMTYPEID',
			align : "center",
			width : '5%',
			formatter : function(cellvalue, options, obj) {
				return SelectOption.getTeamType(obj.TEAMTYPEID);
			}
		},{
			name : 'LONGITUDE',
			index : 'LONGITUDE',
			align : "center",
			width : '5%',
			hidden : true
		} ,{
			name : 'LATITUDE',
			index : 'LATITUDE',
			align : "center",
			width : '5%',
			hidden : true
		} 
		];
	} else if (resType == "bncsInfo") {
		// 避难场所
		colmodel = [ {
			name : "SHELTERID",
			index : "SHELTERID",
			width : "10%",
			align : "center",
			sortable : false,
			hidden : true
		}, {
			name : "SHELTERNAME",
			index : "SHELTERNAME",
			width : "10%",
			align : "center",
			sortable : false
		}, {
			name : "RESOURCETYPENAME",
			index : "RESOURCETYPENAME",
			width : "10%",
			align : "center",
			sortable : false
		},{
			name : 'LONGITUDE',
			index : 'LONGITUDE',
			align : "center",
			width : '5%',
			hidden : true
		} ,{
			name : 'LATITUDE',
			index : 'LATITUDE',
			align : "center",
			width : '5%',
			hidden : true
		} 
		];
	} else if (resType == "ylzyInfo") {
		// 医疗资源
		colmodel = [ {
			name : "DEPTID",
			index : "DEPTID",
			width : "5%",
			align : "center",
			sortable : false,
			hidden : true
		}, {
			name : "DEPTNAME",
			index : "DEPTNAME",
			width : "15%",
			align : "center",
			sortable : false
		}, {
			name : "RESOURCETYPENAME",
			index : "RESOURCETYPENAME",
			width : "15%",
			align : "center",
			sortable : false
		},{
			name : 'LONGITUDE',
			index : 'LONGITUDE',
			align : "center",
			width : '5%',
			hidden : true
		} ,{
			name : 'LATITUDE',
			index : 'LATITUDE',
			align : "center",
			width : '5%',
			hidden : true
		}  
		];
	}
	return colmodel;
}

/**
 * 转换大小写
 * @param jsonObj
 * @returns
 */
function lowerJSONKey(jsonObj) {
	for ( var key in jsonObj) {
		jsonObj[key.toLowerCase()] = jsonObj[key];
		delete (jsonObj[key]);
	}
	return jsonObj;
}

/**
 * 获取字符串
 * @param name
 * @returns
 */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

function getSimpleName(event){
	var array = new Array();
	var type=$("#type").val();
	var resourcename;
	var typename;
	var id;
	if (type =="jydwGrid") {
		resourcename = event.teamname;
		typename = event.teamtypeid;
		id = event.teamid;
	}else if (type =="wzzbGrid") {
		resourcename = event.storehouse;
		typename = event.materialtype;
		id = event.emsdeposid
	}else if(type =="bncsGrid"){
		resourcename = event.sheltername;
		typename = event.resourcetypename;
		id = event.shelterid;
	}else if(type =="ylzyGrid"){
		resourcename = event.deptname;
		typename = event.resourcetypename;
		id = event.deptid;
	}
	array.push(resourcename);
	array.push(typename);
	array.push(id);
	return array;
}
