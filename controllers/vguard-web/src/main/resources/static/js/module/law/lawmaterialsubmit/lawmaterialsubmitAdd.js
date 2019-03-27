$(document).ready(function() {
    
    initializePage();
    $("#lawmaterialsubmitform").validate({
        rules: {
        	noticeno:{
        		required: true,
                maxlength : 7,
                isDigits:true
        	},
        	entname:{
                required: true,
                maxlength : 50
            },
            content:{
                required: true,
                maxlength:100
            },
            material14:{
            	maxlength:50
            },
            material15:{
            	maxlength:50
            },
            address:{
            	maxlength:50
            },
            contacts:{
            	maxlength:10
            },
            signatory:{
            	maxlength:10
            },
            phone:{
            	isPhone:true
            }
        },
        messages: {
        	noticeno:{
                required: "文书编号不能为空",
                maxlength:"长度不能超过7",
                isDigits:"只能输入数字"
            },
        	entname:{
                required: "企业名称不能为空",
                maxlength:"不能超过50个字"
            },
            content:{
                required: "调查内容不能为空",
                maxlength:"长度不能超过100"
            },
            material14:{
                maxlength:"长度不能超过50"
            },
            material15:{
                maxlength:"长度不能超过50"
            },
            address:{
            	maxlength:"长度不能超过50"
            },
            contacts:{
            	maxlength:"长度不能超过10"
            },
            signatory:{
            	maxlength:"长度不能超过10"
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

/**保存*/
function save(){

	/*			
	$("input[type='checkbox']").each(function(){
		if($(this).attr("checked")=="checked"){
			$(this).val("1");
		}
		alert($(this).val());
		
	});
	
    alert($("#material1").attr("checked"));
	
    var hiddens = $("input[type='checkbox'][name='material']");
	 $.each(hiddens,function (){
		 if($(this).attr("checked")=="checked"){
				$(this).val("1");
				alert($(this).val());
		 }
	 });
	 */

    
    $.ajax({
        type : 'post',
        url : BASE_URL+'/law/lawmaterialsubmit/save',
        cache : false,
        dataType : 'json',
        data : $("#lawmaterialsubmitform").serializeArray(),
        global : false,
        success : function(json) {
            if(json.success==true){
                parent.toast(json.msg);//弹出提示信息
                var menupagetype = $('#menupagetype').val();
                var checkinfoid = $('#checkinfoid').val();
                var checkrecordid = $('#checkrecordid').val();
                var doccode = $('#doccode').val();
                var doctype = $('#doctype').val();
                //var index = parent.getParentIndex();
				//parent.frames["layui-layer-iframe"+index].attr("src",BASE_URL+"/law/lawmaterialsubmit/"+menupagetype+"/"+checkinfoid+"/"+checkrecordid+"/"+doccode+"/"+doctype);
				parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawmaterialsubmit/"+menupagetype+"/"+checkinfoid+"/"+checkrecordid+"/"+doccode+"/"+doctype);

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

/**
 * 替换页面元素
 */
function initializePage(){
	//给替换的元素赋值
//	$("#issuingdateDiv").html("<input placeholder='   年   月  日' class='underline' size='16' onclick='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' id='issuingdate' name='issuingdate' type='text' style='width:160px' readonly >");
    
    //日期回显
    var signdate_hidden = $("#signdate_hidden").val();
    if(signdate_hidden)
    	$("#signdate").val(signdate_hidden);
    
    var issuingdate_hidden = $("#issuingdate_hidden").val();
    if(issuingdate_hidden)
    	$("#issuingdate").val(formatCSTDate(issuingdate_hidden,"yyyy-MM-dd"));
    
    var deadline_hidden = $("#deadline_hidden").val();
    if(deadline_hidden)
    	$("#deadline").val(formatCSTDate(deadline_hidden,"yyyy-MM-dd"));
    
}

function checkmaterial(material,materialcheckbox){
	if($("#"+material).val() != ""){
		$("#"+materialcheckbox).attr("checked", true);
	}else{
		$("#"+materialcheckbox).attr("checked", false);
	}
}