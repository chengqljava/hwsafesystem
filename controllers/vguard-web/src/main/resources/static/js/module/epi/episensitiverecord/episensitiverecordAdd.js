/**
 * 新增编辑
 */
$(function() {
	var sensitiveid = getQueryString("sensitiveid");
	var entid = getQueryString("entid");
	var isDisplay = getQueryString("isDisplay");
	$("#epiForm").validate({
		rules : {
			type:{
				required : true
			},
			targetname:{
				required : true
			},
			position : {
				required : true
			},
			distance : {
				required : true,
				installdistance: true
			},
			population: {
				required: true,
				digits: true
			}
		},
		messages : {
			type:{
				required : "类别不能为空"
			},
			targetname:{
				required : "敏感目标名称不能空"
			},
			position : {
				required : "相对本项目方位不能为空"
			},
			distance : {
				required : "相对本项目距离不能为空",
				installdistance: "只能输入五位整数,小数后精确二位"
			},
			population: {
				required: "影响人口不能为空",
				digits: "请输入正整数"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "epi/episensitiverecord/load",
		dataType : "json",
		data : {
			sensitiveid:sensitiveid
		},
		success : function(data) {
			if (data) {
				var epiTpt = _.template($("#epiTpt").html());
				$("#epiForm").html(epiTpt(data));
				$("#entid").val(entid);
				if (isDisplay == "isDisplay") {
				} else {					
					SelectOption.loadSensitiveType("type");
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

/**
 * 保存
 * 
 * @returns
 */

function save() {
	$.ajax({
		type : "post",
		url : BASE_URL + "epi/episensitiverecord/save",
		cache : false,
		dataType : 'json',
		data : $("#epiForm").serializeArray(),
		global : false,
		success : function(data) {
			console.log(data);
			if(data.success==true){
				parent.toast(data.msg);
                //弹出提示信息
                var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safereward').val("true");
				parent.frames["layui-layer-iframe"+index].loadSafemenutree();//刷新列表
                parent.closeWin();//关闭窗口
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});

}
