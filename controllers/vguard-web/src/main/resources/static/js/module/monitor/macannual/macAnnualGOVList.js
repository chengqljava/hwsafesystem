$(document).ready(function () {
	/**
	 * 设备维修记录
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	initSeachInput();
	initDateSeach("begintime","endtime");
	
//	SelectOption.loadEquipmenttype("equipmenttype");
    //生成任务列表分页表格
    var colname = ["主键id", "设备id","企业名称","设备类型","设备编号","设备名称", "年检人员","联系电话", "年检结果","登记情况","年检时间"],
        colmodel = [
            {
                name: "ANNUALID",
                index: "ANNUALID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "EQUIPMENTID",
            	index: "EQUIPMENTID",
            	width: "5%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "EQUIPMENTTYPE",
            	index: "EQUIPMENTTYPE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			if (cellvalue == "0") {
						return "摄像头";
        			}else{
						return "监测探头";
					}
        		}
            },
            {
            	name: "EQNUM",
            	index: "EQNUM",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "EQNAME",
            	index: "EQNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, option, obj) {
					return "<a href = 'javascript:void(0)' onclick='display(\""+obj.ANNUALID+"\")'>"+obj.EQNAME+"</a>";
				}
            },
            {
            	name: "ANNUALPER",
            	index: "ANNUALPER",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ANNUALTEL",
            	index: "ANNUALTEL",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "ANNUALRES",
            	index: "ANNUALRES",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			if (cellvalue == "0") {
						return "不通过";
        			}else{
						return "通过";
					}
        		}
            },{
            	name: "ISREPORT",
            	index: "ISREPORT",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			if (obj.ISREPORT == "0") {
						return "未上报";
					}else if(obj.ISREPORT == "1"){
						return "已上报";
					}else{
						return "已备案";
					}
        		}
            },{
            	name: "ANNUALTIME",
            	index: "ANNUALTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
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
        url: BASE_URL + "monitor/annual/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
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
        caption: "设备年检记录",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });

    /*重置*/
//    $("#resetbtn").bind("click",function(){
//    	$("#businessinfoname").emty();
//    	$("#equipmenttype").emty();
//    	$("#begintime").emty();
//        $("#endtime").emty();
//    });
   
  //批量审核记录
    $("#checkBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要审核的数据！");
            return;
        }

        var curSelBadIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var isreport = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).ISREPORT;
        	if(isreport == "已上报"){          		
        		var annualid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).ANNUALID;
        		curSelBadIdArr.push(annualid);
        	} else {
        		parent.toast("请选择已上报的数据！");
    			return;	
        	}
        }
        //执行删除操作
        checkAnnuals({"ids": curSelBadIdArr.toString()});
    });
    
    function checkAnnuals(param) {
        //弹出提示框
        parent.confirm("确认审核维修记录吗?", function () {
            $.ajax({
                url: BASE_URL + "monitor/annual/check",
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
/**
 * 详细查看客户信息
 */
function display(annualid) {
	parent.openWin(BASE_URL
			+ "views/module/monitor/macannual/displayAnnualGOV.html?annualid="+annualid+"&dispaly=display",
			'年检记录详情', '50%', '40%');
}

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
 * 刷新时加载查询条件
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