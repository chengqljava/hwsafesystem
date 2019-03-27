$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	
    //生成任务列表分页表格
    var colname = ["站点id","站点代码","站点名称","站点序号","站点位置","站点联系人","联系电话","创建时间"],
        colmodel = [
            {
                name: "STATIONID",
                index: "STATIONID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "SITECODE",
            	index: "SITECODE",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.STATIONID+'\')">'+obj.SITECODE+'</a>';
            	}
            },
            {
            	name: "SITENAME",
            	index: "SITENAME",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "SITENUM",
            	index: "SITENUM",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ADDRESS",
            	index: "ADDRESS",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "LINKMAN",
            	index: "LINKMAN",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "CONTACTTEL",
            	index: "CONTACTTEL",
            	width: "10%",
            	align: "center",
            	sortable: true
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
        url: BASE_URL + "epi/epistation/list",
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
        caption: "环保站点列表",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/epi/epistation/epistationAdd.html?stationid=-1",
				'新增环保站点', '60%', '65%');
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
    	var stationid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).STATIONID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/epi/epistation/epistationAdd.html?stationid="+stationid,
    			'编辑环保站点', '60%', '65%');
    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    /**
     * 选择一条站点
     */
    $("#entbtn").on("click",function(){
    	var itemsArr = [];
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length !=1){
    		// 弹出提示信息
    		parent.toast("请选择一条记录！");
    		return;
    	}
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var stationid = rowdata.STATIONID;
    	var sitename = rowdata.SITENAME;
    	itemsArr.push({
			"stationid":stationid,
			"sitename":sitename
		});
    	window.top.GEventObject.fireEvent('LOAD_MAC_INFO',itemsArr);
    	parent.closeWin();
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
        	 var stationid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATIONID;
        	 curSelMaintainidArr.push(stationid);
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
                url: BASE_URL + "epi/epistation/delete",
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
function display(stationid) {
	 parent.openWin(BASE_URL + "views/module/epi/epistation/epistationDisplay.html?stationid="+stationid,
             "环保站点详情","65%", "70%");
}

/**
 * 刷新加载
 */
function reloadGrid() {
	var sitename = $("#sitename").val();
	var sitenum = $("#sitenum").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	sitename:sitename||"",
        	sitenum:sitenum||""
        }
    }).trigger("reloadGrid");
}