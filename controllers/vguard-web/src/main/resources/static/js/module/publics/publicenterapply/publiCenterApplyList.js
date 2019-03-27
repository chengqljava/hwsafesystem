	/**
	 * 隐患计划
	 */
$(document).ready(function () {
	
	initSeachInput();
	initDateSeach("begintime","endtime");
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["主键id","申请人","性别","申请日期","身份证号","手机号码","单位名称","状态"],
        colmodel = [
            {
                name: "ENTERID",
                index: "ENTERID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "APPLYUSER",
                index: "APPLYUSER",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.ENTERID + '\',\'' + obj.APPLYUSER + '\')">' + obj.APPLYUSER + '</a>';
                }
            },
            {
            	name: "SEX",
            	index: "SEX",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                    if (cellvalue =="0") {
						return "女"
					}else if(cellvalue =="1"){
						return "男"
					}
                }
            },
            {
                name: "APPLYDATE",
                index: "APPLYDATE",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, 'yyyy-MM-dd');
                }
            },
            {
            	name: "IDCARD",
            	index: "IDCARD",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "TELPHONE",
            	index: "TELPHONE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "UNITNAME",
            	index: "UNITNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "STATUS",
            	index: "STATUS",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                    if (cellvalue =="0") {
						return "已保存"
					}else if(cellvalue =="1"){
						return "已申请"
					}else if(cellvalue =="2"){
						return "已同意"
					}else if(cellvalue =="3"){
						return "不同意"
					}
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
        url: BASE_URL + "publics/publicenterapply/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	isgov:'1'//政府
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
        caption: "入园申请列表",
        autowidth: true
    });
    /**
     * 新增
     */
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/publics/publicenterapply/publiCenterApplyAdd.html?enterid=-1",
				'新增入园申请记录', '53%', '60%');
    });
    
    /**
     * 编辑
     */
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var status = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).STATUS;
        if (status != "已保存") {
        	parent.toast("只能对状态为已保存的数据进行编辑！");
            return;
		}
        //打开编辑页面
        var enterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ENTERID;
        parent.openWin(BASE_URL + "views/module/publics/publicenterapply/publiCenterApplyAdd.html?enterid="+enterid,
            "编辑入园申请记录", '55%', '60%');
    });
    
    /**
     * 申请
     */
    $("#hanBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要申请的数据！");
            return;
        }
        var curSeltaskIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var STATUS = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATUS;
        	if (STATUS != "已保存") {
        		parent.toast("只能对状态为已保存的数据进行申请！");
                return;
			}
        	var enterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).ENTERID;
        	curSeltaskIdArr.push(enterid);
        }
        //执行申请操作
        hanTask({"ids": curSeltaskIdArr.toString()});
    });
    
    /**
     * 审批
     */
    $("#auditBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 ==curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要审批的数据！");
            return;
        }
        var curSeltaskIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var status = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATUS;
        	if (status != "已申请") {
        		 parent.toast("只能对已申请状态数据进行审批！");
                 return;
			}
        	var enterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).ENTERID;
        	curSeltaskIdArr.push(enterid);
        }
        parent.openWin(BASE_URL + "views/module/publics/publicenterapply/auditPubliCenterApply.html?curSeltaskIdArr="+curSeltaskIdArr,
            "入园审批", '50%', '50%');
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
        var curSeltaskIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var status = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATUS;
        	if (status != "已保存") {
        		 parent.toast("只能对状态为已保存的数据进行删除！");
                 return;
			}
        	var enterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).ENTERID;
        	curSeltaskIdArr.push(enterid);
        }
        //执行删除操作
        delCheckTask({"ids": curSeltaskIdArr.toString()});
    });
    
  //导出
    $("#exportBtn").off("click").on("click",function(){
    	window.location.href = BASE_URL+"/publics/publicenterapply/exportExcel";
    });
    
    $("#importBtn").off("click").on("click",function(){
    	 parent.openWin(BASE_URL + "views/module/publics/publicenterapply/importCenterApply.html",
    	            "导入", '35%', '25%');
    });
    
});

/**
 * 执行删除操作
 */
function delCheckTask(param) {
    //弹出提示框
    parent.confirm("确认删除记录吗?", function () {
        $.ajax({
            url: BASE_URL + "publics/publicenterapply/delete",
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
 * 执行申请操作
 */
function hanTask(param) {
    //弹出提示框
    parent.confirm("确认申请记录吗?", function () {
        $.ajax({
            url: BASE_URL + "publics/publicenterapply/han",
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


function resetData(){
    $("#applyuser").val("");
    $("#unitname").val("");
    $("#status").val("");
    $('#daterange-btn span').html(" 日期选择");
	$("#begintime").val("");
	$("#endtime").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 周期计划
 * @param checkplanid
 * @param checkname
 */
function display(enterid, checkname) {
    parent.openWin(BASE_URL + "views/module/publics/publicenterapply/publiCenterApplyDisplay.html?enterid=" + enterid+"&display=display",
    		checkname,  '50%', '60%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var status = $("#status").val();
	if (status == "已保存") {
		status= "0"
	}else if(status == "已申请"){
		status= "1"
	}else if(status == "已同意"){
		status= "2"
	}else if(status == "不同意"){
		status= "3"
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	applyuser:$("#applyuser").val(),
        	status:status,
        	begintime:$("#begintime").val(),
        	endtime:$("#endtime").val(),
        	unitname:$("#unitname").val()
        }
    }).trigger("reloadGrid");
}