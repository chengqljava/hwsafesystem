$(document).ready(function() {
	initSeachInput();
//	SelectOption.loadisDangSou("isDangSou");//是否重大危险源
//	SelectOption.loadDangerType("dangerType");//重大危险源类别
	
	var colname = ['危险源ID','企业名称','重大危险源名称','重大危险源类型','是否构成重大危险源','辨识']; 
	var colmodel = [
		{name:'DANGERID',index:'DANGERID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'25%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="companydisplay(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DANGERNAME',index:'DANGERNAME',width:'25%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.DANGERID+'\')">'+obj.DANGERNAME+'</a>';
			}
		},
		{name:'DANGERTYPE',index:'DANGERTYPE',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getDangerType(obj.DANGERTYPE);
			}
		},
		{name:'DANGERLEVEL',index:'DANGERLEVEL',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.ISDANGER == 0){
					return "<img src='"+BASE_URL+"/images/tree/no.png' title='否' alt='否'/>"
				}else if(obj.ISDANGER == 1){
					return "<img src='"+BASE_URL+"/images/tree/yes.png' title='是' alt='是'/>"
				}else{
					return "";
				}
//				else if(null!=obj.DANGERLEVEL && obj.DANGERLEVEL !=undefined && obj.DANGERLEVEL>0){
//					return "<img src='"+BASE_URL+"/images/tree/yes.png' title='是' alt='是'/>"
//				}else{
//					return "<img src='"+BASE_URL+"/images/tree/no.png' title='否' alt='否'/>"
//				}
			}
		},
		{name:'commands',index:'commands',width:'15%',align:'left'}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/dangersource/dssdangerinfo/zfDangerDiscrenList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			dangSouName:$("#dangSouName").val(),
			entname:$("#entname").val(),
			isDangSou:$("#isDangSou").val(),
			districtid:$("#districtid").val(),
			dangerType:$("#dangerType").val()
		},
		sortname : 'null',
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
		caption: "重大危险源辨识列表",
		autowidth: true,
		loadComplete : function() {
			if($(window).width() < 700) {
				$("#grid-table").jqGrid( 'setGridHeight', 500);
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
			//返回当前grid里所有数据的id 
			var cheids = $("#grid-table").jqGrid("getDataIDs");
			for(var i=0; i<cheids.length; i++){
				var id = cheids[i]; 
				//返回指定id行的数据 
				var rowdatas = $("#grid-table").jqGrid('getRowData',id);
				//返回所在行数据的主键
				var id = rowdatas!=null?rowdatas.DANGERID:"";
				var commandshtml = "<a href='javascript:void(0);' class ='discern_btn' onclick=discern('"+id+"') title='辨识'></a>";
				//设置自定义按钮
				$("#grid-table").jqGrid('setRowData',cheids[i],{ commands: commandshtml}); 
			}
		}
	});
});
/**
 * @param dangerId 危险源Id
 * @author lzqiang
 * @date 2016年7月6日 下午1:41:13
 */
function discern(dangerId){
	parent.openWin(BASE_URL+"/dangersource/dssdangerinfo/discernEdit/"+dangerId,'辨识','60%','55%');
}

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	var dangerType = $("#dangerType").val();
	if ('危险化学品类' == dangerType) {
		dangerType = '1';
	}else if('燃气类' == dangerType){
		dangerType = '2';
	}else if('港口类' == dangerType){
		dangerType = '3';
	}else{
		dangerType = '';
	}
	var isDangSou = $("#isDangSou").val();
	if ('是' == isDangSou) {
		isDangSou = '1';
	}else if('否' == isDangSou){
		isDangSou = '2';
	}else{
		isDangSou = '';
	}
	
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			dangSouName:$("#dangSouName").val(),
			entname:$("#entname").val(),
			isDangSou:isDangSou,
			districtid:$("#districtid").val(),
			dangerType:dangerType
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});

function display(dangerid){
	parent.openWin(BASE_URL+"/dangersource/dssdangerinfo/pageTab/"+dangerid,'详细','60%','75%');
}

/*详细查询*/
function companydisplay(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}