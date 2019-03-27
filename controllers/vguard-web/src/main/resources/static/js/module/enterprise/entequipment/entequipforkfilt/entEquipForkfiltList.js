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
	
	var colname = ['叉车id','设备名称','规格型号','投用时间','证书编号','使用证号(车牌号)','检验日期','下次检验日期','注册代码']; 
	var colmodel = [
		{name:'FORKFILTID',index:'FORKFILTID', width:'5%',hidden: true},
		{name:'DEVICENAME',index:'DEVICENAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.FORKFILTID+'\')">'+obj.DEVICENAME+'</a>';
			}
		},
		{name:'SPECMODEL',index:'SPECMODEL',width:'10%',align:'left'},
		{name:'STARTTIME',index:'STARTTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.STARTTIME) {
					return getSmpFormatDateByLong(obj.STARTTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'REGISTNUMBER',index:'REGISTNUMBER',width:'10%',align:'left'},
		{name:'PLATENUM',index:'PLATENUM',width:'10%',align:'left'},
		{name:'CHECKTIME',index:'CHECKTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.CHECKTIME) {
					return getSmpFormatDateByLong(obj.CHECKTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'NEXTCHECKTIME',index:'NEXTCHECKTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.NEXTCHECKTIME) {
					return getSmpFormatDateByLong(obj.NEXTCHECKTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'REGISTRATIONCODE',index:'REGISTRATIONCODE',width:'10%',align:'left'},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipforkfilt/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'STARTTIME',
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
		caption: "叉车列表",
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
    	parent.parent.openWin(BASE_URL+"/enterprise/entequipforkfilt/add/"+entid,'添加','70%','55%');
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
    	var forkfiltid = rowdata.FORKFILTID;
    	
    	parent.parent.openWin(BASE_URL+'/enterprise/entequipforkfilt/edit/'+forkfiltid,'编辑','70%','55%');
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

    	var forkfiltids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		forkfiltids[i]= rowdatas.FORKFILTID;
    	}
    	var parmJson = forkfiltids.toString();
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
		page:1,postData:{entid:$("#entid").val(),
            devicename:$("#devicename").val(),
            specmodel:$("#specmodel").val(),}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(forkfiltid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipforkfilt/display/"+forkfiltid,'详细','70%','55%');
}


/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entequipforkfilt/delete",
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

 

