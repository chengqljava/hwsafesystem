$(document).ready(function() {
	initDateSeach("stime","etime");
	var colname = ['主键','设备名称','型号 ','规格','数量','进购日期','存放地点','保管人员','状态',"操作"]; 
	var colmodel = [
					{name:'EQID',index:'EQID',hidden:true},
					{name:'DEVICENAME',index:'DEVICENAME',width:'10%',
					   formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.EQID+'\')">'+obj.DEVICENAME+'</a>';
                        }
                    },
					{name:'MODEL',index:'MODEL',width:'10%'
                    },
					{name:'SPECIFICATIONS',index:'SPECIFICATIONS',width:'5%'},
					{name:'NUM',index:'NUM',width:'5%'},
					{name:'PURCHASE',index:'PURCHASE',align:'center',width:'8%',
						formatter:function(cellvalue, options, obj) { 
							if(obj.PURCHASE == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.PURCHASE,false);
						},},
					{name:'STORAGE',index:'STORAGE',width:'10%'},
					{name:'CUSTODIAN',index:'CUSTODIAN',width:'8%'},
					{name:'FILSTATE',index:'FILSTATE',width:'8%',hidden:true,
					   formatter:function(cellvalue, options, obj) { 
                           return SelectOption.getOchWorkerState(obj.FILSTATE);
                        }
                    },
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.EQID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.EQID+'\')">删除</a>'
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
    	url : BASE_URL + "/health/ochequipment/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			curetitle:$("#curetitle").val(),
			purchase:""
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
		caption: "消防器材列表",
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

//编辑
function editInfo(chemcatalid) {
	parent.openWin(BASE_URL+'/health/ochequipment/edit/'+chemcatalid,'编辑','55%','50%');
}
// 删除
function delInfo(chemcatalid) {
	var param = {"ids":chemcatalid};
	del(param);
}
/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			curetitle:$("#curetitle").val(),
			stime:$("#stime").val(),
			etime:$("#etime").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#stime").val("");
	$("#etime").val("");
	$("#curetitle").val("");
}


/*企业详细查询*/
function entdisplay(businessinfoid){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'企业信息','90%','90%');
}

/*详细查询*/
function display(eqid){
	top.openWin(BASE_URL+"/health/ochequipment/display/"+eqid,'详细','55%','50%');
}

/*删除方法*/
function del(param){
	    //弹出提示框
		parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/health/ochequipment/delete",
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
