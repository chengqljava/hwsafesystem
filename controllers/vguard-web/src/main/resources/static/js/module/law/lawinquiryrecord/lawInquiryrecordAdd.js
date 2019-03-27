var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	initializePage();
	SelectOption.loadSex("sex");
	//执法人员1下拉框
	SelectOption.loadSysUser("lawofficersid1",{"jobtype": null,"usertype": "GOV"});
	//执法人员2下拉框
	SelectOption.loadSysUser("lawofficersid2",{"jobtype": null,"usertype": "GOV"});
	window.setTimeout(function(){
		$("#lawofficersNum1").val($("#lawofficersid1 option:selected").attr("attr"));
		$("#lawofficersNum2").val($("#lawofficersid2 option:selected").attr("attr"));
	},1000);
	$("#lawofficersid1").change(function(){
		$("#lawofficersNum1").val($("#lawofficersid1 option:selected").attr("attr"));
	});
	$("#lawofficersid2").change(function(){
		$("#lawofficersNum2").val($("#lawofficersid2 option:selected").attr("attr"));
	});
	
	$("#lawinquiryrecordform").validate({
		rules: {
			timestart:{
				required: true
			},
			timeend:{
				required: true
				
			},
			/*inquirycount:{
				required: true,
				isDigits:true,
				maxlength:4
			},
			place:{
				required: true,
				maxlength:50
			},
			name:{
				required: true,
				maxlength:4
			},
			sex:{
				required: true
			},
			age:{
				required: true,
				isDigits:true,
				maxlength:3
			},
			idcard:{
				required: true,
				isIdCardNo:true,
				maxlength:18
			},
			workunit:{
				required: true,
				maxlength:50
			},
			job:{
				required: true,
				maxlength:30
			},
			address:{
				required: true,
				maxlength:30
			},
			tel:{
				required: true,
				isTel:true,
				maxlength:16
			},
			witness:{
				required: true,
				maxlength:50
			},
			area:{
				required: true,
				maxlength:50
			},
			lawofficersid1:{
				required: true
			},
			lawofficersid2:{
				required: true
			},
			inquiryreason:{
				required: true,
				maxlength:130
			},
			inquirycontent:{
				required: true
			},
		    inquiryperson:{
				required: true,
				maxlength:5
			},
			inquirywork:{
				required: true,
				maxlength:50
			},
			recordperson:{
				required: true,
				maxlength:5
			},
			recordwork:{
				required: true,
				maxlength:50
			},
			inquirypersonname:{
				required: true,
				maxlength:5
			},
			recordpersonname:{
				required: true,
				maxlength:5
			},
			writename:{
				required: true,
				maxlength:4
			},*/
			createtime:{
				required: true
			}
		},
		messages: {
			timestart:{
				required: "询问时间起不能为空"
			},
			timeend:{
				required: "询问时间止不能为空"
			},
		/*	inquirycount:{
				required: "第几次询问不能为空",
				isDigits:"只能输入数字",
				maxlength:"第几次询问长度不能超过4"
			},
			place:{
				required: "询问地点不能为空",
				maxlength:"询问地点长度不能超过50"
			},
			name:{
				required: "被询问人姓名不能为空",
				maxlength:"被询问人姓名长度不能超过4"
			},
			sex:{
				required: "被询问人性别不能为空"
			},
			age:{
				required: "被询问人年龄不能为空",
				isDigits:"只能输入数字",
				maxlength:"年龄有误"
			},
			idcard:{
				required: "被询问人身份证号不能为空",
				isIdCardNo:"身份证格式错误",
				maxlength:"被询问人身份证号长度不能超过18"
			},
			workunit:{
				required: "被询问人工作单位不能为空",
				maxlength:"被询问人工作单位长度不能超过50"
			},
			job:{
				required: "被询问人职务不能为空",
				maxlength:"被询问人职务长度不能超过30"
			},
			address:{
				required: "被询问人住址不能为空",
				maxlength:"被询问人住址长度不能超过30"
			},
			tel:{
				required: "被询问人电话不能为空",
				isTel:"电话格式错误",
				maxlength:"被询问人电话长度不能超过16"
			},
			witness:{
				required: "在场人不能为空",
				maxlength:"在场人长度不能超过50"
			},
			area:{
				required: "区域不能为空",
				maxlength:"区域长度不能超过50"
			},
			lawofficersid1:{
				required: "执法人员1不能为空"
			},
			lawofficersid2:{
				required: "执法人员2不能为空"
			},
			inquiryreason:{
				required: "询问原因不能为空",
				maxlength:"询问原因长度不能超过130"
			},
			inquirycontent:{
				required: "询问记录不能为空"
			},
			inquiryperson:{
				required: "询问人不能为空",
				maxlength:"询问人长度不能超过5"
			},
			inquirywork:{
				required: "询问人单位及职务不能为空",
				maxlength:"询问人单位及职务长度不能超过50"
			},
			recordperson:{
				required: "记录人不能为空",
				maxlength:"记录人长度不能超过5"
			},
			recordwork:{
				required: "记录人单位及职务不能为空",
				maxlength:"记录人单位及职务长度不能超过50"
			},
			inquirypersonname:{
				required: "询问人签名不能为空",
				maxlength:"询问人签名长度不能超过5"
			},
			recordpersonname:{
				required: "记录人签名不能为空",
				maxlength:"记录人签名长度不能超过5"
			},
			writename:{
				required: "被询问人签名不能为空",
				maxlength:"被询问人签名长度不能超过4"
			},*/
			createtime:{
				required: "记录日期不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});

$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawinquiryrecordform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#inquiryrecordid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_inquiryrecord"
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

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawinquiryrecord/save',
		cache : false,
		dataType : 'json',
		data : $("#lawinquiryrecordform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#inquiryrecordid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#inquiryrecordid").val(json.docid);
					}
					
					parent.toast(json.msg);//弹出提示信息
					parent.getActiveIFrame().reloadGrid();//刷新列表
					parent.closeWin();// 关闭弹出框
				}
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}




/**
 * 替换页面元素
 */
function initializePage(){
	var timestart_hidden = $("#timestart_hidden").val();
	var timeend_hidden = $("#timeend_hidden").val();
	if(timestart_hidden)
		$("#timestart").val(timestart_hidden);
	if(timeend_hidden)
		$("#timeend").val(timeend_hidden);
	
	var sex_hidden = $("#sex_hidden").val();
	$("#sex").val(sex_hidden);
	
	//替换页面元素
	$("#lawofficersid1div1").html("<select id='lawofficersid1' name='lawofficersid1' selectvalue='"+$("#lawofficersid1_hidden").val()+"' class='underline'  style='width: 140px;'></select>");
	$("#lawofficersid1div2").html("<select id='lawofficersid2' name='lawofficersid2' selectvalue='"+$("#lawofficersid2_hidden").val()+"' class='underline'  style='width: 140px;'></select>");
	//填表时间
	$("#createTimeDiv").html("<input placeholder='   年   月  日' class='underline' readonly size='16' onclick='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' id='createtime' name='createtime' type='text' style='width:160px'/>");
	var createtime_hidden = $("#createtime_hidden").val();
	if(createtime_hidden)
		$("#createtime").val(createtime_hidden);
}