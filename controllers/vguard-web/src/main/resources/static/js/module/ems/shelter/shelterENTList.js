$(document).ready(function () {
	/**
	 * 避难场所列表
	 */
	//显示操作权限按钮
	initSeachInput();
	$("#tableOpers").displayOper();
	SelectTree.loadRescueType("rescuetypecode",{"parentcode":"47"});// 避难类型节点树
	SelectTree.loadDistrictAllSelect("districtcode");// 行政区域
    //生成任务列表分页表格
	
	
    var colname = ["主键id","避难场所编号","避难场所名称","防护目标类型","行政区划","主管单位", "级别","投入使用日期","填报状态","操作"],
        colmodel = [
            {
                name: "SHELTERID",
                index: "SHELTERID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
            	name: "SHELTERNUM",
            	index: "SHELTERNUM",
            	width: "20%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "SHELTERNAME",
            	index: "SHELTERNAME",
            	width: "20%",
            	align: "left",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.SHELTERID + '\')">' + obj.SHELTERNAME + '</a>';
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
            	name: "LEVELNAME",
            	index: "LEVELNAME",
            	width: "10%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "INUSEDATE",
            	index: "INUSEDATE",
            	width: "10%",
            	align: "left",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return getFormatDateByLong(obj.INUSEDATE, "yyyy-MM-dd");
            	}
            },
            {
            	name:'FILLSTATE',
				index:'FILLSTATE', 
				width:'10%',
				align: "left",
            	sortable: false,
            	hidden: true,
				formatter:function(cellvalue, options, obj) { 
                   if(obj.FILLSTATE == '1'){
                	   return '已登记';
                   }else{
                	   return '已上报';
                   }
                }
             },
     		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.SHELTERID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.SHELTERID+'\')">删除</a>'
    		}}
         ];
		
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: $(window).width() - 96,
        url: BASE_URL + "ems/emsresshelter/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "INUSEDATE",
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
        caption: "避难场所列表",
        //autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetbtn").bind("click",function(){
    	$("#districtname_select").val("");
    	$("#districtcode").val("");
    	$("#rescuetypecode").val("");
    	$("#rescuetypecode").attr("selectvalue",""),
    	$("#districtcode").attr("selectvalue",""),
    	$("#sheltername").val("")
    });
    
    //添加-避难场所
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ems/shelter/shelterEdit.html?shelterid=null",
				'添加避难场所', '60%', '90%');
    });

    //修改-避难场所
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        
        var shelterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).SHELTERID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ems/shelter/shelterEdit.html?shelterid="+shelterid,
				'修改避难场所', '60%', '90%');
        
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
        	var shelterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).SHELTERID;
        	curSelBadIdArr.push(shelterid);
        }
        //执行删除操作
        delBadrecords({"ids": curSelBadIdArr.toString()});
    });
    
    
    
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
        var shelterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).SHELTERID;
        var param = {"shelterid":shelterid};
        //弹出提示框
        parent.confirm('确认上报吗?',function(){
            $.ajax({ 
                url: BASE_URL+"/ems/emsresshelter/report",
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

function editInfo(shelterid) {
	parent.openWin(BASE_URL
			+ "views/module/ems/shelter/shelterEdit.html?shelterid="+shelterid,
			'修改避难场所', '60%', '90%');
}
function delInfo(id) {
	var param = {"ids":id};
	delBadrecords(param);
}
/**
 * 执行删除操作
 */
function delBadrecords(param) {
    //弹出提示框
    parent.confirm("确认删除该避难场所?", function () {
        $.ajax({
            url: BASE_URL + "ems/emsresshelter/delete",
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
 * 查看避难场所信息
 */
function display(shelterid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/shelter/shelterDisplay.html?shelterid="+shelterid,
             "避难场所详情", "60%", "90%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	rescuetypecode:$("#rescuetypecode").attr("selectvalue"),
        	districtcode:$("#districtcode").attr("selectvalue"),
        	sheltername:$("#sheltername").val()
        }
    }).trigger("reloadGrid");
}
