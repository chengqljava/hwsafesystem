//综合信息中截止日期
$(function () {
	initSeachInput();
	initDateSeach("begintime","endtime");
	SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    //投诉并立案事件列表分页表格
    var colname = [
            "计划id", "企业名称","计划名称","计划主题", "负责人", "联系电话", "计划培训人数", "计划开始时间","计划结束时间","(计划/已)培训次数"],
        colmodel = [
            {
                name: "PLANID",
                index: "PLANID",
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
                sortable: false
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.PLANID + '\',\'' + obj.PLANNAME + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "PLANTITLE",
                index: "PLANTITLE",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "LEADER",
                index: "LEADER",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "PHONE",
                index: "PHONE",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "PERNUM",
                index: "PERNUM",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="loadPlanUser(\'' + obj.PLANID + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "BEGINTIME",
                index: "BEGINTIME",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, "yyyy-MM");
                }
            },
            {
                name: "ENDTIME",
                index: "ENDTIME",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, "yyyy-MM");
                }
            },
            {
                name: "PLANCOUNT",
                index: "PLANCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return cellvalue + '\\'+'<a href="javascript:void(0);" onclick="loadTrnRecord(\'' + obj.PLANID + '\')">' + obj.TRNCOUNT + '</a>';
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
        url: BASE_URL + "train/etstrnplan/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	type:"ent"
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
        caption: "培训计划列表",
        autowidth: true
    });

});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#begintime").val("");
	$("#endtime").val("");
	$("#entid").val(null).trigger("change");
    $("#planname").val("");
    $("#plantitle").val("");
    $("#leader").val("");
}

function seach(){
	 reloadGrid();
}

function loadTrnRecord(planid){
	parent.openWin(BASE_URL + "views/module/train/trnPlan/trnRecordList.html?planid=" + planid,
	        "培训记录", "50%", "60%");
}
function loadPlanUser(planid){
	parent.openWin(BASE_URL + "views/module/train/trnPlan/planUserList.html?planid=" + planid,
	        "计划培训人员", "40%", "50%");
}

function display(planid, name) {
    parent.openWin(BASE_URL + "views/module/train/trnPlan/trnPlanDisplay.html?planid=" + planid+"&isdisplay=display",
        name, "55%", "40%");
}

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#belongent").val(repo.id);
    return repo.text;
}

/**
 * 刷新加载培训记录分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	planname: $("#planname").val(),
        	plantitle: $("#plantitle").val(),
        	leader: $("#leader").val(),
        	entid: $('#entid').val(),
        	begintime:$("#begintime").val(),
        	endtime:$("#endtime").val()
        }
    }).trigger("reloadGrid");
}