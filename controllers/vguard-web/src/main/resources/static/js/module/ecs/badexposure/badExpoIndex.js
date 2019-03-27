$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	
    //维修作业活动列表分页表格
    var colname = [
            "媒体曝光事件id", "工商信息id", "企业名称", "曝光日期", "曝光内容",
            "曝光媒体", "影响扣分", "备注"
        ],
        colmodel = [
              {
                    	name: "EXPOSUREID",
                    	index: "EXPOSUREID",
                    	width: "15%",
                    	align: "center",
                    	sortable: false,
                    	hidden: true
             },
             {
                    	name: "BUSINESSINFOID",
                    	index: "BUSINESSINFOID",
                    	width: "15%",
                    	align: "center",
                    	sortable: false,
                    	hidden: true
            },
			{
				name: "ENTNAME",
				index: "ENTNAME",
				width: "15%",
				align: "center",
				sortable: false,
            	formatter: function(cellvalue, options, obj){
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.EXPOSUREID+'\')">'+ (obj.ENTNAME || "空") +'</a>';
            	}
			},
            {
            	name: "EXPOSURETIME",
            	index: "EXPOSURETIME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj){
            		return getSmpFormatDateByLong(obj.EXPOSURETIME, false);
            	}
            },
            {
            	name: "EXPOSURECONTENT",
            	index: "EXPOSURECONTENT",
            	width: "15%",
            	align: "center",
            	sortable: false
//            	formatter: function(cellvalue, options, obj){
//            		return '<a href="javascript:void(0);" onclick="display(\''+obj.EXPOSUREID+'\')">'+ (obj.EXPOSURECONTENT || "空") +'</a>';
//            	}
            },
            {
            	name: "EXPOSUREMEDIA",
            	index: "EXPOSUREMEDIA",
            	width: "15%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "REDUCE",
            	index: "REDUCE",
            	width: "15%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "REMARK",
            	index: "REMARK",
            	width: "15%",
            	align: "center",
            	sortable: false
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
        url: BASE_URL + "ecs/ecsbadexposure/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"businessinfoid": $("#businessinfoid").val()
        },
        sortname: "EXPOSUREID",
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
        caption: "市级以上媒体曝光列表",
        autowidth: true
    });
    
    //初始化企业select2
    var $idSelect = SelectTwo.initSelect2($('#businessinfoid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",
    				'请选择企业', formatRepo, formatRepoSelection);
	
    /**
	 * select2函数回调
	 */
    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }
        var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

        return markup;
    }
    function formatRepoSelection(repo) {
        return repo.text;
    }
	
	//新增市级以上曝光记录
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin((BASE_URL + "views/module/ecs/badexposure/badExpoEdit.html?saveType=0"),
	    					"新增市级以上曝光记录", "50%", "60%");
    });
    
    //编辑市级以上曝光记录
    $("#editBtn").off("click").on("click", function (){
    	var ids = $("#grid-table").jqGrid("getGridParam", "selarrrow");
    	if (1 != ids.length) {
    		// 弹出提示信息
    		parent.toast("请选择一条记录！");
    		return;
    	}
    	var rowdata = $("#grid-table").jqGrid("getRowData", ids[0]); //选中的一条记录
    	var exposureid = rowdata.EXPOSUREID;
    	
    	parent.openWin((BASE_URL + "views/module/ecs/badexposure/badExpoEdit.html?saveType=1&exposureid=" + exposureid),
				"编辑市级以上曝光记录", "50%", "60%");
    });
    
    //删除市级以上曝光记录
    $("#delBtn").off("click").on("click", function () {
    	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelExpoIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var exposureid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).EXPOSUREID;
        	curSelExpoIdArr.push(exposureid);
        }
    	
    		parent.confirm("确认删除吗?", function() {
    			$.ajax({
    				url: BASE_URL + "ecs/ecsbadexposure/delete",
    				type: "post",
    				dataType: "json",
    				data: {"ids": curSelExpoIdArr.join(",")},
    				success: function (json) {
    					if (json.success == true) {
    						parent.toast(json.msg);
    						reloadGrid();
    					} else {
    						parent.toast(json.msg);
    					}
    				}
    			});
    		});
    });
	
    //显示执行导出操作
    $("#exportBtn").off("click").on("click",function() {
    	window.location.href = BASE_URL + "ecs/ecsbadexposure/export?" +
    						   "businessinfoid=" + $("#businessinfoid").val();
    });
    
    //搜索
    $("#searchbtn").off("click").on("click",function(){
    	reloadGrid();
    });
    
    //重置按钮
    $("#resetbtn").off("click").on("click", function() {
    	$("#businessinfoid").val(null).trigger("change");
    });
});

function display(exposureid) {
	parent.openWin((BASE_URL + "views/module/ecs/badexposure/badExpoDisplay.html?exposureid=" + exposureid),
			"浏览市级以上曝光记录", "50%", "60%");
}
/**
 * 刷新加载生产作业活动分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	"businessinfoid": $("#businessinfoid").val()
        }
    }).trigger("reloadGrid");
}