/**
 * 新增编辑
 */
$(function() {
	var eventid = getQueryString("eventid");
	$("#epideviceForm").validate({
		rules : {
			optscore1: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore2: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore3: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore4: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore5: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore6: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore7: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore8: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore9: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore10: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore11: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore12: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore13: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore14: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore15: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore16: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore17: {
				eRessureCheck: true,
				min: 0,
				max: 100
			},
			optscore18: {
				eRessureCheck: true,
				min: 0,
				max: 100
			}
		},
		messages : {
			optscore1: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore2: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore3: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore4: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore5: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore6: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore7: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore8: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore9: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore10: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore11: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore12: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore13: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore14: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore15: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore16: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore17: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			},
			optscore18: {
				eRessureCheck: "请输入正整数，最多三位",
				min: "请输入0-100的正整数",
				max: "请输入0-100的正整数"
			}
		},
		submitHandler:function(form){
			var optscore1 = $("#optscore1").val();
			var optscore2 = $("#optscore2").val();
			var optscore3 = $("#optscore3").val();
			var optscore4 = $("#optscore4").val();
			var optscore5 = $("#optscore5").val();
			var optscore6 = $("#optscore6").val();
			var optscore7 = $("#optscore7").val();
			var optscore8 = $("#optscore8").val();
			var optscore9 = $("#optscore9").val();
			var optscore10 = $("#optscore10").val();
			var optscore11 = $("#optscore11").val();
			var optscore12 = $("#optscore12").val();
			var optscore13 = $("#optscore13").val();
			var optscore14 = $("#optscore14").val();
			var optscore15 = $("#optscore15").val();
			var optscore16 = $("#optscore16").val();
			var optscore17 = $("#optscore17").val();
			var optscore18 = $("#optscore18").val();
			console.log(optscore1);
			if($.trim(optscore1) == "" & $.trim(optscore2) == "" & $.trim(optscore3) == "" & $.trim(optscore4) == "" & $.trim(optscore5) == "" 
				& $.trim(optscore6) == "" & $.trim(optscore7) == "" & $.trim(optscore8) == "" & $.trim(optscore9) == "" & $.trim(optscore10) == ""
				& $.trim(optscore11) == "" & $.trim(optscore12) == "" & $.trim(optscore13) == "" & $.trim(optscore14) == "" & $.trim(optscore15) == ""
				& $.trim(optscore16) == "" & $.trim(optscore17) == "" & $.trim(optscore18) == ""){
				parent.toast("至少为一项指标评分");//弹出提示信息
				return;
			} else {				
				save();
			}
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucestimaterecord/load",
		dataType : "json",
		data : {
			recordid:"-1",
			eventid:eventid
		},
		success : function(data) {
			if (data) {
				var epideviceTpt = _.template($("#epideviceTpt").html());
				$("#epideviceForm").html(epideviceTpt(data));	
				$("#eventid").val(eventid);
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});

});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 保存
 * 
 * @returns
 */

function save() {
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucestimaterecord/save",
		cache : false,
		dataType : 'json',
		data : $("#epideviceForm").serializeArray(),
		global : false,
		success : function(data) {
			console.log(data);
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				window.top.layer.close(parent.getParentIndex());
				parent.closeWin();
//				setTimeout(function(){
//					parent.parent.closeAllWin();
//			    },1000);
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});

}
