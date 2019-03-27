$(document).ready(function () {
	
	/**
	 * 医疗机构列表
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	initSeachInput();
	SelectTree.loadRescueType("rescuetypecode",{"parentcode":"46"});// 医疗机构节点树
	SelectTree.loadDistrictAllSelect("districtcode");// 行政区域
    //生成任务列表分页表格
	
		 var colname = ["主键id", "医疗机构代码","医疗机构名称","医疗机构类型","行政区划","主管单位", "医疗机构等级","所属单位"],
	        colmodel = [
	            {
	                name: "DEPTID",
	                index: "DEPTID",
	                width: "5%",
	                align: "left",
	                sortable: false,
	                hidden: true
	            },
	            {
	            	name: "DEPTNUM",
	            	index: "DEPTNUM",
	            	width: "15%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "DEPTNAME",
	            	index: "DEPTNAME",
	            	width: "15%",
	            	align: "left",
	            	sortable: false,
	            	formatter: function (cellvalue, options, obj) {
	            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.DEPTID + '\')">' + obj.DEPTNAME + '</a>';
	            	}
	            },
	            {
	            	name: "RESOURCETYPENAME",
	            	index: "RESOURCETYPENAME",
	            	width: "15%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "DISTRICTNAME",
	            	index: "DISTRICTNAME",
	            	width: "15%",
	            	align: "left",
	            	sortable: false,
	            },
	            {
	            	name: "CHARGEDEPT",
	            	index: "CHARGEDEPT",
	            	width: "15%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "DEPTGRADENAME",
	            	index: "DEPTGRADENAME",
	            	width: "15%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name:'FILLORGANNAME',
	            	index:'FILLORGANNAME', 
	            	width:'10%',
	            	align: "left",
	            	sortable: false,
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
        url: BASE_URL + "ems/emsreshealthdept/list",
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
        caption: "医疗机构列表",
        autowidth: true,
    });

    //查询按钮事件
    $("#searchBtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetBtn").bind("click",function(){
    	$("#districtname_select").val("");
    	$("#districtcode").val("");
    	$("#rescuetypecode").val("");
    	$("#rescuetypecode").attr("selectvalue",""),
    	$("#districtcode").attr("selectvalue",""),
    	$("#deptname").val("")
    });
    //添加-许可证吊销情况
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ems/healthdept/healthdeptEdit.html?deptid=null",
				'添加医疗机构', '60%', '90%');
    });

    //修改-许可证吊销情况
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        
        var deptid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).DEPTID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ems/healthdept/healthdeptEdit.html?deptid="+deptid,
				'修改医疗机构', '60%', '90%');
        
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
        	var deptid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).DEPTID;
        	curSelBadIdArr.push(deptid);
        }
        //执行删除操作
        delBadrecords({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delBadrecords(param) {
        //弹出提示框
        parent.confirm("确认删除该医疗机构?", function () {
            $.ajax({
                url: BASE_URL + "ems/emsreshealthdept/delete",
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
        var deptid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).DEPTID;
        var param = {"deptid":deptid};
        //弹出提示框
        parent.confirm('确认上报吗?',function(){
            $.ajax({ 
                url: BASE_URL+"/ems/emsreshealthdept/report",
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


function pushCom(fillstate,colname,colmodel){
	if(fillstate){
	    //企业
	   colname.push("状态");
       colmodel.push(
    	{
    	   	name:'FILLSTATE',
    	   	index:'FILLSTATE', 
    	   	width:'5%',
    	   	align: "left",
        	sortable: false,
    	   	formatter:function(cellvalue, options, obj) { 
        	   if (obj.FILLSTATE == "1") {
        		   return "已登记";
        	   }else{
        		   return "已上报";
        	   }
			}
        }); 
	}else{
	    //政府
	   colname.push("所属单位");
       colmodel.push({name:'FILLORGANNAME',index:'FILLORGANNAME', width:'5%'}); 
	}
}

/**
 * 详细查看客户信息
 */
function display(deptid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/healthdept/healthdeptDisplay.html?deptid="+deptid,
             "医疗机构详情", "60%", "90%");
}


/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	console.log($("#rescuetypecode").attr("selectvalue"),$("#districtcode").attr("selectvalue"),$("#deptname").val())
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	rescuetypecode:$("#rescuetypecode").attr("selectvalue"),
        	districtcode:$("#districtcode").attr("selectvalue"),
        	deptname:$("#deptname").val()
        }
    }).trigger("reloadGrid");
}
