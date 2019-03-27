//获取事故信息id
var eventid = GetQueryString("eventid");
$(function () {
    //生成资源评估列表分页表格
    var colname = ["资源评估id","创建时间","创建人","分析半径","查看","删除"],
        colmodel = [
            {
                name: "EVALUATIONID",
                index: "EVALUATIONID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "CREATETIME",
                index: "CREATETIME",
                width: "10%",
                align: "center",
                sortable: true,
                formatter:function(cellvalue,options,obj){
                	if(obj.CREATETIME){
                		return getFormatDateByLong(obj.CREATETIME,"yyyy-MM-dd hh:mm:ss");
                	}else{
                		return "";
                	}
                }
            },
            {
                name: "NICKNAME",
                index: "NICKNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "RADIUS",
                index: "RADIUS",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
            	name: "VIEW",
            	index: "VIEW",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.EVALUATIONID +'\',\''+obj.RADIUS+ '\')">显示</a>';
//		            return '<a href='+BASE_URL+"/olgis/gispage/addjcjkVideo/" +obj.VIDEOID + "/"+options.rowId+"/"+obj.BUSINESSINFOID+' target="frm">查看</a>';
            	},
                hidden: true
            },
            {
            	name: "DELETE",
            	index: "DELETE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="del(\'' + obj.EVALUATIONID + '\')">删除</a>';
//		            return '<a href='+BASE_URL+"/olgis/gispage/addjcjkVideo/" +obj.VIDEOID + "/"+options.rowId+"/"+obj.BUSINESSINFOID+' target="frm">删除</a>';
            	},
            	hidden: true
            }
           
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 160 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", 150);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 40);
    });

    $("#grid-table").jqGrid({
        height: "100px",
        url: BASE_URL + "ems/resource/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"eventid":eventid
        },
        sortname: "CREATETIME",
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
//        caption: "资源评估历史记录",
        autowidth: true,
        scrollOffset: 2,
        loadComplete: function() {
			$("#grid-table").jqGrid( 'setGridHeight', 150);
			$("#grid-table").jqGrid("setGridWidth", $(window).width() - 40);
			autoHeight();
			tableScrollResize();
		},
        ondblClickRow:function(rowid,iRow,iCol,e){
        	var event = $("#grid-table").jqGrid('getRowData',rowid); //选中的一条记录
        	var evaluationid = event.EVALUATIONID;
        	var radius = event.RADIUS;
        	histroyDis(evaluationid,radius);
        	tableScrollResize();
        }
    });
    
    //显示新增资源分析
    $("#addAnalysis").off("click").on("click",function(){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emsmap/resource/resourceAnalysisInfo.html?evaluationid=-1&eventid="+eventid,
				'新增资源评估', '600px', '328px','','0');
    });
    
});
// 新增点击事件
$('#resAnaAdd').on('click',function(){
	$('#save').hide();
	$('#analys').show();
	$('#radius').val('5');
//	$("#infos").addClass('singleArea');
	$("#zypgAdd").removeClass('singleArea');
	$('#zypgHistry').addClass('singleArea');
	tableScrollResize();
})
// 新增资源评估和评估历史点击事件
//$('.zypgTabs').on('click','li',function(){
//	var $id = $(this).data('kind');
//	$("#infos").addClass('singleArea');
//	$("#zypgAdd").addClass('singleArea');
//	$('#zypgHistry').addClass('singleArea');
//	$('.zypgSinTab').removeClass('nextBtn');
//	$(this).addClass('nextBtn');
//	if($id == 'zypgHistry'){
//		$('#zypgHistry').removeClass('singleArea');
//		$("#grid-table").trigger("reloadGrid");// 刷新列表
//		autoHeight();
//		return 0;
//	}else{
//		if ($("#flag").val() == "1") {
//			$("#zypgAdd").removeClass('singleArea');
//			autoHeight();
//			return 0;
//		}else{
//			$("#infos").removeClass('singleArea');
//			autoHeight();
//			return 0;
//		}
//	};
//	
//})

//类型选中不选中
$('.content').on('click','span',function(){
	$(this).toggleClass('selected');
	var evaluationid = $("#evaluationid").val();
	if(evaluationid != null && evaluationid!=''){		
		loadHisResource(evaluationid);
	} 
//	else {		
//		loadAnalysis();
//	}
})

//分析界面的返回按钮

$('#backBtn').click(function(){
//	$('#save').hide();
//	$("#infos").addClass('singleArea');
	$("#zypgAdd").addClass('singleArea');
	$('#zypgHistry').removeClass('singleArea');
	$("#histroyInfos").addClass('singleArea');
	$("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	"eventid":eventid
        }
    }).trigger("reloadGrid");
//	$("#infos").empty();
	$("#histroyRes").empty(); 
	$("#evaluationid").val("");
	$("#histroynbsp").hide();
	$("#newResnbsp").hide();
    window.parent.showAllRes();

	autoHeight();
});
/**
 * 执行删除操作
 */
function del(evaluationid) {
	var param = {"evaluationid":evaluationid};
    //弹出提示框
    parent.confirm("确认删除?", function () {
        $.ajax({
            url: BASE_URL + "/ems/emssucresourceevaluation/delete",
            type: "post",
            dataType: "json",
            data: param,
            success: function (json) {
                if (json.success == true) {
                    parent.toast(json.msg);
                    $("#grid-table").trigger("reloadGrid");// 刷新列表
                } else {
                    parent.toast(json.msg);
                }
            }
        });
    });

}

/**
 * 详情
 * @param evaluationid
 */
function display(evaluationid,radius){
	
	
	parent.openWinWithCloseCallback(BASE_URL + "views/module/ems/emsmap/resource/displayResourceInfo.html?evaluationid="+evaluationid+"&radius="+radius, '查看资源评估',null,"55%","55%",null,
			function(){
		if (parent.window.resourceList) {
            if (0 < parent.window.resourceList.length) {
                _.map(parent.window.resourceList, function (tmpPolyObj, index) {
                	parent.window.map.removeOverlay(tmpPolyObj);
                });
            }
            parent.window.resourceList = [];
        }
	});
}

function histroyDis(evaluationid,radius){
	$('#save').hide();
	$('#analys').hide();
//	$("#infos").addClass('singleArea');
	$("#histroyInfos").removeClass('singleArea');
	$("#zypgAdd").removeClass('singleArea');
	$('#zypgHistry').addClass('singleArea');
	loadHistroy(evaluationid,radius)
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

// ifream根据内容刷新高度高度
function autoHeight(){
	var height = $("html").height();
    //获取iframe的id  
    var frameId = window.frameElement && window.frameElement.id || '';
//  通过iframe的id设置高度
    $(window.parent.document).find("#"+frameId).css('height',height);
    $(window.parent.document).find("#"+frameId).parent('.layui-layer-content').parent('.layui-layer').css('height',height + 33);
//	$('body').niceScroll({
//        cursorborder: "#4d86d6",
//        cursorcolor: "#4d86d6",
//        background: false,
//        horizrailenabled: false,
//        autohidemode: false
//    }).show().resize();
}

//刷新滚动条
function scrollResize() {
    $('.resAll').niceScroll({
    	cursorborder: "#4d86d6",
		cursorcolor: "#4d86d6",
		background: false,
		horizrailenabled: false,
		autohidemode: false
    }).show().resize();
}

/**
 * 刷新加载分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	"eventid":eventid
        }
    }).trigger("reloadGrid");
}
