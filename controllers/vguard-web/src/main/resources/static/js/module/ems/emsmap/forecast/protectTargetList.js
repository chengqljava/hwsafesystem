$(function () {
	//获取保护场所类型
	var type = GetQueryString("type");
	var placeIds = GetQueryString("placeIds");
	//获取事故信息id
	var eventid = GetQueryString("eventid");
    //生成资源评估列表分页表格
    var colname = ["场所id","场所名称","人口数","电话","经度","纬度"],
        colmodel = [
            {
                name: "PLACEID",
                index: "PLACEID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "NAME",
                index: "NAME",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "POPULATION",
                index: "POPULATION",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
            	name: "TEL",
            	index: "TEL",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "LONGITUDE",
            	index: "LONGITUDE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "LATITUDE",
            	index: "LATITUDE",
            	width: "10%",
            	align: "center",
            	sortable: false
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
        url: BASE_URL + "ems/emssucplace/list",
        datatype: "json",
        cache: false,
        mtype: "GET",
        sortname: "POPULATION",
        sortorder: "desc",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"type":type,
        	"placeIds":placeIds
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

/**
 * 将json数据的key值转换为小写
 * @param jsonObj
 * @returns
 */
function lowerJSONKey(jsonObj){  
    for (var key in jsonObj){  
        jsonObj[key.toLowerCase()] = jsonObj[key];  
        delete(jsonObj[key]);  
    }  
    return jsonObj;  
} 
