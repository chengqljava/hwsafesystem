$(document).ready(function () {
	/**
	 * 交接班管理
	 */
	
	initSeachInput();
	initDateSeach("dutystart","dutyend");
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadChangeState("changestate");//交接状态下拉选	
	SelectTwo.initSelect2($('#entid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
    //生成任务列表分页表格
    var colname = ["交接班记录id","企业名称","岗位","交班人员","交班时间","接班人员","接班时间","交接状态","接班记录"],
        colmodel = [
            {
                name: "CHANGEID",
                index: "CHANGEID",
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
            	sortable: false
            },
            {
            	name: "POST",
            	index: "POST",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHANGEID + '\')">' + obj.POST + '</a>';
            	}
            },
            {
            	name: "CHANGER",
            	index: "CHANGER",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "DUTYTIME",
            	index: "DUTYTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.DUTYTIME, "yyyy-MM-dd hh:mm:ss");
        		}
            },
            {
            	name: "SUCCESSOR",
            	index: "SUCCESSOR",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "CHANGETIME",
            	index: "CHANGETIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.CHANGETIME, "yyyy-MM-dd hh:mm:ss");
        		}
            },
            {
            	name: "CHANGESTATE",
            	index: "CHANGESTATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getChangeState(obj.CHANGESTATE);
    			}
            },
            {
            	name: "SUCCESSRECORD",
            	index: "SUCCESSRECORD",
            	width: "15%",
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
        url: BASE_URL + "enterprise/enttransfer/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "DUTYTIME",
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
        caption: "交接班管理",
        autowidth: true
    });

    //查询按钮事件
    /*$("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });*/

    //重置按钮
    /*$("#resetbtn").off("click").on("click", function() {
        $('#entid').val(null).trigger('change');
        $("#changestate").attr("selectvalue", "");
    });*/
    
    //交班
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/enterprise/enttransfer/enttransferAdd.html?changeid=-1",
				'交班管理', '50%', '70%');
    });

    //接班
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var changeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHANGEID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/enterprise/enttransfer/enttransferEdit.html?changeid="+changeid,
				'接班管理', '45%', '70%');
        
    });
    
});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#dutystart").val("");
	$("#dutyend").val("");
	$("#entid").val(null).trigger("change");
    $("#changestate").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看课程信息
 */
function display(changeid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/enterprise/enttransfer/enttransferDisplayGov.html?changeid="+changeid,
             "交接班信息详情", "55%", "75%");
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

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var dutystart = $("#dutystart").val();
	var dutyend = $("#dutyend").val();
	var changestate = $("#changestate").val();
	if (dutystart != "") {
		dutystart = dutystart+ " 00:00:01"
	}
	if (dutyend != "") {
		dutyend = dutyend+ " 23:59:59"
	}
	if (changestate == "正常交接") {
		changestate = "0";
	}else if(changestate == "交接异常"){
		changestate = "1";
	}
	var entid = $("#entid").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	dutystart:dutystart ||"",
        	dutyend:dutyend ||"",
        	changestate:changestate ||"",
        	entid:entid ||""
        }
    }).trigger("reloadGrid");
}