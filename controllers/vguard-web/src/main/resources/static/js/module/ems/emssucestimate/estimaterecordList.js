$(function () {
	initSeachInput();
	initDateSeach("startTime","endTime");
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	
    //生成任务列表分页表格
    var colname = ["记录id","事故id","评估编号","事故名称","评估时间","评估总分","评分人","评估人单位"],
        colmodel = [
            {
                name: "RECORDID",
                index: "RECORDID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
                name: "EVENTID",
                index: "EVENTID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "ESTIMATENUM",
            	index: "ESTIMATENUM",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.RECORDID+'\')">'+obj.ESTIMATENUM+'</a>';
            	}
            },
            {
            	name: "EVENTNAME",
            	index: "EVENTNAME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="displayEvent(\''+obj.EVENTID+'\')">'+obj.EVENTNAME+'</a>';
            	}
            },
            {
            	name: "ESTIMATEDATE",
            	index: "ESTIMATEDATE",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.ESTIMATEDATE, "yyyy-MM-dd hh:mm:ss");
            	}
            },
            {
            	name: "ESTIMATESUM",
            	index: "ESTIMATESUM",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "NICKNAME",
            	index: "NICKNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ORGNAME",
            	index: "ORGNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
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
        url: BASE_URL + "ems/emssucestimaterecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {

        },
        sortname: "ESTIMATEDATE",
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
        caption: "事故评估记录列表",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emssucestimate/emseventList.html",
				'事故列表', '60%', '65%');
    });
    
    //点击查询
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });
//
//    $("#resetbtn").off("click").on("click", function() {
//    });
});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#eventname").val("");
    $("#estimateuser").val("");
    $("#estimateunit").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看
 */
function display(recordid) {
	 parent.openWin(BASE_URL + "views/module/ems/emssucestimate/estimaterecordDisplay.html?recordid="+recordid,
             "事故评估详情","70%", "80%");
}

/**
 * 事故详细查看
 */
function displayEvent(eventid) {
	parent.openWin(BASE_URL+"/ems/emssucevent/display/"+eventid,'事故详细','65%','75%');
}

/**
 * 刷新加载
 */
function reloadGrid() {
	var eventname = $("#eventname").val();
	var begintime = $("#startTime").val();
	var endtime = $("#endTime").val();
	var estimateuser = $("#estimateuser").val();
	var estimateunit = $("#estimateunit").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	eventname:eventname||"",
        	begintime:begintime||"",
        	endtime:endtime||"",
        	estimateuser:estimateuser||"",
        	estimateunit:estimateunit||""
        }
    }).trigger("reloadGrid");
}