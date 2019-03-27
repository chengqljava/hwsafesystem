$(document).ready(function() {
    $("#ochaftercheckform").validate({
        rules : {
            aftercheckdate : {
                required : true
            },
            aftercheckcon : {
                required : true
            },
            aftercheckorg : {
                required : true
            }
        },
        messages : {
            aftercheckdate : {
                required : "离岗时检查日期不能为空"
            },
            aftercheckcon : {
                required : "离岗时检查结论不能为空"
            },
            aftercheckorg : {
                required : "离岗时检查机构不能为空"
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
        url : BASE_URL + '/health/ochaftercheck/save',
        cache : false,
        dataType : 'json',
        data : $("#ochaftercheckform").serializeArray(),
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