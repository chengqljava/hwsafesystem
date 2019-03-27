/**
 *
 */
$(function() {
	var eid = getQueryString("eid");
	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicenvironmental/display",
		dataType : "json",
		data : {
			"eid":eid
		},
		success : function(data) {
			if (data) {
				console.log(data);
				var drinkingwaterTpt = _.template($("#drinkingwaterTpt")
						.html());
				$("#drinkingwaterForm").html(drinkingwaterTpt(data));
                var attachment = data.attachmentList;//附件
                showChooseFiles('attachment', attachment, BASE_URL + 'publics/publicattachment/download/', false);
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});

});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 定位
 */
function position(){
    var longitude;
    var latitude;
    var isDisplay = $("#isDisplay").val();
    
    //当编辑地图点位时
    if ("0" == isDisplay) {
    	longitude = encodeURIComponent($('#longitude').val());
    	latitude= encodeURIComponent($('#latitude').val());
    	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
    		$('#longitude').val(param.lng);
    		$('#latitude').val(param.lat);
    	});
    } else {
    	longitude = encodeURIComponent($('#longitude').text());
    	latitude= encodeURIComponent($('#latitude').text());
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}