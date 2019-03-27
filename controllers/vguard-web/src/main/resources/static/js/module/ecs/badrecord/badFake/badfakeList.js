$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();

	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);

    //生成任务列表分页表格
    var colname = ["提供虚假资料事件id","企业名称","法人名称","组织机构代码","联系方式", "日期","事件原因","影响扣分","备注"],
        colmodel = [
            {
                name: "FAKEID",
                index: "FAKEID",
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
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.FAKEID + '\')">' + obj.ENTNAME + '</a>';
            	}
            },
            {
            	name: "LEGALPERSON",
            	index: "LEGALPERSON",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ENTCODE",
            	index: "ENTCODE",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "PHONE",
            	index: "PHONE",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "FAKETIME",
            	index: "FAKETIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter : function(cellvalue, options, obj) {
					if (obj.FAKETIME == null)
						return "-";
					else
						return getSmpFormatDateByLong(
								obj.FAKETIME, "yyyy-MM-dd");
				}
            },
            {
            	name: "REASON",
            	index: "REASON",
            	width: "10%",
            	align: "center",
            	sortable: true
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
        url: BASE_URL + "ecs/ecsbadfake/list",
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
        caption: "提供虚假资料列表",
        autowidth: true
    });
    
    //新增提供虚假资料
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/badrecord/badFake/badfakeAdd.html?fakeid=-1",
				'新增提供虚假资料', '50%', '60%');
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
    
    //编辑提供虚假资料
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        
        var fakeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).FAKEID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ecs/badrecord/badFake/badfakeAdd.html?fakeid="+fakeid,
				'编辑提供虚假资料', '50%', '70%');
        
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

        var curSelFakeIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var fakeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).FAKEID;
        	curSelFakeIdArr.push(fakeid);
        }
        //执行删除操作
        delFakes({"ids": curSelFakeIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delFakes(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "ecs/ecsbadfake/delete",
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
 * 详细查看提供虚假资料
 */
function display(FAKEID) {
	 parent.openWin(BASE_URL + "views/module/ecs/badrecord/badFake/badfakeDisplay.html?fakeid="+FAKEID,
             "提供虚假资料详情","60%", "65%");
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

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	businessinfoid:$("#businessinfoid").val(),
        }
    }).trigger("reloadGrid");
}