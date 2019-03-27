$(document).ready(function () {
	/**
	 * 园区公共设施-垃圾收集
	 */
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["id","设施编号","设施名称","生活垃圾总量预测（吨/日）","是否有垃圾转运站","管理部门","负责人","创建时间"],
        colmodel = [
            {
                name: "cid",
                index: "cid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "collectcode",
            	index: "collectcode",
            	width: "20%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "collectname",
            	index: "collectname",
            	width: "20%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.cid + '\')">' + obj.collectname + '</a>';
            	}
            },
            {
            	name: "totalgarbage",
            	index: "totalgarbage",
            	width: "20%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "garbagestation",
            	index: "garbagestation",
            	width: "20%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if(cellvalue=='0'){
            			return "是";
            		}else if(cellvalue=='1'){
            			return "否";
            		}else{
            			return "";
            		}
            		
            	}
            },
            {
            	name: "managedept",
            	index: "managedept",
            	width: "20%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "leader",
            	index: "leader",
            	width: "20%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "createtime",
            	index: "createtime",
            	width: "20%",
            	align: "center",
            	sortable: false,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.createtime, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "publics/publiccollection/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "createtime",
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
        caption: "垃圾收集设备列表",
        autowidth: true
    });

    //查询按钮事件
    /*$("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });*/

    //重置按钮
//    $("#resetbtn").bind("click", function () {
//        $("#totalgarbage").emty();
//        $("#managedept").emty();
//        $("#leader").emty();
//    });
    $("#addBtn").off("click").on("click", function () {
    	parent.openWin(BASE_URL + "views/module/publics/collection/collectionAdd.html?cid=null",
        		"新增垃圾收集设备", "60%", "60%");
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
        var cid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).cid;
        parent.openWin(BASE_URL + "views/module/publics/collection/collectionAdd.html?cid="+cid,
        		"编辑垃圾收集设备", "60%", "60%");
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
        	var cid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).cid;
        	curSelBadIdArr.push(cid);
        }
        //执行删除操作
        delCollection({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delCollection(param) {
        //弹出提示框
        parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "publics/publiccollection/delete",
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
    
    $("#seachDiv").validate({
		rules: {
			totalgarbage:{
				isNumber: true,
		    	mRessureCheck:true
			}
		},
		messages: {
			totalgarbage:{
				isNumber: "请输入正确的数字格式",
	        	mRessureCheck:"请输入1位整数，至多保留2位小数"
			}
		},
		submitHandler:function(form){
			reloadGrid();
		}   
	});

});

function resetData(){
	$("#managedept").val("");
	$("#leader").val("");
}

function seach(){
	 reloadGrid();
}
/**
 * 查看信息
 */
function display(cid) {
	parent.openWin(BASE_URL + "views/module/publics/collection/collectiondisplay.html?cid="+cid+"&isDisplay=isDisplay",
    		"垃圾收集设备详情", "60%", "60%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	totalgarbage: $("#totalgarbage").val(),
        	managedept: $("#managedept").val(),
        	leader :$("#leader").val()
        }
    }).trigger("reloadGrid");
}