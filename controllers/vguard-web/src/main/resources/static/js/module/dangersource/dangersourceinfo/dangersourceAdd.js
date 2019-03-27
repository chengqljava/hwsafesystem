$(document).ready(function() {
	SelectOption.loadDangerType("dangertype");//重大危险源类别
	SelectOption.loadPlacearea("placeareaid");
	var lastSel;
	initInputTime();
	//操作项表格
	var colname = ['危化品名录库Id','危化品Id','危化品名称','危化品类别','UN号','生产用途','物理状态','操作温度(℃)','操作压力(MPa)','存量(t)','单元内危险化物设计存量(t)','临界量(t)'];
	var colmodel = [
	    {name:'CHEMCATALID',index:'CHEMCATALID',editable:true,hidden:true},
		{name:'DANGCHEMID',index:'DANGCHEMID',hidden: true},
		{name:'CHEMCATALNAME',index:'CHEMCATALNAME',width:"10%",align:'left',editable:true,
			editoptions:{                        
				dataEvents: [
                         {
                             type: 'click',     //blur,focus,change.............
                             fn: function(e) {
                                openKnoChemicalCatal(this);//打开危化品名录窗口
                             }
                         }
                    ]
           }
		},
		{name:'DANGERTYPENAME',index:'DANGERTYPENAME',width:"9%",align:'left',editable:true},
		{name:'UN',index:'UN',align:'left',width:"7%",editable:true},
		{name:'DANCHEMUSE',index:'DANCHEMUSE',width:"10%",align:'left',editable:true,edittype:"select",editoptions : {value : "0:请选择;1:原料;2:中间产物;3:产品;4:其他"},formatter:'select'},
		{name:'PHYSICSSTATE',index:'PHYSICSSTATE',width:"8%",align:'left',editable:true,edittype:"select",editoptions : {value : "0:请选择;1:液体;2:固态;3:液气共存;4:固态"},formatter:'select'},
		{name:'OPERATET',index:'OPERATET',width:"10%",align:'left',editable:true},
		{name:'OPERATEP',index:'OPERATEP',width:"11%",align:'left',editable:true},
		{name:'CURRENTNUM',index:'CURRENTNUM',width:"8%",align:'left',editable:true},
		{name:'UNITNUM',index:'UNITNUM',width:"20%",align:'left',editable:true},
		{name:'LIMITNUM',index:'LIMITNUM',width:"8%",align:'left',editable:true}
	];
//解决 表头和表内容不对齐 注释的
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").setGridWidth($(window).width()-40);
    })
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridWidth', $('.container').width() );
	});
    $("#grid-table").jqGrid({
    	height: 150,
    	url : BASE_URL + "/dangersource/dsschemicalsinfo/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			dangerid:$("#dangerid").val()
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
		rowNum:5,
		rowList:[5,10,15],
		altRows: true,
		multiselect: true,
		caption: "危险化学品信息",
		autowidth: true,
		loadComplete : function() {
//			if($(window).width() < 700) {
//				$('.ui-jqgrid-htable').css({"width":"700"});
//				$("#grid-table").css({"width":"700" });
//				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
//				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//			} else {
//				$("#grid-table").jqGrid( 'setGridWidth', $('.container').width()*0.99 );
//			}
//			$("#grid-table").jqGrid( 'setGridWidth', $('.container').width() );
			//解决 表头和表内容不对齐 注释的
//			var width = $("#container").css("width").replace("px","");
			$("#grid-table").setGridWidth($(window).width()-40);
		},
		onSelectRow: function(id){
		    //如果是查看页面，则不用选中编辑了
		    if($("#display").val() == "1"){
		        return ;
		    }
			if(id && id!==lastSel){  
				/*
				 * url：定义此项，将会替代jqGrid配置中的editurl，
		         * 如果设置为 'clientArray'，仅保存数据到grid中，不会向服务器提交数据
		         *（如果不想更改一行就提交一次，配置为这个值比较有用，可以点击页面上某个按钮将所有数据用ajax一次提交）
				 */
		        $('#grid-table').jqGrid('saveRow',lastSel,{
		        	    "url" :"clientArray"
		        	});
		        lastSel=id;  
		    } 
	        $('#grid-table').editRow(id, true); 
	        $("#"+id+"_CHEMCATALNAME").attr("readonly",true);
	        $("#"+id+"_UN").attr("disabled",true);
			$("#"+id+"_DANGERTYPENAME").attr("disabled",true);
	    }
	});
	
	//设置二级表头
	jQuery("#grid-table").jqGrid("setGroupHeaders",{
		 useColSpanStyle: true, 
		 groupHeaders:[
			{startColumnName: 'PHYSICSSTATE', numberOfColumns: 4, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">单个最大容器</div>'},
		 ]
	});
	
	/**添加新行*/
	$("#addBtn").on("click", function (e) {
		e.preventDefault();
		var ids = $("#grid-table").jqGrid('getDataIDs');
		if(ids.length == 0){
			ids.push("0");
		}
		//获得当前最大行号(数据编号)
	    var rowid = Math.max.apply(Math,ids);  
	    //获得新添加行的行号(数据编号)
	    var newrowid = rowid+1;
		$("#grid-table").jqGrid('addRowData', newrowid, {});
		$('#grid-table').jqGrid('editRow', newrowid, true);
		$("#"+newrowid+"_CHEMCATALNAME").attr("readonly",true);
		$("#"+newrowid+"_UN").attr("disabled",true);
		$("#"+newrowid+"_DANGERTYPENAME").attr("disabled",true);
	});
    
	/**删除行*/
	$("#delBtn").on("click", function (e) {
		e.preventDefault();
		if($('#grid-table input:checked').length==0){
			parent.toast("请选择要删除的数据");
			return;
		}
		parent.confirm('确认删除吗?',function(){
			$('#grid-table input:checked').parent().parent().remove();
		});
	});
	
	/**
	 * 如果点击的是 那么给 ‘工业(化工)园区名称’添加星号
	 * @auther:lzqiang
	 */
	$("input[name='inpark']").each(function(){
		$(this).on("click",function(){
			if($(this).val() == "1"){
				$("#parknameStar").show();
			}else{
				$("#parknameStar").hide();
			}
		});
	});
	
	jQuery.validator.addMethod("Integer", function(value, element) { 
		var num =  /^[0-9]+$/;
		return this.optional(element) || (num.test(value)); 
		}, "请输入整数");
	
	// 工业(化工)园区名称
	jQuery.validator.addMethod("parkname", function(value, element) {  
		var checkflag = false;
		if($("input[name='inpark']:checked").val()=="1"){
			if($("#parkname").val() == ""){
				checkflag = false;
			}else{
				checkflag = true;
			}
		}else{
			checkflag = true;
		}
	    return checkflag;    
	}, "工业(化工)园区名称不能为空");
	
	$("#dangerSourceform").validate({
		rules: {
			dangertype:{
				required: true
			},
			dangername: {
				required: true
			},
			dangeraddr: {
				required: true
			},
			dangerusetime: {
				required: true
			},
			processmess: {
				required: true
			},
			parkname:{
				parkname:true
			},
			facilityscale: {
				required: true
			},
			mindistance: {
				required: true,
				number:true
			},
			fivehundredinfo: {
				required: true
			},
			peopcount: {
				required:true,
				Integer: true
			},
			threeyearaccident: {
				required: true
			},
			inputuser: {
				required: true
			},
			tel: {
				required: true,
				isTelephone: true
			},
			inputtime: {
				required: true
			}
		},
		messages: {
			dangertype: {
				required: "重大危险源种类不能为空"
			},
			dangername: {
				required: "重大危险源名称不能为空"
			},
			dangeraddr: {
				required: "重大危险源所在地址不能为空"
			},
			dangerusetime: {
				required: "重大危险源投用时间不能为空"
			},
			processmess: {
				required: "生产工艺流程简介不能为空"
			},
			facilityscale: {
				required: "单元内主要装置设施及生产（存储）规模不能为空"
			},
			mindistance: {
				required: "重大危险源与周边重点防护目标<br/>最近距离情况(m)不能为空",
				number: "只能是数字"
			},
			fivehundredinfo: {
				required: "厂区边界外500米范围内的单位<br/>或设施及人数情况不能为空"
			},
			peopcount: {
				required: "重大危险源单元边界向外扩展500米<br/>范围内常住人口数量(人)不能为空",
				Integer: "只能是整数"
			},
			threeyearaccident: {
				required: "近三年内危险化学品事故情况不能为空"
			},
			inputuser: {
				required: "填表人不能为空"
			},
			tel: {
				required: "联系电话不能为空"
			},
			inputtime: {
				required: "填表日期不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

/**
 * 初始化填表日期
 */
function initInputTime(){
	if($("#dangerid").val() == ""){//添加的时候 给填表时间默认当前时间
		$("#inputtime").val(getSmpFormatNowDate(false));
	}
}

/**
 * 打开危化品名录库窗口
 */
function openKnoChemicalCatal(obj){
//	console.log(parent.getSelfIndex()+"...layui-layer-iframe"+parent.getSelfIndex());
	parent.openWin(BASE_URL+"/dangersource/dssdangerinfo/knochemicalcatal/"+obj.id+"/"+parent.getSelfIndex(),'危化品名录库','65%','75%');
}
/**
 * 接收危化品名录库窗口传递回来的值
 * @param json
 */
function selectKnochemicaltal(json){
	var obj = eval("("+json+")");
	var id = obj[0].id;
	var index = id.substring(0,id.indexOf("_"));
	$("#"+id).val(obj[0].chemcatalname);
	$("#"+index+"_"+"UN").val(obj[0].un);
	$("#"+index+"_"+"DANGERTYPENAME").val(obj[0].dangertypename);
	$("#"+index+"_"+"CHEMCATALID").val(obj[0].chemcatalid);
}


/**保存*/
function save(){
	var ids = $("#grid-table").jqGrid('getDataIDs'); //获取所有的id
	//操作项json对象
	var chemicalJsonArr = new Array();
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		
		var danchemuse= $("#"+id+"_DANCHEMUSE").val();
		
		var physicsstate = $("#"+id+"_PHYSICSSTATE").val();
		
	    /*
		 * url：定义此项，将会替代jqGrid配置中的editurl，
         * 如果设置为 'clientArray'，仅保存数据到grid中，不会向服务器提交数据
         *（如果不想更改一行就提交一次，配置为这个值比较有用，可以点击页面上某个按钮将所有数据用ajax一次提交）
		 */
        $('#grid-table').jqGrid('saveRow',id,{
        	    "url" :"clientArray"
        	});
		var rowdata = $("#grid-table").jqGrid("getRowData",id); //根据上面的id获得本行数据
		
		var operid= rowdata.OPERID;
		var operatet =$.trim(rowdata.OPERATET);
	    var operatep = $.trim(rowdata.OPERATEP);
  		var currentnum = $.trim(rowdata.CURRENTNUM);
  		var unitnum = $.trim(rowdata.UNITNUM);
  		var limitnum = $.trim(rowdata.LIMITNUM);
  		var chemcatalid = rowdata.CHEMCATALID;
  		
  		var chemcatalname = rowdata.CHEMCATALNAME;
  		
  		if(chemcatalname == ""){
  			parent.toast("危化品名称不能为空");
  			return;
  		}
  		
  		
  		if(operatet!=""){
  			var reg=/^(-?\d{0,6})(\.\d{0,2})?$/;
	        if(!reg.test(operatet)){   
	  			parent.toast("操作温度只能是整数位6位小数位2位的数字");
	  			return;
	        }
  		}
  		if(operatep!=""){
			var reg=/^(-?\d{0,6})(\.\d{0,2})?$/;
	        if(!reg.test(operatep)){   
	  			parent.toast("操作压力只能是整数位6位小数位2位的数字");
	  			return;
	        }
  		}
  		
  		if(currentnum == ""){
  			parent.toast("存量不能为空");
  			return;
  		}else{
  			var reg=/^(\d{0,6})(\.\d{0,2})?$/;
	        if(!reg.test(currentnum)){   
	  			parent.toast("存量只能是整数位6位小数位2位的数字");
	  			return;
	        }
  		}
  		
  		if(unitnum == ""){
  			parent.toast("单元内危险化物设计存量不能为空");
  			return;
  		}else{
  			var reg=/^(\d{0,6})(\.\d{0,2})?$/;    
	        if(!reg.test(unitnum)){   
	  			parent.toast("单元内危险化物设计存量只能是整数位6位小数位2位的数字");
	  			return;
	        }
  		}
  		
  		
  		if(limitnum == ""){
  			parent.toast("临界量不能为空");
  			return;
  		}else{
  			var reg=/^(\d{0,6})(\.\d{0,2})?$/;    
	        if(limitnum == 0){
	        	parent.toast("临界量不能为0");
	  			return;
	        }else if(!reg.test(limitnum)){   
	  			parent.toast("临界量只能是整数位6位小数位2位的数字");
	  			return;
	        }
  		}
  		
  		var obj = {
  			"chemcatalid":chemcatalid,
  			"danchemuse":danchemuse,
  			"physicsstate":physicsstate,
  			"operatet":operatet,
  			"operatep":operatep,
  			"currentnum":currentnum,
  			"unitnum":unitnum,
  			"limitnum":limitnum
  		};
  		chemicalJsonArr.push(obj);
	}
	
	//权限json对象
	var dangerJson={};
	var dangerJsonArr = $("#dangerSourceform").serializeArray();
	$.each(dangerJsonArr, function() {
		if(this.name.indexOf("jqg_grid-table")==-1){
	       if (dangerJson[this.name]) {    
	           if (!dangerJson[this.name].push) {    
	        	   dangerJson[this.name] = [dangerJson[this.name]];    
	           }    
	           dangerJson[this.name].push(this.value || '');    
	       } else {    
	    	   dangerJson[this.name] = this.value || '';    
	       }
		}
	});    
	
	var param={"dangerJson":JSON.stringify(dangerJson),"chemicalJson":JSON.stringify(chemicalJsonArr),"dangerId":$("#dangerid").val(),"token":$("#token").val()};
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssdangerinfo/save',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

