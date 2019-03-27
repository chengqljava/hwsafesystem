$(function () {
	
	initSeachInput();
	initDateSeach("startTime","endTime");
	var etime = GetQueryString("etime");
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
    //考试记录列表分页表格
    var colname = [
            "评估记录id","培训记录id","企业名称", "培训名称", "评估人","评估时间", "整体评估等级", "评估结果"
        ],
        colmodel = [
            {
                name: "ASSESSID",
                index: "ASSESSID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "RECORDID",
                index: "RECORDID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "ENTNAME",
                index: "ENTNAME",
                width: "12%",
                align: "center",
                sortable: false
            },
            {
                name: "TRANINAME",
                index: "TRANINAME",
                width: "12%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayTrn(\'' + obj.RECORDID + '\',\'' + obj.TRANINAME + '\')">' + obj.TRANINAME + '</a>';
                }
            },
            {
                name: "PERSON",
                index: "PERSON",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.ASSESSID + '\')">' + obj.PERSON + '</a>';
                }
            },
            {
                name: "ASSESSTIME",
                index: "ASSESSTIME",
                width: "12%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.ASSESSTIME, "yyyy-MM-dd");
                }
            },
            {
                name: "EXAMSITE",
                index: "EXAMSITE",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return SelectOption.getAssessLevel(obj.EXAMSITE);
                }

            },
            {
                name: "RESULT",
                index: "RESULT",
                width: "16%",
                align: "center",
                sortable: true,
                hidden: false
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
        url: BASE_URL + "train/etsexaassess/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"etime":etime,
        	type:"ent"
        },
        sortname: "ASSESSTIME",
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
        caption: "培训评估记录表",
        autowidth: true
    });

});
//重置
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#examname").val("");
    $("#entid").val(null).trigger("change");
}
//查询
function seach(){
	 reloadGrid();
}

function display(assessid) {
    parent.openWin(BASE_URL + "views/module/train/exaassess/displayExaAssess.html?assessid=" + assessid,
        "评估详情", "72%", "80%");
}

function displayTrainUsers(recordid) {
    parent.openWin(BASE_URL + "views/module/train/exaRecord/exaUsersList.html?recordid=" + recordid,
        "考试成绩表", "70%", "70%");
}

//查看培训记录
function displayTrn(recordid,name){
	parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnRecord.html?recordid=" + recordid,
	        name, "60%", "65%");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
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
 * 刷新加载考试记录分页表格数据
 */
function reloadGrid() {
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
    var entid = $('#entid').val();
    var traniname = $("#traniname").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            entid: entid || '',
            traniname: traniname || '',
            etime:GetQueryString("etime") || '',
            startTime:startTime ||"",
        	endTime:endTime ||""
        }
    }).trigger("reloadGrid");
}