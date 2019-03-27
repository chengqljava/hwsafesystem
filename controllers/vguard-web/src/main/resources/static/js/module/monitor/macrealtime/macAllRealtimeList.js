var stateArr = getQueryString("stateArr");
$(function(){
	initSeachInput();
	//显示操作权限按钮
//    $("#tableOpers").displayOper();
	
    $('.factoryListContent ul').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: true,
        autohidemode: false
    }).show().resize();
    $('.factoryListContent ul').on('click','li',function(){
        $('.factoryListContent ul li').removeClass('active');
        $(this).addClass('active');
        var entid = $('.active input').val();
        $("#entid").val(entid);
//        var entname = $('.active').text();
//        $('#dangerTitle').html(entname+"故障报警");
        reloadGrid();
    })
    
    	/**
	 * 定时刷新列表
	 */
	window.setInterval(function(){
		var p=$("#grid-table").jqGrid('getGridParam','page');
		reloadGrid(p);
		loadEntList();
	},30000);
    loadEntList();
    loadRealtimeMonitor();
    
});

function loadRealtimeMonitor(){
	
	var colname = ['主键ID','探头id','企业名称','监测点位名称','监测数值','监测类型','单位','状态','监测时间'];
	
	var colmodel = [
					{name:'REALTIMEID',index:'REALTIMEID',hidden:true},
					{name:'PROBEID',index:'PROBEID',align:'left',hidden:true},
					{name:'ENTNAME',index:'ENTNAME',align:'left'},
					{name:'PROBENAME',index:'PROBENAME',align:'left'},
					{name:'CHROVAL',index:'CHROVAL',align:'left'},
					{name:'PROBETYPE',index:'PROBETYPE',align:'left',
						formatter:function (cellvalue, options, obj) {
							return SelectOption.getMonitorGatherTypeResult(obj.PROBETYPE);
                        }},
					{name:'UNIT',index:'UNIT',align:'left'},
					{name:'STATE',index:'STATE',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(100==obj.STATE || obj.STATE==101 || obj.STATE ==102){
								return "<span style='color:red'>"+SelectOption.getProbeState(obj.STATE)+"</span>";
							}else if(3==obj.STATE || 4==obj.STATE || 99==obj.STATE || 7==obj.STATE){
								return "<span style='color:blue'>"+SelectOption.getProbeState(obj.STATE)+"</span>";
							}else{
								return SelectOption.getProbeState(obj.STATE);
							}
						}
					},
					{name:'UPDATETIME',index:'UPDATETIME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return getFormatDateByLong(obj.UPDATETIME,"yyyy-MM-dd hh:mm:ss");
						}
					}
				];
	
	var tableHeight = $(".dangerTable").height() - $('.pcheck').height() - 120;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(".dangerTable").height() - $('.pcheck').height() - 120 );
		var tableHeight = $(".dangerTable").height() - $('.pcheck').height() - 120;
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/monitor/macrealtime/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			state:"",
			entname:"",
			probename:"",
			stateArr:stateArr
		},
		sortname : 'STATE',
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
		caption: "实时监测列表",
		autowidth: true
//		,
//		loadComplete: function() {
//			if($(window).width() < 700) {
//				$('.ui-jqgrid-htable').css({"width":"900"});
//				$("#grid-table").css({"width":"900" });
//				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
//				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//			} else {
//				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
//			}
//		}
	});
}

//查询
function searchData(){
	reloadGrid();
	loadEntList();
}
//重置
function resetData(){
    $("#entname").val("");
    $("#state").val("");
    $("#entid").val("");
}

/*加载*/
function reloadGrid(p){
	var state = $("#state").val();
	if(state == "正常"){
		state = "0";
	} else if(state == "待标定"){
		state = "2";
	} else if(state == "探头故障"){
		state = "3";
	} else if(state == "预警"){
		state = "4";
	} else if(state == "通讯故障"){
		state = "7";
	} else if(state == "网络故障"){
		state = "99";
	} else if(state == "满量程"){
		state = "100";
	} else if(state == "低报"){
		state = "101";
	} else if(state == "高报"){
		state = "102";
	} else if(state == "超低报"){
		state = "103";
	} else if(state == "超高报"){
		state = "104";
	} else {
		state = "";
	}
	var entid = $("#entid").val();
	if(p == null){
		p = 1;
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:p,postData:{
			state:state,
			entname:$("#entname").val(),
			probename:"",
			businessinfoid:entid
		}
	}).trigger("reloadGrid");
}

//加载右侧企业列表
function loadEntList(){ 
	var entid = $("#entid").val();
	var entname = $('#entname').val();
	var state = $("#state").val();
	if(state == "正常"){
		state = "0";
	} else if(state == "待标定"){
		state = "2";
	} else if(state == "探头故障"){
		state = "3";
	} else if(state == "预警"){
		state = "4";
	} else if(state == "通讯故障"){
		state = "7";
	} else if(state == "网络故障"){
		state = "99";
	} else if(state == "满量程"){
		state = "100";
	} else if(state == "低报"){
		state = "101";
	} else if(state == "高报"){
		state = "102";
	} else if(state == "超低报"){
		state = "103";
	} else if(state == "超高报"){
		state = "104";
	} else {
		state = "";
	}
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macrealtime/entlist",
        dataType: "json",
        data: {
        	entname: entname || '',
        	state: state || ''
        },
        async:true,
        success: function (data) {
        	console.log(data.entList);
        	$("#entList").empty();
        	$.each(data.entList,function(i,item){
        		var entlist
        		if(entid == item.BUSINESSINFOID){   
        			entlist = '<li class="active">'+item.ENTNAME+'<input type="hidden" name="entid" value="'+item.BUSINESSINFOID+'"/></li>'
        		} else {
        			entlist = '<li>'+item.ENTNAME+'<input type="hidden" name="entid" value="'+item.BUSINESSINFOID+'"/></li>'
        		}
        		$("#entList").append(entlist);
//                if(type=="search"){
//                	if(entname != null && entname != ''){                		
//                		$("#entList").find("li:first-child").addClass('active');
//                		var entid = $('.active input').val();
//                	}
//                	reloadGrid(entid);
//                }
            }) 
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
