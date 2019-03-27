$(document).ready(function() {
    $("#emsplaresponseform").validate({
        rules : {
            responsename : {
                required : true
            },
            ordernum : {
                required : true,
                isIntGtZero:true
            },
            standard : {
                required : true
            },
            responsemsg : {
                required : true
            }
        },
        messages : {
            responsename : {
                required : "分级响应名称不能为空"
            },
            ordernum : {
                required : "排列序号不能为空",
                isIntGtZero:"请输入大于0的整数"
            },
            standard : {
                required : "分级标准不能为空"
            },
            responsemsg : {
                required : "应急响应信息不能为空"
            }
        },
        submitHandler : function(form) {
            save();
        }
    });
});

/**保存*/
function save() {
    $.ajax({
        type : 'post',
        url : BASE_URL + '/ems/emsplaresponse/save',
        cache : false,
        dataType : 'json',
        data : $("#emsplaresponseform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                //弹出提示信息
                var frameLen = parent.parent.frames.length;
                parent.parent.frames[frameLen - 1].frames["chemIframe"].reloadGrid();
                //刷新列表
                parent.closeWin();
                // 关闭弹出框
            } else {
                parent.toast(json.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });
}