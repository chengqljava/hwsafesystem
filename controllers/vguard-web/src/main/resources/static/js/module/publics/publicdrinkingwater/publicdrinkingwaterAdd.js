/**
 * 新增编辑
 */
$(function() {
	var drinkingid = getQueryString("drinkingid");
	$("#drinkingwaterForm").validate({
		rules : {
			drinkname:{
				required : true
			},
			drinkcode:{
				required : true
			},
			supplydept:{
				required : true
			},
			pipemethod:{
				required : true
			},
			sourcewater : {
				required : true
			},
			pipenetwork : {
				required : true
			},
			pipepressure: {
				required: true,
				mRessureCheck: true
			}
		},
		messages : {
			drinkname:{
				required : "管道名称不能为空"
			},
			drinkcode:{
				required : "管道编号不能为空"
			},
			supplydept:{
				required : "供水部门不能为空"
			},
			pipemethod:{
				required : "管网敷设方式不能空"
			},
			sourcewater : {
				required : "水源不能为空"
			},
			pipenetwork : {
				required : "管网布置方式不能为空"
			},
			pipepressure: {
				required: "管网压力不能为空",
				mRessureCheck: "只能输入一位整数,小数后精确二位"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicdrinkingwater/load",
		dataType : "json",
		data : {
			"drinkingid":drinkingid
		},
		success : function(data) {
			if (data) {
				var drinkingwaterTpt = _.template($("#drinkingwaterTpt").html());
				$("#drinkingwaterForm").html(drinkingwaterTpt(data));
				$("#maptab").val(data.maptab);
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
    var formData = $("#drinkingwaterForm").serializeArray();
    if($("#isFlag").val() != "0"){
    	var lines = JSON.stringify($("#maptab").val()).replace(/\"/g, "'")
    	var maptab = lines.substring(1,lines.length-1);
    	var maptabs = {name: 'maptab', value: maptab};//新建检查项
    	formData.push(maptabs);
    }
	$.ajaxFileUpload({
		type : "post",
		url : BASE_URL + "publics/publicdrinkingwater/save",
		files : arrId,
		cache : false,
		dataType : 'json',
		data : formData,
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

function checkMap(){
	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
		$('#maptab').val(param.lineArray);
		$("#isFlag").val("1");
		$("#mapTag").empty();
		$("#mapTag").append('<a href="javascript:void(0);" onclick="checkMap()">已标注</a>');
	});
	parent.parent.openWin(BASE_URL + "/views/module/publics/common/mapTag.html?isDisplay=false",
			 "地理标注", "50%", "50%");
}
