$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectOption.loadKnoType("geneknotypecode");
    //生成任务列表分页表格
    var colname = ["应急常识id","知识标题",'知识类型',"关键词","创建时间"],
        colmodel = [
            {
                name: "GENEKNOID",
                index: "GENEKNOID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "GENEKNOTITLE",
            	index: "GENEKNOTITLE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.GENEKNOID + '\')">' + obj.GENEKNOTITLE + '</a>';
            	}
            },
            {
            	name: "GENEKNOTYPECODE",
            	index: "GENEKNOTYPECODE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if(cellvalue=="1"){
            			return '地震知识';
            		}else if(cellvalue=="2"){
            			return '海啸知识';
            		}else if(cellvalue=="3"){
            			return '防火知识';
            		}
            	}
            },
//            {
//            	name: "SUMMARY",
//            	index: "SUMMARY",
//            	width: "10%",
//            	align: "center",
//            	sortable: false
//            },
            {
            	name: "KEYWORD",
            	index: "KEYWORD",
            	width: "10%",
            	align: "center",
            	sortable: false
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
        url: BASE_URL + "ems/emsknogenekno/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"geneknotitle": $("#geneknotitle").val(),
        	"geneknotypecode":$("#geneknotypecode").val(),
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
        caption: "应急常识",
        autowidth: true
    });

    //显示新增页面
    $("#addBtn").off("click").on("click",function(){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emsknowledge/knogenekno/knoGeneknoEdit.html?geneknoid=-1",
				'新增应急常识', '50%', '80%');
    });
    
  //点击查询
    $("#searchbtn").off("click").on("click",function(){
    	reloadGrid();
    });
    
    /*重置*/
    $("#resetbtn").bind("click",function(){
    	$("#geneknotitle").val("");
    	$("#geneknotypecode").val("");
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
        var geneknoid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).GENEKNOID;
       
        	parent.openWin(BASE_URL + "views/module/ems/emsknowledge/knogenekno/knoGeneknoEdit.html?geneknoid=" + geneknoid,
        			       "编辑应急常识", "50%", "80%");
      
       
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
        	 var geneknoid = $("#grid-table").jqGrid("getRowData", curSelCaseArr[i]).GENEKNOID;
        	 curSelCaseIdArr.push(geneknoid);
        	
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
                url: BASE_URL + "ems/emsknogenekno/delete",
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
        	geneknotitle: $("#geneknotitle").val(),
        	geneknotypecode:$("#geneknotypecode").val(),
        	keyword:$("#keyword").val()
        }
    }).trigger("reloadGrid");
}


/**
 * 详细查看应急常识信息
 */
function display(geneknoid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/emsknowledge/knogenekno/knoGeneknoDisplay.html?geneknoid="+geneknoid,
             "应急常识详情", "50%", "80%");
}
