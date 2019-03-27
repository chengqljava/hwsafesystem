$(function () {
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	
    //生成任务列表分页表格
    var colname = ["id","管道名称","管道编号","供水部门","管网敷设方式","水源","管理单位","管理单位电话","创建时间"],
        colmodel = [
            {
                name: "DRINKINGID",
                index: "DRINKINGID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "DRINKCODE",
            	index: "DRINKCODE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "DRINKNAME",
            	index: "DRINKNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.DRINKINGID+'\',\''+$.trim(obj.DRINKNAME)+'\')">'+obj.DRINKNAME+'</a>';
            	}
            },
            {
            	name: "SUPPLYDEPT",
            	index: "SUPPLYDEPT",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "PIPEMETHOD",
            	index: "PIPEMETHOD",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "SOURCEWATER",
            	index: "SOURCEWATER",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "MANAGEMENT",
            	index: "MANAGEMENT",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "TELPHONE",
            	index: "TELPHONE",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "publics/publicdrinkingwater/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {

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
        caption: "饮用用水设备列表",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/publics/publicdrinkingwater/publicdrinkingwaterAdd.html?drinkingid=-1",
				'新增饮用用水', '60%', '57%');
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
    	var drinkingid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).DRINKINGID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/publics/publicdrinkingwater/publicdrinkingwaterAdd.html?drinkingid="+drinkingid,
    			'编辑饮用用水', '60%', '57%');
    });

    //点击查询
    /*$("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });*/
    
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
        	 var drinkingid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).DRINKINGID;
        	 curSelMaintainidArr.push(drinkingid);
        }
        //执行删除操作
        delMaintains({"ids": curSelMaintainidArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delMaintains(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "publics/publicdrinkingwater/delete",
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

   /* $("#resetbtn").off("click").on("click", function() {
    });*/
});

function resetData(){
	$("#supplydept").val("");
	$("#pipemethod").val("");
    $("#sourcewater").val("");
}

function seach(){
	 reloadGrid();
}


/**
 * 详细查看
 */
function display(drinkingid,name) {
	 parent.openWin(BASE_URL + "views/module/publics/publicdrinkingwater/publicdrinkingwaterDisplay.html?drinkingid="+drinkingid,
             name,"60%", "52%");
}

/**
 * 刷新加载
 */
function reloadGrid() {
	var supplydept = $("#supplydept").val();
	var pipemethod = $("#pipemethod").val();
    var sourcewater = $("#sourcewater").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	supplydept:supplydept||"",
        	pipemethod:pipemethod||"",
        	sourcewater:sourcewater||""
        }
    }).trigger("reloadGrid");
}