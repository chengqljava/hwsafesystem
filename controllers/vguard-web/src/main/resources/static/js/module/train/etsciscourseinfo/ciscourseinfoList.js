$(document).ready(function () {
	initSeachInput();
//综合信息中截止日期
	var etime = GetQueryString("etime");
	/**
	 * 课程管理
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadCourseType("coursetype");//课程类型下拉选	
	
    //生成任务列表分页表格
    var colname = ["主键id","课程名称","课程分类","学习时长（分钟）","创建人", "创建时间","操作"],
        colmodel = [
            {
                name: "COURSEINFOID",
                index: "COURSEINFOID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "COURSENAME",
            	index: "COURSENAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.COURSEINFOID + '\')">' + obj.COURSENAME + '</a>';
            	}
            },
            {
            	name: "COURSETYPE",
            	index: "COURSETYPE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getCourseType(obj.COURSETYPE);
    			}
            },
            {
            	name: "PERIOD",
            	index: "PERIOD",
            	width: "15%",
            	align: "center",
            	sortable: false
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
            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.COURSEINFOID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.COURSEINFOID+'\')">删除</a>'
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
        url: BASE_URL + "train/etsciscourseinfo/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"etime":etime
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
        caption: "课程信息管理",
        //autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });

    //添加课程信息
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/train/etsciscourseinfo/ciscourseinfoAdd.html?courseinfoid=-1",
				'添加课程信息', '55%', '65%');
    });

    //修改课程信息
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var courseinfoid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).COURSEINFOID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/train/etsciscourseinfo/ciscourseinfoAdd.html?courseinfoid="+courseinfoid,
				'修改课程信息', '55%', '65%');
        
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

        var curSelCourseinfoIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var courseinfoid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).COURSEINFOID;
        	curSelCourseinfoIdArr.push(courseinfoid);
        }
        //执行删除操作
        delCourses({"ids": curSelCourseinfoIdArr.toString()});
    });
    
    
});
//编辑
function editInfo(courseinfoid) {
	parent.openWin(BASE_URL
			+ "views/module/train/etsciscourseinfo/ciscourseinfoAdd.html?courseinfoid="+courseinfoid,
			'修改课程信息', '55%', '65%')
}
// 删除
function delInfo(courseinfoid) {
	var param = {"ids":courseinfoid};
	delCourses(param);
}
/**
 * 执行删除操作
 */
function delCourses(param) {
    //弹出提示框
    parent.confirm("确认删除课程信息吗?", function () {
        $.ajax({
            url: BASE_URL + "train/etsciscourseinfo/delete",
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
function resetData(){
    $("#coursename").val("");
    $("#coursetype").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看课程信息
 */
function display(courseinfoid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/train/etsciscourseinfo/ciscourseinfoDisplay.html?courseinfoid="+courseinfoid,
             "课程信息详情", "72%", "60%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var coursename = $("#coursename").val();
	var coursetype = $("#coursetype").val();
	if(coursetype == "初级"){
		coursetype = "01"
	} else if(coursetype == "中级"){
		coursetype = "02"
	} else if(coursetype == "高级"){
		coursetype = "03"
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	coursename:coursename||"",
        	coursetype:coursetype||"",
        	etime:GetQueryString("etime")||""
        }
    }).trigger("reloadGrid");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}