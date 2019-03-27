/**
 * 新增和修改设备设施风险信息
 */
$(function () {
	var equid = GetQueryString("equid");
	$("#equForm").validate({
		rules: {
			typeid: {
				required: true
			},
			functionpart: {
				required: true,
                maxlength: 500
			},
			parts:{
				required: true,
                maxlength: 500
			},
            fault:{
				required:true,
                maxlength: 500
			},
			saferisk:{
				required:true,
                maxlength: 500
			},
			faultfactor:{
				required:true,
                maxlength: 500
			},
            ctrlmeasure:{
				required:true,
                maxlength: 500
			}
		},
		messages: {
			typeid: {
				required: "所属模块不能为空"
			},
            functionpart: {
				required: "功能部分不能为空",
                maxlength:"最多输入500个字"
			},
            parts:{
				required: "部件不能为空",
                maxlength:"最多输入500个字"
			},
            fault:{
                required:"故障不能为空",
                maxlength:"最多输入500个字"
            },
            saferisk:{
                required:"安全风险",
                maxlength:"最多输入500个字"
            },
            faultfactor:{
                required:"风险因素",
                maxlength:"最多输入500个字"
            },
            ctrlmeasure:{
                required:"控制措施",
                maxlength:"最多输入500个字"
            }
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskequ/load",
		dataType: "json",
		data:{
			equid:equid
		},
		success : function(data) {
			if (data) {
				var equTpt = _.template($("#equTpt").html());
				$("#equForm").html(equTpt(data));
				
				SelectTree.loadRiskTypeTree("typename",{
					userType:0,
					typecode:2
				},"");
				
				
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
	
});
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


/**
 * 保存
 * @returns
 */
function save(){
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskequ/save",
		data : $("#equForm").serializeArray(),
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
	
}
