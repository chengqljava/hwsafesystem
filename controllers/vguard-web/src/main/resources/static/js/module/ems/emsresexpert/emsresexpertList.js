$(document).ready(function() {
	initSeachInput();
//	SelectOption.loadExpertType("experttype")
	
	var colname = ['编号','姓名','区域','性别','专家类别','专业领域','技术职称','办公电话','手机号码','工作单位','填报单位',"操作"]; 
	var colmodel = [
					{name:'EXPERTID',index:'EXPERTID', width:'5%',hidden:true},
					{name:'NAME',index:'NAME', width:'5%',align:'center',sortable : false,
						formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.EXPERTID+'\')">'+obj.NAME+'</a>';
                        }
					},
					{name:'DISTRICTNAME',index:'DISTRICTNAME', width:'10%', align:'left'},
					{name:'SEX',index:'SEX', width:'2%', align:'center', 
						formatter : function(cellvalue, options, obj) {
							return obj.SEX != null ? SelectOption.getSex(obj.SEX) : "";
						}
					},
					{name:'EXPERTTYPE',index:'EXPERTTYPE', width:'5%', align:'center'},
					{name:'MAJOR',index:'MAJOR', width:'5%', align:'center'},
					{name:'TECHNICAL',index:'TECHNICAL', width:'5%', align:'center', 
						formatter : function(cellvalue, options, obj) {
							return obj.TECHNICAL != null ? SelectOption.getTechnical(obj.TECHNICAL) : "";
						}},
					{name:'OFFICETEL',index:'OFFICETEL', width:'5%', align:'center'},
					{name:'PHONE',index:'PHONE', width:'5%', align:'center'},
					{name:'UNIT',index:'UNIT', width:'10%', align:'center'},
					{name:'FILLORGANNAME',index:'FILLORGANNAME', width:'5%', hidden: true,align:'center'},
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.EXPERTID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.EXPERTID+'\')">删除</a>'
            		}}
			     ];
	if($("#usertype").val()=='ENT'){
	    //企业
		colname.push("上报状态");
		colmodel.push({name:'FILLSTATE',index:'FILLSTATE', width:'5%',align:'center',hidden: true,
                       formatter:function(cellvalue, options, obj) { 
                           return SelectOption.getEmsState(cellvalue);
                        }
                    }); 
	}
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsresexpert/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			name:$("#name").val(),
			experttype:$("#experttype").val(),
			unit:$("#unit").val(),
			districtid:$("#districtname_select").val(),
			planId : $('#planId').val()
		},
		sortname : 'EXPERTID',
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
		caption: "应急专家列表",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
});

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtname_select").val(districtid);
	reloadGrid();
}
function editInfo(expertid) {
	parent.openWin(BASE_URL+'/ems/emsresexpert/edit/'+expertid,'编辑','65%','85%');
}
function delInfo(id) {
	var param = {"ids":id};
	del(param);
}
/*删除方法*/
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/ems/emsresexpert/delete",
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
/*加载*/
function reloadGrid(){
	var experttype = $("#experttype").val();
	if (experttype == '煤矿') {
		experttype ='1';
	}else if(experttype == '非煤矿山'){
		experttype ='2';
	}else if(experttype == '化工'){
		experttype ='3';
	}else if(experttype == '烟花爆竹'){
		experttype ='4';
	}else if(experttype == '冶金工贸'){
		experttype ='5';
	}else if(experttype == '建筑消防'){
		experttype ='6';
	}else if(experttype == '交通运输'){
		experttype ='7';
	}else if(experttype == '职业健康'){
		experttype ='8';
	}else if(experttype == '应急救援'){
		experttype ='9';
	}else if(experttype == '法规科技'){
		experttype ='10';
	}else if(experttype == '其他行业'){
		experttype ='11';
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			name:$("#name").val(),
			experttype:experttype,
			unit:$("#unit").val(),
			districtid:$("#districtname_select").val(),
			planId : $('#planId').val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#searchForm").find("input,select").each(function(){
		$(this).val("");
	});
});





/*详细查询*/
function display(expertid){
	parent.openWin(BASE_URL+"/ems/emsresexpert/display/"+expertid,'详细','65%','85%');
}








/**保存*/
function save(expertIdsStr){

	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emsplaexpert/save',
		cache : false,
		dataType : 'json',
		data : {planId : $('#planId').val(), expertIds : expertIdsStr},
		global : false,
		success : function(json) {
			if(json.success == true){
				parent.toast(json.msg);//弹出提示信息
				var frameLen = parent.parent.frames.length;
				parent.parent.frames[frameLen - 1].frames["chemIframe"].reloadGrid();
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

/**
 * 选择一条记录
 */
$("#submitbtn").on("click",function(){
	
	var expertIds = [];
	var rowData, expertId;
	
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length < 1){
		// 弹出提示信息
		parent.toast("请选择至少一条记录！");
		return;
	}
	
	for(var i = 0; i < ids.length; i++){
		rowData = $("#grid-table").jqGrid('getRowData', ids[i]); //选中的一条记录
		expertId = rowData.EXPERTID;
		expertIds.push(expertId);
	}
	
	save(expertIds + '');
	
});