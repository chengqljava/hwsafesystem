/*新增或编辑课程管理*/
$(function () {		
	
	var courseinfoid = getQueryString("courseinfoid");
	$("#courseInfoForm").validate({
		rules: {
			coursename: {
				required: true,
				maxlength: 25
			},
			coursetype: {
				required: true,
			},
			coursecontent: {
				maxlength: 127
			},
			period: {
				required: true,
				digits: true
			},
			note: {
				maxlength: 100
			}
		},
		messages: {
			coursename: {
				required: "课程名称不能为空",
				maxlength: "最多输入25字"
			},
			coursetype: {
				required: "课程类型不能为空",
			},
			coursecontent: {
				maxlength: "最多输入127字"
			},
			period: {
				required: "课程学时不能为空",
				digits: "只能输入正整数"
			},
			note: {
				maxlength: "最多输入100字"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "train/etsciscourseinfo/load",
		dataType : "json",
		data :{
			courseinfoid:courseinfoid
		},
		success : function(data) {
			if (data) {
				var courseInfoTpt = _.template($("#courseInfoTpt").html());
				$("#courseInfoForm").html(courseInfoTpt(data));				
							
				SelectOption.loadCourseType("coursetype");//课程类型下拉选	

				var etsAttachPics = data.etsAttachPics;//图片附件
                var etsAttachVideos = data.etsAttachVideos;//视频附件
                var etsAttachFiles = data.etsAttachFiles;//资料附件
                var downloadurl = BASE_URL + 'train/etsattach/download/';
                showMultipleInputFile("picDiv", "trainpic", "image", etsAttachPics, downloadurl, true);
                showMultipleInputFile("videoDiv", "trainvideo", "file", etsAttachVideos, downloadurl, true);
                showMultipleInputFile("fileDiv", "trainfile", "file", etsAttachFiles, downloadurl, true);
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

/*保存(新增或编辑)*/
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
		url : BASE_URL + 'train/etsciscourseinfo/save',
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#courseInfoForm").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("新增失败");
		}
	});
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}