/**
 * 政策文件编辑
 */
$(function () {
	var policypaperid = GetQueryString("policypaperid");
	$("#knoGenekonForm").validate({
		rules: {
			policypapername: {
				required: true
			},
			docnum: {
				required: true
			},
			keyword:{
				required: true
			},
			classcode:{
				required: true
			},
			summary:{
				required: true
			},
			pubdate:{
				required:true
			},
			effdate:{
				required:true
			}
		},
		messages: {
			policypapername: {
				required: "政策名称不能为空"
			},
			docnum: {
				required: "文号不能为空"
			},
			keyword:{
				required: "关键词不能为空" 
			},
			classcode:{
				required: "密级不能为空"
			},
			summary:{
				required: "知识摘要不能为空"
			},
			pubdate:{
				required:"发布时间不能为空"
			},
			effdate:{
				required:"生效时间不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsknopolicypaper/edit/"+policypaperid,
		dataType: "json",
		data:{
			policypaperid:policypaperid
		},
		success : function(data) {
			if (data) {
				var knoGeneknoTpt = _.template($("#knoGeneknoTpt").html());
				data.baseUrl = BASE_URL;
				$("#knoGenekonForm").html(knoGeneknoTpt(data));
				// 密级
				SelectOption.loadSecretLevel("classcode");
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
		url : BASE_URL + "ems/emsknopolicypaper/save",
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

