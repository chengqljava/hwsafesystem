$(document).ready(function() {
	
	var colname = ['企业名称','上报周期','最新上报日期','上报次数','自查项数','隐患数','已整改数','整改率','自查状态']; 
	var colmodel = [
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'STRINGQUARTER',index:'STRINGQUARTER', width:'10%',align:'center'},
		{name:'RECORDTIME',index:'RECORDTIME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.RECORDTIME) {
					return getSmpFormatDateByLong(obj.RECORDTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'RECORDCOUNT',index:'RECORDCOUNT',width:'5%',align:'center'},
		{name:'ITEMCOUNT',index:'ITEMCOUNT',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayCheckList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.CHECKITEMCOUNT + "/" + obj.ITEMCOUNT+'</a>';
			}
		},
		{name:'DANGERCOUNT',index:'DANGERCOUNT',width:'5%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayDangerList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.DANGERCOUNT+'</a>';
			}
		},
		{name:'NODANGERCOUNT',index:'NODANGERCOUNT',width:'5%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayNoDangerList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.NODANGERCOUNT+'</a>';
			}
		},
		{name:'ZGL',index:'ZGL',width:'5%',align:'center'},
		{name:'CHECKSTATE',index:'CHECKSTATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.CHECKSTATE=='未自查'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='未自查'/>";
				}else if(obj.CHECKSTATE=='已自查'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightgreen.gif' title='已自查'/>";
				}else{
					return "<img src='"+BASE_URL+"/images/permitlight/lightyellow.gif' title='自查中'/>";
				}
			}
		}
	];
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdigovchecklist/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			address:$("#address").val(),
			isscale:$("#isscale").val(),
			restate:$("#restate").val(),
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			islittle:$("#islittle").val(),
			//orgid:$("#orgname_select").val(),
			subjection:$("#subjection").val(),
			checkresult:$("#checkresult").val(),
			directortypeid:$("#directortypeid").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'RECORDTIME',
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
		multiselect: false,
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
});

/**
 * 企业安全信息
 * @param businessinfoid
 * @param entname
 */
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/**
 * 企业自查项列表
 * @param businessinfoid
 * @param entname
 */
function displayCheckList(businessinfoid,entname){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayCheckList?businessinfoid="+businessinfoid+"&year="+year+"&quarter="+quarter+"&inspectionid=",entname+' 自查列表','70%','60%');
}


/**
 * 企业隐患列表
 * @param businessinfoid
 * @param entname
 */
function displayDangerList(businessinfoid,entname){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayDangerList?businessinfoid="+businessinfoid+"&year="+year+"&quarter="+quarter,entname+' 隐患列表','70%','60%');
}

/**
 * 企业已整改隐患列表
 * @param businessinfoid
 * @param entname
 */
function displayNoDangerList(businessinfoid,entname){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayDangerList?businessinfoid="+businessinfoid+"&year="+year+"&quarter="+quarter+"&yesabarbeitung=1",entname+' 已整改隐患列表','70%','60%');
}
 

