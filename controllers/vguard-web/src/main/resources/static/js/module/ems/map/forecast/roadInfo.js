$(function () {
	var forecastid = GetQueryString("forecastid");
	var roadArray = window.parent.array;
	if (forecastid != '' && typeof(forecastid) !='undefined' && forecastid != null && forecastid != 'null') {
		$.ajax({
			type : "post",
			url : BASE_URL + "ems/emssucigrforecast/otherInfo",
			data : {
				"forecastid":forecastid,
				"urlType":"dlfs"
			},
			dataType: "json",
			success : function(data) {
				$.each(data.roadblockList,function(index,obj){
					$("#roadTab").append("<tr><td >"+obj.roadname+"</td><td>"+obj.roadlon+"</td><td>"+obj.roadlat+"</td></tr>")
				});
			}
		});
	}else{
		$.each(roadArray,function(index,obj){
			$("#roadTab").append("<tr><td >"+obj.name+"</td><td>"+obj.lng+"</td><td>"+obj.lat+"</td></tr>")
		})
	}
});

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

