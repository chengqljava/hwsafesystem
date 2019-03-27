$(function() {
	/**
	 * 默认显示搜索
	 */
	$("#seachDiv").show();
	// 加载资源类型
	SelectOption.loadResourceType("resType");
	
	//点击提交按钮
	$("#seacher").off("click").on("click", function (){
		$("#type").val("");
		$("#name").val("");
		var resType = $("#resType").val();
		var resName = $("#resName").val();
		$("#type").val(resType);
		$("#name").val(resName);
//		alert(resName);
		if (resType == ""){
			parent.toast("资源类型不能为空");// 弹出提示信息
			return false;
		}else{
			$("#seachDiv").hide();//隐藏搜索
			$("#return").show();//隐藏搜索
			if (resType == "1") {
				$("#type2,#type3,#type4,#type5").hide();//隐藏表格数据
				$("#type1").show();
				loadResourceGrid(resType,resName,"#grid-table1","#grid-pager1");
				reloadGrid("#grid-table1");
			}else if(resType == "2"){
				$("#type1,#type3,#type4,#type5").hide();//隐藏表格数据
				$("#type2").show();//显示表格数据
				loadResourceGrid(resType,resName,"#grid-table2","#grid-pager2");
				reloadGrid("#grid-table2");
			}else if(resType == "3"){
				$("#type1,#type2,#type4,#type5").hide();//隐藏表格数据
				$("#type3").show();//显示表格数据
				loadResourceGrid(resType,resName,"#grid-table3","#grid-pager3");
				reloadGrid("#grid-table3");
			}else if(resType == "4"){
				$("#type1,#type2,#type3,#type5").hide();//隐藏表格数据
				$("#type4").show();//显示表格数据
				loadResourceGrid(resType,resName,"#grid-table4","#grid-pager4");
				reloadGrid("#grid-table4");
			}else if(resType == "5"){
				$("#type1,#type2,#type3,#type4").hide();//隐藏表格数据
				$("#type5").show();//显示表格数据
				loadResourceGrid(resType,resName,"#grid-table5","#grid-pager5");
				reloadGrid("#grid-table5");
			}
		}
	});

	/**
	 * 返回按钮
	 */
	$("#returnBtn").off("click").on("click", function (){
		$("#seachDiv").show();//显示搜索
		$("#return,#type1,#type2,#type3,#type4,#type5").hide();//隐藏搜索
	});
});

/**
 * 加载数据
 * @param resType 资源类型
 * resName  资源名称
 * 
 */
function loadResourceGrid(resType,resName,table,pager) {
	//资源类型列表
	var gridName = loadGridName(resType);
	$("#gridname").val(gridName);
	if (resType == "1") {
		var colname = [ "主键id","仓库id", "资源名称", "资源类型", "值班电话", "资源地址","经度","纬度"];
	}else{
		var colname = [ "主键id", "资源名称", "资源类型", "值班电话", "资源地址","经度","纬度"];
	}
	//获取列表参数
	var colmodel = loadColmodel(resType);
	
	// 分页表格响应式处理
	var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
	$(window).resize(
			function() {
				$("#grid-table").jqGrid("setGridHeight",$(window).height() - $('.pcheck').height() - 190 - 33);
				$("#grid-table").jqGrid("setGridWidth",$(window).width() * 0.99);
	});

	$(table).jqGrid({
		height : tableHeight,
		url :BASE_URL + "ems/seachresource/list",
		datatype : "json",
		cache : false,
		mtype : "POST",
		colNames : colname,
		colModel : colmodel,
		postData : {
			"resType":resType,
			"resName":resName
		},
		sortname : "LATITUDE",
		sortorder : "desc",
		viewrecords : true,
		pager : pager,
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum : 5,
		rowList : [ 5, 10, 20 ],
		altRows : true,
		multiselect : true,
		caption : gridName,
		autowidth : true,
		ondblClickRow:function(rowid,iRow,iCol,e){
        	var event = $(table).jqGrid('getRowData',rowid); //选中的一条记录
        	var array = getSameFiled(resType,event);
        	event.resName = array[0];
        	event.resType = array[1];
        	event.resPhone = array[2];
        	event.resAddress = array[3];
        	event = lowerJSONKey(event);
        	window.parent.initMapPts(event,"seacherResource");
        }
	});
}
/**
 * 获取查询类型名称
 * @param resType
 */
