$(document).ready(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();

	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);

    //生成任务列表分页表格
    var colname = ["行政处罚id","工商信息id","企业名称","法人名称","组织机构代码","联系方式", "执法单位","处罚日期",
                   "受罚原因","处罚种类","影响扣分","备注"],
        colmodel = [
            {
                name: "SANCTIONID",
                index: "SANCTIONID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "BUSINESSINFOID",
            	index: "BUSINESSINFOID",
            	width: "5%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.SANCTIONID + '\')">' + obj.ENTNAME + '</a>';
            	}
            },
            {
            	name: "LEGALPERSON",
            	index: "LEGALPERSON",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "ENTCODE",
            	index: "ENTCODE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "PHONE",
            	index: "PHONE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ORGNAME",
            	index: "ORGNAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: false          	
            },
            {
            	name: "SANCTIONTIME",
            	index: "SANCTIONTIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter : function(cellvalue, options, obj) {
					if (obj.SANCTIONTIME == null)
						return "-";
					else
						return getSmpFormatDateByLong(
								obj.SANCTIONTIME, "yyyy-MM-dd");
				}
            },
            {
            	name: "SANCTIONREASON",
            	index: "SANCTIONREASON",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "SANCTIONTYPE",
            	index: "SANCTIONTYPE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getPunishType(obj.SANCTIONTYPE);
    			}
            },
            {
            	name: "REDUCE",
            	index: "REDUCE",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "REMARK",
            	index: "REMARK",
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
        url: BASE_URL + "ecs/ecsbadsanction/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {

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
        caption: "行政处罚列表",
        autowidth: true
    });
    
    //新增行政处罚
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/badrecord/badSanction/badsanctionAdd.html?sanctionid=-1",
				'新增行政处罚', '40%', '70%');
    });
    
  //点击查询
    $("#searchbtn").off("click").on("click",function(){
    	reloadGrid();
    });
    
    /*重置*/
    $("#resetbtn").bind("click",function(){
    	var str = $("<span class='select2-selection__placeholder'>请选择名称</span>");
    	$("#belongentselect2").empty();
    	$("#select2-belongentselect2-container").attr("title","");
    	$("#select2-belongentselect2-container").empty();
    	$("#select2-belongentselect2-container").prepend(str);
    	$("#businessinfoid").val("");
    });
    
    //编辑行政处罚
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        
        var sanctionid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).SANCTIONID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ecs/badrecord/badSanction/badsanctionAdd.html?sanctionid="+sanctionid,
				'编辑场行政处罚', '50%', '70%');
        
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

        var curSelSanctionIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var sanctionid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).SANCTIONID;
        	curSelSanctionIdArr.push(sanctionid);
        }
        //执行删除操作
        delSanctions({"ids": curSelSanctionIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delSanctions(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "ecs/ecsbadsanction/delete",
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
 * 详细查看场所环境风险
 */
function display(SANCTIONID) {
	 parent.openWin(BASE_URL + "views/module/ecs/badrecord/badSanction/badsanctionDisplay.html?sanctionid="+SANCTIONID,
             "场所环境风险详情","55%", "75%");
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
	var businessinfoid = $("#businessinfoid").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	businessinfoid:businessinfoid||""
        }
    }).trigger("reloadGrid");
}

function formatRepo(repo){
	if (repo.loading) {
		return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
	
	return markup;
}

function formatRepoSelection(repo){
	$("#businessinfoid").val(repo.id);
	return repo.text;
}