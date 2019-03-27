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
	
	var colname = ['人员id','姓名','性别','特种作业岗位','持有的特种作业操作证名称','证书编号','发证时间','证书有效期','证书发证机关']; 
	var colmodel = [
		{name:'OPERATORID',index:'OPERATORID', width:'5%',hidden: true},
		{name:'OPERATORNAME',index:'OPERATORNAME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.OPERATORID+'\')">'+obj.OPERATORNAME+'</a>';
			}
		},
		{name:'SEX',index:'SEX',width:'5%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return SelectOption.getSex(obj.SEX);
			}
		},
		{name:'POSITIONNAME',index:'POSITIONNAME',width:'10%',align:'left'},
		{name:'CERTIFICATENAME',index:'CERTIFICATENAME',width:'15%',align:'center'},
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
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 42 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 48 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	width:$(window).width() - 48,
    	url : BASE_URL + "/enterprise/entoperator/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val() || ''
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
		caption: "特种作业人员",
		//autowidth: true,
		loadComplete: function() {console.log($("#closeBtn").length);
			if ($("#closeBtn").length==0) {
				$("body").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center; margin-top: 10px;">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
		}
	});
    
    /*添加*/
    $("#addBtn").on("click", function () {
    	var entid = $("#entid").val();
    	parent.parent.openWin(BASE_URL+"/enterprise/entoperator/add/"+entid,'添加','60%','50%');
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
    	var operatorid = rowdata.OPERATORID;
    	
    	parent.parent.openWin(BASE_URL+'/enterprise/entoperator/edit/'+operatorid,'编辑','60%','55%');
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

    	var operatorids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		operatorids[i]= rowdatas.OPERATORID;
    	}
    	var parmJson = operatorids.toString();
    	var entid = $("#entid").val();
    	var param = {"ids":parmJson,"entid":entid};
    	del(param);
    });
    
});

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			operatorname:$("#operatorname").val() || '',
			issuingdate:$("#issuingdate").val() || ''
		}
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(operatorid){
	parent.parent.openWin(BASE_URL+"/enterprise/entoperator/display/"+operatorid,'详细','60%','55%');
}

/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entoperator/delete",
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
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_operator').val("true");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}else{
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_operator').val("false");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}
}

 

