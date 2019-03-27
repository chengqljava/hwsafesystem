$(document).ready(function () {

    //生成任务列表分页表格
	var colname = ['主键','事故名称','发生时间','发生地址','事故类型','事故等级','事故原因','事故概述','伤亡情况',"经度","维度"]; 
	var colmodel = [{name:'EVENTID',index:'EVENTID',hidden:true},
					{name:'EVENTNAME',index:'EVENTNAME',
            			formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.EVENTID+'\')">'+obj.EVENTNAME+'</a>';
                        }
					},
					{name:'TIME',index:'TIME',
					    formatter:function(cellvalue, options, obj) { 
                            return getSmpFormatDateByLong(obj.TIME,true);
                        }
                    },
					{name:'ADDRESS',index:'ADDRESS'},
					{name:'EVENTTYPENAME',index:'EVENTTYPENAME'},
					{name:'EVENTLEVEL',index:'EVENTLEVEL',
					   formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getAcclevel(obj.EVENTLEVEL);
                        }
					},
					{name:'REASON',index:'REASON',hidden:true},
					{name:'CONTENT',index:'CONTENT',hidden:true},
					{name:'CASUALTY',index:'CASUALTY',hidden:true},
					{name:'LONGITUDE',index:'LONGITUDE',hidden:true},
					{name:'LATITUDE',index:'LATITUDE',hidden:true}
			       ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emssucevent/loadevent",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			name:$("#name").val(),
		},
		sortname : 'TIME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "事故信息列表",
		autowidth: true,
		loadComplete:function(){
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});

    /**
     * 确定
     */
    $("#point").on("click", function() {
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length != 1){
    		// 弹出提示信息
    		parent.toast("请选择一条记录！");
    		return;
    	}
    	var event = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var name =event.EVENTNAME ;
    	event.EVENTNAME = name.substring((name.indexOf(">") + 1),name.lastIndexOf("<"));
//    	alert(event.EVENTNAME);
    	//转换json对象key值大小写
    	var eventData = lowerJSONKey(event);
    	
    	//调用父页面方法标记点位
    	window.parent.initMapPts(eventData,"eventInfo");
    	
    	//获取事故id
    	window.parent.$("#eventid").val(eventData.eventid);
    	
    	//关闭目前GIS首页所有窗口
    	window.parent.closeAllEmsResWin();
//    	parent.closeWin();// 关闭弹出框
    });
    
    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetbtn").bind("click",function(){
    });
    
    //地图定位
//    $("#point").off("click").on("click", function () {
//    	
//    	
//    });
});

/*详细查询*/
function display(eventid){
	parent.openWin(BASE_URL+"/ems/emssucevent/display/"+eventid,'详细','65%','75%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	name:$("#name").val()
        }
    }).trigger("reloadGrid");
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
