$(document).ready(function() {
	SelectOption.loadVideostate("state");//视频主机状态
	SelectOption.loadMacVideoBrand("brandid");//主机品牌
	
	SelectOption.loadEqVisible("visible");//是否可见
	
	loadSelectTree($("#brandid").attr("selectvalue"));
	$("#brandid").on("change",function(){
		$("#videobrandtypeName").attr("selectvalue","");
		$("#videobrandtypeName_select").remove();
		loadSelectTree($("#brandid").val());
	});
	
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	
	$("#macvideoform").validate({
		rules: {
			videonum:{
				required: true,
				stringCheck:true
				/**
				,
				remote:{
				    url: BASE_URL+"/monitor/macvideo/existsVideonum",     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	videoid: function(){
							return $("#videoid").val();
						},
						videonum:function(){
							return $("#videonum").val();
						}
				    }
				}
				*/
			},
			brandid:{
				required: true
			},
			videobrandtypeName:{
				required: true
			},
			videoname:{
				required: true
			},
			videogroup:{
				stringCheck:true,
				required: true
			},
			state:{
				required: true
			},
			macVideoHostName:{
				required: true
			},
			indexcode:{
				required: true
			}
		},
		messages: {
			videonum:{
				required: "通道不能为空",
				stringCheck:"只能包括字母、数字、点和下划线"
				//remote:"编号已存在",
			},
			brandid:{
				required: "品牌不能为空"
			},
			videobrandtypeName:{
				required: "型号不能为空"
			},
			videoname:{
				required: "摄像头名称不能为空"
			},
			videogroup:{
				required: "分组不能为空",
				stringCheck:"只能包括字母、数字、点和下划线"
			},
			state:{
				required: "状态不能为空"
			},
			macVideoHostName:{
				required: "主机不能为空"
			},
			indexcode:{
				required: "摄像头索引号不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

$("#macVideoHostName").on("click",function(){
	openVideoHost();
});
/**
 * 加载型号树
 */
function loadSelectTree(brandid){
	if(brandid == "" || brandid == null){
		brandid = "-1";
	}
	SelectTree.loadMacVideoBrandTypeSelect("videobrandtypeName",{videobrandid:brandid,flag:"2"});//主机型号
}


/**
 * 打开选择视频主机列表
 */
function openVideoHost(){
	parent.openWin(BASE_URL+"/monitor/macvideohost/selectVideoHostENT/"+parent.getSelfIndex(),'选择主机','65%','75%');
}

/**
 * 接收 选择视频主机 返回的值
 * @param json
 */
function selectVideoHost(json){
	var obj = eval("("+json+")");
	var videohostid = obj[0].VIDEOHOSTID;
	var macVideoHostName = obj[0].MACVIDEOHOSTNAME;
	$("#videohostid").val(videohostid);
	$("#macVideoHostName").val(macVideoHostName);
	$("#macVideoHostName").focus();
}

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/macvideo/save',
		cache : false,
		dataType : 'json',
		data : $("#macvideoform").serializeArray(),
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