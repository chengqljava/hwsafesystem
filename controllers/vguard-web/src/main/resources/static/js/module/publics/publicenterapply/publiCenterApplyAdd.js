$(document).ready(function() {
	var enterid = GetQueryString("enterid");
	$("#enterForm").validate({
		rules: {
			applyuser: {
				required: true
			},
			sex: {
				required: true
			},
			applydate: {
				required: true
			},
			idcard: {
				required: true,
			},
			telphone: {
				required: true,
				isPhone:true
			},
			unitname: {
				required: true,
			},
			reason: {
				required: true,
			}
		},
		messages: {
			applyuser: {
				required: "请输入申请人"
			},
			sex: {
				required: "请选择性别"
			},
			applydate: {
				required: "请选择申请日期"
			},
			idcard: {
				required: "请输入身份证"
			},
			telphone: {
				required: "请输入手机号码",
				isPhone:"请输入正确手机号码"
			},
			unitname: {
				required: "请输入单位名称"
			},
			reason: {
				required: "请输入申请原因"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicenterapply/display/" + enterid,
		data : {},
		success : function(data) {
			if (data) {
				data.baseUrl  = BASE_URL;
				var enterTpt = _.template($("#enterTpt").html());
				$("#enterForm").html(enterTpt(data));
				
				if (data.applydate == "" ||  data.applydate == null) {
					$("#applydate").val(getNowFormatDate());
				}
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
		url : BASE_URL+'/publics/publicenterapply/save',
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#enterForm").serializeArray(),
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
