$(document).ready(function() {
	SelectOption.loadVideostate("state");//视频主机状态
	SelectOption.loadMacVideoBrand("videobrandid");//主机品牌
	
	
	
	loadSelectTree($("#videobrandid").attr("selectvalue"));
	
	$("#videobrandid").on("change",function(){
		$("#videobrandtypeName").attr("selectvalue","");
		$("#videobrandtypeName_select").remove();
		loadSelectTree($("#videobrandid").val());
	});
	
	$("#entname").on("click",function(){
		openBusinessinfoWin();
	});
	
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	
	$("#macvideohostform").validate({
		rules: {
				videohostnum:{
					required: true,
					stringCheck:true,
					remote:{
					    url: BASE_URL+"/monitor/macvideohost/existsVideohostnum",     //后台处理程序
					    type: "post",               //数据发送方式
					    dataType: "json",           //接受数据格式   
					    data: {                     //要传递的数据
					    	videohostnum: function(){
								return $("#videohostnum").val();
							},
							videohostid:function(){
								return $("#videohostid").val();
							}
					    }
					}
				},
				videobrandid:{
					required: true
				},
				videobrandtypeName:{
					required: true
				},
				videohostname:{
					required: true
				},
				username:{
					required: true
				},
				password:{
					required: true
				},
				ipaddr:{
					required: true,
					ipv4:true
				},
				port:{
					required: true,
					isDigits:true
				},
				entname:{
					required: true
				},
				state:{
					required: true
				},
				invagip:{
					required: true
				},
				invagport:{
					required: true
				},
				invtduip:{
					required: true
				},
				invtduport:{
					required: true
				},
				outvagip:{
					required: true
				},
				outvagport:{
					required: true
				},
				outvtduip:{
					required: true
				},
				outvtduport:{
					required: true
				}
		},
		messages: {
				videohostnum:{
					required: "主机编号不能为空",
					remote: "编号已存在",
					stringCheck:"只能包括字母、数字、点和下划线"
				},
				videobrandid:{
					required: "主机品牌不能为空"
				},
				videobrandtypeName:{
					required: "主机型号不能为空"
				},
				videohostname:{
					required: "主机名称不能为空"
				},
				username:{
					required: "用户名不能为空"
				},
				password:{
					required: "密码不能为空"
				},
				ipaddr:{
					required: "IP不能为空",
					ipv4:"IP地址不正确"
				},
				port:{
					required: "端口号不能为空",
					isDigits:"端口不正确"
				},
				entname:{
					required: "所属企业不能为空"
				},
				state:{
					required: "状态没有选择"
				},
				invagip:{
					required: "内网云台操作IP不能为空"
				},
				invagport:{
					required: "内网云台操作端口号不能为空"
				},
				invtduip:{
					required: "内网流媒体组IP不能为空"
				},
				invtduport:{
					required: "内网流媒体组端口号不能为空"
				},
				outvagip:{
					required: "外网云台操作IP不能为空"
				},
				outvagport:{
					required: "外网云台操作端口号不能为空"
				},
				outvtduip:{
					required: "外网流媒体组IP不能为空"
				},
				outvtduport:{
					required: "外网流媒体组端口号不能为空"
				}
			},
		submitHandler:function(form){
	    	save();
	    }   
	});
});
/**
 * 加载信号下拉树
 */
function loadSelectTree(videobrandid){
	if(videobrandid == "" || videobrandid==null){
		videobrandid = "-1";
	}
	SelectTree.loadMacVideoBrandTypeSelect("videobrandtypeName",{videobrandid:videobrandid,flag:"1"});//主机型号
}

/**
 * 打开企业信息列表页面
 */
function openBusinessinfoWin(){
	parent.openWin(BASE_URL+"/enterprise/entbaseinfo/selectBaseinfoName/"+parent.getSelfIndex(),'选择企业','65%','75%');
}
/**
 * 接收企业列表返回的值
 * @param json
 */
function selectBaseinfo(json){
	var obj = eval("("+json+")");
	var businessinfoid = obj[0].BUSINESSINFOID;
	var entname = obj[0].ENTNAME;
	$("#businessinfoid").val(businessinfoid);
	$("#entname").val(entname);
	$('#entname').focus();
}

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/macvideohost/saveENT',
		cache : false,
		dataType : 'json',
		data : $("#macvideohostform").serializeArray(),
		global : true,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
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