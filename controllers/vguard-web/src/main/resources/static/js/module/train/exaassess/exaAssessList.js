$(function () {
	
	initSeachInput();
	initDateSeach("startTime","endTime");
	var etime = GetQueryString("etime");
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
    //考试记录列表分页表格
    var colname = [
            "评估记录id","培训记录id", "培训名称", "评估人","评估时间", "整体评估等级", "评估结果","操作"
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
            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.ASSESSID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.ASSESSID+'\')">删除</a>'
    		}}
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96 );
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: $(window).width() - 96,
        url: BASE_URL + "train/etsexaassess/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"etime":etime,
        	type:"gov"
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
        //autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/train/exaassess/saveOrUpdateExaAssess.html?recordid=-1",
            '新增评估记录', '65%', '80%');
    });

    //显示编辑页面
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        //打开编辑页面
        var assessid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ASSESSID;

        parent.openWin(BASE_URL + "views/module/train/exaassess/saveOrUpdateExaAssess.html?assessid=" + assessid,
            "编辑评估记录", "65%", "80%");


    });

    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRecordArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRecordArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelRecordIdArr = [];
        for (var i = 0; i < curSelRecordArr.length; i++) {
            var assessid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).ASSESSID;
            curSelRecordIdArr.push(assessid);

        }
        //执行删除操作
        delReps({"ids": curSelRecordIdArr.toString()});
    });

    


});
//编辑
function editInfo(assessid) {
	parent.openWin(BASE_URL + "views/module/train/exaassess/saveOrUpdateExaAssess.html?assessid=" + assessid,
            "编辑评估记录", "65%", "80%");
}
// 删除
function delInfo(id) {
	var param = {"ids":id};
	delReps(param);
}
/**
 * 执行删除操作
 */
function delReps(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "train/etsexaassess/delete",
            type: "post",
            dataType: "json",
            data: param,
            success: function (json) {
                if (json.success == true) {
                    parent.toast(json.msg);
                    reloadGrid();// 刷新列表
                } else {
                    parent.toast(json.msg);
                }
            }
        });
    });
}
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