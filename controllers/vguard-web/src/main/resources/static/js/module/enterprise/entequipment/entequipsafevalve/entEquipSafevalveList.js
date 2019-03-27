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
	
	var colname = ['安全阀id','型号规格','检验编号','整定压力（Mpa）','核准证号','工作介质','安装位置','使用有效期']; 
	var colmodel = [
		{name:'SAFEVALVEID',index:'SAFEVALVEID', width:'5%',hidden: true},
		{name:'SPECODEL',index:'SPECODEL',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.SAFEVALVEID+'\')">'+obj.SPECODEL+'</a>';
			}
		},
		{name:'TESTCODE',index:'TESTCODE',width:'10%',align:'left'},
		{name:'SETPRESSURE',index:'SETPRESSURE',width:'10%',align:'left'},
		{name:'APPROVALCODE',index:'APPROVALCODE',width:'10%',align:'left'},
		{name:'WORKINGMEDIUM',index:'WORKINGMEDIUM',width:'10%',align:'left'},
		{name:'INSTALPOSITION',index:'INSTALPOSITION',width:'15%',align:'left'},
		{name:'EFFECTIVETIME',index:'EFFECTIVETIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.EFFECTIVETIME) {
					return getSmpFormatDateByLong(obj.EFFECTIVETIME, false);
				} else {
					return "";
				}
			}
		},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipsafevalve/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'APPRAISALTIME',
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
		caption: "安全阀列表",
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
    	parent.parent.openWin(BASE_URL+"/enterprise/entequipsafevalve/add/"+entid,'添加','72%','55%');
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
    	var safevalveid = rowdata.SAFEVALVEID;
    	
    	parent.parent.openWin(BASE_URL+'/enterprise/entequipsafevalve/edit/'+safevalveid,'编辑','72%','55%');
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

    	var safevalveids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		safevalveids[i]= rowdatas.SAFEVALVEID;
    	}
    	var parmJson = safevalveids.toString();
    	var entid = $("#entid").val();
    	var param = {"ids":parmJson,"entid":entid};
    	del(param);
    });
    /*搜索查询*/
    $("#searchbtn").bind("click",function(){
        reloadGrid();
    });
    
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{entid:$("#entid").val(),testcode:$("#testcode").val(),devicename:$("#devicename").val()}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(safevalveid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipsafevalve/display/"+safevalveid,'详细','68%','55%');
}


/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entequipsafevalve/delete",
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
		})
}

//刷新左侧安全信息树
function refreshTree(flag){
	if(flag){
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safestandard').val("true");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}else{
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safestandard').val("false");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}
}

 

