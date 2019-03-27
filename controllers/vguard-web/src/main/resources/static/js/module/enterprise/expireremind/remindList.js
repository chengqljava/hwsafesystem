$(document).ready(function () {
	/**
	 * 证书到期
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectTwo.initSelect2($('#entid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
    //生成任务列表分页表格
    var colname = ["id","企业id","证书类型","企业名称","证书编号","发证机关","发证时间","到期时间"],
        colmodel = [
            {
                name: "ID",
                index: "ID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "ENTID",
            	index: "ENTID",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "NAME",
            	index: "NAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "CODE",
            	index: "CODE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ORG",
            	index: "ORG",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "OPENDATE",
            	index: "OPENDATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.OPENDATE, "yyyy-MM-dd");
        		}
            },
            {
            	name: "EXPIRYDATE",
            	index: "EXPIRYDATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.EXPIRYDATE, "yyyy-MM-dd");
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
        url: BASE_URL + "enterprise/entpermitphoto/remindList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "EXPIRYDATE",
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
        caption: "证书到期列表",
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //重置按钮
    $("#resetbtn").off("click").on("click", function() {
        $('#entid').val(null).trigger('change');
    });
      
});
/**
 * 详细查看
 */
//function display(changeid) {
//	 //返回当前grid中复选框所选择的数据的id
//	parent.openWin(BASE_URL + "views/module/enterprise/enttransfer/enttransferDisplayGov.html?changeid="+changeid,
//             "证书信息详情", "50%", "75%");
//}

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

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var entid = $("#entid").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	entid:entid ||""
        }
    }).trigger("reloadGrid");
}