$(document).ready(function() {
	var annualid = GetQueryString("annualid");
	var display = GetQueryString("dispaly");
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/annual/load/" + annualid,
		data : {},
		success : function(data) {
			if (data) {
				var macAnnualTpt = _.template($("#macAnnualTpt").html());
				data.baseUrl = BASE_URL;
				$("#macAnnualForm").html(macAnnualTpt(data));
				if (display != "display") {
					SelectOption.loadEquipmenttype("equipmenttype");
					SelectOption.loadRecheckState("annualres");
				}
				//加载企业
//				SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
				$("#macAnnualForm").validate({
					rules: {
						equipmenttype: {
							required: true
						},
						eqname: {
							required: true
						},
						annualper: {
							required: true
						},
						annualtel: {
							required: true,
							isPhone: true
						},
						annualtime: {
							required: true
						},
						annualres: {
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
						annualper: {
							required: "年检人员不能为空"
						},
						annualtel: {
							required: "年检人员电话不能为空",
							isPhone: "请输入正确的手机号码格式"
						},
						annualtime: {
							required: "年检时间不能为空"
						},
						annualres: {
							required: "年检结果不能为空"
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
		url : BASE_URL+'/monitor/annual/save',
		cache : false,
		dataType : 'json',
		data : $("#macAnnualForm").serializeArray(),
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
/**
 * 选择企业
 * @param $ajax
 * @param url 完整的地址
 */
function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    
    return markup;
}

function formatRepoSelection(repo){
	$("#businessinfoid").val(repo.id);
	$("#belongentselect2").val(repo.id);
	 return repo.text;
}
