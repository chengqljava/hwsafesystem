$(function () {
	//获取事故信息id
	var eventid = getQueryString("eventid");
    //生成资源评估列表分页表格
    var colname = ["综合预测id","预测标题","生成时间"],
        colmodel = [
            {
                name: "FORECASTID",
                index: "FORECASTID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "FORECASTTITLE",
                index: "FORECASTTITLE",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "CREATEDATE",
                index: "CREATEDATE",
                width: "10%",
                align: "center",
                sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.CREATEDATE, "yyyy-MM-dd hh:mm:ss");
        		}
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
        url: BASE_URL + "ems/emssucigrforecast/historylist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        sortname: "CREATEDATE",
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
        ondblClickRow : function(rowid, iRow, iCol, e) {//双击选择一条历史记录
			var forecast = $("#grid-table").jqGrid('getRowData',rowid); //选中的一条记录
			var forecastid = forecast.FORECASTID;
			var forecasttitle = forecast.FORECASTTITLE;
			var index = parent.getParentIndex();
			parent.frames["layui-layer-iframe"+index].$("#forecastid").val(forecastid);//修改父页面的forecastid
			parent.frames["layui-layer-iframe"+index].$("#forecasttitle").val(forecasttitle);//修改父页面的forecasttitle
			parent.frames["layui-layer-iframe"+index].$("#safeinfomenu li ul li ul li:first a").click();
			loadRoute(forecastid);
		}
    });
    
    
});

function loadRoute(forecastid){
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucigrforecast/getRoute",
		data : {
			"forecastid":forecastid
		},
		dataType: "json",
		success : function(data) {
			if (data.leaveList.length>0) {				
				//撤离路线
				window.parent.initHistoryDriveRoute(data.leaveList,"cllx");				
			}
			if(data.rescueList.length>0){
				//救援路线
				window.parent.initHistoryDriveRoute(data.rescueList,"jylx");
			}
			if (data.roadblockList.length>0 ) {
				//道路封锁
				$.each(data.roadblockList,function(index,obj){
					window.parent.simpleMarker(obj.roadname,obj.roadlon,obj.roadlat);
				});
			}
			if (data.alertzone) {
				//道路封锁
				window.parent.loadWarnArea(data.alertzone.zonearea);
			}
//			parent.closeWin();
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

