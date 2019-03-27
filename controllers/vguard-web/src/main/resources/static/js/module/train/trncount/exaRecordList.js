$(function () {
	
	initSeachInput();
    //考试记录列表分页表格
    var colname = [
            "考试记录id", "企业名称","考试名称","考试人数", "考试时长（分钟）", "考试地点", "考试时间", "关联培训id","关联培训"
        ],
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
                name: "ENTNAME",
                index: "ENTNAME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "EXAMNAME",
                index: "EXAMNAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RECORDID + '\',\'' + obj.EXAMNAME + '\')">' + obj.EXAMNAME + '</a>';
                }
            },
            {
                name: "EXAMNUM",
                index: "EXAMNUM",
                width: "5%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayTrainUsers(\'' + obj.RECORDID + '\')">' + obj.EXAMNUM + '</a>';
                }

            },
            {
                name: "PERIOD",
                index: "PERIOD",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "EXAMSITE",
                index: "EXAMSITE",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "EXAMTIME",
                index: "EXAMTIME",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.EXAMTIME, "yyyy-MM-dd");
                }
            },
            {
                name: "TRNRECORDID",
                index: "TRNRECORDID",
                width: "12%",
                align: "center",
                sortable: true,
                hidden: true
            },
            {
                name: "TRANINAME",
                index: "TRANINAME",
                width: "12%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                	if(obj.TRANINAME){                		
                		return '<a href="javascript:void(0);" onclick="displayTrn(\'' + obj.TRNRECORDID + '\',\'' + obj.TRANINAME + '\')">' + obj.TRANINAME + '</a>';
                	} else {
                		return ""
                	}
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
        url: BASE_URL + "train/count/loadExamRecoed",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"etime":GetQueryString("etime"),
        	"stime":GetQueryString("stime"),
        	"unitclass":GetQueryString("status")
        },
        sortname: "RECORDID",
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
//        caption: "考试记录表",
        autowidth: true,
        beforeRequest:function(){
       	 if (GetQueryString("status") == '0') {
           	 $("#grid-table").jqGrid("showCol","ENTNAME");
       	}
       }
    });
    
});
//重置
function resetData(){
    $("#examname").val("");
}
//查询
function seach(){
	 reloadGrid();
}

function display(recordid, name) {
    parent.openWin(BASE_URL + "views/module/train/exaRecord/displayExaRecord.html?recordid=" + recordid,
        name, "72%", "80%");
}

function displayTrainUsers(recordid) {
    parent.openWin(BASE_URL + "views/module/train/exaRecord/exaUsersList.html?recordid=" + recordid,
        "考试成绩表", "70%", "70%");
}

//查看培训记录
function displayTrn(trnrecordid,name){
	parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnRecord.html?recordid=" + trnrecordid,
	        name, "72%", "80%");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
/**
 * 刷新加载考试记录分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            examname:  $("#examname").val()
        }
    }).trigger("reloadGrid");
}