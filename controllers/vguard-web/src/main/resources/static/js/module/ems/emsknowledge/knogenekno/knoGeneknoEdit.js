/**
 * 应急常识编辑
 */
$(function () {
	var geneknoid = GetQueryString("geneknoid");
	$("#knoGenekonForm").validate({
		rules: {
			geneknotitle: {
				required: true
			},
			geneknotypecode: {
				required: true
			},
			keyword:{
				required: true
			},
//			eventtypecode:{
//				required: true
//			},
			summary:{
				required: true
			}
		},
		messages: {
			geneknotitle: {
				required: "知识标题不能为空"
			},
			geneknotypecode: {
				required: "知识类型不能为空"
			},
			keyword:{
				required: "关键词不能为空" 
			},
//			eventtypecode:{
//				required: "事件类型不能为空"
//			},
			summary:{
				required: "知识摘要不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsknogenekno/edit/"+geneknoid,
		dataType: "json",
		data:{
			geneknoid:geneknoid
		},
		success : function(data) {
			if (data) {
				var knoGeneknoTpt = _.template($("#knoGeneknoTpt").html());
				data.baseUrl = BASE_URL;
				$("#knoGenekonForm").html(knoGeneknoTpt(data));
				SelectOption.loadKnoType("geneknotypecode");
				// 事件类型
//				SelectTree.loadEventTypeSelect("eventtypecode", "","请选择");
				//附件显示
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
		url : BASE_URL + "ems/emsknogenekno/save",
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#knoGenekonForm").serializeArray(),
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

