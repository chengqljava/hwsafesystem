$(document).ready(function () {
	/**
	 * 通讯录列表
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectTree.loadEntOrgTree("entorgid");
//	SelectTree.loadComfirmTypeTree("typecodeid");// 通讯保障节点树
    //生成任务列表分页表格
			var colname = ["主键id","姓名","性别","职务","手机","固话","所属部门","人员类别","是否开通账号","用户id"],
	        colmodel = [
	            {
	                name: "CONTACTSID",
	                index: "CONTACTSID",
	                width: "5%",
	                align: "center",
	                sortable: false,
	                hidden: true
	            },
	            {
	            	name: "CONTACTSNAME",
	            	index: "CONTACTSNAME",
	            	width: "10%",
	            	align: "center",
	            	sortable: false,
	            	formatter: function (cellvalue, options, obj) {
	            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.CONTACTSID + '\')">' + obj.CONTACTSNAME + '</a>';
	            	}
	            },
	            {
	            	name: "SEX",
	            	index: "SEX",
	            	width: "10%",
	            	align: "center",
	            	sortable: false,
	            	formatter: function (cellvalue, options, obj) {
	            		return SelectOption.getSex(cellvalue);
	            	}
	            },
	            {
	            	name: "POSITION",
	            	index: "POSITION",
	            	width: "10%",
	            	align: "center",
	            	sortable: false
	            },
	            {
	            	name: "MOBILE",
	            	index: "MOBILE",
	            	width: "15%",
	            	align: "center",
	            	sortable: false,
	            },
	            {
	            	name: "TELPHONE",
	            	index: "TELPHONE",
	            	width: "10%",
	            	align: "center",
	            	sortable: false
	            },
	            {
	            	name: "ENTORGNAME",
	            	index: "ENTORGNAME",
	            	width: "10%",
	            	align: "center",
	            	sortable: false
	            },
	            {
	            	name: "CONTACTSTYPE",
	            	index: "CONTACTSTYPE",
	            	width: "10%",
	            	align: "center",
	            	sortable: false,
	            	formatter: function (cellvalue, options, obj) {
	            		return SelectOption.getContactsType(cellvalue);
	            	}
	            },
	            {
	            	name: "createUser",
	            	index: "createUser",
	            	width: "8%",
	            	align: "center",
	            	sortable: false,
	            	formatter: function (cellvalue, options, obj) {
	            		if(obj.USERID != null){
	            			return "已开通"
	            		} else {
	            			return "未开通"
	            		}
	            	}
	            },
	            {
	            	name: "USERID",
	            	index: "USERID",
	            	width: "10%",
	            	align: "center",
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
        url: BASE_URL + "enterprise/entcontacts/list",
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
        caption: "企业员工列表",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchBtn").off("click").on("click", function () {
//        reloadGrid();
//    });
//
//    /*重置*/
//    $("#resetBtn").bind("click",function(){
//    	$("#districtcode").attr("selectvalue",""),
//    	$("#districtname_select").val("");
//    	$("#districtcode").val(""),
//    	$("#typecodeid").attr("selectvalue",""),
//    	$("#typecodeid").val(""),
//    	$("#firmname").val("")
//    });
    
    //添加
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/enterprise/entcontacts/entcontactsAdd.html?contactsid=null",
				'添加企业员工', '40%', '45%');
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
    	var contactsid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CONTACTSID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/enterprise/entcontacts/entcontactsAdd.html?contactsid="+contactsid,
    			'修改企业员工信息', '40%', '45%');
        
    });
 
    //创建用户
    $("#createUse").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var createUser = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).createUser;
        if(createUser == "已开通"){
        	parent.toast("账号已开通！");
            return;
        }
    	var contactsid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CONTACTSID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/enterprise/entcontacts/createUser.html?contactsid="+contactsid,
    			'创建系统登录账号', '55%', '60%');
        
    });
    
    //分配角色
    $("#roleBtn").off("click").on("click", function (){
    	//返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var createUser = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).createUser;
        if(createUser == "未开通"){
        	parent.toast("请先开通系统登录账号！");
            return;
        }
        var userid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).USERID;
        parent.openWin(BASE_URL + "/system/entuser/userRole/" + userid + "/ENT", '分配角色', '55%', "40%");
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
    		var contactsid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).CONTACTSID;
    		curSelBadIdArr.push(contactsid);
        }
        //执行删除操作
        delBadrecords({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delBadrecords(param) {
        //弹出提示框
        parent.confirm("确认删除该员工信息?", function () {
            $.ajax({
                url: BASE_URL + "enterprise/entcontacts/delete",
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
    $("#contactsname").val("");
    $("#planname").val("");
    $("#entorgid").attr("selectvalue",""),
	$("#entorgid").val("")
}

function seach(){
	 reloadGrid();
}

/**
 * 查看通讯录信息
 */
function display(contactsid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/enterprise/entcontacts/entcontactsDisplay.html?contactsid="+contactsid,
             "员工信息详情", "40%", "45%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var contactsname = $("#contactsname").val();
	var entorgid = $("#entorgid").attr("selectvalue");
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	contactsname:contactsname || "",
        	entorgid:entorgid || ""
        }
    }).trigger("reloadGrid");
}
