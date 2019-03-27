/*
 * 课程附件
 */

$(function () {
	var courseinfoid = GetQueryString("courseinfoid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "train/etsciscourseinfo/displaylist/"+courseinfoid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var courseInfoTpt = _.template($("#courseInfoTpt").html());
				$("#courseInfoForm").html(courseInfoTpt(data));				                

                var etsAttachFiles = data.etsAttachFiles;//资料附件
            
                initAttachTable('attachtable', etsAttachFiles);
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
});

/**
 * 初始化附件列表
 * @param code
 * @param etsTrnUsers
 */
function initAttachTable(code, etsAttachFiles) {

    if (etsAttachFiles.length != 0) {
        $.each(etsAttachFiles, function (i, etsAttach) {
        	var attachid = etsAttach.attachid ||'';
            var attachname = etsAttach.attachname || '';
            var attachurl = etsAttach.attachurl || '';
            var filetype = etsAttach.filetype || '';
            $('#' + code).append(' <tr id="attach' + i + '">' +
                '<td style="height:40px;max-width: 200px !important;">' +
                '<input type="text" class="form-control" id="attachname' + i + '" name="attachname" readonly value="' + attachname + '"/>' +
                '</td>' +
                '<td>' +
                '<input style="margin-left:10px;" type="button" class="backBtn" width="100px" id="learnbtn' + i + '" name="learnbtn" value="学习" onclick="attach(\'' + attachid + '\',\''+attachname + '\')">' +
                '</td>' +
                '</tr>'
            );
        });
    }
}

function attach(id,name){
	var arr = name.split(".");
	if(arr[1] == "mp4" || arr[1] == "ogg" || arr[1] == "webm"){		
		parent.openWin(BASE_URL + "views/module/train/etsciscourseinfo/attachDisplay.html?attachid="+id,
				name, "60%", "80%");
	} else {
//		downloadFile(BASE_URL+ 'train/etsattach/download/'+id);
		$.ajax({
			type : "post",
			url : BASE_URL + "train/etscislearn/save",
			data : {
				attachid : id,
				time : 1
			},
			success : function(data) {
				if (data.success == true) {
					window.location.href = BASE_URL+ 'train/etsattach/download/'+ id;//不打开视频窗口则下载此文件
					parent.toast(data.msg);// 弹出提示信息
					parent.getActiveIFrame().reloadGrid();// 重新加载
//					parent.closeWin();// 关闭弹出框
				} else {
					parent.toast(data.msg);
				}
			},
			error : function() {
				parent.toast("编辑失败");
			}
		});
	}
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
