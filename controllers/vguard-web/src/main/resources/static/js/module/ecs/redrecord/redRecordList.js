$(document).ready(function () {
	/**
	 * 不良记录信息列表
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	//加载企业
	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);

    //生成任务列表分页表格
    var colname = ["主键id", "工商信息id","企业名称","法人名称","组织机构代码", "联系方式","加入时间", "加入人员","加入情况说明","备注","状态"],
        colmodel = [
            {
                name: "RECORDID",
                index: "RECORDID",
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
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.RECORDID + '\')">' + obj.ENTNAME + '</a>';
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
            	width: "15%",
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
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd");
        		}
            },
            {
            	name: "NICKNAME",
            	index: "NICKNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },{
            	name: "ADDREASON",
            	index: "ADDREASON",
            	width: "10%",
            	align: "center",
            	sortable: false
            },{
            	name: "REMARK",
            	index: "REMARK",
            	width: "10%",
            	align: "center",
            	sortable: false
            },{
            	name: "ISREMOVE",
            	index: "ISREMOVE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			if (obj.ISREMOVE == "0") {
						return "正常";
					}else if(obj.ISREMOVE == "1"){
						return "已移除";
					}else{
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
        url: BASE_URL + "ecs/ecsredrecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
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
        caption: "红名单记录",
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
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
    //添加-许可证吊销情况
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/redrecord/editRedrevord.html?recordid=null",
				'添加红名单', '50%', '45%');
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
        var isremove = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISREMOVE;
        if (isremove == "已移除") {
        	parent.toast("已移除红名单企业不可再编辑！");
        	return;
		}
        var recordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RECORDID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ecs/redrecord/editRedrevord.html?recordid="+recordid,
				'修改红名单', '50%', '45%');
        
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
        	var recordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).RECORDID;
        	curSelBadIdArr.push(recordid);
        }
        //执行删除操作
        delBadrecords({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delBadrecords(param) {
        //弹出提示框
        parent.confirm("确认移出红名单吗?", function () {
            $.ajax({
                url: BASE_URL + "ecs/ecsredrecord/delete",
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
 * 详细查看客户信息
 */
function display(recordid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ecs/redrecord/displayRedrevord.html?recordid="+recordid,
             "红名单详情", "40%", "78%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	businessinfoid:$("#businessinfoid").val(),
        	isremove:$("#isremove").val()
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