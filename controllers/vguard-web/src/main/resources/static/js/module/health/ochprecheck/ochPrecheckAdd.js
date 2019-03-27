$(document).ready(function() {
    $("#ochprecheckform").validate({
        rules : {
            precheckdate : {
                required : true
            },
            precheckcon : {
                required : true
            },
            checkorg : {
                required : true
            }
        },
        messages : {
            precheckdate : {
                required : "上岗前检查日期不能为空"
            },
            precheckcon : {
                required : "上岗前检查结论不能为空"
            },
            checkorg : {
                required : "上岗前检查机构不能为空"
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
        url : BASE_URL + '/health/ochprecheck/save',
        cache : false,
        dataType : 'json',
        data : $("#ochprecheckform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
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