$(function () {
	
    //生成任务列表分页表格
    var colname = ["id","城市名称","站点名称","检测时间","总硬度(mg/L)","氨氮(mg/L)","PH","铁(mg/L)","氯化物(mg/L)","硫化物(mg/L)","汞(mg/L)","耗氧量(mg/L)"],
        colmodel = [
            {
                name: "waterid",
                index: "waterid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "city",
            	index: "city",
            	width: "7%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "entname",
            	index: "entname",
            	width: "7%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "monitordate",
            	index: "monitordate",
            	width: "15%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.monitordate, "yyyy-MM-dd hh:mm:ss");
            	}
            },
            {
            	name: "codmic",
            	index: "codmic",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "amnimic",
            	index: "amnimic",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "phosphorus",
            	index: "phosphorus",
            	width: "5%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ammoniamic",
            	index: "ammoniamic",
            	width: "9%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "todmic",
            	index: "todmic",
            	width: "9%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "dissoxy",
            	index: "dissoxy",
            	width: "9%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "turbidity",
            	index: "turbidity",
            	width: "9%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "conductivity",
            	index: "conductivity",
            	width: "9%",
            	align: "center",
            	sortable: true
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
        url: BASE_URL + "epi/epiundergroundwater/list",
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
        caption: "地下水质检测列表",
        autowidth: true
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