/**
 * 黑名单移除
 */
$(function () {
	var recordid = GetQueryString("recordid");
	$("#blackRecordForm").validate({
		rules: {
			removereason: {
				required: true
			}
		},
		messages: {
			removereason: {
				required: "移除原因不能为空"
			}
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsblarecord/load/"+recordid,
		dataType: "json",
		data:{
			recordid:recordid
		},
		success : function(data) {
			if (data) {
				var blackRecordTpt = _.template($("#blackRecordTpt").html());
				data.baseUrl = BASE_URL;
				$("#blackRecordForm").html(blackRecordTpt(data));
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
		url : BASE_URL + "ecs/ecsblarecord/remove",
		data : $("#blackRecordForm").serializeArray(),
        dataType: "json",
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
			parent.toast("移除失败");
		}
	});
	
}

