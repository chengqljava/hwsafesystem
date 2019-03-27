$(function () {
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    var $idSelect = SelectTwo.initSelect2($('#businessinfoid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);


    //违约欠款列表分页表格
    var colname = [
            "违约欠款id", "企业名称", "违约欠款日期", "违约事实", "拖欠款额", "处理办法", "创建人",
            "创建时间", "备注"
        ],
        colmodel = [
            {
                name: "VIOLATIONID",
                index: "VIOLATIONID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "BUSINESSINFOID",
                index: "BUSINESSINFOID",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.VIOLATIONID + '\',\'' + obj.ENTNAME + '\')">' + obj.ENTNAME + '</a>';
                }
            },
            {
                name: "VIOLATIONTIME",
                index: "VIOLATIONTIME",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.VIOLATIONTIME, "yyyy-MM-dd");
                }

            },
            {
                name: "VIOLATIONFACT",
                index: "VIOLATIONFACT",
                width: "25%",
                align: "left",
                sortable: true,
                hidden: false

            },
            {
                name: "MONEY",
                index: "MONEY",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: true
            },
            {
                name: "HANDLEMETHOD",
                index: "HANDLEMETHOD",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "CREATENAME",
                index: "CREATENAME",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "CREATETIME",
                index: "CREATETIME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd");
                }
            },
            {
                name: "REMARK",
                index: "REMARK",
                width: "15%",
                align: "left",
                sortable: true
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
        url: BASE_URL + "ecs/ecsbadviolation/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "VIOLATIONID",
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
        caption: "违约欠款事件",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/ecs/badrecord/badViolation/saveOrUpdateBadViolation.html?violationid=-1",
            '新增投违约欠款', '50%', '50%');
    });


    //点击查询
    $("#searchbtn").off("click").on("click", function () {

        reloadGrid();
    });

    //显示执行导出操作
    $("#exportBtn").off("click").on("click", function () {
        window.location.href = BASE_URL + "ecs/ecsbadviolation/export";
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
        var violationid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).VIOLATIONID;

        parent.openWin(BASE_URL + "views/module/ecs/badrecord/badViolation/saveOrUpdateBadViolation.html?violationid=" + violationid,
            "编辑违约欠款", "50%", "50%");


    });
    /*重置*/
    $("#resetbtn").bind("click",function(){
        $("#businessinfoid").val(null).trigger("change");
    });

    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelViolationArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelViolationArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelViolationIdArr = [];
        for (var i = 0; i < curSelViolationArr.length; i++) {
            var violationid = $("#grid-table").jqGrid("getRowData", curSelViolationArr[i]).VIOLATIONID;
            curSelViolationIdArr.push(violationid);

        }
        //执行删除操作
        delReps({"ids": curSelViolationIdArr.toString()});
    });

    /**
     * 执行删除操作
     */
    function delReps(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "ecs/ecsbadviolation/delete",
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

function display(violationid, name) {
    parent.openWin(BASE_URL + "views/module/ecs/badrecord/badViolation/displayBadViolation.html?violationid=" + violationid,
        name, "50%", "55%");
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
    return repo.text;
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
    var businessinfoid = $('#businessinfoid').val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            businessinfoid:businessinfoid
        }
    }).trigger("reloadGrid");
}