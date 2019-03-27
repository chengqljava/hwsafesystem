//综合信息中截止日期
$(function () {
	initSeachInput();
    //投诉并立案事件列表分页表格
    var colname = ["企业id", "企业名称","法人", "联系电话", "经营范围", "地址","培训次数"],
        colmodel = [
            {
                name: "BUSINESSINFOID",
                index: "BUSINESSINFOID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "ENTNAME",
                index: "ENTNAME",
                width: "15%",
                align: "center",
                sortable: false,
                /*formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.BUSINESSINFOID + '\',\'' + obj.ENTNAME + '\')">' + cellvalue + '</a>';
                }*/
            },
            {
                name: "LEGALPERSON",
                index: "LEGALPERSON",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false
            },
            {
                name: "PHONE",
                index: "PHONE",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "MAINPRODUCT",
                index: "MAINPRODUCT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "ADDRESS",
                index: "ADDRESS",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "TRNCOUNT",
                index: "TRNCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: true,
                formatter: function (cellvalue, options, obj) {
                	return '<a href="javascript:void(0);" onclick="loadTrnRecord(\'' + obj.BUSINESSINFOID + '\',\'' + obj.ENTNAME + '\')">' + cellvalue + '</a>';
                }
            },
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "train/count/loadTrnEntInfo",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"etime":GetQueryString("etime"),
        	"stime":GetQueryString("stime"),
        	"type":GetQueryString("status")
        },
        sortname: "BUSINESSINFOID",
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
//        caption: "培训记录列表",
        autowidth: true,
        beforeRequest:function(){
        	 if (GetQueryString("status") == 'yes') {
            	 $("#grid-table").jqGrid("showCol","TRNCOUNT");
        	}
        }
    });
});

function resetData(){
    $("#entname").val("");
}

function seach(){
	 reloadGrid();
}

function display(recordid, name) {
    parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnRecord.html?recordid=" + recordid,
        name, '60%', '70%');
}

function loadTrnRecord(entid,entname){
	parent.openWin(BASE_URL + "views/module/train/trncount/displayTrnRecordList.html?entid=" + entid+"&stime="+GetQueryString("stime")+"&etime="+GetQueryString("etime"),
			entname+"培训记录", '60%', '70%');
}

function displayTrainUsers(recordid) {
    parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnUsers.html?recordid=" + recordid,
        "培训签到表", "50%", "50%");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 刷新加载培训记录分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            entname:  $("#entname").val()
        }
    }).trigger("reloadGrid");
}