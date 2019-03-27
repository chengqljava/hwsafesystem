/**
 * 新增编辑
 */
$(function() {
	var licenceid = getQueryString("licenceid");
	var entid = getQueryString("entid");
	var isDisplay = getQueryString("isDisplay");
	$("#epiForm").validate({
		rules : {
			licencenum:{
				required : true
			},
			licencetype:{
				required : true
			},
			outputname : {
				required : true
			},
			outputwhithername : {
				required : true
			},
			outputrulename: {
				required: true
			},
			outputsite: {
				required: true
			}
		},
		messages : {
			licencenum:{
				required : "许可证编号不能为空"
			},
			licencetype:{
				required : "许可证类型不能为空"
			},
			outputname : {
				required : "排污口名称不能为空"
			},
			outputwhithername : {
				required : "排放去向不能为空"
			},
			outputrulename: {
				required: "排放方式不能为空"
			},
			outputsite: {
				required: "排污口位置不能为空"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "epi/episewagelicence/load",
		dataType : "json",
		data : {
			licenceid:licenceid
		},
		success : function(data) {
			if (data) {
				var epiTpt = _.template($("#epiTpt").html());
				$("#epiForm").html(epiTpt(data));
				$("#entid").val(entid);
				if (isDisplay == "isDisplay") {
					$("#becomeBig1").viewer({
	                	'toolbar': false,
	                	'title': false
	                });
					$("#becomeBig2").viewer({
	                	'toolbar': false,
	                	'title': false
	                });
					$("#becomeBig3").viewer({
	                	'toolbar': false,
	                	'title': false
	                });
				} else {					
					SelectOption.loadLicenceType("licencetype");
					var licenceAttach = data.licenceAttach;//许可证附件
	                var normalAttach = data.normalAttach;//规范化排污口照片附件
	                var signAttach = data.signAttach;//标志牌照片附件
	                var downloadurl = BASE_URL + 'epi/episewageattachment/download/';
	                showMultipleInputFile("licenceAttach", "licenceAttach", "image", licenceAttach, downloadurl, true);
	                showMultipleInputFile("normalAttach", "normalAttach", "image", normalAttach, downloadurl, true);
	                showMultipleInputFile("signAttach", "signAttach", "image", signAttach, downloadurl, true);
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
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}
	
	$.ajaxFileUpload({
		type : "post",
		url : BASE_URL + "epi/episewagelicence/save",
		files : arrId,
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
