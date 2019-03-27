$(document).ready(function() {

	var isGis = getQueryString("isGis");

    var colname = ['主键ID','站点名称','站点编码','报警时间','报警类型','报警等级','报警方式','报警消息'];

    var colmodel = [
        {name:'id',index:'id',hidden:true},
        {name:'siteName',index:'siteName',align:'center', width : '15%'},
        {name:'siteCode',index:'siteCode' ,align:'center',width:'15%'},
        {name:'sendTime',index:'sendTime',align:'center',
            formatter:function(cellvalue, options, obj) {
                if(obj.sendTime == null)
                    return "-";
                else
                    return getSmpFormatDateByLong(obj.sendTime,true);
            } ,width : '15%'},
        {name:'type',index:'type',align:'center' ,width : '10%',
			formatter:function(cellvalue, options, obj) {
               return SelectOption.getHbAlramType(obj.type);
            }},
        {name:'level',index:'level',align:'center',width : '10%',
            formatter:function(cellvalue, options, obj) {
                return SelectOption.getHbAlarmLevel(obj.level);
            }},
        {name:'sendMode',index:'sendMode',align:'center',width : '10%',
            formatter:function(cellvalue, options, obj) {
                return SelectOption.getHbSendMode(obj.sendMode);
            }},
        {name:'content',index:'content',align:'center' ,width : '20%'}
    ];
	
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 110 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 110 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	


    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/epi/epialaram/getHbMsg",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData : {
			handleStatus: "0"
		},
		sortname : 'STARTTIME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "rows",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "环保报警列表",
		autowidth: true,
        scrollOffset: 1,
        loadComplete:function(){
//        	$("#grid-table").jqGrid("setGridWidth", $(window).width() - 20);
        	tableScrollResize();
        }
	});
    
    /*报警处理*/
    $("#handleBtn").on("click", function(){
        var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
        if(ids.length !=1){
            // 弹出提示信息
            parent.toast("请选择一条记录！");
            return;
        }
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var id = rowdata.id;
    	if(isGis){
			parent.openWinWithCloseCallback(BASE_URL+"/views/module/system/remindinfo/gishandleHbAlarm.html?id=" + id , '报警处理页面','50%','20%',false,null,function () {
				reloadGrid();
			});
		}else{
            parent.openWinWithCloseCallback(BASE_URL+"/views/module/system/remindinfo/handleHbAlarm.html?id=" + id , '报警处理页面','50%','40%',false,null,function () {
                reloadGrid();
            });
		}
    });

});

/*加载*/
function reloadGrid(){
	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : {
			handleStatus: "0"
		}
	}).trigger("reloadGrid");
}

/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}

function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
