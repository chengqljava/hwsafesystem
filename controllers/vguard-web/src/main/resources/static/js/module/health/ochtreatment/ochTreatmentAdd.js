$(document).ready(function() {
    $("#ochtreatmentform").validate({
        rules : {
            treatmentdate : {
                required : true
            },
            illness : {
                required : true
            },
            prescription : {
                required : true
            },
            hospital : {
                required : true
            },
            doctor : {
                required : true
            }
        },
        messages : {
            treatmentdate : {
                required : "治疗日期不能为空"
            },
            illness : {
                required : "病情不能为空"
            },
            prescription : {
                required : "处方不能为空"
            },
            hospital : {
                required : "治疗机构不能为空"
            },
            doctor : {
                required : "主治医师不能为空"
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
        url : BASE_URL + '/health/ochtreatment/save',
        cache : false,
        dataType : 'json',
        data : $("#ochtreatmentform").serializeArray(),
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