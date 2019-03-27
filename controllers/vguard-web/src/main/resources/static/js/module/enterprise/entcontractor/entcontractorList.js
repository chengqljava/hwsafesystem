$(document)
    .ready(
        function() {
            $("#tableOpers").displayOper();
            var colname = [ '承包商id', '承包商名称', '承包商公司地址', '邮政编号', '资质个数'];
            var colmodel = [
                {name : 'ENTCONTRACTORID',index : 'ENTCONTRACTORID',align : 'center',sortable : false,hidden : true},
                {name : 'ENTCONTRACTORNAME',index : 'ENTCONTRACTORNAME',sortable : false,align : 'left'},
                {name : 'ENTCONTRACTORADDRESS',index : 'ENTCONTRACTORADDRESS',sortable : false,align : 'center'},
                {name : 'POSTALNUMBER',index : 'POSTALNUMBER',sortable : false,align : 'center'},
                {name : 'APTITUDECOUNT',index : 'APTITUDECOUNT',sortable : false,align : 'center',formatter:function (cellvalue, options, obj) {
                        return '<a href="javascript:void(0);" onclick="displayAptitude(\'' + obj.ENTCONTRACTORID + '\')">' + obj.APTITUDECOUNT + '</a>'
                    }}];


            var tableHeight = $(window).height() - $('.pcheck').height() - 190;
            $(window).resize(function(){
                $("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
                $("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
            });
            $("#grid-table").jqGrid({
                height : tableHeight,
                url : BASE_URL + "/enterprise/entcontractor/list",
                datatype : "json",
                cache : false,
                mtype : 'POST',
                colNames : colname,
                colModel : colmodel,
                postData : {
                    danexclusiveid : $('#danexclusiveid').val(),
                    supervision : ''
                },
                sortname : 'CREATETIME',
                sortorder : "desc",
                viewrecords : true,
                pager : "#grid-pager",
                jsonReader : {
                    root : "datas",
                    total : "total",
                    page : "page",
                    records : "records",
                    repeatitems : false
                },
                rowNum : 10,
                rowList : [ 10, 20, 30 ],
                altRows : true,
                multiselect : true,
                caption : "承包商管理",
                autowidth : true
            });


            /* 编辑 */
            $("#editBtn").bind("click", function() {
                // 返回当前grid中复选框所选择的数据的id
                var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
                if (ids.length != 1) {
                    // 弹出提示信息
                    parent.toast("请选择一条数据进行编辑！");
                    return;
                }
                // 返回指定id行的数据
                var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
                var contractorid = rowdatas.ENTCONTRACTORID;
                parent.openWin(BASE_URL + '/views/module/enterprise/entcontractor/entcontractorAdd.html?contractorid=' + contractorid, '编辑',"55%","65%");
            });


            /* 添加 */
            $("#addBtn").bind("click", function() {
                parent.openWin(BASE_URL + '/views/module/enterprise/entcontractor/entcontractorAdd.html?contractorid=-1', '添加',"55%","65%");
            });
            $("#importBtn").bind("click", function() {
                parent.openWin(BASE_URL + '/views/module/enterprise/entcontractor/importContractor.html', '导入',"35%","25%");
            });
            $("#exportBtn").off("click").on("click",function(){
                window.location.href = BASE_URL + "enterprise/entcontractor/export";
            });

            /* 批量删除 */
            $("#delBtn").bind("click", function() {
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
                    "ids" : paramJson
                };
                del(param);
            });
        });

function displayAptitude(entcontractorid) {
    parent.openWin(BASE_URL + '/views/module/enterprise/entcontractoraptitude/showaptitude.html?privcode=ENT_APTITUDE_CODE&entcontractorid=' + entcontractorid, '资质管理',"55%","65%");

}


function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}


/* 删除方法 */
function del(param) {
    //弹出提示框
    parent.confirm('确认删除吗?',function(){
        $.ajax({
            url: BASE_URL + "/enterprise/entdanchemical/delete",
            type:'post',
            dataType:'json',
            data:param,
            success: function(json){
                if(json.success==true){
                    parent.toast(json.msg);
                    reloadGrid();// 刷新列表
                }else{
                    parent.toast(json.msg);
                }
            }
        });
    })
}

/* 加载 */
function reloadGrid() {
    $("#grid-table").jqGrid('setGridParam', {
        page : 1,
        postData : {
            danexclusiveid : $('#danexclusiveid').val(),
            supervision : ''
        }
    }).trigger("reloadGrid");
}

/* 详细查询 */
function display(id) {
    parent.openWin(BASE_URL + '/enterprise/entdanchemical/display/' + id, '详细');
}
