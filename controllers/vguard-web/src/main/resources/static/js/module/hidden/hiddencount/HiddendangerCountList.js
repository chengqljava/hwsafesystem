	/**
	 * 隐患信息
	 */
$(document).ready(function () {
		var etime = GetQueryString("etime");
		var stime = GetQueryString("stime");
		var hiddendangertype = GetQueryString("hiddendangertype");
		var hiddendangerstate = GetQueryString("hiddendangerstate");
		var entid = GetQueryString("entid");
		
		var colname = ["隐患id","企业名称","隐患编号","隐患名称","隐患内容","发现地点","发现时间","隐患级别","排查方式","隐患来源","隐患状态","状态"],
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
	        	sortable: false,
	            /*formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="displayEnt(\''+obj.ENTID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
	             }*/
	        },
	        {
	            name: "HIDDENDANGERNUM",
	            index: "HIDDENDANGERNUM",
	            width: "15%",
	            align: "center",
	            sortable: false,
	        	/*formatter: function (cellvalue, options, obj) {
	        		return '<a href="javascript:void(0);" onclick="display(\'' + obj.HIDDENDANGERID + '\')">' + obj.HIDDENDANGERNUM + '</a>';
	        	}*/
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
		var tableHeight = $(window).height() - $(".pcheck").height() - 110;
		$(window).resize(function () {
		    $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 110);
		    $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
		});
		
		$("#grid-table").jqGrid({
		    height: tableHeight,
		    url: BASE_URL + "hidden/hidcount/loadHidDangerInfoList",
		    datatype: "json",
		    cache: false,
		    mtype: "POST",
		    colNames: colname,
		    colModel: colmodel,
		    postData: {
		    	etime:etime,
		    	stime:stime,
		    	hiddendangertype:hiddendangertype,
		    	entid:entid,
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
		    multiselect: false,
//		    caption: "隐患信息列表",
		    autowidth: true
		});

});
/**
 * 查看信息
 */
function display(hiddendangerid) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
			"隐患信息详情", "70%", "75%");
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

