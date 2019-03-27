
/*保存地理位置信息(新增)*/
function save(longitude,latitude,addrid){
	
	var x = longitude || 121.2655 ;
	var y = latitude || 31.0487;
	var id = addrid || null;
	var address = {
			"id":id,
			"x":x,
			"y":y	
	}
	$.ajax({
		type : 'post',
		url : BASE_URL+'/olgis/gispage/save',
		cache : false,
		dataType : 'json',
		data : address,
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
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