function loadGridName(resType){
	var gridName;
	if (resType == "1") {
		gridName="物资装备列表";
	}else if(resType == "2"){
		gridName="救援队伍列表";
	}else if(resType == "3"){
		gridName="应急专家列表";
	}else if(resType == "4"){
		gridName="避难场所列表";
	}else if(resType == "5"){
		gridName="医疗资源列表";
	}
	return gridName;
};

/**
 *获取列表字段参数
 */
function loadColmodel(resType){
	var colmodel = [];
	if (resType == "1") {
		//物资
		 colmodel = [
						{name:'EMSMATERIALID',index:'EMSMATERIALID', width:'5%',hidden:true},
						{name:'EMSDEPOSID',index:'EMSDEPOSID', width:'5%',hidden:true},
						{name:'MATERIALNAME',index:'MATERIALNAME', width:'5%',
						   formatter:function(cellvalue, options, obj) { 
	                             return '<a href="javascript:void(0);" onclick="displayMaterial(\''+obj.EMSMATERIALID+'\',\''+obj.EMSDEPOSID+'\')">'+obj.MATERIALNAME+'</a>';
	                        }
	                    },
						{name:'MAXNAME',index:'MAXNAME', width:'5%'}, 
						{name:'DUTYTEL',index:'DUTYTEL', width:'5%'}, 
						{name:'UNITNAME',index:'UNITNAME', width:'5%'},
						{name:'LONGITUDE',index:'LONGITUDE', width:'5%',hidden:true},
						{name:'LATITUDE',index:'LATITUDE', width:'5%',hidden:true},
				];
	}else if(resType == "2"){
		//队伍
		colmodel = [
					{name: 'TEAMID',index: 'TEAMID', width: '5%', hidden: true},
					{name: 'TEAMNAME',index: 'TEAMNAME', formatter : function(cellvalue, options, obj) {
						return "<a href = 'javascript:void(0)' onclick='displayTeam(\""+obj.TEAMID+"\")'>"+obj.TEAMNAME+"</a>";
					}, width: '5%'},
					{name: 'RESCUEPROFESSION',index: 'RESCUEPROFESSION', width: '5%'},
					{name: 'DUTYTEL',index: 'DUTYTEL', width: '5%'},
					{name: 'ENTADDRESS',index: 'ENTADDRESS', width: '5%'},
					{name:'LONGITUDE',index:'LONGITUDE', width:'5%',hidden:true},
					{name:'LATITUDE',index:'LATITUDE', width:'5%',hidden:true},
			];
	}else if(resType == "3"){
		//专家
		colmodel = [
			{name:'EXPERTID',index:'EXPERTID', width:'5%',hidden:true},
			{name:'NAME',index:'NAME', width:'5%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
                    return '<a href="javascript:void(0);" onclick="displayExpert(\''+obj.EXPERTID+'\')">'+obj.NAME+'</a>';
                }
			},
			{name:'MAJOR',index:'MAJOR', width:'5%', align:'center'},
			{name:'PHONE',index:'PHONE', width:'5%', align:'center'},
			{name:'DISTRICTNAME',index:'DISTRICTNAME', width:'10%', align:'left'},
			{name:'LONGITUDE',index:'LONGITUDE', width:'5%',hidden:true},
			{name:'LATITUDE',index:'LATITUDE', width:'5%',hidden:true},
		];
	}else if(resType == "4"){
		//避难场所
		colmodel = [
		    {name: "SHELTERID",index: "SHELTERID",width: "5%",align: "center",sortable: false, hidden: true},
		    {name: "SHELTERNAME",index: "SHELTERNAME",width: "10%",align: "center",sortable: false,
		    	formatter: function (cellvalue, options, obj) {
		    		return '<a href="javascript:void(0);" onclick="displayShelter(\'' + obj.SHELTERID + '\')">' + obj.SHELTERNAME + '</a>';
		    	}
		    },
		    {name: "RESOURCETYPENAME",index: "RESOURCETYPENAME",width: "15%",align: "center",sortable: false},
            {name: "DUTYTEL",index: "DUTYTEL",width: "10%",align: "center",sortable: false},
            {name: "DISTRICTNAME",index: "DISTRICTNAME",width: "15%",align: "center",sortable: false},
		    {name:'LONGITUDE',index:'LONGITUDE', width:'5%',hidden:true},
			{name:'LATITUDE',index:'LATITUDE', width:'5%',hidden:true},
		];
	}else if(resType == "5"){
		//医疗资源
		colmodel= [
			{name : "DEPTID",index : "DEPTID",width : "5%",align : "center",sortable : false,hidden : true},
			{name : "DEPTNAME",index : "DEPTNAME",width : "15%",align : "center",sortable : false,
				formatter : function(cellvalue, options, obj) {
					return '<a href="javascript:void(0);" onclick="displayHealthDept(\''+ obj.DEPTID + '\')">' + obj.DEPTNAME + '</a>';
				}
			}, 
			{name :"RESOURCETYPENAME",index : "RESOURCETYPENAME",width : "15%",align : "center",sortable : false}, 
			{name :"DUTYTEL",index: "DUTYTEL",width: "10%",align: "center",sortable: false},
			{name :"DISTRICTNAME",index : "DISTRICTNAME",width : "15%",align : "center",sortable : false,}, 
			{name:'LONGITUDE',index:'LONGITUDE', width:'5%',hidden:true},
			{name:'LATITUDE',index:'LATITUDE', width:'5%',hidden:true},
		];
	}
	return colmodel;
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid(grid) {
    $(grid).jqGrid("setGridParam", {
        page: 1,
        postData: {
        	resName:$("#name").val(),
        	resType:$("#type").val()
        }
    }).trigger("reloadGrid");
}

