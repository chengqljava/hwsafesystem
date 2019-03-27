
//查找区域内企业
function bussInArea(areaName){
	var data;
	var name = areaName || "青浦区";
	var name = {"name":name};
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gispage/bussInArea',
		cache : false,
		dataType : 'json',
		data : name,
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//alert(areaName+"范围内没有企业！");
			}else{
				/*alert(areaName+"范围内的企业："+map+","+map[0].entname+","+map[0].entcode+","+map[0].districtcode+","+map[0].address
						+","+map[0].legalperson+","+map[0].phone+","+map[0].notes
						+","+map[0].category+","+map[0].longitude+","+map[0].latitude+",共有："+map.length+"个");*/
				data = map;
			}
		},
		error : function() {
			parent.toast("服务出错，请与管理员联系！");
		}
	});
	return data;
}


//根据点坐标查询该点所在区域
function areaByPoint(centerPoint){
	var data;
	var x = centerPoint[0] || 121.39;
	var y = centerPoint[1] || 31.1;
	var point = {"x":x,
			     "y":y
			    };
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gispage/areaByPoint',
		cache : false,
		dataType : 'json',
		data : point,
		global : false,
		async : false,
		success : function(map) {
			if(!($.isEmptyObject(map))){
				data = map;
			}
		},
		error : function(e) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}