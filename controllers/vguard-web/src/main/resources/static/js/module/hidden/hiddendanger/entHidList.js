	/**
	 * 隐患信息
	 */
$(document).ready(function () {
	var hiddendangerstate = getQueryString("hiddendangerstate");
	//显示操作权限按钮
//	$("#tableOpers").displayOper();
//	SelectOption.loadHiddangerstate("hiddendangerstate");//隐患状态下拉选	
	
    //生成任务列表分页表格
    var colname = ["隐患id","隐患编号","隐患名称","隐患内容","发现地点","发现时间","隐患级别","排查方式","隐患来源","隐患状态","状态"],
        colmodel = [
            {
                name: "HIDDENDANGERID",
                index: "HIDDENDANGERID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "HIDDENDANGERNUM",
                index: "HIDDENDANGERNUM",
                width: "15%",
                align: "center",
                sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.HIDDENDANGERID + '\')">' + obj.HIDDENDANGERNUM + '</a>';
            	}
            },
            {
            	name: "HIDDENDANGERNAME",
            	index: "HIDDENDANGERNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.HIDDENDANGERID + '\')">' + obj.HIDDENDANGERNAME + '</a>';
            	}
            },
            {
            	name: "HIDDENDANGERCONTENT",
            	index: "HIDDENDANGERCONTENT",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "FINDSITE",
            	index: "FINDSITE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "FINDTIME",
            	index: "FINDTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.FINDTIME, "yyyy-MM-dd");
        		}
            },
            {
            	name: "HIDDENDANGERLEVEL",
            	index: "HIDDENDANGERLEVEL",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getDangerlevel(obj.HIDDENDANGERLEVEL);
    			}
            },
            {
            	name: "ISGOV",
            	index: "ISGOV",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		if(obj.ISGOV == "0"){
            			return "企业自查";
            		} else if(obj.ISGOV == "1"){
            			return "政府巡查";
            		}
        		}
            },
            {
            	name: "HIDDENDANGERFROM",
            	index: "HIDDENDANGERFROM",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		return SelectOption.getDangerfrom(cellvalue);
        		}
            },
            {
            	name: "state",
            	index: "state",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(obj.HIDDENDANGERSTATE == "3"){
            			return '<a style="color: rgba(204,0,0,1);">未整改</a>';
            		} else if(obj.HIDDENDANGERSTATE == "4"){
            			return '<a style="color: rgba(204,153,0,1);">未复查</a>';
            		} else if(obj.HIDDENDANGERSTATE == "5"){
            			return '<a style="color: rgba(255,102,0,1);">未核销</a>';
            		} else {
            			return '<a style="color: rgba(51,153,0,1);">已核销</a>';
            		}
    			}
            },
            {
            	name: "HIDDENDANGERSTATE",
            	index: "HIDDENDANGERSTATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: true
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
        url: BASE_URL + "hidden/hidhiddendanger/loadEntDangersList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	hiddendangerstate:hiddendangerstate
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
        caption: "隐患信息列表",
        autowidth: true
    });

});


/**
 * 查看信息
 */
function display(hiddendangerid) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
             "隐患信息详情", "65%", "60%");
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
//	var hiddendangername = $("#hiddendangername").val();
//	var startTime = $("#startTime").val();
//	var endTime = $("#endTime").val();
//	var hiddendangernum = $("#hiddendangernum").val();
//	var hiddendangerlevel = $("#hiddendangerlevel").val();
//	var isgov = $("#isgov").val();
//	if (hiddendangerlevel == "一般隐患") {
//		hiddendangerlevel = '1'
//	}else if(hiddendangerlevel == "重大隐患"){
//		hiddendangerlevel = '2'
//	}
//	var isgov = $("#isgov").val();
//	if (isgov=="企业自查") {
//		isgov = "0"
//	}else if(isgov=="政府巡查"){
//		isgov = "1"
//	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
//        	hiddendangername:hiddendangername ||"",
//        	startTime:startTime ||"",
//        	endTime:endTime ||"",
//        	hiddendangernum:hiddendangernum,
//        	hiddendangerlevel:hiddendangerlevel,
//        	isgov:isgov
        }
    }).trigger("reloadGrid");
}