$(document).ready(function() {
	SelectOption.loadVideostate("state");//视频主机状态
	SelectOption.loadMacProbeBrand("brandid");//主机品牌
	
	SelectOption.loadMonitorGatherTypeResult("probetype");//监测监控采集
	
	loadSelectTree($("#brandid").attr("selectvalue"));
	$("#brandid").on("change",function(){
		$("#probebrandtypeName").attr("selectvalue","");
		$("#probebrandtypeName_select").remove();
		loadSelectTree($("#brandid").val());
	});
	
	
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	
	$("#macprobeform").validate({
		rules: {
			probenum:{
				required: true,
				stringCheck:true,
				remote:{
				    url: BASE_URL+"/monitor/macprobe/existsProbeNum",     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	probeId: function(){
							return $("#probeid").val();
						},
						probeNum:function(){
							return $("#probenum").val();
						}
				    }
				}
			},
			brandid:{
				required: true
			},
			brandtypeid:{
				required: true
			},
			probename:{
				required: true
			},
			probetype:{
				required: true
			},
			unit:{
				required: true
			},
			range:{
				required: true,
				number : true
			},
			probegroup:{
				required: true
			},
			state:{
				required: true
			},
			probehostid:{
				required: true
			}
		},
		messages: {
			probenum:{
				required: "编号不能为空",
				remote:"编号已存在",
				stringCheck:"只能包括字母、数字、点和下划线"
			},
			brandid:{
				required: "品牌不能为空"
			},
			brandtypeid : {
				required: "型号不能为空"
			},
			probename : {
				required: "监测探头名称不能为空"
			},
			probetype : {
				required: "监测类型不能为空"
			},
			unit : {
				required: "单位不能为空"
			},
			range : {
				required: "量程不能为空",
				number : "量程只能为数字"
			},
			probegroup:{
				required: "分组不能为空"
			},
			state:{
				required: "状态不能为空"
			},
			probehostid:{
				required: "主机不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

$("#macProbeHostName").on("click",function(){
	openProbeHost();
});
/**
 * 打开选择视频主机列表
 */
function openProbeHost(){
	parent.openWin(BASE_URL+"/monitor/macprobe/selectProbeHost/"+parent.getSelfIndex(),'选择主机','65%','75%');
}

/**
 * 接收 选择视频主机 返回的值
 * @param json
 */
function selectProbeHost(json){
	var obj = eval("("+json+")");
	var probehostid = obj[0].PROBEHOSTID;
	var macProbeHostName = obj[0].MACPROBEHOSTNAME;
	$("#probehostid").val(probehostid);
	$("#macProbeHostName").val(macProbeHostName);
}

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/macprobe/save',
		cache : false,
		dataType : 'json',
		data : $("#macprobeform").serializeArray(),
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

/**
 * 接收 选择监测主机 返回的值
 * @param json
 */
function selectProbeHost(json){
	var obj = eval("("+json+")");
	var probehostid = obj[0].PROBEHOSTID;
	var macProbeHostName = obj[0].MACPROBEHOSTNAME;
	$("#probehostid").val(probehostid);
	$("#macProbeHostName").val(macProbeHostName);
}

/**
 * 加载型号树
 */
function loadSelectTree(brandid){
	if(brandid == "" || brandid == null){
		brandid = "-1";
	}
	SelectTree.loadMacProbeBrandTypeSelect("probebrandtypeName",{probebrandid:brandid,flag:"2"});//主机型号
}
