$(document).ready(function() {
    $("#ochcureform").validate({
        rules : {
        	devicename : {
                required : true
            },
            model : {
                required : true
            },
            specifications : {
                required : true
            },
            num : {
                required : true
            },
            purchase : {
                required : true
            }
        },
        messages : {
        	devicename : {
                required : "设备名称不能为空"
            },
            model : {
                required : "型号不能为空"
            },
            specifications : {
                required : "规格不能为空"
            },
            num : {
                required : "数量不能为空"
            },
            purchase : {
                required : "进购日期不能为空"
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
        url : BASE_URL + '/health/ochequipment/save',
        cache : false,
        dataType : 'json',
        data : $("#ochcureform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                var index = parent.getParentIndex();
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