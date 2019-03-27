$(function () {
	
	var entid = getQueryString("businessinfoid");
	$("#entid").val(entid);
	var isDisplay = getQueryString("isDisplay");
	if (isDisplay == "display") {
		$("#btnDiv").hide();
	}
    //生成任务列表分页表格
    var colname = ["id","许可证编号","许可证类型","排污口名称","发证机关","发证日期"],
        colmodel = [
            {
                name: "licenceid",
                index: "licenceid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "licencenum",
            	index: "licencenum",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.licenceid+'\')">'+obj.licencenum+'</a>';
            	}
            },
            {
            	name: "licencetype",
            	index: "licencetype",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return SelectOption.getLicenceType(obj.licencetype);
            	}
            },
            {
            	name: "outputname",
            	index: "outputname",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "issueorgan",
            	index: "issueorgan",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "startdate",
            	index: "startdate",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return getFormatDateByLong(cellvalue, "yyyy-MM-dd");
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
        url: BASE_URL + "epi/episewagelicence/list",
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
        caption: "排污许可证信息",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.parent.openWin(BASE_URL
				+ "views/module/epi/episewagelicence/episewagelicenceAdd.html?licenceid=-1&entid="+entid,
				'新增排污许可证信息', '65%', '70%');
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
    	var licenceid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).licenceid;
    	//TODO 弹出编辑框
    	parent.parent.openWin(BASE_URL
    			+ "views/module/epi/episewagelicence/episewagelicenceAdd.html?licenceid="+licenceid+"&entid="+entid,
    			'编辑排污许可证信息', '65%', '70%');
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
        	 var licenceid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).licenceid;
        	 curSelMaintainidArr.push(licenceid);
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
    			url: BASE_URL + "epi/episewagelicence/delete",
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
function display(licenceid) {
	parent.parent.openWin(BASE_URL + "views/module/epi/episewagelicence/episewagelicenceDisplay.html?licenceid="+licenceid+"&isDisplay=isDisplay",
            "排污许可证信息","70%", "65%");
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