$(document).ready(function() {
	
	var colname = ['企业id','企业名称','企业地址','行业类型','企业负责人','联系电话','是否检查']; 
	var colmodel = [
		{name:'LAWENTID',index:'LAWENTID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left'},
		{name:'ADDRESS',index:'ADDRESS',width:'20%',align:'left'},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'10%',align:'left'},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'center'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'center'},
		{name:'STATE',index:'STATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getLawEntState(obj.STATE);
			}
		}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawcheckent/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			planid:$("#planid").val(),
			state:$("#state").val()
		},
		sortname : 'LAWENTID',
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
		caption: "待检查企业",
		autowidth: true,
		loadComplete: function() {
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
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			planid:$("#planid").val(),
			state:$("#state").val()
			}
	}).trigger("reloadGrid");
}

/*添加*/
$("#addBtn").on("click", function () {
	var planState = $("#planState").val();
	if(planState=='1'){
		var planid = $("#planid").val();
		parent.openWin(BASE_URL+"/law/lawcheckent/add/"+planid,'添加','80%','70%');
	}else if(planState=='2'){
		parent.toast("执法计划执行中，不能增删待检查企业！");
	}else if(planState=='3'){
		parent.toast("执法计划已完成，不能增删待检查企业！");
	}else if(planState=='4'){
		parent.toast("执法计划已过期，不能增删待检查企业！");
	}
});


/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var lawentids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		lawentids[i]= rowdatas.LAWENTID;
	}
	var parmJson = lawentids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
	var planState = $("#planState").val();
	if(planState=='1'){
			//弹出提示框
			parent.confirm("确认删除吗?", function() { 
				 $.ajax({ 
					 	url: BASE_URL+"/law/lawcheckent/delete",
				  		type:'post',
				  		dataType:'json',
				  		data:param,
				  		success: function(json){
				  			if(json.success==true){
				  				parent.toast(json.msg);
				  				reloadGrid();//刷新列表
								parent.getActiveIFrame().reloadGrid();//刷新父列表（执法部门）
				  			}else{
				  				parent.toast(json.msg);
				  			}
				  		}
					 });
		    });
	}else if(planState=='2'){
		parent.toast("执法计划执行中，不能增删待检查企业！");
	}else if(planState=='3'){
		parent.toast("执法计划已完成，不能增删待检查企业！");
	}else if(planState=='4'){
		parent.toast("执法计划已过期，不能增删待检查企业！");
	}
}


 