/**
 * 详细信息物资装备
 */
function displayMaterial(emsmaterialid,emsdeposid){
	 if(emsdeposid=="" || typeof(emsdeposid) == "undefined" || emsdeposid=="null"){
	        emsdeposid = "null";
	    }
	parent.openWin(BASE_URL+"/ems/emsresmaterial/display/"+emsmaterialid+"/"+emsdeposid,'物资装备详情','65%','75%');
}
/*详细查询队伍*/
function displayTeam(teamid){
	parent.openWin(BASE_URL+"/ems/emsresteam/display/"+teamid,'救援队伍详情','65%','75%');
}

/*详细查询专家*/
function displayExpert(expertid){
	parent.openWin(BASE_URL+"/ems/emsresexpert/display/"+expertid,'应急专家详情','65%','85%');
}

/**
 * 查看避难场所信息
 */
function displayShelter(shelterid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/shelter/shelterDisplay.html?shelterid="+shelterid,
             "避难场所详情", "60%", "90%");
}
/**
 * 详细查看医疗资源信息
 */
function displayHealthDept(deptid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/healthdept/healthdeptDisplay.html?deptid="+deptid,
             "医疗机构详情", "60%", "90%");
}

/**
 * 将json数据的key值转换为小写
 * @param jsonObj
 * @returns
 */
function lowerJSONKey(jsonObj){  
    for (var key in jsonObj){  
        jsonObj[key.toLowerCase()] = jsonObj[key];  
        delete(jsonObj[key]);  
    }  
    return jsonObj;  
} 

/**
 * 获取相同的数据
 */
function getSameFiled(resType,event){
	var array = new Array();
	var name;//初始化资源名称
	var type;//初始化资源类别
	var phone; //初始化值班电话
	var address;//初始化地址
	if (resType == '1') {
		name = event.MATERIALNAME;
		name = name.substring((name.indexOf(">") + 1),name.lastIndexOf("<"));
		type = event.MAXNAME;
		phone = event.DUTYTEL;
		address = event.UNITNAME;
	}else if(resType == '2'){
		name = event.TEAMNAME;
		name = name.substring((name.indexOf(">") + 1),name.lastIndexOf("<"));
		type = event.RESCUEPROFESSION;
		phone = event.DUTYTEL;
		address = event.ENTADDRESS;
	}else if(resType == '3'){
		name = event.NAME;
		name = name.substring((name.indexOf(">") + 1),name.lastIndexOf("<"));
		type = event.MAJOR;
		phone = event.PHONE;
		address = event.DISTRICTNAME;
	}else if(resType == '4'){
		name = event.SHELTERNAME;
		name = name.substring((name.indexOf(">") + 1),name.lastIndexOf("<"));
		type = event.RESOURCETYPENAME;
		phone = event.DUTYTEL;
		address = event.DISTRICTNAME;
	
	}else if(resType == '5'){
		name = event.DEPTNAME;
		name = name.substring((name.indexOf(">") + 1),name.lastIndexOf("<"));
		type = event.RESOURCETYPENAME;
		phone = event.DUTYTEL;
		address = event.DISTRICTNAME;
	}
	array.push(name);
	array.push(type);
	array.push(phone);
	array.push(address);
	return array;
}
