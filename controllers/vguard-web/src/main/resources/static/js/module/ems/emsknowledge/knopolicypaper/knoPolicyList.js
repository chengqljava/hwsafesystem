$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["政策文件id","政策名称",'文号',"关键词","密级","创建时间"],
        colmodel = [
            {
                name: "POLICYPAPERID",
                index: "POLICYPAPERID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "POLICYPAPERNAME",
            	index: "POLICYPAPERNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.POLICYPAPERID + '\')">' + obj.POLICYPAPERNAME + '</a>';
            	}
            },
            {
            	name: "FILENO",
            	index: "FILENO",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "KEYWORD",
            	index: "KEYWORD",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "CLASSCODE",
            	index: "CLASSCODE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(cellvalue=="1"){
            			return "绝密";
            		}else if(cellvalue=="2"){
            			return "机密";
            		}else if(cellvalue=="3"){
            			return "秘密";
            		}else if(cellvalue=="4"){
            			return "限制";
            		}else if(cellvalue=="5"){
            			return "公开";
            		}else if(cellvalue=="6"){
            			return "其他";
            		}
            		
            	}
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter:function(cellvalue, options, obj) { 
					if (obj.CREATETIME) {
						return getSmpFormatDateByLong(obj.CREATETIME, false);
					} else {
						return "";
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
        url: BASE_URL + "ems/emsknopolicypaper/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"policypapername": $("#policypapername").val(),
        	"fileno":$("#fileno").val(),
        	"keyword":$("#keyword").val()
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
        caption: "政策文件",
        autowidth: true
    });

    //显示新增页面
    $("#addBtn").off("click").on("click",function(){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emsknowledge/knopolicypaper/knoPolicyEdit.html?policypaperid=-1",
				'新增政策文件', '50%', '80%');
    });
    
  //点击查询
    $("#searchbtn").off("click").on("click",function(){
    	reloadGrid();
    });
    
    /*重置*/
    $("#resetbtn").bind("click",function(){
    	$("#policypapername").val("");
    	$("#fileno").val("");
    	$("#keyword").val("");
    });
    
    //显示编辑页面
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        
        //打开编辑页面
        var policypaperid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).POLICYPAPERID;
       
        	parent.openWin(BASE_URL + "views/module/ems/emsknowledge/knopolicypaper/knoPolicyEdit.html?policypaperid=" + policypaperid,
        			       "编辑政策文件", "50%", "80%");
      
       
    });
    
    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelCaseArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelCaseArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条需要删除的数据！");
            return;
        }
        var curSelCaseIdArr = [];
        for (var i = 0; i < curSelCaseArr.length; i++) {
        	 var policypaperid = $("#grid-table").jqGrid("getRowData", curSelCaseArr[i]).POLICYPAPERID;
        	 curSelCaseIdArr.push(policypaperid);
        	
        }
        //执行删除操作
        delReps({"ids": curSelCaseIdArr.toString()});
        
    });
    
    /**
     * 执行删除操作
     */
    function delReps(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "ems/emsknopolicypaper/delete",
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
	
/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	policypapername: $("#policypapername").val(),
        	fileno:$("#fileno").val(),
        	keyword:$("#keyword").val()
        }
    }).trigger("reloadGrid");
}


/**
 * 详细查看应急常识信息
 */
function display(policypaperid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/emsknowledge/knopolicypaper/knoPolicyDisplay.html?policypaperid="+policypaperid,
             "政策文件详情", "50%", "80%");
}
