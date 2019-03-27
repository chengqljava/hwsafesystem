$(document).ready(function() {

	 //下拉树
	SelectTree.loadOrgByOrgidSelect("organname",{"orgid":$('#selforgid').val()});
	
	var colname = ['巡查人员id','巡查人员','人员身份','办公电话','手机','巡查部门']; 
	var colmodel = [
		{name:'PATROLLERID',index:'PATROLLERID', width:'5%',hidden: true},
		{name:'NICKNAME',index:'NICKNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.PATROLLERID+'\')">'+obj.NICKNAME+'</a>';
			}
		},
		{name:'PATROLLERTYPE',index:'PATROLLERTYPE',width:'20%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return SelectOption.getPatrollerType(obj.PATROLLERTYPE);
			}
		},
		{name:'TELEPHONE',index:'TELEPHONE',width:'10%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'left'},
		{name:'ORGNAME',index:'ORGNAME',width:'10%',align:'left'}
		
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdipatroller/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			patrollername:$("#patrollername").val(),
			organid:$("#organname_select").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'PATROLLERID',
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
		caption: "巡查人员",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			patrollername:$("#patrollername").val(),
			organid:$("#organname_select").val(),
			districtid:$("#districtid").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#patrollername").val();
	$("#organname_select").val();
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/hiddendanger/hdipatroller/add",'添加','60%','50%');
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
	var patrollerid = rowdata.PATROLLERID;
	
	parent.openWin(BASE_URL+'/hiddendanger/hdipatroller/edit/'+patrollerid,'编辑','60%','50%');
});

/*详细查询*/
function display(patrollerid){
	parent.openWin(BASE_URL+"/hiddendanger/hdipatroller/display/"+patrollerid,'详细','60%','50%');
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

	var patrollerids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		patrollerids[i]= rowdatas.PATROLLERID;
	}
	var parmJson = patrollerids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	    //弹出提示框
		parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/hiddendanger/hdipatroller/delete",
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



 

