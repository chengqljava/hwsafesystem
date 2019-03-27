$(function () {
	
	if($(window).width() < 700) {
		$('.showBtn').css({"display":"none"});
		var len = $('.dropdown-menu li').length;
		for(var i = 0; i < len; i++) {
			$('.smallShow li button')[i].onclick = function () {
    				var html = $(this).html();
    				$('.clickBtn').html(html);
    			};
    		}
	}else {
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
    //生成执法终端分页表格
    var colname = [
            "主键ID", "编号", "型号", "厂家", "名称", "状态",
            "投入使用时间", "创建时间", "更新时间", "备注"
        ],
        colmodel = [
            {
                name: "EQUIPID",
                index: "EQUIPID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "EQUIPNUM",
                index: "EQUIPNUM",
                width: "45%",
                sortable: false,
                align: "left",
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.EQUIPID + '\')">' + obj.EQUIPNUM + '</a>';
                }
            },
            {
                name: "MODEL",
                index: "MODEL",
                width: "45%",
                sortable: false,
                align: "left"
            },
            {
                name: "MANUF",
                index: "MANUF",
                width: "35%",
                sortable: false,
                align: "left"
            },
            {
                name: "EQUIPNAME",
                index: "EQUIPNAME",
                width: "40%",
                sortable: false,
                align: "left"
            },
            {
                name: "STATE",
                index: "STATE",
                width: "30%",
                sortable: false,
                align: "center",
                formatter: function (cellvalue, options, obj) {
                    return "0" == cellvalue ? "启用" : "禁用";
                }
            },
            {
                name: "USETIME",
                index: "USETIME",
                width: "40%",
                align: "center",
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.USETIME,
                        "yyyy-MM-dd");
                }
            },
            {
                name: "CREATETIME",
                index: "CREATETIME",
                width: "50%",
                align: "center",
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.CREATETIME,
                        "yyyy-MM-dd hh:mm:ss");
                },
                hidden: true
            },
            {
                name: "UPDATETIME",
                index: "UPDATETIME",
                width: "50%",
                align: "center",
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.UPDATETIME,
                        "yyyy-MM-dd hh:mm:ss");
                },
                hidden: true
            },
            {
                name: "NOTES",
                index: "NOTES",
                width: "30%",
                sortable: false,
                align: "left",
                hidden: true
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/law/lawTerminal/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            equipnum: $("#equipnum").val(),
            equipname: $("#equipname").val(),
            equipmodel: $("#equipmodel").val(),
            manuf: $("#manuf").val()
        },
        sortname: "UPDATETIME",
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
        caption: "执法终端管理",
        autowidth: true,
        loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //新增执法终端
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL + "/law/lawTerminal/add",
            "添加执法终端", "60%", "45%");
    });

    //编辑执法终端
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        //打开编辑弹窗
        parent.openWin(BASE_URL + "/law/lawTerminal/edit/" +
            $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).EQUIPID,
            "编辑执法终端", "60%", "45%");
    });

    //批量删除执法终端
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelEqIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
            // 返回指定id行的数据
            curSelEqIdArr.push($("#grid-table").jqGrid("getRowData", curSelRowArr[i]).EQUIPID);
        }
        //执行删除操作
        del({"equipIds": curSelEqIdArr.toString()});
    });
});

/**
 * 执行删除操作
 */
function del(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "/law/lawTerminal/delete",
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
    })
}

/**
 * 详细查询执法终端信息
 */
function display(equipId) {
    parent.openWin(BASE_URL + "/law/lawTerminal/display/" + equipId,
        "执法终端详情", "60%", "45%");
}

/**
 * 刷新加载执法终端分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            equipnum: $("#equipnum").val(),
            equipname: $("#equipname").val(),
            equipmodel: $("#equipmodel").val(),
            manuf: $("#manuf").val()
        }
    }).trigger("reloadGrid");
}