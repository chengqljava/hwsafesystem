/**
 * 新增编辑
 */
$(function() {
	var deviceid = getQueryString("deviceid");
	var isDisplay = getQueryString("isDisplay");
	$("#epideviceForm").validate({
		rules : {
			snccode:{
				required : true
			},
//			sitename:{
//				required : true
//			},
			monitorcode : {
				required : true
			},
			mphone : {
				required : true,
				isPhone: true
			},
			gap: {
				lRessureCheck: true
			}
		},
		messages : {
			snccode:{
				required : "设备编号不能为空"
			},
//			sitename:{
//				required : "站点名称不能空"
//			},
			monitorcode : {
				required : "监测设备类型代码不能为空"
			},
			mphone : {
				required : "手机号不能为空",
				isPhone: "请输入正确的手机号格式"
			},
			gap: {
				lRessureCheck: "只能输入四位整数"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "epi/epidevice/load",
		dataType : "json",
		data : {
			"deviceid":deviceid
		},
		success : function(data) {
			if (data) {
				var epideviceTpt = _.template($("#epideviceTpt").html());
				$("#epideviceForm").html(epideviceTpt(data));
				if(isDisplay == 'isDisplay'){
				} else {
					SelectOption.loadDeviceStatus("status");
					SelectOption.loadArithmetic("arithmetictype");
					SelectOption.loadTransMode("trans_mode");					
				}
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

//选择环保站点
function loadStation(){
	parent.openWin(BASE_URL
			+ "views/module/epi/epidevice/epistationList.html",
			'环保站点列表', '60%', '65%');
	
	window.top.GEventObject.die('LOAD_MAC_INFO');
	window.top.GEventObject.on('LOAD_MAC_INFO', function(rowdata) {
		$('#stationid').val(rowdata[0].stationid);
		$('#sitename').val(rowdata[0].sitename);
		$('#sitename').blur();
	});
}

/**
 * 保存
 * 
 * @returns
 */

function save() {
	$.ajax({
		type : "post",
		url : BASE_URL + "epi/epidevice/save",
		cache : false,
		dataType : 'json',
		data : $("#epideviceForm").serializeArray(),
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
