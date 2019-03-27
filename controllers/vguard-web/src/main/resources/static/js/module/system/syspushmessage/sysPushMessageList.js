$(document).ready(function() {
	var colname = ['主键ID','标题','接收者','接收者用户名','接收者手机号','内容','扩展信息','发送状态','发送时间']; 
	
	var colmodel = [
					{name:'MESSAGEID',index:'MESSAGEID',hidden:true},
					{name:'TITLE',index:'TITLE',align:'left',width: "30%",
						formatter:function(cellvalue, options, obj) { 
							   return '<a href="javascript:void(0);" onclick="display(\''+obj.MESSAGEID+'\',\''+obj.TITLE+'\')">'+obj.TITLE+'</a>';
						}
					},
					{name:'USERID',index:'USERID',align:'left',hidden:true},
					{name:'USERNAME',index:'USERNAME',align:'left',width: "20%"},
					{name:'PHONE',index:'PHONE',align:'left',width: "20%"},
					
					{name:'CONTENT',index:'CONTENT',align:'left',hidden:true},
					{name:'EXTRA',index:'EXTRA',align:'left',hidden:true},
					{
		            	name: "STATE",
		            	index: "STATE",
		            	width: "15%",
		            	align: "center",
		            	sortable: false,
		            	formatter: function (cellvalue, options, obj) {
		            		var lastVal = null;
		            		switch (cellvalue) {
							case "1": lastVal = "草稿";
								break;
							case "2": lastVal = "发送中";
								break;
							case "3": lastVal = "发送失败";
								break;
							case "4": lastVal = "发送成功";
								break;
							default: lastVal = "无";
								break;
							}
		            		return lastVal;
		                }
		            },
					{name:'SENDTIME',index:'SENDTIME',align: "center",width: "20%",
						formatter: function (cellvalue, options, obj) {
		                    return getFormatDateByLong(obj.SENDTIME,
		                        "yyyy-MM-dd");
		                }
		            },
					
					];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/system/syspushmessage/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			title:$('#title').val(),
			userName : $('#userName').val(),
			startTime : $('#startTime').val(),
			endTime : $('#endTime').val()
		},
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
		multiselect: true,
		caption: "消息推送列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			title:$('#title').val(),
			userName : $('#userName').val(),
			startTime : $('#startTime').val(),
			endTime : $('#endTime').val()
		}
	}).trigger("reloadGrid");
}



/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/system/syspushmessage/addSysPushMessageBatch" ,'新增消息推送','65%','65%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var smsid = rowdata.MESSAGEID;
	parent.openWin(BASE_URL+'/system/syspushmessage/edit/'+smsid,'编辑消息推送','65%','65%');
});


/*详细查询*/
function display(SMSID){
	parent.openWin(BASE_URL+"/system/syspushmessage/displayPushMessage/"+SMSID,'消息推送详细','65%','45%');
}


//批量删除短信信息
$("#delBtn").off("click").on("click", function () {
    // 返回当前grid中复选框所选择的数据的id
    var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
    if (0 == curSelRowArr.length) {
        // 弹出提示信息
        parent.toast("请选择需要删除的消息推送数据！");
        return;
    }

    var curSelTaskIdArr = [];
    for (var i = 0; i < curSelRowArr.length; i++) {
    	var state = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATE;
 		var	messageid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).MESSAGEID;
    	if ("草稿" == state) {
    		// 返回指定id行的数据
    		curSelTaskIdArr.push(messageid);
    	} else {
    		parent.toast("只允许删除状态为草稿的消息推送数据！");
    		return;
    	}
    }
    //执行删除操作
    delMessages({"messageIds": curSelTaskIdArr.toString()});
});


/**
 * 选择一条记录
 * @returns
 * @author 
 * @date 
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
/*删除方法*/
function delMessages(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/system/syspushmessage/delPushMessage",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.toast(json.msg);
	  				reloadGrid();//刷新列表
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	})
}

//发送按钮操作
$("#sendBtn").off("click").on("click", function () {
	// 返回当前grid中复选框所选择的数据的id
	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
	if (0 == curSelRowArr.length) {
		// 弹出提示信息
		parent.toast("请选择需要推送的消息！");
		return;
	}
	
	var curSelTaskIdArr = [];
    for (var i = 0; i < curSelRowArr.length; i++) {
    	var state = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATE,
     		messageid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).MESSAGEID;
    	if ("发送成功" != state) {
    		// 返回指定id行的数据
    		curSelTaskIdArr.push(messageid);
    	} else {
    		parent.toast("不能选择状态为已发送的消息！");
    		return;
    	} 
    }
    
	//执行发送短信操作
    sendMessages({"messageIds": curSelTaskIdArr.toString()});
});

/**
 * 发送消息推送
 */
function sendMessages(curTaskIdsObj){
	 //弹出提示框
    parent.confirm("确认推送选中的消息吗?", function () {
        $.ajax({
            url: BASE_URL + "/system/syspushmessage/sendPushMessage",
            type: "post",
            dataType: "json",
            data: curTaskIdsObj,
            success: function (json) {
                if (json.success == true) {
                    parent.toast(json.msg);
                    reloadGrid();// 刷新列表
                } else {
                    parent.toast(json.msg);
                }
            }
        });
    });
}


