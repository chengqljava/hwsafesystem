$(document).ready(function () {
	/**
	 * 不良记录信息列表
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	//加载企业
//	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "/health/ochworker/loadWorkerSimpleInfo",'请选择员工',formatRepo,formatRepoSelection);
	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
    //生成任务列表分页表格
    var colname = ["体检信息id","工商信息id","员工id", "企业名称","员工姓名", "体检医院","体检时间"],
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
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "15%",
            	align: "center",
            	sortable: false
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
        url: BASE_URL + "/health/ochhealthinfo/loadPage",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
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
});

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
        	businessinfoid:$("#businessinfoid").val(),
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
	$("#businessinfoid").val(repo.id);
	 return repo.text;
}