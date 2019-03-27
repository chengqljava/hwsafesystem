$(function () {
	//获取事故信息id
	var eventid = GetQueryString("eventid");
	window.allMultiWinFlagArr = []; //当前所有多窗口弹窗标识数组
    //生成探头列表分页表格
    var colname = ["探头id","主机id","编号",'监测点位名称',"安装地址","经度","纬度","监测时间","监测类型","监测值","气体单位","监测状态","查看"],
        colmodel = [
            {
                name: "PROBEID",
                index: "PROBEID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "PROBEHOSTID",
                index: "PROBEHOSTID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "PROBENUM",
            	index: "PROBENUM",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "PROBENAME",
            	index: "PROBENAME",
            	width: "10%",
            	align: "center",
            	sortable: false
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
            	name: "UPDATETIME",
            	index: "UPDATETIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter:function(cellvalue, options, obj) { 
					if (obj.UPDATETIME) {
						return getFormatDateByLong(obj.UPDATETIME,"yyyy-MM-dd hh:mm:ss");
					} else {
						return "";
					}
				}
            },
            {
            	name: "PROBETYPE",
            	index: "PROBETYPE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "CHROVAL",
            	index: "CHROVAL",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "UNIT",
            	index: "UNIT",
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
            	formatter:function(cellvalue, options, obj) {
					if(100==obj.STATE || obj.STATE==101 || obj.STATE ==102){
						return "<span style='color:red'>"+SelectOption.getProbeState(obj.STATE)+"</span>";
					}else if(3==obj.STATE || 4==obj.STATE || 99==obj.STATE || 7==obj.STATE){
						return "<span style='color:blue'>"+SelectOption.getProbeState(obj.STATE)+"</span>";
					}else{
						return "--";
					}
				}
            },
            {
            	name: "CHECK",
            	index: "CHECK",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.PROBEID + '\',\'' + obj.PROBENAME + '\')"><img  src='+BASE_URL+'/images/monitor/gis/check.png/></a>';
//            		return '<a href='+BASE_URL+"/olgis/gispage/addjcjkDataP/"+obj.PROBEID+"/"+obj.PROBEHOSTID+"/"+obj.BUSINESSINFOID+' target="frm"><img  src='+BASE_URL+'/images/monitor/gis/check.png/></a>';
//			            return '<a onclick="showData(\''+obj.PROBEID+'\')" href="javascript:void(0)"><img  src='+BASE_URL+'/images/monitor/gis/check.png/></a>';
			    }
//            	formatter: function (cellvalue, options, obj) {
//            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.PROBEID + '\')">状图</a>';
//            	}
            }
           
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 122 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 122 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/probe/list",
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
        caption: "周边监测点",
        autowidth: true,
        ondblClickRow:function(rowid,iRow,iCol,e){
        	var event = $("#grid-table").jqGrid('getRowData',rowid); //选中的一条记录
        	window.parent.initMapPts(lowerJSONKey(event),"probe");
        }
    });
    
    //每隔5秒刷新次数据
	var refreshProbeList = setInterval(function (){
		//重新给jqgrid赋值
		$("#grid-table").jqGrid('setGridParam', {
             "eventid" : eventid
         }).trigger("reloadGrid");
	}, 5000);
    
});
	

/**
 * 详细查看探头曲线图
 */
function display(probeid,probename) {
	parent.openWin(BASE_URL + "views/module/ems/map/probe/probeInfoMap.html?probeid="+probeid,
			probename+"的线状图显示", "35%", "50%");
}

/**
 * 左上方应急救援导航子菜单弹窗
 * @param url
 * @param title
 * @param width
 * @param height
 * @param winType
 */
function openEmsResWin(url, title, width, height, winType) {
	if (-1 == _.indexOf(window.allMultiWinFlagArr, winType)) {
		window.allMultiWinFlagArr.push(winType);
		openWinWithCloseCallback(url, title, width, height, true, null, function() {
			window.allMultiWinFlagArr.removeByValue(winType);
		}, true);
	}
}


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