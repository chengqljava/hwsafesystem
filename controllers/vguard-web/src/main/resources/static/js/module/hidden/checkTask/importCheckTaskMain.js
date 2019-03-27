$(document).ready(function () {
	var taskList;
	var checktaskid = GetQueryString("checktaskid");
	$.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidchecktask/tasklist",
        dataType: "json",
        data: {},
        success: function (data) {
           if (data.taskList) {
        	taskList = data.taskList;
           	var enable;
			$.each(data.taskList,function(index,task){
				/*if (task.ISENABLE == 1) {
					enable ="是"
				}else{
					enable ="否"
				}*/
				$("#taskList").append('<tr onclick="getTaskItems(\''+task.CHECKTASKID+'\')">' +
		            '<td style="text-align:center;" title=\''+task.CHECKTASKNAME+'\'>' +
		            	task.CHECKTASKNAME +
		            '</td>' +
		            /*'<td title=\''+enable+'\'>' +
		            enable+
		            '</td>' +
		            '<td title=\''+task.PERIOD+'\'>' +
		            task.PERIOD+
		            '</td>' +*/
		            '</tr>'
		        );
			});
           }
           if (taskList.length > 0) {
        	   //默认显示第一个
        	   loadTaskItemsTab(data.taskList[0].CHECKTASKID);
        	   $("#taskList tr").eq(0).addClass('active');
           }else{
        	   $("#taskList").append("<div style='text-align: center; margin-top: 15px; font-size: 14px; color: red;'>请先添加隐患排查模板！</div>"); 
        	   loadTaskItemsTab('-1');
           }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
	$("#taskList").on('click','tr',function(){
		$("#taskList tr").removeClass('active');
		$(this).addClass('active');
	})
  //查询按钮事件
    $("#searchBtn").off("click").on("click", function () {
        reloadGrid();
    });

    /*重置*/
    $("#resetBtn").off("click").on("click",function(){
    	$("#checkitem").val("");
    });
    $("#taskList").niceScroll({cursorborder:"#4d86d6",cursorcolor:"#4d86d6",cursorwidth: "4px",background: "#c7c7c7",horizrailenabled: false,autohidemode: false}).show().resize();
});

var itemsIdList = [];
window.items = new MapUtil();
/**
 * 刷新表格
 * @param checktaskid
 */
function getTaskItems(checktaskid){
	//先清除当前页面内的所有项id
	var rowIdArray = $("#grid-table").jqGrid('getRowData');
	$.each(rowIdArray,function(i,item){
		if($.inArray(item.CHECKTASKITEMID,itemsIdList) != '-1'){			
			itemsIdList.splice($.inArray(item.CHECKTASKITEMID,itemsIdList),1);
		}
	});

	//新添加勾选的id
	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
	$.each(curSelRowArr,function(i,item){
		var checktaskitem = $("#grid-table").jqGrid("getRowData", item);
		window.items.put(checktaskitem.CHECKTASKITEMID,checktaskitem);
		if($.inArray(checktaskitem.CHECKTASKITEMID,itemsIdList) == '-1'){			
			itemsIdList.push(checktaskitem.CHECKTASKITEMID);
		}
	});
	$("#checkitem").val("");
	reloadItemsGrid(checktaskid);
}
/**
 * 生成任务清单项列表
 */
function loadTaskItemsTab(checktaskid){
	//生成任务列表分页表格
    var colname = ["主键id", "任务id","检查项目","检查内容","检查要求","依据条款","任务名称"],
        colmodel = [
            {
                name: "CHECKTASKITEMID",
                index: "CHECKTASKITEMID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
            	name: "CHECKTASKID",
            	index: "CHECKTASKID",
            	width: "5%",
            	align: "left",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CHECKITEM",
            	index: "CHECKITEM",
            	width: "15%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKCONTENT",
            	index: "CHECKCONTENT",
            	width: "25%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKREQUIRE",
            	index: "CHECKREQUIRE",
            	width: "25%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "FROMWAY",
            	index: "FROMWAY",
            	width: "20%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "CHECKTASKNAME",
            	index: "CHECKTASKNAME",
            	width: "15%",
            	align: "left",
            	sortable: false
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - 264;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - 264 );
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 200 );
    });
    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidchecktaskitem/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"checktaskid":checktaskid
        },
        sortname: "CHECKITEM",
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
        rowList: [100, 200, 300],
        altRows: true,
        multiselect: true,
        caption: "任务排查清单列表",
        autowidth: true,
        loadComplete: function(){   
        	var rowArray = $("#grid-table").jqGrid('getDataIDs');
        	var rowIdArray = $("#grid-table").jqGrid('getRowData');
            for(var i = 0; i < rowArray.length; i++){
            	var rowId = rowIdArray[i].CHECKTASKITEMID
            	if($.inArray(rowId,itemsIdList) != '-1'){        	                	
            		$("#grid-table").setSelection(rowArray[i], true);
                }
        	}
        }
    });
}

/**
 * 保存
 */
function saveTaskItems(){
	var itemsArr = [];
	//先清除当前页面内的所有项id
	var rowIdArray = $("#grid-table").jqGrid('getRowData');
	$.each(rowIdArray,function(i,item){
		if($.inArray(item.CHECKTASKITEMID,itemsIdList) != '-1'){			
			itemsIdList.splice($.inArray(item.CHECKTASKITEMID,itemsIdList),1);
		}
	});

	//新添加勾选的id
	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
	$.each(curSelRowArr,function(i,item){
		var checktaskitem = $("#grid-table").jqGrid("getRowData", item);
		window.items.put(checktaskitem.CHECKTASKITEMID,checktaskitem);
		if($.inArray(checktaskitem.CHECKTASKITEMID,itemsIdList) == '-1'){			
			itemsIdList.push(checktaskitem.CHECKTASKITEMID);
		}
	});
	
	_.map(itemsIdList,function(id){
		if(items.containsKey(id)){
			itemsArr.push(items.get(id));
		}
	});
//	//获取行
//	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
//	if (0 == curSelRowArr.length) {
//        // 弹出提示信息
//        parent.toast("请选择需要导入的检查项！");
//        return;
//    }
//	for (var i = 0; i < curSelRowArr.length; i++) {
//    	var checkitem = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKITEM,
//    	checkcontent = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKCONTENT,
//    	checkrequire = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKREQUIRE,
//    	fromway = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).FROMWAY;
//    	
//    	itemsArr.push({
//			"CHECKITEM":checkitem,
//			"CHECKCONTENT":checkcontent,
//			"CHECKREQUIRE":checkrequire,
//			"FROMWAY":fromway,
//			"NOTE":""
//		});
//    }
	window.top.GEventObject.fireEvent('LOAD_HID_ITEMS',itemsArr);
	parent.closeWin();
}

/**
 * 点击左侧任务栏切换表格
 * @param checktaskid
 */
function reloadItemsGrid(checktaskid){
	$("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checktaskid:checktaskid,
        	checkitem:$("#checkitem").val()
        }
    }).trigger("reloadGrid");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checkitem:$("#checkitem").val()
        }
    }).trigger("reloadGrid");
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}