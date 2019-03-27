/*交班*/
$(function () {		
	var changeid = getQueryString("changeid");
		
	$("#enttransferForm").validate({
		rules: {
			successrecord: {
				maxlength:255
			},
			successor: {
				required: true,
				maxlength:50
			},
			changestate: {
				required: true
			},
			changetime: {
				required: true
			}
		},
		messages: {
			successrecord: {
				maxlength:"最多输入255个字"
			},
			successor: {
				required: "接班人员不能为空",
                maxlength:"最多输入50个字"
			},
			changestate: {
				required: "交接状态不能为空"
			},
			changetime: {
				required: "接班时间不能为空"
			}		
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/enttransfer/load",
		dataType : "json",
		data :{
			changeid:changeid
		},
		success : function(data) {
			if (data) {
				var enttransferTpt = _.template($("#enttransferTpt").html());
				$("#enttransferForm").html(enttransferTpt(data));
				
				SelectOption.loadChangeState("changestate");//交接状态下拉选	
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});
});

function getQueryString(name)
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
		url : BASE_URL + "enterprise/enttransfer/save",
		data : $("#enttransferForm").serializeArray(),
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

