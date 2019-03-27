$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    SelectTwo.initSelect2($('#businessinfoid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);

    //投诉并立案事件列表分页表格
    var colname = [
            "投诉立案事件id", "企业名称", "事件日期","投诉原因", "影响扣分", "创建人",
            "创建时间","备注"
        ],
        colmodel = [
            {
                name: "CASEID",
                index: "CASEID",
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
                formatter:function(cellvalue, options, obj){
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.CASEID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
            	}
            },
            {
            	name: "CASETIME",
            	index: "CASETIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	hidden: false,
                formatter : function(cellvalue, options, obj) {
                    return getFormatDateByLong(obj.CASETIME, "yyyy-MM-dd");
                }
            	
            },
            {
            	name: "CASEREASON",
            	index: "CASEREASON",
            	width: "25%",
            	align: "left",
            	sortable: true,
            	hidden: false
            	
            },
            {
            	name: "REDUCE",
            	index: "REDUCE",
            	width: "15%",
            	align: "center",
            	sortable: true,
            	hidden: true
            },
            {
            	name: "CREATENAME",
            	index: "CREATENAME",
            	width: "15%",
            	align: "center",
            	sortable: true,
                hidden: false
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: false,
                formatter : function(cellvalue, options, obj) {
                    return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd");
                }
            },
            {
            	name: "REMARK",
            	index: "REMARK",
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
        url: BASE_URL + "ecs/ecsbadcase/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {

        },
        sortname: "CASEID",
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
        caption: "投诉并立案事件",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click",function(){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/badrecord/badCase/saveOrUpdateBadCase.html?caseid=-1",
				'新增投诉并立案事件', '50%', '40%');
    });
    
    
    //点击查询
    $("#searchbtn").off("click").on("click",function(){
    	reloadGrid();
    });
    
  //显示执行导出操作
    $("#exportBtn").off("click").on("click",function(){
    	window.location.href = BASE_URL + "ecs/ecsbadcase/export";
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
        var caseid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CASEID;
       
        	parent.openWin(BASE_URL + "views/module/ecs/badrecord/badCase/saveOrUpdateBadCase.html?caseid=" + caseid,
        			       "编辑投诉立案", "50%", "40%");
      
       
    });


    /*重置*/
    $("#resetbtn").bind("click",function(){
        $("#businessinfoid").val(null).trigger("change");
        $("#searchForm").each(function(){
            $(this).val("");
        })
    });

    
    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelCaseArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelCaseArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelCaseIdArr = [];
        for (var i = 0; i < curSelCaseArr.length; i++) {
        	var caseid = $("#grid-table").jqGrid("getRowData", curSelCaseArr[i]).CASEID;
        	curSelCaseIdArr.push(caseid);
        	
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
                url: BASE_URL + "ecs/ecsbadcase/delete",
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

function display(caseid,name){
	parent.openWin(BASE_URL + "views/module/ecs/badrecord/badCase/displayBadCase.html?caseid=" + caseid,
			name, "50%", "40%");
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}



function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    
    return markup;
}

function formatRepoSelection(repo){
	$("#belongent").val(repo.id);
	return repo.text;
}

/**
 * 刷新加载投诉立案分页表格数据
 */
function reloadGrid() {
    var businessinfoid = $('#businessinfoid').val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            businessinfoid:businessinfoid
        }
    }).trigger("reloadGrid");
}