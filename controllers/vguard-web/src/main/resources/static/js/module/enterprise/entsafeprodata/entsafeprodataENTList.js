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
	
	
	var colname = ['id','资料类型(大类)','资料类型(小类)','制定时间']; 
	var colmodel = [
		{name:'SAFEPRODATAID',index:'SAFEPRODATAID', width:'5%',hidden: true},
		{name:'DATAONETYPE',index:'DATAONETYPE',width:'30%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.SAFEPRODATAID+'\')">'+SelectOption.getDataOneType(obj.DATAONETYPE)+'</a>';
			}
		},
		{name:'DATATWOTYPE',index:'DATATWOTYPE',width:'30%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				 if(obj.DATATWOTYPE){
					  return SelectOption.getDataTwoType(obj.DATATWOTYPE,obj.DATAONETYPE);
				  }else{
					  return "";
				  }
			}
		},
		{name:'ENACTTIME',index:'ENACTTIME',width:'20%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.ENACTTIME,
						"yyyy-MM-dd");
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
    	url : BASE_URL + "/enterprise/entsafeprodata/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			businessinfoid:$("#businessinfoid").val()
		},
		sortname : 'enacttime',
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
		caption: "安全生产管理资料",
		autowidth: true
	});
    
    /*添加*/
    $("#addBtn").on("click", function () {
    	var businessinfoid = $('#businessinfoid').val();
    	parent.parent.openWin(BASE_URL+"/enterprise/entsafeprodata/add/"+businessinfoid,'添加','40%','35%');
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
    	var safeprodataid = rowdata.SAFEPRODATAID;
    	parent.parent.openWin(BASE_URL+'/enterprise/entsafeprodata/edit/'+safeprodataid,'编辑','40%','35%');
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

    	var safeprodataids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		safeprodataids[i]= rowdatas.SAFEPRODATAID;
    	}
    	var parmJson = safeprodataids.toString();
    	var businessinfoid = $('#businessinfoid').val();
    	var param = {"ids":parmJson,"businessinfoid":businessinfoid};
    	del(param);
    });
    
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			businessinfoid:$("#businessinfoid").val()}
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(safeprodataid){
	parent.parent.openWin(BASE_URL+"/enterprise/entsafeprodata/display/"+safeprodataid,'详细','40%','35%');
}



/*删除方法*/
function del(param){
	//弹出提示框
	parent.parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/enterprise/entsafeprodata/delete",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.parent.toast(json.msg);
	  				reloadGrid();//刷新列表
	  				refreshTree(json.existsflag); // 刷新左侧安全信息树
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
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safeprodata').val("true");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}else{
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safeprodata').val("false");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}
}
