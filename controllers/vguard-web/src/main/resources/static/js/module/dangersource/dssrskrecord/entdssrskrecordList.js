$(function () {
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    SelectOption.loadPlacearea("placeareaid");
    SelectOption.loadRskDic("eventcategory",{rskdictype:"eventcategory"});
    //生成任务列表分页表格
    var colname = ["风险记录id", "场所区域", "岗位/设备", "安全风险\n(可能发生的事故)", "危险因素", "现有控制措施", "建议增加/改进的措施", "LEC风险等级", "MES风险等级","操作"],
        colmodel = [
            {
                name: "RSKRECORDID",
                index: "RSKRECORDID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "PLACEAREANAME",
                index: "PLACEAREANAME",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RSKRECORDID + '\')">' + obj.PLACEAREANAME + '</a>';
                }
            },
            {
                name: "SPECIFICNAME",
                index: "SPECIFICNAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "EVENTCATEGORYNAME",
                index: "EVENTCATEGORYNAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "RISKFACTOR",
                index: "RISKFACTOR",
                width: "15%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "EXITMEASURE",
                index: "EXITMEASURE",
                width: "20%",
                align: "left",
                sortable: false,
                hidden: false
            },
            {
                name: "PROPOSALMEASURE",
                index: "PROPOSALMEASURE",
                width: "20%",
                align: "left",
                sortable: false,
                hidden: false
            },
            {
                name: "LECRISKRATING",
                index: "LECRISKRATING",
                width: "10%",
                align: "left",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.LECRISKRATING) {

                    	if (obj.LECRISKRATING == '重大风险') {
                        	var riskrating = 4
                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        } else if (obj.LECRISKRATING == '较大风险') {
                        	var riskrating = 3
                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        } else if (obj.LECRISKRATING == '一般风险') {
                        	var riskrating = 2
                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        } else if (obj.LECRISKRATING == '低风险') {
                        	var riskrating = 1
                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        }

                    } else {
//                        return '<a href="javascript:void(0);" onclick="rskLevel(\'' + obj.RSKRECORDID + '\',\'lec\')">LEC法评价</a>';
                    	return "暂无评价";
                    }

                }

            },
            {
                name: "MESRISKRATING",
                index: "MESRISKRATING",
                width: "10%",
                align: "left",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.MESRISKRATING) {
                        if (obj.MESRISKRATING == '重大风险') {
                        	var riskrating = 4
                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        } else if (obj.MESRISKRATING == '较大风险') {
                        	var riskrating = 3
                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        } else if (obj.MESRISKRATING == '一般风险') {
                        	var riskrating = 2
                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        } else if (obj.MESRISKRATING == '低风险') {
                        	var riskrating = 1
                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        }
                    } else {
//                        return '<a href="javascript:void(0);" onclick="rskLevel(\'' + obj.RSKRECORDID + '\',\'mes\')">MES法评价</a>';
                    	return "暂无评价";
                    }

                }

            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.RSKRECORDID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.RSKRECORDID+'\')">删除</a>'
    		}}

        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    var tableWidth = $(window).width() - 96;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: tableWidth,
        url: BASE_URL + "dangersource/dssrskrecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "createtime",
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
        caption: "风险记录管理列表"
    });

    //新增场所环境风险
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskrecord/dssrskrecordAdd.html?rskrecordid=-1",
            '新增风险点信息', '55%', '72%');
    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });
    $("#resetbtn").off("click").on("click", function () {
        $('#belongent').val(null).trigger('change');

    });
});

function showRiskRatingInfo(rskrecordid, method,riskrating) {
    if (method == 'lec') {

        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRskDetail.html?rskrecordid=" + rskrecordid +"&riskrating="+riskrating,
            "风险评级详情", "55%", "60%");
    } else {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRskDetail.html?rskrecordid=" + rskrecordid +"&riskrating="+riskrating,
            "风险评级详情", "55%", "60%");
    }
}

function rskLevel(rskrecordid, method) {
    if (method == 'lec') {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRsk.html?rskrecordid=" + rskrecordid,
            "风险评级", "55%", "45%");
    } else {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRsk.html?rskrecordid=" + rskrecordid,
            "风险评级", "55%", "45%");
    }
}

/**
 * 详细查看场所环境风险
 */
function display(rskrecordid) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskrecordDisplay.html?rskrecordid=" + rskrecordid,
        "风险点详情", "55%", "45%");
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
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
    var placeareaid = $("#placeareaid").val();
    var eventcategory = $("#eventcategory").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	placeareaid: placeareaid || "",
        	eventcategory: eventcategory || ""
        }
    }).trigger("reloadGrid");
}

//编辑场所环境风险
function editInfo(id) {
	parent.openWin(BASE_URL
			+ "views/module/dangersource/dssrskrecord/dssrskrecordAdd.html?rskrecordid=" + id,
			'编辑风险点信息', '55%', '72%');
}
//$("#editBtn").off("click").on("click", function () {
//  //返回当前grid中复选框所选择的数据的id
//  var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
//  if (1 != curSelRowArr.length) {
//      // 弹出提示信息
//      parent.toast("请选择一条数据进行编辑！");
//      return;
//  }
//
//  var rskrecordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RSKRECORDID;
//  //TODO 弹出编辑框
//  parent.openWin(BASE_URL
//      + "views/module/dangersource/dssrskrecord/dssrskrecordAdd.html?rskrecordid=" + rskrecordid,
//      '编辑风险点信息', '55%', '72%');
//
//});
//删除信息
function delInfo(id) {
	delDssrskrecords({"rskrecordid": id});
}
//$("#delBtn").off("click").on("click", function () {
//    // 返回当前grid中复选框所选择的数据的id
//    var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
//    if (1 != curSelRowArr.length) {
//        // 弹出提示信息
//        parent.toast("请选择一条需要删除的数据！");
//        return;
//    }
//
//    var rskrecordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RSKRECORDID;
//    //执行删除操作
//    delDssrskrecords({"rskrecordid": rskrecordid});
//});


/**
 * 执行删除操作
 */
function delDssrskrecords(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "dangersource/dssrskrecord/delete",
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
