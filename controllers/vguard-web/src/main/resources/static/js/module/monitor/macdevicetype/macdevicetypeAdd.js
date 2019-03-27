/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * 设备维修
 */
$(function() {

	var devicetypeid = getQueryString("devicetypeid");
	$("#macdevicetypeForm").validate({
		rules : {
            devicetypename:{
				required : true
			},
            devicetypenum:{
				required : true
			}
		},
		messages : {
            devicetypename:{
				required : "设备类型名称不能为空"
			},
            devicetypenum:{
				required : "设备类型编码不能空"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macdevicetype/load",
		dataType : "json",
		data : {
			"id":devicetypeid
		},
		success : function(data) {
			if (data) {
				console.log(data);
				var macdevicetypeTpt = _.template($("#macdevicetypeTpt")
						.html());
				$("#macdevicetypeForm").html(macdevicetypeTpt(data));
				
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
		url : BASE_URL + "monitor/macdevicetype/save",
		data : $("#macdevicetypeForm").serializeArray(),
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
