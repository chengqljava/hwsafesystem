$(document).ready(function() {
    $("#ochcurcheckform").validate({
        rules : {
            curcheckdate : {
                required : true
            },
            curcheckcon : {
                required : true
            },
            curcheckorg : {
                required : true
            },
            revcheck : {
                required : true
            },
            revcheckcon : {
                required : true
            },
            revcheckorg : {
                required : true
            }
        },
        messages : {
            curcheckdate : {
                required : "检查日期不能为空"
            },
            curcheckcon : {
                required : "检查结论不能为空"
            },
            curcheckorg : {
                required : "检查机构不能为空"
            },
            revcheck : {
                required : "复查项目不能为空"
            },
            revcheckcon : {
                required : "复查结论不能为空"
            },
            revcheckorg : {
                required : "复查机构不能为空"
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
        url : BASE_URL + '/health/ochcurcheck/save',
        cache : false,
        dataType : 'json',
        data : $("#ochcurcheckform").serializeArray(),
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