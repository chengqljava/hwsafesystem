$(document).ready(function (){
	var colname = ["警情id", "警情标题", "座席编号", "呼入时间", "呼入电话", "报警人","业务类别", "污染物信息"],
    colmodel = [
        {
            name: "WARNALARMID",
            index: "WARNALARMID",
            align: "center",
            sortable: false,
            hidden: true
        }, {
            name: "WARNALARMTITLE",
            index: "WARNALARMTITLE",
            width: "15%",
            align: "center",
            sortable: false
//            formatter:function (cellvalue, options, obj) {
//                return '<a href="javascript:void(0);" onclick="display(\''+obj.WARNALARMID+'\')">'+ (obj.WARNALARMTITLE || "空") +'</a>';
//            }
        },
        {
            name: "POLICEOFFICERSEAT",
            index: "POLICEOFFICERSEAT",
            width: "15%",
            align: "center",
            sortable: false
        },
        {
        	name: "ALARMTIME",
        	index: "ALARMTIME",
        	width: "15%",
        	align: "center",
        	sortable: false,
        	formatter: function (cellvalue, options, obj) {
        		return getSmpFormatDateByLong(obj.ALARMTIME, true);
        	}
        },
        {
        	name: "ALARMPHONE",
        	index: "ALARMPHONE",
        	width: "15%",
        	align: "center",
        	sortable: false
        },
        {
        	name: "ALARMPERSON",
        	width: "15%",
        	align: "center",
        	sortable: false
        },
        {
        	name: "WARNALARMTYPE",
        	width: "15%",
        	align: "center",
        	sortable: false,
        	formatter: function (cellvalue, options, obj) {
        		return ("1" == cellvalue ? "咨询" :
		        	    "2" == cellvalue ? "投诉" :
		        	    "3" == cellvalue ? "故障" :
		        	    "4" == cellvalue ? "报警" : "咨询");
        	}
        },
        {
        	name: "POLLUTIONMSG",
        	width: "15%",
        	align: "center",
        	sortable: false
        }];
//分页表格响应式处理
var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
$(window).resize(function() {
    $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
    $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
});

$("#grid-table").jqGrid({
    height: tableHeight,
    url: BASE_URL + "ems/emsdutyalarm/choseAlarmlist",
    datatype: "json",
    cache: false,
    mtype: "POST",
    colNames: colname,
    colModel: colmodel,
    postData: {},
    sortname: "warnalarmid",
    sortorder: "desc",
    viewrecords: true,
    pager: "#grid-pager",
    jsonReader: {
        root: "datas",
        total: "total",
        page: "page",
        records: "records",
        repeatitems: false
    },
    rowNum: 10,
    rowList: [10, 20, 30],
    altRows: true,
    multiselect: true,
    caption: "警情列表",
    autowidth: true
});

$("#saveConHang").off("click").on("click", function(){
	var rowIds = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(rowIds.length == 0){
		//弹出提示信息
		parent.toast("请至少选择一条记录！");
		return;
	}
	
	var curSelEmsArr = [];
	_.map(rowIds, function(tmpRowId, index) {
		var rowdata = $("#grid-table").jqGrid("getRowData", tmpRowId);
		curSelEmsArr.push({
			"WARNALARMID": (null != rowdata.WARNALARMID ? rowdata.WARNALARMID : "-"),
			"WARNALARMTITLE": (null != rowdata.WARNALARMTITLE ? rowdata.WARNALARMTITLE : "-"),
			"POLICEOFFICERSEAT": (null != rowdata.POLICEOFFICERSEAT ? rowdata.POLICEOFFICERSEAT : "-"),
			"ALARMTIME": (null != rowdata.ALARMTIME ? rowdata.ALARMTIME : "-"),
			"ALARMPHONE": (null != rowdata.ALARMPHONE ? rowdata.ALARMPHONE : "-"),
			"ALARMPERSON": (null != rowdata.ALARMPERSON ? rowdata.ALARMPERSON : "-")
		});
	});
	
	window.top.GEventObject.fireEvent("LOAD_EMSALARM_EVENT", {
		emsAlarmData: JSON.stringify(curSelEmsArr)
	});
//	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	parent.closeWin();
});

});