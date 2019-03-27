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
	
	var colname = ['管理人id','姓名','专（兼）职','人员类型','职务','职责','手机','证书编号','发证时间','证书有效期','发证机关']; 
	var colmodel = [
		{name:'SAFEMANAGERID',index:'SAFEMANAGERID', width:'5%',hidden: true},
		{name:'PERSONNAME',index:'PERSONNAME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.SAFEMANAGERID+'\')">'+obj.PERSONNAME+'</a>';
			}
		},
		{name:'FULLTIMEORPARTTIME',index:'FULLTIMEORPARTTIME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getFullTimePartTime(obj.FULLTIMEORPARTTIME);
			}
		},
		{name:'PERSONTYPE',index:'PERSONTYPE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getSafeManagerType(obj.PERSONTYPE);
			}
		},
		{name:'JOB',index:'JOB',width:'10%',align:'center'},
		{name:'DUTY',index:'DUTY',width:'10%',align:'center'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'center'},
		{name:'CERTIFICATECODE',index:'CERTIFICATECODE',width:'10%',align:'center'},
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
				} else {
					return "";
				}
			}
		},
		{name:'ISSUINGAUTHORITY',index:'ISSUINGAUTHORITY',width:'10%',align:'center'}
	];
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 42;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -42);
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 48 );
	});
	$("#grid-table").jqGrid({
    	height: tableHeight,
    	width:$(window).width() - 48,
    	url : BASE_URL + "/enterprise/entsafemanager/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val() || ''
		},
		sortname : 'SAFEMANAGERID',
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
		caption: "安全生产管理人员",
		//autowidth: true,
		loadComplete: function() {
			if ($("#closeBtn").length==0) {
				$("body").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center; margin-top: 10px;">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
//			if($(window).width() < 700) {
//				$('.ui-jqgrid-htable').css({"width":"900"});
//				$("#grid-table").css({"width":"900" });
//				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
//				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//			} else {
//				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
//			}
		}
	})
	
	/*添加*/
	$("#addBtn").on("click", function () {
		var entid = $("#entid").val();
		parent.parent.openWin(BASE_URL+"/enterprise/entsafemanager/add/"+entid,'添加','60%','55%');
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
		var safemanagerid = rowdata.SAFEMANAGERID;
		
		parent.parent.openWin(BASE_URL+'/enterprise/entsafemanager/edit/'+safemanagerid,'编辑','60%','55%');
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

		var safemanagerids=[];
		for(var i=0;i<ids.length;i++){
			var id = ids[i]; 
			//返回指定id行的数据 
			var rowdatas = $("#grid-table").jqGrid('getRowData',id);
			safemanagerids[i]= rowdatas.SAFEMANAGERID;
		}
		var parmJson = safemanagerids.toString();
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
function display(safemanagerid){
	parent.parent.openWin(BASE_URL+"/enterprise/entsafemanager/display/"+safemanagerid,'详细','60%','60%');
}



/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entsafemanager/delete",
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
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safemanager').val("true");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}else{
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safemanager').val("false");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}
}

 

