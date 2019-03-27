$(document).ready(function() {
	
	initSeachInput();
//	SelectOption.loadDense("dense");
/*	SelectOption.loadAcclevel("acclevel");
	SelectTree.loadEventTypeAllTreeSelect("acctype");
	SelectTree.loadEconindustrySelect("industrytype");*/
	
	var colname = ['OFFID','标题','密级','发送单位','接收单位','发送时间']; 
	var colmodel = [
		{name:'OFFID',index:'OFFID', width:'5%',hidden: true},
		{name:'TITLE',index:'TITLE',width:'20%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.OFFID+'\')">'+obj.TITLE+'</a>';
			}
		},
		{name:'DENSE',index:'DENSE',width:'20%',align:'center',
			formatter : function(cellvalue, options, obj) {
				return obj.DENSE != null ? SelectOption.getDense(obj.DENSE) : "";
			}
		},
		{name:'SENDUNIT',index:'SENDUNIT', width:'20%', align:'center',
		},
		{name:'RECEUNIT',index:'RECEUNIT', width:'20%', align:'center',
			
		},
		{name:'SENDTIME',index:'SENDTIME',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.SENDTIME == null)
					return "-";
				else
					return getSmpFormatDateByLong(obj.SENDTIME,false);
			}, width : '10%'}
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
    	url : BASE_URL + "/political/iesdocument/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			title:$("#title").val(),
			dense:$("#dense").val()
		},
		sortname : 'OFFID',
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
		caption: "公文管理",
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
	var dense = $("#dense").val();
	if (dense == "绝密") {
		dense = '1';
	}else if(dense == "机密"){
		dense = '2';
	}else if(dense == "秘密"){
		dense = '3';
	}else if(dense == "限制"){
		dense = '4';
	}else if(dense == "公开"){
		dense = '5';
	}else if(dense == "其他"){
		dense = '6';
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			title:$("#title").val(),
			dense:dense
			}
	}).trigger("reloadGrid");
}

/*搜索查询
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

重置
$("#resetbtn").bind("click",function(){
	$("#chemcatalname").val();
	$("#un").val();
});*/


function resetData(){
    $("#title").val("");
    $("#dense").val("");
}

function seach(){
	 reloadGrid();
}

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/political/iesdocument/add",'添加','60%','75%');
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
	var chemcatalid = rowdata.OFFID;
	
	parent.openWin(BASE_URL+'/political/iesdocument/edit/'+chemcatalid,'编辑','60%','75%');
});




/*详细查询*/
function display(chemcatalid){
	parent.openWin(BASE_URL+'/political/iesdocument/display/'+chemcatalid,'详细','60%','75%');
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
		chemcatalids[i]= rowdatas.OFFID;
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
		  		url: BASE_URL+"/political/iesdocument/delete",
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





 

