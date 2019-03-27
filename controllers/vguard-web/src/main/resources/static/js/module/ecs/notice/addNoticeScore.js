/**
 * 诚信公告打分
 */
$(function () {
	var noticeid = GetQueryString("noticeid");
	window.allEchartsDic = new MapUtil();
	$("#noticeScoreForm").validate({
		rules: {
			finascore: {
				required: true,
				digits: true,
				min:0,
				max:100
			}
		},
		messages: {
			finascore: {
				required: "综合得分不能为空",
				digits: "请输入整数",
				min:"请输入不小于0的整数",
				max:"请输入不大于100的整数"
			}
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsnotice/editNoticeScore/"+noticeid,
		dataType: "json",
		data:{
			noticeid:noticeid
		},
		success : function(data) {
			if (data) {
				var blackRecordTpt = _.template($("#noticeScoreTpt").html());
				$("#noticeScoreForm").html(blackRecordTpt(data));
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
		url : BASE_URL + "ecs/ecsnotice/saveNoticeScore",
		data : $("#noticeScoreForm").serializeArray(),
        dataType: "json",
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.getActiveIFrame().freshAllGraph(window.allEchartsDic);//重新加载图表
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

