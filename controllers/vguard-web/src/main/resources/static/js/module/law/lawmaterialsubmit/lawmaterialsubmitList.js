$(document).ready(function() {
		var colname = ['主键id','被检查企业','字号','执法人员','签收人','签收时间'];
		var colmodel = [
			{name:'LAWMASUBID',index:'LAWMASUBID', width:'15%', hidden : true},
			{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="display(\''+obj.LAWMASUBID+'\')">'+obj.ENTNAME+'</a>';
				}
			},
			{name:'NOTICENO',index:'NOTICENO',width:'10%',align:'center',sortable : false},
			{name:'USERNAME',index:'USERNAME',width:'10%',align:'center',sortable : false},
			{name:'SIGNATORY',index:'SIGNATORY',width:'10%',align:'center',sortable : false},
			{name:'SIGNDATE',index:'SIGNDATE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.SIGNDATE) {
						return getSmpFormatDateByLong(obj.SIGNDATE, false);
					} else {
						return "";
					}
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
	    	url : BASE_URL + "/law/lawmaterialsubmit/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				checkinfoid:$('#checkinfoid').val()
			},
			sortname : 'SIGNDATE',
			sortorder : "DESC",
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
			caption: "提交材料通知书",
			autowidth: true
		});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			checkinfoid:$('#checkinfoid').val()
		}
	}).trigger("reloadGrid");
}


/*添加*/
$("#addBtn").bind("click",function(){
	var checkinfoid = $('#checkinfoid').val();
	var checkrecordid = $('#checkrecordid').val();
	var doccode = $('#doccode').val();
	var menupagetype = $('#menupagetype').val();
	var checktype = $('#checktype').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawmaterialsubmit/add/"+menupagetype+"/"+checkinfoid+"/"+checkrecordid+"/"+doccode+"/"+checktype);
});



//编辑
$("#editBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length!=1){
		// 弹出提示信息
		parent.toast("请选择一条需要编辑的数据！");
		return;
	}
	//返回指定id行的数据 
	var rowdatas = $("#grid-table").jqGrid('getRowData',ids[0]);
	var lawmasubid = rowdatas.LAWMASUBID;
	var checkinfoid = $('#checkinfoid').val();
	var checkrecordid = $('#checkrecordid').val();
	var doccode = $('#doccode').val();
	var menupagetype = $('#menupagetype').val();
	var checktype = $('#checktype').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawmaterialsubmit/edit/"+menupagetype+"/"+checkinfoid+"/"+checkrecordid+"/"+lawmasubid+"/"+doccode+"/"+checktype);

});


/*批量删除*/
$("#delBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var lawmasubid=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		lawmasubid[i]= rowdatas.LAWMASUBID;
	}
	var paramJson = lawmasubid.toString();
	var param = {"ids":paramJson};
	del(param);
});

/*删除方法*/
function del(param){
	//弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
			url: BASE_URL+"/law/lawmaterialsubmit/delete",
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


/*详细查询*/
function display(id){
	var lawmasubid = id;
	var checkinfoid = $('#checkinfoid').val();
	var checkrecordid = $('#checkrecordid').val();
	var doccode = $('#doccode').val();
	var doctype = $('#doctype').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawmaterialsubmit/edit/menuDisplay/"+checkinfoid+"/"+checkrecordid+"/"+lawmasubid+"/"+doccode+"/"+doctype);


}