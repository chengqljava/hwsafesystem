$(document).ready(function() {
	
	var colname = ['目录id','序号','文件名称及编号','日期','页号','备注']; 
	var colmodel = [
		{name:'catalogid',index:'catalogid', width:'5%',hidden: true},
		{name:'ordernum',index:'ordernum',width:'10%',align:'center'},
		{name:'docname',index:'docname',width:'20%',align:'left'},
		{name:'createdate',index:'createdate',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.createdate) {
					return getSmpFormatDateByLong(obj.createdate, false);
				} else {
					return "";
				}
			}
		},
		{name:'page',index:'page',width:'10%',align:'center'},
		{name:'notes',index:'notes',width:'20%',align:'left'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawcasecatalog/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			checkinfoid:$("#checkinfoid").val()
		},
		sortname : 'page',
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
		caption: "案件目录",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			checkinfoid:$("#checkinfoid").val()
			}
	}).trigger("reloadGrid");
}

/*添加*/
$("#addBtn").on("click", function () {
	var checkinfoid = $("#checkinfoid").val();
	parent.openWin(BASE_URL+"/law/lawcasecatalog/add/"+checkinfoid,'添加','60%','50%');
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

	var catalogids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		catalogids[i]= rowdatas.catalogid;
	}
	var parmJson = catalogids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
		//弹出提示框
		parent.confirm("确认删除吗?", function() { 
			 $.ajax({ 
				 	url: BASE_URL+"/law/lawcasecatalog/delete",
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
	    });
}


 

