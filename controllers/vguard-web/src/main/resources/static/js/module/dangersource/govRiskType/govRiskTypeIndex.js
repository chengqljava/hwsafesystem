$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	
    //维修作业活动列表分页表格
    var colname = [
            "风险类型id", "上级id", "上级名称", "类型名称", "类别编码", "排序", 
            "备注", "所属分类", "所属企业"
        ],
        colmodel = [
            {
                name: "TYPEID",
                index: "TYPEID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "PARENTID",
            	index: "PARENTID",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "PARENTNAME",
            	index: "PARENTNAME",
            	width: "15%",
            	align: "center",
            	sortable: false
            },
            {
                name: "TYPENAME",
                index: "TYPENAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function(cellvalue, options, obj){
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.TYPEID+'\')">'+obj.TYPENAME+'</a>';
            	}
            },
            {
            	name: "TYPECODE",
            	index: "TYPECODE",
            	width: "25%",
            	align: "left",
            	sortable: true,
            	hidden: false,
            	formatter:function(cellvalue, options, obj){
            		if ("1" == cellvalue) {
            			return "维修作业活动";
            		} else if ("2" == cellvalue) {
            			return "设备设施";
            		} else if ("3" == cellvalue) {
            			return "工艺过程";
            		} else if ("4" == cellvalue) {
            			return "操作程序";
            		} else if ("5" == cellvalue) {
            			return "场所环境";
            		} else if ("6" == cellvalue) {
            			return "生产作业活动";
            		}
            	}
            },
            {
            	name: "ORDERNUM",
            	index: "ORDERNUM", 
            	width: "15%",
            	align: "center",
            	sortable: true,
            	hidden: false
            },
            {
            	name: "NOTES",
            	index: "NOTES",
            	width: "15%",
            	align: "center",
            	sortable: true,
                hidden: false
            },
            {
            	name: "BELONGCATE",
            	index: "BELONGCATE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: false,
            	formatter:function(cellvalue, options, obj){
            		if ("1" == cellvalue) {
            			return "危险化学品";
            		} else if ("2" == cellvalue) {
            			return "煤矿/非煤矿山";
            		} else if ("3" == cellvalue) {
            			return "烟花爆竹";
            		} else if ("4" == cellvalue) {
            			return "涉氨企业";
            		} else if ("5" == cellvalue) {
            			return "油气管线";
            		} else if ("6" == cellvalue) {
            			return "电力设施";
            		}else {
            			return "";
            		}
            	}
            },
            {
            	name: "BELONGENTNAME",
            	index: "BELONGENTNAME",
            	width: "15%",
            	align: "left",
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
        url: BASE_URL + "dangersource/dssrsktype/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"belongent": $("#belongent").val(),
        	"tgtPId": $("#typename").attr("selectvalue")
        },
        sortname: "TYPEID",
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
        caption: "风险分类列表",
        autowidth: true
    });
    
    //初始化企业select2
	SelectTwo.initSelect2($("#belongentselect2"), 
						BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", "请选择企业", 
						formatRepo, formatRepoSelection);
//	alert("belongent" + $("#belongent").val());
	
	/**
	 * select2函数回调
	 */
	function formatRepo(repo){
		if (repo.loading) {
		    return repo.text;
		}
		var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
	    return markup;
	}
	function formatRepoSelection(repo){
		$("#belongent").val(repo.id);
		if ("" != repo.id) {
			$("#typenameDiv").empty().html("<input type='text' class='form-control formWidth' id='typename' name='typename'" +
						   		  "selectname='typeid' selectvalue='' readonly placeholder='所属分类' />");
			
			//加载风险类型树
			SelectTree.loadRiskTypeTree("typename", {
				userType: 1,
				srchLvlOne: 1,
				belongent: $("#belongent").val() || ""
			}, "");
//			$("#risktypeDiv").empty();
//			$("#risktypeDiv").html("<select id='risktype' name='risktype' selectvalue='' class='form-control text-center'></select>");
//			//下拉安全风险类型下拉树查询框（只显示一级六大分类）
//			SelectOption.loadRiskTypeSelect("risktype", {"userType": "1", "srchLvlOne": "1", "selectOpt": "1",
//														 "belongent": $("#belongent").val()});
		}
		return repo.text;
	}
	
    //显示执行导出操作
    $("#exportBtn").off("click").on("click",function() {
    	window.location.href = BASE_URL + "dangersource/dssrsktype/export?" +
    						   "belongent=" + $("#belongent").val() + "&tgtPId=" + $("#typename").attr("selectvalue");
    });
    
    //搜索
    $("#searchbtn").off("click").on("click",function(){
    	reloadGrid();
    });
    
    //重置按钮
    $("#resetbtn").off("click").on("click", function() {
    	var str = $("<span class='select2-selection__placeholder'>请选择名称</span>");
    	$("#belongentselect2").val("");
    	$("#select2-belongentselect2-container").attr("title","");
    	$("#select2-belongentselect2-container").prepend(str);
    	$("#select2-belongentselect2-container").empty();
    	$("#belongent").val("");
    	$("#typename").attr("selectvalue", "");
    	$("#typenameDiv").empty().html("<input type='text' class='form-control formWidth' id='typename' name='typename'" +
 		  "selectname='typeid' selectvalue='' readonly placeholder='所属分类' />");
    });
});

function display(typeid){
	parent.openWin(BASE_URL + "views/module/dangersource/govRiskType/govRiskTypeDisplay.html?curSelId=" + typeid,
			"风险类型详情", "50%", "36%");
}
/**
 * 刷新加载生产作业活动分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	"belongent": $("#belongent").val(),
        	"tgtPId": $("#typename").attr("selectvalue")
        }
    }).trigger("reloadGrid");
}