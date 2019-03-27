$(document)
    .ready(
        function () {
            $("#tableOpers").displayOper();
            var colname = ['人员id', '人员姓名', '资质名称', '证书编号'];
            var colmodel = [
                {
                    name: 'CONTRACTOREMPID',
                    index: 'CONTRACTOREMPID',
                    align: 'center',
                    sortable: false,
                    hidden: true
                },
                {name: 'CONTRACTOREMPNAME', index: 'CONTRACTOREMPNAME', sortable: false, align: 'left'},
                {name: 'CONTRACTORAPTITUDENAME', index: 'CONTRACTORAPTITUDENAME', sortable: false, align: 'left'},
                {name: 'CONTRACTORAPTITUDENUM', index: 'CONTRACTORAPTITUDENUM', sortable: false, align: 'left'}

            ];

            var belongid = getQueryString("belongid");
            var tableHeight = $(window).height() - $('.pcheck').height() - 190;
            $(window).resize(function(){
                $("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
                $("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
            });
            $("#grid-table").jqGrid({
                height : tableHeight,
                url: BASE_URL + "/enterprise/entcontractoremp/list",
                datatype: "json",
                cache: false,
                mtype: 'POST',
                colNames: colname,
                colModel: colmodel,
                postData: {
                    belongid: belongid
                },
                sortname: 'CREATETIME',
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
                caption: "人员资质管理",
                autowidth: true
            });
            /* 编辑 */
            $("#editBtn").bind("click", function () {
                // 返回当前grid中复选框所选择的数据的id
                var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
                if (ids.length != 1) {
                    // 弹出提示信息
                    parent.parent.parent.toast("请选择一条数据进行编辑！");
                    return;
                }
                // 返回指定id行的数据
                var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
                var contractorempid = rowdatas.CONTRACTOREMPID;
                parent.openWin(BASE_URL + '/views/module/enterprise/entcontractoremp/entcontractorempAdd.html?contractorempid=' + contractorempid, '编辑', "55%", "65%");
            });


            /* 添加 */
            $("#addBtn").bind("click", function () {
                parent.openWin(BASE_URL + '/views/module/enterprise/entcontractoremp/entcontractorempAdd.html?contractorempid=-1', '添加', "55%", "65%");
            });
            $("#importBtn").bind("click", function() {
                parent.openWin(BASE_URL + '/views/module/enterprise/entcontractoremp/importContractorEmp.html', '导入',"35%","25%");
            });
            $("#exportBtn").off("click").on("click",function(){
                window.location.href = BASE_URL + "enterprise/entcontractoremp/export";
            });
            /* 批量删除 */
            $("#delBtn").bind("click", function () {
                // 返回当前grid中复选框所选择的数据的id
                var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
                if (ids.length == 0) {
                    // 弹出提示信息
                    parent.toast("请选择需要删除的数据！");
                    return;
                }

                var userids = [];
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    // 返回指定id行的数据
                    var rowdatas = $("#grid-table").jqGrid('getRowData', id);
                    userids[i] = rowdatas.CHEMICALID;
                }
                var paramJson = userids.toString();
                var param = {
                    "ids": paramJson
                };
                del(param);
            });
        });


/* 删除方法 */
function del(param) {
    //弹出提示框
    parent.parent.parent.confirm('确认删除吗?', function () {
        $.ajax({
            url: BASE_URL + "/enterprise/entdanchemical/delete",
            type: 'post',
            dataType: 'json',
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
    })
}

/* 加载 */
function reloadGrid() {
    $("#grid-table").jqGrid('setGridParam', {
        page: 1,
        postData: {
            danexclusiveid: $('#danexclusiveid').val(),
            supervision: ''
        }
    }).trigger("reloadGrid");
}

/* 详细查询 */
function display(id) {
    parent.openWin(BASE_URL + '/enterprise/entdanchemical/display/' + id, '详细');
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}