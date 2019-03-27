/**
 * 新增编辑
 */
$(function() {
	var entruleid = getQueryString("entruleid");
	var ruletype = getQueryString("ruletype");
	$("#entruleForm").validate({
		rules : {
			drinkname:{
				required : true
			},
			rulecode:{
				required : true
			},
			ruleisscy:{
				required : true
			}
		},
		messages : {
			drinkname:{
				required : "标题不能为空"
			},
			rulecode:{
				required : "文号不能为空"
			},
			ruleisscy:{
				required : "颁布部门不能为空"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "knowledge/knoentrule/load",
		dataType : "json",
		data : {
			"entruleid":entruleid
		},
		success : function(data) {
			if (data) {
				var knoAttachList = data.knoAttachList;
				var knoAttach;
				if(knoAttachList.length>0){
					knoAttach = knoAttachList[0];
				}
				var downloadurl = BASE_URL + 'knowledge/knolaw/download/'+knoAttach.attachid;
				data.knoAttach = knoAttach;
				data.downloadurl = downloadurl;
				var entruleTpt = _.template($("#entruleTpt").html());
				$("#entruleForm").html(entruleTpt(data));
		        showUploadFile("attachment","file",true,true);
		        if(ruletype != null && ruletype != ''){
		        	$("#ruletype").val(ruletype);
		        }
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
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}
	$.ajaxFileUpload({
		type : "post",
		url : BASE_URL + "knowledge/knoentrule/save",
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#entruleForm").serializeArray(),
		global : false,
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}