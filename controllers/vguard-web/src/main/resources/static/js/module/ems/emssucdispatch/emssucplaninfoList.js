//初始化应急预案列表
function initPlanGrid(){
	var colname = ['预案id','预案编号','预案名称','编制单位','所属区域','预案类型','发布时间']; 
	var colmodel = [
		{name:'PLANID',index:'PLANID', width:'5%',hidden: true,key:true},
		{name:'PLANNO',index:'PLANNO',width:'10%',align:'left'},
		{name:'PLANNAME',index:'PLANNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayPlaninfo(\''+obj.PLANID+'\')">'+obj.PLANNAME+'</a>';
			}
		},
		{name:'UNITNAME',index:'UNITNAME',width:'10%',align:'left'},
		{name:'DISTRICTNAME',index:'DISTRICTNAME',width:'10%',align:'left'},
		{name:'PLANTYPE',index:'PLANTYPE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.PLANTYPE){
					return SelectOption.getEmsPlanType(obj.PLANTYPE);
				}else{
					return '';
				}
			}
		},
		{name:'RELEASETIME',index:'RELEASETIME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.RELEASETIME){
					return getSmpFormatDateByLong(obj.RELEASETIME, false);
				}else{
					return '';
				}
			}
		}
	];

	//var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table-planinfo").jqGrid( 'setGridWidth', $('.rightCell').width()*0.99 );
	});
	
	var planinfourl = '/ems/emsplaplaninfo/entlist';
	if($('#type').val() == "GOV"){
		planinfourl = '/ems/emsplaplaninfo/govlist';
	}
		
    $("#grid-table-planinfo").jqGrid({
    	height: 250,
    	url : BASE_URL + planinfourl,
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			planname:null,
			plantype:null,
			planstate:null,
			districtid:null,
			eventtype:$('#eventtype').val()
		},
		sortname : 'UPDATETIME',
		sortorder : "desc",
		//viewrecords : true,是否显示总记录数
		pager : "#grid-pager-planinfo",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		hidegrid:false,//启用或者禁用控制表格显示、隐藏的按钮，只有当caption 属性不为空时起效,默认为true
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		//multiselect: true,
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		caption: "应急预案",
		autowidth: true,
		loadComplete:function(){
			var ids = $("#grid-table-planinfo").getDataIDs();//获取列表所有id
			//默认选择第一行
			$("#grid-table-planinfo").setSelection(ids[0]);
			changeRes(ids[0]);
			
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table-planinfo").css({"width":"900"});
				$("#grid-table-planinfo").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table-planinfo").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		},
		onSelectRow: function(rowid) { //单击选择行
			changeRes(rowid);
		}
	});
	
}
/*动态更改资源信息*/
function changeRes(rowid){
	var rowdatas = $("#grid-table-planinfo").jqGrid('getRowData',rowid);
	var planid = rowdatas.PLANID;
	$("#entwarehouse").click();
	$("#entwarehouse").attr("url",BASE_URL+"/ems/emssucdispatch/resource/team/"+planid);
	$("#entcheengdevice").attr("url",BASE_URL+"/ems/emssucdispatch/resource/expert/"+planid);
	$("#entstoragetank").attr("url",BASE_URL+"/ems/emssucdispatch/resource/material/"+planid);
	$("#chemIframe").attr("src",BASE_URL+"/ems/emssucdispatch/resource/team/"+planid);
}


/*加载*/
function reloadGridPlaninfo(){
	$("#grid-table-planinfo").jqGrid('setGridParam',{
		page:1,postData:{
			planname:null,
			plantype:null,
			planstate:null,
			districtid:null,
			eventtype:$('#eventtype').val()
			}
	}).trigger("reloadGrid");
}



/*详细查询*/
function displayPlaninfo(planid){
	parent.openWin(BASE_URL+'/ems/emsplaplaninfo/labelpage/menuDisplay/'+planid,'预案信息','70%','80%');
}



 

