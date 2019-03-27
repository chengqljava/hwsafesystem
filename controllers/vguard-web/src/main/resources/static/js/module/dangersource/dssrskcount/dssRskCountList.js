$(function () {
	var placeareaname = getQueryString("placeareaname");
	var businessinfoid = getQueryString("businessinfoid");
	var riskrating = getQueryString("riskrating");
	var evaluationmethod = getQueryString("evaluationmethod");
    //生成任务列表分页表格
    var leccolname = ["风险记录id","场所区域", "岗位/设备", "安全风险", "危险因素", "现有控制措施","风险等级"],
        leccolmodel = [
            {
                name: "RSKRECORDID",
                index: "RSKRECORDID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "PLACEAREANAME",
                index: "PLACEAREANAME",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RSKRECORDID + '\')">' + obj.PLACEAREANAME + '</a>';
                }
            },
            {
                name: "SPECIFICNAME",
                index: "SPECIFICNAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "RSKDICVALUE",
                index: "RSKDICVALUE",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "RISKFACTOR",
                index: "RISKFACTOR",
                width: "15%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "EXITMEASURE",
                index: "EXITMEASURE",
                width: "10%",
                align: "left",
                sortable: false,
                hidden: false
            },
            {
                name: "RISKRATING",
                index: "RISKRATING",
                width: "10%",
                align: "left",
                sortable: false,
                hidden: false
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 170 - 20;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 170 - 20);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.95);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "dangersource/dssrskrecord/rskcountlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: leccolname,
        colModel: leccolmodel,
        postData: {
        	placeareaname: placeareaname,
        	businessinfoid: businessinfoid,
        	riskrating: riskrating,
        	evaluationmethod: evaluationmethod
        },
        sortname: "CREATETIME",
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
         caption: "风险记录列表",
        autowidth: true
    });
});

/**
 * 详细查看
 */
function display(rskrecordid) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskrecordDisplay.html?rskrecordid=" + rskrecordid,
        "风险点详情", "55%", "50%");
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
