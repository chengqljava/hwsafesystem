$(document)
    .ready(
        function () {
            $("#tableOpers").displayOper();
            var colname = ['资质id', '资质名称', '资质证书编号'];
            var colmodel = [
                {
                    name: 'CONTRACTORAPTITUDEID',
                    index: 'CONTRACTORAPTITUDEID',
                    align: 'center',
                    sortable: false,
                    hidden: true
                },
                {name: 'CONTRACTORAPTITUDENAME', index: 'CONTRACTORAPTITUDENAME', sortable: false, align: 'left'},
                {name: 'CONTRACTORAPTITUDENUM', index: 'CONTRACTORAPTITUDENUM', sortable: false, align: 'center'}];

            var belongid = getQueryString("entcontractorid");
            var tableHeight = $(window).height() - $('.pcheck').height() - 190;
            $(window).resize(function(){
                $("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
                $("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
            });
            $("#grid-table").jqGrid({
                height : tableHeight,
                url: BASE_URL + "/enterprise/entcontractoraptitude/list",
                datatype: "json",
                cache: false,
                mtype: 'POST',
                colNames: colname,
                colModel: colmodel,
                postData: {
                    belongid:belongid
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
                caption: "资质管理",
                autowidth: true
            });
            /* 编辑 */
            $("#editBtn").bind("click", function () {
                // 返回当前grid中复选框所选择的数据的id
                var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
                if (ids.length != 1) {
                    // 弹出提示信息
                    parent.toast("请选择一条数据进行编辑！");
                    return;
                }
                // 返回指定id行的数据
                var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
                var aptitudeid = rowdatas.CONTRACTORAPTITUDEID;
                openWin(BASE_URL + '/views/module/enterprise/entcontractoraptitude/entcontractoraptitudeAdd.html?aptitudeid=' + aptitudeid+"&belongid="+belongid, '编辑', "80%", "80%");
            });


            /* 添加 */
            $("#addBtn").bind("click", function () {
                openWin(BASE_URL + '/views/module/enterprise/entcontractoraptitude/entcontractoraptitudeAdd.html?aptitudeid=-1&belongid='+belongid, '添加', "80%", "80%");
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
    parent.confirm('确认删除吗?', function () {
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
function resetData(){
    $("#workplanid").val(null).trigger("change");
    $('#daterange-btn span').html(" 日期选择");
    $("#begintime").val("");
    $("#endtime").val("");
    $("#state").val("");

}

function seach(){
    reloadGrid();
}
/* 加载 */
function reloadGrid() {
    parent.getActiveIFrame().reloadGrid();
    var belongid = getQueryString("entcontractorid");
    $("#grid-table").jqGrid('setGridParam', {
        page: 1,
        postData: {
            belongid: belongid
        }
    }).trigger("reloadGrid");
}

/* 详细查询 */
function display(id) {
    parent.openWin(BASE_URL + '/enterprise/entdanchemical/display/' + id, '详细');
}


function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}