var typename;
$(function () {
	var type = getQueryString("type");
	if(type == 1){
		typename = "部门规章制度";
	} else if(type == 2){
		typename = "公司规章制度";
	} else if(type == 3){
		typename = "集团规章制度";
	} else if(type == 4){
		typename = "文书";
	}
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadLoadlevel("loadlevel");
    //生成任务列表分页表格
    var colname = ["id","标题","文号","颁布部门","颁布时间","操作"],
        colmodel = [
            {
                name: "ENTRULEID",
                index: "ENTRULEID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "RULENAME",
            	index: "RULENAME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.ENTRULEID+'\')">'+obj.RULENAME+'</a>';
            	}
            },
            {
            	name: "RULECODE",
            	index: "RULECODE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "RULEISSCY",
            	index: "RULEISSCY",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ISSCYTIME",
            	index: "ISSCYTIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.ISSCYTIME, "yyyy-MM-dd");
            	}
            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.ENTRULEID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.ENTRULEID+'\')">删除</a>'
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
        url: BASE_URL + "knowledge/knoentrule/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	ruletype:type
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
        caption: typename+"列表",
        //autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/knowledge/knoentrule/knoEntRuleAdd.html?entruleid=-1&ruletype="+type,
				'新增'+typename, '60%', '40%');
    });
    
    //编辑
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }         	
    	var entruleid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ENTRULEID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/knowledge/knoentrule/knoEntRuleAdd.html?entruleid="+entruleid,
    			'编辑'+typename, '60%', '40%');
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

        var curSelMaintainidArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	 var entruleid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).ENTRULEID;
        	 curSelMaintainidArr.push(entruleid);
        }
        //执行删除操作
        delMaintains({"ids": curSelMaintainidArr.toString()});
    });
    
    

   /* $("#resetbtn").off("click").on("click", function() {
    });*/
});
//编辑
function editInfo(entruleid) {
	parent.openWin(BASE_URL
			+ "views/module/knowledge/knoentrule/knoEntRuleAdd.html?entruleid="+entruleid,
			'编辑'+typename, '60%', '40%');
}
// 删除
function delInfo(entruleid) {
	var param = {"ids":entruleid};
	delMaintains(param);
}
/**
 * 执行删除操作
 */
function delMaintains(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "knowledge/knoentrule/delete",
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
	$("#rulename").val("");
	$("#rulecode").val("");
	$("#ruleisscy").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看
 */
function display(entruleid) {
	 parent.openWin(BASE_URL + "views/module/knowledge/knoentrule/knoEntRuleDisplay.html?entruleid="+entruleid,
			 typename+"详情","60%", "40%");
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
	var rulename = $("#rulename").val();
	var rulecode = $("#rulecode").val();
	var ruleisscy = $("#ruleisscy").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	rulename:rulename||"",
        	rulecode:rulecode||"",
        	ruleisscy:ruleisscy||""
        }
    }).trigger("reloadGrid");
}