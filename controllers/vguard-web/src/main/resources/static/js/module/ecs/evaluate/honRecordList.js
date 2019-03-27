$(document).ready(function () {
	/**
	 * 不良记录信息列表
	 */
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	//加载企业
	SelectTwo.initSelect2($('#entid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);

    //生成任务列表分页表格
    var colname = ["主键id", "工商信息id","企业名称","评价得分","评价周期", "打分人员","打分时间","备注"],
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
            	name: "SCORE",
            	index: "SCORE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "NOTICETIME",
            	index: "NOTICETIME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	/*formatter: function (cellvalue, options, obj) {
            		obj.NOTICETIME.
            		return 
            	}*/
            },
            {
            	name: "NICKNAME",
            	index: "NICKNAME",
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
        url: BASE_URL + "ecs/ecshonrecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "CREATETIME",
        sortorder: "asc",
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
        multiselect: false,
        caption: "企业诚信评价信息表",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });

    /*重置*/
//    $("#resetbtn").bind("click",function(){
//    	var str = $("<span class='select2-selection__placeholder'>请选择名称</span>");
//    	$("#belongentselect2").empty();
//    	$("#select2-belongentselect2-container").attr("title","");
//    	$("#select2-belongentselect2-container").empty();
//    	$("#select2-belongentselect2-container").prepend(str);
//    	$("#businessinfoid").val("");
//    });
    
    //详情评价
    $("#addHon").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/evaluate/addHonRecord.html?",
				'新增诚信评价', '50%', '50%');
    });
    
   
});

function resetData(){
	$("#entid").val(null).trigger("change");
    $("#noticetime").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看客户信息
 */
function display(recordid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ecs/evaluate/displayHonRecord.html?recordid="+recordid,
             "诚信评价详情", "50%", "50%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	businessinfoid:$("#entid").val(),
        	noticetime:$("#noticetime").val()
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
	$("#entid").val(repo.id);
	 return repo.text;
}