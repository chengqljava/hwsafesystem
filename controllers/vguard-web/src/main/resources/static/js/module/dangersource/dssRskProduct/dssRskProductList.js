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
            if ($("#belongent").val()) {
                SelectTree.loadRiskTypeTree("typename", {
                    userType: 1,
                    typecode: 6,
                    belongent: $("#belongent").val() || ""
                }, "");
            }
        });
    } else {
        SelectTree.loadRiskTypeTree("typename", {
            userType: 0,
            typecode: 6
        }, "");
    }
    //生产作业活动列表分页表格
    var colname = [
            "风险id", "工序", "工作任务", "安全风险", "可能导致事故的因素",
            "控制措施", "建议措施", "建议审核结果","操作"
        ],
        colmodel = [
            {
                name: "productid",
                index: "productid",
                width: "15%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "procedure",
                index: "procedure",
                width: "15%",
                align: "left",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
//                	console.log(obj.procedure)
//                	console.log(obj.productid)
                    return '<a href="javascript:void(0);" onclick="displayProduct(\'' + obj.productid + '\',\'' +$.trim(obj.procedure)+ '\')">' + obj.procedure + '</a>';
                }
            },
            {
                name: "worktask",
                index: "worktask",
                width: "25%",
                align: "left",
                sortable: true,
                hidden: false

            },
            {
                name: "saferisk",
                index: "saferisk",
                width: "15%",
                align: "left",
                sortable: true,
                hidden: false
            },
            {
                name: "adfactor",
                index: "adfactor",
                width: "15%",
                align: "left",
                sortable: true,
                hidden: false
            },
            {
                name: "ctrlmeasure",
                index: "ctrlmeasure",
                width: "15%",
                align: "left",
                sortable: false,
                hidden: false
            },
            {
                name: "sugmeasure",
                index: "sugmeasure",
                width: "15%",
                align: "left",
                sortable: true
            },
            {
                name: "auditresult",
                index: "auditresult",
                width: "15%",
                align: "left",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return SelectOption.getSugAuditResult(obj.auditresult);
                }
            },
    		{name:'OPERATION',index:"OPERATION",width:'105px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.productid+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delDssrskopers(\''+obj.productid+'\')">删除</a><br>'
    			     + '<a href="javascript:void(0);" title="添加建议" class="operation addInfoBtn" onclick="addInfo(\''+obj.productid+'\')">添加建议</a><br>'
    			     + '<a href="javascript:void(0);" title="审核建议" class="operation handleInfoBtn" onclick="handleInfo(\''+obj.sugmeasure+'\',\''+obj.productid+'\')">审核建议</a>'
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
        width:$(window).width() - 96,
        url: BASE_URL + "dangersource/dssrskproduct/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "PRODUCTID",
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
        caption: "生产作业活动风险",
        //autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssRskProduct/saveOrUpdateDssRskProduct.html?productid=-1",
            '新增生产作业活动', '55%', '80%');
    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //显示执行导出操作
    $("#exportBtn").off("click").on("click", function () {
        window.location.href = BASE_URL + "dangersource/dssrskproduct/export";
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
        var productid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).productid;
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssRskProduct/addSuggest.html?productid=" + productid,
            '新增建议措施', '55%', '30%');
    });
    //显示审核建议页面
    $("#auditSug").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        //打开编辑页面
        var sugmeasure = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).sugmeasure,
            productid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).productid;
        if ("undefined" != typeof(sugmeasure) && undefined != sugmeasure &&
            "" != sugmeasure && null != sugmeasure) {
            parent.openWin(BASE_URL
                + "views/module/dangersource/dssRskProduct/auditSuggest.html?productid=" + productid,
                '审核建议措施', '55%', '30%');
        } else {
            parent.toast("该条记录没有添加建议措施");
        }
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
        var productid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).productid;

        parent.openWin(BASE_URL + "views/module/dangersource/dssRskProduct/saveOrUpdateDssRskProduct.html?productid=" + productid,
            "编辑生产作业活动风险", "55%", "80%");


    });


    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelProArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelProArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelProIdArr = [];
        for (var i = 0; i < curSelProArr.length; i++) {
            var productid = $("#grid-table").jqGrid("getRowData", curSelProArr[i]).productid;
            curSelProIdArr.push(productid);

        }
        //执行删除操作
        delProds({"ids": curSelProIdArr.toString()});
    });

    /**
     * 执行删除操作
     */
    function delProds(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "dangersource/dssrskproduct/delete",
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

    $("#resetbtn").off("click").on("click", function () {
        $("#belongent").val(null).trigger("change");
        $("#typename").attr("selectvalue", "");
        $("#typenameDiv").empty().html("<input type='text' class='form-control formWidth' id='typename' name='typename'" +
            "selectname='typeid' selectvalue='' readonly placeholder='所属分类' />");
    });


});

function displayProduct(productid,name) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssRskProduct/displayDssRskProduct.html?productid=" + productid,
        name, "55%", "80%");
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
	parent.openWin(BASE_URL + "views/module/dangersource/dssRskProduct/saveOrUpdateDssRskProduct.html?productid=" + id,
            "编辑生产作业活动风险", "55%", "80%");
}

/**
 * 执行删除操作
 */
function delDssrskopers(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "dangersource/dssrskproduct/delete",
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
            + "views/module/dangersource/dssRskProduct/addSuggest.html?productid=" + id,
            '新增建议措施', '55%', '30%');
}
// 审核建议
function handleInfo(sugmeasure,id){
	if ("undefined" != typeof(sugmeasure) && undefined != sugmeasure &&
		    "" != sugmeasure && 'null' != sugmeasure){
		parent.openWin(BASE_URL
                + "views/module/dangersource/dssRskProduct/auditSuggest.html?productid=" + id,
                '审核建议措施', '55%', '30%');
    }else{
    	parent.toast("该条记录没有添加建议措施");
    }
}