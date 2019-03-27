$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectOption.loadDeviceStatus("status");
	
    //生成任务列表分页表格
    var colname = ["设备id","设备编号","关联站点名称","设备状态","监测设备类型代码","手机号","设备状态最新接收时间","创建时间"],
        colmodel = [
            {
                name: "DEVICEID",
                index: "DEVICEID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "SNCCODE",
            	index: "SNCCODE",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.DEVICEID+'\')">'+obj.SNCCODE+'</a>';
            	}
            },
            {
            	name: "SITENAME",
            	index: "SITENAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "STATUS",
            	index: "STATUS",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return SelectOption.getDeviceStatus(obj.STATUS);
            	}
            },
            {
            	name: "MONITORCODE",
            	index: "MONITORCODE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "MPHONE",
            	index: "MPHONE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "RECEIVETIME_DEV",
            	index: "RECEIVETIME_DEV",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.RECEIVETIME_DEV, "yyyy-MM-dd hh:mm:ss");
            	}
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd hh:mm:ss");
            	}
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
        url: BASE_URL + "epi/epidevice/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {

        },
        sortname: "CREATETIME",
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
        caption: "环保设备列表",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/epi/epidevice/epideviceAdd.html?deviceid=-1",
				'新增环保设备', '60%', '65%');
    });
    
    //编辑
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }         	
    	var deviceid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).DEVICEID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/epi/epidevice/epideviceAdd.html?deviceid="+deviceid,
    			'编辑环保设备', '60%', '65%');
    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
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

        var curSelMaintainidArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	 var deviceid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).DEVICEID;
        	 curSelMaintainidArr.push(deviceid);
        }
        //执行删除操作
        delMaintains({"ids": curSelMaintainidArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delMaintains(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "epi/epidevice/delete",
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
    });
});
/**
 * 详细查看
 */
function display(deviceid) {
	 parent.openWin(BASE_URL + "views/module/epi/epidevice/epideviceDisplay.html?deviceid="+deviceid+"&isDisplay=isDisplay",
             "环保设备详情","65%", "65%");
}

/**
 * 刷新加载
 */
function reloadGrid() {
	var snccode = $("#snccode").val();
	var status = $("#status").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	snccode:snccode||"",
        	status:status||""
        }
    }).trigger("reloadGrid");
}