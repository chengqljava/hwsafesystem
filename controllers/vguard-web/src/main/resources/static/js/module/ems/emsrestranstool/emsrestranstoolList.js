$(document).ready(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	initSeachInput();
	SelectOption.loadUsualUse("usecodeid");
	
    //生成任务列表分页表格
			var colname = ["主键id","运输工具编号","运输工具名称","日常用途","存放地点","载重量", "载人数","主管单位","负责人","填报单位","单位类型"],
	        colmodel = [
	            {
	                name: "TRANSTOOLID",
	                index: "TRANSTOOLID",
	                width: "5%",
	                align: "left",
	                sortable: false,
	                hidden: true
	            },
	            {
	            	name: "TRANSTOOLCODE",
	            	index: "TRANSTOOLCODE",
	            	width: "10%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "TRANSTOOLNAME",
	            	index: "TRANSTOOLNAME",
	            	width: "10%",
	            	align: "left",
	            	sortable: false,
	            	formatter: function (cellvalue, options, obj) {
	            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.TRANSTOOLID + '\')">' + obj.TRANSTOOLNAME + '</a>';
	            	}
	            },
	            {
	            	name: "USECODENAME",
	            	index: "USECODENAME",
	            	width: "15%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "DEPOSITPLACE",
	            	index: "DEPOSITPLACE",
	            	width: "15%",
	            	align: "left",
	            	sortable: false,
	            },
	            {
	            	name: "LOADNUM",
	            	index: "LOADNUM",
	            	width: "10%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "MANNEDNUM",
	            	index: "MANNEDNUM",
	            	width: "10%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "CHARGEDEPT",
	            	index: "CHARGEDEPT",
	            	width: "10%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name:'RESPPER',
	            	index:'RESPPER', 
	            	width:'10%',
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name:'UNITNAME',
	            	index:'UNITNAME', 
	            	width:'10%',
	            	align: "left",
	            	hidden: true,
	            	sortable: false
	            },
	            {
	            	name:'UNITCLASS',
	            	index:'UNITCLASS', 
	            	width:'10%',
	            	align: "left",
	            	hidden: true
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
        url: BASE_URL + "ems/emsrestranstool/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
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
        caption: "运输保障列表",
        autowidth: true
    });

    //查询按钮事件
    $("#searchBtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetBtn").bind("click",function(){
    	$("#transtoolcode").val(""),
    	$("#transtoolname").val(""),
    	$("#usecodeid").val("")
    });
    
    //添加
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emsrestranstool/emsrestranstoolAdd.html?transtoolid=-1",
				'新增运输保障', '65%', '70%');
    });

    //修改
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var unitclass = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).UNITCLASS;
        if(unitclass == "gov"){        	
        	var transtoolid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TRANSTOOLID;
        	//TODO 弹出编辑框
        	parent.openWin(BASE_URL
        			+ "views/module/ems/emsrestranstool/emsrestranstoolAdd.html?transtoolid="+transtoolid,
        			'修改运输保障', '65%', '70%');
        } else {
        	// 弹出提示信息
            parent.toast("请选择政府填报的数据进行编辑！");
            return;
        }
        
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
        	var unitclass = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).UNITCLASS;
        	if(unitclass == "gov"){        		
        		var transtoolid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).TRANSTOOLID;
        		curSelBadIdArr.push(transtoolid);
        	} else {
        		// 弹出提示信息
                parent.toast("请选择政府填报的数据进行删除！");
                return;
        	}
        }
        //执行删除操作
        delBadrecords({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delBadrecords(param) {
        //弹出提示框
        parent.confirm("确认删除该通讯保障?", function () {
            $.ajax({
                url: BASE_URL + "ems/emsrestranstool/delete",
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
    
    /**
     *企业端 上报 
     */
    $("#report").off("click").on("click", function () {
    	 var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
         if (1 != curSelRowArr.length) {
             // 弹出提示信息
             parent.toast("请选择一条数据进行编辑！");
             return;
         }
        var transtoolid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TRANSTOOLID;
        var param = {"transtoolid":transtoolid};
        //弹出提示框
        parent.confirm('确认上报吗?',function(){
            $.ajax({ 
                url: BASE_URL+"/ems/emsrestranstool/report",
                type:'post',
                dataType:'json',
                data:param,
                success: function(json){
                    if(json.success==true){
                        parent.toast(json.msg);
                        reloadGrid();//刷新列表
                    }else{
                        parent.toast(json.msg);
                    }
                }
             });
        });
    });
});
/**
 * 查看避难场所信息
 */
function display(transtoolid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/emsrestranstool/emsrestranstoolDisplay.html?transtoolid="+transtoolid,
             "通讯保障详情", "60%", "65%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var transtoolcode = $("#transtoolcode").val();
	var transtoolname = $("#transtoolname").val();
	var usecodeid = $("#usecodeid").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	transtoolcode:transtoolcode||"",
        	transtoolname:transtoolname||"",
        	usecodeid:usecodeid||""
        }
    }).trigger("reloadGrid");
}
