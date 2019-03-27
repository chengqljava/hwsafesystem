/**
 * 新增编辑
 */
$(function() {
	var eid = getQueryString("eid");
	$("#environmentalForm").validate({
		rules : {
			devicename:{
				required : true
			},
			range:{
				required : true
			},
			precision : {
				required : true
			},
			manufacturer : {
				required : true
			}
		},
		messages : {
			devicename:{
				required : "设备名称不能为空"
			},
			range:{
				required : "检测范围不能空"
			},
			precision : {
				required : "精度不能为空"
			},
			manufacturer : {
				required : "制造厂家不能为空"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicenvironmental/load",
		dataType : "json",
		data : {
			"eid":eid
		},
		success : function(data) {
			if (data) {
				var environmentalTpt = _.template($("#environmentalTpt").html());
				$("#environmentalForm").html(environmentalTpt(data));
				var attachmentList = data.attachmentList;
				var downloadurl = BASE_URL + 'publics/publicattachment/download/';
		        showMultipleInputFile("attachment","waterattach","file",attachmentList, downloadurl, true);
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
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}
	$.ajaxFileUpload({
		type : "post",
		url : BASE_URL + "publics/publicenvironmental/save",
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#environmentalForm").serializeArray(),
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
    } else {
    	longitude = encodeURIComponent($('#longitude').text());
    	latitude= encodeURIComponent($('#latitude').text());
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}