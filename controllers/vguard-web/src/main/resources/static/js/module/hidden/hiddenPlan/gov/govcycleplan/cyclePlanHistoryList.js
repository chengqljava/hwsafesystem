	/**
	 * 周期计划执行记录
	 */
$(document).ready(function () {
    //生成任务列表分页表格
    var colname = ["id","计划执行时间","计划检查企业","已检查企业","计划id"],
        colmodel = [
            {
                name: "plancycleid",
                index: "plancycleid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "checkrequire",
                index: "checkrequire",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                name: "checkent",
                index: "checkent",
                width: "15%",
                align: "center",
                sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="planCheckRecord(\'' + obj.checkplanid + '\',\'' + getFormatDateByLong(obj.checkrequire, 'yyyy-MM-dd hh:mm:ss') +'\',\'ALL\')">' + obj.checkent + '</a>';
            	}
            },
            {
            	name: "checkedent",
            	index: "checkedent",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="planCheckRecord(\'' + obj.checkplanid + '\',\'' + getFormatDateByLong(obj.checkrequire, 'yyyy-MM-dd hh:mm:ss') +'\',\'PART\')">' + cellvalue + '</a>';
            	}
            },
            {
            	name: "checkplanid",
            	index: "checkplanid",
            	width: "10%",
            	align: "center",
            	sortable: false,
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
        url: BASE_URL + "hidden/hidcycleplan/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	checkplanid:GetQueryString("checkplanid")
        },
        sortname: "checkrequire",
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
        caption: "周期计划执行记录",
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetbtn").bind("click", function () {
        $("#planname").val("");
        $("#leader").val("");
        $("#iscycleplan").val("");
    });
    
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 查看计划检查项目
 * @param checkplanid
 */
function planCheckRecord(checkplanid,time,msg) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/checkRecordList.html?checkplanid="+checkplanid+"&time="+time+"&msg="+msg,"巡查记录", "70%", "75%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	planname:$("#planname").val(),
        	leader:$("#leader").val(),
        	iscycleplan:$("#iscycleplan").val()
        }
    }).trigger("reloadGrid");
}