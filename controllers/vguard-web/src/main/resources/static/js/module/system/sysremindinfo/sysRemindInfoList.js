$(document).ready(function () {
	initSeachInput();
	// 显示操作权限按钮
	$("#tableOpers").displayOper();
	
	$('#typeid').val(getUrlParamVal("typeid"));
	
//	SelectOption.loadRemindState("state");//消息状态
	$("select").val("1");//默认为未读
    // 生成列表分页表格
    var colname = ["主键id","业务id","消息状态", "消息信息中间表id", "消息类型编号", "标题","内容",/**"消息类型",**/"时间","状态","操作"],
        colmodel = [
            {
                name: "REMINDID",
                index: "REMINDID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "MODULEID",
                index: "MODULEID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "STATE",
                index: "STATE",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "PROID",
                index: "PROID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "TYPENUM",
                index: "TYPENUM",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "TITLE",
            	index: "TITLE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "CONTENT",
            	index: "CONTENT",
            	width: "25%",
            	align: "center",
            	sortable: false
            },
            /**
            {
            	name: "TYPENAME",
            	index: "TYPENAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            **/
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd hh:mm:ss");
        		}
            },
            {
                name: "STATENAME",
                width: "5%",
                align: "center",
                sortable: false,
                formatter: function(cellvalue, options, obj) { 
            		if(obj.STATE == "1"){
            			return "未读";
            		}else if(obj.STATE == "0"){
            			return "已读";
            		}else{
            			return "";
            		}
            	}
            },
            {name:'', width: '5%', align: 'center', sortable: false, 
            	formatter: function(cellvalue, options, obj) { 
            		return '<a href="javascript:void(0);" onclick="recheck(\''+obj.MODULEID+'\',\''+obj.TITLE+'\',\''+obj.TYPENUM+'\',\''+obj.PROID+'\',\''+obj.STATE+'\')">查看</a>';
            	}
            }
        ];
    
  // 分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "system/sysremindinfo/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	title: $('#title').val(),
        	typeid: $('#typeid').val(),
        	state: $('#state').val()
        },
        sortname: "CREATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 50,
        rowList: [50, 100, 200],
        altRows: true,
        multiselect: true,
        caption: "消息提醒",
        autowidth: true
    });

    // 查询按钮事件
    /*$("#searchbtn").bind("click", function() {
    	reloadGrid();
    });*/
    
    
    
    //查看按钮方法
    $("#editBtn").off("click").on("click", function (){
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var moduleid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).MODULEID;
        var title = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TITLE;
        var typenum = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TYPENUM;
        var proid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PROID;
        var proids = [];
        proids[0] = proid;
        var paramJson = proids.toString();
        var param = {
        		"ids" : paramJson
        	};
        batchOne(param);
        if(typenum == "01"){        	
        	// TODO 弹出信息框
        	parent.openWin(BASE_URL+ "/law/lawtodo/DBWS_GOV",
        			'待办文书', '60%', '55%');
        } else if(typenum == "02"){
        	// TODO 弹出信息框
        	parent.openWin(BASE_URL+ "/task/backlog/DBRW_GOV",
        			'待办任务', '60%', '55%');
        } else if(typenum == "03"){
        	// TODO 弹出信息框
        	parent.openWin(BASE_URL+ "/enterprise/entpermitphoto/display/"+moduleid,
        			'资格资质', '60%', '50%');
        } else if(typenum == "04"){
        	if(title=="责任人证书"){        		
        		// TODO 弹出信息框
        		parent.openWin(BASE_URL+ "/enterprise/entsafeperson/display/"+moduleid,
        				'责任人证书', '60%', '50%');
        	} else {
        		// TODO 弹出信息框
        		parent.openWin(BASE_URL+ "/enterprise/entsafemanager/display/"+moduleid,
        				'管理人证书', '60%', '50%');
        	}
        } else if(typenum == "05"){
        	// TODO 弹出信息框
        	parent.openWin(BASE_URL+ "/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ",
        			'监测报警', '60%', '55%');
        } else if(typenum == "06"){
        	// TODO 弹出信息框
        	parent.openWin(BASE_URL+ "monitor/macalarmfault/GZBJ_GOV",
        			'故障报警', '60%', '55%');
        };       
        
    });
    
    /* 批量查看 */
    $("#batchBtn").bind("click", function() {
    	// 返回当前grid中复选框所选择的数据的id
    	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
    	if (ids.length == 0) {
    		// 弹出提示信息
    		parent.toast("请选择消息信息！");
    		return;
    	}

    	var proids = [];
    	for (var i = 0; i < ids.length; i++) {
    		var id = ids[i];
    		// 返回指定id行的数据
    		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
    		proids[i] = rowdatas.PROID;
    	}
    	var paramJson = proids.toString();
    	var param = {
    		"ids" : paramJson
    	};
    	batch(param);
    });
    
    
});

function resetData(){
    $("#title").val("");
    $("#state").val("");
}

function seach(){
	 reloadGrid();
}

function batchOne(param) {
	$.ajax({ 
  		url: BASE_URL + "/system/sysremindinfo/updateState",
  		type:'post',
  		dataType:'json',
  		data:param,
  		success: function(json){
  			if(json.success==true){
// parent.toast(json.msg);
			reloadGrid();// 刷新列表
  			}else{
  				parent.toast(json.msg);
  			}
  		}
	 });
}



