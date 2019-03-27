
$(document).ready(function () {
    var colname = ['主键id', '问题', '回答', '修改时间'];
    var colmodel = [
		{ name: 'problemid', index: 'problemid', width: '5%', hidden: true },
		{
		    name: 'probleminfo', index: 'probleminfo', width: '30%', align: 'left',
		    formatter: function (cellvalue, options, obj) {
		        return '<a href="javascript:void(0);" onclick="display(\'' + obj.problemid + '\')">' + obj.probleminfo + '</a>';
		    }
		},
		{ name: 'answer', index: 'answer', width: '40%', align: 'left' },
		{
		    name: 'dateline', index: 'dateline', width: '30%', align: 'left',
		    formatter: function (cellvalue, options, obj) {
		        if (obj.dateline) {
		            return getFormatDateByLong(obj.dateline, "yyyy-MM-dd hh:mm:ss");
		        } else {
		            return "";
		        }
		    }
		}
    ];

    var tableHeight = $(window).height() - $('.pcheck').height() - 190;
    $(window).resize(function () {
        $("#grid-table").jqGrid('setGridHeight', $(window).height() - $('.pcheck').height() - 190);
        $("#grid-table").jqGrid('setGridWidth', $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/chat/chatproblem/syslist",
        datatype: "json",
        cache: false,
        mtype: 'post',
        postData: {
            probleminfo: $('#probleminfo').val()
        },
        colNames: colname,
        colModel: colmodel,
        sortname: 'dateline',
        sortorder: "desc",
        viewrecords: false,
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
        caption: "常见问题",
        altRows: true,
        multiselect: true,
        autowidth: true,
        loadComplete: function () {
            $("#grid-table").jqGrid('setGridHeight', $(window).height() - $('.pcheck').height() - 190);
            $("#grid-table").jqGrid('setGridWidth', $(window).width() * 0.99);
        }
    });
});

/*加载*/
function reloadGrid() {
    $("#grid-table").jqGrid('setGridParam', {
        page: 1, postData: {
            probleminfo: $('#probleminfo').val()
        }
    }).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click", function () {
    reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click", function () {
    $("#probleminfo").val("");
});


/*详细显示*/
function display(problemid) {
    parent.openWin(BASE_URL + "/chat/chatproblem/display/" + problemid, '常见问题详细', '70%', '80%');
}

/*常见问题添加*/
$("#addBtn").bind("click", function () {
    parent.openWin(BASE_URL + "/chat/chatproblem/add", '常见问题添加', '70%', '80%');
});
/*常见问题编辑*/
$("#editBtn").bind("click", function () {
    var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
    if (ids.length != 1) {
        // 弹出提示信息
        parent.toast("请选择一条记录！");
        return;
    }
    var rowdata = $("#grid-table").jqGrid('getRowData', ids[0]); //选中的一条记录
    parent.openWin(BASE_URL + '/chat/chatproblem/edit/' + rowdata.problemid, '常见问题编辑', '70%', '80%');
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
        userids[i] = rowdatas.problemid;
    }
    var paramJson = userids.toString();
    var param = {
        "ids": paramJson
    };
    del(param);
});


/* 删除方法 */
function del(param) {
    //弹出提示框
    parent.confirm('确认删除吗?', function () {
        $.ajax({
            url: BASE_URL + "/chat/chatproblem/delete",
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
    });
}
