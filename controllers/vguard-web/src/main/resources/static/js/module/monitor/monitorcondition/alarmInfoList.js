/**
 * Created by Administrator on 2017/10/24.
 */
$(function () {
    var stime = getQueryString("stime");
    var etime = getQueryString("etime");
    var qarter = getQueryString("qarter");
    var districtid = getQueryString("districtid");
    var districtlevel = getQueryString("districtlevel");
    var districtcode = getQueryString("districtcode");
    var statuses = getQueryString("statuses");
    var dangertype = getQueryString("dangertype");
    var handlestatus = getQueryString("handlestatus");
    if (handlestatus == 0) {
        $("#tableOpers").displayOper("GZBJ_GOV");
    }


    //生成任务列表分页表格
    var colname = ['监测报警id', '故障报警id', '企业名称', '探头ID', '监测点位名称', '开始时间', '结束时间', '监测数值', '单位', '状态', '负责人', '联系电话', '处理状态code', '处理情况', '处理时间'];

    var colmodel = [
        {name: 'ALARMMONITORID', index: 'ALARMMONITORID', hidden: true},
        {name: 'ALARMFAULTID', index: 'ALARMFAULTID', hidden: true},
        {name: 'ENTNAME', index: 'ENTNAME', align: 'left', width: '15%'},
        {name: 'PROBEID', index: 'PROBEID', hidden: true},
        {name: 'PROBENAME', index: 'PROBENAME', align: 'left', width: '10%'},
        {
            name: 'STARTTIME', index: 'STARTTIME', align: 'left',
            formatter: function (cellvalue, options, obj) {
                if (obj.STARTTIME == null)
                    return "-";
                else
                    return getSmpFormatDateByLong(obj.STARTTIME, true);
            }, width: '10%'
        },
        {
            name: 'ENDTIME', index: 'ENDTIME', align: 'left',
            formatter: function (cellvalue, options, obj) {
                if (obj.ENDTIME == null)
                    return "-";
                else
                    return getSmpFormatDateByLong(obj.ENDTIME, true);
            }, width: '10%'
        },
        {name: 'CHROVAL', index: 'CHROVAL', align: 'left', hidden: true},
        {name: 'UNIT', index: 'UNIT', align: 'left', hidden: true},
        {
            name: 'STATUS_TEXT', index: 'STATUS_TEXT', align: 'left',
            formatter: function (cellvalue, options, obj) {
                return "<span style='color:red'>" + SelectOption.getProbeState(obj.STATUS) + "</span>";
            }, width: '6%'
        },
        {name: 'LEGALPERSON', index: 'LEGALPERSON', align: 'left', width: '7%'},
        {name: 'PHONE', index: 'PHONE', align: 'left', width: '10%'},
        {name: 'HANDLESTATUS', index: 'HANDLESTATUS', align: 'left', hidden: true},
        {
            name: 'HANDLESTATUS_TEXT', index: 'HANDLESTATUS_TEXT', align: 'left',
            formatter: function (cellvalue, options, obj) {
                if (obj.HANDLESTATUS == "" || obj.HANDLESTATUS == undefined || obj.HANDLESTATUS == 'null')
                    obj.HANDLESTATUS = "0";
                if (obj.HANDLESTATUS == "1")
                    return '<a href="javascript:void(0);" onclick="displayHandleInfo(\'' + obj.ALARMMONITORID + '\',\'' + obj.ALARMFAULTID + '\')">' + SelectOption.getAlarmHandleStatus(obj.HANDLESTATUS) + '</a>';
                else
                    return "<span style='color:red'>" + SelectOption.getAlarmHandleStatus(obj.HANDLESTATUS) + "</span>";

            }, width: '6%'
        },
        {
            name: 'HANDLETIME', index: 'HANDLETIME', align: 'left',
            formatter: function (cellvalue, options, obj) {
                if (obj.HANDLETIME == null)
                    return "-";
                else
                    return getSmpFormatDateByLong(obj.HANDLETIME, false);
            }, width: '10%'
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
        url: BASE_URL + "monitor/monitorcondition/loadAlarmInfoByParams",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            stime: stime,
            etime: etime,
            districtcode: districtcode,
            districtid: districtid,
            districtlevel: districtlevel,
            statuses: statuses,
            dangertype: dangertype,
            handlestatus: handlestatus
        },
        sortname: "HANDLESTATUS",
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
        caption: "监测监控预警信息表",
        autowidth: true
    });

    /*报警处理*/
    $("#handleBtn").on("click", function () {
        var ids = getSingleIds();
        var rowdata = $("#grid-table").jqGrid('getRowData', ids[0]); //选中的一条记录
        var alarmMonitorId = rowdata.ALARMMONITORID;
        var alarmFaultId = rowdata.ALARMFAULTID;
        var handleStatus = rowdata.HANDLESTATUS;
        if ($.trim(handleStatus) == "1") {
            // 弹出提示信息
            parent.toast("只能处理状态为未处理的报警");
            return;
        }

        window.top.GEventObject.die("REFERESH_EVENT");
        window.top.GEventObject.on("REFERESH_EVENT", function (json) {
            if (json.success == true) {
                reloadGrid();
            }
        });


        if ($.trim(alarmMonitorId) == "-1") {
            parent.openWin(BASE_URL + "views/module/monitor/monitorcondition/macAlarmHandle.html?alarmFaultId=" + alarmFaultId, '报警处理页面', '60%', '50%');
        } else {
            parent.openWin(BASE_URL + "views/module/monitor/monitorcondition/macAlarmHandle.html?alarmMonitorId=" + alarmMonitorId, '报警处理页面', '60%', '50%');
        }

    });

    /*批量报警处理*/
    $("#batHanBtn").on("click", function () {
        var ids = getManyIds("请选择一条数据");
        var alarmMonitorIdArr = [];
        var alarmFaultIdArr = [];
        for (var i = 0; i < ids.length; i++) {
            var rowdata = $("#grid-table").jqGrid('getRowData', ids[i]);
            if (rowdata.ALARMMONITORID != "-1") {
                alarmMonitorIdArr.push(rowdata.ALARMMONITORID);
            } else if (rowdata.ALARMFAULTID != "-1") {
                alarmFaultIdArr.push(rowdata.ALARMFAULTID);
            }
        }

        window.top.GEventObject.die("REFERESH_EVENT");
        window.top.GEventObject.on("REFERESH_EVENT", function (json) {
            if (json.success == true) {
                reloadGrid();
            }
        });

        // to string
        var alarmMonitorIdsStr = alarmMonitorIdArr + "";
        var alarmFaultIdsStr = alarmFaultIdArr + "";
        parent.openWin(BASE_URL + "views/module/monitor/monitorcondition/macAlarmHandle.html?alarmMonitorIds=" + alarmMonitorIdsStr + "&alarmFaultIds=" + alarmFaultIdsStr, '报警处理页面', '60%', '50%');
    });


});
function closeWinByRefresh() {
    parent.closeWin();
    parent.initData();
}

