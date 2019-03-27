$(document).ready(function() {
//	SelectOption.loadSubjection("subjection");//单位管辖隶属关系
	initSeachInput();
	//2017-5-20 qys 去掉审核状态
	// var colname = ['主键id','企业用户id','企业名称','行业主管分类','行业行政主管部门','注册地址','注册时间','注册用户','注册部门'];
	//2017-11-1 yxx 去掉企业用户id
	//var colname = ['主键id','企业用户id','企业名称','行业主管分类','行业行政主管部门','注册地址','注册时间','注册用户','注册部门','审核状态'];
	var colname = ['主键id','企业名称','行业主管分类','行业行政主管部门','注册地址','注册时间','注册用户','注册部门','操作'];
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		//{name:'USERID',index:'USERID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'20%',align:'left'},
		{name:'INDUSTRYORGNAME',index:'INDUSTRYORGNAME',width:'30%',align:'left'},
		{name:'ADDRESS',index:'ADDRESS',width:'20%',align:'left'},
		{name:'REGISTERDATE',index:'REGISTERDATE',width:'15%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.REGISTERDATE,
						"yyyy-MM-dd hh:mm:ss");
			}
		},
		{name:'NICKNAME',index:'NICKNAME',width:'10%',align:'left'},
		{name:'ORGNAME',index:'ORGNAME',width:'10%',align:'left'}/*,
		//2017-5-20 qys 去掉审核状态
		{name:'CHECKSTATES',index:'CHECKSTATES',width:'10%',align:'left',
			editoptions : {value : "0:未审核;1:已审核"},formatter : 'select'
		}*/,
		{name:'OPERATION',index:"OPERATION",width:'80px',align:"left",fixed:true,formatter:function(cellvalue, options, obj){
			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.BUSINESSINFOID+'\')">编辑</a>'
			     //+ '<a href="javascript:void(0);" title="修改密码" class="operation editPwdBtn" onclick="editPwd(\''+obj.USERID+'\')"></a>'
		}}
	];
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});
	$('#flexDiv').on('click',function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	})
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entbusinessinfo/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			registernum:$("#registernum").val(),
			subjection:$("#subjection").val(),
			entcode:$("#entcode").val(),
			datastatus:$("#datastatus").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'updatetime',
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
		caption: "工商信息",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$("#grid-table").jqGrid( 'setGridHeight', 500 );
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
});

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	var subjection='';
	if ($("#subjection").val() =='市属行业部门管理单位') {
		subjection ='1';
	}else if($("#subjection").val() =='区属行业部门管理单位'){
		subjection ='2';
	}else if($("#subjection").val() =='街镇行业部门管理单位'){
		subjection ='3';
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					entname:$("#entname").val(),
					registernum:$("#registernum").val(),
//					subjection:$("#subjection").val(),
					subjection:subjection,
					entcode:$("#entcode").val(),
					datastatus:$("#datastatus").val(),
					districtid:$("#districtid").val()
			             }
	}).trigger("reloadGrid");
}

function editInfo(id){
	parent.openWin(BASE_URL+'/enterprise/entbusinessinfo/edit/'+id,'编辑工商信息','','85%');
}
function editPwd(id){
	parent.openWin(BASE_URL + '/system/sysuser/reset/' + id,'密码修改', "25%", "30%");
}
/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});
/*重置*/
$("#resetBtn").bind("click",function(){
	$("#entname").val("");
	$("#registernum").val("");
	$("#subjection").val("");
	$("#entcode").val("");
});

/*详细查询*/
function display(businessinfoid){
	parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/"+businessinfoid,'详细','','85%');
}


