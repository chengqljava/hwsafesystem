/**
 * 应急救援GIS首页-智能方案-任务发送消息
 * Created by Administrator on 2017/10/16.
 */
$(function() {
	//获取当前任务id
	var taskId = getQueryString("taskId"),
		receiver = getQueryString("receiver");
	
	//加载消息分页表格
	initTskMsgGird(taskId);
	
	//发送信息
	$("#sendMsgForm").validate({
		rules: {
			msgCon: {
				required: true,
				maxlength: 30
			}
		},
		messages: {
			msgCon: {
				required: "发送消息不能为空",
				maxlength: "字符长度不能超过60"
			}
		},
		submitHandler: function(form) {
			//将发送的消息保存到数据库
			$.ajax({
        		type: "post",
        		url: BASE_URL + "ems/emssucisstaskmsg/save",
        		data: {
        			"msgCon": $("#msgCon").val(),
        			"receiver": receiver,
        			"taskid": taskId
        		},
        		success: function(data) {
        			if (data.success == true){
        				//刷新消息表格
        				refreshTskMsgGird(taskId);
        			}
        			parent.toast(data.msg);//弹出提示信息
        		}
			});
	    }   
	});
});

/**
 * 初始化加载当前方案下的任务分页表格
 * @param schemaId
 */
function initTskMsgGird(taskid) {
	var colname = ['主键', '任务ID', '接收者的用户ID', '接收机构', '发送者的用户ID', '发送机构', '发送时间', '消息内容', ]; 
	var colmodel = [
					{name: 'MESSAGEID',index: 'TASKID', width: '5%', hidden: true},
					{name: 'TASKID',index: 'SCHEMEID', width: '5%', hidden: true},
					{name: 'RECEIVER',index: 'RECEIVER', width: '5%', hidden: true},
					{name: 'RECEIVERNAME',index: 'RECEIVERNAME', width: '5%', hidden: true},
					{name: 'SENDER',index: 'SENDER', width: '5%', hidden: true},
					{name: 'SENDERNAME',index: 'SENDERNAME', width: '5%'},
					{name: 'SENDTIME',index: 'SENDTIME', formatter : function(cellvalue, options, obj) {
						return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
					}, width: '5%'},
					{name: 'MESSAGECONTENT',index: 'MESSAGECONTENT', width: '5%'}
					];
	
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.98 );
	});

    $("#grid-table").jqGrid({
    	height: 100,
    	url : BASE_URL + "ems/emssucisstaskmsg/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData : {"taskid": taskid},
		sortname : 'SENDTIME',
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
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		multiselect: false,
		caption: "历史反馈信息",
		autowidth: true,
        loadComplete: function() {
			if($(window).width() < 400) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
}

/**
 * 根据当前方案id刷新下面的任务表格
 * @param schemaId
 */
function refreshTskMsgGird(taskid) {
	$("#grid-table").jqGrid('setGridParam',{
		page: 1,
		postData: {"taskid": taskid}
	}).trigger("reloadGrid");
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}