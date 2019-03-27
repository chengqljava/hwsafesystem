
var windowWidth = 70, windowHeight = 70;

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
	
	var colname = ['id', '编号', '举报单位', '举报人', '联系电话', '举报日期', '举报类型', '举报状态code', '举报状态']; 
	
	var colmodel = [
					{name : 'lawcheckreportid', index : 'lawcheckreportid', hidden : true },
					{name : 'lawcheckreportno', index : 'lawcheckreportno', align : 'left', 
						formatter : function(cellvalue, option, obj) {
							return "<a href = 'javascript:void(0)' onclick='display(\""+obj.lawcheckreportid+"\")'>"+obj.lawcheckreportno+"</a>";
						}
					},
					{name : 'reportcompany', index : 'reportcompany', 
						formatter : function( cellvalue, option, obj ) {
							return obj.reportcompany;
						}	
					},
					{name : 'reportpersonid', index : 'reportpersonid', 
						formatter : function( cellvalue, option, obj ) {
							return obj.reportpersonid;
						}	
					},
					{name : 'phone', index : 'phone', 
						formatter : function( cellvalue, option, obj ) {
							return obj.phone;
						}	
					},
					{name : 'reportdate', index : 'reportdate', 
						formatter:function(cellvalue, options, obj) { 
							if (obj.reportdate) {
								return getSmpFormatDateByLong(obj.reportdate, false);
							} else {
								return "";
							}
						}	
					},					
					{name : 'reporttype', index : 'reporttype',
						formatter : function( cellvalue, option, obj ) {
							return SelectOption.getCodeName( reportTypeArr, obj.reporttype);
						}
					},
					{name : 'lawstatus', index : 'lawstatus', hidden : true },
					{name : 'lawstatusstr', index : 'lawstatusstr', 
						formatter : function( cellvalue, option, obj ) {
							if (obj.lawstatus == "2") {
								return "未处理";
							} else if(obj.lawstatus == "6"){
								return "已处理";
							}
						}	
					}					
					
				];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};

    $("#grid-table").jqGrid({
    	height : tableHeight,
    	url : BASE_URL + "/law/lawcheckreport/list",
		datatype : "json",
		cache : false,
		mtype : 'post',
		colNames : colname,
		colModel : colmodel,
		postData : searchParam,
		sortname : 'updatetime',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatit : false
		},
		rowNum : 10,
		rowList :[10, 20, 30],
		altRows : true,
		multiselect : true,
		caption : "举报管理列表",
		autowidth : true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
    
    // 添加
    $("#addBtn").on("click", function () {
    	parent.openWin(BASE_URL + "/law/lawcheckreport/add", '添加', windowWidth + '%', windowHeight + '%');
    });

    // 编辑
    $("#editBtn").on("click", function () {
    	var ids = getSingleIds();
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var lawCheckReportId = rowdata.lawcheckreportid;
    	parent.openWin(BASE_URL + '/law/lawcheckreport/edit/' + lawCheckReportId, '编辑', windowWidth + '%', windowHeight + '%');
    });
    
    // 提交
    $( '#submitBtn' ).on( 'click', function(){
    	
    	var ids = getSingleIds();
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var lawCheckReportId = rowdata.lawcheckreportid;
    	
    	//弹出提示框
    	parent.confirm('确认提交吗?',function(){
    		$.ajax({ 
    	  		url : BASE_URL+"/law/lawcheckreport/submitApplyInfo/" + appId,
    	  		type :'post',
    	  		dataType :'json',
//    	  		data : param,
    	  		success : function(json){
    	  			if(json.success == true){
    	  				parent.toast(json.msg);
    	  				reloadGrid();//刷新列表
    	  			}else{
    	  				parent.toast(json.msg);
    	  			}
    	  		}
    		 });
    	})
    } );
    
    // 处理
    $("#handleBtn").on("click", function () {
    	var ids = getSingleIds();
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var lawstatus = rowdata.lawstatus;
    	if (lawstatus == '6') {
    		parent.toast("请选择一条未处理的数据进行处理！");
    		return;
		}
    	var lawCheckReportId = rowdata.lawcheckreportid;
    	parent.openWin(BASE_URL + '/law/lawcheckreport/toLawCheRepHanPage/' + lawCheckReportId, '处理', windowWidth + '%', windowHeight + '%');
    });
    
    
    // 批量删除
    $("#delBtn").on("click", function () {
    	//返回当前grid中复选框所选择的数据的id 
    	var ids = getManyIds("请选择需要删除的数据!");
    	var equIds = [];
    	var state = "";
    	for(var i = 0; i < ids.length; i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		equIds[i] = rowdatas.lawcheckreportid;
    	}
    	var parmJson = equIds.toString();
    	
    	param = {ids : parmJson};
    	
    	del(param);
    });
    
});

// 加载
function reloadGrid(){
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};
	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : searchParam
	}).trigger("reloadGrid");
}

// 详细查询
function display(lawCheckReportId){
	parent.openWin(BASE_URL+"/law/lawcheckreport/display/" + lawCheckReportId, '举报详情', windowWidth + '%', windowHeight + '%');
}


/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}
/**
 * 获取多条记录id
 * @param message
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:45:13
 */
function getManyIds(message){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}
// 删除方法
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url : BASE_URL+"/law/lawcheckreport/delete",
	  		type :'post',
	  		dataType :'json',
	  		data : param,
	  		success : function(json){
	  			if(json.success == true){
	  				parent.toast(json.msg);
	  				reloadGrid();//刷新列表
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	})
}

// 搜索查询
$("#searchBtn").bind("click", function(){
	reloadGrid();
});

// 重置
$("#resetBtn").bind("click", function(){
	$("#searchForm").find("input, select").filter(":visible").each(function(){
		$(this).val("");
	});
});
