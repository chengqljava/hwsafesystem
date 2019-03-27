$(function () {
	//获取事故信息id
	var eventid = GetQueryString("eventid");
    //生成视频监控列表分页表格
    var colname = ["摄像头id","主机id","经度","纬度","安装地址","编号",'名称',"状态","查看"],
        colmodel = [
            {
                name: "VIDEOID",
                index: "VIDEOID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "VIDEOHOSTID",
                index: "VIDEOHOSTID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
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
            },
            {
                name: "ADDRESS",
                index: "ADDRESS",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "VIDEONUM",
            	index: "VIDEONUM",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "VIDEONAME",
            	index: "VIDEONAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "STATE",
            	index: "STATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if(cellvalue=="1"){
            			return '在线';
            		}else if(cellvalue=="2"){
            			return '离线';
            		}else if(cellvalue=="3"){
            			return '维修';
            		}
            	}
            },
            {
            	name: "UPDATETIME",
            	index: "UPDATETIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
		            return '<a href='+BASE_URL+"/olgis/gispage/addjcjkVideo/" +obj.VIDEOID + "/"+options.rowId+"/"+obj.BUSINESSINFOID+' target="frm"><img  src="'+BASE_URL+'/images/monitor/gis/check.png"/></a>';
//            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.VIDEOID + '\')">视频</a>';
            	}
            }
           
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 120 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 120 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/video/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"eventid":eventid
        },
        sortname: "UPDATETIME",
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
        caption: "视频监控",
        autowidth: true,
        ondblClickRow:function(rowid,iRow,iCol,e){
        	var event = $("#grid-table").jqGrid('getRowData',rowid); //选中的一条记录
        	window.parent.initMapPts(lowerJSONKey(event),"video");
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
