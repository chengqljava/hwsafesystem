$(document).ready(function () {
	var checktaskid = GetQueryString("checktaskid");
    //生成任务列表分页表格
    var colname = ["主键id", "任务id","检查项目","检查内容","检查要求","依据条款","任务名称"],
        colmodel = [
            {
                name: "CHECKTASKITEMID",
                index: "CHECKTASKITEMID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
            	name: "CHECKTASKID",
            	index: "CHECKTASKID",
            	width: "5%",
            	align: "left",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CHECKITEM",
            	index: "CHECKITEM",
            	width: "15%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKCONTENT",
            	index: "CHECKCONTENT",
            	width: "25%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKREQUIRE",
            	index: "CHECKREQUIRE",
            	width: "25%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "FROMWAY",
            	index: "FROMWAY",
            	width: "20%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "CHECKTASKNAME",
            	index: "CHECKTASKNAME",
            	width: "15%",
            	align: "left",
            	sortable: false
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 180;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 180);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });
    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidchecktaskitem/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"checktaskid":checktaskid
        },
        sortname: "CHECKITEM",
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
        caption: "任务排查清单列表",
        autowidth: true
    });
  //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetbtn").bind("click",function(){
    	
    });
});

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checkitem:$("#checkitem").val()
        }
    }).trigger("reloadGrid");
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}