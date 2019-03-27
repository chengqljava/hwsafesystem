/**
 * 其它不良信息记录 
 */
$(function () {
	var otherid = GetQueryString("otherid");
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadother/display/"+otherid,
		dataType: "json",
		success : function(data) {
			if (data) {
				var badOtherTpt = _.template($("#badOtherTpt").html());
				$("#badOtherForm").html(badOtherTpt(data));
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
