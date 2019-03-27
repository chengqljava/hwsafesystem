$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	
	initSeachInput();
	initDateSeach("begintime","endtime");
//	SelectOption.loadEquipmenttype("equipmenttype");
	
    //生成任务列表分页表格
    var colname = ["维修id","设备类型","设备编号","设备名称","标定人员","联系电话","标定时间", "标定厂家"/*,"登记情况"*/],
        colmodel = [
            {
                name: "DEMARCATEID",
                index: "DEMARCATEID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "EQUIPMENTTYPE",
            	index: "EQUIPMENTTYPE",
            	width: "10%",
            	align: "left",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return SelectOption.getEquipmenttype(obj.EQUIPMENTTYPE);
            	}
            },
            {
            	name: "EQNUM",
            	index: "EQNUM",
            	width: "10%",
            	align: "left",
            	sortable: true
            },
            {
            	name: "EQNAME",
            	index: "EQNAME",
            	width: "10%",
            	align: "left",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.DEMARCATEID+'\',\''+$.trim(obj.EQNAME)+'\')">'+obj.EQNAME+'</a>';
            	}
            },
            {
            	name: "DEMARCATEPER",
            	index: "DEMARCATEPER",
            	width: "10%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "DEMARCATETEL",
            	index: "DEMARCATETEL",
            	width: "10%",
            	align: "left",
            	sortable: true
            },
            {
            	name: "DEMARCATETIME",
            	index: "DEMARCATETIME",
            	width: "10%",
            	align: "left",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.DEMARCATETIME, "yyyy-MM-dd hh:mm:ss");
            	}
            },
            {
            	name: "DEMARCATEMAN",
            	index: "DEMARCATEMAN",
            	width: "10%",
            	align: "left",
            	sortable: true
            }/*,
            {
            	name: "ISREPORT",
            	index: "ISREPORT",
            	width: "10%",
            	align: "left",
            	sortable: true,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getIsreport(obj.ISREPORT);
    			}
            }*/
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "monitor/macdemarcate/list",
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
        caption: "标定记录列表",
        autowidth: true,
        loadComplete: function() {
			if ($("#closeBtn").length==0) {
				$(".table-line").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center; margin-top: 10px;">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
        }
    });

    //新增监控监测设备维修
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/monitor/macdemarcate/macdemarcateAdd.html?demarcateid=-1",
				'新增监控监测设备标定', '50%', '50%');
    });
    
    //编辑场所环境风险
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var isreport = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISREPORT;
        if(isreport == '未上报'){        	
        	var demarcateid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).DEMARCATEID;
        	//TODO 弹出编辑框
        	parent.openWin(BASE_URL
        			+ "views/module/monitor/macdemarcate/macdemarcateAdd.html?demarcateid="+demarcateid,
        			'编辑监控监测设备标定', '50%', '50%');
        } else{
        	// 弹出提示信息
            parent.toast("请选择未上报的数据！");
            return;
        }
    });

    //点击查询
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });
    
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
        	var isreport = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISREPORT;
        	if(isreport == "未上报"){         		
        		var demarcateid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).DEMARCATEID;
        		curSelMaintainidArr.push(demarcateid);
        	}else {
        		// 弹出提示信息
                parent.toast("请选择未上报的数据！");
                return;
        	}
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
                url: BASE_URL + "monitor/macdemarcate/delete",
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

    //批量上报任务信息
    $("#auditBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要上报的数据！");
            return;
        }

        var curSelMaintainidArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var isreport = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISREPORT;
        	if(isreport == "未上报"){        		
        		var demarcateid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).DEMARCATEID;
        		curSelMaintainidArr.push(demarcateid);
        	} else {
        		// 弹出提示信息
                parent.toast("请选择未上报的数据！");
                return;
        	}
        }
        //执行上报操作
        upMaintains({"ids": curSelMaintainidArr.toString()});
    });
    
    /**
     * 执行上报操作
     */
    function upMaintains(param) {
        //弹出提示框
        parent.confirm("上报之后不能再修改，确认上报吗？", function () {
            $.ajax({
                url: BASE_URL + "monitor/macdemarcate/audit",
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
    
//    $("#resetbtn").off("click").on("click", function() {
//    });
});
/**
 * 详细查看
 */
function display(demarcateid,name) {
	 parent.openWin(BASE_URL + "views/module/monitor/macdemarcate/macdemarcateDisplay.html?demarcateid="+demarcateid,
             name,"50%", "45%");
}
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#begintime").val("");
	$("#endtime").val("");
    $("#equipmenttype").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
	var equipmenttype = $("#equipmenttype").val();
	var begintime = $("#begintime").val();
    var endtime = $("#endtime").val();
    if (equipmenttype =='摄像头') {
    	equipmenttype = '0';
	}else if(equipmenttype =='监测探头'){
		equipmenttype = '1';
	}else{
		equipmenttype = '';
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	equipmenttype:equipmenttype||"",
        	begintime:begintime||"",
        	endtime:endtime||""
        }
    }).trigger("reloadGrid");
}