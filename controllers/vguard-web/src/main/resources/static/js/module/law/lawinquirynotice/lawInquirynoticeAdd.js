$(document).ready(function() {
    
    initializePage();
    $("#lawinquirynoticeform").validate({
        rules: {
            docarea:{
                required: true,
                maxlength:4
            },
            docyear:{
                required: true,
                maxlength:4,
                isDigits:true
            },
            docnum:{
                required: true,
                maxlength:8,
                stringCheck:true
            },
            reason:{
                required: true,
                maxlength:100
            },
            inquirytime:{
                required: true
            },
            address:{
                required: true,
                maxlength:50
            },
            otherdoc:{
                maxlength:100
            },
            safetyaddr:{
                required: true,
                maxlength:50
            },
            safetyperson:{
                required: true,
                maxlength:4
            },
            safetytel:{
                required: true,
                maxlength:16,
                isTel:true
            },
            createtime:{
                required: true
            },
        },
        messages: {
            docarea:{
                required: "文书区域不能为空",
                maxlength:"不能超过4个字"
            },
            docyear:{
                required: "文书年份不能为空",
                maxlength:"长度不能超过4",
                isDigits:"只能输入数字"
            },
            docnum:{
                required: "文书编号不能为空",
                stringCheck:"只能是字母数字下划线",
                maxlength:"长度不能超过4"
            },
            reason:{
                required: "原因不能为空",
                maxlength:"原因长度不能超过100"
            },
            inquirytime:{
                required: "询问时间不能为空"
            },
            address:{
                required: "询问地点不能为空",
                maxlength:"询问地点长度不能超过100"
            },
            otherdoc:{
                maxlength:"其他材料长度不能超过100"
            },
            safetyaddr:{
                required: "安全生产监督管理部门地址不能为空",
                maxlength:"安全生产监督管理部门地址长度不能超过50"
            },
            safetyperson:{
                required: "联系人不能为空",
                maxlength:"联系人长度不能超过4"
            },
            safetytel:{
                required: "联系电话不能为空",
                isTel:"联系电话错误"
            },
            createtime:{
                required: "填表时间不能为空"
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
    $.ajax({
        type : 'post',
        url : BASE_URL+'/law/lawinquirynotice/save',
        cache : false,
        dataType : 'json',
        data : $("#lawinquirynoticeform").serializeArray(),
        global : false,
        success : function(json) {
            if(json.success==true){
            	parent.parent.toast(json.msg);//弹出提示信息
            	//重新加载文书页面
            	parent.$("#contentIframe").attr("src",BASE_URL +"/law/lawinquirynotice/edit/"+$("#menupagetype").val()+"/"+$("#checkinfoid").val()+"/"+$("#doccode").val()+"/"+$("#doctype").val());
                parent.parent.getActiveIFrame().reloadGrid();
                //parent.parent.closeWin();
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
    if($("#inquestid").val() == ""){
        $("#docyear").val(new Date().getFullYear());
    }
    
    //勾选框回显
    var idcarddoc_hidden = $("#idcarddoc_hidden").val();
    var licencedoc_hidden = $("#licencedoc_hidden").val();
    var legaldoc_hidden = $("#legaldoc_hidden").val();
    
    if(idcarddoc_hidden){//等于1执行
        $("#idcarddoc").attr("checked",true);
    }
    if(licencedoc_hidden){//等于1执行
        $("#licencedoc").attr("checked",true);
    }
    if(legaldoc_hidden){//等于1执行
        $("#legaldoc").attr("checked",true);
    }
    //其他材料勾选框回显
    var otherdoc = $("#otherdoc").val();
    if(otherdoc!=undefined && otherdoc!=""){
        $("#otherCheckBoxId").attr("checked",true);
    }
    
    //询问时间
    $("#inquirytimediv").html(
            "<input class='underline' readonly type='text' id='inquirytime' name='inquirytime' onclick='WdatePicker({dateFmt:\"yyyy-MM-dd HH:mm:ss\"})' placeholder='   年   月  日 时 分 秒' style='width:200px'/>");
    //给替换的元素赋值
    $("#indateDiv").html("<input placeholder='   年   月  日' class='underline' readonly size='16' onclick='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' id='createtime' name='createtime' type='text' style='width:160px'/>");
    
    var inquirytime_hidden = $("#inquirytime_hidden").val();
    if(inquirytime_hidden)
        $("#inquirytime").val(inquirytime_hidden);
    
    var createtime_hidden = $("#createtime_hidden").val();
    if(createtime_hidden)
    $("#createtime").val(formatCSTDate(createtime_hidden,"yyyy-MM-dd"));
    
}