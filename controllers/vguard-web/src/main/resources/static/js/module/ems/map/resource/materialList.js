$(function () {
	//获取应急仓库id
	var emsdeposid = GetQueryString("emsdeposid");
    //生成资源评估列表分页表格
    var colname = ["应急物资id","物资设备名称","物资设备类别","数量","规格型号","负责人","电话"],
        colmodel = [
            {
                name: "EMSMATERIALID",
                index: "EMSMATERIALID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },           
            {
                name: "MATERIALNAME",
                index: "MATERIALNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "EQUIPTYPEMAXID",
                index: "EQUIPTYPEMAXID",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "NUM",
                index: "NUM",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "MODEL",
                index: "MODEL",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "PRINCIPALONE",
                index: "PRINCIPALONE",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "MOBILEONE",
                index: "MOBILEONE",
                width: "10%",
                align: "center",
                sortable: true
            }         
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - 150 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - 150 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsresmaterial/searchlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"emsdeposid":emsdeposid
        },
        sortname: "FILLTIME",
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
//        multiselect: true,
        caption: "应急物资",
        autowidth: true
    });
    
});
	
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
