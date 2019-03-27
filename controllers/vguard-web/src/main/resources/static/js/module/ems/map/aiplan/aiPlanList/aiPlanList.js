/**
 * 应急救援GIS首页-智能方案历史列表
 * Created by 刘晓斌 on 2017/10/21.
 */
$(function() {
	//获取父级页面-当前所选事故id和最新事故模拟id
    var eventid = getQueryString("eventid");
    var colname = ['方案id', '方案名称', '方案状态', '制作时间', '方案编号', '事件ID', '综合预测主键', '预案ID', '事故模拟主键', '制作人', '资源评估主键']; 
	var colmodel = [
					{name: 'SCHEMEID',index: 'SCHEMEID', width: '5%', hidden: true},
					{name: 'SCHEMENAME',index: 'SCHEMENAME', width: '50%'},
					{name: 'TASKNODE',index: 'TASKNODE', width: '5%', hidden: true},
					{name: 'CREATETIME', align: 'center', index: 'CREATETIME', formatter : function(cellvalue, options, obj) {
						return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
					}, width: '50%'},
					{name: 'SCHEMECODE',index: 'SCHEMECODE', width: '5%', hidden: true},
					{name: 'EVENTID',index: 'EVENTID', width: '5%', hidden: true},
					{name: 'FORECASTID',index: 'FORECASTID', width: '5%', hidden: true},
					{name: 'PLAID',index: 'PLAID', width: '5%', hidden: true},
					{name: 'SIMULATIONID',index: 'SIMULATIONID', width: '5%', hidden: true},
					{name: 'CREATEORG',index: 'CREATEORG', width: '5%', hidden: true},
					{name: 'EVALUATIONID',index: 'EVALUATIONID', width: '5%', hidden: true}
					];
	
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		$("#grid-table").jqGrid("setGridHeight", 150);
	});

    $("#grid-table").jqGrid({
    	height: "350px",
    	url : BASE_URL + "ems/emssucissscheme/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData : {"eventid": eventid},
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
//		rownumbers:true,
//		rownumWidth:40,
		scroll: true,
		multiselect: true,
		//caption: "应急队伍列表",
		autowidth: true,
//		onSelectRow: function(id) { //单击选择行
//			var rowdatas = $("#grid-table").jqGrid("getRowData", id);
//			window.top.GEventObject.fireEvent("LOAD_EMS_AiPLAN_GETHISROW_EVENT", rowdatas);
//			parent.closeWin();
//        },
        loadComplete: function() {
//        	if($(window).width() < 700) {
//				$('.ui-jqgrid-htable').css({"width":"900"});
//				$("#grid-table").css({"width":"900"});
//				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
////				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
//			} else {
//				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
//			}
        	$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			$("#grid-table").jqGrid( 'setGridHeight', '150' );
		},
		ondblClickRow: function(rowid, iRow, iCol, e){
			//表格数据行双击事件
        	var rowdatas = $("#grid-table").jqGrid("getRowData", rowid);
			window.top.GEventObject.fireEvent("LOAD_EMS_AiPLAN_GETHISROW_EVENT", rowdatas);
			parent.closeWin();
        }
	});
});

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}