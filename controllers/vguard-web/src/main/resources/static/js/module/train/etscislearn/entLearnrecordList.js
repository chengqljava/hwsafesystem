$(document).ready(function () {
	initSeachInput();
	/**
	 * 学习记录
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadCourseType("coursetype");//课程类型下拉选

    //生成任务列表分页表格
    var colname = ["主键id","课程名称","课程分类","学习时长（分钟）","已学时长（分钟）","最后一次学习时间","状态"],
        colmodel = [
            {
                name: "LEARNID",
                index: "LEARNID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
//            {
//            	name: "NICKNAME",
//            	index: "NICKNAME",
//            	width: "15%",
//            	align: "center",
//            	sortable: false
//            },
            {
            	name: "COURSENAME",
            	index: "COURSENAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.LEARNID + '\')">' + obj.COURSENAME + '</a>';
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
            	name: "TIMECOUNT",
            	index: "TIMECOUNT",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "LASTTIME",
            	index: "LASTTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.LASTTIME, "yyyy-MM-dd hh:mm:ss");
        		}
            },
            {
            	name: "TIMECOUNT",
            	index: "TIMECOUNT",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(obj.TIMECOUNT == null){
            			return "未学习";
            		}else if(eval(obj.PERIOD) > eval(obj.TIMECOUNT)){
            			return "学习中";
            		}else {
            			return "学习完成";
            		}
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
        url: BASE_URL + "train/etscislearn/recordlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "LASTTIME",
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
        caption: "课程学习记录",
        //autowidth: true
    });

//    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });
//    
//    /*重置*/
//    $("#resetbtn").bind("click", function () {
////        $("#entid").val(null).trigger("change");
//        $("#searchForm").each(function () {
//            $(this).val("");
//        })
//    });

});

function resetData(){
    $("#coursename").val("");
    $("#coursetype").val("");
}

function seach(){
	 reloadGrid();
}

function display(learnid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/train/etscislearn/cislearnDisplay.html?learnid="+learnid,
            "学习记录详情", "72%", "80%");
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
//        	entid: entid||"",
        	coursename:coursename||"",
        	coursetype:coursetype||""
        }
    }).trigger("reloadGrid");
}