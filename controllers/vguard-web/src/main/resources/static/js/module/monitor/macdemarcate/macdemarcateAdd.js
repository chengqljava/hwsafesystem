/**
 * 设备维修
 */
$(function() {

	var demarcateid = getQueryString("demarcateid");
	$("#macdemarcateForm").validate({
		rules : {
			equipmenttype:{
				required : true
			},
			eqname:{
				required : true
			},
			demarcateper : {
				required : true
			},
			demarcatetime : {
				required : true
			},
			demarcatetel: {
				required: true,
				isPhone: true
			},
			demarcateman : {
				required : true
			}
		},
		messages : {
			equipmenttype:{
				required : "设备类型不能为空"
			},
			eqname:{
				required : "设备名称不能空"
			},
			demarcateper : {
				required : "标定人员不能为空"	
			},
			demarcatetime : {
				required : "标定日期不能为空"
			},
			demarcatetel: {
				required: "标定人员电话不能为空",
				isPhone: "请输入正确的手机号码格式"
			},
			demarcateman : {
				required : "标定厂家不能为空"	
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macdemarcate/load",
		dataType : "json",
		data : {
			"demarcateid":demarcateid
		},
		success : function(data) {
			if (data) {
				console.log(data);
				var macdemarcateTpt = _.template($("#macdemarcateTpt")
						.html());
				$("#macdemarcateForm").html(macdemarcateTpt(data));
				
				SelectOption.loadEquipmenttype("equipmenttype");
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
 * 设备信息
 */
function loadEquiment(){
	/**
	 * 加载设备
	 */
	var type = $("#equipmenttype").val();
	var onurl;
	if (type == '0') {
		onurl = BASE_URL+'/monitor/macvideo/voideInfo','摄像头信息','80%','70%';
	}else if (type == '1') {
		onurl = BASE_URL+'/monitor/macprobe/probeInfo','监测探头信息','65%','70%';
	}else{
		parent.toast("请选择设备类型！");
		return false;
	}
	window.top.GEventObject.die('LOAD_MAC_INFO');
	window.top.GEventObject.on('LOAD_MAC_INFO', function(rowdata) {
		console.log(rowdata.EQNUM);
		$('#equipmentid').val(rowdata.EQID);
		$('#entid').val(rowdata.ENTID);
		$('#eqnum').val(rowdata.EQNUM);
		$('#entname').val(rowdata.ENTNAME);
		$('#eqname').val(rowdata.EQNAME);
		$('#eqname').blur();
	});
	window.top.openWin(onurl);
}

/**
 * 保存
 * 
 * @returns
 */

function save() {
	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macdemarcate/save",
		data : $("#macdemarcateForm").serializeArray(),
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
