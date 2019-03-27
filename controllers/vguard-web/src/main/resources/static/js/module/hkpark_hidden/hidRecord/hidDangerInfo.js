$(document).ready(function () {
	var flag = GetQueryString("flag");
	var titlename;
	var hiddendangerstate;
	if (flag == "YHLB") {
		titlename="隐患列表";
	}else{
		titlename="未整改隐患列表";
		hiddendangerstate = "3";
	}
	var checkrecordid = GetQueryString("checkrecordid");
    //生成任务列表分页表格
	 //生成任务列表分页表格
    var colname = ["隐患id","隐患编号","整改项目","检查人员","发现地点","发现时间","隐患级别","隐患状态"],
        colmodel = [
            {
                name: "hiddendangerid",
                index: "hiddendangerid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "hiddendangernum",
            	index: "hiddendangernum",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.hiddendangerid + '\')">' + cellvalue + '</a>';
            	}
            },
            {
            	name: "hiddendangername",
            	index: "hiddendangername",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	/*formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.hiddendangerid + '\')">' + obj.hiddendangername + '</a>';
            	}*/
            },
            {
            	name: "checkperson",
            	index: "checkperson",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "findsite",
            	index: "findsite",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "findtime",
            	index: "findtime",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(cellvalue, "yyyy-MM-dd");
        		}
            },
            {
            	name: "hiddendangerlevel",
            	index: "hiddendangerlevel",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getDangerlevel(obj.hiddendangerlevel);
    			}
            },
            {
            	name: "hiddendangerstate",
            	index: "hiddendangerstate",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getHiddangerstate(obj.hiddendangerstate);
    			}
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 235;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 235);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidhiddendanger/loadByRecordId",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"id":checkrecordid,
        	"hiddendangerstate":hiddendangerstate
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
        caption: titlename,
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetbtn").bind("click",function(){
    	
    });
});

function display(hiddendangerid) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
             "隐患信息详情", "70%", "75%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	hiddendangername:$("#hiddendangername").val()/*,
        	startTime:$("#startTime").val(),
        	endTime:$("#endTime").val()*/
        }
    }).trigger("reloadGrid");
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}