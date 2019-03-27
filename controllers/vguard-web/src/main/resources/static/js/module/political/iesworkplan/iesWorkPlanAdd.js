$(document).ready(function() {
	var workplanid = GetQueryString("workplanid");
	$("#workplanForm").validate({
		rules: {
			planname: {
				required: true
			},
			enactdepart: {
				required: true
			},
			planleader: {
				required: true
			},
			tel: {
				required: true,
				isPhone:true
			},
			enacttime: {
				required: true,
			},
			plancontent: {
				required: true,
			}
		},
		messages: {
			planname: {
				required: "请输入任务标题"
			},
			enactdepart: {
				required: "请输入制定部门"
			},
			planleader: {
				required: "请输入计划负责人"
			},
			tel: {
				required: "请输入负责人电话",
				isPhone:"请输入正确手机号码"
			},
			enacttime: {
				required: "请选择计划制定年份"
			},
			plancontent: {
				required: "请输入主要内容"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "political/iesworkplan/display/" + workplanid,
		data : {},
		success : function(data) {
			if (data) {
				data.baseUrl  = BASE_URL;
				var workplanTpt = _.template($("#workplanTpt").html());
				$("#workplanForm").html(workplanTpt(data));
				if (GetQueryString("display")) {
					showUploadFile("fileUploadDiv", 'file', false, false);// 显示文件上传控件
				}else{
					showUploadFile("fileUploadDiv", 'file', true, true);// 显示文件上传控件
				}
			}
		},
		error: function () {
            parent.toast("初始化信息加载失败!");
        }
	});
});

/**保存*/
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
		url : BASE_URL+'/political/iesworkplan/save',
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#workplanForm").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

function downloadAttach(attachid){
	
	
}
