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
	
	$("#lawsamplevoucherform").validate({
		rules: {
			//区域
			docarea:{
				required: true,
				maxlength:5
			},
			//年份
			docyear:{
				required: true,
				maxlength:4,
				isDigits:true
			},
			//编号
			docnum:{
				required: true,
				maxlength:8,
				stringCheck:true
			},
			//现场负责人
			charge:{
				required: true,
				maxlength:5
			},
			//单位地址
			companyaddress:{
				required: true,
				maxlength:42
			},
			//单位电话
			/*companytel:{
				required: true,
				maxlength:16,
				isTel:true
			},
			//邮编
			postcode:{
				required: true,
				isZipCode:true,
				maxlength:16
			},
			//抽检地址
			place:{
				required: true,
				maxlength:42
			},*/
			//被抽样取证单位现场负责人（签名）
			charges:{
				required: true,
				maxlength:5
			},
			//执法人员1,,2			
			lawofficersid1:{
				required: true
			},
						
			lawofficersid2:{
				required: true
			},
			createtime: {
				required: true
			}
		},
		messages: {
			docarea:{
				required: "文书区域不能为空",
				maxlength:"文书区域长度不能超过5"
			},
			docyear:{
				required: "文书年份不能为空",
				maxlength:"文书年份长度不能超过4",
				isDigits:"只能输入数字"
			},
			docnum:{
				required: "文书编号不能为空",
				stringCheck:"只能是字母数字下划线",
				maxlength:"文书编号长度不能超过8"
			},
			charge:{
				required: "现场负责人不能为空",
				maxlength:"现场负责人长度不能超过5"
			},
			companyaddress:{
				required: "单位地址不能为空",
				maxlength:"单位地址长度不能超过42"
			},
			/*companytel:{
				required: "联系电话不能为空",
				isTel:"联系电话错误",
				maxlength:"联系电话长度不能超过16"
			},
			postcode:{
				required: "邮编不能为空",
				isZipCode:"邮编错误",
				maxlength:"邮编长度不能超过16"
			},
			place:{
				required: "抽样地点不能为空",
				maxlength:"抽样地点长度不能超过42"
			},*/
			charges:{
				required: "现场负责人签名不能为空",
				maxlength:"现场负责人签名长度不能超过5"
			},
			lawofficersid1:{
				required: "执法人员1不能为空"
			},
			lawofficersid2:{
				required: "执法人员2不能为空"
			},
			createtime:{
				required: "创建时间不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});
/**
 * 返回
 */
$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});



/**
 * 替换页面元素
 */
function initializePage(){
	if($("#samplevoucherid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
	}
	
	$("#zfry1").html("<select id='lawofficersid1' name='lawofficersid1'  selectvalue='"+$("#lawofficersid1_hidden").val()+"' class='underline'  style='width: 230px;'></select>");
	
	$("#zfry2").html("<select id='lawofficersid2' name='lawofficersid2'  selectvalue='"+$("#lawofficersid2_hidden").val()+"' class='underline'  style='width: 230px;'></select>");
	
//	var starttime_hidden = $("#starttime_hidden").val();
//	var endtime_hidden = $("#endtime_hidden").val();
//	if(starttime_hidden)
//		$("#starttime").val(starttime_hidden);
//	if(endtime_hidden)
//		$("#endtime").val(endtime_hidden);
	
	//填表时间
//	$("#createTimeDiv").html("<input placeholder='   年   月  日' class='underline' readonly size='16' onclick='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' id='createtime' name='createtime' type='text' style='width:160px'/>");
	var updatetime = $("#updatetime").val();
	if(updatetime)
		$("#createtime").val(updatetime);
}

//证据表格添加一行
$("#voucherAdd").on("click",function(){
	insertTR();
});
/**
 * 添加一行
 */
function insertTR(){
	var lenth = $("#voucherTab").find("tr:last").find("td:first").text();
	var trcount = $("#voucherTab tr").length;
	var html = '<tr> '+
		'		<td class="unborder">'+(parseInt(lenth)+1)+'</td>  '+
		'		<td><input type="text" class="unborder" id="name'+trcount+'" name="name'+trcount+'"></td>  '+
		'		<td><input type="text" class="unborder" id="model'+trcount+'" name="model'+trcount+'"></td>  '+
		'		<td><input type="text" class="unborder" id="num'+trcount+'" name="num'+trcount+'"></td>  '+	 	  					
		'		<td><button type="button" class="unborder" onclick="insertTR()">新增</button>  '+
		'		    <button type="button" class="unborder" onclick="delTR(this)">删除</button></td>  '+
		'	</tr>';
	$("#voucherTab").append(html);
	$("#trcount").val(trcount);
}
/**
 * 删除一行
 */
function delTR(obj){
	$(obj).parent().parent().remove();
	var trcount = $("#voucherTab tr").length;
	if(trcount==1){
		html='<tr>'+
			 '	<td class="unborder">1</td>'+
			 '	<td><input type="text" class="unborder" id="name1" name="name1"></td>'+
			 '	<td><input type="text" class="unborder" id="model1" name="model1"></td>'+
			 '	<td><input type="text" class="unborder" id="num1" name="num1"></td>'+  					
			 '	<td>'+
			 '		<button type="button" class="unborder" onclick="insertTR()">新增</button>'+
			 '	</td>'+
			 '</tr>';
		$("#voucherTab").append(html);
		$("#trcount").val(trcount);
	}else{
		$("#trcount").val(parseInt(trcount)-1);
	}
}
/**
 * 抽样取证物品验证
 */
function validate(){
    var trcount = $("#trcount").val();
    for(var i=1;i<=trcount;i++){
        var name = $("#name"+i).val();//64
        var model = $("#model"+i).val();//512
        var num = $("#num"+i).val();//8
        if(name!="" && name.length>=21){
            parent.toast("名称字数大于21");
            return false;
        }
        if(model!="" && model.length>=170){
            parent.toast("规格及批号字数大于170");
            return false;
        }
        if(num!="" && isNaN(num)){
            parent.toast("数量不是数字");
            return false;
        }else if(num!="" && num.length>=8){
            parent.toast("数量长度不能超过8");
            return false;
        }
    }
    return true;
}

$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawsamplevoucherform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#samplevoucherid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_sample_voucher"
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

/** 保存 */
function save(){
    if(!validate()){
        return;
    }
    
    //为更新时间赋值
    $("#updatetime").val($("#createtime").val() + " 00:00:00");
    
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawsamplevoucher/save',
		cache : false,
		dataType : 'json',
		data : $("#lawsamplevoucherform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#samplevoucherid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
				parent.toast(json.msg);// 弹出提示信息
//				parent.getActiveIFrame().reloadGrid();// 刷新列表
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