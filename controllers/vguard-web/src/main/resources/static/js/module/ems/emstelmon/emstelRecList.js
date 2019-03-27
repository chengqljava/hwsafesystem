$(document).ready(function (){
	//加载业务模块js
	$("#tableOpers").displayOper();
	initSeachInput();
	initDateSeach("starttime","endtime");
//	SelectOption.loadWarnAlarmType("warnalarmtype");
	var colname = ["通话记录id","警情标题","通话编号", "坐席编号", "呼入号码", "接通时间", "结束时间", "通话时长（秒）","报警类别", "录音文件路径"],
	    colmodel = [
			{
			    name: "PHONERECORDID",
			    index: "PHONERECORDID",
			    align: "center",
			    sortable: false,
			    hidden: true
			}, 
			{
                name: "WARNALARMTITLE",
                index: "WARNALARMTITLE",
                width: "15%",
                align: "center",
                sortable: false
//                formatter:function (cellvalue, options, obj) {
//                    return '<a href="javascript:void(0);" onclick="display(\''+obj.WARNALARMID+'\')">'+ (obj.WARNALARMTITLE || "空") +'</a>';
//                }
            },
	        {
	        	name: "RECORDID",
	        	index: "RECORDID",
	        	width: "12%",
	        	align: "center",
	        	sortable: false
	        },
	        {
	        	name: "AGENTID",
	        	index: "AGENTID",
	        	width: "8%",
	        	align: "center",
	        	sortable: false
//	        	formatter:function (cellvalue, options, obj) {
//                    return '<a href="javascript:void(0);" onclick="display()">' + (obj.tskTitle || "空") + '</a>';
//                }
	        },
	        {
	        	name: "ANO",
	        	index: "ANO",
	        	width: "12%",
	        	align: "center",
	        	sortable: false
	        },
	        {
	        	name: "BEGTIME",
	        	index: "BEGTIME",
	        	width: "15%",
	        	align: "center",
	        	sortable: false,
	        	formatter: function (cellvalue, options, obj) {
	        		return getSmpFormatDateByLong(obj.BEGTIME, true);
                }
	        },
	        {
	        	name: "ENDTIME",
	        	index: "ENDTIME",
	        	width: "15%",
	        	align: "center",
	        	sortable: false,
	        	formatter: function (cellvalue, options, obj) {
	        		return getSmpFormatDateByLong(obj.ENDTIME, true);
                }
	        },
	        {
	        	name: "DURATION",
	        	index: "DURATION",
	        	width: "10%",
	        	align: "center",
	        	sortable: false
	        },
	        {
            	name: "WARNALARMTYPE",
            	index: "WARNALARMTYPE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
        			return SelectOption.getWarnAlarmType(obj.WARNALARMTYPE);
            	}
            },
            {
			    name: "RECFILE",
			    index: "RECFILE",
			    hidden: true
			}
	        ];
	//分页表格响应式处理
	var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
	$(window).resize(function () {
	    $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
	    $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
	});
	
	$("#grid-table").jqGrid({
	    height: tableHeight,
	    url: BASE_URL + "ems/emsdutyphonerecord/list",
	    datatype: "json",
	    cache: false,
	    mtype: "POST",
	    colNames: colname,
	    colModel: colmodel,
	    postData: {},
	    sortname: "BEGTIME",
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
	    caption: "通话记录",
	    autowidth: true
	});
	
	//查询按钮事件
//	$("#searchbtn").off("click").on("click", function () {
//	    reloadGrid();
//	});
	
	//添加任务信息
    $("#playBtn").off("click").on("click", function () {
    	 var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
         if (1 != curSelRowArr.length) {
             // 弹出提示信息
             parent.toast("请选择一条录音进行播放！");
             return;
        }
        var recfile = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RECFILE; 
        var warnalarmtitle = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).WARNALARMTITLE; 
    	parent.openWin(encodeURI(BASE_URL + "views/module/ems/emstelmon/emstelRecPlay.html?recfile=" + recfile +
    				   "&warnalarmtitle=" + warnalarmtitle), '播放录音', '30%', '10%');
    });
});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#starttime").val("");
    $("#endtime").val("");
    $("#warnalarmtype").val("");
    $("#policeofficerseat").val("");
    $("#alarmphone").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    var policeofficerseat = $("#policeofficerseat").val();
    var alarmphone = $("#alarmphone").val();
    var warnalarmtype = $("#warnalarmtype").val();
    var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	if (warnalarmtype == '咨询') {
		warnalarmtype = '1';
	}else if(warnalarmtype == '投诉'){
		warnalarmtype = '2';
	}else if(warnalarmtype == '故障'){
		warnalarmtype = '3';
	}else if(warnalarmtype == '报警'){
		warnalarmtype = '4';
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	policeofficerseat: policeofficerseat || "",
        	alarmphone: alarmphone || "",
        	warnalarmtype: warnalarmtype || "",
            starttime: starttime || "",
            endtime: endtime || ""
        }
    }).trigger("reloadGrid");
}
