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
    var dangersource = getQueryString("dangersource");
    var chemical = getQueryString("chemical");
    var notIn = getQueryString("notIn");


    //生成任务列表分页表格
    var colname = ['工商信息id', '企业信息id', '企业名称', '行业主管分类', '行业行政主管部门', '负责人', '联系电话', '采集状态', '审核状态', '更新时间'];
    var colmodel = [
        {name: 'BUSINESSINFOID', index: 'BUSINESSINFOID', width: '5%', hidden: true},
        {name: 'BASEINFOID', index: 'BASEINFOID', width: '5%', hidden: true},
        {
            name: 'ENTNAME', index: 'ENTNAME', width: '20%', align: 'left',
            formatter: function (cellvalue, options, obj) {
                return '<a href="javascript:void(0);" onclick="display(\'' + obj.BUSINESSINFOID + '\',\'' + obj.ENTNAME + '\')">' + obj.ENTNAME + '</a>';
            }
        },
        {name: 'DIRECTORTYPENAME', index: 'DIRECTORTYPENAME', width: '20%', align: 'left'},
        {name: 'ALLORGNAME', index: 'ALLORGNAME', width: '27%', align: 'left'},
        {name: 'LEGALPERSON', index: 'DIRECTORTYPEID', width: '6%', align: 'left'},
        {name: 'PHONE', index: 'PHONE', width: '8%', align: 'left'},
        {
            name: 'STATUS',
            index: 'STATUS',
            width: '8%',
            align: 'left',
            editoptions: {value: "0:未填报;1:填报中;2:更新中;3:已上报"},
            formatter: 'select'
        },
        {
            name: 'AUDITSTATUS',
            index: 'AUDITSTATUS',
            width: '8%',
            align: 'left',
            editoptions: {value: "0:审核未通过;1:审核通过;null:未审核"},
            formatter: 'select'
        },
        {
            name: 'UPDATETIME', index: 'UPDATETIME', width: '10%', align: 'left',
            formatter: function (cellvalue, options, obj) {
                return getFormatDateByLong(obj.UPDATETIME,
                    "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "monitor/monitorcondition/loadEntInfoByParams",
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
            dangersource: dangersource,
            chemical: chemical,
            notIn: notIn
        },
        sortname: "UPDATETIME",
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

/*详细查询*/
function display(businessinfoid,entname){
    // parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}