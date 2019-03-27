var isDocSubmit=false;
var isSaved=false;


$(document).ready(function() {
	initializePage();
	//执法人员1下拉框
	SelectOption.loadSysUser("lawofficersid1",{"jobtype": null,"usertype": "GOV"});
	//执法人员2下拉框
	SelectOption.loadSysUser("lawofficersid2",{"jobtype": null,"usertype": "GOV"});
	window.setTimeout(function(){
		$("#zfry1IdCard").val($("#lawofficersid1 option:selected").attr("attr"));
		$("#zfry2IdCard").val($("#lawofficersid2 option:selected").attr("attr"));
	},1000);
	$("#lawofficersid1").change(function(){
		$("#zfry1IdCard").val($("#lawofficersid1 option:selected").attr("attr"));
	});
	$("#lawofficersid2").change(function(){
		$("#zfry2IdCard").val($("#lawofficersid2 option:selected").attr("attr"));
	});
	
	$("#lawinquestrecordform").validate({
		rules : {
			docarea : {
				required : true,
				maxlength : 2
			},
			docyear : {
				required : true,
				isDigits:true,
				maxlength : 4
			},
			docnum : {
				required : true,
				stringCheck:true,
				maxlength : 8
			},
			starttime : {
				required : true
			},
			endtime : {
				required : true
			},
			/*place : {
				required : true,
				maxlength : 21
			},
			weather : {
				required : true,
				maxlength : 10
			},*/
			//勘验人1
			inquestperson1 : {
				required : true,
				maxlength : 5
			},
			/*
			inquestpersonjob1 : {
				required : true,
				maxlength : 21
			},
			
			inquestperson2 : {
				required : true,
				maxlength : 5
			},
			inquestpersonjob2 : {
				required : true,
				maxlength : 21
			},*/
			//当事人1
			clientperson1 : {
				required : true,
				maxlength : 5
			},
			/*
			clientpersonjob1 : {
				required : true,
				maxlength : 21
			},
			clientperson2 : {
				required : true,
				maxlength : 5
			},
			clientpersonjob2 : {
				required : true,
				maxlength : 21
			},*/
			//被邀请人
			invitee : {
				required : true,
				maxlength : 5
			},
			/*
			inviteejob : {
				required : true,
				maxlength : 21
			},*/
			//记录人
			recordperson : {
				required : true,
				maxlength : 5
			},
			/*
			recordpersonjob : {
				required : true,
				maxlength : 21
			},
			safearea : {
				required : true,
				maxlength : 42
			},*/
			//下拉框执法人员
			lawofficersid1 : {
				required : true
			},
			lawofficersid2 : {
				required : true
			},
			//记录
			inquestcontent : {
				required : true
			},
			//勘察人1签名
			inquestpersons1 : {
				required : true,
				maxlength : 5
			},
			/*
			inquestpersons2 : {
				required : true,
				maxlength : 5
			},*/
			//当事人1以及电话
			clientpersons1 : {
				required : true,
				maxlength : 5
			},
			
			clientpersontel1 : {
				required : true,
				isTel:true,
				maxlength : 16
			},
			/*
			clientpersontel2 : {
				required : true,
				isTel:true,
				maxlength : 16
			},
			clientpersons2 : {
				required : true,
				maxlength : 5
			},
			clientpersonstel : {
				required : true,
				isTel:true,
				maxlength : 16
			},*/
			//邀请人签名
			invitees : {
				required : true,
				maxlength : 5
			},
			recordpersonname : {
				required : true,
				maxlength : 16
			}
		},
		messages : {
			docarea:{
				required: "文书区域不能为空",
				maxlength:"文书区域长度不能超过5"
			},
			docyear:{
				required: "文书年份不能为空",
				isDigits:"只能输入数字",
				maxlength:"文书年份长度不能超过4"
			},
			docnum:{
				required: "文书编号不能为空",
				stringCheck:"只能是字母数字下划线",
				maxlength:"文书编号长度不能超过8"
			},
			starttime:{
				required: "勘验时间起不能为空"
			},
			endtime:{
				required: "勘验时间止不能为空"
			},
			/*place:{
				required: "勘验场所不能为空",
				maxlength:"勘验场所长度不能超过21"
			},
			weather:{
				required: "天气情况不能为空",
				maxlength:"天气情况长度不能超过10"
			},*/
			inquestperson1:{
				required: "勘验人1不能为空",
				maxlength:"勘验人1长度不能超过5"
			},
			/*
			inquestpersonjob1:{
				required: "勘验人1单位及职务1不能为空",
				maxlength:"勘验人1单位及职务1长度不能超过21"
			},
			/*
			inquestperson2:{
				required: "勘验人2不能为空",
				maxlength:"勘验人2长度不能超过5"
			},
			inquestpersonjob2:{
				required: "勘验人2单位及职务不能为空",
				maxlength:"勘验人2单位及职务长度不能超过21"
			},*/
			clientperson1:{
				required: "当事人1不能为空",
				maxlength:"当事人1长度不能超过5"
			},
			/*
			clientpersonjob1:{
				required: "当事人1单位及职务不能为空",
				maxlength:"当事人1单位及职务长度不能超过21"
			},
			clientperson2:{
				required: "当事人2不能为空",
				maxlength:"当事人2长度不能超过5"
			},
			clientpersonjob2:{
				required: "当事人2单位及职务不能为空",
				maxlength:"当事人2单位及职务长度不能超过21"
			},*/
			invitee:{
				required: "被邀请人不能为空",
				maxlength:"被邀请人长度不能超过5"
			},
			/*
			inviteejob:{
				required: "被邀请人单位及职务不能为空",
				maxlength:"被邀请人单位及职务长度不能超过21"
			},*/
			recordperson:{
				required: "记录人不能为空",
				maxlength:"记录人长度不能超过5"
			},/*
			recordpersonjob:{
				required: "记录人单位及职务不能为空",
				maxlength:"记录人单位及职务长度不能超过21"
			},
			safearea:{
				required: "区域不能为空",
				maxlength:"区域长度不能超过42"
			},*/
			lawofficersid1:{
				required: "执法人员1不能为空"
			},
			lawofficersid2:{
				required: "执法人员2不能为空"
			}
			
			,
			inquestpersons1:{
				required: "勘验人签名1不能为空",
				maxlength:"勘验人签名1长度不能超过5"
			},/*
			inquestpersons2:{
				required: "勘验人签名2不能为空",
				maxlength:"勘验人签名2长度不能超过5"
			},*/
			clientpersons1:{
				required: "当事人签名1不能为空",
				maxlength:"当事人签名1长度不能超过5"
			},
			clientpersontel1:{
				required: "当事人1联系方式不能为空",
				isTel:"联系方式错误",
				maxlength:"当事人1联系方式长度不能超过16"
			},/*
			clientpersontel2:{
				required: "当事人2联系方式不能为空",
				isTel:"联系方式错误",
				maxlength:"当事人2联系方式长度不能超过16"
			},
			clientpersons2:{
				required: "当事人签名2不能为空",
				maxlength:"当事人签名2长度不能超过5"
			},
			clientpersonstel:{
				required: "当事人2联系方式不能为空",
				isTel:"联系方式错误",
				maxlength:"当事人2联系方式长度不能超过16"
			},*/
			inquestcontent:{
				required: "勘验情况不能为空"
			},
			invitees:{
				required: "被邀请人签名不能为空",
				maxlength:"被邀请人签名长度不能超过5"
			},
			recordpersonname:{
				required: "记录人不能为空",
				maxlength:"记录人长度不能超过16"
			}
		},
		submitHandler : function(form) {
			save();
		}
	});
});

