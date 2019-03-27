$(function () {
	//显示操作权限按钮
	initSeachInput();
	initDateSeach("begintime","endtime");
	
	$("#tableOpers").displayOper();
//	SelectOption.loadEquipmenttype("equipmenttype");
	
    //生成任务列表分页表格
    var colname = ["维修id","企业名称","设备类型","设备编号","设备名称","维修人员","联系电话","维修时间", "故障原因","维修方式","登记情况"],
        colmodel = [
            {
                name: "MAINTAINID",
                index: "MAINTAINID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "10%",
            	align: "left",
            	sortable: true
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
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.MAINTAINID+'\',\''+$.trim(obj.EQNAME)+'\')">'+obj.EQNAME+'</a>';
            	}
            },
            {
            	name: "MAINTAINPER",
            	index: "MAINTAINPER",
            	width: "10%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "MAINTAINTEL",
            	index: "MAINTAINTEL",
            	width: "10%",
            	align: "left",
            	sortable: true
            },
            {
            	name: "MAINTAINTIME",
            	index: "MAINTAINTIME",
            	width: "10%",
            	align: "left",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.MAINTAINTIME, "yyyy-MM-dd hh:mm:ss");
            	}
            },
            {
            	name: "BADREASON",
            	index: "BADREASON",
            	width: "10%",
            	align: "left",
            	sortable: true
            },
            {
            	name: "MAINTIANTYPE",
            	index: "MAINTIANTYPE",
            	width: "10%",
            	align: "left",
            	sortable: true,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getMaintiantype(obj.MAINTIANTYPE);
    			}
            },
            {
            	name: "ISREPORT",
            	index: "ISREPORT",
            	width: "10%",
            	align: "left",
            	sortable: true,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getIsreport(obj.ISREPORT);
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
        url: BASE_URL + "monitor/macmaintan/list",
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
        caption: "维修记录列表",
        autowidth: true
    });

    //批量审核信息
    $("#auditBtn").off("click").on("click", function () {
    	console.log(1);
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要审核的数据！");
            return;
        }

        var curSelMaintainidArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var isreport = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISREPORT;
        	console.log(isreport);
        	if(isreport == "已上报"){        		
        		var maintainid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).MAINTAINID;
        		curSelMaintainidArr.push(maintainid);
        	} else {
        		// 弹出提示信息
                parent.toast("请选择已上报的数据！");
                return;
        	}
        }
        //执行上报操作
        upMaintains({"ids": curSelMaintainidArr.toString()});
    });
    
    /**
     * 执行审核操作
     */
    function upMaintains(param) {
        //弹出提示框
        parent.confirm("确认审核吗？", function () {
            $.ajax({
                url: BASE_URL + "monitor/macmaintan/exam",
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
	$('#daterange-btn span').html(" 日期选择");
	$("#begintime").val("");
	$("#endtime").val("");
    $("#businessinfoname").val("");
    $("#equipmenttype").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看
 */
function display(maintainid,name) {
	 parent.openWin(BASE_URL + "views/module/monitor/macmaintan/macmaintanDisplay.html?maintainid="+maintainid,
             name,"50%", "50%");
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
	var businessinfoname = $("#businessinfoname").val();
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
        	businessinfoname:businessinfoname||"",
        	equipmenttype:equipmenttype||"",
        	begintime:begintime||"",
        	endtime:endtime||""
        }
    }).trigger("reloadGrid");
}