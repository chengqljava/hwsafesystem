/**
 * 数据转换通用类
 */
var dataUtils={};

//获得行政区划数据
dataUtils.getRegionData=function(){
	var region;
	$.ajax({
    	url : "../../js/module/olgis/configs/310100.json",
    	type : "GET",
    	dataType : "json",
    	async : false,
    	success : function(data) {
    		region = data;
    	},
    	error : function() {
    		console.log("读取配置文件失败！");
    	}
	});
	return region;
}

