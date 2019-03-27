$(function () {
	var examid = getQueryString("recordid");
    //考试记录列表分页表格
    var colname = [
            "考试成绩id", "考试人员名称", "部门名称", "手机号", "考试成绩", "备注"
        ],
        colmodel = [
            {
                name: "recordid",
                index: "recordid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "username",
                index: "username",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "deptname",
                index: "deptname",
                width: "12%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "telnumber",
                index: "telnumber",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "socre",
                index: "socre",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "note",
                index: "note",
                width: "18%",
                align: "center",
                sortable: true,
                hidden: true
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 50;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 50);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 48);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width:$(window).width() - 48,
        url: BASE_URL + "train/etsexascore/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"examid":examid
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
        caption: "考试人员列表",
        //autowidth: true,
        loadComplete:function(){
        	if ($("#closeBtn").length==0) {
				$("body").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center;margin-top: 1em;margin-bottom: 1em">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
        }
    });
});
////重置
//function resetData(){
//	$('#daterange-btn span').html(" 日期选择");
//	$("#startTime").val("");
//	$("#endTime").val("");
//    $("#examname").val("");
//    $("#entid").val(null).trigger("change");
//}
////查询
//function seach(){
//	 reloadGrid();
//}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 刷新加载考试记录分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	
        }
    }).trigger("reloadGrid");
}