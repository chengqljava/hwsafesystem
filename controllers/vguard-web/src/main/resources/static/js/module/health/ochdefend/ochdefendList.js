$(document).ready(function() {
	initSeachInput();
//	SelectOption.loadDefendType("detype");//防治类型
	var colname = ['主键','设备名称','防护表类型','设备型号 ','设备数量','购进日期','存放地点','保管人','状态',"操作"]; 
	var colmodel = [
					{name:'DEFEID',index:'DEFEID',hidden:true},
					{name:'DENAME',index:'DENAME',width:'10%',
					   formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.DEFEID+'\')">'+obj.DENAME+'</a>';
                        }
                    },
					{name:'DETYPE',index:'DETYPE',width:'7%',
					    formatter:function(cellvalue, options, obj) { 
					    	return SelectOption.getDefendType(obj.DETYPE);
                        }
                    },
					{name:'MODEL',index:'MODEL',width:'8%'},
					{name:'QUANTITY',index:'QUANTITY',width:'5%'},
					{name:'UPDATETIME',index:'UPDATETIME',width:'10%',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.UPDATETIME,
									"yyyy-MM-dd");
						}
					},
					{name:'PLACE',index:'PLACE',width:'10%'},
					{name:'PRESERVER',index:'PRESERVER',width:'8%'},
					{name:'DATATATE',index:'DATATATE',width:'7%',hidden:true,
					   formatter:function(cellvalue, options, obj) { 
						   return SelectOption.getOchDefendDatatate(obj.DATATATE)
						   
                           
                        }
                    },
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.DEFEID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.DEFEID+'\')">删除</a>'
            		}}
			];
	if($("#usertype").val()!='ENT'){
	    //政府端查看
		colname.splice(2,0,"企业名称");
		colmodel.splice(2,0,{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="entdisplay(\''+obj.BUSINESSINFOID+'\')">'+obj.ENTNAME+'</a>';
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
    	url : BASE_URL + "/health/ochdefend/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			dename:"",
			detype:""
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
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "防护设备器材列表",
		autowidth: true,
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
//编辑
function editInfo(defeid) {
	parent.openWin(BASE_URL+'/health/ochdefend/edit/'+defeid,'编辑','55%','50%');
}
// 删除
function delInfo(defeid) {
	var param = {"ids":defeid};
	del(param);
}
/*加载*/
function reloadGrid(){
	var detype = $("#detype").val();
	if(detype == "正常运行"){
		detype = "1";
	} else if(detype == "停止运行"){
		detype = "2";
	} else if(detype == "维护中"){
		detype = "3";
	} else if(detype == "报废"){
		detype = "4";
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			dename:$("#dename").val(),
			detype:detype
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
function resetData(){
	$("#searchForm").each(function(){
		$(this).val("");
	});
}
/*企业详细查询*/
function entdisplay(businessinfoid){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'企业信息','90%','90%');
}

/*详细查询*/
function display(defeid){
	parent.openWin(BASE_URL+"/health/ochdefend/display/"+defeid,'详细','55%','50%');
}


/**
 * 值选择一条记录
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
 * 获取多条数据
 * @param message
 * @returns
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
/*删除方法*/
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/health/ochdefend/delete",
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

/**
 *企业上报 
 */
function report(param){
    //弹出提示框
    parent.confirm('确认上报吗?',function(){
        $.ajax({ 
            url: BASE_URL+"/health/ochdefend/report",
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
