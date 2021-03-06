//综合信息中截止日期
$(function () {
	initSeachInput();
	var etime = GetQueryString("etime");
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
//    SelectOption.loadTrainTypeResult('traintype');
    //投诉并立案事件列表分页表格
    var colname = [
            "培训记录id", "企业名称", "培训名称", "培训人数", "培训时长（分钟）", "培训地点","是否已考试","是否已评估", "培训时间","关联培训计划"
        ],
        colmodel = [
            {
                name: "RECORDID",
                index: "RECORDID",
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
                name: "TRANINAME",
                index: "TRANINAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RECORDID + '\',\'' + obj.TRANINAME + '\')">' + obj.TRANINAME + '</a>';
                }
            },
            {
                name: "TRAINNUM",
                index: "TRAINNUM",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayTrainUsers(\'' + obj.RECORDID + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "PERIOD",
                index: "PERIOD",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "TRAINSITE",
                index: "TRAINSITE",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "ISORNOTEXAM",
                index: "ISORNOTEXAM",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue =="0") {
                		return "否";
                	}else if(cellvalue =="1"){
                		return "是";
                	}else {
                		return "";
                	}
                }
            },
            {
                name: "ISORNOTASSESS",
                index: "ISORNOTASSESS",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if (cellvalue == "0") {
						return "否";
					}else if(cellvalue =="1"){
						return "是";
					}else {
						return "";
					}
                }
            },
            {
                name: "TRAINTIME",
                index: "TRAINTIME",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.TRAINTIME, "yyyy-MM-dd");
                }
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
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
        url: BASE_URL + "train/etstrnrecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"etime":etime,
        	"type":'ent'
        },
        sortname: "RECORDID",
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
        caption: "培训记录列表",
        autowidth: true
    });

});

function resetData(){
	$("#entid").val(null).trigger("change");
	$("#trainname").val("");
    $("#planname").val("");
}

function seach(){
	 reloadGrid();
}

function display(recordid, name) {
    parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnRecord.html?recordid=" + recordid,
        name, "60%", "85%");
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
        	entid: $('#entid').val(),
            trainname:  $("#trainname").val(),
            planname: $("#planname").val(),
            etime:GetQueryString("etime")
        }
    }).trigger("reloadGrid");
}