/**
 * 黑名单整改
 */
$(function () {
	var recordid = GetQueryString("recordid");
	$("#blackRecordForm").validate({
		rules: {
			reformdetail: {
				required: true
			}
		},
		messages: {
			reformdetail: {
				required: "整改情况说明不能为空"
			}
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsblareform/load/"+recordid,
		dataType: "json",
		data:{
			recordid:recordid
		},
		success : function(data) {
			if (data) {
				var blackRecordTpt = _.template($("#blackRecordTpt").html());
				data.baseUrl = BASE_URL;
				$("#blackRecordForm").html(blackRecordTpt(data));
				showUploadFile("fileUploadDiv", 'file', true, true);// 显示文件上传控件
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
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}

	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL + "ecs/ecsblareform/save",
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#blackRecordForm").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);// 弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
	
}

