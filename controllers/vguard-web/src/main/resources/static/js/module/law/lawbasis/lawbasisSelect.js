$(document).ready(function() {
	
	$("#condition").autocomplete({
		delay: 500,
		minLength: 2,
	    source: BASE_URL + "/law/lawbasis/autocomplete"
	});
	
	SelectOption.loadLawBasisType("basistypecode");
	
	var colname = ['执法依据id','类别','违法行为描述','违法行为描述详情','法律规定','处罚依据','实施标准']; 
	var colmodel = [
		{name:'basisid',index:'basisid', width:'5%',hidden: true},
		{name:'basistypecode',index:'basistypecode',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return obj.basistypename;
			}
		},
		{name:'behavior',index:'behavior',width:'85%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.basisid+'\')">'+cellvalue+'</a>';
			}
		},
		{name:'behaviorinfo',index:'behaviorinfo',width:'20%',align:'center',hidden: true,
			formatter:function(cellvalue, options, obj) { 
				return obj.behavior;
			}	
		},
		{name:'lawrule',index:'lawrule',width:'20%',align:'center',hidden: true},
		{name:'punish',index:'punish',width:'20%',align:'center',hidden: true},
		{name:'standard',index:'standard',width:'20%',align:'center',hidden: true}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33);
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawbasis/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			basistypecode:$("#basistypecode").val(),
			condition:$("#condition").val()
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
		rowNum:1000,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "执法指引",
		autowidth: true,
		scroll: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			basistypecode:$("#basistypecode").val(),
			condition:$("#condition").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#basistypecode").val();
	$("#condition").val();
});


/*详细查询*/
function display(basisid){
	parent.openWin(BASE_URL+"/law/lawbasis/display/"+basisid,'详细','70%','80%');
}

var arrayNewList = new Array();//保存表格勾选数据的id
$("#confirmBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length == 0) {
		// 弹出提示信息
		parent.toast("请选择检查项！");
		return;
	}
	if(ids.length > 10) {
		// 弹出提示信息
		parent.toast("检查项最多选择10项！");
		return;
	}
	
	var htmlcontent = "";
	var dangerinfo = "";
	var code = "";
	for (var i = 0; i < ids.length; i++) {
		// 返回指定id行的数据
		var id = ids[i];
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		//执法依据主键隐藏域
		htmlcontent += "<p><input type='hidden' id='basisids' name='basisids' value='"+rowdatas.basisid+"'/>"
		htmlcontent += "<input type='checkbox'  name='dangertype'  value='"+(i+1)+"' onclick = 'checkclick(this);' >";
		htmlcontent += "<input class='textarea' id='dangerinfo' name='dangerinfo' style='width: 100%; line-height: 20px;' value="+(i+1)+"、"+rowdatas.behaviorinfo+">";
		//htmlcontent += i+1+"、"+rowdatas.behaviorinfo+"\n";
		code += (i+1)+",";
		dangerinfo += i+1+"、"+rowdatas.behaviorinfo+"\n";
		htmlcontent += "</input></p>";
	}
	code = code.substring(0,(code.length-1)); 
	parent.frames["contentIframe"].$('#rectcontentfast').val(code);
	parent.frames["contentIframe"].$('#rectcontent').val("");
	parent.frames["contentIframe"].$('#dangerinfoStr').val(dangerinfo);
	parent.frames["contentIframe"].$("#exaconditionDiv").html(htmlcontent);
	arrayNewList = null;//清空数组
	parent.closeWin()
});

