	/**
	 * 隐患信息
	 */
$(document).ready(function () {

	var etime = GetQueryString("etime");
	var stime = GetQueryString("stime");
	var reformstate = GetQueryString("reformstate");
	var isgov = GetQueryString("isgov");
	if (isgov =='0') {
		var hiddendangertype = "2";//企业
	}else{
		var hiddendangertype = "1";//园区
		$("#entdiv").css('display','none');
	}
	SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);	
    //生成任务列表分页表格
    var colname = ["隐患id","企业名称","整改项目","检查人员","发现地点","发现时间","隐患级别","隐患状态"],
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
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
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
            	name: "CHECKPERSON",
            	index: "CHECKPERSON",
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
            	name: "HIDDENDANGERSTATE",
            	index: "HIDDENDANGERSTATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getHiddangerstate(obj.HIDDENDANGERSTATE);
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
        url: BASE_URL + "hidden/hidcount/dangerlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	etime:etime,
        	stime:stime,
        	state:reformstate,
        	isgov:isgov,
        	hiddendangertype:hiddendangertype
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
        autowidth: true,
        loadComplete:function(){
        	 if (hiddendangertype == "1") {
        	    	$("#grid-table").setGridParam().hideCol("ENTNAME");
        		}else{
        			$("#grid-table").setGridParam().showCol("ENTNAME"); 
        		}
        	 $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
        }
    });
   
    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //整改
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
    	var hiddendangerstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).HIDDENDANGERSTATE;
    	if(hiddendangerstate == "3"){
            //打开页面
            var hiddendangerid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).HIDDENDANGERID;
            parent.openWin(BASE_URL + "views/module/hidden/checkRecord/saveOrUpdateCheckRecord.html?hiddendangerid=" + hiddendangerid,
            		"隐患整改", "65%", "80%");
    	} else {
    		parent.toast("请选择待整改的数据！");
            return;
    	}
    });	
    
    //复查
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
    	var hiddendangerstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).HIDDENDANGERSTATE;
    	if(hiddendangerstate == "4"){
            //打开页面
            var hiddendangerid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).HIDDENDANGERID;
            
            parent.openWin(BASE_URL + "views/module/hidden/checkRecord/saveOrUpdateCheckRecord.html?hiddendangerid=" + hiddendangerid,
            		"隐患复查", "65%", "80%");
    	} else {
    		parent.toast("请选择未复查的数据！");
            return;
    	}
    });	
    
    //核销
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
    	var hiddendangerstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).HIDDENDANGERSTATE;
    	if(hiddendangerstate == "6"){
            //打开页面
            var hiddendangerid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).HIDDENDANGERID;
            
            parent.openWin(BASE_URL + "views/module/hidden/checkRecord/saveOrUpdateCheckRecord.html?hiddendangerid=" + hiddendangerid,
            		"隐患核销", "65%", "80%");
    	}else {
    		parent.toast("请选择未核销的数据！");
            return;
    	}
    });	
    
    /*重置*/
    $("#resetbtn").bind("click", function () {
        $("#entid").val(null).trigger("change");
    });
});
/**
 * 查看信息
 */
function display(hiddendangerid) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
             "隐患信息详情", "70%", "75%");
}


function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#entid").val(repo.id);
    return repo.text;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var entid = $('#entid').val();
	var hiddendangername = $("#hiddendangername").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	entid: entid || '',
        	hiddendangername:hiddendangername ||"",
        	startTime:startTime ||"",
        	endTime:endTime ||""
        }
    }).trigger("reloadGrid");
}