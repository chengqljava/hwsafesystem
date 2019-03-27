$(document).ready(function() {
	
		if($(window).width() < 700) {
			$('.showBtn').css({"display":"none"});
			var len = $('.dropdown-menu li').length;
			for(var i = 0; i < len; i++) {
				$('.smallShow li button')[i].onclick = function () {
	    				var html = $(this).html();
	    				$('.clickBtn').html(html);
	    			};
	    		}
		}else {
			$('#btnli').css({"display":"none"});
			$("#btnli").empty();
			$('#btnli').remove();
		}

	var usertype = $("#usertype").val();
	if(usertype=="GOV"){
		SelectTree.loadSelfDistrictSelect("districtname");
	}
	
	var colname = ['机构id','机构编号','机构名称','行政区域','机构职责','内设部门','机构成员','地图定位','所属单位']; 
	var colmodel = [
		{name:'ORGID',index:'ORGID', width:'5%',hidden: true},
		{name:'ORGNO',index:'ORGNO',width:'10%',align:'left'},
		{name:'ORGNAME',index:'ORGNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.ORGID+'\')">'+obj.ORGNAME+'</a>';
			}
		},
		{name:'DISTRICTNAME',index:'DISTRICTNAME',width:'10%',align:'left'},
		{name:'ORGDUTIES',index:'ORGDUTIES',width:'20%',align:'center'},
		{name:'DEPTCOUNT',index:'DEPTCOUNT',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayDepts(\''+obj.ORGID+'\')">'+obj.DEPTCOUNT+'</a>';
			}
		},
		{name:'USERCOUNT',index:'USERCOUNT',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayUsers(\''+obj.ORGID+'\')">'+obj.USERCOUNT+'人</a>';
			}
		},
		{name:'LONGITUDE',index:'LONGITUDE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.LONGITUDE && obj.LATITUDE){
					return '<a href="javascript:void(0);" onclick="loactionGIS(\''+obj.LONGITUDE+'\',\''+obj.LATITUDE+'\',\''+obj.DISTRICTID+'\')">已定位</a>';
				}else{
					return '未定位';
				}
			}
		},
		{name:'UNITNAME',index:'UNITNAME',hidden: true, width:'20%',align:'left',hidden: true}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsresorg/loadOrglist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			orgname:$("#orgname").val(),
			/*districtid:$("#districtname_select").val()*/
		},
		sortname : 'ORGNO',
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
		multiselect: true,
		caption: "应急机构列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
    
    /*搜索查询*/
    $("#searchbtn").bind("click",function(){
    	reloadGrid();
    });

    /*重置*/
    $("#resetbtn").bind("click",function(){
    	$("#orgname").val();
    	$("#districtname_select").val();
    });

    /*添加*/
    $("#addBtn").on("click", function () {
    	parent.openWin(BASE_URL+"/ems/emsresorg/add",'添加','60%','50%');
    });

    /*编辑*/
    $("#editBtn").on("click", function () {
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length !=1){
    		// 弹出提示信息
    		parent.toast("请选择一条记录！");
    		return;
    	}
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var orgid = rowdata.ORGID;
    	
    	parent.openWin(BASE_URL+'/ems/emsresorg/edit/'+orgid,'编辑','60%','45%');
    });

    /*上报*/
    $("#reportBtn").on("click", function () {
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length !=1){
    		// 弹出提示信息
    		parent.toast("请选择一条记录！");
    		return;
    	}
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var orgid = rowdata.ORGID;
    	var param = {"id":orgid};

    		 $.ajax({ 
    			 	url: BASE_URL+"/ems/emsresorg/report",
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
    
    /*批量删除*/
    $("#delBtn").on("click", function () {
    	//返回当前grid中复选框所选择的数据的id 
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length==0){
    		// 弹出提示信息
    		parent.toast("请选择需要删除的数据！");
    		return;
    	}

    	var orgids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		orgids[i]= rowdatas.ORGID;
    	}
    	var parmJson = orgids.toString();
    	var param = {"ids":parmJson};
    	del(param);
    });
});
/*加载行政区域*/
function searchDistrict(districtid){
	/*$("#districtname_select").val(districtid);*/
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			orgname:$("#orgname").val(),
			/*districtid:$("#districtname_select").val()*/
			}
	}).trigger("reloadGrid");
}
/*详细查询*/
function display(orgid){
	parent.openWin(BASE_URL+"/ems/emsresorg/display/"+orgid,'详细','60%','45%');
}

/*内设应急部门*/
function displayDepts(orgid){
	parent.openWin(BASE_URL+"/ems/emsresdepart/displayDepts/"+orgid,'详细','80%','80%');
}

/*机构人员*/
function displayUsers(orgid){
	parent.openWin(BASE_URL+"/ems/emsresdepartpreson/displayUsersByOrgid/"+orgid,'详细','80%','80%');
}

/*地图定位*/
/**
 *在GIS上定位 
 *longitude:经度
 *latitude:维度 
 */
function loactionGIS(longitude,latitude,areaName){
	parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=1", "地理定位", "90%", "90%", false);
    //parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','90%','90%',false);
//    parent.openWin(BASE_URL+"/olgis/gisOperBuss/viewposition?longitude="+longitude+"&latitude="+latitude,'地理定位','90%','90%',false);
}
/*删除方法*/
function del(param){
	//查询是否有关联引用	
	$.ajax({ 
	  		url: BASE_URL+"/ems/emsresorg/loadLinkById",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==false){
	  				//有关联引用
	  				parent.toast(json.msg);
	  			}else{
	  				//弹出提示框
	  				parent.confirm("确认删除吗?", function() { 
	  					 $.ajax({ 
	  						 	url: BASE_URL+"/ems/emsresorg/delete",
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