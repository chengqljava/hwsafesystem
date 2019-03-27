/**
 * 应急救援GIS首页-添加智能方案
 * Created by Administrator on 2017/10/16.
 */
$(function() {
	//获取父级页面-当前所选事故id和最新事故模拟id
//	var curEvnAnaId = getQueryString("curEvnAnaId"),
//		eventid = getQueryString("eventid");
	$("#addAiPlanForm").validate({
		rules: {
			schemename: {
				required: true,
				maxlength: 30
			},
			schemecode: {
				required: true,
				maxlength: 10
			}
		},
		messages: {
			schemename: {
				required: "方案名称不能为空",
				maxlength: "字符长度不能超过30"
			},
			schemecode: {
				required: "方案编号不能为空",
				maxlength: "字符长度不能超过10"
			}
		},
		submitHandler: function(form) {
			//向父窗口传递参数
			window.top.GEventObject.fireEvent("LOAD_EMS_AiPLAN_ADD_EVENT", {
				"schemename": $("#schemename").val(),
				"schemecode": $("#schemecode").val()
			});
			parent.closeWin();// 关闭弹出框
//			parent.getAddedNewPlanRes({
//				"schemename": $("#schemename").val(),
//				"schemecode": $("#schemecode").val()
//			});
	    }   
	});
});

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
//function getQueryString(name) {
//     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     if(r!=null)return  unescape(r[2]); return null;
//}