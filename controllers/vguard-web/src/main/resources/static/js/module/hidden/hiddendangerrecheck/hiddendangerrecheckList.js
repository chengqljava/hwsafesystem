$(document).ready(function () {
	var hiddendangerid = getQueryString("hiddendangerid");
	if (hiddendangerid == "null") {
		hiddendangerid = "-1";
	}
	var hiddendangerstate = getQueryString("hiddendangerstate");
	if(hiddendangerstate != "4"){
		$("#addRecheckBtn").attr("style","display:none");
	}
    var colname = ["复查id","复查人员","复查日期","复查意见","复查状态"],
        colmodel = [
            {
                name: "hiddendangerrecheckid",
                index: "hiddendangerrecheckid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "recheckusers",
            	index: "recheckusers",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="displayRecheck(\'' + obj.hiddendangerrecheckid + '\')">' + obj.recheckusers + '</a>';
            	}
            },
            {
            	name: "rechecktime",
            	index: "rechecktime",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.rechecktime, "yyyy-MM-dd hh:mm:ss");
        		}
            },
            {
            	name: "recheckresult",
            	index: "recheckresult",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "recheckstate",
            	index: "recheckstate",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getReformState(obj.recheckstate);
    			}
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 475 - 33;
    $(window).resize(function () {
        $("#grid-table-recheck").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table-recheck").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table-recheck").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidhiddendangerrecheck/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	hiddendangerid:hiddendangerid
        },
        sortname: "rechecktime",
        sortorder: "desc",
        viewrecords: true,
        pager: "#grid-pager-recheck",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 20,
        rowList: [20, 30, 50],
        altRows: true,
        multiselect: true,
        caption: "隐患复查记录",
        autowidth: true
    });


    //隐患验收
    $("#addRecheckBtn").off("click").on("click", function (){
    	window.top.GEventObject.die('LOAD_HID_RecheckList');
    	window.top.GEventObject.on('LOAD_HID_RecheckList', function(dangerId) {
    		$("#addRecheckBtn").attr("style","display:none");
    		reloadGrid();
    	});
    	parent.openWin(BASE_URL
				+ "views/module/hidden/hiddendangerrecheck/hiddendangerrecheckAdd.html?hiddendangerid="+hiddendangerid,
				'隐患验收', '55%', '70%');
    });
});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
/**
 * 详细查看复查信息
 */
function displayRecheck(hiddendangerrecheckid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/hidden/hiddendangerrecheck/hiddendangerrecheckDisplay.html?hiddendangerrecheckid="+hiddendangerrecheckid,
             "复查信息详情", "65%", "55%");
}

/**
 * 刷新时加载查询条件
 */
function reloadRecheckGrid() {
    $("#grid-table-recheck").jqGrid("setGridParam", {
        page: 1,
        postData: {
        }
    }).trigger("reloadGrid");
}