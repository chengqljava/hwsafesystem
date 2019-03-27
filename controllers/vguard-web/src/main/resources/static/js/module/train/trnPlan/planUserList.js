//综合信息中截止日期
$(function () {
    //投诉并立案事件列表分页表格
    var colname = ["人员姓名", "联系电话","所在部门"],
        colmodel = [
            {
                name: "planusername",
                index: "planusername",
                width: "15%",
                align: "center",
                sortable: false,
            },
            {
                name: "telnumber",
                index: "telnumber",
                width: "15%",
                align: "center",
                sortable: false,
            },
            {
                name: "deptname",
                index: "deptname",
                width: "15%",
                align: "center",
                sortable: false
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 188;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 188);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() -48);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width:$(window).width() - 48,
        url: BASE_URL + "train/etstrnplanuser/planUserList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	planid:GetQueryString("planid")
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
//        multiselect: true,
//        caption: "计划培训人员",
        //autowidth: true,
        loadComplete : function() {
			if ($("#closeBtn").length==0) {
				$("body").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center;margin-top: 1em;margin-bottom: 1em">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
        }
    });
//    autoHeight();
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}