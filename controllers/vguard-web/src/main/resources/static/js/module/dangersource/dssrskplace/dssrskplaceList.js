$(function () {
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    if ($("#entdiv").length > 0) {
        SelectTwo.initSelect2($('#belongent'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);

        
        $('#belongent').on('change', function (e) {
            // Do something
            $("#typename").attr("selectvalue", "");
            $("#typenameDiv").empty().html("<input type='text' class='form-control formWidth' id='typename' name='typename'" +
                "selectname='typeid' selectvalue='' readonly placeholder='所属分类' />");
            SelectTree.loadRiskTypeTree("typename", {
                userType: 1,
                typecode: 5,
                belongent: $("#belongent").val() || ""
            }, "");
        });
    } else {
        SelectTree.loadRiskTypeTree("typename", {
            userType: 0,
            typecode: 5
        }, "");
    }
    //生成任务列表分页表格
    var colname = ["场所环境风险id", "能量源", "安全风险", "危险因素", "建议措施", "建议审核结果","操作"],
        colmodel = [
            {
                name: "placeid",
                index: "placeid",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "powersrc",
                index: "powersrc",
                width: "10%",
                align: "left",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.placeid + '\',\''+$.trim(obj.powersrc)+'\')">' + obj.powersrc + '</a>';
                }
            },
            {
                name: "saferisk",
                index: "saferisk",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "danfactor",
                index: "danfactor",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "sugmeasure",
                index: "sugmeasure",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "auditresult",
                index: "auditresult",
                width: "8%",
                align: "left",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return SelectOption.getSugAuditResult(obj.auditresult);
                }
            },
    		{name:'OPERATION',index:"OPERATION",width:'105px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.placeid+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delDssrskopers(\''+obj.placeid+'\')">删除</a><br>'
    			     + '<a href="javascript:void(0);" title="添加建议" class="operation addInfoBtn" onclick="addInfo(\''+obj.placeid+'\')">添加建议</a><br>'
    			     + '<a href="javascript:void(0);" title="审核建议" class="operation handleInfoBtn" onclick="handleInfo(\''+obj.sugmeasure+'\',\''+obj.placeid+'\')">审核建议</a>'
    		}}

        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: ($(window).width() - 96),
        url: BASE_URL + "dangersource/dssrskplace/list",
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
        caption: "场所环境风险管理列表",
        //autowidth: true
    });

    //新增场所环境风险
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplace/dssrskplaceAdd.html?placeid=-1",
            '新增场所环境风险', '55%', '60%');
    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //编辑场所环境风险
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        var placeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).placeid;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplace/dssrskplaceAdd.html?placeid=" + placeid,
            '编辑场所环境风险', '55%', '60%');

    });

    //显示执行导出操作
    $("#exportBtn").off("click").on("click", function () {
        window.location.href = BASE_URL + "dangersource/dssrskplace/export";
    });


    //显示添加建议页面
    $("#addSug").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        //打开编辑页面
        var placeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).placeid;
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplace/sugmeasureAdd.html?placeid=" + placeid,
            '新增建议措施', '55%', '25%');
    });
    //显示审核建议页面
    $("#sugAudit").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        //打开编辑页面
        var sugmeasure = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).sugmeasure,
            placeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).placeid;
        if ("undefined" != typeof(sugmeasure) && undefined != sugmeasure &&
            "" != sugmeasure && null != sugmeasure) {
            parent.openWin(BASE_URL
                + "views/module/dangersource/dssrskplace/auditAdd.html?placeid=" + placeid,
                '审核建议措施', '55%', '30%');
        } else {
            parent.toast("该条记录没有添加建议措施");
        }
    });

    //批量删除任务信息
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelPlaceIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
            var placeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).placeid;
            curSelPlaceIdArr.push(placeid);
        }
        //执行删除操作
        delDssrskplaces({"ids": curSelPlaceIdArr.toString()});
    });

    /**
     * 执行删除操作
     */
    function delDssrskplaces(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "dangersource/dssrskplace/delete",
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

    $("#resetbtn").off("click").on("click", function() {
        $('#belongent').val(null).trigger('change');
        $("#typename").attr("selectvalue", "");
        $("#typenameDiv").empty().html("<input type='text' class='form-control formWidth' id='typename' name='typename'" +
            "selectname='typeid' selectvalue='' disabled placeholder='所属分类' />");
    });
});
/**
 * 详细查看场所环境风险
 */
function display(placeid, name) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssrskplace/dssrskplaceDisplay.html?placeid=" + placeid,
        name, "55%", "80%");
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
    var belongent = $("#belongent").val();
    var typeid = $("#typename").attr("selectvalue");
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            belongent: belongent || "",
            typeid: typeid || ""
        }
    }).trigger("reloadGrid");
}
//编辑信息
function editInfo(id){
	parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplace/dssrskplaceAdd.html?placeid=" + id,
            '编辑场所环境风险', '55%', '60%');
}

/**
 * 执行删除操作
 */
function delDssrskopers(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "dangersource/dssrskplace/delete",
            type: "post",
            dataType: "json",
            data: {"ids": param},
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
// 添加建议
function addInfo(id){
	parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplace/sugmeasureAdd.html?placeid=" + id,
            '新增建议措施', '55%', '25%');
}
// 审核建议
function handleInfo(sugmeasure,id){
	if ("undefined" != typeof(sugmeasure) && undefined != sugmeasure &&
		    "" != sugmeasure && 'null' != sugmeasure){
		parent.openWin(BASE_URL
                + "views/module/dangersource/dssrskplace/auditAdd.html?placeid=" + id,
                '审核建议措施', '55%', '30%');
    }else{
    	parent.toast("该条记录没有添加建议措施");
    }
}