$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});



/**
 * 替换页面元素
 */
function initializePage(){
	if($("#inquestid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
	}
	$("#zfry1").html("<select id='lawofficersid1' name='lawofficersid1'  selectvalue='"+$("#lawofficersid1_hidden").val()+"' class='underline'  style='width: 110px;'></select>");
	
	$("#zfry2").html("<select id='lawofficersid2' name='lawofficersid2'  selectvalue='"+$("#lawofficersid2_hidden").val()+"' class='underline'  style='width: 110px;'></select>");
	
	var starttime_hidden = $("#starttime_hidden").val();
	var endtime_hidden = $("#endtime_hidden").val();
	if(starttime_hidden)
		$("#starttime").val(starttime_hidden);
	if(endtime_hidden)
		$("#endtime").val(endtime_hidden);
}


/** 保存 */
function save() {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/law/lawinquestrecord/save',
		cache : false,
		dataType : 'json',
		data : $("#lawinquestrecordform").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#inquestid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
				parent.toast(json.msg);// 弹出提示信息
				parent.getActiveIFrame().reloadGrid();// 刷新列表
				parent.closeWin();// 关闭弹出框
				}
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawinquestrecordform").submit();
	}
});
function updateDocState(){
	  $.ajax({
	        type: 'post',
	        url: BASE_URL + '/law/lawdocstate/updateDocState',
	        cache: false,
	        dataType: 'json',
	        data: {
	            "docid": $("#inquestid").val(),
	            "checkinfoid": $("#checkinfoid").val(),
	            "doctype": "law_inquest_record"
	        },
	        global: false,
	        async: true,
	        success: function (json) {
				if(json.success==true){
					parent.toast(json.msg);//弹出提示信息
					$("#reportBtn").hide();
					$("#saveBtn").hide();
					
			        $("#printBtn").show();
			        $("#backBtn").show();
				}else{
					parent.toast(json.msg);
				}
	        },
	        error: function () {
	          parent.parent.toast("网络异常");
	        }
	    });
}