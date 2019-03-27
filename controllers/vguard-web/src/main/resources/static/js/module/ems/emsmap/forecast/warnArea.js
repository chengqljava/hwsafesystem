$(function () {
	var forecastid = GetQueryString("forecastid");
	
	if (forecastid != '0' && typeof(forecastid) !='undefined' && forecastid != null && forecastid != 'null') {
		$.ajax({
			type : "post",
			url : BASE_URL + "ems/emssucigrforecast/otherInfo",
			data : {
				"forecastid":forecastid,
				"urlType":"jjq"
			},
			dataType: "json",
			success : function(data) {
				if (data.alertzone) {
					$("#areaDiv").html("在事发影响范围内设立("+data.alertzone.zonename+")警戒区，警戒区影响面积为("+data.alertzone.acreage+")平方千米。");
				}else{
					$("#areaDiv").html("在事发影响范围内没有设立警戒区。");
				}
			}
		});
	}
	///获取警戒区域名称
	var areaname = parent.areaname;
	//获取面积
	var countArea = parent.countArea;
	if (typeof(areaname)=='undefined' && typeof(countArea) =='undefined' ) {
		return false;
	}else{
		$("#areaDiv").html("在事发影响范围内设立("+areaname+")警戒区，警戒区影响面积为"+countArea+"平方千米。");
	}
});
	
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

