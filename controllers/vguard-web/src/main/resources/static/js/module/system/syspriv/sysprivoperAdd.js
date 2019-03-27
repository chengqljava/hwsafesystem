$(document).ready(function() {
	    //权限级别
	    SelectOption.loadPrivLevel("privlevel");
	    //授权人类型
	    SelectOption.loadUserType("usertype");
	    
	    var usertype = $('#usertype').val();
	    
		//父权限
		SelectTree.loadPrivIdSelect("parentname",{"usertype":usertype});
	    
		//操作项表格
		var colname = ['业务操作id','业务操作','操作代码','样式名称','排序','描述'];
		var colmodel = [
			{name:'OPERID',index:'OPERID', width:'5%',hidden: true},
			{name:'OPERNAME',index:'OPERNAME',width:'30%',align:'left',editable:true,editrules:{required:true}},
			{name:'OPERCODE',index:'OPERCODE',width:'20%',align:'left',editable:true},
			{name:'OPERSTYLE',index:'OPERSTYLE',width:'30%',align:'left',editable:true},
			{name:'ORDERNUM',index:'ORDERNUM',width:'10%',align:'left',editable:true},
			{name:'NOTE',index:'NOTE',width:'30%',align:'left',editable:true}
		];
	
		$(window).on('resize.jqGrid', function () {
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	    })
	    
	    $("#grid-table").jqGrid({
	    	height: 160,
	    	url : "",
			datatype: "local",
			cache : false,
			mtype : 'post',
			colNames:colname,
			colModel:colmodel,
			postData:{
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
			rowNum:5,
			rowList:[5,10,15],
			altRows: true,
			multiselect: true,
			caption: "操作项",
			autowidth: true
		});
		
		var dataRows =[{
           	OPERID:"1",	
   		    OPERNAME:"新增",
   		    OPERCODE:"addBtn",
   		    OPERSTYLE:"liadd",
   		    ORDERNUM:"1",
   		    NOTE:"新增数据"
            },{
           	OPERID:"2",	
   		    OPERNAME:"编辑",
   		    OPERCODE:"editBtn",
   		    OPERSTYLE:"liedit",
   		    ORDERNUM:"2",
   		    NOTE:"编辑数据"
            },{
          	OPERID:"3",	
  		    OPERNAME:"删除",
  		    OPERCODE:"delBtn",
  		    OPERSTYLE:"lidel",
  		    ORDERNUM:"3",
  		    NOTE:"删除数据"
           }
		];  
		
		for(var i=0;i<dataRows.length;i++){
		  $("#grid-table").jqGrid('addRowData', dataRows[i].OPERID, dataRows[i]);
		}
	    
		/**添加新行*/
		$("#addBtn").on("click", function (e) {
			e.preventDefault();
			var ids = $("#grid-table").jqGrid('getDataIDs');  
			//获得当前最大行号(数据编号)
		    var rowid = Math.max.apply(Math,ids);  
		    //获得新添加行的行号(数据编号)
		    var newrowid = rowid+1;
			$("#grid-table").jqGrid('addRowData', newrowid, {});
			$('#grid-table').jqGrid('editRow', newrowid, true);
		});
	    
		/**删除行*/
		$("#delBtn").on("click", function (e) {
			e.preventDefault();
			$('#opers input:checked').parent().parent().remove();
		});
		
		
		/**字符下划线验证*/
		jQuery.validator.addMethod("chr", function(value, element) {
			var chrnum = /^([a-zA-Z_]+)$/;
			return this.optional(element) || (chrnum.test(value));
			}, "只能输入字符(字符A-Z, a-z, _)");
		
		//数字验证
		jQuery.validator.addMethod("num", function(value, element) { 
			var num =  /^[0-9]+$/;
			return this.optional(element) || (num.test(value)); 
			}, "请输入数字");
		
		$("#privform").validate({
			rules: {
				privname: {
					required: true,
					rangelength:[2,25]
				},
				privcode: {
					required: true,
					chr: true,
					remote:{
					    url: BASE_URL+'/system/syspriv/existsPrivCode', //后台处理程序
					    type: "post",               
					    dataType: "json",         
					    data: {  
					    	//要传递的数据 
					    	privid: function() {
					            return $("#privid").val();
					        },
					    	privcode: function() {
					            return $("#privcode").val();
					        }
					    }
					}
				},
				privlevel: {
					required: true
				},
				parentname: {
					required: true
				},
				privimg: {
					chr: true
				},
				ordernum: {
					num: true
				}
			},
			messages: {
				privname: {
					required: "权限名称不能为空",
					rangelength: "请输入2-25个字符"
				},
				privcode: {
					required: "权限编码不能为空",
					chr : "只能输入字符(字符A-Z, a-z, _)",
					remote: "权限编码已存在!"
				},
				privlevel: {
					required: "请选择权限级别!",
				},
				parentname: {
					required: "父权限不能为空"
				},
				privimg: {
					chr: "只能输入字符(字符A-Z, a-z)"
				},
				ordernum: {
					num: "请输入数字"
				}
			},
			submitHandler:function(form){
				$('#usertype').attr("disabled",false);
				save();
		    }   
		});
});


/**保存*/
function save(){
	var ids = $("#grid-table").jqGrid('getDataIDs'); //获取所有的id
	//操作项json对象
	var operJsonArr = new Array();
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
	    $('#grid-table').jqGrid('saveRow', id);
		var rowdata = $("#grid-table").jqGrid("getRowData",id); //根据上面的id获得本行数据
		var operid= rowdata.OPERID;
		
		var opername= rowdata.OPERNAME;
		var nameindex = opername.indexOf('input');//验证
		if(nameindex != -1){
			return false;
		}
		
		var opercode = rowdata.OPERCODE;
		var codeindex = opercode.indexOf('input');//验证
		if(codeindex != -1){
			return false;
		}
		
		var operstyle =rowdata.OPERSTYLE;
		var styleindex = operstyle.indexOf('input');//验证
		if(styleindex != -1){
			return false;
		}
		
	    var ordernum = rowdata.ORDERNUM;
  		var note = rowdata.NOTE;

  		var obj = {
  			"operid":operid,
  			"opername":opername,
  			"opercode":opercode,
  			"operstyle":operstyle,
  			"ordernum":ordernum,
  			"note":note
  		};
  		operJsonArr.push(obj);
	}
	
	//权限json对象
	var privJson={};
	var privJsonArr = $("#privform").serializeArray();
	$.each(privJsonArr, function() {    
	       if (privJson[this.name]) {    
	           if (!privJson[this.name].push) {    
	        	   privJson[this.name] = [privJson[this.name]];    
	           }    
	           privJson[this.name].push(this.value || '');    
	       } else {    
	    	   privJson[this.name] = this.value || '';    
	       }    
	});    
	
	var param={"sysPriv":JSON.stringify(privJson),"sysOpers":JSON.stringify(operJsonArr)};
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/syspriv/savePrivOper',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid("","");//刷新列表
				parent.getActiveIFrame().loadPrivTree();//刷新树();
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
