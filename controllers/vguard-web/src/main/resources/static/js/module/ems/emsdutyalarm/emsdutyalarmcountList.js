$(document).ready(function () {
    $("#tableOpers").displayOper();
    initSeachInput();
	initDateSeach("starttime","endtime");
//    SelectOption.loadWarnAlarmType("warnalarmtype");
    loadTypeNum();
    var colname = ["警情id", "警情标题","报警类别","关键词","接警人","报警电话","报警时间","接警人","座席编号","报警渠道","接警时间", "报警电话", "报警人所属单位", "相关企业", "关联事故", "事故id"],
        colmodel = [
            {
                name: "WARNALARMID",
                index: "WARNALARMID",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
                name: "WARNALARMTITLE",
                index: "WARNALARMTITLE",
                width: "15%",
                align: "center",
                sortable: false,
                formatter:function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\''+obj.WARNALARMID+'\')">'+ (obj.WARNALARMTITLE || "空") +'</a>';
                }
            },
            {
            	name: "WARNALARMTYPE",
            	index: "WARNALARMTYPE",
            	width: "8%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
        			return SelectOption.getWarnAlarmType(obj.WARNALARMTYPE);
            	}
            },
            {
            	name: "POLLUTIONMSG",
            	index: "POLLUTIONMSG",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if(obj.POLLUTIONMSG == null){
            			return "--";
            		} else {
            			return obj.POLLUTIONMSG;
            		}
            	}
            },
            {
            	name: "ALARMPERSON",
            	index: "ALARMPERSON",
            	width: "8%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if(obj.ALARMPERSON == null){
            			return "--";
            		} else {
            			return obj.ALARMPERSON;
            		}
            	}
            },
            {
            	name: "ALARMPHONE",
            	index: "ALARMPHONE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if(obj.ALARMPHONE == null ){
            			return "--";
            		} else {
            			return obj.ALARMPHONE;
            		}
            	}
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
                name: "POLICEOFFICERNAME",
                index: "POLICEOFFICERNAME",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if(obj.POLICEOFFICERNAME == null){
                    	return "--";
                    } else {
            			return obj.POLICEOFFICERNAME;
            		}
                }
            }, 
            {
                name: "POLICEOFFICERSEAT",
                index: "POLICEOFFICERSEAT",
                width: "8%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if(obj.POLICEOFFICERSEAT == null){
                    	return "--";
                    } else {
            			return obj.POLICEOFFICERSEAT;
            		}
                }
            },
            {
                name: "ALARMCHANNEL",
                index: "ALARMCHANNEL",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if(obj.ALARMCHANNEL == "1"){
                    	return "外呼平台电话";
                    } else if(obj.ALARMCHANNEL == "5"){
                    	return "非外呼平台电话";
                    } else{
            			return "其他";
            		}
                }
            },
            {
                name: "ALARMTIME",
                index: "ALARMTIME",
                width: "5%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.ALARMTIME) {
                        return getSmpFormatDateByLong(obj.CREATETIME, true);
                    } else {
                        return "";
                    }
                },
                hidden: true
            }, {
                name: "ALARMPHONE",
                index: "ALARMPHONE",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, {
                name: "ALARMUNIT",
                index: "alarmunit",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            }, {
                name: "ENTNAME",
                index: "ENTNAME",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, {
                name: "EVENTNAME",
                index: "EVENTNAME",
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
            }];
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsdutyalarm/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "ALARMTIME",
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
        caption: "警情接报",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//    	loadTypeNum();
//        reloadGrid();
//    });

    //添加接警信息
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/ems/emsdutyalarm/emsdutyalarmAdd.html?warnalarmid=-1",
            '录入警情', '70%', '55%');
    });

    //生成事故
    $("#eventBtn").off("click").on("click", function () {
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 > curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请至少选择一条数据！");
            return;
        }
//        var isCanOpen = true;
//        _.each(curSelRowArr, function (index) {
//            var dutyalaramdata = $("#grid-table").jqGrid("getRowData", index);
//            console.log(dutyalaramdata);
//            if(dutyalaramdata.EVENTID!==""){
//                isCanOpen = false;
//                return;
//            }
//            alarmids.push(dutyalaramdata.WARNALARMID);
//        });
//        if(!isCanOpen){
//            parent.toast("请选择未关联事故的警情！");
//            return;
//        }
        var alarmids = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var warnalarmid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).WARNALARMID;
        	alarmids.push(warnalarmid);
        }
        parent.openWin(BASE_URL
            + "views/module/ems/emsdutyalarm/emssuceventAdd.html?alarmids=" + alarmids,
            '生成事故', '70%', '90%');
    });

    //修改接警信息
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var warnalarmid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).WARNALARMID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/ems/emsdutyalarm/emsdutyalarmAdd.html?warnalarmid=" + warnalarmid,
            '修改警情信息', '70%', '55%');

    });
    
    //发布任务
    $("#pubTskBtn").off("click").on("click", function() {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请至少选择一条数据进行编辑！");
            return;
        }
        var alarmids = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var warnalarmid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).WARNALARMID;
        	alarmids.push(warnalarmid);
        }
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/ems/emsdutyalarm/emsdutyalarmPubTsk.html?alarmids=" + alarmids,
            '发布任务', '55%', '55%');
    });
    
    $(".alarmCount").on("click", function () {
    	var warnalarmtype = $(this).data('kind');
    	console.log(warnalarmtype);
    	alarmCount(warnalarmtype);
    })
    
});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#starttime").val("");
    $("#endtime").val("");
    $("#warnalarmtype").val("");
}

function seach(){
	 reloadGrid();
}

function loadTypeNum(){
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdutyalarm/loadnum",
        dataType: "json",
        async: false,
        data: {
        	starttime: starttime || "",
            endtime: endtime || ""
        },
        success: function (data) {
            if (data) {
            	$("#total").text(data.total);
            	$("#zx").text(data.zx);
            	$("#ts").text(data.tx);
            	$("#gz").text(data.gz);
            	$("#bj").text(data.bj);
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

/**
 * 详细查看场所类型
 */
function display(warnalarmid) {
    //返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emsdutyalarm/emsdutyalarmDisplay.html?warnalarmid=" + warnalarmid,
        "警情信息详情", "50%", "40%");
}

//点击警情类别
function alarmCount(warnalarmtype){
    var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	parent.openWin(BASE_URL + "views/module/ems/emsdutyalarm/alarmcount.html?warnalarmtype=" + warnalarmtype+"&starttime="+starttime+"&endtime="+endtime,
	        "警情列表", "60%", "60%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
//    var policeofficerseat = $("#policeofficerseat").val();
//    var alarmphone = $("#alarmphone").val();
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
//        	policeofficerseat: policeofficerseat || "",
//        	alarmphone: alarmphone || "",
        	warnalarmtype: warnalarmtype || "",
            starttime: starttime || "",
            endtime: endtime || ""
        }
    }).trigger("reloadGrid");
}