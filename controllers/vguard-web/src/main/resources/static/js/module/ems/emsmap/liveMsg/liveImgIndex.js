$(function () {
	//获取事故信息id
	var imgUrl = getQueryString("imgurl");
	$("#liveImg").attr("src", imgUrl);
});

/**
 * 获取父级页面传递过来的参数
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}