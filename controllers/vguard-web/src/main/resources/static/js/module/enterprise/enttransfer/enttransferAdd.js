/*交班*/
$(function () {		
	var changeid = getQueryString("changeid");
	$("#enttransferForm").validate({
		rules: {
			post: {
				required: true,
				maxlength:16
			},
			caretaker: {
				required: true,
				maxlength:50
			},
			dutystart: {
				required: true
			},
			dutyend: {
				required: true
			},
			changer: {
				required: true,
				maxlength:50
			},
			dutytime: {
				required: true
			},
			dutyrecord: {
				required: true,
				maxlength:255
			},
			attention: {
				maxlength:255
			},
			equipment: {
				required: true,
				maxlength:255
			}
		},
		messages: {
			post: {
				required: "岗位不能为空",
				maxlength:"最多输入16个字"
			},
			caretaker: {
				required: "值班人员不能为空",
                maxlength:"最多输入50个字"
			},
			dutystart: {
				required: "值班开始时间不能为空"
			},
			dutyend: {
				required: "值班结束时间不能为空"
			},
			changer: {
				required: "交班人不能为空",
				maxlength: "最多输入50个字"
			},
			dutytime: {
				required: "交班人不能为空"
			},
			dutyrecord: {
				required: "交班记录不能为空",
				maxlength: "最多输入255个字"
			},
			attention: {
				maxlength: "最多输入255个字"
			},
			equipment: {
				required: "设备情况不能为空",
				maxlength: "最多输入255个字"
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

