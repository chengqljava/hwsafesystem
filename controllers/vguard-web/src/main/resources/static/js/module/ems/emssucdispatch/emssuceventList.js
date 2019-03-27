$(document).ready(function() {
	var colname = ['主键','事故类型编号','事故名称','发生时间','发生地址','事故类型','事故等级','事故原因','事故概述','状态']; 
	var colmodel = [{name:'EVENTID',index:'EVENTID',hidden:true,key:true},
	                {name:'EVENTTYPE',index:'EVENTTYPE',hidden:true},
					{name:'EVENTNAME',index:'EVENTNAME',
            			formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="displayEvent(\''+obj.EVENTID+'\')">'+obj.EVENTNAME+'</a>';
                        }
					},
					{name:'TIME',index:'TIME',
					    formatter:function(cellvalue, options, obj) { 
                            return getSmpFormatDateByLong(obj.TIME,true);
                        }
                    },
					{name:'ADDRESS',index:'ADDRESS'},
					{name:'EVENTTYPENAME',index:'EVENTTYPENAME'},
					{name:'EVENTLEVEL',index:'EVENTLEVEL',
					   formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getAcclevel(obj.EVENTLEVEL);
                        }
					},
					{name:'REASON',index:'REASON'},
					{name:'CONTENT',index:'CONTENT'},
					{name:'STATE',index:'STATE',
						formatter:function(cellvalue, options, obj) { 
							return SelectOption.getEmsSucState(obj.STATE);
						}
					}
			       ];
	
	//var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		//$("#grid-table-event").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table-event").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table-event").jqGrid({
    	height: 150,
    	url : BASE_URL + "/ems/emssucevent/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			name:null,
			stime:null,
			etime:null,
			state:3
		},
		sortname : 'UPDATETIME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager-event",
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
		multiselect: true,
		multiboxonly: true, //只有当multiselect = true.起作用，当multiboxonly 为ture时只有选择checkbox才会起作用
		//multikey: 'shiftKey',
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		caption: "事故信息列表",
		autowidth: true,
		loadComplete:function(){
			var ids = $("#grid-table-event").getDataIDs();//获取列表所有id
			//默认选择第一行
			$("#grid-table-event").setSelection(ids[0]);
			reloadallgrid(ids[0]);
			
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table-event").css({"width":"900"});
				$("#grid-table-event").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table-event").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		},
		onSelectRow: function(rowid) { //单击选择行
			reloadallgrid(rowid);
        }
	});
});

/*重新加载*/
function reloadallgrid(rowid){
	var rowdatas = $("#grid-table-event").jqGrid('getRowData',rowid);
	$('#eventid').val(rowdatas.EVENTID);
	$('#eventtype').val(rowdatas.EVENTTYPE);
	//重新加载事故类型
	reloadGridCase();
	//重新加载预案列表
	initPlanGrid();
	reloadGridPlaninfo();
	
}



//重新加载应急处置（任务时间轴）
//showdispatch(rowdatas.EVENTID);

/*ajax方式显示指挥调度*/
function showdispatch(eventid){
	//事件id
	var param = {"eventid":eventid};
	$.ajax({ 
  		url: BASE_URL+"/ems/emssucdispatch/showdispatch",
  		type:'post',
  		dataType:'json',
  		data:param,
  		success: function(json){
  			if(json.success==true){
  				$('#linediv').empty();//清空时间轴信息
  				var data = json.data;
  				if(data.length>0){
  					var htmltext = '';
  					var newyear = '';
  					htmltext = '<ul class="cbp_tmtimeline">';
  					for (var i = 0; i < data.length; i++) {
  						var disyear = data[i].DISTIME.substr(0, 4)
  						if(newyear != disyear){
  							newyear = disyear;
  							htmltext += '<li><img src="'+BASE_URL+'/images/theme/blue/timeIcon.png" class="timeicon"><time class="cbp_tmtime tmtime" datetime="2013"><span>'+disyear+'</span></time></li>';
  						}
  						htmltext +='<li><time class="cbp_tmtime"><span>'+data[i].DISTIME.substr(5,5)+'</span></time><div class="cbp_tmicon"></div><div class="cbp_tmlabel"><h3>'+data[i].DISTITLE+'</h3><p>'+data[i].DISCONTENT+'</p><br><p style="text-align:right">'+data[i].DISTIME+'</p></div></li>';
  					}
  					htmltext += '</ul>'
  					$("#linediv").append(htmltext);
  				}
  			}else{
  				parent.toast(json.msg);
  			}
  		}
	 });
}

/*加载*/
function reloadGridEvent(){
	$("#grid-table-event").jqGrid('setGridParam',{
		page:1,postData:{
			name:null,
            stime:null,
            etime:null,
            state:3
		}
	}).trigger("reloadGrid");
}


/*指挥调度*/
$("#disBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = getSingleIds();
	var rowdata = $("#grid-table-event").jqGrid('getRowData',ids[0]); //选中的一条记录
	if(rowdata.STATE == '已结案'){
		// 弹出提示信息
		parent.toast("不能对已结案的事故进行指挥调度！");
		return;
	}
	var eventid = rowdata.EVENTID;
	parent.openWin(BASE_URL+'/ems/emssucdispatch/add/'+eventid,'添加','35%','45%');
	
});

/*结案*/
$("#knotBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	/*  //批量结案
	var ids = getManyIds("请选择需要结案的数据!");
	var eventids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table-event").jqGrid('getRowData',id);
		if(rowdatas.STATE != '已处理'){
			// 弹出提示信息
			parent.toast("请选择未结案的记录！");
			return;
		}
		eventids[i]= rowdatas.EVENTID;
	}*/
	var eventid=[];
	var ids = getSingleIds();
	var rowdata = $("#grid-table-event").jqGrid('getRowData',ids[0]); //选中的一条记录
/*	if(rowdata.STATE != '已处理'){
		// 弹出提示信息
		parent.toast("请选择未结案的记录！");
		return;
	}*/
	eventid[0] = rowdata.EVENTID;
	var parmJson = eventid.toString();
	var param = {"ids":parmJson};
	
	//弹出提示框
	parent.confirm('确认结案吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/ems/emssucevent/knot",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.toast(json.msg);
	  				reloadGridEvent();//刷新列表
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	});
});

/*详细查询*/
function displayEvent(eventid){
	parent.openWin(BASE_URL+"/ems/emssucevent/display/"+eventid,'详细','65%','75%');
}

/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table-event").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条事故信息！");
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
	var ids = $("#grid-table-event").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}

