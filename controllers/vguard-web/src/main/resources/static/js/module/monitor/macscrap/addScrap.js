$(document).ready(function() {
	var scraplid = GetQueryString("scraplid");
	var display = GetQueryString("dispaly");
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/scrap/load/" + scraplid,
		data : {},
		success : function(data) {
			if (data) {
				var macScrapTpt = _.template($("#macScrapTpt").html());
				data.baseUrl = BASE_URL;
				$("#macScrapForm").html(macScrapTpt(data));
				if (display != "display") {
					SelectOption.loadEquipmenttype("equipmenttype");
				}
				$("#macScrapForm").validate({
					rules: {
						equipmenttype: {
							required: true
						},
						eqname: {
							required: true
						},
						scrapper: {
							required: true
						},
						scraptel: {
							required: true,
							isPhone: true
						},
						scraptime: {
							required: true
						}
					},
					messages: {
						equipmenttype: {
							required: "设备类型不能为空"
						},
						eqname: {
							required: "设备名称不能为空"
						},
						scrapper: {
							required: "报废人员不能为空"
						},
						scraptel: {
							required: "联系电话不能为空",
							isPhone: "请输入正确的手机号码格式"
						},
						scraptime: {
							required: "报废时间不能为空"
						}
					},
					submitHandler:function(form){
					   	save();
				    }   
				});
			}
		}
	});
});



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
		console.log(rowdata);
		$('#equipmentid').val(rowdata.EQID);
		$('#eqname').val(rowdata.EQNAME);
		$('#eqname').blur();
	});
	window.top.openWin(onurl);
}



/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/scrap/save',
		cache : false,
		dataType : 'json',
		data : $("#macScrapForm").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
