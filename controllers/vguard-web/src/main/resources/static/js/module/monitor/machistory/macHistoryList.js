var districtcode = "";//点击行政机构查询 全局变量
$(document).ready(function() {
	initSeachInput();
//	SelectOption.loadProbeState("state");
	
	var colname = ['主键ID',/*'企业名称',*/'监测点位名称','监测类型','监测数值',/*'单位',*/'状态','监测时间'];

	var colmodel = [
					{name:'DATARECORDID',index:'DATARECORDID',hidden:true},
					/*{name:'ENTNAME',index:'ENTNAME',align:'left'},*/
					{name:'PROBENAME',index:'PROBENAME',align:'left'},
					{name : 'PROBETYPE',index : 'PROBETYPE',align : 'left',
						formatter : function(cellvalue, options, obj) {
							return SelectOption.getMonitorGatherTypeResult(obj.PROBETYPE);
							}
						},
					{name:'CHROVAL',index:'CHROVAL',align:'left',formatter:function(cellvalue, options, obj){
						return obj.CHROVAL+obj.UNIT;
					}},
					/*{name:'UNIT',index:'UNIT',align:'left'},*/
					{name:'STATUS_TEXT',index:'STATUS_TEXT',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(obj.STATE == "0"){								
								return "<span style='color:green'>"+SelectOption.getProbeState(obj.STATE)+"</span>";
							} else if(obj.STATE == "101" || obj.STATE == "103"){
								return "<span style='color:orange'>"+SelectOption.getProbeState(obj.STATE)+"</span>";
							} else if(obj.STATE == "102" || obj.STATE == "104"){
								return "<span style='color:red'>"+SelectOption.getProbeState(obj.STATE)+"</span>";
							} else {
								return "<span>"+SelectOption.getProbeState(obj.STATE)+"</span>";
							}
						}
					},
					{name:'CREATETIME',index:'CREATETIME',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(obj.CREATETIME == null)
								return "-";
							else
								return getFormatDateByLong(obj.CREATETIME,"yyyy-MM-dd hh:mm:ss");
						}},					

				];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/monitor/machistory/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{},
		sortname : 'CREATETIME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "监测历史列表",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
});

/**
 * 点击左边行政机构
 * @param districtcode2
 * @param name
 * @param districtlevel
 */
function searchDistrict(districtcode2,name,districtlevel){
	districtcode = districtcode2;
	reloadGrid(districtcode)
}

/*加载*/
function reloadGrid(districtcode){
	var state = $("#state").val();
	if(state == "正常"){
		state = "0";
	} else if(state == "待标定"){
		state = "2";
	} else if(state == "探头故障"){
		state = "3";
	} else if(state == "预警"){
		state = "4";
	} else if(state == "通讯故障"){
		state = "7";
	} else if(state == "网络故障"){
		state = "99";
	} else if(state == "满量程"){
		state = "100";
	} else if(state == "低报"){
		state = "101";
	} else if(state == "高报"){
		state = "102";
	} else if(state == "超低报"){
		state = "103";
	} else if(state == "超高报"){
		state = "104";
	} else {
		state = "";
	}
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	searchParamJson["districtcode"] = districtcode;
	searchParamJson["state"] = state;
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : searchParam
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid(districtcode);
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#searchForm").find("input").each(function(){
		$(this).val("");
	});
});

/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}
/**
 * 获取多条记录id
 * @param message
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:45:13
 */
function getManyIds(message){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}
