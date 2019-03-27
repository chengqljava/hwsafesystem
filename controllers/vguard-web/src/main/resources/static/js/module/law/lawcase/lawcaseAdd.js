$(document).ready(function() {

	jQuery.validator.addMethod("entNameORcheckEntName" ,function(value,element){
		 var entname = $('#entname').val();
		 var checkentname = $('#checkentname').val();
		 if(entname.length == 0 && checkentname.length == 0){
			 return  false;
		 }else{
			 return true;
		 }
	},"立案企业和检查记录不能同时为空!");
	$("#lawcaseform").validate({
		rules: {
			area: {
				required: true,
				isChinese: true,
				rangelength: [2,2]
			},
			year: {
				required: true,
				isDigits: true,
				rangelength: [4,4]
			},
			num: {
				required: true,
				isDigits: true,
				rangelength: [3,3]
			},
			casename: {
				required: true
			},
			/*entname: {
				required: true
			},*/
			checkentname: {
				entNameORcheckEntName: true
			}
		},
		messages: {
			area: {
				required: "区域不能为空",
				rangelength: "请输入2个中文"
			},
			year: {
				required: "年份不能为空",
				rangelength: "请输入4个数字"
			},
			num: {
				required: "编号不能为空",
				rangelength: "请输入3个数字",
			},
			casename: {
				required: "案件名称不能为空"
			},
			/*entname: {
				required: "立案企业不能为空"
			},*/
			checkentname: {
				entNameORcheckEntName: "立案企业和检查记录不能同时为空!"
			}
		},
		submitHandler:function(form){
		    save();
	    }   
	});
});


/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawcase/save',
		cache : false,
		dataType : 'json',
		data : $("#lawcaseform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
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

/**
 * 	企业新增入口
 */
$("#addEnt").bind("click",function(){
	parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/add",'新增工商信息','','85%');
});

/**
 * 企业信息
 */
function loadEnt(){
	/**
	 * 加载企业
	 */
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
		$('#businessinfoid').val(rowdata.BUSINESSINFOID);
		$('#entname').val(rowdata.ENTNAME);
		$('#entname').blur();
	});
	var planid = $("#plan option:selected").val();
	window.top.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid="+planid,' 企业信息','65%','70%');
}
	
/**
 * 执法登记信息
 */
function loadCheckInfo(){
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
		$('#checkentname').val(rowdata.ENTNAME);
		$('#checkinfoid').val(rowdata.CHECKINFOID);
	});
	var entname = $('#entname').val();
	entname=encodeURI(entname); 
	entname=encodeURI(entname); 
	window.top.openWin(BASE_URL+"/law/lawcheckinfo/noReglawcase?entname="+entname ,' 检查信息','60%','70%');


}