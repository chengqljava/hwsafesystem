$(function() {
	//为事故中心点经纬度赋值
	$("#evnLng").val(getQueryString("evnLng"));
	$("#evnLat").val(getQueryString("evnLat"));
	
	//保存校验
	$("#drawFilterForm").validate({
		rules: {
			drawRadius: {
				required: true,
				isNumber: true
			}
		},
		messages: {
			drawRadius: {
				required: "绘制半径不能为空！",
				isNumber: "请输入正确格式的半径值！"
			}
		},
		submitHandler: function(form) {
			//地图加载筛选圆形图
			parent.initDrawFilterCircle("0", $("#drawRadius").val());
	    }   
	});
});

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}