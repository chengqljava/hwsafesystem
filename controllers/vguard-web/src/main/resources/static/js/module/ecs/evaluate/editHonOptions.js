$(document).ready(function() {
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecshonoption/load/" + GetQueryString("optionid"),
		data : {},
		success : function(data) {
			if (data) {
				var ecsHonOptionsTpt = _.template($("#ecsHonOptionsTpt").html());
				$("#ecsHonOptionsForm").html(ecsHonOptionsTpt(data));
				
				if (data.add) {
					//新增时设置权重值为剩余权重值
					$("#weight").val(data.otherWeight);
					$("#weight").blur(function () {
						//新增
						var weight = $("#weight").val() == "" ? 0 :$("#weight").val();
						if (weight > data.otherWeight) {
							parent.toast("已超出总权重值1,请重新输入!");
							$("#weight").val(data.otherWeight);
							return;
						}
						
					});
				}else{
					$("#weight").blur(function () {
						//编辑
						var weight = $("#weight").val() == "" ? 0 :$("#weight").val();
						//比输入值与设置值大小
						var idx = (Number(weight) - Number(data.weight)).toFixed(1);
						
						if (idx > data.otherWeight) {
							parent.toast("已超出总权重值1,请重新输入!");
							$("#weight").val(data.weight);
							return;
						}else{
							var c = (Number(data.otherWeight) - idx).toFixed(1);
							$("#otherWeight").val(c);
						}
					});
				}
//				//权重以及剩余权重联动
//				//剩余权重
//				$("#otherWeightTD").val($("#otherWeight").val());
//				
//				//该项原有权重值
//				$("#weightTD").val($("#weight").val());
//				$("#weight").blur(function () {
//					//剩余权重值
//					var otherWeight = $("#otherWeightTD").val();
//					//该项原有权重值
//					var weightTD = $("#weightTD").val()  == "" ? 0 :$("#weightTD").val() ;
//					//定义剩余权重
//					var num;
//					var weightnow = $("#otherWeight").val();
//					//当前输入权重值
//					var weight = $("#weight").val() == "" ? 0 :$("#weight").val();
//					
//					if (weightnow < weight) {
//						parent.toast("设置权重值不能大于剩余权重值!");
//						$("#weight").val(0);
//						return;
//					}
//					//如果输入权重值大于原有权重值
//					if (weight > weightTD) {
//						//获取多出的权重值
//						weight = (Number(weight)-Number(weightTD)).toFixed(1);
//						//剩余权重值减去多出权重值  得到 当前剩余权重值
//						num = (Number(otherWeight)-Number(weight)).toFixed(1);
//						//如果当前剩余权重值大于原有权重值  或者 小于0
//						if (num > $("#otherWeight").val() || num < 0 ) {
//							parent.toast("剩余权重与设置权重之和不能大于1或小于0!");
//						}else{
//							//设置当前剩余权重
//							$("#otherWeight").val(num);
//						}
//						//如果输入权重值小于原有权重值
//					}else if(weight < weightTD) {
//						//原有权重值减去输入权重值
//						weight = (Number(weightTD)-Number(weight)).toFixed(1); 
//						num=(Number(otherWeight) + Number(weight)).toFixed(1);
//						if (num > otherWeightTD || num < 0 ) {
//							parent.toast("剩余权重与设置权重之和不能大于1或小于0!");
//						}else{
//							$("#otherWeight").val(num);
//						}
//					}else if(weight ==0 ){
//						$("#otherWeight").val(otherWeight);
//					}
//				});
				
				$("#ecsHonOptionsForm").validate({
					rules: {
						type: {
							required: true,
						},
						weight: {
							required: true,
							max: 1,
							min: 0,
							cRessureCheck:true
						}
					},
					messages: {
						type: {
							required: "评分类型不能为空"
						},
						weight: {
							required: "权重不能为空",
							max : "权重值不能大于1",
							min : "权重值不能小于0",
							cRessureCheck:"输入权重值精确至一位小数"
						}
					},
					submitHandler:function(form){
					   	save();
				    }   
				});
			}
		}
	});
	
	
});

/*保存(新增或编辑)*/
function save(){
//	//原剩余权重值
//	var otherWeightTD = $("#otherWeightTD").val();
//	//当前剩余权重值
//	var otherWeigh = $("#otherWeight").val();
//	//设置权重值
//	var weight = $("#weight").val();
	
//	var num =  (Number(otherWeigh)+Number(weight)).toFixed(1);
	
//	if (Number(otherWeightTD).toFixed(1) == num && weight != 0) {
		$.ajax({
			type : 'post',
			url : BASE_URL + 'ecs/ecshonoption/save',
			cache : false,
			dataType : 'json',
			data : $("#ecsHonOptionsForm").serializeArray(),
			global : false,
			success : function(json) {
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			},
			error : function() {
				parent.toast("保存失败");
			}
		});
//	}else if(weight == 0){
//		parent.toast("保存失败! 设置权重值不能为0!");
//	}else{
//		parent.toast("保存失败! 权重值与剩余权重值之和不能大于原剩余权重值!");
//	}
}


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
