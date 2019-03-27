$(document).ready(function() {
	initSeachInput();
    var isGOVUser = $("#isGOVUser").val();
//	SelectOption.loadEducation("education");//学历
//	SelectOption.loadSex("sex");//性别
	var colname = ['企业','主键id','姓名','出生日期','联系电话','性别','民族','总工龄','接害工龄','家庭住址','工种','学历','技术职称','职业健康检查表编号','所在作业场所名称','状态',"操作"]; 
	var colmodel = [
					{name:'ENTNAME',index:'ENTNAME'},
					{name:'WORKERID',index:'WORKERID',hidden:true},
					{name:'NAME',index:'NAME',formatter:
                           function(cellvalue, options, obj) { 
                              return '<a href="javascript:void(0);" onclick="display(\''+obj.WORKERID+'\')">'+obj.NAME+'</a>';
                           }
                    },
					{name:'BIRTHDAY',index:'BIRTHDAY',formatter:
					       function(cellvalue, options, obj) { 
                              return getSmpFormatDateByLong(obj.BIRTHDAY,false);
                           }
                    },
					{name:'TEL',index:'TEL'},
					{name:'SEX',index:'SEX',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getSex(obj.SEX);
                         }
                    },
					{name:'NATION',index:'NATION',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getNation(obj.NATION);
                         }
                    },
					{name:'WORKAGE',index:'WORKAGE'},
					{name:'INDIRECTHARMAGE',index:'INDIRECTHARMAGE'},
					{name:'ADDRESS',index:'ADDRESS'},
					{name:'WORKTYPE',index:'WORKTYPE'},
					{name:'EDUCATION',index:'EDUCATION',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getEducation(obj.EDUCATION);
                         }
                    },
					{name:'TECHNICAL',index:'TECHNICAL',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getTechnical(obj.TECHNICAL);
                         }
                    },
					{name:'HEALTHNUM',index:'HEALTHNUM'},
					{name:'WORKPLACE',index:'WORKPLACE',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getOchWorkPlace(obj.WORKPLACE);
                         }
                    },
					{name:'STATE',index:'STATE',hidden:true,formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getOchWorkerState(obj.STATE);
                         }
                    },
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.WORKERID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.WORKERID+'\')">删除</a>'
            		}}
			];
	if(isGOVUser){//政府用户
	    colname.pop();//移除最后一个
	    colmodel.pop();
	}else{
	    colname.shift();//移除第一个
	    colmodel.shift();
	}
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/health/ochworker/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			sex:"",
			education:"",
			name:"",
			entname:""
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
		caption: "劳动者信息列表",
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
function editInfo(workerid) {
	parent.openWin(BASE_URL+'/health/ochworker/labelpage/menuEdit/'+workerid,'预案编辑','70%','80%');
}
// 删除
function delInfo(workerid) {
	var param = {"ids":workerid};
	del(param);
}
/*加载*/
function reloadGrid(){
	var education = $("#education").val();
	if(education == "硕士以上"){
		education = "1";
	} else if(education == "大学"){
		education = "2";
	} else if(education == "大专"){
		education = "3";
	} else if(education == "高中，中专"){
		education = "4";
	} else if(education == "初中"){
		education = "5";
	} else if(education == "小学"){
		education = "6";
	} else if(education == "文盲"){
		education = "7";
	} 
	var sex = $("#sex").val();
	if(sex == '男'){
		sex = '0';
	} else if(sex == '女'){
		sex = '1';
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			name:$("#name").val(),
            education:education,
            sex:sex,
            entname:''
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
	});
});

/*重置*/
function resetData(){
	$("#searchForm").each(function(){
		$(this).val("");
	});
}

/*详细查询*/
function display(workerid){
	parent.openWin(BASE_URL+'/health/ochworker/labelpage/menuDisplay/'+workerid,'劳动者信息','70%','80%');
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



/*删除方法*/
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/health/ochworker/delete",
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