/**
 * 显示报警处理详情
 */
function displayHandleInfo(alarmMonitorId, alarmFaultId) {
    if (alarmMonitorId == "-1") {
        parent.openWin(BASE_URL + "/monitor/macalarmfault/displayHandleInfo/" + alarmFaultId, '详细', '65%', '65%');
    } else {
        parent.openWin(BASE_URL + "/monitor/macalarmmonitor/displayHandleInfo/" + alarmMonitorId, '详细', '65%', '65%');
    }
}

/*加载*/
function reloadGrid(districtcode) {

    var stime = getQueryString("stime");
    var etime = getQueryString("etime");
    var qarter = getQueryString("qarter");
    var districtid = getQueryString("districtid");
    var districtlevel = getQueryString("districtlevel");
    var districtcode = getQueryString("districtcode");
    var statuses = getQueryString("statuses");
    var dangertype = getQueryString("dangertype");
    var handlestatus = getQueryString("handlestatus");

    $("#grid-table").jqGrid('setGridParam', {
        page: 1,
        postData: {
            stime: stime,
            etime: etime,
            districtcode: districtcode,
            districtid: districtid,
            districtlevel: districtlevel,
            statuses: statuses,
            dangertype: dangertype,
            handlestatus: handlestatus
        }
    }).trigger("reloadGrid");
}


/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds() {
    var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
    if (ids.length != 1) {
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
function getManyIds(message) {
    var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
    if (ids.length == 0) {
        // 弹出提示信息
        parent.toast(message);
        return;
    }
    return ids;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}