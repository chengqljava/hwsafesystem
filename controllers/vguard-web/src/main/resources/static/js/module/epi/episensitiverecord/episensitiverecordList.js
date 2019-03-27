$(function () {
	
	var entid = getQueryString("businessinfoid");
	$("#entid").val(entid);
	var isDisplay = getQueryString("isDisplay");
	if (isDisplay == "display") {
		$("#btnDiv").hide();
	}
    //生成任务列表分页表格
    var colname = ["id","类别","敏感目标名称","相对本项目方位","相对本项目距离（米）","影响人口（人）"],
        colmodel = [
            {
                name: "sensitiveid",
                index: "sensitiveid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "type",
            	index: "type",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return SelectOption.getSensitiveType(obj.type);
            	}
            	
            },
            {
            	name: "targetname",
            	index: "targetname",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.sensitiveid+'\',\''+$.trim(obj.targetname)+'\')">'+obj.targetname+'</a>';
            	}
            },
            {
            	name: "position",
            	index: "position",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "distance",
            	index: "distance",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "population",
            	index: "population",
            	width: "10%",
            	align: "center",
            	sortable: true
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
        url: BASE_URL + "epi/episensitiverecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	entid:entid
        },
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
        caption: "环境敏感点记录",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.parent.openWin(BASE_URL
				+ "views/module/epi/episensitiverecord/episensitiverecordAdd.html?sensitiveid=-1&entid="+entid,
				'新增环境敏感点记录', '60%', '45%');
    });
    
    //编辑
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
        	parent.parent.toast("请选择一条数据进行编辑！");
            return;
        }         	
    	var sensitiveid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).sensitiveid;
    	//TODO 弹出编辑框
    	parent.parent.openWin(BASE_URL
    			+ "views/module/epi/episensitiverecord/episensitiverecordAdd.html?sensitiveid="+sensitiveid+"&entid="+entid,
    			'编辑环境敏感点记录', '60%', '45%');
    });
    
    //批量删除任务信息
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
        	parent.parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelMaintainidArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	 var sensitiveid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).sensitiveid;
        	 curSelMaintainidArr.push(sensitiveid);
        }
        //执行删除操作
        delMaintains({"ids": curSelMaintainidArr.toString()});
    });
    /**
     * 执行删除操作
     */
    function delMaintains(param) {
    	//弹出提示框
    	parent.parent.confirm("确认删除吗?", function () {
    		$.ajax({
    			url: BASE_URL + "epi/episensitiverecord/delete",
    			type: "post",
    			dataType: "json",
    			data: param,
    			success: function (json) {
    				if (json.success == true) {
    					parent.parent.toast(json.msg);
                        reloadGrid();// 刷新列表
    				} else {
    					parent.parent.toast(json.msg);
    				}
    			}
    		});
    	});
    }
});

/**
 * 详细查看
 */
function display(sensitiveid,name) {
	parent.parent.openWin(BASE_URL + "views/module/epi/episensitiverecord/episensitiverecordDisplay.html?sensitiveid="+sensitiveid+"&isDisplay=isDisplay",
             name,"65%", "40%");
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 刷新加载
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        }
    }).trigger("reloadGrid");
}