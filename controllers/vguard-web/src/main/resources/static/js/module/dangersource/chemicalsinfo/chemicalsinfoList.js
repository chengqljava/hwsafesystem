$(document).ready(function() {
	//危化品类别
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/knowledge/knochemicalcatal/chemicaltypeselect","chemicaltypeid",{"parent":"-1"});
	//操作项表格
	var colname = ['危化品名录库Id','危化品Id','危化品名称','危化品类别','UN号','生产用途','物理状态(单个容器)','操作温度(单个容器)','操作压力(单个容器)','存量(单个容器)','单元内危险化物设计存量','临界量','MSDS'];
	var colmodel = [
	    {name:'CHEMCATALID',index:'CHEMCATALID',hidden:true},
		{name:'DANGCHEMID',index:'DANGCHEMID',hidden: true},
		{name:'CHEMCATALNAME',index:'CHEMCATALNAME',width:"10%",align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.CHEMCATALID+'\')">'+obj.CHEMCATALNAME+'</a>';
			}
		},
		{name:'DANGERTYPENAME',index:'DANGERTYPENAME',width:"10%",align:'left'},
		{name:'UN',index:'UN',align:'left',width:"7%"},
		{name:'DANCHEMUSE',index:'DANCHEMUSE',width:"11%",align:'left',edittype:"select",editoptions : {value : "0:请选择;1:原料;2:中间产物;3:产品;4:其他"},formatter:'select'},
		{name:'PHYSICSSTATE',index:'PHYSICSSTATE',width:"11%",align:'left',edittype:"select",editoptions : {value : "0:请选择;1:液体;2:固态;3:液气共存;4:固态"},formatter:'select'},
		{name:'OPERATET',index:'OPERATET',width:"8%",align:'left'},
		{name:'OPERATEP',index:'OPERATEP',width:"8%",align:'left'},
		{name:'CURRENTNUM',index:'CURRENTNUM',width:"7%",align:'left'},
		{name:'UNITNUM',index:'UNITNUM',width:"16%",align:'left'},
		{name:'LIMITNUM',index:'LIMITNUM',width:"7%",align:'left'},
		{name:'MSDS',index:'MSDS',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.MSDS=="true"){
					return '<a href="javascript:void(0);" onclick="gotoMSDS(\''+obj.CAS+'\',\''+obj.UN+'\')">进入</a>';
				}else{
					return '';
				}
			}
		}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -60;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 60 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() -48 );
	});
    
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	width:$(window).width() - 48,
    	url : BASE_URL + "/dangersource/dsschemicalsinfo/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			dangerid:$("#dangerid").val(),
			chemcatalname:$("#chemcatalname").val(),
			chemicaltypeid:$("#chemicaltypeid").val(),
			un:$("#un").val()
		},
		sortname : 'UPDATETIME',
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
		rowNum:5,
		rowList:[5,10,15],
		altRows: true,
		multiselect: true,
		caption: "危险化学品信息",
		//autowidth: true,
		loadComplete: function() {
			if ($("#closeBtn").length==0) {
				$("body").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center; margin-top: 10px;">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
		}
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			dangerid:$("#dangerid").val(),
			chemcatalname:$("#chemcatalname").val(),
			chemicaltypeid:$("#chemicaltypeid").val(),
			un:$("#un").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});

function gotoMSDS(cas,un){
	parent.parent.parent.openWin(BASE_URL + "/knowledge/knomsds/chemsds?casno="+cas+"&unno="+un, '详细', "65%", "75%");
}

/*详细查询*/
function display(chemcatalid){
	parent.openWin(BASE_URL+"/knowledge/knochemicalcatal/display/"+chemcatalid,'详细','60%','75%');
}