$(document).ready(function() {
		var colname = ['主键id','被检查企业','字号','安监员','签发时间','送达回执'];
		var colmodel = [
			{name:'SCENEID',index:'SCENEID', width:'15%', hidden : true},
			{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="display(\''+obj.SCENEID+'\')">'+obj.ENTNAME+'</a>';
				}
			},
			{name:'DOCNUM',index:'DOCNUM',width:'10%',align:'center',sortable : false},
			{name:'USERNAME',index:'USERNAME',width:'10%',align:'center',sortable : false},
			{name:'INDATE',index:'INDATE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.INDATE) {
						return getSmpFormatDateByLong(obj.INDATE, false);
					} else {
						return "";
					}
				}
			},
			{name:'ISREGISTER',index:'ISREGISTER',width:'10%',align:'center',sortable : false,
				editoptions : {
					value : "1:已立案;0:未立案"
				},
				formatter : 'select'
			}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawscenedispose/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				checkinfoid:$('#checkinfoid').val()
			},
			sortname : 'INDATE',
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
			caption: "现场处理措施决定书",
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
	var doccode = $('#doccode').val();
	var menupagetype = $('#menupagetype').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawscenedispose/add/"+checkinfoid+"/"+doccode+"/"+menupagetype);
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
	var sceneid = rowdatas.SCENEID;
	var checkinfoid = $('#checkinfoid').val();
	var doccode = $('#doccode').val();
	var menupagetype = $('#menupagetype').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawscenedispose/edit/"+sceneid+"/"+checkinfoid+"/"+doccode+"/"+menupagetype);
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

	var sceneids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		sceneids[i]= rowdatas.SCENEID;
	}
	var paramJson = sceneids.toString();
	var param = {"ids":paramJson};
	del(param);
});

/*删除方法*/
function del(param){
	//弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
			url: BASE_URL+"/law/lawscenedispose/delete",
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
	var checkinfoid = $('#checkinfoid').val();
	var doccode = $('#doccode').val();
	var menupagetype = $('#menupagetype').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawscenedispose/display/"+id+"/"+checkinfoid+"/"+doccode+"/"+menupagetype);

}