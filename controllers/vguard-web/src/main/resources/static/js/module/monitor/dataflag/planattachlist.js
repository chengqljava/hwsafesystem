$(document).ready(function () {

    //生成任务列表分页表格
    var colname = ["主键id","平面图名称","附件名称","附件类型","上传时间"],
	colmodel = [
					{
					    name: "PLANID",
					    index: "PLANID",
					    width: "5%",
					    align: "center",
					    sortable: false,
					    hidden: true
					},
		            {
		            	name: "PLANNAME",
		            	index: "PLANNAME",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,	            	
		            },
		            {
		            	name: "ATTACHNAME",
		            	index: "ATTACHNAME",
		            	width: "15%",
		            	align: "center",
		            	sortable: false
		            },
		            {
		            	name: "ATTACHTYPE",
		            	index: "ATTACHTYPE",
		            	width: "10%",
		            	align: "center",
		            	sortable: false
		            },
		            {
		            	name: "UPLOADTIME",
		            	index: "UPLOADTIME",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,
		            	formatter : function(cellvalue, options, obj) {
		        			return getFormatDateByLong(obj.UPLOADTIME, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "enterprise/entplan/attachlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "UPLOADTIME",
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
        caption: "企业平面图",
        autowidth: true
    });

//选择企业平面图
    //修改课程信息
    $("#selEntBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var planid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PLANID;
        $.ajax({
            url: BASE_URL + "enterprise/lkplanbusinessinfoid/saveplan",
            type: "post",
            dataType: "json",
            data: {
            	planid:planid
            },
            success: function (json) {
                if (json.success == true) {
                    parent.toast(json.msg);
    				parent.getActiveIFrame().reloadGrid();//重新加载
    				parent.closeWin();// 关闭弹出框
                } else {
                    parent.toast(json.msg);
                }
            }
        });        
        
    });
    
});


