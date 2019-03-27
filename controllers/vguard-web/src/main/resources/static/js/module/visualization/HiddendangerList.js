	/**
	 * 隐患信息
	 */
$(document).ready(function () {
		var hiddendangerlevel = GetQueryString("hidlevel");
		var hiddendangerstate = GetQueryString("hidstate");
		var bid = GetQueryString("bid");
		var fid = GetQueryString("fid");
		var hiddendangertype = GetQueryString("hiddendangertype");
		var stime = GetQueryString("stime");
		var etime = GetQueryString("etime");
		var colname = ["隐患id","隐患编号","企业名称","整改项目","检查人员","发现地点","发现时间","隐患级别","隐患类别","隐患状态","状态","操作"],
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
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
                formatter:function(cellvalue, options, obj) { 
                	if (cellvalue) {
                		return '<a href="javascript:void(0);" onclick="displayEnt(\''+obj.ENTID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
					}else {
						return '--';
					}
                 }
            },
            {
            	name: "HIDDENDANGERNAME",
            	index: "HIDDENDANGERNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
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
            	name: "HIDDENDANGERTYPE",
            	index: "HIDDENDANGERTYPE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			if (cellvalue =='1') {
						return '园区隐患';
					}else {
						return '企业隐患';
					}
        		}
            },
            {
            	name: "state",
            	index: "state",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if (obj.HIDDENDANGERSTATE == '0') {
            			return '已处理';
					}else if(obj.HIDDENDANGERSTATE == "2"){
            			return  '待确认';
            		}else if(obj.HIDDENDANGERSTATE == "3"){
            			return '<a style="color: rgba(204,0,0,1);">待整改</a>';
            		} else if(obj.HIDDENDANGERSTATE == "4"){
            			return '<a style="color: rgba(204,153,0,1);">待复查</a>';
            		} else if(obj.HIDDENDANGERSTATE == "5"){
            			return '<a style="color: rgba(255,102,0,1);">待核销</a>';
            		} else if(obj.HIDDENDANGERSTATE == "6"){
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
            },
            {
            	name: "operation",
            	index: "operation",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: false,
            	formatter:function(cellvalue, options, obj){
            		if(obj.HIDDENDANGERSTATE != "2" && obj.HIDDENDANGERSTATE != "0"){
            			return '<a href="javascript:void(0);" onclick="showNotice(\'' + obj.HIDDENDANGERID + /*'\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+*/'\')">查看通知单</a>';
            		}else{
            			return '--';
            		}
            	}
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
		    url: BASE_URL + "hidden/hidcount/getKSHHidDangerInfo",
		    datatype: "json",
		    cache: false,
		    mtype: "POST",
		    colNames: colname,
		    colModel: colmodel,
		    postData: {
		    	hiddendangerlevel:hiddendangerlevel,
		    	hiddendangerstate:hiddendangerstate,
		    	hiddendangertype:hiddendangertype,
		    	stime:stime,
		    	etime:etime
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
	parent.openWin(BASE_URL + "views/module/hkpark_hidden/displayPage/dangerInfoPage.html?hiddendangerid="+hiddendangerid,
            "隐患信息详情", "50%", "80%");
}

function showNotice(hiddendangerid) {
	parent.openWin(BASE_URL + "views/module/hkpark_hidden/displayPage/dangerNotice.html?hiddendangerid="+hiddendangerid,
             "隐患信息详情", "50%", "70%");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

