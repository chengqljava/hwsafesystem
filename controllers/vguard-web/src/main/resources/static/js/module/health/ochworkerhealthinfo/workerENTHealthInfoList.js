$(document).ready(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	//加载企业
	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "/health/ochworker/loadWorkerSimpleInfo",'请选择员工',formatRepo,formatRepoSelection);
//	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
    //生成任务列表分页表格
    var colname = ["体检信息id", "工商信息id","员工id","员工姓名", "体检医院","体检时间", "企业名称","操作"],
        colmodel = [
            {
                name: "HEALTHINFOID",
                index: "HEALTHINFOID",
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
            	name: "WORKID",
            	index: "WORKID",
            	width: "5%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "NAME",
            	index: "NAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.HEALTHINFOID + '\')">' + obj.NAME + '</a>';
            	}
            },
            {
            	name: "HEALTHDEPT",
            	index: "HEALTHDEPT",
            	width: "15%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "CHECKTIME",
            	index: "CHECKTIME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.CHECKTIME, "yyyy-MM-dd");
        		}
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.HEALTHINFOID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.HEALTHINFOID+'\')">删除</a>'
    		}}
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96 );
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: $(window).width() - 96,
        url: BASE_URL + "/health/ochhealthinfo/loadPage",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	'type':'ent'
        },
        sortname: "CHECKTIME",
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
        caption: "员工体检信息列表",
        //autowidth: true
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
    	
    	$("#workerid").val("");
    });  
    
    //新增按钮
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/health/ochworkerhealthinfo/editENTHealthInfo.html?healthinfoid=-1&flag=true",
				'添加体检信息', '40%', '45%');
    });
    
    //修改
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var healthinfoid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).HEALTHINFOID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/health/ochworkerhealthinfo/editENTHealthInfo.html?healthinfoid="+healthinfoid+"&flag=true",
				'编辑体检信息', '40%', '45%');
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

        var arr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var healthinfoid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).HEALTHINFOID;
        	arr.push(healthinfoid);
        }
        //执行删除操作
        delBadrecords({"ids": arr.toString()});
    });
    
    
    
});

//编辑
function editInfo(healthinfoid) {
	parent.openWin(BASE_URL
			+ "views/module/health/ochworkerhealthinfo/editENTHealthInfo.html?healthinfoid="+healthinfoid+"&flag=true",
			'编辑体检信息', '40%', '45%');
}
// 删除
function delInfo(healthinfoid) {
	var param = {"ids":healthinfoid};
	delBadrecords(param);
}

/**
 * 执行删除操作
 */
function delBadrecords(param) {
    //弹出提示框
    parent.confirm("确认移除该体检记录?", function () {
        $.ajax({
            url: BASE_URL + "health/ochhealthinfo/delete",
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
/**
 * 详细体检信息
 */
function display(healthinfoid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/health/ochworkerhealthinfo/displayHealthInfo.html?healthinfoid="+healthinfoid +"&flag=false",
             "体检信息详情", '40%', '45%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	workerid:$("#workerid").val(),
        	checktime:$("#checktime").val()
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
	$("#workerid").val(repo.id);
	 return repo.text;
}