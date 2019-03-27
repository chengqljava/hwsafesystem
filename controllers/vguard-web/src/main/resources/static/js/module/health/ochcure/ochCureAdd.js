$(document).ready(function() {
    SelectOption.loadCureType("curetype");//防治类型
    $("#ochcureform").validate({
        rules : {
            curetitle : {
                required : true
            },
            curetype : {
                required : true
            },
            content : {
                required : true
            }
        },
        messages : {
            curetitle : {
                required : "标题不能为空"
            },
            curetype : {
                required : "防治表类型不能为空"
            },
            content : {
                required : "内容不能为空"
            }
        },
        submitHandler : function(form) {
            save();
        }
    });
    autoHeight();
});

/**保存*/
function save() {
    $.ajax({
        type : 'post',
        url : BASE_URL + '/health/ochcure/save',
        cache : false,
        dataType : 'json',
        data : $("#ochcureform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                parent.getActiveIFrame().reloadGrid();//刷新列表
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