/*新增或编辑课程管理*/
$(function () {

	var firmid = getQueryString("firmid");
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsrescomfirm/display",
		dataType : "json",
		data :{
			firmid:firmid
		},
		success : function(data) {
			if (data) {
				var comfirmTpt = _.template($("#comfirmTpt").html());
				$("#comfirmForm").html(comfirmTpt(data));
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
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
function position(){
    var longitude = encodeURIComponent($('#longitude').text());
    var latitude= encodeURIComponent($('#latitude').text());
    var isDisplay = $("#isDisplay").val();
    
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}