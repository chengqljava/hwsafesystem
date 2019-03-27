$(document).ready(function () {
	initSeachInput();
	/**
	 * 课程管理
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadCourseType("coursetype");//课程类型下拉选	

    //生成任务列表分页表格
    var colname = ["主键id","课程名称","课程分类","学时（分钟）","状态", "操作"],
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
            	sortable: false
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
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "STATE",
            	index: "STATE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(obj.STATE == "-1" ){
            			return "未学习";
            		}else if(obj.STATE == "1"){
            			return "学习中";
            		}else {
            			return "学习完成";
            		}
            	}
            },
            {
            	name: "",
            	index: "",
            	width: "80px",
            	align: "left",
            	fixed:true,
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" class="operation studyBtn" onclick="attachList(\'' + obj.COURSEINFOID + '\')">学习</a>';
            	}
            }            
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
        url: BASE_URL + "train/etsciscourseinfo/recordlist",
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
        caption: "课程学习",
        //autowidth: true
    });
    
});

function resetData(){
    $("#coursename").val("");
    $("#coursetype").val("");
}

function seach(){
	 reloadGrid();
}

//打开附件列表
function attachList(COURSEINFOID) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL 
			+ "views/module/train/etsciscourseinfo/courseAttachList.html?courseinfoid="+COURSEINFOID,
            "课程信息详情", "40%", "45%");
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
        	coursetype:coursetype||""
        }
    }).trigger("reloadGrid");
}