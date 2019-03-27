$(document).ready(function() {
	SelectOption.loadVideostate("state");//视频主机状态
	SelectOption.loadMacVideoBrand("videobrandid");//主机品牌
	SelectOption.loadIsGovVideo("isgov");//视频主机类型
	SelectOption.loadGovVideoType("govvideotype");//政府视频类型
	SelectOption.loadHikPlatNum("hikplatnum");//所属海康平台
	SelectTree.loadOrgByOrgidSelect("orgname", {"orgid": $("#loginOrgid").val()},null, function(treeNode){});//所属政府单位下拉树选择
	
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
//				entname:{
//					required: true
//				},
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
				},
				isgov:{
					required: true
				},
				hikplatnum:{
					required: true
				},
				appinvtduip:{
					required: true
				},
				appinvtduport:{
					required: true
				},
				appoutvtduip:{
					required: true
				},
				appoutvtduport:{
					required: true
				},
				hyplayport:{
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
//				entname:{
//					required: "所属企业不能为空"
//				},
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
				},
				isgov: {
					required: "视频主机类型不能为空"
				},
				hikplatnum: {
					required: "所属海康平台不能为空"
				},
				appinvtduip:{
					required: "APP内网流媒体组IP不能为空"
				},
				appinvtduport:{
					required: "APP内网流媒体组端口号不能为空"
				},
				appoutvtduip:{
					required: "APP外网流媒体组IP不能为空"
				},
				appoutvtduport:{
					required: "APP外网流媒体组端口号不能为空"
				},
				hyplayport:{
					required: "怀业播放器端口不能为空"
				}
			},
		submitHandler:function(form){
	    	save();
	    }   
	});
	
	//视频归属政府时显示相关政府视频类型字段
	var curIsGov = $("#isgov").attr("selectvalue");
	if ("1" == curIsGov) {
		$("#isgov").parent().removeAttr("colspan");
//		$(".entnameTd").hide();
		$(".govVideoTypeTd, .orgnameTd").show();
		$("#govvideotype").rules("remove");
		$("#govvideotype").rules("add", {
			required: true,
			messages: {  
				required: "政府视频类型不能为空"
			} 
		});
		$("#orgname").rules("remove");
		$("#orgname").rules("add", {
			required: true,
			messages: {  
				required: "所属政府单位名不能为空"
			} 
		});
	} else if ("0" == curIsGov) {
		$(".entnameTd").show();
		$("#entname").rules("remove");
		$("#entname").rules("add", {
			required: true,
			messages: {  
				required: "所属企业不能为空"
			} 
		});
	}
	
	//视频主机类型选择框选择回调事件
	$("#isgov").on("change",function() {
		var curIsGov = $("#isgov").val();
		if ("0" == curIsGov) {
			//清除对所属政府视频类型校验，加上对企业的校验
			$("#govvideotype").val("");
			$("#govvideotype").rules("remove");
			$(".govVideoTypeTd").hide();
			
			$("#isgov").parent().attr("colspan", "3");
			$("#state").parent().removeAttr("colspan");
			$(".orgnameTd").hide();
			$('#orgname').rules("remove");
			$(".entnameTd").show();
			$('#entname').rules("remove");
			$("#entname").rules("add", {
				required: true,
				messages: {  
					required: "所属企业不能为空"
				} 
			});
		} else if ("1" == curIsGov) {
			//清除对所属企业的校验，加上对政府视频类型校验
			$("#isgov").parent().removeAttr("colspan");
			$(".govVideoTypeTd").show();
			$('#govvideotype').rules("remove");
			$('#govvideotype').rules("add", {
				required: true,
				messages: {  
					required : "政府视频类型不能为空", 
				} 
			});
			
			$("#state").parent().removeAttr("colspan");
			$(".entnameTd").hide();
			$('#entname').rules("remove");
			$(".orgnameTd").show();
			$('#orgname').rules("remove");
			$("#orgname").rules("add", {
				required: true,
				messages: {  
					required: "所属政府单位名不能为空"
				} 
			});
		} else {
			//当选择为空时，隐藏企业或政府相关联表单区域
			$(".govVideoTypeTd, .entnameTd, .orgnameTd").hide();
			$("#isgov, #state").parent().attr("colspan", "3");
		}
	});
	
	
	//默认第一次加载当前视频来源平台
	var curHkPlatNum = $("#hikplatnum").attr("selectvalue");
	if ("8200" == curHkPlatNum) {
		$("#hyplayport").val("1");
		$("#username, #password, #ipaddr, #port, #hyplayport").parent().parent().hide();
	} else if ("8700" == curHkPlatNum) {
		$("#hyplayport").val("1");
		$("#username, #password, #ipaddr, #port, " +
		  "#invagip, #invagport, #invtduip, #invtduport, " +
		  "#outvagip, #outvagport, #outvtduip, #outvtduport, #hyplayport").parent().parent().hide();
	} else if ("HY" == curHkPlatNum) {
		var curHyplayport = $("#hyplayport").val();
		if (null == curHyplayport || "" == curHyplayport) {
			$("#hyplayport").val("1");
		}
		
		$("#invagip, #invagport, #invtduip, #invtduport, " +
		  "#outvagip, #outvagport, #outvtduip, #outvtduport").parent().parent().hide();
	} else if ("NVR" == curHkPlatNum) {
		$("#hyplayport").val("1");
		$("#invagip, #invagport, #invtduip, #invtduport, " +
		  "#outvagip, #outvagport, #outvtduip, #outvtduport, #hyplayport").parent().parent().hide();
	}
	
	//视频来源平台选择框选择回调事件
	$("#hikplatnum").on("change",function() {
		var curHikPlatNum = $("#hikplatnum").val();
		if ("8200" == curHikPlatNum) {
			$("#username, #password, #ipaddr, #port, #hyplayport").parent().parent().hide();
			$("#username").val("1");
			$("#password").val("1");
			$("#ipaddr").val("1.1.1.1");
			$("#port").val("1");
			$("#hyplayport").val("1");
			
			$("#invagip, #invagport, #invtduip, #invtduport, " +
			  "#outvagip, #outvagport, #outvtduip, #outvtduport, " +
			  "#appinvtduip, #appinvtduport, #appoutvtduip, #appoutvtduport").val("").parent().parent().show();
		} else if ("8700" == curHikPlatNum) {
			$("#username, #password, #ipaddr, #port, " +
			  "#invagip, #invagport, #invtduip, #invtduport, " +
			  "#outvagip, #outvagport, #outvtduip, #outvtduport, #hyplayport").parent().parent().hide();
			
			$("#username").val("1");
			$("#password").val("1");
			$("#ipaddr").val("1.1.1.1");
			$("#port").val("1");
			
			$("#invagip").val("1.1.1.1");
			$("#invagport").val("1");
			$("#invtduip").val("1.1.1.1");
			$("#invtduport").val("1");
			$("#outvagip").val("1.1.1.1");
			$("#outvagport").val("1");
			$("#outvtduip").val("1.1.1.1");
			$("#outvtduport").val("1");
			$("#hyplayport").val("1");
			
			$("#appinvtduip, #appinvtduport, #appoutvtduip, #appoutvtduport").val("").parent().parent().show();
		} else if ("HY" == curHikPlatNum) {
			$("#invagip, #invagport, #invtduip, #invtduport, " +
			  "#outvagip, #outvagport, #outvtduip, #outvtduport").parent().parent().hide();
					
			$("#invagip").val("1.1.1.1");
			$("#invagport").val("1");
			$("#invtduip").val("1.1.1.1");
			$("#invtduport").val("1");
			$("#outvagip").val("1.1.1.1");
			$("#outvagport").val("1");
			$("#outvtduip").val("1.1.1.1");
			$("#outvtduport").val("1");
			
			$("#username, #password, #ipaddr, #port, " +
			  "#appinvtduip, #appinvtduport, #appoutvtduip, #appoutvtduport, #hyplayport").val("").parent().parent().show();
		} else if ("NVR" == curHikPlatNum) {
			$("#invagip, #invagport, #invtduip, #invtduport, " +
			  "#outvagip, #outvagport, #outvtduip, #outvtduport, #hyplayport").parent().parent().hide();
					
			$("#invagip").val("1.1.1.1");
			$("#invagport").val("1");
			$("#invtduip").val("1.1.1.1");
			$("#invtduport").val("1");
			$("#outvagip").val("1.1.1.1");
			$("#outvagport").val("1");
			$("#outvtduip").val("1.1.1.1");
			$("#outvtduport").val("1");
			$("#hyplayport").val("1");
			
			$("#username, #password, #ipaddr, #port, " +
			  "#appinvtduip, #appinvtduport, #appoutvtduip, #appoutvtduport").val("").parent().parent().show();
		} else {
			$("#username, #password, #ipaddr, #port, " +
			  "#invagip, #invagport, #invtduip, #invtduport, " +
			  "#outvagip, #outvagport, #outvtduip, #outvtduport, " + 
			  "#appinvtduip, #appinvtduport, #appoutvtduip, #appoutvtduport, #hyplayport").val("").parent().parent().show();
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
		url : BASE_URL+'/monitor/macvideohost/save',
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