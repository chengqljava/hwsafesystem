	/**
	 * 隐患信息处理
	 */
$(document).ready(function () {
	var hiddendangerid = getQueryString("hiddendangerid");
	if (hiddendangerid == "null") {
		hiddendangerid = "-1";
	}
	var hiddendangerstate = getQueryString("hiddendangerstate");
	if(hiddendangerstate != "3"){
		$("#addReformBtn").attr("style","display:none");
	}
    var colname = ["整改id","整改人员","整改完成时间","整改目标","整改措施","整改状态"],
        colmodel = [
            {
                name: "hiddendangerreformid",
                index: "hiddendangerreformid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "reformusers",
            	index: "reformusers",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.hiddendangerreformid + '\')">' + obj.reformusers + '</a>';
            	}
            },
            {
            	name: "endtime",
            	index: "endtime",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.endtime, "yyyy-MM-dd hh:mm:ss");
        		}
            },
            {
            	name: "reformgoal",
            	index: "reformgoal",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "reformway",
            	index: "reformway",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "reformstate",
            	index: "reformstate",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(obj.reformstate == null){
            			return "待复查";
            		}else{
            			return SelectOption.getReformState(obj.reformstate);
            		}
    			}
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 475 - 33;
    $(window).resize(function () {
        $("#grid-table-reform").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table-reform").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table-reform").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidhiddendangerreform/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	hiddendangerid:hiddendangerid
        },
        sortname: "endtime",
        sortorder: "desc",
        viewrecords: true,
        pager: "#grid-pager-reform",
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
        caption: "隐患整改记录",
        autowidth: true
    });

    //隐患整改
    $("#addReformBtn").off("click").on("click", function (){
    	window.top.GEventObject.die('LOAD_HID_ReformList');
    	window.top.GEventObject.on('LOAD_HID_ReformList', function(dangerId) {
    		$("#addReformBtn").attr("style","display:none");
    		reloadReformGrid();
    	});
    	parent.openWin(BASE_URL
				+ "views/module/hidden/hiddendangerReform/hiddendangerreformAdd.html?hiddendangerid="+hiddendangerid,
				'隐患整改', '55%', '70%');
    });
});

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 详细查看整改信息
 */
function display(hiddendangerreformid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/hidden/hiddendangerReform/hiddendangerreformDisplay.html?hiddendangerreformid="+hiddendangerreformid,
             "整改信息详情", "65%", "55%");
}

/**
 * 刷新时加载查询条件
 */
function reloadReformGrid() {
    $("#grid-table-reform").jqGrid("setGridParam", {
        page: 1,
        postData: {
        }
    }).trigger("reloadGrid");
}