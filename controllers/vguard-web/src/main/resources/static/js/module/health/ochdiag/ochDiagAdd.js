$(document).ready(function() {
    $("#ochdiagform").validate({
        rules : {
            diagdate : {
                required : true
            },
            jobilltype : {
                required : true
            },
            diagorg : {
                required : true
            }
        },
        messages : {
            diagdate : {
                required : "诊断日期不能为空"
            },
            jobilltype : {
                required : "职业病种类不能为空"
            },
            diagorg : {
                required : "诊断机构不能为空"
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
        url : BASE_URL + '/health/ochdiag/save',
        cache : false,
        dataType : 'json',
        data : $("#ochdiagform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                //弹出提示信息
                var index = parent.getParentIndex();
                window.top.frames["layui-layer-iframe"+index].frames["chemIframe"].reloadGrid();//刷新列表
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