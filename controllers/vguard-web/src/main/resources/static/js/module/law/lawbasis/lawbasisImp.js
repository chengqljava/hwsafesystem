$(document).ready(function() {
    showUploadFile('myfile','xls');//显示文件上传控件
    
    $('#importform').validate({
        rules: {
            filemyfile: {
                required: true,
            }
        },
        messages: {
            filemyfile: {
                required: '上传文件不能为空',
            }
        },
        submitHandler:function(){
            orgimport();
        },
        errorPlacement: function (error, element) { //指定错误信息位置
            $("#myfile").children("span").remove();
            $("#myfile").append(error);
         }
    });
});

function orgimport(){
    $.ajaxFileUpload({
        url : BASE_URL+'/law/lawbasis/saveImportExcel',
        secureuri:false,
        files : $("input[name='filemyfile']"),
        data : $("#importform").serializeArray(),
        dataType : 'json',
        success : function(json) {
            if(json.success==true){
                parent.toast(json.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            }else{
                $('#myfile').empty();
                showUploadFile('myfile','xls');//显示文件上传控件
                var errormsg = "<span style='color:red'>"+json.msg+"</span>";
                $("#myfile").append(errormsg);
            }
        },
        error : function() {
            parent.toast("上传失败");
        }
    });
}

function returnTemplate(){
    $("#templateform").attr("action",BASE_URL+"/law/lawbasis/template");
    $("#templateform").submit();
}
