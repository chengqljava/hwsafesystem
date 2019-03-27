$(document).ready(function() {
	var colname = ['业务操作id','权限id','业务操作','操作代码','样式名称','排序','描述'];
	var colmodel = [
		{name:'OPERID',index:'OPERID', width:'5%',hidden: true},
		{name:'PRIVID',index:'PRIVID', width:'5%',hidden: true},
		{name:'OPERNAME',index:'OPERNAME',width:'30%',align:'left',editable:true,editrules:{required:true}},
		{name:'OPERCODE',index:'OPERCODE',width:'20%',align:'left',editable:true,editrules:{required:true}},
		{name:'OPERSTYLE',index:'OPERSTYLE',width:'30%',align:'left',editable:true,editrules:{required:true}},
		{name:'ORDERNUM',index:'ORDERNUM',width:'10%',align:'left',editable:true},
		{name:'NOTE',index:'NOTE',width:'30%',align:'left',editable:true}
		];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/system/sysoper/list",
		datatype: "json",
		cache : false,
		mtype : 'POST',
		colNames:colname,
		colModel:colmodel,
		postData:{
			privid:$("#privid").val()
		},
		sortname : 'updatetime',
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
		caption: "业务操作",
		autowidth: true
	});
	
	/**添加新行*/
	$("#addBtn").on("click", function (e) {
		e.preventDefault();
		var ids = $("#grid-table").jqGrid('getDataIDs');  
		//获得当前最大行号(数据编号)
	    var rowid = Math.max.apply(Math,ids);  
	    //获得新添加行的行号(数据编号)
	    var newrowid = rowid+1;
		$("#grid-table").jqGrid('addRowData', newrowid, {});
		$('#grid-table').jqGrid('editRow', newrowid, true);
	});
	
	/**删除行*/
	$("#delBtn").on("click", function (e) {
		e.preventDefault();
		$('input:checked').parent().parent().remove();
	});
	
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			             opername:$("#opername").val()
			             }
	}).trigger("reloadGrid");
}

/**保存*/
function save(){
	var ids = $("#grid-table").jqGrid('getDataIDs'); //获取所有的id
	//操作项json对象
	var operJsonArr = new Array();
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		
		$('#grid-table').jqGrid('saveRow', id);
		
		var rowdata = $("#grid-table").jqGrid("getRowData",id); //根据上面的id获得本行数据
		var operid= rowdata.OPERID;
		var opername= rowdata.OPERNAME;
		
		var nameindex = opername.indexOf('input');//验证
		if(nameindex != -1){
			return false;
		}
		
		var opercode = rowdata.OPERCODE;
		var codeindex = opercode.indexOf('input');//验证
		if(codeindex != -1){
			return false;
		}
		
		var operstyle =rowdata.OPERSTYLE;
		var styleindex = operstyle.indexOf('input');//验证
		if(styleindex != -1){
			return false;
		}
		
	    var ordernum = rowdata.ORDERNUM;
  		var note = rowdata.NOTE;
  		var privid = rowdata.PRIVID;
  		var obj = {
  			"operid":operid,
  			"opername":opername,
  			"opercode":opercode,
  			"operstyle":operstyle,
  			"ordernum":ordernum,
  			"note":note,
  			"privid":privid
  		};
  		operJsonArr.push(obj);
	}
	var privid = $("#privid").val();//权限id
	var param={"sysOpers":JSON.stringify(operJsonArr),"privid":privid};
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/sysoper/save',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid("","");//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
