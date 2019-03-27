$(document).ready(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	//加载企业
	SelectTwo.initSelect2($('#businessinfoid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业');

    //生成列表分页表格
    var colname = ["主键id", "工商信息id","企业名称","法人名称","组织机构代码", "日期","不良内容", "影响扣分","备注"],
        colmodel = [
            {
                name: "OTHERID",
                index: "OTHERID",
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
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.OTHERID + '\')">' + obj.ENTNAME + '</a>';
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
            	name: "OTHERTIME",
            	index: "OTHERTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.OTHERTIME, "yyyy-MM-dd");
        		}
            },
            {
            	name: "OTHERCONTENT",
            	index: "OTHERCONTENT",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "REDUCE",
            	index: "REDUCE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },{
            	name: "REMARK",
            	index: "REMARK",
            	width: "10%",
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
        url: BASE_URL + "ecs/ecsbadother/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	businessinfoid: $('#businessinfoid').val()
        },
        sortname: "OTHERTIME",
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
        caption: "其它不良记录",
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").bind("click", function() {
    	reloadGrid();
    });

    //添加-许可证吊销情况
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/badrecord/badOther/badOtherEdit.html?otherid=null",
				'添加-其它不良记录', '50%', '60%');
    });

    //修改-许可证吊销情况
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var otherid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).OTHERID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ecs/badrecord/badOther/badOtherEdit.html?otherid="+otherid,
				'修改-其它不良记录', '50%', '60%');
        
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
        	var otherid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).OTHERID;
        	curSelBadIdArr.push(otherid);
        }
        //执行删除操作
        delBadrecords({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delBadrecords(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "ecs/ecsbadother/delete",
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
        	businessinfoid:$("#businessinfoid").val(),
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

/*重置*/
$("#resetbtn").bind("click",function(){
	//清空选择框
    $("#businessinfoid").empty();
});

/**
 * 详细信息
 */
function display(otherid) {
	parent.openWin(BASE_URL + "views/module/ecs/badrecord/badOther/badOtherDisplay.html?otherid="+otherid,
             "详情-其它不良记录", "50%", "60%");
}