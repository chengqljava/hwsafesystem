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


    //生成任务列表分页表格
    var colname = ["主键id", "企业名称", "高报/低报", "超高报/超低报", "故障", "已处理", "未处理"],
        colmodel = [
            {
                name: "BUSINESSINFOID",
                index: "BUSINESSINFOID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "ENTNAME",
                index: "ENTNAME",
                width: "10%",
                align: "center",
                sortable: false,
            },
            {
                name: "HIGHANDLOWCOUNT",
                index: "HIGHANDLOWCOUNT",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "HIGHERANLOWERCOUNT",
                index: "HIGHERANLOWERCOUNT",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "FAULTCOUNT",
                index: "FAULTCOUNT",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "HANDLECOUNT",
                index: "HANDLECOUNT",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "NOHANDLECOUNT",
                index: "NOHANDLECOUNT",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return obj.FAULTCOUNT + obj.MONITORCOUNT - obj.HANDLECOUNT;
                }
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
        url: BASE_URL + "monitor/monitorcondition/loadEntMonitorInfoList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {stime: stime,
            etime: etime,
            districtcode: districtcode,
            districtid: districtid,
            districtlevel:districtlevel
        },
        sortname: "MONITORCOUNT",
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
        caption: "监测监控情况统计表",
        autowidth: true
    });

});
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}