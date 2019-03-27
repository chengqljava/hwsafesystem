$(function () {
	//获取事故信息id
	var eventid = GetQueryString("eventid");
    //生成资源评估列表分页表格
    var colname = ["场所id","次生事件名称","应急处置"],
        colmodel = [
            {
                name: "proaccid",
                index: "proaccid",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "accidentname",
                index: "accidentname",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "acchandes",
                index: "acchandes",
                width: "10%",
                align: "center",
                sortable: true
            }
           
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - 85;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - 85);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsplaproacc/proacclist",
        datatype: "json",
        cache: false,
        mtype: "GET",
        sortname: "proaccid",
        sortorder: "desc",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"eventid":eventid
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
        }
    });
    
    
});
	
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

