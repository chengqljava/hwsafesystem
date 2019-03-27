$(document).ready(function () {
	/**
	 * 交接班管理
	 */
	initSeachInput();
	initDateSeach("dutystart","dutyend");
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadChangeState("changestate");//交接状态下拉选	
	
    //生成任务列表分页表格
    var colname = ["交接班记录id","岗位","交班人员","交班时间","接班人员","接班时间","交接状态","接班记录","操作"],
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
            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="接班" class="operation editInfoBtn" onclick="editInfo(\''+obj.CHANGESTATE+'\',\''+obj.CHANGEID+'\')">接班</a>'
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
        //autowidth: true
    });

    //查询按钮事件
   /* $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
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
        var changestate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHANGESTATE;
        if(changestate != null && changestate != "" &&　changestate　!=　"null"){
        	// 弹出提示信息
            parent.toast("请选择一条未接班数据进行编辑！");
            return;
        }
        var changeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHANGEID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/enterprise/enttransfer/enttransferEdit.html?changeid="+changeid,
				'接班管理', '45%', '70%');
        
    });
    
});
function editInfo(changestate,changeid) {
	if(changestate != null && changestate != "" &&　changestate　!=　"null"){
    	// 弹出提示信息
        parent.toast("请选择一条未接班数据进行编辑！");
        return;
    }
    //TODO 弹出编辑框
    parent.openWin(BASE_URL
			+ "views/module/enterprise/enttransfer/enttransferEdit.html?changeid="+changeid,
			'接班管理', '45%', '70%');
}
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#dutystart").val("");
	$("#dutyend").val("");
//	$("#entid").val(null).trigger("change");
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
	parent.openWin(BASE_URL + "views/module/enterprise/enttransfer/enttransferDisplayEnt.html?changeid="+changeid,
             "交接班信息详情", "55%", "75%");
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
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	dutystart:dutystart ||"",
        	dutyend:dutyend ||"",
        	changestate:changestate ||""
        }
    }).trigger("reloadGrid");
}