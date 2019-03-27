$(document).ready(function() {
	
	SelectOption.loadState("state");
/*	SelectOption.loadAcclevel("acclevel");
	SelectTree.loadEventTypeAllTreeSelect("acctype");
	SelectTree.loadEconindustrySelect("industrytype");*/
	
	var colname = ['REMINDID','标题','待办人','时间','状态','states']; 
	var colmodel = [
		{name:'remindid',index:'remindid', width:'5%',hidden: true},
		{name:'title',index:'title',width:'20%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.remindid+'\')">'+obj.title+'</a>';
			}
		},
		{name:'dopeople',index:'dopeople',width:'20%',align:'center'
		},
		{name:'time',index:'time',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.time == null)
					return "-";
				else
					return getSmpFormatDateByLong(obj.time,false);
			}, width : '10%'},
		{name:'state',index:'state',width:'20%',align:'center',
			formatter : function(cellvalue, options, obj) {
				if("1"==obj.state){
					return "<span style='color:red'>"+SelectOption.getState(obj.state)+"</span>";
				}else{
					return "<span style='color:green'>"+SelectOption.getState(obj.state)+"</span>";
				}
			}
		},
			{name:'state',index:'state', width:'5%',hidden: true}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
//	$(window).on('resize.jqGrid', function () {
//		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
//    })

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/political/iesremind/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			state:$("#state").val(),
			title:$("#title").val(),
			dopeople:$("#dopeople").val()
		},
		sortname : 'remindid',
		sortorder : "asc",
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
		caption: "待办提醒",
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
			state:$("#state").val(),
			title:$("#title").val(),
			dopeople:$("#dopeople").val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#chemcatalname").val();
	$("#un").val();
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/political/iesremind/add",'添加','60%','75%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var state=rowdata.state;
	if(state=="2"){
		parent.toast("事件已经处理！");
		return;
	}
	var chemcatalid = rowdata.remindid;
	parent.openWin(BASE_URL+'/political/iesremind/edit/'+chemcatalid,'编辑','60%','75%');
});




/*详细查询*/
function display(chemcatalid){
	parent.openWin(BASE_URL+'/political/iesremind/display/'+chemcatalid,'详细','60%','75%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var chemcatalids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		chemcatalids[i]= rowdatas.remindid;
	}
	var parmJson = chemcatalids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	    //弹出提示框
		parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/political/iesremind/delete",
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





 

