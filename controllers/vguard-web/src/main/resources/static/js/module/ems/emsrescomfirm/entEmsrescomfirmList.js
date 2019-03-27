$(document).ready(function () {
	/**
	 * 通讯保障列表
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectTree.loadComfirmTypeTree("typecodeid");// 通讯保障节点树
	SelectTree.loadDistrictAllSelect("districtcode");// 行政区域
    //生成任务列表分页表格
	

			var colname = ["主键id","团队名称","应急资源类型","行政区划","主管单位","应急通信车数（辆）", "应急发电车数（辆）","填报状态","操作"],
	        colmodel = [
	            {
	                name: "FIRMID",
	                index: "FIRMID",
	                width: "5%",
	                align: "left",
	                sortable: false,
	                hidden: true
	            },
	            {
	            	name: "FIRMNAME",
	            	index: "FIRMNAME",
	            	width: "10%",
	            	align: "left",
	            	sortable: false,
	            	formatter: function (cellvalue, options, obj) {
	            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.FIRMID + '\')">' + obj.FIRMNAME + '</a>';
	            	}
	            },
	            {
	            	name: "TYPECODENAME",
	            	index: "TYPECODENAME",
	            	width: "10%",
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
	            	width: "10%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name: "COMMVEHNUM",
	            	index: "COMMVEHNUM",
	            	width: "10%",
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name:'POWERVEHNUM',
	            	index:'POWERVEHNUM', 
	            	width:'10%',
	            	align: "left",
	            	sortable: false
	            },
	            {
	            	name:'REPORTSTATE',
					index:'REPORTSTATE', 
					width:'10%',
					align: "left",
	            	sortable: false,
	            	hidden: true,
					formatter:function(cellvalue, options, obj) { 
	                   if(obj.REPORTSTATE == '1'){
	                	   return '未上报';
	                   }else{
	                	   return '已上报';
	                   }
	                }
	             },
         		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
        			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.FIRMID+'\')">编辑</a><br>'
        			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.FIRMID+'\')">删除</a>'
        		}}
	        ];
		
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96 );
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: $(window).width() - 96,
        url: BASE_URL + "ems/emsrescomfirm/list",
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
        caption: "通讯保障列表",
        //autowidth: true
    });

    //查询按钮事件
    $("#searchBtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetBtn").bind("click",function(){
    	$("#districtcode").attr("selectvalue",""),
    	$("#districtname_select").val("");
    	$("#districtcode").val(""),
    	$("#typecodeid").attr("selectvalue",""),
    	$("#typecodeid").val(""),
    	$("#firmname").val("")
    });
    
    //添加
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emsrescomfirm/emsrescomfirmAdd.html?firmid=null",
				'添加通讯保障', '60%', '80%');
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
        
        var firmid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).FIRMID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ems/emsrescomfirm/emsrescomfirmAdd.html?firmid="+firmid,
				'修改通信保障', '60%', '90%');
        
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
        	var firmid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).FIRMID;
        	curSelBadIdArr.push(firmid);
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
        var firmid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).FIRMID;
        var param = {"firmid":firmid};
        //弹出提示框
        parent.confirm('确认上报吗?',function(){
            $.ajax({ 
                url: BASE_URL+"/ems/emsrescomfirm/report",
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

function editInfo(firmid) {
	parent.openWin(BASE_URL
			+ "views/module/ems/emsrescomfirm/emsrescomfirmAdd.html?firmid="+firmid,
			'修改通信保障', '60%', '90%');
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
    parent.confirm("确认删除该通讯保障?", function () {
        $.ajax({
            url: BASE_URL + "ems/emsrescomfirm/delete",
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
 * 查看通讯保障信息
 */
function display(firmid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/emsrescomfirm/emsrescomfirmDisplay.html?firmid="+firmid,
             "通讯保障详情", "60%", "80%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var firmname = $("#firmname").val();
	var typecodeid = $("#typecodeid").attr("selectvalue");
	var districtcode = $("#districtcode").attr("selectvalue");
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	firmname:firmname || "",
        	typecodeid:typecodeid || "",
        	districtcode:districtcode || ""
        }
    }).trigger("reloadGrid");
}
