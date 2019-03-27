$(document).ready(function() {
	SelectOption.loadVideostate("state");//视频主机状态
	SelectOption.loadMacProbeBrand("probebrandid");//主机品牌
	if($("#probebrandid").attr("selectvalue")!=""){
		SelectTree.loadMacProbeBrandTypeSelect("probebrandtypeName",{probebrandid:$("#probebrandid").attr("selectvalue"),flag:"1"});//主机型号
	}
	
	$("#probebrandid").on("change",function(){
		var probebrandid = $(this).val();
		if( probebrandid =="")
			probebrandid = "-1";
		$("#probebrandtypeName").attr("selectvalue","");
		$("#probebrandtypeName_select").remove();
		$("#probebrandtypeName").val("请选择");
		SelectTree.loadMacProbeBrandTypeSelect("probebrandtypeName",{probebrandid : probebrandid, flag : "1"});//主机型号
	});
	
	$("#entname").on("click",function(){
		openBusinessinfoWin();
	});
	
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	
	$("#macprobehostform").validate({
		rules: {
				probehostnum:{
					required: true,
					stringCheck:true,
					remote:{
					    url: BASE_URL+"/monitor/macprobehost/existsProbeHostNum",     //后台处理程序
					    type: "post",               //数据发送方式
					    dataType: "json",           //接受数据格式   
					    data: {                     //要传递的数据
					    	probeHostNum: function(){
								return $("#probehostnum").val();
							},
							probeHostId:function(){
								return $("#probehostid").val();
							}
					    }
					}
				},
				probebrandid:{
					required: true
				},
				probebrandtypeid:{
					required: true
				},
				probehostname:{
					required: true
				},
				ipaddr:{
					required: true,
					ipv4:true
				},
				port:{
					required: true,
					digits : true
				},
				businessinfoid:{
					required: true
				},
				state:{
					required: true
				}
		},
		messages: {
				probehostnum:{
					required: "主机编号不能为空",
					remote: "编号已存在",
					stringCheck:"只能包括字母、数字、点和下划线"
				},
				probebrandid:{
					required: "主机品牌不能为空"
				},
				probebrandtypeid:{
					required: "主机型号不能为空"
				},
				probehostname:{
					required: "主机名称不能为空"
				},
				ipaddr:{
					required: "IP不能为空",
					ipv4:"IP地址不正确"
				},
				port:{
					required: "端口号不能为空",
					digits : "端口号只能为数字"
				},
				businessinfoid:{
					required: "所属企业不能为空"
				},
				state:{
					required: "状态没有选择"
				}
			},
		submitHandler:function(form){
	    	save();
	    }   
	});
});
/**
 * 打开企业信息列表页面
 */
function openBusinessinfoWin(){
	parent.openWin(BASE_URL+"/enterprise/entbaseinfo/selectBaseinfoName/"+parent.getSelfIndex(),'选择企业','65%','75%');
}

/**
 * 接收危化品名录库窗口传递回来的值
 * @param json
 */
function selectBaseinfo(json){
	var obj = eval("("+json+")");
	var businessinfoid = obj[0].BUSINESSINFOID;
	var entname = obj[0].ENTNAME;
	$("#businessinfoid").val(businessinfoid);
	$("#entname").val(entname);
}

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/macprobehost/saveENT',
		cache : false,
		dataType : 'json',
		data : $("#macprobehostform").serializeArray(),
		global : false,
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