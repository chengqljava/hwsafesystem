$(document).ready(function () {
	initSeachInput();
	/**
	 * 园区公共设施-蒸汽管理
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["id","管道编号","管道名称","蒸汽源","管道长度（千米）","管理单位","管理单位电话","创建时间"],
        colmodel = [
            {
                name: "steamid",
                index: "steamid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "steamcode",
            	index: "steamcode",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "steamname",
            	index: "steamname",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.steamid + '\')">' + obj.steamname + '</a>';
            	}
            },
            {
            	name: "steamsource",
            	index: "steamsource",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "pipelength",
            	index: "pipelength",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "management",
            	index: "management",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "telphone",
            	index: "telphone",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "createtime",
            	index: "createtime",
            	width: "10%",
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
        url: BASE_URL + "publics/publicsteam/list",
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
        caption: "蒸汽管理列表",
        autowidth: true
    });

    //查询按钮事件
  /*  $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });
*/
    //重置按钮
   /* $("#resetbtn").bind("click", function () {
        $("#steamsource").emty();
        $("#pipelength").emty();
    });*/
    
    $("#addBtn").off("click").on("click", function () {
    	parent.openWin(BASE_URL + "views/module/publics/steam/steamAdd.html?waterid=null",
        		"新增蒸汽管理", "60%", "55%");
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
        var steamid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).steamid;
        parent.openWin(BASE_URL + "views/module/publics/steam/steamAdd.html?steamid="+steamid,
        		"编辑蒸汽管理", "60%", "55%");
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
        	var steamid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).steamid;
        	curSelBadIdArr.push(steamid);
        }
        //执行删除操作
        delSteam({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delSteam(param) {
        //弹出提示框
        parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "publics/publicsteam/delete",
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
			pipelength:{
				isNumber:true,
				wRessureCheck:true
			}
		},
		messages: {
			pipelength:{
				isNumber:"请输入正确的数字格式",
				wRessureCheck:"请输入三位整数，小数点至多保留两位"
			}
		},
		submitHandler:function(form){
			reloadGrid();
		}   
	});
});

function resetData(){
	$("#steamsource").val("");
	$("#pipelength").val("");
}

function seach(){
	 reloadGrid();
}
/**
 * 查看信息
 */
function display(steamid) {
	parent.openWin(BASE_URL + "views/module/publics/steam/steamDisplay.html?steamid="+steamid+"&isDisplay=isDisplay",
    		"蒸汽管理详情", "60%", "48%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	steamsource: $("#steamsource").val(),
        	pipelength: $("#pipelength").val(),
        }
    }).trigger("reloadGrid");
}