/**
 * 详情
 */
$(function () {
	var placeid = getQueryString("placeid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucplace/display/"+placeid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var placeTpt = _.template($("#placeTpt").html());
				$("#placeForm").html(placeTpt(data));					

				SelectOption.loadPlaceType("typeid");//场所类型下拉选

			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
	
});
function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 定位
 */
//function position(){
//    var longitude = encodeURIComponent($('#longitude').val());
//    var latitude= encodeURIComponent($('#latitude').val());
//    var areaName = encodeURIComponent($('#area').val());
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
//}

/**
 * 定位
 */
function position() {
	 var longitude = encodeURIComponent($('#longitude').val());
	 var latitude= encodeURIComponent($('#latitude').val());
	 var areaName = encodeURIComponent($('#area').val());
	 var isDisplay = $("#isDisplay").val();
	 
     //当编辑地图点位时
     if ("0" == isDisplay) {
    	 window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    	 window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
    		 $('#longitude').val(param.lng);
    		 $('#latitude').val(param.lat);
    	 });
     }
     parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
}