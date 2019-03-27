/**
 * 新增编辑
 */
$(function() {
	var stationid = getQueryString("stationid");
	$("#epistationForm").validate({
		rules : {
			sitecode:{
				required : true
			},
			sitename:{
				required : true
			},
			pollutionfactor:{
				required: true
			},
			contacttel : {
				isPhone: true
			},
			sitenum: {
				digits: true
			},
			longitude: {
	            validateitude: true/*,
	            range: [107.16, 111.53]*/
	        },
	        latitude: {
	            validateitude: true/*,
	            range: [37.64, 41.67]*/
	        }
		},
		messages : {
			sitecode:{
				required : "站点代码不能为空"
			},
			sitename:{
				required : "站点名称不能空"
			},
			pollutionfactor:{
				required: "站点因子不能为空"
			},
			contacttel : {
				isPhone: "请输入正确的手机号码格式"
			},
			sitenum: {
				digits: "请输入正整数"
			},
	        longitude: {
                validateitude: "请输入小数且小数位最多4位"/*,
                range: "经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/
            },
            latitude: {
                validateitude: "请输入小数且小数位最多4位"/*,
                range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/
            },
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "epi/epistation/load",
		dataType : "json",
		data : {
			"stationid":stationid
		},
		success : function(data) {
			if (data) {
				var epistationTpt = _.template($("#epistationTpt").html());
				$("#epistationForm").html(epistationTpt(data));
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
 * 保存
 * 
 * @returns
 */

function save() {

	$.ajax({
		type : "post",
		url : BASE_URL + "epi/epistation/save",
		cache : false,
		dataType : 'json',
		data : $("#epistationForm").serializeArray(),
		global : false,
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});

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
    } else if("1" == isDisplay){
    	longitude = encodeURIComponent($('#longitude').text());
        latitude= encodeURIComponent($('#latitude').text());
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}
