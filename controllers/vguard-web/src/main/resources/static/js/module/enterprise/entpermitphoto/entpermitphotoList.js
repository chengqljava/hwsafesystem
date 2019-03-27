$(document).ready(function() {
	
	if($(window).width() < 700) {
		$('.showBtn').css({"display":"none"});
		var len = $('.dropdown-menu li').length;
		for(var i = 0; i < len; i++) {
			$('.smallShow li button')[i].onclick = function () {
    				var html = $(this).html();
    				$('.clickBtn').html(html);
    			};
    		}
	}else {
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	var colname = ['id','证照类型','证照名称','证照编号','审批结果','发证机关','发证时间','证照有效期']; 
	var colmodel = [
		{name:'PERMITID',index:'PERMITID', width:'5%',hidden: true},
		{name:'TYPENAME',index:'TYPENAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.PERMITID+'\')">'+obj.TYPENAME+'</a>';
			}
		},
		{name:'PERMITNAME',index:'PERMITNAME',width:'10%',align:'left'},
		{name:'PERMITCODE',index:'PERMITCODE',width:'10%',align:'left'},
		{name:'PERMITSCOPE',index:'PERMITSCOPE',width:'10%',align:'left'},
		{name:'ISSUINGAUTHORITY',index:'ISSUINGAUTHORITY',width:'10%',align:'left'},
		{name:'ISSUINGDATE',index:'ISSUINGDATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.ISSUINGDATE) {
					return getSmpFormatDateByLong(obj.ISSUINGDATE, false);
				} else {
					return "";
				}
			}
		},
		{name:'VALIDITYPERIOD',index:'VALIDITYPERIOD',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.VALIDITYPERIOD) {
					return getSmpFormatDateByLong(obj.VALIDITYPERIOD, false);
				} else if(obj.ISVALID == "0"){
					return "无限期";
				}else {
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
    	url : BASE_URL + "/enterprise/entpermitphoto/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'UPDATETIME',
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
		caption: "许可证照",
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
    
    /*添加*/
    $("#addBtn").on("click", function () {
    	var entid = $("#entid").val();
    	parent.parent.openWin(BASE_URL+"/enterprise/entpermitphoto/add/"+entid,'添加','60%','50%');
    });

    /*编辑*/
    $("#editBtn").on("click", function () {
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length !=1){
    		// 弹出提示信息
    		parent.parent.toast("请选择一条记录！");
    		return;
    	}
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var permitid = rowdata.PERMITID;
    	
    	parent.parent.openWin(BASE_URL+'/enterprise/entpermitphoto/edit/'+permitid,'编辑','60%','50%');
    });
    
    /*批量删除*/
    $("#delBtn").on("click", function () {
    	//返回当前grid中复选框所选择的数据的id 
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length==0){
    		// 弹出提示信息
    		parent.parent.toast("请选择需要删除的数据！");
    		return;
    	}

    	var permitids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		permitids[i]= rowdatas.PERMITID;
    	}
    	var parmJson = permitids.toString();
    	var entid = $("#entid").val();
    	var param = {"ids":parmJson,"entid":entid};
    	del(param);
    });
    
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{entid:$("#entid").val()}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(permitid){
	parent.parent.openWin(BASE_URL+"/enterprise/entpermitphoto/display/"+permitid,'详细','60%','50%');
}



/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entpermitphoto/delete",
		  		type:'post',
		  		dataType:'json',
		  		data:param,
		  		success: function(json){
		  			if(json.success==true){
		  				parent.parent.toast(json.msg);
		  				reloadGrid();//刷新列表
		  				refreshTree(json.exists); // 刷新左侧安全信息树
		  			}else{
		  				parent.parent.toast(json.msg);
		  			}
		  		}
			 });
		});
}

//刷新左侧安全信息树
function refreshTree(flag){
	if(flag){
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_permitphoto').val("true");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}else{
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_permitphoto').val("false");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}
}

 

