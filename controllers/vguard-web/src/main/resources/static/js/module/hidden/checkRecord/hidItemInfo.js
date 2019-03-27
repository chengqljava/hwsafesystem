$(document).ready(function () {
	var checkrecordid = GetQueryString("checkrecordid");
    //生成任务列表分页表格
    var colname = ["主键id", "记录id","检查项目","检查内容","检查要求","检查结果","依据条款","检查"],
        colmodel = [
            {
                name: "checkitemid",
                index: "checkitemid",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
            	name: "checkrecordid",
            	index: "checkrecordid",
            	width: "5%",
            	align: "left",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "checkitem",
            	index: "checkitem",
            	width: "15%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "checkcontent",
            	index: "checkcontent",
            	width: "20%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "checkrequire",
            	index: "checkrequire",
            	width: "20%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "note",
            	index: "note",
            	width: "20%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "fromway",
            	index: "fromway",
            	width: "15%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "dangerlevel",
            	index: "dangerlevel",
            	width: "10%",
            	align: "left",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if (cellvalue == "0") {
						return '无隐患';
					}else if(cellvalue == "1"){
						return '一般隐患';
					}else if(cellvalue == "2"){
						return '重大隐患';
					}else{
						return '未排查';
					}
            	}
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 235;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() -235);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });
    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidcheckitem/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"checkrecordid":checkrecordid
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
        caption: "隐患排查项清单",
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