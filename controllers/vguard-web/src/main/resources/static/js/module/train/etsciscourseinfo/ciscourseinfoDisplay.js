/**
 * 详情
 */
$(function () {
	var courseinfoid = getQueryString("courseinfoid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "train/etsciscourseinfo/display/"+courseinfoid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var courseInfoTpt = _.template($("#courseInfoTpt").html());
				$("#courseInfoForm").html(courseInfoTpt(data));					
				
                $('#trainpic').empty();
                $('#trainpic').hide();
                $('#picWarning').hide();
                $('#trainvideo').empty();
                $('#trainvideo').hide();
                $('#trainfile').empty();
                $('#trainfile').hide();
                $('#becomeBig').viewer({
                    'toolbar': false,
                    'title': false
                });
                var etsAttachFiles = data.etsAttachFiles;//资料附件

                showChooseFiles('trainfile', etsAttachFiles, BASE_URL + 'train/etsattach/download/', false);
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
	
});
function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
