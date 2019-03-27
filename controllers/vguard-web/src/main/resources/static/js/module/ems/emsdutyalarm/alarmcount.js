$(document).ready(function () {
    $("#tableOpers").displayOper();
    var warnalarmtype = getQueryString("warnalarmtype");
    var starttime = getQueryString("starttime");
    var endtime = getQueryString("endtime");
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
    var tableHeight = $(window).height() - $(".pcheck").height() - 70 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 70 - 33);
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
        postData: {
        	warnalarmtype:warnalarmtype,
        	starttime:starttime,
        	endtime:endtime
        },
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
//        caption: "",
        autowidth: true
    });
    
});

/**
 * 详细查看
 */
function display(warnalarmid) {
    //返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emsdutyalarm/emsdutyalarmDisplay.html?warnalarmid=" + warnalarmid,
        "警情信息详情", "50%", "40%");
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
