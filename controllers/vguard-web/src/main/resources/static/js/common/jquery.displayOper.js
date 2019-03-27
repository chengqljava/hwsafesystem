/**
 * displayOper权限显示操作按钮插件 
 * Created by 刘晓斌 on 2017/7/6
 * privcode 为 权限编码
 */
;(function($, _) {
	$.fn.displayOper = function(privcode) {
		var curLoc = window.location.search,
			curUrlPara = getUrlParamVal("privcode"),
			$curSelDIV = $(this);
		if ("undefined" != typeof(privcode) && undefined != privcode &&
		    "" != privcode && null != privcode) {
			curUrlPara = privcode;
		}
		
		//访问服务端抓取按钮权限
		$.ajax({
			type : "post",
			url : BASE_URL + "displayoper/getopersession",
			data : {},
			async: false,
			success : function(menus) {
				if (menus && "null" != menus && 0 < menus.length) {
					_.map(menus, function(menu) {
						if (menu.privcode == curUrlPara) {
							var tmpBtnDom = "";
							_.map(menu.sysOpers,
									function(sysOper) {
										if (sysOper.operid
												&& "null" != sysOper.operid) {
											tmpBtnDom += "<button class='"
													+ sysOper.operstyle + "'"
													+ " id='"
													+ sysOper.opercode + "'>"
													+ sysOper.opername
													+ "</button>";
										}
									});
							$curSelDIV.empty().html(tmpBtnDom);
						}
					});
				}
			}
		});
	}
	
	/**
	 * 获取url后面的参数值
	 */
	function getUrlParamVal(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
	         r = window.location.search.substr(1).match(reg);
	     if (null != r) return unescape(r[2]); 
	     return null;
	}
})($, _);