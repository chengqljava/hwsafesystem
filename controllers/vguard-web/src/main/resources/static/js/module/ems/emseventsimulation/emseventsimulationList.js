$(document).ready(function () {
	
	initSeachInput();
	initDateSeach("startTime","endTime");
    $("#tableOpers").displayOper();

    selPlan($("#planname"), BASE_URL + "ems/emsplaplaninfo/alllist");
    var colname = ["模拟演练id", "模拟演练编号", "演练地点", "预案名称", "演练时间", "组织部门", "总指挥", "实战效果评价"],
        colmodel = [
            {
                name: "SIMULATIONID",
                index: "SIMULATIONID",
                align: "center",
                sortable: false,
                hidden: true
            }, {
                name: "SIMULATIONNO",
                index: "SIMULATIONNO",
                width: "15%",
                align: "center",
                sortable: false,
                formatter:function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\''+obj.SIMULATIONID+'\')">'+ (obj.SIMULATIONNO || "空") +'</a>';
                }
            }, {
                name: "SIMULATIONADDRESS",
                index: "SIMULATIONADDRESS",
                width: "15%",
                align: "center",
                sortable: false
            }, {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "15%",
                align: "center",
                sortable: false
            }, {
                name: "SIMULATIONTIME",
                index: "SIMULATIONTIME",
                width: "12%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.SIMULATIONTIME) {
                        return getSmpFormatDateByLong(obj.SIMULATIONTIME, true);
                    } else {
                        return "";
                    }
                }
            }, {
                name: "ORGDEPNAMES",
                index: "ORGDEPNAMES",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "HEADQUARTER",
                index: "HEADQUARTER",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "EVALUATION",
                index: "EVALUATION",
                width: "23%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return SelectOption.getEvaluation(obj.EVALUATION);
                }
            }];
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emseventsimulation/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "SIMULATIONTIME",
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
        caption: "模拟演练列表",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });
//    
//    $("#resetbtn").off("click").on("click", function () {
//        $('#planname').val(null).trigger('change');
//
//    });

    //添加接警信息
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/ems/emseventsimulation/emseventsimulationAdd.html?simulationid=-1",
            '添加模拟演练记录', '65%', '70%');
    });

    //修改接警信息
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var simulationid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).SIMULATIONID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/ems/emseventsimulation/emseventsimulationAdd.html?simulationid=" + simulationid,
            '修改模拟演练记录','65%', '70%');

    });
    
    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelBadIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var simulationid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).SIMULATIONID;
        	curSelBadIdArr.push(simulationid);
        }
        //执行删除操作
        delSimulation({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delSimulation(param) {
        //弹出提示框
        parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "ems/emseventsimulation/delete",
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
    
});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#simulationno").val("");
    $('#planname').val(null).trigger('change');
    $("#planid").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看场所类型
 */
function display(simulationid) {
    //返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emseventsimulation/emseventsimulationDisplay.html?simulationid=" + simulationid,
        "模拟演练记录详情", '70%', '70%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    var simulationno = $("#simulationno").val();
    var planid = $("#planid").val();
    var stime = $("#startTime").val();
    var etime = $("#endTime").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	simulationno: simulationno || "",
        	planid: planid || "",
        	stime: stime || "",
        	etime: etime || "",
        }
    }).trigger("reloadGrid");
}

function selPlan($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    planname: params.term, // search term
                    plantype: "",
                    planstate: "",
                    districtid: "",
                    rows: "10",
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                var itemList = [];
                for (var i = 0; i < data.datas.length; i++) {
                    itemList.push({
                            id: data.datas[i].PLANID,
                            text: data.datas[i].PLANNAME
                        }
                    )
                }

                return {
                    results: itemList,
                    pagination: {
                        more: params.page < data.totalpage
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        allowClear: true,//允许删除
        placeholder: "预案名称",
        language: "zh-CN",
        templateResult: formatRepo, // omitted for brevity, see the source of this page
        templateSelection: formatPlanSelection // omitted for brevity, see the source of this page
    });
}


/**
 * 格式化查询结果
 * @param repo
 */
function formatRepo(repo) {
    console.log(repo);
    if (repo.loading) return repo.text;

    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

/**
 * 格式化选择结果
 * @param repo
 * @returns {*}
 */
function formatPlanSelection(repo) {
    $("#planid").val(repo.id);
    return repo.text;
}