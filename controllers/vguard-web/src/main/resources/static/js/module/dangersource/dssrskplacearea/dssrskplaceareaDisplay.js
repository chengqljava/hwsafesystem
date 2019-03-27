/*新增或编辑场所环境*/
$(function () {		
	
	var placeareaid = getQueryString("placeareaid");

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskplacearea/load",
		dataType : "json",
		data :{
			placeareaid:placeareaid
		},
		success : function(data) {
			if (data) {
				var dssRskPlaceareaTpt = _.template($("#dssRskPlaceareaTpt").html());
				$("#dssRskPlaceareaForm").html(dssRskPlaceareaTpt(data));
				showUploadFile("fileUploadDiv", 'image', true, false);// 显示文件上传控件
				$('#becomeBig').viewer({
                    'toolbar': false,
                    'title': false
                });
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
