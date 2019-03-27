$(document).ready(function() {
	initDateSeach("stime","etime");
	var colname = ['编号','用品名称','生产许可证号','生产厂家','生产日期','有效日期','已发放数量/总数量','安监证号','使用性能','最近更新时间','发放情况',"操作"]; 
	var colmodel = [
					{name:'LABORID',index:'LABORID', width:'5%',hidden:true},
					{name:'LABORNAME',index:'LABORNAME', width:'5%',align:'center',sortable : false,
						formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.LABORID+'\')">'+obj.LABORNAME+'</a>';
                        }
					},
					{name:'PRODUCTIONNO',index:'PRODUCTIONNO', width:'10%', align:'center'},
					{name:'MANUFACTURER',index:'MANUFACTURER', width:'10%', align:'center'},
					{name:'MANUFACTUREDATE',index:'MANUFACTUREDATE', width:'5%', align:'center',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.MANUFACTUREDATE,
									"yyyy-MM-dd");
						}
					},
					{name:'VALIDITY',index:'VALIDITY', width:'5%', align:'center',
						formatter : function(cellvalue, options, obj) {
							var validity = obj.VALIDITY;
							var currentdate = new Date();
							if(validity < currentdate){
								return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='已过期'/> "+getFormatDateByLong(obj.VALIDITY,"yyyy-MM-dd");
							}else{
								return getFormatDateByLong(obj.VALIDITY,"yyyy-MM-dd");
							}
						}
					},
					{name:'NUM',index:'NUM', width:'6%', align:'center',
						formatter : function(cellvalue, options, obj) {
//							if(obj.COUNTNUM){
								return '<a title="查看发放状态" href="javascript:void(0);" onclick="showgrant(\''+obj.LABORID+'\',\''+obj.LABORNAME+'\')"><font style="color:#0a98f4">'+(obj.COUNTNUM?obj.COUNTNUM:0)+'</font>' +'/'+'<font style="color:#333333">'+obj.NUM+'</font></a>';
//							}else{
//								return '<font style="color:#0a98f4">0</font>/'+'<font style="color:#333333">'+obj.NUM+'</font>';
//							}
						}
					},
					{name:'SECURITYNO',index:'SECURITYNO', width:'10%', align:'center'},
					{name:'PERFORMANCE',index:'PERFORMANCE', width:'5%', align:'center'},
					{name:'UPDATETIME',index:'UPDATETIME', width:'5%', align:'center',hidden:true,
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.UPDATETIME,"yyyy-MM-dd hh:mm:ss");
						}
					},
					{name:'GRANT',index:'GRANT', width:'5%',align:'center',sortable : false,
						formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="showgrant(\''+obj.LABORID+'\',\''+obj.LABORNAME+'\')">查看</a>';
                        },hidden:true
					},
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.LABORID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.LABORID+'\')">删除</a>'
            		}}
			     ];
	if($("#usertype").val()!='ENT'){
	    //政府端查看
		colname.splice(2,0,"企业名称");
		colmodel.splice(2,0,{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="entdisplay(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		});
	}
	if($("#usertype").val()=='ENT'){
	    //企业端查看
		colname.push("上报状态");
		colmodel.push({name:'FILLSTATE',index:'FILLSTATE', width:'5%',align:'center',hidden:true,
                       formatter:function(cellvalue, options, obj) { 
                           return SelectOption.getEmsState(cellvalue);
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
    	url : BASE_URL + "/health/ochlabor/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			laborname:$("#laborname").val(),
			validity:"",
			districtid:""
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
		caption: "劳动用品",
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

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtname_select").val(districtid);
	reloadGrid();
}
//编辑
function editInfo(laborid) {
	parent.openWin(BASE_URL+'/health/ochlabor/edit/'+laborid,'编辑','55%','45%');
}
// 删除
function delInfo(laborid) {
	var param = {"ids":laborid};
	del(param);
}
/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			laborname:$("#laborname").val(),
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
	$("#laborname").val("");
}

/*详细查询*/
function display(laborid){
	parent.openWin(BASE_URL+"/health/ochlabor/display/"+laborid,'详细','55%','50%');
}

/*企业详细查询*/
function entdisplay(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}



/*删除方法*/
function del(param){
	$.ajax({
		url : BASE_URL + "/health/ochlabor/loadgrantbylaborid",
		type : 'post',
		dataType : 'json',
		data : param,
		success : function(json) {
			if (json.success == false) {
				// 有关联引用
				parent.toast(json.msg);
			} else {
				//弹出提示框
				parent.confirm('确认删除吗?',function(){
					$.ajax({ 
						url: BASE_URL+"/health/ochlabor/delete",
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
		}
	});
}

/**
 * 只选择一条记录
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
 * 选择一条记录
 */
$("#submitbtn").on("click",function(){
	
	var expertIds = [];
	var rowData, expertId;
	
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length < 1){
		// 弹出提示信息
		parent.toast("请选择至少一条记录！");
		return;
	}
	
	for(var i = 0; i < ids.length; i++){
		rowData = $("#grid-table").jqGrid('getRowData', ids[i]); //选中的一条记录
		expertId = rowData.EXPERTID;
		expertIds.push(expertId);
	}
	
	save(expertIds + '');
	
});

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

/*查看发放情况 */
function showgrant(laborid,laborname){
	parent.openWin(BASE_URL+"/health/ochlaborgrant/"+laborid,laborname+' 发放情况','65%','75%');
}