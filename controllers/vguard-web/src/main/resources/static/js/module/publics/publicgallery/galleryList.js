$(document).ready(function () {
	/**
	 * 园区公共设施-公用管廊
	 */
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["id","管廊编号","管廊名称","管网布置方式","管廊总长度（km）","管廊材料","管理单位"],
        colmodel = [
            {
                name: "galleryid",
                index: "galleryid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "gallerycode",
            	index: "gallerycode",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "galleryname",
            	index: "galleryname",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.galleryid + '\')">' + obj.galleryname + '</a>';
            	}
            },
            {
            	name: "pipenetwork",
            	index: "pipenetwork",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "gallength",
            	index: "gallength",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "material",
            	index: "material",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "management",
            	index: "management",
            	width: "10%",
            	align: "center",
            	sortable: false
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
        url: BASE_URL + "/publics/publicgallery/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "createdate",
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
        caption: "公用管廊列表",
        autowidth: true
    });

    //查询按钮事件
    /*$("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });*/

    //重置按钮
    /*$("#resetbtn").bind("click", function () {
        $("#galleryname").emty();
        $("#gallerycode").emty();
        $("#pipenetwork").emty();
    });*/
    $("#addBtn").off("click").on("click", function () {
    	parent.openWin(BASE_URL + "views/module/publics/publicgallery/galleryAdd.html?galleryid=null",
        		"新增公用管廊", "60%", "58%");
    });
    
    //修改
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
            //打开页面
        var galleryid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).galleryid;
        parent.openWin(BASE_URL + "views/module/publics/publicgallery/galleryAdd.html?galleryid="+galleryid,
        		"编辑公用管廊", "60%", "58%");
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

        var curSelBadIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var galleryid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).galleryid;
        	curSelBadIdArr.push(galleryid);
        }
        //执行删除操作
        delWater({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delWater(param) {
        //弹出提示框
        parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "publics/publicgallery/delete",
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
	$("#galleryname").val("");
	$("#gallerycode").val("");
	$("#pipenetwork").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 查看信息
 */
function display(galleryid) {
	parent.openWin(BASE_URL + "views/module/publics/publicgallery/galleryDisplay.html?galleryid="+galleryid+"&isDisplay=isDisplay",
    		"公用管廊详情", "68%", "55%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	galleryname: $("#galleryname").val(),
        	gallerycode: $("#gallerycode").val(),
        	pipenetwork: $("#pipenetwork").val()
        }
    }).trigger("reloadGrid");
}