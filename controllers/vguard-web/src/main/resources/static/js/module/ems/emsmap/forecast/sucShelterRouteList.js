$(function () {
	//获取事故信息id
	var eventid = GetQueryString("eventid");
	//获取综合评测id
	var forecastid = GetQueryString("forecastid");
    //生成资源评估列表分页表格
    if(forecastid == "0"){   	
    var colname = ["id","撤离路线名称","经度","纬度"];
    	colmodel = [
    	            {
    	            	name: "SHELTERID",
    	            	index: "SHELTERID",
    	            	width: "10%",
    	            	align: "center",
    	            	sortable: false,
    	            	hidden: true
    	            },
    	            {
    	            	name: "SHELTERNAME",
    	            	index: "SHELTERNAME",
    	            	width: "10%",
    	            	align: "center",
    	            	sortable: false,
    	            	formatter:function(cellvalue, options, obj) { 
    	            		if (obj.SHELTERNAME) {
    	            			return cellvalue+"的撤离路线";
    	            		} else {
    	            			return "";
    	            		}
    	            	}
    	            },
		            {
		            	name: "LONGITUDE",
		            	index: "LONGITUDE",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,
		                hidden: true
		            },
		            {
		            	name: "LATITUDE",
		            	index: "LATITUDE",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,
		                hidden: true
		            }    	            
    	];
    	var term = "CREATETIME";
    }else{ 
    var colname = ["id","撤离路线名称","开始经度","开始纬度","结束经度","结束纬度"];
    colmodel = [
    	            {
    	            	name: "ROUTEID",
    	            	index: "ROUTEID",
    	            	width: "10%",
    	            	align: "center",
    	            	sortable: false,
    	            	hidden: true
    	            },
    	            {
    	            	name: "ROUTENAME",
    	            	index: "ROUTENAME",
    	            	width: "10%",
    	            	align: "center",
    	            	sortable: false,
    	            	formatter:function(cellvalue, options, obj) { 
    	            		if (obj.ROUTENAME) {
    	            			return cellvalue;
    	            		} else {
    	            			return "";
    	            		}
    	            	}
    	            },
		            {
		            	name: "STARTLAT",
		            	index: "STARTLAT",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,
		                hidden: true
		            },
		            {
		            	name: "STARTLON",
		            	index: "STARTLON",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,
		                hidden: true
		            },
		            {
		            	name: "ENDLAT",
		            	index: "ENDLAT",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,
		                hidden: true
		            },
		            {
		            	name: "ENDLON",
		            	index: "ENDLON",
		            	width: "10%",
		            	align: "center",
		            	sortable: false,
		                hidden: true
		            }    
    	            ];
    	var term  = "STARTLAT";
    };
  //分页表格响应式处理
    var tableHeight = $(window).height() - 55;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - 55);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });
    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucresourceevaluation/getShelterRouteData",
        datatype: "json",
        cache: false,
        mtype: "GET",
        sortname: term,
        sortorder: "desc",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"eventid":eventid,
        	"forecastid":forecastid,
        	"routetype":"0"
        },
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
        autowidth: true,
        scrollOffset: 2,
        loadComplete: function () {
            tableScrollResize();
        },
        ondblClickRow:function(rowid,iRow,iCol,e){
        	var event = $("#grid-table").jqGrid('getRowData',rowid); //选中的一条记录
        	if(forecastid == "0"){        		
        		window.parent.parent.initSingleDriveRoute(event,"cllx");
        	}else{
        		window.parent.parent.initHistorySingleRoute(event,"cllx");
        	}
        }
    });
    //隐藏掉表头name
    $(".ui-jqgrid-hbox").hide();
    
});
	
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
