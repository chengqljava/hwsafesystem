$(document).ready(function() {
	var plancontentid = GetQueryString("plancontentid");

	$("#plancontentForm").validate({
		rules: {
			planname: {
				required: true
			},
			exeleader: {
				required: true
			},
			tel: {
				required: true,
				isPhone:true
			},
			begintime: {
				required: true
			},
			endtime: {
				required: true
			},
			plancontent: {
				required: true
			},
			content: {
				required: true
			}
		},
		messages: {
			planname: {
				required: "请选择关联计划"
			},
			exeleader: {
				required: "请输入执行负责人"
			},
			tel: {
				required: "请输入负责人电话",
				isPhone:"请输入正确手机号码"
			},
			begintime: {
				required: "请选择计划开始时间"
			},
			endtime: {
				required: "请选择计划结束时间"
			},
			plancontent: {
				required: "请输入主要工作内容"
			},
			content: {
				required: "请输入具体内容"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "political/iesworkplancontent/display/" + plancontentid,
		data : {},
		success : function(data) {
			if (data) {
				data.baseUrl  = BASE_URL;
				var plancontentTpt = _.template($("#plancontentTpt").html());
				$("#plancontentForm").html(plancontentTpt(data));	
				SelectTwo.initSelect2($('#planname'), BASE_URL + "political/iesworkplan/loadSimpleData", '请选择计划', formatRepo, formatRepoSelection);	
				if (GetQueryString("display") == "display") {
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
		url : BASE_URL+'/political/iesworkplancontent/save',
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#plancontentForm").serializeArray(),
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

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#workplanid").val(repo.id);
    return repo.text;
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
