$(function () {
	
    //生成任务列表分页表格
    var colname = ["id","城市名称","企业名称","站点名称","运行状态","时间",
                   "折算浓度","标准值","超标倍数",
                   "折算浓度","标准值","超标倍数",
                   "折算浓度","标准值","超标倍数",
                   "氧气(%)"],
        colmodel = [
            {
                name: "smokeid",
                index: "smokeid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "city",
            	index: "city",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "entname",
            	index: "entname",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "sitename",
            	index: "sitename",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "sitestate",
            	index: "sitestate",
            	width: "8%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		if (cellvalue == "1") {
            			return "正常";
					}else{
						return "停产";
					}  
            	}
            },{
            	name: "monitordate",
            	index: "monitordate",
            	width: "14%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.monitordate, "yyyy-MM-dd hh:mm:ss");
            	}
            },
            {
            	name: "sulfurdiomic",
            	index: "sulfurdiomic",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "sulfurdionormmic",
            	index: "sulfurdionormmic",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "sulfurdiomultiple",
            	index: "sulfurdiomultiple",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ammoxidamic",
            	index: "ammoxidamic",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ammoxidanormmic",
            	index: "ammoxidanormmic",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ammoxidamultiple",
            	index: "ammoxidamultiple",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "smokemic",
            	index: "smokemic",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "smokenormmic",
            	index: "smokenormmic",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "smokemultiple",
            	index: "smokemultiple",
            	width: "8%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "oxygen",
            	index: "oxygen",
            	width: "8%",
            	align: "center",
            	sortable: true
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190);
        $("#grid-table").jqGrid("setGridWidth", $(window).width()*0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "epi/epismokeanalyze/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {

        },
        sortname: "monitordate",
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
        caption: "烟气在线分析列表",
        autowidth: true
    });
    $("#grid-table" ).jqGrid( 'setGroupHeaders' , {
		useColSpanStyle : true , // 没有表头的列是否与表头列位置的空单元格合并
		groupHeaders : [
		    {startColumnName: 'sulfurdiomic', numberOfColumns: 3, titleText: '<font color="#015293">二氧化硫.(mg/M3)</font>'},
		    {startColumnName: 'ammoxidamic', numberOfColumns: 3, titleText: '<font color="#015293">氮氧化物.(mg/M3)</font>'},
		    {startColumnName: 'smokemic', numberOfColumns: 3, titleText: '<font color="#015293">烟尘(mg/M3)</font>'}
		]
    });
   
    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    $("#resetbtn").off("click").on("click", function() {
    });
});


/**
 * 刷新加载
 */
function reloadGrid() {
	var entname = $("#entname").val();
	var monitordate = $("#monitordate").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	entname:entname||"",
        	monitordate:monitordate||""
        }
    }).trigger("reloadGrid");
}