/* 批量查看方法 */
function batch(param) {
	// 弹出提示框
	parent.confirm('是否标为已读?',function(){
		$.ajax({ 
	  		url: BASE_URL + "/system/sysremindinfo/updateState",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
		  			parent.toast(json.msg);
				reloadGrid();// 刷新列表
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	})
}


/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var state = $('#state').val();
	if (state == "已读") {
		state = '0';
	}else if(state == "未读"){
		state = '1';
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	title: $("#title").val(),
        	typeid:$("#typeid").val(),
        	state: state
        }
    }).trigger("reloadGrid");
}


/* 重置 */
/*$("#resetbtn").bind("click",function(){
	// 清空选择框
	$("#title").empty();
    $("#typeid").empty();
    $("select").val("");
});*/

/**
 * 获取url后面的参数值
 */
function getUrlParamVal(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
         r = window.location.search.substr(1).match(reg);
     if (null != r) return unescape(r[2]); 
     return null;
}

/* 查询当前用户类型 */
function type() {
	// 弹出提示框
	$.ajax({ 
  		url: BASE_URL + "/system/sysremindinfo/loadGovOrEnt",
  		type:'post',
  		dataType:'json',
  		success: function(json){
  			if(json.success==true){
  				var usertype = json.usertype;
  				return usertype;
  			}
  		}
	 });
}

function receiver(){
	$.ajax({ 
  		url: BASE_URL + "/system/sysremindinfo/loadGovOrEnt",
  		type:'post',
  		dataType:'json',
  		async:false,
  		success: function(json){
//  			if(json.success==true){
  				var userid = json.userid;
  				console.log(userid);
  				return userid;
//  			}
  		}
	 });
}

//列表内查看按键
function recheck(moduleid, title, typenum, proid, state){
	var proids = [];
    proids[0] = proid;
    var paramJson = proids.toString();
    var param = {
    		"ids" : paramJson
    	};
    if('1'== state){
    	batchOne(param);
    }
    if(typenum == "A01"){        	
    	// TODO 弹出信息框
    	parent.openWin(BASE_URL+ "/law/lawtodo/DBWS_GOV",
    			'待办文书', '60%', '55%');
    } else if(typenum == "A02"){
		// TODO 弹出信息框
		parent.openWin(BASE_URL+ "views/module/ems/receivemap/taskReceiveList.html",
				'应急任务', '60%', '55%');

    } else if(typenum == "B01"){
    	// TODO 弹出信息框
    	parent.openWin(BASE_URL+ "/enterprise/entpermitphoto/display/"+moduleid,
    			'资格资质', '60%', '50%');
    } else if(typenum == "B0201"){      		
    		// TODO 弹出信息框
    		parent.openWin(BASE_URL+ "/enterprise/entsafeperson/display/"+moduleid,
    				'安全生产责任人', '60%', '50%');
    } else if(typenum == "B0202"){
    		// TODO 弹出信息框
    		parent.openWin(BASE_URL+ "/enterprise/entsafemanager/display/"+moduleid,
    				'安全生产管理人', '60%', '50%');       	
    } else if(typenum == "B0203"){
		// TODO 弹出信息框
		parent.openWin(BASE_URL+ "/enterprise/entoperator/display/"+moduleid,
				'特种作业人员', '60%', '50%');       	
    } else if(typenum == "B0204"){
		// TODO 弹出信息框
		parent.openWin(BASE_URL+ "/enterprise/entequipoperator/display/"+moduleid,
				'特种设备作业人员', '60%', '50%');       	
    } else if(typenum == "B03"){
		// TODO 弹出信息框
		parent.openWin(BASE_URL+ "/enterprise/entdanexclusive/exclusivedsplay/"+moduleid,
				'危化品许可证书', '60%', '50%');       	
    } else if(typenum == "C01"){
    	// TODO 弹出信息框
    	parent.openWin(BASE_URL+ "/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ",
    			'监测报警', '60%', '55%');
    } else if(typenum == "C02"){
    	// TODO 弹出信息框
    	parent.openWin(BASE_URL+ "monitor/macalarmfault/GZBJ_GOV",
    			'故障报警', '60%', '55%');
    } else if(typenum == "D0101"){
    		// TODO 弹出信息框
//    	parent.openWin(BASE_URL+ "/hiddendanger/hdientabarbeitung/display/"+moduleid+"/ENT",
//    			'企业自查隐患', '60%', '55%');
    	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+moduleid,
                "企业自查隐患信息详情", "70%", "75%");
//    	}	
    } else if(typenum == "D0102"){
    	// TODO 弹出信息框
//    	parent.openWin(BASE_URL+ "/hiddendanger/hdigovregistra/display/"+moduleid,
//    			'政府巡查隐患', '60%', '55%');
    	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+moduleid,
                "政府巡查隐患信息详情", "70%", "75%");
    } else if(typenum == "D0201"){
    		// TODO 弹出信息框
//        	parent.openWin(BASE_URL+ "/hiddendanger/hdientabarbeitung/display/"+moduleid+"/ENT",
//        			'企业自查隐患逾期未整改', '60%', '55%');
    	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+moduleid,
                "企业自查隐患逾期未整改", "70%", "75%");
//    	}	
    } else if(typenum == "D0202"){
    	// TODO 弹出信息框
//    	parent.openWin(BASE_URL+ "/hiddendanger/hdigovregistra/display/"+moduleid,
//    			'政府巡查隐患逾期未整改', '60%', '55%');
    	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+moduleid,
                "政府巡查隐患逾期未整改", "70%", "75%");
    };   
}
